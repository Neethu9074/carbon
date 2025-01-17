/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import HorizontalControlsPresenter from 'in-components/MapControls/HorizontalControlsPresenter';
import VerticalControlsPresenter from 'in-components/MapControls/VerticalControlsPresenter';
import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import NodeSizeButton from 'in-applications/ApplicationMap/components/NodeSizeButton';
import ButtonGroup from 'in-components/MapControls/ButtonGroup';
import Button from 'in-components/MapControls/Button';
import Tooltip from 'in-components/Tooltip';
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
            icon="lib_actions_flow_layout"
            eventBusServiceLocator={eventBusServiceLocator}
            layouter="flow"
            onChangeUrlProperties={onChangeUrlProperties}
            tooltipLabel={t('in-applications:applicationMap.tooltipLayoutFlow')}
          />
          <LayoutButton
            icon="lib_actions_force_layout"
            eventBusServiceLocator={eventBusServiceLocator}
            layouter="force"
            onChangeUrlProperties={onChangeUrlProperties}
            tooltipLabel={t('in-applications:applicationMap.tooltipLayoutForce')}
          />

          <ParticlesButton
            eventBusServiceLocator={eventBusServiceLocator}
            onChangeUrlProperties={onChangeUrlProperties}
          />

          <TrafficButton
            eventBusServiceLocator={eventBusServiceLocator}
            onChangeUrlProperties={onChangeUrlProperties}
          />
        </ButtonGroup>
        <ButtonGroup vertical>
          <Tooltip themeStyle="light" content={t('in-applications:applicationMap.tooltipZoomIn')} align={'rightMiddle'}>
            <Button icon="lib_actions_zoom_in" onClick={() => zoomIn(serviceLocatorUid)} appendLeft />
          </Tooltip>
          <Tooltip
            themeStyle="light"
            content={t('in-applications:applicationMap.tooltipZoomOut')}
            align={'rightMiddle'}
          >
            <Button icon="lib_actions_zoom_out" onClick={() => zoomOut(serviceLocatorUid)} appendLeft />
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

function ParticlesButton({ eventBusServiceLocator, onChangeUrlProperties }) {
  const isActive = useObservable(eventBusServiceLocator.on(SIGNALS.PARTICLES), []) ?? false;
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

function TrafficButton({ eventBusServiceLocator, onChangeUrlProperties }) {
  const isActive = useObservable(eventBusServiceLocator.on(SIGNALS.SHOW_EXTERNAL_TRAFFIC), []) ?? false;
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

function LayoutButton(props) {
  const { eventBusServiceLocator, layouter, onChangeUrlProperties, tooltipLabel } = props;
  const isActive =
    useObservable(
      eventBusServiceLocator.on(SIGNALS.LAYOUTER).map(_layouter => _layouter === layouter),
      []
    ) ?? false;
  return (
    <Tooltip themeStyle="light" content={tooltipLabel} align={'rightMiddle'}>
      <Button {...props} isActive={isActive} onClick={() => onChangeUrlProperties({ layouter })} appendLeft />
    </Tooltip>
  );
}
