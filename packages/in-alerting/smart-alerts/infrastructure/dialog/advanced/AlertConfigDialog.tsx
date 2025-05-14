/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { RuleWithThreshold } from '@instana/types/typeDefinitions';
import { InfraAlertRuleUnion } from '@instana/types';

import {
  useFormattedThresholdValue,
  useGetAlertTitle,
  generateTitle,
  getTitlePlaceholderData
} from 'in-alerting/smart-alerts/infrastructure/hooks/useGetAlertTitle';
import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { useInfraSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/infrastructure/form/useInfraSmartAlertFormSideEffects';
import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/infrastructure/dialog/AlertConfigDialogWithThreshold';
import { alertChannelPerSeverityInfraSaEnabled, perEntityInfraSmartAlertsEnabled } from 'in-services/featureFlags';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import { InfraSmartAlertConfig } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { createOrSaveAlert } from 'in-alerting/smart-alerts/infrastructure/components/AlertCreateOrSave';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useGetAlertConfigLink } from 'in-infrastructure/navigation/paths';
import { toBackendGroupBy } from 'in-infrastructure/Explore/utils';
import { InfraAlertConfig, VersionedConfig } from 'in-types';

interface AlertConfigDialogType {
  onClose: () => void;
  startWithSimpleMode: boolean;
  alertConfig: InfraSmartAlertConfig & VersionedConfig & { duplicateFrom?: string };
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
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig, editMode));
  const updateForm = useInfraSmartAlertFormSideEffects(form, setForm);
  const duplicateFrom = alertConfig?.duplicateFrom;

  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<EnrichedError[]>([]);
  const [isSimpleMode, setIsSimpleMode] = useState(startWithSimpleMode);
  const getLinkToAlertConfig = useGetAlertConfigLink();

  const { trackCta } = useSegmentTracking();

  const { aggregation, warningThreshold, criticalThreshold, thresholdOperatorValue, metricFormat, entityType, metric } =
    getTitlePlaceholderData(form);

  const metricLabel = useGetAlertTitle(entityType, metric, aggregation);
  const alertTitle = generateTitle(metricLabel);
  const alertDescription = useFormattedThresholdValue(
    metricLabel,
    thresholdOperatorValue(warningThreshold, criticalThreshold),
    metricFormat,
    warningThreshold,
    criticalThreshold
  );

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
          trackCta,
          duplicateFrom,
          placeHolderText: { alertTitle, alertDescription }
        });
      }}
      onClose={() => {
        // canceled and dialog closed
        onClose();
      }}
      editMode={editMode}
      startWithSimpleMode={startWithSimpleMode}
      isSaving={isSaving}
      messages={messages}
      setIsSimpleMode={setIsSimpleMode}
    />
  );
}

function createOnChange(setForm: (form: MapForm<any>) => void, externalForm: MapForm<any>) {
  return function onChange(path: string[], updater: (item: Item) => Item): void {
    // @ts-expect-error ts can't determine nested fields of MapForm<any>
    setForm(externalForm.updateIn(path, updater));
  };
}

function getRuleWithThreshold(form: MapForm<any>) {
  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');
  const warningThreshold = !isEmpty(warningThresholdField.get('value').value)
    ? { WARNING: warningThresholdField.toJS() }
    : {};
  const criticalThreshold = !isEmpty(criticalThresholdField.get('value').value)
    ? { CRITICAL: criticalThresholdField.toJS() }
    : {};
  const ruleWithThreshold: RuleWithThreshold<InfraAlertRuleUnion> = {
    rule: form.get('rule').toJS(),
    thresholdOperator: form.get('threshold').get('operator').value,
    thresholds: { ...warningThreshold, ...criticalThreshold }
  };

  return ruleWithThreshold;
}

function toAlertConfig(
  form: MapForm<any>,
  placeHolderText: { alertTitle: string; alertDescription: { WARNING?: string; CRITICAL?: string } }
): Readonly<InfraAlertConfig> {
  const tagFilterFormModel = (form.get(fieldNames.tagFilterExpression) as Field<[]>).value;
  const ruleWithThreshold = getRuleWithThreshold(form);

  const { alertTitle, alertDescription } = placeHolderText;

  return Object.freeze({
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel, false),
    alertChannelIds: alertChannelPerSeverityInfraSaEnabled ? null : form.get(fieldNames.alertChannelIds).value,
    alertChannels: alertChannelPerSeverityInfraSaEnabled ? form.get(fieldNames.alertChannels).value : null,
    description: form.get(fieldNames.description).value || (alertDescription?.WARNING ?? alertDescription?.CRITICAL),
    name: form.get(fieldNames.name).value || alertTitle,
    triggering: form.get(fieldNames.triggering).value,
    id: form.get(fieldNames.id).value,
    timeThreshold: form.get('timeThreshold').toJS(),
    granularity: form.get(fieldNames.granularity).value,
    gracePeriod: form.get(fieldNames.gracePeriod).value,
    groupBy: toBackendGroupBy(form.get(fieldNames.groupBy).value),
    forecastingConfig: form.get(fieldNames.forecastingConfig).value,
    customPayloadFields: form.get('customPayloadFields').toJS(),
    rules: [ruleWithThreshold],
    evaluationType: perEntityInfraSmartAlertsEnabled ? form.get('evaluationType').value : null
  });
}
