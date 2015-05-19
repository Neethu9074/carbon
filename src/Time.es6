'use strict';


class Time {
  constructor() {
    this.timeOfLastFrameUpdate = Date.now();
    this.deltaTime = 0;
    this.timeSinceFirstFrame = 0;
    this.fps = 0;
    this.secondCounter = 0;
    this.fpsCounter = 0;
  }

  update() {
    const timeNow = Date.now();
    this.deltaTime = (timeNow - this.timeOfLastFrameUpdate) / 1000; //in ms
    this.timeOfLastFrameUpdate = timeNow;
    this.timeSinceFirstFrame += this.deltaTime;
    this.fpsCounter++;
    this.secondCounter += this.deltaTime;

    if(this.secondCounter >= 1) {
      this.secondCounter = 0;
      this.fps = this.fpsCounter;
      this.fpsCounter = 0;
    }
  }
}

const time = new Time();
export default time;
