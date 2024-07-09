/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import HorizontalControlsPresenter from 'in-components/MapControls/HorizontalControlsPresenter';
import VerticalControlsPresenter from 'in-components/MapControls/VerticalControlsPresenter';
import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import NodeSizeButton from 'in-applications/ApplicationMap/components/NodeSizeButton';
import ButtonGroup from 'in-components/MapControls/ButtonGroup';
import Button from 'in-components/MapControls/Button';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default function Controls({ serviceLocatorUid, onChangeUrlProperties, result }) {
  const eventBusServiceLocator = getServiceLocators(serviceLocatorUid).eventBusServiceLocator;
  const hasApproximateData = result?.resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE';

  return (
    <>
      <HorizontalControlsPresenter position="topLeft">
        <ButtonGroup>
          <Tooltip themeStyle="light" content={t('in-applications:applicationMap.tooltipNodeSize')}>
            <div>
              <NodeSizeButton
                eventBusServiceLocator={eventBusServiceLocator}
                onChangeUrlProperties={onChangeUrlProperties}
                appendLeft
              />
            </div>
          </Tooltip>
          {hasApproximateData && (
            <MultiLineToolTipIcon lines={[t('in-components:approximateDataIndicator.dataRetention')]} />
          )}
        </ButtonGroup>
      </HorizontalControlsPresenter>
      <VerticalControlsPresenter position="leftTop">
        <ButtonGroup vertical>
          <LayoutButton
            appendLeft
            icon="lib_actions_flow_layout"
            eventBusServiceLocator={eventBusServiceLocator}
            layouter="flow"
            onChangeUrlProperties={onChangeUrlProperties}
            tooltipLabel={t('in-applications:applicationMap.tooltipLayoutFlow')}
          />
          <LayoutButton
            appendLeft
            icon="lib_actions_force_layout"
            eventBusServiceLocator={eventBusServiceLocator}
            layouter="force"
            onChangeUrlProperties={onChangeUrlProperties}
            tooltipLabel={t('in-applications:applicationMap.tooltipLayoutForce')}
          />

          <ParticlesButton
            appendLeft
            eventBusServiceLocator={eventBusServiceLocator}
            onChangeUrlProperties={onChangeUrlProperties}
          />

          <TrafficButton
            appendLeft
            eventBusServiceLocator={eventBusServiceLocator}
            onChangeUrlProperties={onChangeUrlProperties}
          />
        </ButtonGroup>
        <ButtonGroup vertical>
          <Tooltip themeStyle="light" content={t('in-applications:applicationMap.tooltipZoomIn')} align={'rightMiddle'}>
            <Button appendLeft icon="lib_actions_zoom_in" onClick={() => zoomIn(serviceLocatorUid)} />
          </Tooltip>
          <Tooltip
            themeStyle="light"
            content={t('in-applications:applicationMap.tooltipZoomOut')}
            align={'rightMiddle'}
          >
            <Button appendLeft icon="lib_actions_zoom_out" onClick={() => zoomOut(serviceLocatorUid)} />
          </Tooltip>
        </ButtonGroup>
      </VerticalControlsPresenter>
    </>
  );

  function zoomIn(serviceLocatorUid) {
    getServiceLocators(serviceLocatorUid).sceneServiceLocator.getScene().cameraController.zoomInOneStep();
  }

  function zoomOut(serviceLocatorUid) {
    getServiceLocators(serviceLocatorUid).sceneServiceLocator.getScene().cameraController.zoomOutOneStep();
  }
}

const ParticlesButton = connectTo(
  ({ eventBusServiceLocator }) => ({
    isActive: eventBusServiceLocator.on(SIGNALS.PARTICLES)
  }),
  function ParticlesButton({ onChangeUrlProperties, isActive }) {
    return (
      <Tooltip
        themeStyle="light"
        content={t('in-applications:applicationMap.tooltipSimulateTraffic')}
        align={'rightMiddle'}
      >
        <Button
          icon="lib_actions_particles"
          onClick={() => onChangeUrlProperties({ particles: !isActive })}
          isActive={isActive}
          appendLeft
        />
      </Tooltip>
    );
  }
);

const TrafficButton = connectTo(
  ({ eventBusServiceLocator }) => ({
    isActive: eventBusServiceLocator.on(SIGNALS.SHOW_EXTERNAL_TRAFFIC)
  }),
  function ParticlesButton({ isActive, onChangeUrlProperties }) {
    return (
      <Tooltip
        themeStyle="light"
        content={t('in-applications:applicationMap.tooltipToggleServiceOutside')}
        align={'rightMiddle'}
      >
        <Button
          icon="lib_actions_traffic"
          onClick={() => onChangeUrlProperties({ traffic: !isActive })}
          isActive={isActive}
          appendLeft
        />
      </Tooltip>
    );
  }
);

const LayoutButton = connectTo(
  ({ eventBusServiceLocator, layouter }) => ({
    isActive: eventBusServiceLocator.on(SIGNALS.LAYOUTER).map(_layouter => _layouter === layouter)
  }),
  function ParticlesButton(props) {
    const { onChangeUrlProperties, layouter, tooltipLabel } = props;
    return (
      <Tooltip themeStyle="light" content={tooltipLabel} align={'rightMiddle'}>
        <Button {...props} onClick={() => onChangeUrlProperties({ layouter })} />
      </Tooltip>
    );
  }
);
