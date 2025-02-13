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
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import generateAlertConfig from 'in-alerting/smart-alerts/synthetics/data/generateAlertConfig';
import { getHeaderTitle } from 'in-alerting/smart-alerts/synthetics/tearsheet/sharedFunctions';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { alertCreated, alertId } from 'in-synthetics/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';

export default function AlertConfigTearSheet() {
  const location = useLocation();
  const { cancelTearSheet, syntheticTestId } = useMemo(() => {
    return getAlertingUrlParameters(location);
  }, [location]);
  const alertConfig = generateAlertConfig(syntheticTestId ? [syntheticTestId] : []);

  return (
    <AlertConfigTearSheetContent
      alertConfig={alertConfig}
      cancelTearSheet={cancelTearSheet}
      syntheticTestId={syntheticTestId}
    />
  );
}

function AlertConfigTearSheetContent({
  alertConfig,
  cancelTearSheet,
  syntheticTestId
}: {
  alertConfig: SyntheticAlertConfigWithMetadata & { duplicateFrom?: string };
  cancelTearSheet: string;
  syntheticTestId?: string;
}) {
  const editMode = false; // TODO handle edit scenerio
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig));

  const duplicateFrom = alertConfig?.duplicateFrom;

  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<EnrichedError[]>([]);
  const navigateToAlertConfig = useNavigationToAlertConfig();

  const { trackCta } = useSegmentTracking();
  return (
    <>
      <AlertConfigTearSheetWithThreshold
        updateForm={(updateForm: MapForm<any>) => {
          setForm(updateForm);
        }}
        form={form}
        onChange={createOnChange(setForm, form)}
        onCreate={() => {
          createOrSaveAlertFromTearSheet({
            form,
            setForm,
            navigateToAlertConfig,
            editMode,
            setIsSaving,
            setMessages,
            syntheticTestId,
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
