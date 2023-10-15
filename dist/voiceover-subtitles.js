//! CODE_EDITOR
const PLUGIN_NAME = "voiceover-subtitles";
function setupEditorPlugin() {
    // Prevent repeating this setup
    EDITOR.loadedEditorPlugins ?? (EDITOR.loadedEditorPlugins = new Set());
    EDITOR.loadedEditorPlugins.add(PLUGIN_NAME);
    const styleEl = document.createElement("style");
    document.head.append(styleEl);
    styleEl.innerHTML = `
    #play-tab-view .viewport-body {
      height: 800px;
    }`;
}
if (EDITOR && !EDITOR.loadedEditorPlugins?.has(PLUGIN_NAME)) {
    setupEditorPlugin();
}
//! CODE_PLAYBACK
const isInsideEditor = window.self.location.protocol === "blob:";
const styleEl = document.createElement("style");
document.head.append(styleEl);
styleEl.innerHTML = `
  #player {
    /* transform: translate(-50%) scale(1.5) !important; */
    /* transform-origin: top center; */
    /* top: 0; */
    overflow: visible;
  }
  #subtitles {
    color: white;
    text-align: center;
  }
`;
if (isInsideEditor) {
    // Show subtitles over the canvas
    styleEl.innerHTML += `
    #subtitles {
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 0;
      width: 100%;
    }
    #subtitles > * {
      padding: 10px;
    }
  `;
}
let subtitlesContainer;
wrap.after(window, "start", () => {
    subtitlesContainer = document.createElement("div");
    subtitlesContainer.id = "subtitles";
    ONE("#player").append(subtitlesContainer);
});
SCRIPTING_FUNCTIONS.PLAY_VO_SUB = function (field, event = this.EVENT) {
    const soundFile = FIELD(event, field, "file");
    const subText = (FIELD(event, field, "text") ??
        FIELD(event, field, "dialogue"));
    const subEl = document.createElement("div");
    subEl.className = "subtitle";
    subEl.innerHTML = subText.replace(/\n/g, "<br/>");
    // Show the sub
    subtitlesContainer.append(subEl);
    // Return a promise that will be resolved when the sound is finished and the sub is removed.
    return new Promise((resolve) => {
        const toRemove = this.ADD_ON_SOUND_END(() => {
            // Immediately unregister, so we are only called once.
            this.REMOVE_ON_SOUND_END(toRemove);
            subEl.remove();
            resolve();
        }, "voiceover");
        // Now that the event handler is setup, play the sound
        this.PLAY_SOUND(soundFile, "voiceover");
    });
};
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
    voSubQueue.push(() => this.PLAY_VO_SUB(field, event));
};
/*

  // @ts-ignore
  PLAYBACK.paragraphHandlers.push(function (p, tags) {
    console.log(p, tags);
  });
  */
