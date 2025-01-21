/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useMemo, useState } from 'react';
import React from 'react';

import { TagFilter, WebsiteAlertConfigWithMetadata } from '@instana/types';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import {
  deriveAlertType,
  duplicateAlertConfig,
  getHeaderTitle
} from 'in-alerting/smart-alerts/websites/TearSheet/sharedFunctions';
import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/websites/TearSheet/AlertConfigTearSheetWithThreshold';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import getAlertingUrlParameters from 'in-alerting/smart-alerts/websites/TearSheet/getAlertingUrlParameters';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertFormSideEffects';
import TearSheetLoading from 'in-alerting/smart-alerts/components/tearSheet/Loading/TearSheetLoading';
import alertFormDefinition from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition';
import { useAlertConfig } from 'in-alerting/smart-alerts/websites/hooks/useSmartAlertCreateUrl';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
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
  alertConfig: WebsiteAlertConfigWithMetadata & { duplicateFrom?: string };
  cancelTearSheet: string;
  editMode: boolean;
}) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  //@ts-expect-error
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig, editMode));
  const updateForm = useSmartAlertFormSideEffects(form, setForm);

  const [isSaving] = useState(false);
  const [messages] = useState<EnrichedError[]>([]);

  return (
    <>
      <AlertConfigTearSheetWithThreshold
        updateForm={updateForm}
        form={form}
        onChange={() => undefined} //TODO
        onChartViewConfigChange={setSelectedChartViewConfigIndex}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        timeConfig={chartViewConfigs[selectedChartViewConfigIndex].timeConfig}
        onCreate={() => undefined} //TODO
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
