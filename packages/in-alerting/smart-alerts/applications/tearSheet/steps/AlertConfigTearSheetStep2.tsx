/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';

//@ts-expect-error TS migration
import IncludeInternalOrSyntheticCallsSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/IncludeInternalOrSyntheticCallsSwitch/IncludeInternalOrSyntheticCallsSwitch';
//@ts-expect-error TS migration
import InboundOutboundCallsSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/InboundOutboundCallsSwitch';
//@ts-expect-error TS migration
import ScopeConfig from 'in-alerting/smart-alerts/applications/scopeConfig/ScopeConfig';
import { ScopeMigrationDetailsType } from 'in-alerting/smart-alerts/applications/tearSheet/AlertConfigTearSheet';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

export default function AlertConfigTearSheetStep2({
  form,
  updateForm,
  isGlobalSmartAlert,
  initialConfiguredApplications = {},
  editMode,
  migrationMode,
  scopeMigrationDetails
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  isGlobalSmartAlert?: boolean;
  initialConfiguredApplications?: object;
  editMode?: boolean;
  migrationMode?: boolean;
  scopeMigrationDetails?: ScopeMigrationDetailsType;
}) {
  const expandHiddenCalls = form.get('includeInternal').value || form.get('includeSynthetic').value;
  return (
    <>
      <TearSheetStepContentWrapper
        headline={t('in-alerting:smartAlerts.applications.tearSheet.callsInScope.title')}
        description={t('in-alerting:smartAlerts.applications.tearSheet.callsInScope.description')}
      >
        <InboundOutboundCallsSwitch
          form={form}
          updateForm={updateForm}
          isGlobalSmartAlert={isGlobalSmartAlert}
          tearSheetView
        />
      </TearSheetStepContentWrapper>
      <ExpandableLightCard
        title={
          <AlertTypography
            variant="heading-100"
            content={t('in-alerting:smartAlerts.applications.tearSheet.includeHiddenCalls.title')}
          />
        }
        useMaxAvailableHeight={false}
        openByDefault={expandHiddenCalls ?? false}
        darkFrame
      >
        <AlertTypography
          variant="body-small"
          content={t('in-alerting:smartAlerts.applications.tearSheet.includeHiddenCalls.description')}
          color="color600"
        />
        <IncludeInternalOrSyntheticCallsSwitch
          form={form}
          updateForm={updateForm}
          isGlobalSmartAlert={isGlobalSmartAlert}
          tearSheetView
        />
      </ExpandableLightCard>
      <TearSheetStepContentWrapper
        headline={t('in-alerting:smartAlerts.applications.tearSheet.serviceEndPointSelection')}
      >
        <Stack direction="vertical" gap="small">
          <AlertTypography
            variant="body-small"
            content={t('in-alerting:smartAlerts.applications.tearSheet.serviceEndPointSelectionDescription')}
            color="color600"
          />
          <ScopeConfig
            form={form}
            updateForm={updateForm}
            editMode={editMode}
            migrationMode={migrationMode}
            scopeMigrationDetails={scopeMigrationDetails}
            isGlobalSmartAlert={isGlobalSmartAlert}
            initialConfiguredApplications={initialConfiguredApplications}
            headerTransparent
            tearSheetView
          />
        </Stack>
      </TearSheetStepContentWrapper>
    </>
  );
}
