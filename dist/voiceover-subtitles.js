/*
//!CONFIG container-style (json) { "bottom": "0", "textAlign": "center", "fontSize": "14px", "color": "white", "backgroundColor": "rgba(0, 0, 0, 0.6)", "borderRadius": "4px", "margin": "10%", "selfAlign": "center" }
//!CONFIG subtitle-style (json) { "padding": "5px" }
*/
//! CODE_EDITOR
const PLUGIN_NAME = "voiceover-subtitles";
function setupEditorPlugin() {
    // Prevent repeating this setup
    EDITOR.loadedEditorPlugins ?? (EDITOR.loadedEditorPlugins = new Set());
    EDITOR.loadedEditorPlugins.add(PLUGIN_NAME);
    const styleEl = document.createElement("style");
    document.head.append(styleEl);
    styleEl.innerHTML = ``;
}
if (EDITOR && !EDITOR.loadedEditorPlugins?.has(PLUGIN_NAME)) {
    setupEditorPlugin();
}
//! CODE_PLAYBACK
let subtitlesContainer;
wrap.after(window, "start", () => {
    subtitlesContainer = document.createElement("div");
    subtitlesContainer.id = "subtitles";
    // If using background plugin, insert in its container, otherwise, in the body
    const backgroundContainer = document.getElementById("background-container");
    (backgroundContainer ?? document.body).append(subtitlesContainer);
    Object.assign(subtitlesContainer.style, { position: "absolute" }, FIELD(CONFIG, "container-style", "json"));
});
SCRIPTING_FUNCTIONS.PLAY_VO_SUB = async function (field, event = this.EVENT) {
    const soundId = FIELD(event, field, "file");
    const duration = await getSoundDuration(soundId);
    const subTexts = (FIELDS(event, field, "text") ??
        FIELDS(event, field, "dialogue"));
    const configStyle = FIELD(CONFIG, "subtitle-style", "json");
    const subs = subTexts.map((t) => {
        const subEl = document.createElement("div");
        subEl.className = "subtitle";
        subEl.innerHTML = t.replace(/\n/g, "<br/>");
        Object.assign(subEl.style, configStyle);
        return {
            el: subEl,
            length: t.replace(/[\W]/g, "").length,
        };
    });
    const totalLength = subs.reduce((total, sub) => total + sub.length, 0);
    // Assume the audio will start immediately so we can already program the texts
    let delay = 0;
    for (const sub of subs) {
        setTimeout(() => {
            // Show the sub
            subtitlesContainer.append(sub.el);
        }, delay * 1000);
        const subDuration = duration * (sub.length / totalLength);
        delay += subDuration;
        setTimeout(() => {
            // Hide the sub
            sub.el.remove();
        }, delay * 1000);
    }
    // Return a promise that will be resolved when the sound is finished and the sub is removed.
    return new Promise((resolve) => {
        const toRemove = this.ADD_ON_SOUND_END(() => {
            // Immediately unregister, so we are only called once.
            this.REMOVE_ON_SOUND_END(toRemove);
            resolve();
        }, "voiceover");
        // Now that the event handler is setup, play the sound
        this.PLAY_SOUND(soundId, "voiceover");
    });
};
function getSoundDuration(soundId) {
    return new Promise((resolve) => {
        const a = new Audio();
        a.addEventListener("loadedmetadata", () => {
            resolve(a.duration);
        });
        a.src = PLAYBACK.getFileObjectURL(soundId);
    });
}
class Queue {
    constructor() {
        this.running = false;
        this.fns = [];
    }
    push(fn) {
        this.fns.push(fn);
        this.process();
    }
    process() {
        if (this.running)
            return;
        const fn = this.fns.shift();
        if (!fn)
            return;
        this.running = true;
        fn().then(() => {
            this.running = false;
            // loop
            if (this.fns.length > 0)
                this.process();
        });
    }
}
const voSubQueue = new Queue();
SCRIPTING_FUNCTIONS.QUEUE_VO_SUB = function (field, event = this.EVENT) {
    return new Promise((resolve) => {
        voSubQueue.push(async () => {
            await this.PLAY_VO_SUB(field, event);
            resolve();
        });
    });
};
/*

  // @ts-ignore
  PLAYBACK.paragraphHandlers.push(function (p, tags) {
    console.log(p, tags);
  });
  */
