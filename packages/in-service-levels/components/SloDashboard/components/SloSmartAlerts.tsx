/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import SloSmartAlertDetails from 'in-service-levels/components/SloDashboard/components/SloSmartAlertDetails';
import { serviceLevelsObjectiveAlertDetailsFullyQualified } from 'in-service-levels/navigation/path';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import FloatingActionButton from 'in-components/FloatingActionButton/FloatingActionButton';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/slo/CreateSmartAlertDialog';
import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { sloSmartAlertsEnabled } from 'in-services/featureFlags';
import Alerts from 'in-alerting/smart-alerts/slo/Alerts';
import { Nullish } from 'in-types';

interface SloAlertsProps {
  data: SloTabData;
}
interface SloAlertsWrapperProps {
  data: SloTabData | Nullish;
}

export default function SloSmartAlerts({ data }: SloAlertsWrapperProps) {
  const openCreateSmartAlertDialog = () =>
    addActiveDialog(<CreateSmartAlertDialog preselectedSloId={data?.configuration.id} />);
  if (!data) {
    return null;
  }
  return (
    <>
      {sloSmartAlertsEnabled && (
        <FloatingActionButtons>
          <FloatingActionButton icon="lib_alerts_create" kind="primaryv2" onClick={openCreateSmartAlertDialog}>
            {t('in-service-levels:general.addButtonLabel', { context: 'smartAlert' })}
          </FloatingActionButton>
        </FloatingActionButtons>
      )}
      <SloSmartAlertsContent data={data} />
    </>
  );
}

function SloSmartAlertsContent({ data }: Required<SloAlertsProps>) {
  const { matchLocation } = useNavigation();

  const { configuration } = data;

  if (!sloSmartAlertsEnabled) return <></>;

  if (matchLocation(serviceLevelsObjectiveAlertDetailsFullyQualified))
    return <SloSmartAlertDetails sloId={configuration.id!} />;

  return <Alerts sloId={configuration.id!} />;
}
