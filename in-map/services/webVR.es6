import {createLogger} from 'instalog';
import React from 'react';

import DialogNotification from 'in-components/DialogNotification';
import {close} from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';


const logger = createLogger('webVR');

export function isWebVRSupported() {
  return (navigator.getVRDevices || navigator.getVRDisplays) ? true : false;
}

export function createNoWebVRDialog() {
  return <NoWebGLDialog />;
}


function NoWebGLDialog() {
  return (
    <Dialog header='Your Browser Does Not Support WebVR'
              onClose={close}>
      <DialogNotification type='info'>
        {getErrorMessage()}
      </DialogNotification>
    </Dialog>
  );
}

function getErrorMessage() {
  return 'Your browser does not support WebVR. See http://webvr.info for assistance.';
}


export function getVRInput(callback) {
  getVRDevice(gotVRInputDevices, callback);
}

export function getVRDisplay(callback) {
  getVRDevice(gotVRDisplayDevices, callback);
}

export function getVRDevice(method, callback) {
  if (navigator.getVRDisplays) {
    navigator.getVRDisplays().then(display => method(display, callback));
  } else if (navigator.getVRDevices) {
    // Deprecated API.
    navigator.getVRDevices().then(device => method(device, callback));
  } else {
    logger.error('there is no WebVR API available');
  }
}

function gotVRInputDevices(displays, callback) {
  let display;

  for (let i = 0; i < displays.length; i ++) {
    if (('VRDisplay' in window && displays[i] instanceof window.VRDisplay) ||
        ('PositionSensorVRDevice' in window && displays[i] instanceof window.PositionSensorVRDevice)) {
      display = displays[i];
      break;
    }
  }

  if (window.vrDisplay === undefined) {
    logger.error('VR input not available.');
  } else {
    logger.error('display initialized:', display);
    callback(display);
  }
}

function gotVRDisplayDevices(devices, callback) {
  let isDeprecatedAPI;
  let vrHMD;

  for (let i = 0; i < devices.length; i ++) {
    if ('VRDisplay' in window && devices[i] instanceof window.VRDisplay) {
      vrHMD = devices[i];
      isDeprecatedAPI = false;
      break;

    } else if ('HMDVRDevice' in window && devices[i] instanceof window.HMDVRDevice) {
      vrHMD = devices[i];
      isDeprecatedAPI = true;
      break;
    }
  }

  if (vrHMD === undefined) {
    logger.error('HMD not available');
  } else {
    logger.error('display initialized:', vrHMD);
    callback(vrHMD, isDeprecatedAPI);
  }
}
