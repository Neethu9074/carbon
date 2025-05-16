/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Item, MapForm, Field } from 'formalistic';
import React, { useState } from 'react';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertMultiThresholdFormSideEffects';
import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/mobileApp/dialog/AlertConfigDialogWithThreshold';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/mobileApp/form/alertDialogFormDefinition';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/mobileApp/form/formUtils';
import { calculateEffectiveGracePeriodForBackend } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { MobileAppSmartAlertConfig } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { getRuleWithThreshold } from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialog';
import { createOrSaveAlert } from 'in-alerting/smart-alerts/eum/components/AlertCreateOrSave';
import { populateRulesInConfig } from 'in-alerting/smart-alerts/utils/thresholdUtils';
import { alertChannelPerSeverityMobileAppSaEnabled } from 'in-services/featureFlags';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useGetAlertConfigLink } from 'in-mobile-apps/navigation/paths';
import { eumType } from 'in-alerting/smart-alerts/mobileApp/constants';
import { MobileAppAlertConfig, VersionedConfig } from 'in-types';

interface AlertConfigDialogType {
  onClose: () => void;
  startWithSimpleMode: boolean;
  alertConfig: MobileAppSmartAlertConfig & VersionedConfig & { duplicateFrom?: string };
  editMode: boolean;
}

const initialChartConfigIndex = 0;

export default function AlertConfigDialog({
  onClose,
  alertConfig,
  editMode,
  startWithSimpleMode
}: AlertConfigDialogType) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const [form, setForm] = useState(() => alertFormDefinition(populateRulesInConfig(alertConfig), editMode));
  const updateForm = useSmartAlertFormSideEffects(form, setForm);
  const duplicateFrom = alertConfig?.duplicateFrom;

  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<EnrichedError[]>([]);
  const [isSimpleMode, setIsSimpleMode] = useState(startWithSimpleMode);
  const getLinkToAlertConfig = useGetAlertConfigLink();
  const { trackCta } = useSegmentTracking();

  return (
    <AlertConfigDialogWithThreshold
      updateForm={updateForm}
      form={form}
      onChange={createOnChange(updateForm, form)}
      onChartViewConfigChange={setSelectedChartViewConfigIndex}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      timeConfig={chartViewConfigs[selectedChartViewConfigIndex].timeConfig}
      onCreate={() => {
        createOrSaveAlert({
          form,
          setForm,
          getLinkToAlertConfig,
          onClose,
          editMode,
          setIsSaving,
          setMessages,
          toAlertConfig,
          isSimpleMode,
          eumType,
          duplicateFrom,
          trackCta
        });
      }}
      onClose={() => {
        // canceled and dialog closed
        onClose();
      }}
      editMode={editMode}
      startWithSimpleMode={startWithSimpleMode}
      granularity={form.get('granularity').value}
      isSaving={isSaving}
      messages={messages}
      setIsSimpleMode={setIsSimpleMode}
      alertChannelPerSeverityEnabled={alertChannelPerSeverityMobileAppSaEnabled}
    />
  );
}

function createOnChange(setForm: (form: MapForm<any>) => void, externalForm: MapForm<any>) {
  return function onChange(path: string[], updater: (item: Item) => Item): void {
    // @ts-expect-error ts can't determine nested fields of MapForm<any>
    setForm(externalForm.updateIn(path, updater));
  };
}

function toAlertConfig(form: MapForm<any>): Readonly<MobileAppAlertConfig> {
  form.remove('hiddenFields').remove('rule').remove('threshold');
  const tagFilterFormModel = (form.get(fieldNames.tagFilterExpression) as Field<[]>).value;
  const gracePeriod = form.get(fieldNames.gracePeriod).value;
  const granularity = form.get(fieldNames.granularity).value;
  const ruleWithThreshold = getRuleWithThreshold(form);

  return Object.freeze({
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel, false),
    alertChannelIds: alertChannelPerSeverityMobileAppSaEnabled ? null : form.get(fieldNames.alertChannelIds).value,
    alertChannels: alertChannelPerSeverityMobileAppSaEnabled ? form.get(fieldNames.alertChannels).value : null,
    enabled: form.get(fieldNames.enabled).value,
    triggering: form.get(fieldNames.triggering).value,
    description: form.get(fieldNames.description).value || getDescriptionPlaceholder(form),
    name: form.get(fieldNames.name).value || getTitlePlaceholder(form),
    mobileAppId: form.get(fieldNames.mobileAppId).value,
    timeThreshold: form.get('timeThreshold').toJS(),
    granularity: granularity,
    gracePeriod: calculateEffectiveGracePeriodForBackend(gracePeriod, granularity),
    rules: [ruleWithThreshold],
    customPayloadFields: form.get('customPayloadFields').toJS()
  });
}
