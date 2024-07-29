/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/infrastructure/dialog/AlertConfigDialogWithThreshold';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/infrastructure/form/formUtils';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertFormSideEffects';
import { InfraSmartAlertConfig } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { createOrSaveAlert } from 'in-alerting/smart-alerts/infrastructure/components/AlertCreateOrSave';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useGetAlertConfigLink } from 'in-infrastructure/navigation/paths';
import { toBackendGroupBy } from 'in-infrastructure/Explore/utils';
import { VersionedConfig } from 'in-types';

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
  const updateForm = useSmartAlertFormSideEffects(form, setForm);
  const duplicateFrom = alertConfig?.duplicateFrom;

  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<EnrichedError[]>([]);
  const [isSimpleMode, setIsSimpleMode] = useState(startWithSimpleMode);
  const getLinkToAlertConfig = useGetAlertConfigLink();

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
          duplicateFrom
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

function toAlertConfig(form: MapForm<any>): Readonly<InfraSmartAlertConfig> {
  const tagFilterFormModel = (form.get(fieldNames.tagFilterExpression) as Field<[]>).value;

  return Object.freeze({
    rule: form.get('rule').toJS(),
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel, false),
    alertChannelIds: form.get(fieldNames.alertChannelIds).value,
    severity: form.get(fieldNames.severity).value,
    description: form.get(fieldNames.description).value || getDescriptionPlaceholder(),
    name: form.get(fieldNames.name).value || getTitlePlaceholder(),
    id: form.get(fieldNames.id).value,
    threshold: form.get('threshold').toJS(),
    timeThreshold: form.get('timeThreshold').toJS(),
    granularity: form.get(fieldNames.granularity).value,
    groupBy: toBackendGroupBy(form.get(fieldNames.groupBy).value),
    predictiveTrigger: form.get(fieldNames.predictiveTrigger).value,
    customPayloadFields: form.get('customPayloadFields').toJS(),
    rules: []
  });
}
