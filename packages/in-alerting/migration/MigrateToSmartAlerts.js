/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, useEffect } from 'react';

import { Stack, Button } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  APPLICATIONS_ALERTING_DEPRECATED_EVENT_MARK_MIGRATED,
  APPLICATIONS_ALERTING_DEPRECATED_EVENT_CONFIRM_MIGRATED,
  APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_STARTED,
  APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_FINISHED
} from 'in-services/tracking/tracking';
import {
  applicationSmartAlertFullScreenDesignEnabled,
  applicationSmartAlertDialogView
} from 'in-services/featureFlags';
import getAlertConfigFromLegacyEvent from 'in-alerting/migration/subscriptions/getAlertConfigFromLegacyEvent';
import CreateSmartAlertButton from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton';
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import { disableMigratedCustomEventSpecification } from 'in-api/eventSpecifications';
import { getButtonName } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { globalSettingsAlertingEvents } from 'in-settings/navigation/paths';
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

  const onSuccess = () => goToPath(globalSettingsAlertingEvents);
  const isGlobalSmartAlertConfig = useObservable(
    getAlertConfigFromLegacyEvent({ eventSpecificationId }).map(({ data }) => {
      return data && data.globalSmartAlert;
    }),
    [eventSpecificationId]
  );

  // this adds an event listener to the `keyup` event, allowing us to detect when the `escape` key is pressed and set the `setMigrationInProgress` to false. or else, after closing the migration modal with the escape key, subsequent presses of the "Migrate to Smart Alert" button fail to open the alert modal.
  useEffect(() => {
    const handleEsc = event => {
      if (event.key === 'Escape') {
        setMigrationInProgress(false);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const { trackCta } = useSegmentTracking();

  return (
    <Stack direction="horizontal" gap="xsmall">
      <Tooltip content={t('in-alerting:smartAlerts.migration.markAsMigratedButtonTooltip')} delay={500}>
        <Button
          noAutoMargin
          kind="secondary"
          onClick={() => showMigrationConfirmation(eventSpecificationId, setDisablingEvent, onSuccess, trackCta)}
          icon={disablingEvent ? 'lib_actions_loading' : undefined}
          iconSpinning={disablingEvent}
        >
          {t('in-alerting:smartAlerts.migration.markAsMigratedButton')}
        </Button>
      </Tooltip>
      {applicationSmartAlertDialogView && (
        <Tooltip content={t('in-alerting:smartAlerts.migration.migrateButtonTooltip')} delay={500} align="bottomRight">
          <Button
            kind="primaryv2"
            noAutoMargin
            onClick={() =>
              doMigration(
                eventSpecificationId,
                setMigrating,
                migrationInProgress,
                setMigrationInProgress,
                onSuccess,
                trackCta
              )
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
      )}
      {applicationSmartAlertFullScreenDesignEnabled && (
        <Tooltip content={t('in-alerting:smartAlerts.migration.migrateButtonTooltip')} delay={500} align="bottomRight">
          <CreateSmartAlertButton
            isGlobal={isGlobalSmartAlertConfig}
            isFloatingButton={false}
            buttonName={getButtonName(t('in-alerting:smartAlerts.migration.migrateButton'))}
            isMigrate
            eventSpecificationId={eventSpecificationId}
          />
        </Tooltip>
      )}
    </Stack>
  );
}

function showMigrationConfirmation(eventSpecificationId, setDisablingEvent, onSuccess, trackCta) {
  trackCta(APPLICATIONS_ALERTING_DEPRECATED_EVENT_MARK_MIGRATED, { eventSpecificationId });

  addActiveDialog(
    <ConfirmationDialog
      header={t('in-alerting:smartAlerts.migration.markAsMigratedButtonConfirmationTitle')}
      description={t('in-alerting:smartAlerts.migration.markAsMigratedButtonConfirmationDescription')}
      confirmButtonLabel={t('in-alerting:smartAlerts.migration.markAsMigratedButtonConfirmationConfirmLabel')}
      onSubmit={() => {
        trackCta(APPLICATIONS_ALERTING_DEPRECATED_EVENT_CONFIRM_MIGRATED, { eventSpecificationId });

        handleDisableCustomEvent({ setPendingState: setDisablingEvent, onSuccess, eventSpecificationId });
        close();
      }}
    />
  );
}

function doMigration(
  eventSpecificationId,
  setMigrating,
  migrationInProgress,
  setMigrationInProgress,
  onSuccess,
  trackCta
) {
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
          scopeMigrationDetails,
          trackCta
        });
      },
      () => setMigrationInProgress(false)
    );
}

export function doMigrationInTearSheet(eventSpecificationId) {
  return getAlertConfigFromLegacyEvent({ eventSpecificationId })
    .filter(res => !isLoading(res))
    .map(({ data }) => data);
}

function showSmartAlertDialog({
  globalSmartAlert,
  config,
  scopeMigrationDetails,
  eventSpecificationId,
  setMigrating,
  setMigrationInProgress,
  onSuccess,
  trackCta
}) {
  trackCta(APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_STARTED, { eventSpecificationId });

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
          trackCta(APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_FINISHED, { eventSpecificationId });
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
