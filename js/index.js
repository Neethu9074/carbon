"use strict";

var colors = {
  "cyan": "#2dfffe",
  "razzmatazz": "#e50066",
  "easternBlue": "#1d90a9",
  "governorBay": "#3d2dcf",
  "toryBlue": "#0b5cad",
  "dodgerBlue": "#15aafe",
  "black": 0x000000,
  "mineShaft": 0x202020,
  "mapcyan": 0x2dfffe,
  "orient": 0x015473,
  "redBerry": 0x880000,
  "gold": 0xffd000,
  "flushOrange": 0xff8000
};

module.exports = {
  "common": {
    "fontFamily": "sans-serif",
    "fontColor": "#ddd"
  },
  "charts": {
    "colors": {
      "cyan": colors.cyan,
      "razzmatazz": colors.razzmatazz,
      "easternBlue": colors.easternBlue,
      "governorBay": colors.governorBay,
      "toryBlue": colors.toryBlue,
      "dodgerBlue": colors.dodgerBlue
    }
  },
  "map": {
    "renderClearColor": colors.black,
    "ambientColor": colors.mineShaft,
    "groundColor": colors.mapCyan,
    "lightBlue": colors.mapCyan,
    "midBlue": colors.orient,
    "errorRed": colors.redBerry,
    "warningYellow": colors.gold,
    "connectionColor": colors.flushOrange
  }
};
