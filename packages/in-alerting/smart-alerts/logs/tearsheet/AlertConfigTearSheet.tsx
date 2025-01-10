/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo, useState } from 'react';
import { Item, MapForm } from 'formalistic';

import { LogAlertConfigWithMetadata } from '@instana/types';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/logs/tearsheet/AlertConfigTearSheetWithThreshold';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertFormSideEffects';
import getAlertingUrlParameters from 'in-alerting/smart-alerts/logs/tearsheet/getAlertingUrlParameters';
import { useGetAlertConfigLink } from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigDialog';
import { createOrSaveAlert } from 'in-alerting/smart-alerts/logs/components/AlertCreateOrSave';
import alertFormDefinition from 'in-alerting/smart-alerts/logs/form/alertFormDefinition';
import generateAlertConfig from 'in-alerting/smart-alerts/logs/data/generateAlertConfig';
import { getHeaderTitle } from 'in-alerting/smart-alerts/logs/tearsheet/sharedFunctions';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';

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
  const getLinkToAlertConfig = useGetAlertConfigLink();

  const { trackCta } = useSegmentTracking();
  return (
    <AlertConfigTearSheetWithThreshold
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
          onClose: () => undefined,
          editMode,
          setIsSaving,
          setMessages,
          //@ts-expect-error TODO add toAlertConfig fn
          toAlertConfig: () => {},
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
  );
}

function createOnChange(setForm: (form: MapForm<any>) => void, externalForm: MapForm<any>) {
  return function onChange(path: string[], updater: (item: Item) => Item): void {
    // @ts-expect-error ts can't determine nested fields of MapForm<any>
    setForm(externalForm.updateIn(path, updater));
  };
}
