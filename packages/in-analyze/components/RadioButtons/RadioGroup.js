import React, { Fragment } from 'react';
import classNames from 'classnames';

import { entityTypes } from 'in-analyze/applicationFilter';
import Message from 'in-new-components/Message';
import SvgIcon from 'in-components/SvgIcon';

import locals from './RadioGroup.mless';

const RadioGroup = ({ disabled, onChange, value, sourceEntityAvailability }) => {
  if (!sourceEntityAvailability) {
    return <Message small title="Filtering and grouping on source is not available for the selected timeframe" />;
  } else if (disabled && value !== entityTypes.SOURCE) {
    return <Message small title="This tag is independent of source and destination" />;
  }
  return (
    <Fragment>
      <span className={locals.textLabel}>
        {disabled && value === entityTypes.SOURCE
          ? 'Applies only to the source of the call'
          : 'Apply to call source or destination'}
      </span>
      <div className={locals.inputGroup}>
        <label
          className={classNames({
            [locals.radioInput]: true,
            [locals.radioInputChecked]: value === entityTypes.SOURCE,
            [locals.radioInputDisabled]: disabled
          })}
        >
          <input
            type="radio"
            name="sourceInput"
            value={entityTypes.SOURCE}
            checked={value === entityTypes.SOURCE}
            onChange={onChange}
          />
          <SvgIcon className={locals.icon} type="lib_application_call_source" />
          <span className={locals.label}>Source</span>
        </label>

        <label
          className={classNames({
            [locals.radioInput]: true,
            [locals.radioInputChecked]: value === entityTypes.DESTINATION,
            [locals.radioInputDisabled]: disabled
          })}
        >
          <input
            type="radio"
            name="destinationInput"
            value={entityTypes.DESTINATION}
            checked={value === entityTypes.DESTINATION}
            onChange={onChange}
          />
          <SvgIcon className={locals.icon} type="lib_application_call_destination" />
          <span className={locals.label}>Destination</span>
        </label>
      </div>
    </Fragment>
  );
};

export default RadioGroup;
