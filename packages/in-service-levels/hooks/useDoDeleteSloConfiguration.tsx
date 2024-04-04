/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { Typography } from '@instana/components';

import {
  SLO_CONFIG_DELETE_ERROR,
  SLO_CONFIG_DELETE_FINISH,
  SLO_CONFIG_DELETE_START
} from 'in-services/tracking/eventNames';
import { SloTrackingMeta, trackSloEvent, trackerContext } from 'in-service-levels/hooks/SloTrackerProvider';
import { deleteSloConfiguration } from 'in-service-levels/api/configuration';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { t, Trans } from 'in-i18n';

type CompletionCallback = (success: boolean) => void;
type DoFunction = () => void;

export default function useDoDeleteSloConfiguration(
  configuration: ServiceLevelObjectiveConfiguration,
  onComplete?: CompletionCallback
): DoFunction {
  const { meta } = useContext(trackerContext);
  return () => {
    showConfirmationDialog(configuration, meta, onComplete);
  };
}

function showConfirmationDialog(
  configuration: ServiceLevelObjectiveConfiguration,
  meta: SloTrackingMeta,
  onComplete?: CompletionCallback
): void {
  const { name } = configuration;
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-service-levels:general.deleteDialog.pleaseConfirm')}
      description={
        <Typography variant="body-regular">
          <Trans
            i18nKey="in-service-levels:general.deleteDialog.pleaseConfirmMsg"
            values={{ name }}
            components={{ italic: <i />, bold: <strong /> }}
          />
        </Typography>
      }
      confirmButtonLabel={t('in-service-levels:general.deleteDialog.delete')}
      onSubmit={() => {
        close();
        onDelete(configuration, meta, onComplete);
      }}
    />
  );

  trackSloEvent(SLO_CONFIG_DELETE_START, {
    id: configuration.id,
    blueprint: configuration.indicator.blueprint,
    entityType: configuration.entity.type,
    indicatorType: configuration.indicator.type,
    timeWindowType: configuration.timeWindow.type,
    productArea: meta?.productArea ?? productAreas.slo,
    pageName: meta?.pageName ?? pageNames.service_levels
  });
}

function onDelete(
  configuration: ServiceLevelObjectiveConfiguration,
  meta: SloTrackingMeta,
  onComplete?: CompletionCallback
): void {
  deleteSloConfiguration(configuration.id!).once(
    () => {
      onDeleteSuccess(configuration, meta);
      onComplete?.(true);
    },
    () => {
      onDeleteFailed(configuration, meta);
      onComplete?.(false);
    }
  );
}

function onDeleteSuccess(configuration: ServiceLevelObjectiveConfiguration, meta: SloTrackingMeta): void {
  addMessage(
    {
      type: 'info',
      timeout: 2000,
      content: t('in-service-levels:hooks.useDoDeleteSloConfiguration.success')
    },
    'slo-delete-info'
  );

  trackSloEvent(SLO_CONFIG_DELETE_FINISH, {
    id: configuration.id,
    blueprint: configuration.indicator.blueprint,
    entityType: configuration.entity.type,
    indicatorType: configuration.indicator.type,
    timeWindowType: configuration.timeWindow.type,
    productArea: meta?.productArea ?? productAreas.slo,
    pageName: meta?.pageName ?? pageNames.service_levels
  });
}

function onDeleteFailed(configuration: ServiceLevelObjectiveConfiguration, meta: SloTrackingMeta): void {
  addMessage(
    {
      type: 'danger',
      timeout: 3000,
      content: t('in-service-levels:hooks.useDoDeleteSloConfiguration.failure')
    },
    'slo-delete-error'
  );

  trackSloEvent(SLO_CONFIG_DELETE_ERROR, {
    id: configuration.id,
    blueprint: configuration.indicator.blueprint,
    entityType: configuration.entity.type,
    indicatorType: configuration.indicator.type,
    timeWindowType: configuration.timeWindow.type,
    productArea: meta?.productArea ?? productAreas.slo,
    pageName: meta?.pageName ?? pageNames.service_levels
  });
}
