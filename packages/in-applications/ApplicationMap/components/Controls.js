/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import HorizontalControlsPresenter from 'in-new-components/MapControls/HorizontalControlsPresenter';
import VerticalControlsPresenter from 'in-new-components/MapControls/VerticalControlsPresenter';
import NodeSizeButton from 'in-applications/ApplicationMap/components/NodeSizeButton';
import ButtonGroup from 'in-new-components/MapControls/ButtonGroup';
import Button from 'in-new-components/MapControls/Button';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

export default function Controls({ serviceLocatorUid, onChangeUrlProperties }) {
  const eventBusServiceLocator = getServiceLocators(serviceLocatorUid).eventBusServiceLocator;
  return (
    <>
      <HorizontalControlsPresenter position="topLeft">
        <ButtonGroup>
          <NodeSizeButton
            eventBusServiceLocator={eventBusServiceLocator}
            onChangeUrlProperties={onChangeUrlProperties}
          />

          <LayoutButton
            appendRight
            icon="lib_actions_flow_layout"
            eventBusServiceLocator={eventBusServiceLocator}
            layouter="flow"
            onChangeUrlProperties={onChangeUrlProperties}
          />
          <LayoutButton
            appendLeft
            icon="lib_actions_force_layout"
            eventBusServiceLocator={eventBusServiceLocator}
            layouter="force"
            onChangeUrlProperties={onChangeUrlProperties}
          />
        </ButtonGroup>

        <ParticlesButton
          eventBusServiceLocator={eventBusServiceLocator}
          onChangeUrlProperties={onChangeUrlProperties}
        />

        <TrafficButton eventBusServiceLocator={eventBusServiceLocator} onChangeUrlProperties={onChangeUrlProperties} />
      </HorizontalControlsPresenter>
      <VerticalControlsPresenter position="leftTop">
        <ButtonGroup vertical>
          <Button appendBottom icon="lib_actions_zoom_in" onClick={() => zoomIn(serviceLocatorUid)} />
          <Button appendTop icon="lib_actions_zoom_out" onClick={() => zoomOut(serviceLocatorUid)} />
        </ButtonGroup>
      </VerticalControlsPresenter>
    </>
  );

  function zoomIn(serviceLocatorUid) {
    getServiceLocators(serviceLocatorUid)
      .sceneServiceLocator.getScene()
      .cameraController.zoomInOneStep();
  }

  function zoomOut(serviceLocatorUid) {
    getServiceLocators(serviceLocatorUid)
      .sceneServiceLocator.getScene()
      .cameraController.zoomOutOneStep();
  }
}

const ParticlesButton = connectTo(
  ({ eventBusServiceLocator }) => ({
    isActive: eventBusServiceLocator.on(SIGNALS.PARTICLES)
  }),
  function ParticlesButton({ onChangeUrlProperties, isActive }) {
    return (
      <Button
        icon="lib_actions_particles"
        onClick={() => onChangeUrlProperties({ particles: !isActive })}
        isActive={isActive}
      />
    );
  }
);

const TrafficButton = connectTo(
  ({ eventBusServiceLocator }) => ({
    isActive: eventBusServiceLocator.on(SIGNALS.SHOW_EXTERNAL_TRAFFIC)
  }),
  function ParticlesButton({ isActive, onChangeUrlProperties }) {
    return (
      <Tooltip themeStyle="light" content={t('in-applications:applicationMap.tooltipToggleServiceOutside')}>
        <Button
          icon="lib_actions_traffic"
          onClick={() => onChangeUrlProperties({ traffic: !isActive })}
          isActive={isActive}
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
    const { onChangeUrlProperties, layouter } = props;
    return <Button {...props} onClick={() => onChangeUrlProperties({ layouter })} />;
  }
);
