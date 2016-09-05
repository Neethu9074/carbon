import React from 'react';

import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import Control from 'in-components/Controls/components/Control';
import {getIn} from 'in-services/settings';
import connectTo from 'in-hoc/connectTo';


const UNITS_TO_ZOOM = 100;

export default connectTo({
  showZoomPanel: getIn(['zoomPanelIsActive'])
},
function Zoom({showZoomPanel}) {
  if (!showZoomPanel) {
    return null;
  }

  return (
    <div>
      <Control onClick={() => CameraControllerServiceLocator.zoom(-UNITS_TO_ZOOM, true)}
               tooltipText='Zoom in.'
               iconSize={16}
               type='plus_without_frame' />

      <Control onClick={() => CameraControllerServiceLocator.zoom(UNITS_TO_ZOOM, true)}
               tooltipText='Zoom out.'
               iconSize={16}
               type={'minus'} />
    </div>
  );
});
