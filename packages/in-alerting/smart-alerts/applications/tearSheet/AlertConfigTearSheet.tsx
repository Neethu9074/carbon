/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
import { MapForm } from 'formalistic';
import { isEmpty } from 'lodash';

import {
  ApplicationAlertConfigWithMetadata,
  GlobalApplicationsAlertConfigWithMetadata,
  ScopeMigrationDetails
} from '@instana/types';
import { createLogger } from '@instana/logger';

import {
  EnrichedError,
  enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError
} from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import {
  createGlobalAlertConfig,
  updateGlobalAlertConfig
} from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import {
  smartAlertPath,
  useLinkToAlertConfig,
  useLinkToGlobalAlertConfigWithoutAPDashboard
} from 'in-applications/navigation/paths';
//@ts-expect-error
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/applications/tearSheet/AlertConfigTearSheetWithThreshold';
import { createAlertConfig, updateAlertConfig } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import AlertingPageHeader from 'in-alerting/smart-alerts/components/pageHeaderTemplate/AlertingPageHeader';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertFormSideEffects';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { trackAlertSaved, trackAlertUpdated } from 'in-alerting/smart-alerts/components/tracker';
import { showSuccessMessage } from 'in-alerting/smart-alerts/components/utils/userFeedback';
import { alertsCategory, isMigration } from 'in-applications/navigation/matrix';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { t } from 'in-i18n';

const logger = createLogger('in-alerting/smart-alerts/applications/dialog/AlertConfigDialogWithThreshold');
const initialChartConfigIndex = 0;

export default function AlertConfigTearSheet({
  onClose,
  scopeMigrationDetails
}: {
  onClose: VoidFunction;
  scopeMigrationDetails?: ScopeMigrationDetails;
}) {
  const location = useLocation();

  const migrationMode = getMatrixParameter(location, smartAlertPath, isMigration) === 'true';
  const isGlobalSmartAlert = getMatrixParameter(location, smartAlertPath, alertsCategory) === 'global';

  const editMode = false; //TODO get this value from URL

  const alertConfig = generateAlertConfig();

  //-- Fetch the global/local alert config ---
  // const alertConfigCreated = Number(getMatrixParameter(location, smartAlertPath, alertCreatedParam));
  // const getAlertConfig = isGlobalSmartAlert
  //   ? getGlobalAlertConfigByIdAndTimestamp(alertConfigId, alertConfigCreated)
  //   : getAlertConfigByIdAndTimestamp(alertConfigId, alertConfigCreated);

  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const duplicateFrom = (alertConfig as any)?.duplicateFrom; // TODO logic need to be added
  const [form, setForm] = useState(() =>
    createSmartAlertForm(fromAlertConfig(alertConfig), editMode, isGlobalSmartAlert)
  );
  const updateForm = useSmartAlertFormSideEffects(form, setForm);
  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<EnrichedError[]>([]);
  const getLinkToGlobalAlertConfigWithoutAPDashboard = useLinkToGlobalAlertConfigWithoutAPDashboard();
  const getLinkToAlertConfig = useLinkToAlertConfig();

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
            createOrSaveAlert({
              form,
              setForm,
              onClose,
              editMode,
              migrationMode,
              isGlobalSmartAlert,
              setIsSaving,
              setMessages,
              getLinkToGlobalAlertConfigWithoutAPDashboard,
              getLinkToAlertConfig,
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
      onClose,
      editMode,
      migrationMode,
      isGlobalSmartAlert,
      setIsSaving,
      setMessages,
      getLinkToGlobalAlertConfigWithoutAPDashboard,
      getLinkToAlertConfig,
      duplicateFrom
    });
  };

  return (
    <>
      <AlertingPageHeader title={getHeaderTitle(isGlobalSmartAlert, migrationMode)} />
      <AlertConfigTearSheetWithThreshold
        isGlobalSmartAlert={isGlobalSmartAlert}
        editMode={editMode}
        migrationMode={migrationMode}
        scopeMigrationDetails={scopeMigrationDetails}
        form={form}
        updateForm={updateForm}
        granularity={form.get('granularity').value}
        onChange={(path, fn) => updateForm(form.updateIn(path, fn))}
        onChartViewConfigChange={setSelectedChartViewConfigIndex}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        setForm={setForm}
        timeConfig={chartViewConfigs[selectedChartViewConfigIndex].timeConfig}
        withTrackClose={() => onClose()}
        withTrackCreate={withTrackCreate}
        isSaving={isSaving}
        messages={messages}
        initialConfiguredApplications={(alertConfig as any)?.applications ?? {}}
      />
    </>
  );
}

function getHeaderTitle(isGlobalSmartAlert: boolean, isMigration: boolean) {
  if (isMigration) {
    return t('in-alerting:smartAlerts.migration.migrateButton');
  } else if (isGlobalSmartAlert) {
    return t(
      'in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleCreateNewAlert_Global'
    );
  }
  return t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleCreateNewAlert_Local');
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

function generateAlertConfig() {
  return {
    threshold: {
      type: STATIC_THRESHOLD
    }
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
  getLinkToGlobalAlertConfigWithoutAPDashboard: (alertConfigId: string) => string;
  getLinkToAlertConfig: (alertConfigId: string, alertConfigVersion: number, applicationId: string) => string;
  onClose: (config?: ApplicationAlertConfigWithMetadata | GlobalApplicationsAlertConfigWithMetadata) => void;
  duplicateFrom?: string;
}

function createOrSaveAlert({
  form,
  setForm,
  onClose,
  editMode,
  migrationMode,
  isGlobalSmartAlert,
  setIsSaving,
  setMessages,
  getLinkToGlobalAlertConfigWithoutAPDashboard,
  getLinkToAlertConfig,
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
        onClose(config);
        showSuccessMessage(config.name, isEffectivelyEditMode, isEffectivelyGlobalSmartAlert);
        //@ts-expect-error
        trackAlertUpdated(alertConfig);
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
        onClose(config);
        const href = isEffectivelyGlobalSmartAlert
          ? getLinkToGlobalAlertConfigWithoutAPDashboard(config.id)
          : getLinkToAlertConfig(config.id, 0, (config as any)?.applicationId);

        showSuccessMessage(config.name, isEffectivelyEditMode, isEffectivelyGlobalSmartAlert, href);
        const newConfig = duplicateFrom ? { ...config, cloneFromId: duplicateFrom } : config;
        trackAlertSaved(newConfig, false);
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
