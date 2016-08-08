import React from 'react';

import {cameraController$} from 'in-map/stores/cameraController';
import SvgIcon from 'in-components/SvgIcon';
import {getIn} from 'in-services/settings';
import connectTo from 'in-hoc/connectTo';

import 'in-map/src/components/react/ViewControls/components/Zoom.less';


const UNITS_TO_ZOOM = 100;
const block = 'in-logical-view-zoom';

export default connectTo({
  cameraController: cameraController$,
  showZoomPanel: getIn(['zoomPanelIsActive'])
},
function Zoom({cameraController, showZoomPanel}) {
  if (!cameraController || !showZoomPanel) {
    return null;
  }

  return (
    <div className={block}>
      <div className={block + '__button'}
           onClick={() => {
             cameraController.centerMousePosition();
             cameraController.onZoom(UNITS_TO_ZOOM);
           }}>
        <SvgIcon type={'plus_without_frame'}
                 width={16}
                 height={16}
                 color='#7b8e96' />
      </div>
      <div className={block + '__button-zoom-out'}
           onClick={() => {
             cameraController.centerMousePosition();
             cameraController.onZoom(-UNITS_TO_ZOOM);
           }}>
        <SvgIcon type={'minus'}
                 width={16}
                 color='#7b8e96' />
      </div>
    </div>
  );
});
