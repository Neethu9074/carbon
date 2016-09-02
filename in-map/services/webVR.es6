import React from 'react';

import DialogNotification from 'in-components/DialogNotification';
import {close} from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';


export function isWebVRSupported() {
  return navigator.getVRDevices ? true : false;
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
