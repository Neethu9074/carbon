/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useMemo, useState } from 'react';
import { MapForm } from 'formalistic';
import { isEmpty } from 'lodash';

import { createLogger } from '@instana/logger';

import {
  enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError,
  EnrichedError
} from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import {
  ApplicationSmartAlertConfigWithMetadata,
  GlobalApplicationsSmartAlertConfigWithMetadata
} from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import {
  ALERTING_SAVED,
  ALERTING_UPDATED,
  APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_FINISHED
} from 'in-services/tracking/eventNames';
import {
  createGlobalAlertConfig,
  updateGlobalAlertConfig
} from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
//@ts-expect-error TS migration
import * as HelperFunction from 'in-alerting/smart-alerts/applications/tearSheet/components/AlertConfigHelper';
import {
  useNavigationToAlertConfig,
  useNavigationToGlobalAlertConfigWithoutAPDashboard
} from 'in-applications/navigation/paths';
import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/applications/tearSheet/AlertConfigTearSheetWithThreshold';
import getAlertingUrlParameters from 'in-alerting/smart-alerts/applications/tearSheet/components/getAlertingUrlParameters';
import { createAlertConfig, updateAlertConfig } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useApplicationSmartAlertFormSideEffects';
import useGetMigrationAlertConfig from 'in-alerting/smart-alerts/applications/hooks/useGetMigrationAlertConfig';
import useGetSmartAlertConfig from 'in-alerting/smart-alerts/applications/hooks/useGetSmartAlertConfig';
import TearSheetLoading from 'in-alerting/smart-alerts/components/tearSheet/Loading/TearSheetLoading';
import { useSegmentTracking, CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { disableMigratedCustomEventSpecification } from 'in-api/eventSpecifications';
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

  const applicationIds = { applicationId, serviceId, endpointId };
  const applicationMode = { migrationMode, editMode, duplicateMode, potentialProblemMode };

  const applicationSmartAlertConfig = getApplicationAlertConfig(
    isGlobalSmartAlert,
    alertConfig,
    migrateAlertConfig,
    boundaryScope,
    applicationIds,
    applicationMode
  );
  //function for segment tracking
  const { trackCta } = useSegmentTracking();

  if (alertConfigErrors?.length) {
    return <ErroneousResultPresenter errors={[...alertConfigErrors]} />;
  } else if (!applicationSmartAlertConfig) {
    return <TearSheetLoading />;
  } else {
    return (
      <AlertConfigTearSheetContent
        alertConfig={
          applicationSmartAlertConfig as unknown as
            | GlobalApplicationsSmartAlertConfigWithMetadata
            | ApplicationSmartAlertConfigWithMetadata
        }
        scopeMigrationDetails={scopeMigrationDetails}
        location={location}
        trackCta={trackCta}
      />
    );
  }
}

export type ScopeMigrationDetailsType = {
  result: string;
  query?: string;
};
interface AlertConfigTearSheetContentProps {
  alertConfig: GlobalApplicationsSmartAlertConfigWithMetadata | ApplicationSmartAlertConfigWithMetadata;
  scopeMigrationDetails?: ScopeMigrationDetailsType;
  location: Location;
  trackCta: CtaTrackingFunction;
}

function AlertConfigTearSheetContent({
  alertConfig,
  scopeMigrationDetails,
  location,
  trackCta
}: AlertConfigTearSheetContentProps) {
  const { migrationMode, editMode, isGlobalSmartAlert, eventSpecificationId, cancelTearSheet } = useMemo(() => {
    return getAlertingUrlParameters(location);
  }, [location]);

  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const duplicateFrom = (alertConfig as any)?.duplicateFrom;

  const [form, setForm] = useState(() =>
    createSmartAlertForm(fromAlertConfig(alertConfig), editMode, isGlobalSmartAlert, true)
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
    setForm(createSmartAlertForm(fromAlertConfig(alertConfig), editMode, isGlobalSmartAlert, true));
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
              eventSpecificationId,
              trackCta
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
      eventSpecificationId,
      trackCta
    });
  };

  return (
    <>
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
        initialConfiguredApplications={(alertConfig as any)?.applications ?? {}}
        cancelTearSheet={cancelTearSheet}
        tearSheetTitle={getHeaderTitle(isGlobalSmartAlert, editMode, migrationMode)}
      />
    </>
  );
}

interface CreateOrSaveAlertProps {
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
  trackCta: CtaTrackingFunction;
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
  eventSpecificationId,
  trackCta
}: CreateOrSaveAlertProps) {
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
        trackCta(ALERTING_UPDATED, { ...alertConfig });
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

        if (migrationMode && eventSpecificationId) {
          trackCta(APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_FINISHED, { ...newConfig, eventSpecificationId });
          disableMigratedCustomEventSpecification(eventSpecificationId, config.id).once();
        } else {
          trackCta(ALERTING_SAVED, { ...newConfig });
        }

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
