/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import HorizontalControlsPresenter from 'in-components/MapControls/HorizontalControlsPresenter';
import VerticalControlsPresenter from 'in-components/MapControls/VerticalControlsPresenter';
import { getServiceLocators } from 'in-applications/FlowMap/serviceLocator/serviceLocator';
import MapButtonGroup from 'in-components/MapControls/ButtonGroup';
import Button from 'in-components/MapControls/Button';
import ButtonGroup from 'in-components/ButtonGroup';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

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
      <HorizontalControlsPresenter position="topLeft">
        <HeatmapButtons serviceLocatorUid={serviceLocatorUid} />
      </HorizontalControlsPresenter>
      <VerticalControlsPresenter position="leftTop">
        <ParticlesButton onClick={toggleParticles} serviceLocatorUid={serviceLocatorUid} />
        <MapButtonGroup vertical>
          <Button appendBottom icon="lib_actions_zoom_in" onClick={() => zoomIn(serviceLocatorUid)} />
          <Button appendTop icon="lib_actions_zoom_out" onClick={() => zoomOut(serviceLocatorUid)} />
        </MapButtonGroup>
      </VerticalControlsPresenter>
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
            text: t('in-applications:labelCalls'),
            key: SIGNAL_VALUES.HEATMAP_CALLS,
            onClick: () => toggleHeatMapSignal(SIGNAL_VALUES.HEATMAP_CALLS)
          },
          {
            text: t('in-applications:labelLatency'),
            key: SIGNAL_VALUES.HEATMAP_LATENCY,
            onClick: () => toggleHeatMapSignal(SIGNAL_VALUES.HEATMAP_LATENCY)
          },
          {
            text: t('in-applications:labelErrors'),
            key: SIGNAL_VALUES.HEATMAP_ERRORRATE,
            onClick: () => toggleHeatMapSignal(SIGNAL_VALUES.HEATMAP_ERRORRATE)
          }
        ]}
        activeKey={currentSignal}
      />
    );
  }
);
