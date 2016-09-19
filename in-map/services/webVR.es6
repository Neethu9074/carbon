/* global require:false */
/* eslint-disable no-unused-vars */
import React from 'react';

import {
  Matrix4,
  Vector3,
  Quaternion,
  PerspectiveCamera
} from 'in-map/3DLibProvider';
import DialogNotification from 'in-components/DialogNotification';
import {close} from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';


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


// define gloval object so that the import works, because three uses THREE object to declare further implementation
window.THREE = {
  Matrix4,
  Vector3,
  Quaternion,
  PerspectiveCamera
};

export function loadVRControlsWrapper() {
  require('three/examples/js/controls/VRControls.js');
  return window.THREE.VRControls;
}

export function loadVREffectWrapper() {
  require('three/examples/js/effects/VREffect.js');
  return window.THREE.VREffect;
}
