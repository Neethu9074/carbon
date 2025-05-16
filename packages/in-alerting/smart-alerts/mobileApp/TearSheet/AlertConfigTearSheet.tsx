/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Item, MapForm, Field } from 'formalistic';
import React, { useMemo, useState } from 'react';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/mobileApp/TearSheet/AlertConfigTearSheetWithThreshold';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertMultiThresholdFormSideEffects';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/mobileApp/form/alertDialogFormDefinition';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/mobileApp/form/formUtils';
import { calculateEffectiveGracePeriodForBackend } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import getAlertingUrlParameters from 'in-alerting/smart-alerts/mobileApp/TearSheet/getAlertingUrlParameters';
//@ts-expect-error TS migartion
import { useNavigationToAlertConfig } from 'in-mobile-apps/navigation/paths';
import { createOrSaveAlertFromTearSheet } from 'in-alerting/smart-alerts/eum/components/AlertCreateOrSave';
import TearSheetLoading from 'in-alerting/smart-alerts/components/tearSheet/Loading/TearSheetLoading';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { getRuleWithThreshold } from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialog';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { useAlertConfig } from 'in-alerting/smart-alerts/mobileApp/hooks/useSmartAlertCreateUrl';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { getHeaderTitle } from 'in-alerting/smart-alerts/mobileApp/data/sharedFunctions';
import { deriveAlertType } from 'in-alerting/smart-alerts/mobileApp/CreateSmartAlert';
import { populateRulesInConfig } from 'in-alerting/smart-alerts/utils/thresholdUtils';
import { alertChannelPerSeverityMobileAppSaEnabled } from 'in-services/featureFlags';
import { MobileAppAlertConfig, MobileAppAlertConfigWithMetadata } from 'in-types';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { eumType } from 'in-alerting/smart-alerts/mobileApp/constants';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';

const initialChartConfigIndex = 0;
interface AlertConfigWithDuplicatesProps {
  alertConfig: MobileAppAlertConfigWithMetadata & { duplicateFrom?: string };
}

export default function AlertConfigTearSheet() {
  const location = useLocation();
  const {
    cancelTearSheet,
    editMode,
    duplicateMode,
    alertConfigId,
    alertConfigCreated,
    mobileAppId,
    tagFilters,
    customEventName
  } = useMemo(() => {
    return getAlertingUrlParameters(location);
  }, [location]);

  const alertType = deriveAlertType(customEventName);
  const blueprintConfig = getBlueprintConfig(alertType);
  const metricName = blueprintConfig.defaultMetric;
  const beaconType = blueprintConfig.getBeaconType(metricName);
  const boundedAlertQueryBuilder = getQueryBuilderForBeaconType(beaconType);
  const tagCatalog = useTagCatalog(boundedAlertQueryBuilder.getTagCatalog);

  const { alertConfig, alertConfigErrors } = useAlertConfig(
    blueprintConfig,
    alertConfigId,
    alertConfigCreated,
    tagFilters,
    mobileAppId,
    customEventName,
    tagCatalog,
    duplicateMode,
    editMode
  );

  if (alertConfigErrors?.length) {
    return <ErroneousResultPresenter errors={[...alertConfigErrors]} />;
  } else if (!alertConfig) {
    return <TearSheetLoading />;
  } else {
    const mobileAppAlertConfig = duplicateMode ? duplicateAlertConfig(alertConfig) : alertConfig;
    return (
      <AlertConfigTearSheetContent
        alertConfig={mobileAppAlertConfig as unknown as AlertConfigWithDuplicatesProps}
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
  alertConfig: AlertConfigWithDuplicatesProps & { duplicateFrom?: string };
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
