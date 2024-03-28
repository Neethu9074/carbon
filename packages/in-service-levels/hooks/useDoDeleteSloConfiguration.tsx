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
import { deleteSloConfiguration } from 'in-service-levels/api/configuration';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { trackSloEvent } from 'in-service-levels/hooks/SloTrackerProvider';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { serviceLevelsRoot } from 'in-service-levels/navigation/path';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { t, Trans } from 'in-i18n';

type CompletionCallback = (success: boolean) => void;
type DoFunction = () => void;

export default function useDoDeleteSloConfiguration(
  configuration: ServiceLevelObjectiveConfiguration,
  onComplete?: CompletionCallback
): DoFunction {
  const location = useLocation();
  const rootPath = serviceLevelsRoot === location?.pathname;
  return () => {
    showConfirmationDialog(configuration, onComplete, rootPath);
  };
}

function showConfirmationDialog(
  configuration: ServiceLevelObjectiveConfiguration,
  onComplete?: CompletionCallback,
  rootPath?: boolean
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
        onDelete(configuration, onComplete, rootPath);
      }}
    />
  );

  trackSloEvent(SLO_CONFIG_DELETE_START, {
    id: configuration.id,
    blueprint: configuration.indicator.blueprint,
    entityType: configuration.entity.type,
    indicatorType: configuration.indicator.type,
    timeWindowType: configuration.timeWindow.type,
    productArea: productAreas.slo,
    pageName: rootPath ? pageNames.service_levels : pageNames.slo_config
  });
}

function onDelete(
  configuration: ServiceLevelObjectiveConfiguration,
  onComplete?: CompletionCallback,
  rootPath?: boolean
): void {
  deleteSloConfiguration(configuration.id!).once(
    () => {
      onDeleteSuccess(configuration, rootPath);
      onComplete?.(true);
    },
    () => {
      onDeleteFailed(configuration, rootPath);
      onComplete?.(false);
    }
  );
}

function onDeleteSuccess(configuration: ServiceLevelObjectiveConfiguration, rootPath?: boolean): void {
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
    productArea: productAreas.slo,
    pageName: rootPath ? pageNames.service_levels : pageNames.slo_config
  });
}

function onDeleteFailed(configuration: ServiceLevelObjectiveConfiguration, rootPath?: boolean): void {
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
    productArea: productAreas.slo,
    pageName: rootPath ? pageNames.service_levels : pageNames.slo_config
  });
}
