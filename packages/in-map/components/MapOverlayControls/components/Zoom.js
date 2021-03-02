/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import Control from 'in-map/components/MapOverlayControls/components/Control';
import { getSetting$ } from 'in-services/settings';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

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
          tooltipText={t('in-map:zoomIn')}
          type="lib_openclose_add"
        />

        <Control
          className={`${block}__out`}
          onClick={CameraControllerServiceLocator.zoomOut}
          tooltipText={t('in-map:zoomOut')}
          size="xl"
          type="lib_openclose_remove"
        />
      </div>
    );
  }
);
