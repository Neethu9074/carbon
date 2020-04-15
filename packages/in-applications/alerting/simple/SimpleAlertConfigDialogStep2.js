import PropTypes from 'prop-types';
import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/Alerting/simple/SimpleModeStepContentWrapper';
import SimpleAlertConfigDialogChart from 'in-applications/alerting/simple/SimpleAlertConfigDialogChart';
import AlertLocationFilters from 'in-applications/alerting/components/AlertLocationFilters';
import { propTypeTimeConfig } from 'in-stores/time/config';

import locals from './SimpleAlertConfigDialogStep2.mless';

export default function SimpleAlertConfigDialogStep2({ form, granularity, timeConfig, applicationLabel, updateForm }) {
  return (
    <SimpleModeStepContentWrapper headline="Where do you want the alert to trigger?">
      <div className={locals.alertLocationFiltersWrapper}>
        <AlertLocationFilters
          form={form}
          applicationLabel={applicationLabel}
          timeConfig={timeConfig}
          updateForm={updateForm}
          withoutLatencyItem
        />
      </div>

      <SimpleAlertConfigDialogChart form={form} granularity={granularity} timeConfig={timeConfig} />
    </SimpleModeStepContentWrapper>
  );
}

SimpleAlertConfigDialogStep2.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  updateForm: PropTypes.func.isRequired,
  timeConfig: propTypeTimeConfig.isRequired,
  applicationLabel: PropTypes.string.isRequired
};
