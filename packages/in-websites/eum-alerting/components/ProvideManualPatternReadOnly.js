import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames, selectOptions } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ProvideManualPatternReadOnly.mless';

export default function ProvideManualPatternReadOnly({ form }) {
  return (
    <div className={locals.outerWrapper}>
      <div className={locals.innerWrapper}>
        <SvgIcon className={locals.icon} type="lib_help_error_warning" />

        <div>
          {form.get(fieldNames.ruleOperator).map(field => (
            <span className={locals.heading}>
              Error Message (
              {`${selectOptions[fieldNames.ruleOperator].filter(entry => entry.value === field.value)[0].label}`})
            </span>
          ))}
          {form.get(fieldNames.ruleValue).map(field => (
            <p className={locals.text}>{field.value}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

ProvideManualPatternReadOnly.propTypes = {
  form: PropTypes.object.isRequired
};
