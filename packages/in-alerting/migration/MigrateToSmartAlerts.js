/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';
import { empty } from '@instana/observables';

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
  const [doMigrate, setDoMigrate] = useState(false);
  const [pausingAlerts, setPausingAlerts] = useState(false);

  const migratedConfigRes = useObservable(
    () => (doMigrate ? getAlertConfigFromLegacyEvent({ eventSpecificationId }) : empty),
    [doMigrate]
  );

  const { globalApplicationsAlertConfig, applicationAlertConfig, globalSmartAlert } = migratedConfigRes?.data ?? {};
  const config = globalSmartAlert ? globalApplicationsAlertConfig : applicationAlertConfig;
  const migrating = isLoading(migratedConfigRes);

  useEffect(() => {
    if (config && !migrating) {
      addActiveDialog(
        <SmartAlertConfigDialogWrapper
          applicationLabel={config.name}
          formData={config}
          onClose={savedAlertConfig => {
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

            setDoMigrate(false);
            close();
          }}
          isGlobalSmartAlert={globalSmartAlert}
          editMode
        />
      );
    }
  }, [migrating, config, globalSmartAlert, eventSpecificationId]);

  const spinning = migrating || pausingAlerts;

  return (
    <div>
      <Tooltip content={t('in-alerting:smartAlerts.migration.migrateButtonTooltip')}>
        <Button
          kind="primaryv2"
          onClick={() => setDoMigrate(true)}
          icon={spinning ? 'lib_actions_loading' : null}
          iconSpinning={spinning}
        >
          {t('in-alerting:smartAlerts.migration.migrateButton')}
        </Button>
      </Tooltip>
    </div>
  );
}
