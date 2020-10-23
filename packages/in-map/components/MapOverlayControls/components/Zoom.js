import React from 'react';

import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import Control from 'in-map/components/MapOverlayControls/components/Control';
import { getSetting$ } from 'in-services/settings';
import connectTo from 'in-hoc/connectTo';

import './Zoom.less';

const block = 'in-controls-zoom';

export default connectTo(
  {
    showZoomPanel: getSetting$('zoomPanelIsActive')
  },
  function Zoom({ showZoomPanel }) {
    if (!showZoomPanel) {
      return null;
    }

    return (
      <div>
        <Control
          className={`${block}__in`}
          onClick={CameraControllerServiceLocator.zoomIn}
          tooltipText="Zoom in"
          type="lib_openclose_add"
        />

        <Control
          className={`${block}__out`}
          onClick={CameraControllerServiceLocator.zoomOut}
          tooltipText="Zoom out"
          size="xl"
          type="lib_openclose_remove"
        />
      </div>
    );
  }
);
