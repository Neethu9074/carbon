/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { CorrectionConfiguration } from '@instana/types';

import {
  SLO_CORRECTION_WINDOW_TOGGLE_ERROR,
  SLO_CORRECTION_WINDOW_TOGGLE_FINISH,
  SLO_CORRECTION_WINDOW_TOGGLE_START
} from 'in-services/tracking/eventNames';
import { UnstableTrackingFunction, useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { updateCorrectionConfiguration } from 'in-service-levels/api/correctionConfiguration';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import { SloTrackingMeta } from 'in-service-levels/types';
import { isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

type CompletionCallback = (success: boolean) => void;

export default function useToggleCorrectionConfiguration(
  configuration: CorrectionConfiguration,
  meta: SloTrackingMeta,
  onComplete: CompletionCallback
) {
  const { trackCta, unstable_trackEvent } = useSegmentTracking();

  const updatedConfig = { ...configuration, active: !configuration.active };

  return () => {
    trackCta(SLO_CORRECTION_WINDOW_TOGGLE_START, {
      id: configuration.id,
      recurrentRule: configuration.scheduling?.recurrentRule,
      duration: configuration.scheduling?.duration,
      durationUnit: configuration.scheduling?.durationUnit,
      startTime: configuration.scheduling?.startTime,
      recurrent: configuration.scheduling?.recurrent,
      active: configuration.active,
      productArea: meta.productArea,
      pageName: meta.pageName
    });
    doToggle(updatedConfig, meta, onComplete, unstable_trackEvent);
  };
}

function doToggle(
  configuration: CorrectionConfiguration,
  meta: SloTrackingMeta,
  onComplete: CompletionCallback,
  unstable_trackEvent: UnstableTrackingFunction
): void {
  updateCorrectionConfiguration(configuration)
    .filter(res => !isLoading(res))
    .once(
      () => {
        onDeleteSuccess(configuration, meta, unstable_trackEvent);
        onComplete(true);
      },
      () => {
        onDeleteFailed(configuration, meta, unstable_trackEvent);
        onComplete(false);
      }
    );
}

function onDeleteSuccess(
  configuration: CorrectionConfiguration,
  meta: SloTrackingMeta,
  track: UnstableTrackingFunction
): void {
  addMessage(
    {
      type: 'info',
      timeout: 2000,
      content: t('in-service-levels:hooks.useToggleCorrectionConfiguration.success', {
        context: configuration.active ? 'enabled' : 'disabled',
        name: configuration.name
      })
    },
    'correction-configuration-toggle-info'
  );

  track(
    UPDATED_OBJECT,
    {
      productArea: meta.productArea,
      pageName: meta.pageName,
      objectType: SLO_CORRECTION_WINDOW_TOGGLE_FINISH
    },
    {
      id: configuration.id,
      recurrentRule: configuration.scheduling?.recurrentRule,
      duration: configuration.scheduling?.duration,
      durationUnit: configuration.scheduling?.durationUnit,
      startTime: configuration.scheduling?.startTime,
      recurrent: configuration.scheduling?.recurrent,
      active: configuration.active
    }
  );
}

function onDeleteFailed(
  configuration: CorrectionConfiguration,
  meta: SloTrackingMeta,
  track: UnstableTrackingFunction
): void {
  addMessage(
    {
      type: 'danger',
      timeout: 3000,
      content: t('in-service-levels:hooks.useToggleCorrectionConfiguration.failure')
    },
    'correction-configuration-toggle-error'
  );

  track(
    UPDATED_OBJECT,
    {
      productArea: meta.productArea,
      pageName: meta.pageName,
      objectType: SLO_CORRECTION_WINDOW_TOGGLE_ERROR
    },
    {
      id: configuration.id,
      recurrentRule: configuration.scheduling?.recurrentRule,
      duration: configuration.scheduling?.duration,
      durationUnit: configuration.scheduling?.durationUnit,
      startTime: configuration.scheduling?.startTime,
      recurrent: configuration.scheduling?.recurrent,
      active: configuration.active
    }
  );
}
