/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, Item, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { RuleWithThreshold } from '@instana/types/typeDefinitions';
import { LogAlertRuleUnion } from '@instana/types';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigDialogWithThreshold';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertMultiThresholdFormSideEffects';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/logs/form/formUtils';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/logs/form/alertFormDefinition';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { alertDetailsFullyQualifiedPath, alertsDetailsPath } from 'in-logging/navigation/paths';
import { createOrSaveAlert } from 'in-alerting/smart-alerts/logs/components/AlertCreateOrSave';
import { toGroupByTag } from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigUtils';
import { LogSmartAlertConfig } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { alertCreated, alertId } from 'in-logging/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { LogAlertConfig, VersionedConfig } from 'in-types';
import { Location } from 'in-stores/navigation/types';

interface AlertConfigDialogType {
  onClose: () => void;
  startWithSimpleMode: boolean;
  alertConfig: LogSmartAlertConfig & VersionedConfig & { duplicateFrom?: string };
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
          duplicateFrom,
          trackCta
        });
      }}
      onClose={() => {
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

export function getRuleWithThreshold(form: MapForm<any>) {
  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');
  const warningThreshold = !isEmpty(warningThresholdField.get('value').value)
    ? { WARNING: warningThresholdField.toJS() }
    : {};
  const criticalThreshold = !isEmpty(criticalThresholdField.get('value').value)
    ? { CRITICAL: criticalThresholdField.toJS() }
    : {};
  const ruleWithThreshold: RuleWithThreshold<LogAlertRuleUnion> = {
    rule: form.get('rule').toJS(),
    thresholdOperator: form.get('threshold').get('operator').value,
    thresholds: { ...warningThreshold, ...criticalThreshold }
  };

  return ruleWithThreshold;
}

export function toAlertConfig(form: MapForm<any>): Readonly<LogAlertConfig> {
  const tagFilterFormModel = (form.get(fieldNames.tagFilterExpression) as Field<[]>).value;
  const ruleWithThreshold = getRuleWithThreshold(form);

  return Object.freeze({
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel, false),
    alertChannelIds: form.get(fieldNames.alertChannelIds).value,
    description: form.get(fieldNames.description).value || getDescriptionPlaceholder(form),
    name: form.get(fieldNames.name).value || getTitlePlaceholder(),
    id: form.get(fieldNames.id).value,
    timeThreshold: form.get('timeThreshold').toJS(),
    granularity: form.get(fieldNames.granularity).value,
    gracePeriod: form.get(fieldNames.gracePeriod).value,
    groupBy: form.get(fieldNames.groupBy).value ? toGroupByTag([form.get(fieldNames.groupBy).value]) : undefined,
    customPayloadFields: form.get('customPayloadFields').toJS(),
    rules: [ruleWithThreshold]
  });
}

export const useGetAlertConfigLink = () => {
  const { createHref, location } = useNavigation();

  return (alertConfigId: string, alertConfigVersion?: number): string => {
    fillAlertTabSpecificValues(location, alertConfigId, alertConfigVersion);
    return createHref(location);
  };
};

function fillAlertTabSpecificValues(location: Location, alertConfigId: string, alertConfigVersion?: number) {
  location.pathname = alertDetailsFullyQualifiedPath;

  setOrDeleteMatrixKey(location, alertsDetailsPath, alertId, alertConfigId);
  setOrDeleteMatrixKey(location, alertsDetailsPath, alertCreated, alertConfigVersion);
}
