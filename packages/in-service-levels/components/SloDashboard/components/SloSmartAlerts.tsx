/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import SloSmartAlertDetails from 'in-service-levels/components/SloDashboard/components/SloSmartAlertDetails';
import { serviceLevelsObjectiveAlertDetailsFullyQualified } from 'in-service-levels/navigation/path';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import FloatingActionButton from 'in-components/FloatingActionButton/FloatingActionButton';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/slo/CreateSmartAlertDialog';
import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import Alerts from 'in-alerting/smart-alerts/slo/Alerts';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

interface SloAlertsProps {
  data: SloTabData;
}
interface SloAlertsWrapperProps {
  data: SloTabData | Nullish;
}

export default function SloSmartAlerts({ data }: SloAlertsWrapperProps) {
  if (!data) {
    return null;
  }

  const { matchLocation } = useNavigation();
  const isSloObjectiveAlertDetails = matchLocation(serviceLevelsObjectiveAlertDetailsFullyQualified);

  return (
    <>
      <SloSmartAlertsContent data={data} />
      {!smartAlertCarbonTableEnabled && !isSloObjectiveAlertDetails && (
        <FloatingActionButtons>
          <FloatingActionButton
            icon="lib_alerts_create"
            kind="primaryv2"
            onClick={() => addActiveDialog(<CreateSmartAlertDialog preselectedSloId={data?.configuration.id} />)}
          >
            {t('in-service-levels:general.addButtonLabel', { context: 'smartAlert' })}
          </FloatingActionButton>
        </FloatingActionButtons>
      )}
    </>
  );
}

function SloSmartAlertsContent({ data }: Required<SloAlertsProps>) {
  const { matchLocation } = useNavigation();

  const { configuration } = data;

  if (matchLocation(serviceLevelsObjectiveAlertDetailsFullyQualified))
    return <SloSmartAlertDetails sloId={configuration.id!} />;

  return <Alerts sloId={configuration.id!} />;
}
