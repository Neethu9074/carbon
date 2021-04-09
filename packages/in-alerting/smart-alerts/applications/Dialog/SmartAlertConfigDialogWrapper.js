/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createLogger } from '@instana/logger';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  applicationsAlertingAlertCreated,
  applicationsAlertingCloseDialog,
  applicationsAlertingSwitchMode
} from 'in-alerting/smart-alerts/applications/tracker';
import {
  updateGlobalAlertConfig,
  createGlobalAlertConfig
} from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import ApplicationsSimpleModeContainer from 'in-alerting/smart-alerts/applications/simple/ApplicationsSimpleModeContainer';
import { createAlertConfig, updateAlertConfig } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { changeFormDataByCopyState } from 'in-alerting/smart-alerts/components/smart-alert-dialog/sharedFunctions';
import { SmartAlertConfigDialog } from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialog';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import AdvancedModeContainer from 'in-alerting/smart-alerts/applications/advanced/AdvancedModeContainer';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';

const logger = createLogger('in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialog');

const initialChartConfigIndex = 0;

export default function SmartAlertConfigDialogWrapper({
  applicationLabel,
  onClose,
  editMode,
  isGlobalSmartAlert,
  formData,
  isCopy
}) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);

  const [form, setForm] = useState(() => createSmartAlertForm(changeFormDataByCopyState(isCopy, formData), editMode));
  const [isSaving, setIsSaving] = useState(false);

  return (
    <SmartAlertConfigDialog
      applicationLabel={applicationLabel}
      isGlobalSmartAlert={isGlobalSmartAlert}
      editMode={editMode}
      form={form}
      updateForm={setForm}
      granularity={form.get('granularity').value}
      onChange={(path, fn) => setForm(form.updateIn(path, fn))}
      onChartViewConfigChange={setSelectedChartViewConfigIndex}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      AdvancedModeElement={AdvancedModeContainer}
      SimpleModeElement={ApplicationsSimpleModeContainer}
      setForm={setForm}
      timeConfig={chartViewConfigs[selectedChartViewConfigIndex].timeConfig}
      trackModeSwitch={(simpleMode, step) => {
        applicationsAlertingSwitchMode(
          getTrackingObject(
            form,
            simpleMode
              ? {
                  destinationMode: 'Advanced',
                  step
                }
              : {
                  destinationMode: 'Simple'
                }
          )
        );
      }}
      withTrackClose={trackingConfig => {
        applicationsAlertingCloseDialog(
          getTrackingObject(
            form,
            trackingConfig
              ? {
                  step: trackingConfig
                }
              : {
                  mode: 'Advanced'
                }
          )
        );
        onClose({});
      }}
      withTrackCreate={simpleMode => {
        applicationsAlertingAlertCreated({ mode: simpleMode ? 'Simple' : 'Advanced' });
        createAlert({ form, setForm, onClose, editMode, isGlobalSmartAlert, setIsSaving });
      }}
      isSaving={isSaving}
    />
  );
}

SmartAlertConfigDialogWrapper.propTypes = {
  applicationLabel: PropTypes.string,
  editMode: PropTypes.bool,
  isGlobalSmartAlert: PropTypes.bool,
  formData: PropTypes.shape({
    applications: PropTypes.object,
    boundaryScope: PropTypes.string,
    calculateThresholdOnBackend: PropTypes.bool,
    /**
     * The backed model of tagFilterExpression
     */
    tagFilterExpression: PropTypes.object,
    name: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  /**
   * Whether the new Smart Alert is a copy of a given Smart Alert
   */
  isCopy: PropTypes.bool
};

function createAlert({ form, setForm, onClose, editMode, isGlobalSmartAlert, setIsSaving }) {
  setIsSaving(true);

  if (!form.hierarchyValid) {
    setForm(form.setTouched(true, { recurse: true }));
    setIsSaving(false);
    return;
  }

  const alertConfig = toAlertConfig(form);

  if (editMode) {
    (isGlobalSmartAlert ? updateGlobalAlertConfig : updateAlertConfig)(alertConfig, form.get('id').value).once(
      alertConfig => onClose(alertConfig),
      error => {
        logger.error(`failed to update alertConfig: ${alertConfig} ${error.message}`, error);
        setIsSaving(false);
      }
    );
  } else {
    (isGlobalSmartAlert ? createGlobalAlertConfig : createAlertConfig)(alertConfig).once(
      alertConfig => onClose(alertConfig),
      error => {
        logger.error(`failed to save alertConfig: ${alertConfig} ${error.message}`, error);
        setIsSaving(false);
      }
    );
  }
}

function toAlertConfig(form) {
  const alertConfig = form
    .remove('hiddenFields')
    .updateIn(['tagFilterExpression'], f =>
      f.setValue(toBackendQueryModel(form.get('tagFilterExpression').value, false))
    )
    .toJS();

  alertConfig.applicationId = undefined;
  alertConfig.name = alertConfig.name || getTitlePlaceholder(form);
  alertConfig.description = alertConfig.description || getDescriptionPlaceholder(form);
  return alertConfig;
}
