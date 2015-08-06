'use strict';

import _ from 'lodash';


let timeOfLastFrameUpdate = Date.now();
let deltaTime = 0;
let timeSinceFirstFrame = 0;
let fps = 0;
let secondCounter = 0;
let fpsCounter = 0;
let timeCounterForComponentUpdate = 0;
const framesWatingForComponentUpdate = 10;

const timeEventListener = [];

export function addTimeEventListener(listener) {
  timeEventListener.push(listener);
}

export function removeTimeEventListener(listener) {
  _.remove(timeEventListener, list => list === listener);
}

export function update(highResTimestamp) {
  const timeNow = highResTimestamp;
  deltaTime = (timeNow - timeOfLastFrameUpdate) / 1000; //in ms

  // clamp the deltaTime to a max of 0.5 seconds. If the map is laggy because of
  // any reason or you are switching tabs, the calculation is stoppend and the
  // deltaTime can become lager than seconds or minutes. since all animations
  //are computed with deltaTime in 3D enviroments (and so the camera movement)
  // the camera would make a huge jump if moving while the map is laggy. to
  // avoid that clamp the time to a max of x ms/sec. you can also implement a
  // matrix or max payne slowmotion effect with that by setting max to something
  // around .0001
  deltaTime = Math.min(deltaTime, 0.5);

  timeOfLastFrameUpdate = timeNow;
  timeSinceFirstFrame += deltaTime;
  secondCounter += deltaTime;

  timeCounterForComponentUpdate++;
  fpsCounter++;

  if(secondCounter >= 1) {
    secondCounter = 0;
    fps = fpsCounter;
    fpsCounter = 0;
  }

  if(timeCounterForComponentUpdate >= framesWatingForComponentUpdate) {
    timeCounterForComponentUpdate = 0;
    timeEventListener.forEach(l => l.handleComponentTimeEvent());
  }
}

export function getFPS() {
  return fps;
}

export function getDeltaTime() {
  return deltaTime;
}
