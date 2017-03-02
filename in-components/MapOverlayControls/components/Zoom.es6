import React from 'react';

import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import Control from 'in-components/MapOverlayControls/components/Control';
import {getIn} from 'in-services/settings';
import connectTo from 'in-hoc/connectTo';

import './Zoom.less';


const block = 'in-controls-zoom';
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
      <Control className={`${block}__in`}
               onClick={() => CameraControllerServiceLocator.zoom(-UNITS_TO_ZOOM, true)}
               tooltipText='Zoom in'
               type='plus_without_frame' />

      <Control className={`${block}__out`}
               onClick={() => CameraControllerServiceLocator.zoom(UNITS_TO_ZOOM, true)}
               tooltipText='Zoom out'
               type={'minus'} />
    </div>
  );
});
