import React from 'react';

import { SIGNALS } from 'in-new-components/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-new-components/ApplicationMap/serviceLocator/serviceLocator';
import NodeSizeButton from 'in-new-components/ApplicationMap/components/NodeSizeButton';
import ButtonGroup from 'in-new-components/MapControls/ButtonGroup';
import Button from 'in-new-components/MapControls/Button';
import connectTo from 'in-hoc/connectTo';

import locals from './Controls.mless';

export default function Controls({ serviceLocatorUid, onChangeUrlProperties }) {
  const eventBusServiceLocator = getServiceLocators(serviceLocatorUid).eventBusServiceLocator;

  return (
    <div className={locals.bottomRightControls}>
      <ButtonGroup>
        <NodeSizeButton eventBusServiceLocator={eventBusServiceLocator} onChangeUrlProperties={onChangeUrlProperties} />

        <LayoutButton
          appendRight
          icon="lib_actions_force_layout"
          eventBusServiceLocator={eventBusServiceLocator}
          layouter="force"
          onChangeUrlProperties={onChangeUrlProperties}
        />
        <LayoutButton
          appendLeft
          icon="lib_actions_flow_layout"
          eventBusServiceLocator={eventBusServiceLocator}
          layouter="flow"
          onChangeUrlProperties={onChangeUrlProperties}
        />
      </ButtonGroup>

      <ParticlesButton eventBusServiceLocator={eventBusServiceLocator} onChangeUrlProperties={onChangeUrlProperties} />

      <ButtonGroup vertical>
        <Button appendBottom icon="lib_actions_zoom_in" onClick={() => zoomIn(serviceLocatorUid)} />
        <Button appendTop icon="lib_actions_zoom_out" onClick={() => zoomOut(serviceLocatorUid)} />
        <TrafficButton eventBusServiceLocator={eventBusServiceLocator} onChangeUrlProperties={onChangeUrlProperties} />
      </ButtonGroup>
    </div>
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
      <Button
        icon="lib_actions_traffic"
        onClick={() => onChangeUrlProperties({ traffic: !isActive })}
        isActive={isActive}
      />
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
