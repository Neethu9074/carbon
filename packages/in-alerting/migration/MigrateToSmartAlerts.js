/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { Button, Stack } from '@instana/components';

import {
  applicationsAlertingDeprecatedEventConfirmMigrated,
  applicationsAlertingDeprecatedEventMarkMigrated,
  applicationsAlertingDeprecatedEventMigrateStarted,
  applicationsAlertingDeprecatedEventMigrateFinished
} from 'in-alerting/smart-alerts/applications/tracker';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import getAlertConfigFromLegacyEvent from 'in-alerting/migration/subscriptions/getAlertConfigFromLegacyEvent';
import { disableMigratedCustomEventSpecification } from 'in-api/eventSpecifications';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { teamSettingsAlertingEvents } from 'in-settings/navigation/paths';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { isLoading } from 'in-services/util/result';
import { goToPath } from 'in-stores/navigation';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export default function MigrateToSmartAlerts({ eventSpecificationId }) {
  // state for the final loading indicators when the action is triggered
  const [disablingEvent, setDisablingEvent] = useState(false);
  const [migrating, setMigrating] = useState(false);

  // state for the general migration being in progress by the user, which includes the backend operation and the dialog being
  // active to e.g. ensure the dialog cannot be opened multiple times, and to disable the button in that period.
  const [migrationInProgress, setMigrationInProgress] = useState(false);

  return (
    <Stack direction="horizontal" gap="xsmall">
      <Tooltip content={t('in-alerting:smartAlerts.migration.markAsMigratedButtonTooltip')} delay={500}>
        <Button
          kind="secondary"
          onClick={() => showMigrationConfirmation(eventSpecificationId, setDisablingEvent)}
          icon={disablingEvent ? 'lib_actions_loading' : undefined}
          iconSpinning={disablingEvent}
        >
          {t('in-alerting:smartAlerts.migration.markAsMigratedButton')}
        </Button>
      </Tooltip>
      <Tooltip content={t('in-alerting:smartAlerts.migration.migrateButtonTooltip')} delay={500}>
        <Button
          kind="primaryv2"
          onClick={() => doMigration(eventSpecificationId, setMigrating, migrationInProgress, setMigrationInProgress)}
          icon={migrating ? 'lib_actions_loading' : undefined}
          iconSpinning={migrating}
          // TODO unfortunately when we disable the button, which would be the right thing to do here after the user clicks the
          //      button, then the wrapping tooltip get stuck and does not disappear anymore. Consequently, the following line
          //      can be included as soon as that misbehaviour of the tooltip is resolved.
          // disabled={migrationInProgress}
        >
          {t('in-alerting:smartAlerts.migration.migrateButton')}
        </Button>
      </Tooltip>
    </Stack>
  );
}

function showMigrationConfirmation(eventSpecificationId, setDisablingEvent) {
  applicationsAlertingDeprecatedEventMarkMigrated({
    eventSpecificationId
  });
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-alerting:smartAlerts.migration.markAsMigratedButtonConfirmationTitle')}
      description={t('in-alerting:smartAlerts.migration.markAsMigratedButtonConfirmationDescription')}
      confirmButtonLabel={t('in-alerting:smartAlerts.migration.markAsMigratedButtonConfirmationConfirmLabel')}
      onSubmit={() => {
        applicationsAlertingDeprecatedEventConfirmMigrated({ eventSpecificationId });
        handleDisableCustomEvent(setDisablingEvent, eventSpecificationId);
        close();
      }}
    />
  );
}

function doMigration(eventSpecificationId, setMigrating, migrationInProgress, setMigrationInProgress) {
  if (migrationInProgress) {
    return;
  }

  setMigrationInProgress(true);
  getAlertConfigFromLegacyEvent({ eventSpecificationId })
    .filter(res => !isLoading(res))
    .map(res => res?.data ?? {})
    .map(({ globalApplicationsAlertConfig, applicationAlertConfig, globalSmartAlert, scopeMigrationDetails }) => ({
      globalSmartAlert,
      config: globalSmartAlert ? globalApplicationsAlertConfig : applicationAlertConfig,
      scopeMigrationDetails
    }))
    .once(
      res => showSmartAlertDialog({ eventSpecificationId, setMigrating, setMigrationInProgress, ...res }),
      () => setMigrationInProgress(false)
    );
}

function showSmartAlertDialog({
  globalSmartAlert,
  config,
  scopeMigrationDetails,
  eventSpecificationId,
  setMigrating,
  setMigrationInProgress
}) {
  applicationsAlertingDeprecatedEventMigrateStarted({ eventSpecificationId });
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
          applicationsAlertingDeprecatedEventMigrateFinished({ eventSpecificationId });
          setMigrationInProgress(false);
          close();
        }}
        isGlobalSmartAlert={globalSmartAlert}
        scopeMigrationDetails={scopeMigrationDetails}
        editMode
        migrationMode
      />
    );
  }
}

function handleDisableCustomEvent(setPendingState, eventSpecificationId, applicationAlertConfigId) {
  setPendingState(true);

  disableMigratedCustomEventSpecification(eventSpecificationId, applicationAlertConfigId).once(
    () => {
      setPendingState(false);
      goToPath(teamSettingsAlertingEvents);
    },
    () => setPendingState(false)
  );
}
