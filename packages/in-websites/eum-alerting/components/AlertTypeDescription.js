import PropTypes from 'prop-types';
import React from 'react';

import {
  withSlownessFormStaticThreshold,
  withSlownessFormHistoricBaseline
} from 'in-websites/eum-alerting/form/slownessForm';
import { fieldNames, hiddenFieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { withStatusCodesFormSpecificStatusCode } from 'in-websites/eum-alerting/form/statusCodesForm';
import { withJsErrorsFormSpecificError } from 'in-websites/eum-alerting/form/jsErrorsForm';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
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
            let metricToSelect;
            let updatedForm = form;

            if (config.type === alertTypes.specificJsError) {
              metricToSelect = { name: fieldNames.ruleMetricName, value: 'errors' };
              updatedForm = withJsErrorsFormSpecificError(form);
            } else if (config.type === alertTypes.slowness) {
              metricToSelect = { name: fieldNames.ruleMetricName, value: 'onLoadTime' };
              const thresholdType = form.get(fieldNames.thresholdType).value;

              if (thresholdType === 'staticThreshold') {
                updatedForm = withSlownessFormStaticThreshold(form);
              }
              if (thresholdType.includes('historicBaseline.')) {
                updatedForm = withSlownessFormHistoricBaseline(form);
              }
            } else if (config.type === alertTypes.specificStatusCode) {
              metricToSelect = { name: fieldNames.ruleMetricName, value: 'httpxxx' };
              updatedForm = withStatusCodesFormSpecificStatusCode(form);
            }

            const doCalculateThresholdOnBackend = {
              name: hiddenFieldNames.calculateThresholdOnBackend,
              value: true
            };
            onChange(updatedForm, fieldNames.ruleAlertType, config.type, metricToSelect, doCalculateThresholdOnBackend);
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
