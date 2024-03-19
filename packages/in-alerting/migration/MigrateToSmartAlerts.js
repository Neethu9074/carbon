/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { Stack } from '@instana/components';
import { Button } from '@instana/legacy';

import {
  applicationsAlertingDeprecatedEventConfirmMigrated,
  applicationsAlertingDeprecatedEventMarkMigrated,
  applicationsAlertingDeprecatedEventMigrateStarted,
  applicationsAlertingDeprecatedEventMigrateFinished
} from 'in-alerting/smart-alerts/applications/tracker';
import getAlertConfigFromLegacyEvent from 'in-alerting/migration/subscriptions/getAlertConfigFromLegacyEvent';
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import { disableMigratedCustomEventSpecification } from 'in-api/eventSpecifications';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { teamSettingsAlertingEvents } from 'in-settings/navigation/paths';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { isLoading } from 'in-services/util/result';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export default function MigrateToSmartAlerts({ eventSpecificationId }) {
  const { goToPath } = useNavigation();

  // state for the final loading indicators when the action is triggered
  const [disablingEvent, setDisablingEvent] = useState(false);
  const [migrating, setMigrating] = useState(false);

  // state for the general migration being in progress by the user, which includes the backend operation and the dialog being
  // active to e.g. ensure the dialog cannot be opened multiple times, and to disable the button in that period.
  const [migrationInProgress, setMigrationInProgress] = useState(false);

  const onSuccess = () => goToPath(teamSettingsAlertingEvents);

  return (
    <Stack direction="horizontal" gap="xsmall">
      <Tooltip content={t('in-alerting:smartAlerts.migration.markAsMigratedButtonTooltip')} delay={500}>
        <Button
          kind="secondary"
          onClick={() => showMigrationConfirmation(eventSpecificationId, setDisablingEvent, onSuccess)}
          icon={disablingEvent ? 'lib_actions_loading' : undefined}
          iconSpinning={disablingEvent}
        >
          {t('in-alerting:smartAlerts.migration.markAsMigratedButton')}
        </Button>
      </Tooltip>
      <Tooltip content={t('in-alerting:smartAlerts.migration.migrateButtonTooltip')} delay={500}>
        <Button
          kind="primaryv2"
          onClick={() =>
            doMigration(eventSpecificationId, setMigrating, migrationInProgress, setMigrationInProgress, onSuccess)
          }
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

function showMigrationConfirmation(eventSpecificationId, setDisablingEvent, onSuccess) {
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
        handleDisableCustomEvent({ setPendingState: setDisablingEvent, onSuccess, eventSpecificationId });
        close();
      }}
    />
  );
}

function doMigration(eventSpecificationId, setMigrating, migrationInProgress, setMigrationInProgress, onSuccess) {
  if (migrationInProgress) {
    return;
  }
  setMigrationInProgress(true);
  getAlertConfigFromLegacyEvent({ eventSpecificationId })
    .filter(res => !isLoading(res))
    .once(
      res => {
        const data = res?.data ?? {};
        const { globalApplicationsAlertConfig, applicationAlertConfig, globalSmartAlert, scopeMigrationDetails } = data;

        const config = globalSmartAlert ? globalApplicationsAlertConfig : applicationAlertConfig;
        showSmartAlertDialog({
          eventSpecificationId,
          setMigrating,
          setMigrationInProgress,
          onSuccess,
          globalSmartAlert,
          config,
          scopeMigrationDetails
        });
      },
      () => setMigrationInProgress(false)
    );
}

function showSmartAlertDialog({
  globalSmartAlert,
  config,
  scopeMigrationDetails,
  eventSpecificationId,
  setMigrating,
  setMigrationInProgress,
  onSuccess
}) {
  applicationsAlertingDeprecatedEventMigrateStarted({ eventSpecificationId });
  if (config) {
    addActiveDialog(
      <AlertConfigDialog
        applicationLabel={config.name}
        alertConfig={config}
        onClose={savedAlertConfig => {
          const applicationAlertConfigId = savedAlertConfig.id;
          if (applicationAlertConfigId) {
            handleDisableCustomEvent({
              setPendingState: setMigrating,
              onSuccess,
              eventSpecificationId,
              applicationAlertConfigId
            });
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

function handleDisableCustomEvent({ setPendingState, onSuccess, eventSpecificationId, applicationAlertConfigId }) {
  setPendingState(true);

  disableMigratedCustomEventSpecification(eventSpecificationId, applicationAlertConfigId).once(
    () => {
      setPendingState(false);
      onSuccess();
    },
    () => setPendingState(false)
  );
}
