/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { Button, Stack } from '@instana/components';

import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import getAlertConfigFromLegacyEvent from 'in-alerting/migration/subscriptions/getAlertConfigFromLegacyEvent';
import { disableMigratedCustomEventSpecification } from 'in-api/eventSpecifications';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { teamSettingsAlertingEvents } from 'in-settings/navigation/paths';
import { isLoading } from 'in-services/util/result';
import { goToPath } from 'in-stores/navigation';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export default function MigrateToSmartAlerts({ eventSpecificationId }) {
  const [disablingEvent, setDisablingEvent] = useState(false);
  const [migrating, setMigrating] = useState(false);

  return (
    <Stack direction="horizontal" gap="xsmall">
      <Tooltip content={t('in-alerting:smartAlerts.migration.markAsMigratedButtonTooltip')}>
        <Button
          kind="secondary"
          onClick={() => handleDisableCustomEvent(setDisablingEvent, eventSpecificationId)}
          icon={disablingEvent ? 'lib_actions_loading' : undefined}
          iconSpinning={disablingEvent}
        >
          {t('in-alerting:smartAlerts.migration.markAsMigratedButton')}
        </Button>
      </Tooltip>
      <Tooltip content={t('in-alerting:smartAlerts.migration.migrateButtonTooltip')}>
        <Button
          kind="primaryv2"
          onClick={() => doMigration({ eventSpecificationId, setMigrating })}
          icon={migrating ? 'lib_actions_loading' : undefined}
          iconSpinning={migrating}
        >
          {t('in-alerting:smartAlerts.migration.migrateButton')}
        </Button>
      </Tooltip>
    </Stack>
  );
}

function doMigration({ eventSpecificationId, setMigrating }) {
  getAlertConfigFromLegacyEvent({ eventSpecificationId })
    .filter(res => !isLoading(res))
    .map(res => res?.data ?? {})
    .map(({ globalApplicationsAlertConfig, applicationAlertConfig, globalSmartAlert }) => ({
      globalSmartAlert,
      config: globalSmartAlert ? globalApplicationsAlertConfig : applicationAlertConfig
    }))
    .once(res => showSmartAlertDialog({ eventSpecificationId, setMigrating, ...res }));
}

function showSmartAlertDialog({ globalSmartAlert, config, eventSpecificationId, setMigrating }) {
  if (config) {
    addActiveDialog(
      <SmartAlertConfigDialogWrapper
        applicationLabel={config.name}
        alertConfig={config}
        onClose={savedAlertConfig => {
          const applicationAlertConfigId = savedAlertConfig.id;
          if (applicationAlertConfigId) {
            handleDisableCustomEvent(setMigrating, eventSpecificationId, applicationAlertConfigId);
          }
          close();
        }}
        isGlobalSmartAlert={globalSmartAlert}
        editMode
      />
    );
  }
}

function handleDisableCustomEvent(setDisablingEvent, eventSpecificationId, applicationAlertConfigId) {
  setDisablingEvent(true);

  disableMigratedCustomEventSpecification(eventSpecificationId, applicationAlertConfigId).once(
    () => {
      setDisablingEvent(false);
      goToPath(teamSettingsAlertingEvents);
    },
    () => setDisablingEvent(false)
  );
}
