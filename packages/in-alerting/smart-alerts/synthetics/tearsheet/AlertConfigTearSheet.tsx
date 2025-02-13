/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Item, MapForm, Field } from 'formalistic';
import React, { useMemo, useState } from 'react';

import {
  SyntheticAlertConfig,
  SyntheticAlertConfigWithMetadata,
  SyntheticAlertRuleUnion,
  SyntheticTimeThresholdUnion
} from '@instana/types';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/synthetics/tearsheet/AlertConfigTearSheetWithThreshold';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/synthetics/form/alertDialogFormDefinition';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/synthetics/form/formUtils';
import { createOrSaveAlertFromTearSheet } from 'in-alerting/smart-alerts/synthetics/components/AlertCreateOrSave';
import { alertsTabDetailsFullyQualified, syntheticSmartAlertsDetailsPath } from 'in-synthetics/navigation/paths';
import getAlertingUrlParameters from 'in-alerting/smart-alerts/synthetics/tearsheet/getAlertingUrlParameters';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertFormSideEffects';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import generateAlertConfig from 'in-alerting/smart-alerts/synthetics/data/generateAlertConfig';
import { getHeaderTitle } from 'in-alerting/smart-alerts/synthetics/tearsheet/sharedFunctions';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { alertCreated, alertId } from 'in-synthetics/navigation/matrix';
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
  alertConfig: SyntheticAlertConfigWithMetadata & { duplicateFrom?: string };
  cancelTearSheet: string;
}) {
  const editMode = false; // TODO handle edit scenerio
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig));
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

function toAlertConfig(form: MapForm<any>): Readonly<SyntheticAlertConfig> {
  const tagFilterFormModel = (form.get(fieldNames.tagFilterExpression) as Field<[]>).value;

  return Object.freeze({
    rule: (form.get('rule') as Field<SyntheticAlertRuleUnion>).toJS(),
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel, false),
    alertChannelIds: (form.get(fieldNames.alertChannelIds) as Field<string[]>).value,
    severity: (form.get(fieldNames.severity) as Field<number>).value,
    description: (form.get(fieldNames.description) as Field<string>).value || getDescriptionPlaceholder(form),
    name: (form.get(fieldNames.name) as Field<string>).value || getTitlePlaceholder(),
    syntheticTestIds: (form.get(fieldNames.syntheticTestIds) as Field<string[]>).value,
    timeThreshold: (form.get('timeThreshold') as Field<SyntheticTimeThresholdUnion>).toJS(),
    customPayloadFields: form.get('customPayloadFields').toJS()
  });
}

function fillAlertTabSpecificValues(location: Location, alertConfigId: string, alertConfigVersion?: number) {
  location.pathname = alertsTabDetailsFullyQualified;

  setOrDeleteMatrixKey(location, syntheticSmartAlertsDetailsPath, alertId, alertConfigId);
  setOrDeleteMatrixKey(location, syntheticSmartAlertsDetailsPath, alertCreated, alertConfigVersion);
}

export const useNavigationToAlertConfig = () => {
  const { navigate, location } = useNavigation();

  return (alertConfigId: string, alertConfigVersion?: number) => {
    fillAlertTabSpecificValues(location, alertConfigId, alertConfigVersion);
    return navigate(location);
  };
};
