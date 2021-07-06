/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useLocation } from 'react-router';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import React from 'react';

import SimpleAlertConfigDialogStep3 from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleAlertConfigDialogStep3';
import SimpleAlertConfigDialogStep2 from 'in-alerting/smart-alerts/applications/simple/SimpleAlertConfigDialogStep2';
import SimpleAlertConfigDialogStep1 from 'in-alerting/smart-alerts/applications/simple/SimpleAlertConfigDialogStep1';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleModeContainer';
import { applicationsAlertingStepSwitch as trackStepSwitch } from 'in-alerting/smart-alerts/applications/tracker';
import { getEntitySelection } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { applicationId as applicationIdMatrixParam } from 'in-applications/navigation/matrix';
import { applicationDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { t } from 'in-i18n';

const stepConfigs = [
  {
    title: t('in-alerting:smartAlerts.applications.simple.step1Title'),
    validateIntermediately: [
      ['rule', 'message'],
      ['rule', 'level']
    ]
  },
  {
    title: t('in-alerting:smartAlerts.applications.simple.step2Title'),
    validateIntermediately: [['applications']]
  },
  {
    title: t('in-alerting:smartAlerts.applications.simple.step3Title'),
    validateIntermediately: [['alertChannelIds']]
  }
];

export default function ApplicationsSimpleModeContainer({
  onChange,
  setSliderState,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  isGlobalSmartAlert,
  ...props
}) {
  const location = useLocation();
  const { form, updateForm } = props;
  const stepRenderers = [
    parentProps => (
      <SimpleAlertConfigDialogStep1
        setLogMessagesListVisible={setSliderState}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        {...parentProps}
      />
    ),
    parentProps => (
      <SimpleAlertConfigDialogStep2
        isGlobalSmartAlert={isGlobalSmartAlert}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        {...parentProps}
      />
    ),
    parentProps => <SimpleAlertConfigDialogStep3 onChange={onChange} setSliderState={setSliderState} {...parentProps} />
  ];

  return (
    <SimpleModeContainer
      stepConfigs={stepConfigs}
      onStepChanged={getOnStepSwitch({ form, updateForm, location })}
      stepRenderers={stepRenderers}
      {...props}
    />
  );
}

ApplicationsSimpleModeContainer.propTypes = {
  form: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  setSimpleModeStep: PropTypes.func.isRequired,
  setSliderState: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  isTagFilterFormModelValid: PropTypes.bool.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired,
  isGlobalSmartAlert: PropTypes.bool
};

function getOnStepSwitch({ form, updateForm, location }) {
  return (oldStep, nextStep) => {
    if (nextStep === 0) {
      const applications = form.get('applications').value;
      if (isEmpty(applications)) {
        const applicationId = getMatrixParameter(location, applicationDashboard, applicationIdMatrixParam);
        updateForm(form.updateIn(['applications'], f => f.setValue(getEntitySelection(applicationId))));
      }
    }

    trackStepSwitch({ oldStep, nextStep });
  };
}
