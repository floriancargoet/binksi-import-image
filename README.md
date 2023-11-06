# bipsi & binksi plugins

My plugins for [bipsi](https://kool.tools/bipsi) and [binksi](https://smwhr.github.io/binksi/)

- [Installation](#installation)
- [Plugins](#plugins)

## Installation

1. Download the plugin from the [`dist`](./dist) folder (click on "Download raw file")
2. In bipsi/binksi, go to the `edit events` tab, then click `import plugin` to create a plugin event
3. Choose the plugin script you've downloaded
4. A plugin may have options. If that's the case, they will show up inside bipsi/binksi as editable fields on the new plugin event

## Plugins

- **import-image**: Import an image as a tileset or a map of rooms.\
  [plugin](./dist/import-image.js) [docs](./src/import-image/README.md)
- **background**: Set a page background and constrain the game canvas to defined area over the background.\
  [plugin](./dist/background.js) [docs](./src/background/README.md)
- **voiceover-subtitles**: Play audio and show synchronized subtitles + new ink instruction `VOICEOVER(…)`\
  [plugin](./dist/voiceover-subtitles.js) [docs](./src/voiceover-subtitles/README.md)
