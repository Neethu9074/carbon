# User Interface

 - browser in the sense of *metrics browser*

## Versioning Scheme
 - Major versions are increased after ever sprint. Due to historic reasons the version to be released after sprint 1 is `2.0.0`. After sprint 2 version `3.0.0` is released.
 - After releasing, change the version in `package.json` to `<current version>-POSTRELEASE`, e.g. `2.0.0`. This is necessary in order to avoid overwrites of existing Docker images.

## Theme Variable that need to be extracted

 - header height
 - header background color
 - header background opacity
 - header button active / inactive color
 - header box shadow
 - footer height
 - footer background color
 - footer background opacity
 - footer button active / inactive color
 - timeline width
 - sidebar width
 - link color
 - detail pane zIndex

 - set common background color to #20272D
 - set theme CSS class on body
