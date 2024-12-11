/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Item, MapForm, Field } from 'formalistic';
import React, { useMemo, useState } from 'react';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/infrastructure/tearsheet/AlertConfigTearSheetWithThreshold';
import { useInfraSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/infrastructure/form/useInfraSmartAlertFormSideEffects';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/infrastructure/form/formUtils';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { createOrSaveAlertFromTearSheet } from 'in-alerting/smart-alerts/infrastructure/components/AlertCreateOrSave';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import getAlertingUrlParameters from 'in-alerting/smart-alerts/infrastructure/tearsheet/getAlertingUrlParameters';
import AlertingPageHeader from 'in-alerting/smart-alerts/components/pageHeaderTemplate/AlertingPageHeader';
import generateAlertConfig from 'in-alerting/smart-alerts/infrastructure/data/generateAlertConfig';
import { getHeaderTitle } from 'in-alerting/smart-alerts/infrastructure/tearsheet/sharedFunctions';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { InfraAlertConfig, InfraAlertRuleUnion, Nullish, RuleWithThreshold } from 'in-types';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { alertChannelPerSeverityInfraSaEnabled } from 'in-services/featureFlags';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useNavigationToAlertConfig } from 'in-infrastructure/navigation/paths';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { toBackendGroupBy } from 'in-infrastructure/Explore/utils';

const initialChartConfigIndex = 0;

export default function AlertConfigTearSheet() {
  const location = useLocation();
  const alertConfig = generateAlertConfig();
  const { cancelTearSheet } = useMemo(() => {
    return getAlertingUrlParameters(location);
  }, [location]);

  return <AlertConfigTearSheetContent alertConfig={alertConfig} cancelTearSheet={cancelTearSheet} />;
}

function AlertConfigTearSheetContent({
  alertConfig,
  cancelTearSheet
}: {
  alertConfig: InfraSmartAlertConfigWithMetadata & { duplicateFrom?: string };
  cancelTearSheet: () => string | Nullish;
}) {
  const editMode = false; // TODO handle edit scenerio
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig, editMode));
  const updateForm = useInfraSmartAlertFormSideEffects(form, setForm);
  const duplicateFrom = alertConfig?.duplicateFrom;

  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<EnrichedError[]>([]);
  const navigateToAlertConfig = useNavigationToAlertConfig();

  const { trackCta } = useSegmentTracking();
  return (
    <>
      <AlertingPageHeader title={getHeaderTitle()} />
      <AlertConfigTearSheetWithThreshold
        updateForm={updateForm}
        form={form}
        onChange={createOnChange(updateForm, form)}
        onChartViewConfigChange={setSelectedChartViewConfigIndex}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        timeConfig={chartViewConfigs[selectedChartViewConfigIndex].timeConfig}
        onCreate={() => {
          createOrSaveAlertFromTearSheet({
            form,
            setForm,
            navigateToAlertConfig,
            editMode,
            setIsSaving,
            setMessages,
            toAlertConfig,
            isSimpleMode: false,
            trackCta,
            duplicateFrom
          });
        }}
        editMode={editMode}
        isSaving={isSaving}
        messages={messages}
        cancelTearSheet={cancelTearSheet}
        withTrackClose={() => undefined}
      />
    </>
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

function toAlertConfig(form: MapForm<any>): Readonly<InfraAlertConfig> {
  const tagFilterFormModel = (form.get(fieldNames.tagFilterExpression) as Field<[]>).value;
  const ruleWithThreshold = getRuleWithThreshold(form);

  return Object.freeze({
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel, false),
    alertChannelIds: alertChannelPerSeverityInfraSaEnabled ? null : form.get(fieldNames.alertChannelIds).value,
    alertChannels: alertChannelPerSeverityInfraSaEnabled ? form.get(fieldNames.alertChannels).value : null,
    description: form.get(fieldNames.description).value || getDescriptionPlaceholder(),
    name: form.get(fieldNames.name).value || getTitlePlaceholder(),
    id: form.get(fieldNames.id).value,
    timeThreshold: form.get('timeThreshold').toJS(),
    granularity: form.get(fieldNames.granularity).value,
    groupBy: toBackendGroupBy(form.get(fieldNames.groupBy).value),
    forecastingConfig: form.get(fieldNames.forecastingConfig).value,
    customPayloadFields: form.get('customPayloadFields').toJS(),
    rules: [ruleWithThreshold]
  });
}
