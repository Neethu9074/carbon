/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Item, MapForm, Field } from 'formalistic';
import React, { useMemo, useState } from 'react';

import { LogAlertConfigWithMetadata, LogAlertConfig } from '@instana/types';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/logs/tearsheet/AlertConfigTearSheetWithThreshold';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/logs/form/formUtils';
import { createOrSaveAlertFromTearSheet } from 'in-alerting/smart-alerts/logs/components/AlertCreateOrSave';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertFormSideEffects';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/logs/form/alertFormDefinition';
import getAlertingUrlParameters from 'in-alerting/smart-alerts/logs/tearsheet/getAlertingUrlParameters';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { dashboardAlertDetailsFullPath, alertsDetailsPath } from 'in-logging/navigation/paths';
import { toGroupByTag } from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigUtils';
import generateAlertConfig from 'in-alerting/smart-alerts/logs/data/generateAlertConfig';
import { getHeaderTitle } from 'in-alerting/smart-alerts/logs/tearsheet/sharedFunctions';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { alertCreated, alertId } from 'in-logging/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';

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
  alertConfig: LogAlertConfigWithMetadata & { duplicateFrom?: string };
  cancelTearSheet: string;
}) {
  const editMode = false; // TODO handle edit scenerio
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig, editMode));
  const updateForm = useSmartAlertFormSideEffects(form, setForm);
  const duplicateFrom = alertConfig?.duplicateFrom;

  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<EnrichedError[]>([]);
  const navigateToAlertConfig = useNavigationToAlertConfig();

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
            duplicateFrom
          });
        }}
        editMode={editMode}
        isSaving={isSaving}
        messages={messages}
        cancelTearSheet={cancelTearSheet}
        withTrackClose={() => undefined}
        tearSheetTitle={getHeaderTitle()}
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

function toAlertConfig(form: MapForm<any>): Readonly<LogAlertConfig> {
  const tagFilterFormModel = (form.get(fieldNames.tagFilterExpression) as Field<[]>).value;

  return Object.freeze({
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel, false),
    alertChannelIds: form.get(fieldNames.alertChannelIds).value,
    severity: form.get(fieldNames.severity).value,
    description: form.get(fieldNames.description).value || getDescriptionPlaceholder(form),
    name: form.get(fieldNames.name).value || getTitlePlaceholder(),
    id: form.get(fieldNames.id).value,
    threshold: form.get('threshold').toJS(),
    timeThreshold: form.get('timeThreshold').toJS(),
    granularity: form.get(fieldNames.granularity).value,
    gracePeriod: form.get(fieldNames.gracePeriod).value,
    groupBy: form.get(fieldNames.groupBy).value ? toGroupByTag([form.get(fieldNames.groupBy).value]) : undefined,
    customPayloadFields: form.get('customPayloadFields').toJS()
  });
}

function fillAlertTabSpecificValues(location: Location, alertConfigId: string, alertConfigVersion?: number) {
  location.pathname = dashboardAlertDetailsFullPath;

  setOrDeleteMatrixKey(location, alertsDetailsPath, alertId, alertConfigId);
  setOrDeleteMatrixKey(location, alertsDetailsPath, alertCreated, alertConfigVersion);
}

export const useNavigationToAlertConfig = () => {
  const { navigate, location } = useNavigation();

  return (alertConfigId: string, alertConfigVersion?: number) => {
    fillAlertTabSpecificValues(location, alertConfigId, alertConfigVersion);
    return navigate(location);
  };
};
