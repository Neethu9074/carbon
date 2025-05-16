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

import {
  alertsTabDetailsFullyQualified,
  dashboardTestAlertsTabDetailsFullyQualified,
  syntheticsDashboard,
  syntheticSmartAlertsPath,
  alertsTab
} from 'in-synthetics/navigation/paths';
import {
  testId as testIdMatrixParam,
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-synthetics/navigation/matrix';
import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/synthetics/tearsheet/AlertConfigTearSheetWithThreshold';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/synthetics/form/alertDialogFormDefinition';
import { duplicateAlertConfig, getHeaderTitle } from 'in-alerting/smart-alerts/synthetics/tearsheet/sharedFunctions';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/synthetics/form/formUtils';
import { createOrSaveAlertFromTearSheet } from 'in-alerting/smart-alerts/synthetics/components/AlertCreateOrSave';
import getAlertingUrlParameters from 'in-alerting/smart-alerts/synthetics/tearsheet/getAlertingUrlParameters';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import TearSheetLoading from 'in-alerting/smart-alerts/components/tearSheet/Loading/TearSheetLoading';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { useAlertConfig } from 'in-alerting/smart-alerts/synthetics/hooks/useSmartAlertCreateUrl';
import { defaultGracePeriod } from 'in-alerting/smart-alerts/components/GracePeriod';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';
import { t } from 'in-i18n';

export default function AlertConfigTearSheet() {
  const location = useLocation();
  const { cancelTearSheet, syntheticTestId, editMode, duplicateMode, alertConfigId, alertConfigCreated } =
    useMemo(() => {
      return getAlertingUrlParameters(location);
    }, [location]);

  const { alertConfig, alertConfigErrors } = useAlertConfig(
    alertConfigId,
    alertConfigCreated,
    editMode,
    duplicateMode,
    syntheticTestId
  );

  if (alertConfigErrors?.length) {
    return <ErroneousResultPresenter errors={[...alertConfigErrors]} />;
  } else if (!alertConfig) {
    return <TearSheetLoading />;
  } else {
    const syntheticsAlertConfig = duplicateMode ? duplicateAlertConfig(alertConfig) : alertConfig;

    return (
      <AlertConfigTearSheetContent
        alertConfig={syntheticsAlertConfig}
        cancelTearSheet={cancelTearSheet}
        syntheticTestId={syntheticTestId}
        editMode={editMode}
      />
    );
  }
}

function AlertConfigTearSheetContent({
  alertConfig,
  cancelTearSheet,
  editMode,
  syntheticTestId
}: {
  alertConfig: SyntheticAlertConfigWithMetadata & { duplicateFrom?: string };
  cancelTearSheet: string;
  editMode: boolean;
  syntheticTestId?: string;
}) {
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig, true));

  const duplicateFrom = alertConfig?.duplicateFrom;

  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<EnrichedError[]>([]);
  const navigateToAlertConfig = useNavigationToAlertConfig(syntheticTestId);

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
          if (form.get(fieldNames.syntheticTestIds).value.length === 0) {
            addActiveDialog(
              <ConfirmationDialog
                header={t('in-alerting:components.alertActionConfirmationDialogHeader')}
                description={t('in-alerting:components.alertConfirmationDialogDescription', {
                  entityPlaceholder: t('in-alerting:smartAlerts.synthetics.advanced.alertTestsLabel')
                })}
                confirmButtonLabel={t('in-alerting:components.labelConfirm')}
                confirmButtonKind="danger"
                onClose={() => {
                  close();
                }}
                onSubmit={() => {
                  close();
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
              />
            );
            return;
          }
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

function toAlertConfig(form: MapForm<any>): Readonly<SyntheticAlertConfig> {
  const tagFilterFormModel = (form.get(fieldNames.tagFilterExpression) as Field<[]>).value;
  const gracePeriod = form.get(fieldNames.gracePeriod).value;
  const gracePeriodForBackend = gracePeriod === defaultGracePeriod ? null : gracePeriod;

  return Object.freeze({
    rule: (form.get('rule') as Field<SyntheticAlertRuleUnion>).toJS(),
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel, false),
    alertChannelIds: (form.get(fieldNames.alertChannelIds) as Field<string[]>).value,
    severity: (form.get(fieldNames.severity) as Field<number>).value,
    description: (form.get(fieldNames.description) as Field<string>).value || getDescriptionPlaceholder(form),
    name: (form.get(fieldNames.name) as Field<string>).value || getTitlePlaceholder(),
    syntheticTestIds: (form.get(fieldNames.syntheticTestIds) as Field<string[]>).value,
    gracePeriod: gracePeriodForBackend,
    timeThreshold: (form.get('timeThreshold') as Field<SyntheticTimeThresholdUnion>).toJS(),
    customPayloadFields: form.get('customPayloadFields').toJS()
  });
}

const useNavigationToAlertConfig = (syntheticTestId?: string) => {
  const { navigate, location } = useNavigation();

  return (alertConfigId: string, alertConfigVersion?: number) => {
    if (syntheticTestId) {
      location.pathname = dashboardTestAlertsTabDetailsFullyQualified;
      fillAlertTabSpecificValues(location, alertConfigId, alertsTab, alertConfigVersion, syntheticTestId);
    } else {
      location.pathname = alertsTabDetailsFullyQualified;
      fillAlertTabSpecificValues(location, alertConfigId, syntheticSmartAlertsPath);
    }
    return navigate(location);
  };
};

function fillAlertTabSpecificValues(
  params: Location,
  alertConfigId: string,
  alertsPath: string,
  alertConfigVersion?: number,
  syntheticTestId?: string
) {
  setOrDeleteMatrixKey(params, syntheticsDashboard, testIdMatrixParam, syntheticTestId);
  setOrDeleteMatrixKey(params, alertsPath, alertIdMatrixParam, alertConfigId);
  setOrDeleteMatrixKey(params, alertsPath, alertCreatedMatrixParam, alertConfigVersion);
}
