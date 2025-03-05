/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo, useState } from 'react';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/mobileApp/TearSheet/AlertConfigTearSheetWithThreshold';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertMultiThresholdFormSideEffects';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import getAlertingUrlParameters from 'in-alerting/smart-alerts/mobileApp/TearSheet/getAlertingUrlParameters';
import TearSheetLoading from 'in-alerting/smart-alerts/components/tearSheet/Loading/TearSheetLoading';
import alertFormDefinition from 'in-alerting/smart-alerts/mobileApp/form/alertDialogFormDefinition';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { useAlertConfig } from 'in-alerting/smart-alerts/mobileApp/hooks/useSmartAlertCreateUrl';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { getHeaderTitle } from 'in-alerting/smart-alerts/mobileApp/data/sharedFunctions';
import { deriveAlertType } from 'in-alerting/smart-alerts/mobileApp/CreateSmartAlert';
import { populateRulesInConfig } from 'in-alerting/smart-alerts/utils/thresholdUtils';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { MobileAppAlertConfigWithMetadata } from 'in-types';

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
  alertConfig: AlertConfigWithDuplicatesProps;
  cancelTearSheet: string;
  editMode: boolean;
}) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);

  const [form, setForm] = useState(() => alertFormDefinition(populateRulesInConfig(alertConfig), editMode));
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
