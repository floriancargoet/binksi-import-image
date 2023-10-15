export {};
// Some functions defined bu the "sounds" plugin

type SoundEndCB = (
  source: BipsiDataEvent,
  name: string,
  channel: string
) => void;

type SoundEndReturn = { channel: string; listenerFnc: SoundEndCB };

declare global {
  interface BipsiPlayback {
    addOnSoundEnd: (callback: SoundEndCB, channel?: string) => SoundEndReturn;
    removeOnSoundEnd: (toRemove: SoundEndReturn) => void;
  }

  namespace SCRIPTING_FUNCTIONS {
    // Sounds plugin defines these
    export function PLAY_SOUND(
      sound: any,
      channel?: string,
      looped?: boolean
    ): void;
    export const ADD_ON_SOUND_END: BipsiPlayback["addOnSoundEnd"];
    export const REMOVE_ON_SOUND_END: BipsiPlayback["removeOnSoundEnd"];
  }
}
