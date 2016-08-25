import React from 'react';

import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import SvgIcon from 'in-components/SvgIcon';
import {getIn} from 'in-services/settings';
import connectTo from 'in-hoc/connectTo';

import 'in-map/components/misc/viewControlComponents/Zoom.less';


const UNITS_TO_ZOOM = 100;
const block = 'in-logical-view-zoom';

export default connectTo({
  showZoomPanel: getIn(['zoomPanelIsActive'])
},
function Zoom({showZoomPanel}) {
  if (!showZoomPanel) {
    return null;
  }

  return (
    <div className={block}>
      <div className={block + '__button'}
           onClick={() => {
             CameraControllerServiceLocator.zoom(-UNITS_TO_ZOOM, true);
           }}>
        <SvgIcon type={'plus_without_frame'}
                 width={16}
                 height={16}
                 color='#7b8e96' />
      </div>
      <div className={block + '__button-zoom-out'}
           onClick={() => {
             CameraControllerServiceLocator.zoom(UNITS_TO_ZOOM, true);
           }}>
        <SvgIcon type={'minus'}
                 width={16}
                 color='#7b8e96' />
      </div>
    </div>
  );
});
