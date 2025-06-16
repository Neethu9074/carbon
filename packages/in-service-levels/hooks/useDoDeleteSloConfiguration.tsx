/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { Typography } from '@instana/components';

import {
  SLO_CONFIG_DELETE_ERROR,
  SLO_CONFIG_DELETE_FINISH,
  SLO_CONFIG_DELETE_START
} from 'in-services/tracking/eventNames';
import {
  CtaTrackingFunction,
  UnstableTrackingFunction,
  useSegmentTracking
} from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close as closeDialog } from 'in-components/DialogPresenter/store';
import { deleteSloConfiguration } from 'in-service-levels/api/sloConfiguration';
import { DELETED_OBJECT, UPDATED_OBJECT } from 'in-services/util/constants';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { ProductArea } from 'in-services/tracking/productAreas';
import { PageName } from 'in-services/tracking/pageNames';
import { t, Trans } from 'in-i18n';

type CompletionCallback = (success: boolean) => void;
type DoFunction = () => void;

interface SloTrackingMeta {
  productArea: ProductArea;
  pageName: PageName;
}

export default function useDoDeleteSloConfiguration(
  configuration: ServiceLevelObjectiveConfiguration,
  meta: SloTrackingMeta,
  onComplete?: CompletionCallback
): DoFunction {
  const { trackCta, unstable_trackEvent } = useSegmentTracking();

  return () => {
    showConfirmationDialog(configuration, meta, onComplete, trackCta, unstable_trackEvent);
  };
}

function showConfirmationDialog(
  configuration: ServiceLevelObjectiveConfiguration,
  meta: SloTrackingMeta,
  onComplete: CompletionCallback | undefined,
  trackCta: CtaTrackingFunction,
  unstable_trackEvent: UnstableTrackingFunction
): void {
  const { name } = configuration;
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-service-levels:general.deleteDialog.confirmRemove')}
      description={
        <Typography variant="body-regular">
          <Trans
            i18nKey="in-service-levels:general.deleteDialog.confirmRemoveMsg"
            values={{ name }}
            components={{ italic: <i />, bold: <strong /> }}
          />
        </Typography>
      }
      confirmButtonLabel={t('in-service-levels:general.deleteDialog.delete')}
      onSubmit={() => {
        closeDialog();
        onDelete(configuration, meta, onComplete, unstable_trackEvent);
      }}
    />
  );

  trackCta(SLO_CONFIG_DELETE_START, {
    id: configuration.id,
    blueprint: configuration.indicator.blueprint,
    entityType: configuration.entity.type,
    indicatorType: configuration.indicator.type,
    timeWindowType: configuration.timeWindow.type,
    productArea: meta.productArea,
    pageName: meta.pageName
  });
}

function onDelete(
  configuration: ServiceLevelObjectiveConfiguration,
  meta: SloTrackingMeta,
  onComplete: CompletionCallback | undefined,
  track: UnstableTrackingFunction
): void {
  deleteSloConfiguration(configuration.id!).once(
    () => {
      onDeleteSuccess(configuration, meta, track);
      onComplete?.(true);
    },
    () => {
      onDeleteFailed(configuration, meta, track);
      onComplete?.(false);
    }
  );
}

function onDeleteSuccess(
  configuration: ServiceLevelObjectiveConfiguration,
  meta: SloTrackingMeta,
  track: UnstableTrackingFunction
): void {
  addMessage(
    {
      type: 'info',
      timeout: 2000,
      content: t('in-service-levels:hooks.useDoDeleteSloConfiguration.success')
    },
    'slo-delete-info'
  );

  track(
    DELETED_OBJECT,
    {
      productArea: meta.productArea,
      pageName: meta.pageName,
      objectType: SLO_CONFIG_DELETE_FINISH
    },
    {
      id: configuration.id,
      blueprint: configuration.indicator.blueprint,
      entityType: configuration.entity.type,
      indicatorType: configuration.indicator.type,
      timeWindowType: configuration.timeWindow.type
    }
  );
}

function onDeleteFailed(
  configuration: ServiceLevelObjectiveConfiguration,
  meta: SloTrackingMeta,
  track: UnstableTrackingFunction
): void {
  addMessage(
    {
      type: 'danger',
      timeout: 3000,
      content: t('in-service-levels:hooks.useDoDeleteSloConfiguration.failure')
    },
    'slo-delete-error'
  );

  track(
    UPDATED_OBJECT,
    {
      productArea: meta.productArea,
      pageName: meta.pageName,
      objectType: SLO_CONFIG_DELETE_ERROR
    },
    {
      id: configuration.id,
      blueprint: configuration.indicator.blueprint,
      entityType: configuration.entity.type,
      indicatorType: configuration.indicator.type,
      timeWindowType: configuration.timeWindow.type
    }
  );
}
