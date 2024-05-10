/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
import { MapForm } from 'formalistic';
import { isEmpty } from 'lodash';

import { ApplicationAlertConfigWithMetadata, GlobalApplicationsAlertConfigWithMetadata } from '@instana/types';
import { createLogger } from '@instana/logger';

import {
  EnrichedError,
  enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError
} from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import {
  smartAlertPath,
  useNavigationToAlertConfig,
  useNavigationToGlobalAlertConfigWithoutAPDashboard
} from 'in-applications/navigation/paths';
import {
  createGlobalAlertConfig,
  updateGlobalAlertConfig
} from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
//@ts-expect-error
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { categoryGlobal } from 'in-alerting/smart-alerts/components/list/constants';
import {
  applicationId as applicationIdFromURL,
  boundaryScope as boundaryScopeFromURL
} from 'in-applications/navigation/matrix';
import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/applications/tearSheet/AlertConfigTearSheetWithThreshold';
import { createAlertConfig, updateAlertConfig } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { serviceId as serviceIdFromURL, endpointId as endpointIdFromURL } from 'in-applications/navigation/matrix';
import AlertingPageHeader from 'in-alerting/smart-alerts/components/pageHeaderTemplate/AlertingPageHeader';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertFormSideEffects';
import useGetSmartAlertConfig from 'in-alerting/smart-alerts/applications/hooks/useGetSmartAlertConfig';
import { alertsCategory, isMigration, alertId, alertCreated } from 'in-applications/navigation/matrix';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { trackAlertSaved, trackAlertUpdated } from 'in-alerting/smart-alerts/components/tracker';
import { getEntitySelection } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { showSuccessMessage } from 'in-alerting/smart-alerts/components/utils/userFeedback';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-components/Loading/DefaultLoadingDashboard';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

const logger = createLogger('in-alerting/smart-alerts/applications/dialog/AlertConfigDialogWithThreshold');
const initialChartConfigIndex = 0;

export default function AlertConfigTearSheet() {
  const location = useLocation();
  const isGlobalSmartAlert = getMatrixParameter(location, smartAlertPath, alertsCategory) === 'global';

  const alertConfigId = getMatrixParameter(location, smartAlertPath, alertId) ?? '';
  const alertConfigCreated = Number(getMatrixParameter(location, smartAlertPath, alertCreated)) ?? '';
  const boundaryScope = getMatrixParameter(location, smartAlertPath, boundaryScopeFromURL);
  const applicationId = getMatrixParameter(location, smartAlertPath, applicationIdFromURL);
  const serviceId = getMatrixParameter(location, smartAlertPath, serviceIdFromURL) ?? undefined;
  const endpointId = getMatrixParameter(location, smartAlertPath, endpointIdFromURL) ?? undefined;

  // Get alertconfig data from API in editmode
  const { alertConfig, alertConfigErrors } = useGetSmartAlertConfig(
    alertConfigId,
    alertConfigCreated,
    isGlobalSmartAlert
  );

  const editMode = alertConfigId ? true : false;
  const applicationAlertConfig = editMode
    ? alertConfig
    : generateAlertConfig(isGlobalSmartAlert, applicationId, boundaryScope, serviceId, endpointId);

  if (alertConfigErrors?.length) {
    return <ErroneousResultPresenter errors={[...alertConfigErrors]} />;
  } else if (!applicationAlertConfig) {
    return <DefaultLoadingDashboard />;
  } else {
    return (
      <AlertConfigTearSheetContent
        alertConfig={
          applicationAlertConfig as unknown as
            | GlobalApplicationsAlertConfigWithMetadata
            | ApplicationAlertConfigWithMetadata
        }
        editMode={editMode}
      />
    );
  }
}

interface AlertConfigTearSheetContentProps {
  alertConfig: GlobalApplicationsAlertConfigWithMetadata | ApplicationAlertConfigWithMetadata;
  editMode: boolean;
}

function AlertConfigTearSheetContent({ alertConfig, editMode }: AlertConfigTearSheetContentProps) {
  const location = useLocation();

  const migrationMode = getMatrixParameter(location, smartAlertPath, isMigration) === 'true';
  const isGlobalSmartAlert = getMatrixParameter(location, smartAlertPath, alertsCategory) === categoryGlobal;

  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const duplicateFrom = (alertConfig as any)?.duplicateFrom; // TODO logic need to be added
  const [form, setForm] = useState(() =>
    createSmartAlertForm(fromAlertConfig(alertConfig), editMode, isGlobalSmartAlert)
  );
  const updateForm = useSmartAlertFormSideEffects(form, setForm);
  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<EnrichedError[]>([]);
  const navigateToGlobalAlertConfigWithoutAPDashboard = useNavigationToGlobalAlertConfigWithoutAPDashboard();
  const navigateToAlertConfig = useNavigationToAlertConfig();

  useEffect(() => {
    if (migrationMode) {
      setMessages((prevMessages: EnrichedError[]) => [
        ...prevMessages,
        {
          level: 'warning',
          message: t('in-alerting:smartAlerts.components.smartAlertDialog.migrationModeWarning')
        }
      ]);
    }
  }, [migrationMode]);

  useEffect(() => {
    setForm(createSmartAlertForm(fromAlertConfig(alertConfig), editMode, isGlobalSmartAlert));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode]);

  const withTrackCreate = () => {
    if (isEmpty(form.get('applications').value)) {
      addActiveDialog(
        <ConfirmationDialog
          header={t('in-alerting:components.alertHeaderRestoreRevisionConfirmationDialogHeader')}
          description={t('in-alerting:components.alertConfirmationDialogDescription', {
            entityPlaceholder: t('in-alerting:smartAlerts.components.alertsHub.applications.title')
          })}
          confirmButtonLabel={t('in-alerting:components.labelConfirm')}
          confirmButtonKind="danger"
          onSubmit={() => {
            close();
            createOrSaveAlert({
              form,
              setForm,
              editMode,
              migrationMode,
              isGlobalSmartAlert,
              setIsSaving,
              setMessages,
              navigateToGlobalAlertConfigWithoutAPDashboard,
              navigateToAlertConfig,
              duplicateFrom
            });
          }}
        />
      );
      return;
    }
    createOrSaveAlert({
      form,
      setForm,
      editMode,
      migrationMode,
      isGlobalSmartAlert,
      setIsSaving,
      setMessages,
      navigateToGlobalAlertConfigWithoutAPDashboard,
      navigateToAlertConfig,
      duplicateFrom
    });
  };

  return (
    <>
      <AlertingPageHeader title={getHeaderTitle(isGlobalSmartAlert, editMode, migrationMode)} />
      <AlertConfigTearSheetWithThreshold
        isGlobalSmartAlert={isGlobalSmartAlert}
        editMode={editMode}
        migrationMode={migrationMode}
        scopeMigrationDetails={{} as any} //TODO add migration
        form={form}
        updateForm={updateForm}
        granularity={form.get('granularity').value}
        onChange={(path, fn) => updateForm(form.updateIn(path, fn))}
        onChartViewConfigChange={setSelectedChartViewConfigIndex}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        setForm={setForm}
        timeConfig={chartViewConfigs[selectedChartViewConfigIndex].timeConfig}
        withTrackClose={() => undefined} // TODO add mixpanel tracking
        withTrackCreate={withTrackCreate}
        isSaving={isSaving}
        messages={messages}
        initialConfiguredApplications={(alertConfig as any)?.applications ?? {}}
      />
    </>
  );
}

function getHeaderTitle(isGlobalSmartAlert: boolean, editMode: boolean, isMigration: boolean) {
  if (isMigration) {
    return t('in-alerting:smartAlerts.migration.migrateButton');
  } else if (isGlobalSmartAlert) {
    return editMode
      ? t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleEditAlert_Global')
      : t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleCreateNewAlert_Global');
  } else {
    return editMode
      ? t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleEditAlert_Local')
      : t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleCreateNewAlert_Local');
  }
}

function fromAlertConfig(alertConfig: any) {
  if (alertConfig?.rule?.alertType === 'statusCode') {
    alertConfig = mapStatusCodeConfig(alertConfig);
  }
  return alertConfig;
}

function mapStatusCodeConfig(alertConfig: any) {
  const {
    rule: { statusCodeStart, statusCodeEnd, ...remainingRule }
  } = alertConfig;

  return {
    ...alertConfig,
    rule: {
      statusCode: {
        statusCodeEnd,
        statusCodeStart
      },
      ...remainingRule
    }
  };
}

function generateAlertConfig(
  isGlobalSmartAlert: boolean,
  applicationId: string | Nullish,
  boundaryScope: string | Nullish,
  serviceId: string | undefined,
  endpointId: string | undefined,
  includeSynthetic?: boolean
) {
  if (isGlobalSmartAlert) {
    return {
      threshold: {
        type: STATIC_THRESHOLD
      }
    };
  }
  return {
    boundaryScope: boundaryScope,
    threshold: {
      type: HISTORIC_BASELINE,
      value: 0.0,
      seasonality: DAILY
    },
    calculateThresholdOnBackend: true,
    includeSynthetic,
    applications: applicationId && getEntitySelection(applicationId, serviceId, endpointId)
  };
}

interface createOrSaveAlertProps {
  form: MapForm<any>;
  setForm: (form: MapForm<any>) => void;
  editMode?: boolean;
  migrationMode?: boolean;
  isGlobalSmartAlert?: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<EnrichedError[]>>;
  navigateToGlobalAlertConfigWithoutAPDashboard: (alertConfigId: string) => void;
  navigateToAlertConfig: (alertConfigId: string, alertConfigVersion: number, applicationId: string) => void;
  duplicateFrom?: string;
}

function createOrSaveAlert({
  form,
  setForm,
  editMode,
  migrationMode,
  isGlobalSmartAlert,
  setIsSaving,
  setMessages,
  navigateToGlobalAlertConfigWithoutAPDashboard,
  navigateToAlertConfig,
  duplicateFrom
}: createOrSaveAlertProps) {
  setIsSaving(true);
  // remove existing error messages:
  setMessages((prevMessages: EnrichedError[]) => prevMessages.filter(m => m.level && m.level !== 'error'));

  const addMessage = (message: EnrichedError) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  if (!form.hierarchyValid) {
    setForm(form.setTouched(true, { recurse: true }));
    setIsSaving(false);
    return;
  }

  const alertConfig = toAlertConfig(form);

  const isEffectivelyGlobalSmartAlert = migrationMode
    ? //@ts-expect-error
      Object.keys(alertConfig.applications).length > 1
    : isGlobalSmartAlert;
  // In migration mode we always create a new smart alert:
  const isEffectivelyEditMode = migrationMode ? false : editMode;

  if (isEffectivelyEditMode) {
    (isGlobalSmartAlert ? updateGlobalAlertConfig : updateAlertConfig)(
      //@ts-expect-error
      alertConfig,
      form.get('id').value
    ).once(
      config => {
        showSuccessMessage(config.name, isEffectivelyEditMode, isEffectivelyGlobalSmartAlert);
        //@ts-expect-error
        trackAlertUpdated(alertConfig);
        return isEffectivelyGlobalSmartAlert
          ? navigateToGlobalAlertConfigWithoutAPDashboard(config.id)
          : navigateToAlertConfig(config.id, config.created, (config as any)?.applicationId);
      },
      error => {
        logger.error(`failed to update alertConfig: ${alertConfig} ${error.message}`, error);
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  } else {
    (isEffectivelyGlobalSmartAlert
      ? createGlobalAlertConfig
      : //@ts-expect-error
        createAlertConfig)(alertConfig).once(
      config => {
        const newConfig = duplicateFrom ? { ...config, cloneFromId: duplicateFrom } : config;
        trackAlertSaved(newConfig, false);
        // redirect user to details page
        return isEffectivelyGlobalSmartAlert
          ? navigateToGlobalAlertConfigWithoutAPDashboard(config.id)
          : navigateToAlertConfig(config.id, config.created, (config as any)?.applicationId);
      },
      error => {
        logger.error(`failed to save alertConfig: ${alertConfig} ${error.message}`, error);
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  }
}

function toAlertConfig(form: MapForm<any>) {
  let alertConfig = form
    .remove('hiddenFields')
    .updateIn(['tagFilterExpression'], f =>
      f.setValue(toBackendQueryModel(form.get('tagFilterExpression').value, false))
    )
    .toJS();

  if ((alertConfig as unknown as ApplicationAlertConfigWithMetadata).rule.alertType === 'statusCode') {
    //@ts-expect-error mismatch in AlertConfig {} and form.toJS()
    alertConfig = mapStatusCodeSelection(alertConfig);
  }

  alertConfig.applicationId = undefined;
  alertConfig.name = alertConfig.name || getTitlePlaceholder(form);
  alertConfig.description = alertConfig.description || getDescriptionPlaceholder(form);
  return alertConfig;
}

function mapStatusCodeSelection(alertConfig: ApplicationAlertConfigWithMetadata) {
  const {
    rule: {
      //@ts-expect-error mismatch in AlertConfig {} and form.toJS()
      statusCode: { statusCodeStart, statusCodeEnd },
      ...remainingRule
    }
  } = alertConfig;

  //@ts-expect-error mismatch in AlertConfig {} and form.toJS()
  alertConfig.rule = {
    statusCodeStart,
    statusCodeEnd,
    ...remainingRule
  };
  return alertConfig;
}
