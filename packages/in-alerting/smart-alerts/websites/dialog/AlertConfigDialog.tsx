/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
//@ts-expect-error
import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialogWithThreshold';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertFormSideEffects';
import { DuplicateWebsiteAlertConfig } from 'in-alerting/smart-alerts/websites/details/AlertDetails';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createOrSaveAlert } from 'in-alerting/smart-alerts/eum/components/AlertCreateOrSave';
import useWebsiteLabel from 'in-alerting/smart-alerts/websites/hooks/useWebsiteLabel';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { eumType } from 'in-alerting/smart-alerts/websites/constants';
import { useGetAlertConfigLink } from 'in-websites/navigation/paths';
import { WebsiteAlertConfig } from 'in-types';

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
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig, editMode));
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

function toAlertConfig(form: MapForm<any>): Readonly<WebsiteAlertConfig> {
  const tagFilterFormModel = form.get(fieldNames.tagFilterExpression).value;

  return Object.freeze({
    rule: form.get('rule').toJS(),
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel, false),
    alertChannelIds: form.get(fieldNames.alertChannelIds).value,
    enabled: form.get(fieldNames.enabled).value,
    triggering: form.get(fieldNames.triggering).value,
    severity: form.get(fieldNames.severity).value,
    description: form.get(fieldNames.description).value || getDescriptionPlaceholder(form),
    name: form.get(fieldNames.name).value || getTitlePlaceholder(form),
    websiteId: form.get(fieldNames.websiteId).value,
    threshold: form.get('threshold').toJS(),
    timeThreshold: form.get('timeThreshold').toJS(),
    granularity: form.get(fieldNames.granularity).value,
    customPayloadFields: form.get('customPayloadFields').toJS()
  });
}
