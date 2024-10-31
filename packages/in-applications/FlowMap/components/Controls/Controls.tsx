/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, useEffect } from 'react';

import { ButtonGroup, LinkProps } from '@instana/components';
import { ResultPrecisionDetails } from '@instana/types';
import { useObservable } from '@instana/hooks';

import HorizontalControlsPresenter from 'in-components/MapControls/HorizontalControlsPresenter';
import VerticalControlsPresenter from 'in-components/MapControls/VerticalControlsPresenter';
import { getServiceLocators } from 'in-applications/FlowMap/serviceLocator/serviceLocator';
import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import MapButtonGroup from 'in-components/MapControls/ButtonGroup';
import Button from 'in-components/MapControls/Button';
import Tooltip from 'in-components/Tooltip';
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
  entity: 'endpoint' | 'service';
}

export default function Controls({ serviceLocatorUid, resultPrecisionDetails, entity }: Props) {
  const { trackFlowMapSimulationClicked } = useApplicationTracker();
  const eventBusServiceLocator = getServiceLocators(serviceLocatorUid).eventBusServiceLocator;
  const hasApproximateData = resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE';

  useEffect(() => {
    eventBusServiceLocator.emit(SIGNALS.PARTICLES, false);
    eventBusServiceLocator.emit(SIGNALS.HEATMAP, SIGNAL_VALUES.HEATMAP_CALLS);
  }, [eventBusServiceLocator]);

  return (
    <Fragment>
      <HorizontalControlsPresenter position="topLeft">
        <MapButtonGroup>
          <HeatmapButtons serviceLocatorUid={serviceLocatorUid} entity={entity} />
          {hasApproximateData && (
            <MultiLineToolTipIcon lines={[t('in-components:approximateDataIndicator.dataRetention')]} />
          )}
        </MapButtonGroup>
      </HorizontalControlsPresenter>
      <VerticalControlsPresenter position="leftTop">
        <ParticlesButton
          onClick={() => toggleParticles(trackFlowMapSimulationClicked)}
          serviceLocatorUid={serviceLocatorUid}
        />
        <MapButtonGroup vertical>
          <Tooltip themeStyle="light" align={'rightMiddle'} content={t('in-applications:applicationMap.tooltipZoomIn')}>
            <Button appendBottom icon="lib_actions_zoom_in" onClick={() => zoomIn(serviceLocatorUid)} />
          </Tooltip>
          <Tooltip
            themeStyle="light"
            align={'rightMiddle'}
            content={t('in-applications:applicationMap.tooltipZoomOut')}
          >
            <Button appendTop icon="lib_actions_zoom_out" onClick={() => zoomOut(serviceLocatorUid)} />
          </Tooltip>
        </MapButtonGroup>
      </VerticalControlsPresenter>
    </Fragment>
  );

  function toggleParticles(trackFlowMapSimulationClicked: (payload?: object) => void) {
    eventBusServiceLocator.on(SIGNALS.PARTICLES).once((_signal: string) => {
      trackFlowMapSimulationClicked({ entity, toggle: !_signal });
      eventBusServiceLocator.emit(SIGNALS.PARTICLES, !_signal);
    });
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
  return (
    <Tooltip
      themeStyle="light"
      align={'rightMiddle'}
      content={t('in-applications:applicationMap.tooltipSimulateTraffic')}
    >
      <Button icon="lib_actions_particles" onClick={onClick} isActive={isEnabled} />
    </Tooltip>
  );
}

interface HeatmapButtonsProps {
  serviceLocatorUid: string;
  entity: 'endpoint' | 'service';
}

function HeatmapButtons({ serviceLocatorUid, entity }: HeatmapButtonsProps) {
  const { trackFlowMapCallsClicked, trackFlowMapLatencyClicked, trackFlowMapErrorClicked } = useApplicationTracker();
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
          onClick: () => {
            trackFlowMapCallsClicked({ entity });
            toggleHeatMapSignal(SIGNAL_VALUES.HEATMAP_CALLS);
          }
        },
        {
          text: t('in-applications:labelLatency'),
          key: SIGNAL_VALUES.HEATMAP_LATENCY,
          onClick: () => {
            trackFlowMapLatencyClicked({ entity });
            toggleHeatMapSignal(SIGNAL_VALUES.HEATMAP_LATENCY);
          }
        },
        {
          text: t('in-applications:labelErrors'),
          key: SIGNAL_VALUES.HEATMAP_ERROR_RATE,
          onClick: () => {
            trackFlowMapErrorClicked({ entity });
            toggleHeatMapSignal(SIGNAL_VALUES.HEATMAP_ERROR_RATE);
          }
        }
      ]}
      activeKey={currentSignal}
    />
  );
}
