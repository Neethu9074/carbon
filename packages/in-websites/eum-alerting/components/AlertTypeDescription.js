import PropTypes from 'prop-types';
import React from 'react';

import {
  withSlownessFormStaticThreshold,
  withSlownessFormHistoricBaseline
} from 'in-websites/eum-alerting/data/slownessForm';
import { withJsErrorsFormSpecificError } from 'in-websites/eum-alerting/data/jsErrorsForm';
import { fieldNames } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { alertTypes } from '../data/alertTypeConfigData';
import Button from 'in-new-components/Button/Button';

import locals from './AlertTypeDescription.mless';

export function AlertTypeDescription({ form, config, onChange }) {
  const { headline, text } = config;

  return (
    <div className={locals.container}>
      <div>
        <h3 className={locals.headline}>{headline}</h3>
        <DangerousHtmlPresenter className={locals.text} html={text} />
      </div>
      {form && (
        <Button
          className={locals.button}
          onClick={() => {
            let updatedForm = form;

            if (config.type === alertTypes.specificJsError) {
              updatedForm = withJsErrorsFormSpecificError(form);
            }
            if (config.type === alertTypes.slowness) {
              const thresholdType = form.get(fieldNames.thresholdType).value;

              if (thresholdType === 'staticThreshold') {
                updatedForm = withSlownessFormStaticThreshold(form);
              }
              if (thresholdType.includes('historicBaseline.')) {
                updatedForm = withSlownessFormHistoricBaseline(form);
              }
            }

            // addMetricForOnLoadTime will onle be added this way as long as we have not the secondary menu to select alert types
            const addMetricForOnLoadTime = { name: fieldNames.ruleMetricName, value: 'onLoadTime' };
            // addMetricForJsErrors will onle be added this way as long as we have not the secondary menu to select alert types
            const addMetricForJsErrors = { name: fieldNames.ruleMetricName, value: 'errors' };

            const doCalculateTresholdOnBackend = { name: fieldNames.calculateThresholdOnBackend, value: true };
            onChange(
              updatedForm,
              fieldNames.ruleAlertType,
              config.type,
              config.type === 'slowness' ? addMetricForOnLoadTime : addMetricForJsErrors,
              doCalculateTresholdOnBackend
            );
          }}
        >
          Select
        </Button>
      )}
    </div>
  );
}

AlertTypeDescription.propTypes = {
  config: PropTypes.object.isRequired,
  form: PropTypes.object,
  onChange: PropTypes.func
};
