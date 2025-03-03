/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Item, MapForm, Field } from 'formalistic';
import React, { useMemo, useState } from 'react';

import {
  useFormattedThresholdValue,
  useGetAlertTitle,
  generateTitle,
  getTitlePlaceholderData
} from 'in-alerting/smart-alerts/infrastructure/hooks/useGetAlertTitle';
import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/infrastructure/tearsheet/AlertConfigTearSheetWithThreshold';
import { useInfraSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/infrastructure/form/useInfraSmartAlertFormSideEffects';
import {
  duplicateAlertConfig,
  getHeaderTitle
} from 'in-alerting/smart-alerts/infrastructure/tearsheet/sharedFunctions';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { createOrSaveAlertFromTearSheet } from 'in-alerting/smart-alerts/infrastructure/components/AlertCreateOrSave';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import getAlertingUrlParameters from 'in-alerting/smart-alerts/infrastructure/tearsheet/getAlertingUrlParameters';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { useAlertConfig } from 'in-alerting/smart-alerts/infrastructure/hooks/useSmartAlertCreateUrl';
import TearSheetLoading from 'in-alerting/smart-alerts/components/tearSheet/Loading/TearSheetLoading';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { InfraAlertConfig, InfraAlertRuleUnion, RuleWithThreshold } from 'in-types';
import { alertChannelPerSeverityInfraSaEnabled } from 'in-services/featureFlags';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useNavigationToAlertConfig } from 'in-infrastructure/navigation/paths';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { toBackendGroupBy } from 'in-infrastructure/Explore/utils';

const initialChartConfigIndex = 0;

export default function AlertConfigTearSheet() {
  const location = useLocation();
  const { cancelTearSheet, editMode, duplicateMode, alertConfigId, alertConfigCreated } = useMemo(() => {
    return getAlertingUrlParameters(location);
  }, [location]);

  const { alertConfig, alertConfigErrors } = useAlertConfig(alertConfigId, alertConfigCreated, editMode, duplicateMode);

  if (alertConfigErrors?.length) {
    return <ErroneousResultPresenter errors={[...alertConfigErrors]} />;
  } else if (!alertConfig) {
    return <TearSheetLoading />;
  } else {
    const infraAlertConfig = duplicateMode ? duplicateAlertConfig(alertConfig) : alertConfig;
    return (
      <AlertConfigTearSheetContent
        alertConfig={infraAlertConfig}
        cancelTearSheet={cancelTearSheet}
        editMode={editMode}
      />
    );
  }
}

function AlertConfigTearSheetContent({
  alertConfig,
  cancelTearSheet,
  editMode
}: {
  alertConfig: InfraSmartAlertConfigWithMetadata & { duplicateFrom?: string };
  cancelTearSheet: string;
  editMode: boolean;
}) {
  const duplicateFrom = alertConfig?.duplicateFrom ?? undefined;

  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig, editMode, true));
  const updateForm = useInfraSmartAlertFormSideEffects(form, setForm);

  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<EnrichedError[]>([]);
  const navigateToAlertConfig = useNavigationToAlertConfig();

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

  const { trackCta } = useSegmentTracking();
  return (
    <>
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
            duplicateFrom,
            placeHolderText: { alertTitle, alertDescription }
          });
        }}
        editMode={editMode}
        isSaving={isSaving}
        messages={messages}
        cancelTearSheet={cancelTearSheet}
        withTrackClose={() => undefined}
        tearSheetTitle={getHeaderTitle(editMode)}
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
    id: form.get(fieldNames.id).value,
    timeThreshold: form.get('timeThreshold').toJS(),
    granularity: form.get(fieldNames.granularity).value,
    gracePeriod: form.get(fieldNames.gracePeriod).value,
    groupBy: toBackendGroupBy(form.get(fieldNames.groupBy).value),
    forecastingConfig: form.get(fieldNames.forecastingConfig).value,
    customPayloadFields: form.get('customPayloadFields').toJS(),
    rules: [ruleWithThreshold]
  });
}
