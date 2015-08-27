import * as time from '../timeCalculations';


export const lowState = {
  enter() {
    time.setFramesWatingForComponentUpdate(1000);
  },

  leave() {}
};

export const midState = {
  enter() {
    time.setFramesWatingForComponentUpdate(500);
  },

  leave() {}
};

export const maxState = {
  enter() {
    time.setFramesWatingForComponentUpdate(200);
  },

  leave() {}
};

const ranges = [
  [-Infinity, 30, lowState], // from ]-00 - 30]FPS  use low details
  [30, 45, midState],        // from ]30  - 30]FPS  use medium details
  [45, Infinity, maxState]   // from ]45  - +00]FPS use maximum details
];

export class AdaptiveDetailHandler {

  constructor(scene) {
    this.scene = scene;
    this.state = maxState;

    this.state.enter(scene);

    this.fpsArray = [60, 60, 60, 60, 60];
    this.fpsArrayIndex = 0;

    this.checkInterval = setInterval(this.tick.bind(this), 1000);
  }

  tick() {
    const fps = time.getFPS();
    const scene = this.scene;
    const fpsArray = this.fpsArray;

    fpsArray[this.fpsArrayIndex] = fps;
    if (++this.fpsArrayIndex >= fpsArray.length) {
      this.fpsArrayIndex = 0;
    }

    const average = this.getAverage(fpsArray);
    const newState = this.getState(average);
    if (newState !== this.state) {
      this.state.leave(scene);
      newState.enter(scene);
      this.state = newState;
    }
  }

  getState(value) {
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      if (value >= range[0] && value < range[1]) {
        return range[2];
      }
    }
  }

  getAverage(fpsArray) {
    return fpsArray.reduce((a, b) => a + b, 0) / (fpsArray.length);
  }

  dispose() {
    clearInterval(this.checkInterval);
    this.checkInterval = null;
  }
}
