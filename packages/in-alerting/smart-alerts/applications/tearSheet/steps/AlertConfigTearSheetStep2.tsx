/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

//@ts-expect-error TS migration
import IncludeInternalOrSyntheticCallsSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/IncludeInternalOrSyntheticCallsSwitch/IncludeInternalOrSyntheticCallsSwitch';
//@ts-expect-error TS migration
import InboundOutboundCallsSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/InboundOutboundCallsSwitch';
//@ts-expect-error TS migration
import ScopeConfig from 'in-alerting/smart-alerts/applications/scopeConfig/ScopeConfig';
import { ScopeMigrationDetailsType } from 'in-alerting/smart-alerts/applications/tearSheet/AlertConfigTearSheet';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep2.mless';

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
      <TearSheetStepContentWrapper
        headline={t('in-alerting:smartAlerts.applications.tearSheet.includeHiddenCalls.title')}
        description={t('in-alerting:smartAlerts.applications.tearSheet.includeHiddenCalls.description')}
      >
        <IncludeInternalOrSyntheticCallsSwitch
          form={form}
          updateForm={updateForm}
          isGlobalSmartAlert={isGlobalSmartAlert}
          tearSheetView
        />
      </TearSheetStepContentWrapper>
      <TearSheetStepContentWrapper
        headline={t('in-alerting:smartAlerts.applications.tearSheet.serviceEndPointSelection')}
      >
        <div className={locals.top75}>
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
        </div>
      </TearSheetStepContentWrapper>
    </>
  );
}
