import React, { Fragment } from 'react';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import RoundButton from 'in-components/FlowMap/components/Controls/Button';
import { evaluateClassNames } from 'in-services/util/classnames';
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
        <HeatmapButton
          signal={SIGNAL_VALUES.HEATMAP_CALLS}
          serviceLocatorUid={serviceLocatorUid}
          onClick={() => toggleHeatMapSignal(SIGNAL_VALUES.HEATMAP_CALLS)}
        >
          Calls
        </HeatmapButton>
        <HeatmapButton
          signal={SIGNAL_VALUES.HEATMAP_LATENCY}
          serviceLocatorUid={serviceLocatorUid}
          onClick={() => toggleHeatMapSignal(SIGNAL_VALUES.HEATMAP_LATENCY)}
        >
          Latency
        </HeatmapButton>
        <HeatmapButton
          signal={SIGNAL_VALUES.HEATMAP_ERRORRATE}
          serviceLocatorUid={serviceLocatorUid}
          onClick={() => toggleHeatMapSignal(SIGNAL_VALUES.HEATMAP_ERRORRATE)}
        >
          Errors
        </HeatmapButton>
      </div>
      <div className={locals.bottomLeftControls}>
        <ParticlesButton onClick={toggleParticles} serviceLocatorUid={serviceLocatorUid} />
        <RoundButton onClick={() => zoomIn(serviceLocatorUid)} iconType="lib_openclose_add" />
        <RoundButton onClick={() => zoomOut(serviceLocatorUid)} iconType="lib_openclose_remove" />
      </div>
    </Fragment>
  );

  function toggleHeatMapSignal(signal) {
    eventBusServiceLocator.on(SIGNALS.HEATMAP).once(currentSignal => {
      if (currentSignal === signal) {
        eventBusServiceLocator.emit(SIGNALS.HEATMAP, null);
      } else {
        eventBusServiceLocator.emit(SIGNALS.HEATMAP, signal);
      }
    });
  }

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
    return <RoundButton isEnabled={isEnabled} onClick={onClick} iconType="particles" width={16} height={16} />;
  }
);

const HeatmapButton = connectTo(
  props => ({
    isEnabled: getServiceLocators(props.serviceLocatorUid)
      .eventBusServiceLocator.on(SIGNALS.HEATMAP)
      .map(currentSignal => currentSignal === props.signal)
  }),
  function HeatmapButton({ isEnabled, children, onClick, disabled }) {
    return (
      <div
        className={evaluateClassNames({
          [locals.heatMapButton]: true,
          [locals.selectedHeatMapButton]: isEnabled
        })}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </div>
    );
  }
);
