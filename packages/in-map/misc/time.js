/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

let timeOfLastFrameUpdate = 0;
let timeSinceFirstFrame = 0;
let secondCounter = 0;
let fpsCounter = 0;
let deltaTime = 0;
let timeNow = 0;
let fps = 0;

export function update(highResTimestamp) {
  timeNow = highResTimestamp;
  const deltaTimeInMs = timeNow - timeOfLastFrameUpdate;
  deltaTime = deltaTimeInMs / 1000; // in ms

  // clamp the deltaTime to a max of 0.5 seconds. If the map is laggy because of
  // any reason or you are switching tabs, the calculation is stoppend and the
  // deltaTime can become lager than seconds or minutes. since all animations
  // are computed with deltaTime in 3D enviroments (and so the camera movement)
  // the camera would make a huge jump if moving while the map is laggy. to
  // avoid that clamp the time to a max of x ms/sec. you can also implement a
  // matrix or max payne slowmotion effect with that by setting max to something
  // around .001
  deltaTime = Math.min(deltaTime, 0.1);

  timeOfLastFrameUpdate = timeNow;
  timeSinceFirstFrame += deltaTime;
  secondCounter += deltaTime;

  fpsCounter++;

  if (secondCounter >= 1) {
    secondCounter = 0;
    fps = fpsCounter;
    fpsCounter = 0;
  }
}

export function getFPS() {
  return fps;
}

export function getDeltaTime() {
  return deltaTime;
}

export function getNow() {
  return timeNow;
}

export function getBigBangTime() {
  return timeSinceFirstFrame;
}

export function reset() {
  timeOfLastFrameUpdate = 0;
  timeSinceFirstFrame = 0;
  secondCounter = 0;
  fpsCounter = 0;
  deltaTime = 0;
  timeNow = 0;
  fps = 0;
}
