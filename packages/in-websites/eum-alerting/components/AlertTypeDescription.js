import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames, hiddenFieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { withStatusCodesFormSpecificStatusCode } from 'in-websites/eum-alerting/form/statusCodesForm';
import { withSlownessFormHistoricBaseline } from 'in-websites/eum-alerting/form/slownessForm';
import { withJsErrorsFormSpecificError } from 'in-websites/eum-alerting/form/jsErrorsForm';
import { resetAllThresholdValuesProps } from 'in-websites/eum-alerting/alertConfigUtil';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import * as constants from 'in-websites/eum-alerting/constants';
import Button from 'in-new-components/Button/Button';

import locals from './AlertTypeDescription.mless';

export function AlertTypeDescription({ form, config, onChange, selectButtonDisabled, setSelectButtonDisabled }) {
  const { headline, text } = config;

  return (
    <div className={locals.container}>
      <div>
        <h3 className={locals.headline}>{headline}</h3>
        <DangerousHtmlPresenter className={locals.text} html={text} />
      </div>
      {form && (
        <Button
          kind={selectButtonDisabled ? 'info' : 'primary'}
          className={locals.button}
          disabled={selectButtonDisabled}
          onClick={() => {
            if (form && onChange) {
              setSelectButtonDisabled(true);
              updateFormAndCallOnChange(form, config, onChange);
            }
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
  onChange: PropTypes.func,
  selectButtonDisabled: PropTypes.bool,
  setSelectButtonDisabled: PropTypes.func
};

function updateFormAndCallOnChange(form, config, onChange) {
  let updatedForm;
  let ruleMetricNameValue;
  let thresholdTypeValue;

  if (config.type === alertTypes.specificJsError) {
    updatedForm = withJsErrorsFormSpecificError(form);
    ruleMetricNameValue = constants.errorCount;
    thresholdTypeValue = 'staticThreshold';
  } else if (config.type === alertTypes.slowness) {
    updatedForm = withSlownessFormHistoricBaseline(form);
    ruleMetricNameValue = constants.onLoadTime;
    thresholdTypeValue = 'historicBaseline.DAILY';
  } else if (config.type === alertTypes.specificStatusCode) {
    updatedForm = withStatusCodesFormSpecificStatusCode(form);
    ruleMetricNameValue = constants.statusCodeCount;
    thresholdTypeValue = 'staticThreshold';
  }

  onChange(
    updatedForm,
    fieldNames.ruleAlertType,
    config.type,
    { name: fieldNames.ruleMetricName, value: ruleMetricNameValue },
    { name: fieldNames.thresholdType, value: thresholdTypeValue },
    { name: hiddenFieldNames.calculateThresholdOnBackend, value: true },
    ...resetAllThresholdValuesProps(updatedForm)
  );
}
