import * as time from '../timeCalculations';


export const lowState = {
  enter() {
  },

  leave(){
  }
};

export const midState = {
  enter() {
  },

  leave(){
  }
};

export const maxState = {
  enter() {
    },

  leave(){
  }
};

const ranges = [
  [-Infinity, 30, lowState],
  [30, 45, midState],
  [45, Infinity, maxState]
];

export class AdaptiveDetailHandler {

  constructor(scene) {
    this.scene = scene;
    this.state = maxState;

    this.state.enter(scene);

    const fpsArray = [60, 60, 60, 60, 60];
    let fpsArrayIndex = 0;

    this.checkInterval = setInterval(() => {
      const fps = time.getFPS();

      fpsArray[fpsArrayIndex] = fps;
      if (++fpsArrayIndex >= fpsArray.length) {
        fpsArrayIndex = 0;
      }

      const average = this.getAverage(fpsArray);
      const newState = this.getState(average);
      if (newState !== this.state) {
        this.state.leave(scene);
        newState.enter(scene);
        this.state = newState;
      }
    },
    1000);
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
