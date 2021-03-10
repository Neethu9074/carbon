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
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { SmartAlertConfigDialog } from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialog';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import AdvancedModeContainer from 'in-alerting/smart-alerts/applications/advanced/AdvancedModeContainer';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import SimpleModeContainer from 'in-alerting/smart-alerts/applications/simple/SimpleModeContainer';
import { createAlertConfig, updateAlertConfig } from 'in-applications/api/applicationAlertConfig';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';

const logger = createLogger('in-applications/alerting/Dialog/SmartAlertConfigDialogWrapper');

const initialChartConfigIndex = 0;

export default function SmartAlertConfigDialogWrapper({ applicationLabel, onClose, editMode, formData }) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const [form, setForm] = useState(() => createSmartAlertForm(formData));
  const [isSaving, setIsSaving] = useState(false);

  return (
    <SmartAlertConfigDialog
      applicationLabel={applicationLabel}
      editMode={editMode}
      form={form}
      updateForm={setForm}
      granularity={form.get('granularity').value}
      onChange={(path, fn) => setForm(form.updateIn(path, fn))}
      onChartViewConfigChange={setSelectedChartViewConfigIndex}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      AdvancedModeElement={AdvancedModeContainer}
      SimpleModeElement={SimpleModeContainer}
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
        onClose();
      }}
      withTrackCreate={simpleMode => {
        applicationsAlertingAlertCreated({ mode: simpleMode ? 'Simple' : 'Advanced' });
        createAlert({ form, setForm, onClose, editMode, setIsSaving });
      }}
      isSaving={isSaving}
    />
  );
}

SmartAlertConfigDialogWrapper.propTypes = {
  applicationLabel: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  formData: PropTypes.shape({
    applicationId: PropTypes.string.isRequired,
    boundaryScope: PropTypes.string,
    calculateThresholdOnBackend: PropTypes.bool,
    tagFilterExpression: PropTypes.object // backend model
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

function createAlert({ form, setForm, onClose, editMode, setIsSaving }) {
  setIsSaving(true);

  if (!form.hierarchyValid) {
    setForm(form.setTouched(true, { recurse: true }));
    setIsSaving(false);
    return;
  }

  const alertConfig = toAlertConfig(form);

  if (editMode) {
    updateAlertConfig(alertConfig, form.get('id').value).once(
      () => onClose(),
      error => {
        logger.error(`failed to update alertConfig: ${alertConfig} ${error.message}`, error);
        setIsSaving(false);
      }
    );
  } else {
    createAlertConfig(alertConfig).once(
      () => onClose(),
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

  alertConfig.name = alertConfig.name || getTitlePlaceholder(form);
  alertConfig.description = alertConfig.description || getDescriptionPlaceholder(form);
  return alertConfig;
}
