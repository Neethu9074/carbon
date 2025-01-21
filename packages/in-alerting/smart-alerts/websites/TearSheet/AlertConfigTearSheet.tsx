/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import React from 'react';

import { Result, WebsiteAlertConfigWithMetadata } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/websites/TearSheet/AlertConfigTearSheetWithThreshold';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import getAlertingUrlParameters from 'in-alerting/smart-alerts/websites/TearSheet/getAlertingUrlParameters';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertFormSideEffects';
import { deriveAlertType, generateAlertConfig } from 'in-alerting/smart-alerts/websites/CreateSmartAlert';
import { getAlertConfigByIdAndTimestamp } from 'in-alerting/smart-alerts/websites/api/websiteAlertConfig';
import TearSheetLoading from 'in-alerting/smart-alerts/components/tearSheet/Loading/TearSheetLoading';
import alertFormDefinition from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { successObservable } from 'in-services/util/result';
import { t } from 'in-i18n';

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
    websiteId,
    tagFilters,
    blueprintConfig,
    tagCatalog,
    errorMessage,
    customEventName,
    alertConfigId,
    alertConfigCreated,
    editMode,
    duplicateMode
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
        tearSheetTitle={'Create Website Smart Alert'}
      />
    </>
  );
}

export function useAlertConfig(
  websiteId: any,
  tagFilters: any,
  blueprintConfig: any,
  tagCatalog: any,
  errorMessage: any,
  customEventName: any,
  alertConfigId: string,
  alertConfigCreated: number,
  editMode: boolean,
  duplicateMode: boolean
) {
  const alertConfig =
    editMode || duplicateMode
      ? getAlertConfigByIdAndTimestamp(alertConfigId, alertConfigCreated)
      : successObservable(
          generateAlertConfig(websiteId, tagFilters, blueprintConfig, tagCatalog, errorMessage, customEventName)
        );

  //@ts-expect-error //TODO fix
  const result: Result<WebsiteAlertConfigWithMetadata> | {} = useObservable(() => alertConfig, []) ?? {};

  return !isEmpty(result)
    ? {
        alertConfig: (result as Result<WebsiteAlertConfigWithMetadata>).data,
        alertConfigErrors: (result as Result<WebsiteAlertConfigWithMetadata>).errors
      }
    : {};
}

export function duplicateAlertConfig(
  config: WebsiteAlertConfigWithMetadata
): WebsiteAlertConfigWithMetadata & { duplicateFrom?: string } {
  return {
    ...config,
    duplicateFrom: config.id,
    name: t('in-alerting:smartAlerts.titleCopyOf', { smartAlertTitle: config.name })
  };
}
