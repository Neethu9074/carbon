/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default class TimeTracker {
  constructor() {
    this.timeOfLastFrameUpdate = 0;
    this.deltaTime = 0;
    this.now = 0;
  }

  update(highResTimestamp) {
    this.now = highResTimestamp;
    const deltaTimeInMs = this.now - this.timeOfLastFrameUpdate;
    this.deltaTime = deltaTimeInMs / 1000; // in ms

    // clamp the deltaTime to a max of 0.5 seconds. If the map is laggy because of
    // any reason or you are switching tabs, the calculation is stoppend and the
    // deltaTime can become lager than seconds or minutes. since all animations
    // are computed with deltaTime in 3D enviroments (and so the camera movement)
    // the camera would make a huge jump if moving while the map is laggy.
    // To avoid that clamp the time to a max of x ms/sec.
    this.deltaTime = Math.min(this.deltaTime, 0.1);

    this.timeOfLastFrameUpdate = this.now;
  }
}
