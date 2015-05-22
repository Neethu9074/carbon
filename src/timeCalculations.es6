'use strict';

let timeOfLastFrameUpdate = Date.now();
let deltaTime = 0;
let timeSinceFirstFrame = 0;
let fps = 0;
let secondCounter = 0;
let fpsCounter = 0;

export function update() {
  const timeNow = Date.now();
  deltaTime = (timeNow - timeOfLastFrameUpdate) / 1000; //in ms
  timeOfLastFrameUpdate = timeNow;
  timeSinceFirstFrame += deltaTime;
  fpsCounter++;
  secondCounter += deltaTime;

  if(secondCounter >= 1) {
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
