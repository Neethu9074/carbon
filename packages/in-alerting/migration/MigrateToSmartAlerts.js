/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { Button } from '@instana/components';

import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import { disableGlobalAlertConfig } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import getAlertConfigFromLegacyEvent from 'in-alerting/migration/subscriptions/getAlertConfigFromLegacyEvent';
import { disableAlertConfig } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { setCustomEventSpecificationsEnabled } from 'in-api/eventSpecifications';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { teamSettingsAlertingEvents } from 'in-settings/navigation/paths';
import { isLoading } from 'in-services/util/result';
import { goToPath } from 'in-stores/navigation';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export default function MigrateToSmartAlerts({ eventSpecificationId }) {
  const [pausingAlerts, setPausingAlerts] = useState(false);
  const [migrating, setMigrating] = useState(false);

  const spinning = migrating || pausingAlerts;

  return (
    <div>
      <Tooltip content={t('in-alerting:smartAlerts.migration.migrateButtonTooltip')}>
        <Button
          kind="primaryv2"
          onClick={() => doMigration({ eventSpecificationId, setPausingAlerts, setMigrating })}
          icon={spinning ? 'lib_actions_loading' : null}
          iconSpinning={spinning}
        >
          {t('in-alerting:smartAlerts.migration.migrateButton')}
        </Button>
      </Tooltip>
    </div>
  );
}

function doMigration({ eventSpecificationId, setPausingAlerts, setMigrating }) {
  setMigrating(true);
  getAlertConfigFromLegacyEvent({ eventSpecificationId })
    .filter(res => !isLoading(res))
    .tap(() => setMigrating(false))
    .map(res => res?.data ?? {})
    .map(({ globalApplicationsAlertConfig, applicationAlertConfig, globalSmartAlert }) => ({
      globalSmartAlert,
      config: globalSmartAlert ? globalApplicationsAlertConfig : applicationAlertConfig
    }))
    .once(res => showSmartAlertDialog({ eventSpecificationId, setPausingAlerts, ...res }));
}

function showSmartAlertDialog({ globalSmartAlert, config, eventSpecificationId, setPausingAlerts }) {
  if (config) {
    addActiveDialog(
      <SmartAlertConfigDialogWrapper
        applicationLabel={config.name}
        alertConfig={config}
        onClose={savedAlertConfig => {
          if (savedAlertConfig.id) {
            handleSuccessfulMigration(globalSmartAlert, setPausingAlerts, savedAlertConfig, eventSpecificationId);
          }
          close();
        }}
        isGlobalSmartAlert={globalSmartAlert}
        editMode
      />
    );
  }
}

function handleSuccessfulMigration(globalSmartAlert, setPausingAlerts, savedAlertConfig, eventSpecificationId) {
  const disableConfig = globalSmartAlert ? disableGlobalAlertConfig : disableAlertConfig;

  setPausingAlerts(true);

  disableConfig(savedAlertConfig.id).once(
    () => {
      setCustomEventSpecificationsEnabled(eventSpecificationId, false).once(
        () => {
          setPausingAlerts(false);
          goToPath(teamSettingsAlertingEvents);
        },
        () => setPausingAlerts(false)
      );
    },
    () => setPausingAlerts(false)
  );
}
