/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
//@ts-expect-error
import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialogWithThreshold';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertMultiThresholdFormSideEffects';
import { HISTORIC_BASELINE, STATIC_THRESHOLD, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { WARNING_SEVERITY, CRITICAL_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { DuplicateWebsiteAlertConfig } from 'in-alerting/smart-alerts/websites/details/AlertDetails';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createOrSaveAlert } from 'in-alerting/smart-alerts/eum/components/AlertCreateOrSave';
import useWebsiteLabel from 'in-alerting/smart-alerts/websites/hooks/useWebsiteLabel';
import { populateRulesInConfig } from 'in-alerting/smart-alerts/utils/thresholdUtils';
import { alertChannelPerSeverityWebsiteSaEnabled } from 'in-services/featureFlags';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { WebsiteAlertConfig, ThresholdType, Severity } from 'in-types';
import { eumType } from 'in-alerting/smart-alerts/websites/constants';
import { useGetAlertConfigLink } from 'in-websites/navigation/paths';

const initialChartConfigIndex = 0;

interface AlertConfigDialogProps {
  onClose: () => void;
  alertConfig: (WebsiteSmartAlertConfigWithMetadata & { duplicateFrom?: string }) | DuplicateWebsiteAlertConfig;
  editMode?: boolean;
  startWithSimpleMode?: boolean;
}

export default function AlertConfigDialog({
  onClose,
  alertConfig,
  editMode = false,
  startWithSimpleMode = false
}: AlertConfigDialogProps) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const [form, setForm] = useState(() => alertFormDefinition(populateRulesInConfig(alertConfig), editMode));
  const updateForm = useSmartAlertFormSideEffects(form, setForm);
  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<EnrichedError[]>([]);
  const [isSimpleMode, setIsSimpleMode] = useState(startWithSimpleMode);

  const websiteLabel = useWebsiteLabel(form.get('websiteId')?.value);
  const { trackCta } = useSegmentTracking();

  const getLinkToAlertConfig = useGetAlertConfigLink();
  const duplicateFrom = alertConfig?.duplicateFrom;
  const withTrackCreate = (eumType: string) => {
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
  };

  return (
    <AlertConfigDialogWithThreshold
      updateForm={updateForm}
      form={form}
      onChange={createOnChange(updateForm, form)}
      onChartViewConfigChange={setSelectedChartViewConfigIndex}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      onClose={onClose}
      timeConfig={chartViewConfigs[selectedChartViewConfigIndex].timeConfig}
      websiteLabel={websiteLabel}
      editMode={editMode}
      startWithSimpleMode={startWithSimpleMode}
      granularity={form.get('granularity').value}
      withTrackClose={() => onClose()}
      withTrackCreate={() => withTrackCreate(eumType)}
      isSaving={isSaving}
      messages={messages}
      setIsSimpleMode={setIsSimpleMode}
      alertChannelPerSeverityEnabled={alertChannelPerSeverityWebsiteSaEnabled}
    />
  );
}

function createOnChange(setForm: (form: MapForm<any>) => void, externalForm: MapForm<any>) {
  return (
    form: MapForm<any>,
    fieldName: string,
    fieldValue: string,
    ...atomicAddFields: Array<{ name: string; value: string }>
  ) => {
    // Alternative (new and desired) method signature
    if (form instanceof Array) {
      const path = form;
      const fn = fieldName;
      // @ts-expect-error ts cant determine nested fields of MapForm<any>
      setForm(externalForm.updateIn(path, fn));
      return;
    }

    // old signature, we want to get rid of this
    let updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    if (atomicAddFields.length > 0) {
      atomicAddFields.forEach(
        ({ name, value }) => (updatedForm = updatedForm.updateIn([name], field => field.setValue(value)))
      );
    }
    setForm(updatedForm);
  };
}

export function toAlertConfig(form: MapForm<any>): Readonly<WebsiteAlertConfig> {
  const ruleWithThreshold = getRuleWithThreshold(form);

  form.remove('hiddenFields').remove('rule').remove('threshold');

  const tagFilterFormModel = form.get(fieldNames.tagFilterExpression).value;

  return Object.freeze({
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel, false),
    alertChannelIds: alertChannelPerSeverityWebsiteSaEnabled ? null : form.get(fieldNames.alertChannelIds).value,
    alertChannels: alertChannelPerSeverityWebsiteSaEnabled ? form.get(fieldNames.alertChannels).value : null,
    enabled: form.get(fieldNames.enabled).value,
    triggering: form.get(fieldNames.triggering).value,
    description:
      form.get(fieldNames.description).value || getDescriptionPlaceholder(form, form.get(fieldNames.severity).value),
    name: form.get(fieldNames.name).value || getTitlePlaceholder(form),
    websiteId: form.get(fieldNames.websiteId).value,
    rules: [ruleWithThreshold],
    timeThreshold: form.get('timeThreshold').toJS(),
    granularity: form.get(fieldNames.granularity).value,
    gracePeriod: form.get(fieldNames.gracePeriod).value,
    customPayloadFields: form.get('customPayloadFields').toJS()
  });
}

export function getRuleWithThreshold(form: MapForm<any>) {
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;

  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');

  const warningThreshold = getThresholdData(thresholdType, warningThresholdField, WARNING_SEVERITY);
  const criticalThreshold = getThresholdData(thresholdType, criticalThresholdField, CRITICAL_SEVERITY);

  const ruleWithThreshold = {
    rule: form.get('rule').toJS(),
    thresholdOperator: form.get('threshold').get('operator').value,
    thresholds: { ...warningThreshold, ...criticalThreshold }
  };

  return ruleWithThreshold;
}

export function getThresholdData(thresholdType: ThresholdType, thresholdField: MapForm<any>, severity: Severity) {
  if (
    thresholdType === HISTORIC_BASELINE ||
    thresholdType === ADAPTIVE_BASELINE ||
    thresholdType === STATIC_THRESHOLD
  ) {
    return thresholdField.get('isCheckboxSelected')?.value ? { [severity]: thresholdField.toJS() } : {};
  }

  return {};
}
