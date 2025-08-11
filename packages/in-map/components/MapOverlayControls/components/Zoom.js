/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/carbon';

import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import Control from 'in-map/components/MapOverlayControls/components/Control';
import { getSetting$ } from 'in-services/settings';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    showZoomPanel: getSetting$('zoomPanelIsActive')
  },
  function Zoom({ showZoomPanel }) {
    if (!showZoomPanel) return null;

    const zoomInTranslation = t('in-map:zoomIn');
    const zoomOutTranslation = t('in-map:zoomOut');

    return (
      <Stack orientation="vertical" gap="0.1rem">
        <Control
          ariaLabel={zoomInTranslation}
          onClick={CameraControllerServiceLocator.zoomIn}
          tooltipText={zoomInTranslation}
          type="lib_openclose_add"
        />

        <Control
          ariaLabel={zoomOutTranslation}
          onClick={CameraControllerServiceLocator.zoomOut}
          tooltipText={zoomOutTranslation}
          size="xl"
          type="lib_openclose_remove"
        />
      </Stack>
    );
  }
);
