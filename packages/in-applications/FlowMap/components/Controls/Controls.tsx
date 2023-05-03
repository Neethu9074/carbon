/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, useEffect } from 'react';

import { ResultPrecisionDetails } from '@instana/types';
import { LinkProps } from '@instana/components';
import { useObservable } from '@instana/hooks';

import HorizontalControlsPresenter from 'in-components/MapControls/HorizontalControlsPresenter';
import VerticalControlsPresenter from 'in-components/MapControls/VerticalControlsPresenter';
import { getServiceLocators } from 'in-applications/FlowMap/serviceLocator/serviceLocator';
import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import MapButtonGroup from 'in-components/MapControls/ButtonGroup';
import Button from 'in-components/MapControls/Button';
import ButtonGroup from 'in-components/ButtonGroup';
import { t } from 'in-i18n';

export const SIGNALS = {
  PARTICLES: 'particles',
  HEATMAP: 'heatmap'
};

const SIGNAL_VALUES = {
  HEATMAP_CALLS: 'calls',
  HEATMAP_ERROR_RATE: 'errors',
  HEATMAP_LATENCY: 'latency'
};

interface Props {
  serviceLocatorUid: string;
  resultPrecisionDetails: ResultPrecisionDetails;
}

export default function Controls({ serviceLocatorUid, resultPrecisionDetails }: Props) {
  const eventBusServiceLocator = getServiceLocators(serviceLocatorUid).eventBusServiceLocator;
  const hasApproximateData = resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE';

  useEffect(() => {
    eventBusServiceLocator.emit(SIGNALS.PARTICLES, false);
    eventBusServiceLocator.emit(SIGNALS.HEATMAP, null);
  }, [eventBusServiceLocator]);

  return (
    <Fragment>
      <HorizontalControlsPresenter position="topLeft">
        <MapButtonGroup>
          <HeatmapButtons serviceLocatorUid={serviceLocatorUid} />
          {hasApproximateData && (
            <MultiLineToolTipIcon lines={[t('in-components:approximateDataIndicator.dataRetention')]} />
          )}
        </MapButtonGroup>
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
      .once((_signal: string) => eventBusServiceLocator.emit(SIGNALS.PARTICLES, !_signal));
  }

  function zoomIn(serviceLocatorUid: string) {
    getServiceLocators(serviceLocatorUid).sceneServiceLocator.getScene().cameraController.zoomInOneStep();
  }

  function zoomOut(serviceLocatorUid: string) {
    getServiceLocators(serviceLocatorUid).sceneServiceLocator.getScene().cameraController.zoomOutOneStep();
  }
}

interface ParticlesButtonProps {
  onClick: LinkProps['onClick'];
  serviceLocatorUid: string;
}

function ParticlesButton({ onClick, serviceLocatorUid }: ParticlesButtonProps) {
  const isEnabled = useObservable(
    getServiceLocators(serviceLocatorUid).eventBusServiceLocator.on(SIGNALS.PARTICLES),
    []
  ) as boolean;
  return <Button icon="lib_actions_particles" onClick={onClick} isActive={isEnabled} />;
}

interface HeatmapButtonsProps {
  serviceLocatorUid: string;
}

function HeatmapButtons({ serviceLocatorUid }: HeatmapButtonsProps) {
  const currentSignal = useObservable(
    getServiceLocators(serviceLocatorUid).eventBusServiceLocator.on(SIGNALS.HEATMAP),
    []
  ) as string;
  const eventBusServiceLocator = getServiceLocators(serviceLocatorUid).eventBusServiceLocator;

  function toggleHeatMapSignal(signal: string) {
    eventBusServiceLocator.on(SIGNALS.HEATMAP).once((currentSignal: string) => {
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
          key: SIGNAL_VALUES.HEATMAP_ERROR_RATE,
          onClick: () => toggleHeatMapSignal(SIGNAL_VALUES.HEATMAP_ERROR_RATE)
        }
      ]}
      activeKey={currentSignal}
    />
  );
}
