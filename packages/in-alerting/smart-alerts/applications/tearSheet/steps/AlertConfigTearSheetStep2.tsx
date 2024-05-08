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
import TearSheetInboundOutboundCallsSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/TearSheetInboundOutboundCallsSwitch';
//@ts-expect-error TS migration
import ScopeConfig from 'in-alerting/smart-alerts/applications/scopeConfig/ScopeConfig';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogStep2.mless';

export default function AlertConfigTearSheetStep2({
  form,
  updateForm,
  isGlobalSmartAlert,
  initialConfiguredApplications = {},
  editMode
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  isGlobalSmartAlert?: boolean;
  initialConfiguredApplications?: object;
  editMode?: boolean;
}) {
  return (
    <>
      <TearSheetStepContentWrapper
        headline={t('in-alerting:smartAlerts.applications.tearSheet.callsInScope.title')}
        description={t('in-alerting:smartAlerts.applications.tearSheet.callsInScope.description')}
      >
        <TearSheetInboundOutboundCallsSwitch
          form={form}
          updateForm={updateForm}
          isGlobalSmartAlert={isGlobalSmartAlert}
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
          isTearsheet
        />
      </TearSheetStepContentWrapper>
      <TearSheetStepContentWrapper
        headline={t('in-alerting:smartAlerts.applications.tearSheet.serviceEndPointSelection')}
      >
        <div className={locals.alertLocationFiltersWrapper}>
          <ScopeConfig
            form={form}
            updateForm={updateForm}
            editMode={editMode}
            isGlobalSmartAlert={isGlobalSmartAlert}
            initialConfiguredApplications={initialConfiguredApplications}
            headerTransparent
          />
        </div>
      </TearSheetStepContentWrapper>
    </>
  );
}
