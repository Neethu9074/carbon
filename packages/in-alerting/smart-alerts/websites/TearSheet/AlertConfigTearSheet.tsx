/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Item, MapForm } from 'formalistic';
import { useMemo, useState } from 'react';
import React from 'react';

import { TagFilter, WebsiteAlertConfig } from '@instana/types';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import {
  deriveAlertType,
  duplicateAlertConfig,
  getHeaderTitle
} from 'in-alerting/smart-alerts/websites/TearSheet/sharedFunctions';
import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/websites/TearSheet/AlertConfigTearSheetWithThreshold';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertMultiThresholdFormSideEffects';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { calculateEffectiveGracePeriodForBackend } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import getAlertingUrlParameters from 'in-alerting/smart-alerts/websites/TearSheet/getAlertingUrlParameters';
import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { createOrSaveAlertFromTearSheet } from 'in-alerting/smart-alerts/eum/components/AlertCreateOrSave';
import TearSheetLoading from 'in-alerting/smart-alerts/components/tearSheet/Loading/TearSheetLoading';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getRuleWithThreshold } from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialog';
import { useAlertConfig } from 'in-alerting/smart-alerts/websites/hooks/useSmartAlertCreateUrl';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { populateRulesInConfig } from 'in-alerting/smart-alerts/utils/thresholdUtils';
import { alertChannelPerSeverityWebsiteSaEnabled } from 'in-services/featureFlags';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigationToAlertConfig } from 'in-websites/navigation/paths';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { eumType } from 'in-alerting/smart-alerts/websites/constants';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';

const initialChartConfigIndex = 0;

export default function AlertConfigTearSheet() {
  const location = useLocation();
  const {
    cancelTearSheet,
    editMode,
    duplicateMode,
    alertConfigId,
    alertConfigCreated,
    websiteId,
    errorId,
    tagFilters,
    errorMessage,
    customEventName
  } = useMemo(() => {
    return getAlertingUrlParameters(location);
  }, [location]);

  const alertType = deriveAlertType(errorId, customEventName);
  const blueprintConfig = getBlueprintConfig(alertType);
  const metricName = blueprintConfig.defaultMetric;
  const beaconType = blueprintConfig.getBeaconType(metricName);
  const boundedAlertQueryBuilder = getQueryBuilderForBeaconType(beaconType);

  const tagCatalog = useTagCatalog(boundedAlertQueryBuilder.getTagCatalog);

  const { alertConfig, alertConfigErrors } = useAlertConfig(
    tagFilters as TagFilter[],
    blueprintConfig,
    alertConfigId,
    alertConfigCreated,
    editMode,
    duplicateMode,
    websiteId,
    tagCatalog,
    errorMessage,
    customEventName
  );

  if (alertConfigErrors?.length) {
    return <ErroneousResultPresenter errors={[...alertConfigErrors]} />;
  } else if (!alertConfig) {
    return <TearSheetLoading />;
  } else {
    const websiteAlertConfig = duplicateMode ? duplicateAlertConfig(alertConfig) : alertConfig;
    return (
      <AlertConfigTearSheetContent
        alertConfig={websiteAlertConfig}
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
  alertConfig: WebsiteSmartAlertConfigWithMetadata & { duplicateFrom?: string };
  cancelTearSheet: string;
  editMode: boolean;
}) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);

  const [form, setForm] = useState(() => alertFormDefinition(populateRulesInConfig(alertConfig), editMode, true));
  const updateForm = useSmartAlertFormSideEffects(form, setForm);

  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<EnrichedError[]>([]);
  const navigateToAlertConfig = useNavigationToAlertConfig();
  const duplicateFrom = alertConfig?.duplicateFrom;
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
        onCreate={() =>
          createOrSaveAlertFromTearSheet({
            form,
            setForm,
            navigateToAlertConfig,
            editMode,
            setIsSaving,
            setMessages,
            toAlertConfig,
            eumType,
            duplicateFrom,
            trackCta
          })
        }
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

function toAlertConfig(form: MapForm<any>): Readonly<WebsiteAlertConfig> {
  const ruleWithThreshold = getRuleWithThreshold(form);

  form.remove('hiddenFields').remove('rule').remove('threshold');
  const gracePeriod = form.get(fieldNames.gracePeriod).value;
  const granularity = form.get(fieldNames.granularity).value;
  const tagFilterFormModel = form.get(fieldNames.tagFilterExpression).value;

  return Object.freeze({
    rules: [ruleWithThreshold],
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel, false),
    alertChannelIds: alertChannelPerSeverityWebsiteSaEnabled ? null : form.get(fieldNames.alertChannelIds).value,
    alertChannels: alertChannelPerSeverityWebsiteSaEnabled ? form.get(fieldNames.alertChannels).value : null,

    enabled: form.get(fieldNames.enabled).value,
    triggering: form.get(fieldNames.triggering).value,
    description:
      form.get(fieldNames.description).value || getDescriptionPlaceholder(form, form.get(fieldNames.severity).value),
    name: form.get(fieldNames.name).value || getTitlePlaceholder(form),
    websiteId: form.get(fieldNames.websiteId).value,
    timeThreshold: form.get('timeThreshold').toJS(),
    granularity: granularity,
    gracePeriod: calculateEffectiveGracePeriodForBackend(gracePeriod, granularity),
    customPayloadFields: form.get('customPayloadFields').toJS()
  });
}
