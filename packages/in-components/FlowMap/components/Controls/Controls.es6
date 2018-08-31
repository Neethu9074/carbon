import React, { Fragment } from 'react';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import MapButtonGroup from 'in-new-components/MapControls/ButtonGroup';
import { particlesInFlowMapEnabled } from 'in-services/featureFlags';
import Button from 'in-new-components/MapControls/Button';
import ButtonGroup from 'in-new-components/ButtonGroup';
import connectTo from 'in-hoc/connectTo';

import locals from './Controls.mless';

export const SIGNALS = {
  PARTICLES: 'particles',
  HEATMAP: 'heatmap'
};

export const SIGNAL_VALUES = {
  HEATMAP_CALLS: 'calls',
  HEATMAP_ERRORRATE: 'errors',
  HEATMAP_LATENCY: 'latency'
};

export default function Controls({ serviceLocatorUid }) {
  const eventBusServiceLocator = getServiceLocators(serviceLocatorUid).eventBusServiceLocator;
  eventBusServiceLocator.emit(SIGNALS.PARTICLES, false);
  eventBusServiceLocator.emit(SIGNALS.HEATMAP, null);

  return (
    <Fragment>
      <div className={locals.topLeftControls}>
        <HeatmapButtons serviceLocatorUid={serviceLocatorUid} />
      </div>
      <div className={locals.bottomRightControls}>
        {particlesInFlowMapEnabled && (
          <ParticlesButton onClick={toggleParticles} serviceLocatorUid={serviceLocatorUid} />
        )}
        <MapButtonGroup vertical>
          <Button appendBottom icon="lib_actions_zoom_in" onClick={() => zoomIn(serviceLocatorUid)} />
          <Button appendTop icon="lib_actions_zoom_out" onClick={() => zoomOut(serviceLocatorUid)} />
        </MapButtonGroup>
      </div>
    </Fragment>
  );

  function toggleParticles() {
    eventBusServiceLocator
      .on(SIGNALS.PARTICLES)
      .once(_signal => eventBusServiceLocator.emit(SIGNALS.PARTICLES, !_signal));
  }

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
  props => ({
    isEnabled: getServiceLocators(props.serviceLocatorUid).eventBusServiceLocator.on(SIGNALS.PARTICLES)
  }),
  function ParticlesButton({ onClick, isEnabled }) {
    return <Button icon="lib_actions_particles" onClick={onClick} isActive={isEnabled} />;
  }
);

const HeatmapButtons = connectTo(
  props => ({
    currentSignal: getServiceLocators(props.serviceLocatorUid).eventBusServiceLocator.on(SIGNALS.HEATMAP)
  }),
  function HeatmapButtons({ serviceLocatorUid, currentSignal }) {
    const eventBusServiceLocator = getServiceLocators(serviceLocatorUid).eventBusServiceLocator;

    function toggleHeatMapSignal(signal) {
      eventBusServiceLocator.on(SIGNALS.HEATMAP).once(currentSignal => {
        if (currentSignal === signal) {
          eventBusServiceLocator.emit(SIGNALS.HEATMAP, null);
        } else {
          eventBusServiceLocator.emit(SIGNALS.HEATMAP, signal);
        }
      });
    }

    return (
      <ButtonGroup
        buttonPropsList={[
          {
            text: 'Calls',
            key: SIGNAL_VALUES.HEATMAP_CALLS,
            onClick: () => toggleHeatMapSignal(SIGNAL_VALUES.HEATMAP_CALLS)
          },
          {
            text: 'Latency',
            key: SIGNAL_VALUES.HEATMAP_LATENCY,
            onClick: () => toggleHeatMapSignal(SIGNAL_VALUES.HEATMAP_LATENCY)
          },
          {
            text: 'Errors',
            key: SIGNAL_VALUES.HEATMAP_ERRORRATE,
            onClick: () => toggleHeatMapSignal(SIGNAL_VALUES.HEATMAP_ERRORRATE)
          }
        ]}
        activeKey={currentSignal}
      />
    );
  }
);
