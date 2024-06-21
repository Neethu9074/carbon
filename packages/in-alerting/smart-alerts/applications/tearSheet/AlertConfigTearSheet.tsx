/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useMemo, useState } from 'react';
import { MapForm } from 'formalistic';
import { isEmpty } from 'lodash';

import { ApplicationAlertConfigWithMetadata, GlobalApplicationsAlertConfigWithMetadata } from '@instana/types';
import { createLogger } from '@instana/logger';

import { enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import {
  createGlobalAlertConfig,
  updateGlobalAlertConfig
} from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
//@ts-expect-error TS migration
import * as HelperFunction from 'in-alerting/smart-alerts/applications/tearSheet/components/AlertConfigHelper';
import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import {
  useNavigationToAlertConfig,
  useNavigationToGlobalAlertConfigWithoutAPDashboard
} from 'in-applications/navigation/paths';
import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/applications/tearSheet/AlertConfigTearSheetWithThreshold';
import getAlertingUrlParameters from 'in-alerting/smart-alerts/applications/tearSheet/components/getAlertingUrlParameters';
import { createAlertConfig, updateAlertConfig } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import useGetMigrationAlertConfig from 'in-alerting/smart-alerts/applications/hooks/useGetMigrationAlertConfig';
import AlertingPageHeader from 'in-alerting/smart-alerts/components/pageHeaderTemplate/AlertingPageHeader';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertFormSideEffects';
import useGetSmartAlertConfig from 'in-alerting/smart-alerts/applications/hooks/useGetSmartAlertConfig';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { trackAlertSaved, trackAlertUpdated } from 'in-alerting/smart-alerts/components/tracker';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { disableMigratedCustomEventSpecification } from 'in-api/eventSpecifications';
import DefaultLoadingDashboard from 'in-components/Loading/DefaultLoadingDashboard';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { Location } from 'in-stores/navigation/types';
import { t } from 'in-i18n';

const logger = createLogger('in-alerting/smart-alerts/applications/dialog/AlertConfigDialogWithThreshold');
const initialChartConfigIndex = 0;

const { fromAlertConfig, getHeaderTitle, toAlertConfig, getApplicationAlertConfig } = HelperFunction;

export default function AlertConfigTearSheet() {
  const location = useLocation();
  const {
    migrationMode,
    editMode,
    duplicateMode,
    potentialProblemMode,
    isGlobalSmartAlert,
    alertConfigId,
    alertConfigCreated,
    boundaryScope,
    applicationId,
    serviceId,
    endpointId,
    eventSpecificationId
  } = useMemo(() => {
    return getAlertingUrlParameters(location);
  }, [location]);

  const { scopeMigrationDetails, migrateAlertConfig } = useGetMigrationAlertConfig(
    eventSpecificationId,
    migrationMode,
    isGlobalSmartAlert
  );

  // get global/local alert config from API in Edit mode
  const { alertConfig, alertConfigErrors } = useGetSmartAlertConfig(
    alertConfigId,
    alertConfigCreated,
    isGlobalSmartAlert,
    editMode,
    duplicateMode
  );

  const applicationSmartAlertConfig = getApplicationAlertConfig(
    migrationMode,
    isGlobalSmartAlert,
    editMode,
    duplicateMode,
    alertConfig,
    migrateAlertConfig,
    potentialProblemMode,
    applicationId,
    boundaryScope,
    serviceId,
    endpointId
  );

  if (alertConfigErrors?.length) {
    return <ErroneousResultPresenter errors={[...alertConfigErrors]} />;
  } else if (!applicationSmartAlertConfig) {
    return <DefaultLoadingDashboard />;
  } else {
    return (
      <AlertConfigTearSheetContent
        alertConfig={
          applicationSmartAlertConfig as unknown as
            | GlobalApplicationsAlertConfigWithMetadata
            | ApplicationAlertConfigWithMetadata
        }
        scopeMigrationDetails={scopeMigrationDetails}
        location={location}
      />
    );
  }
}

export type ScopeMigrationDetailsType = {
  result: string;
  query?: string;
};
interface AlertConfigTearSheetContentProps {
  alertConfig: GlobalApplicationsAlertConfigWithMetadata | ApplicationAlertConfigWithMetadata;
  scopeMigrationDetails?: ScopeMigrationDetailsType;
  location: Location;
}

function AlertConfigTearSheetContent({
  alertConfig,
  scopeMigrationDetails,
  location
}: AlertConfigTearSheetContentProps) {
  const { migrationMode, editMode, isGlobalSmartAlert, eventSpecificationId, cancelTearSheet } = useMemo(() => {
    return getAlertingUrlParameters(location);
  }, [location]);

  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const duplicateFrom = (alertConfig as any)?.duplicateFrom;

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
            entityPlaceholder: t('in-settings:productAreas.title_applications')
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
              duplicateFrom,
              eventSpecificationId
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
      duplicateFrom,
      eventSpecificationId
    });
  };

  return (
    <>
      <AlertingPageHeader
        title={getHeaderTitle(isGlobalSmartAlert, editMode, migrationMode)}
        messageData={messages[0]}
      />
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
        withTrackClose={() => undefined}
        withTrackCreate={withTrackCreate}
        isSaving={isSaving}
        messages={messages}
        headerWithMsg={Boolean(messages.length)}
        initialConfiguredApplications={(alertConfig as any)?.applications ?? {}}
        cancelTearSheet={cancelTearSheet}
      />
    </>
  );
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
  eventSpecificationId?: string;
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
  duplicateFrom,
  eventSpecificationId
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
    ? Object.keys(alertConfig.applications).length > 1
    : isGlobalSmartAlert;
  // In migration mode we always create a new smart alert:
  const isEffectivelyEditMode = migrationMode ? false : editMode;

  if (isEffectivelyEditMode) {
    const alertConfigApplicationId = isEffectivelyGlobalSmartAlert ? null : Object.keys(alertConfig.applications)[0];
    (isGlobalSmartAlert ? updateGlobalAlertConfig : updateAlertConfig)(alertConfig, form.get('id').value).once(
      config => {
        //Uncomment this if success message is needed while editing.
        //showSuccessMessage(alertConfig.name, isEffectivelyEditMode, isEffectivelyGlobalSmartAlert);
        trackAlertUpdated(alertConfig);
        return isEffectivelyGlobalSmartAlert
          ? navigateToGlobalAlertConfigWithoutAPDashboard(alertConfig.id)
          : alertConfigApplicationId &&
              navigateToAlertConfig(alertConfig.id, config?.created, alertConfigApplicationId);
      },
      error => {
        logger.error(`failed to update alertConfig: ${alertConfig} ${error.message}`, error);
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  } else {
    (isEffectivelyGlobalSmartAlert ? createGlobalAlertConfig : createAlertConfig)(alertConfig).once(
      config => {
        const newConfig = duplicateFrom ? { ...config, cloneFromId: duplicateFrom } : config;
        trackAlertSaved(newConfig, false);
        if (migrationMode && eventSpecificationId)
          disableMigratedCustomEventSpecification(eventSpecificationId, config.id).once();
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
