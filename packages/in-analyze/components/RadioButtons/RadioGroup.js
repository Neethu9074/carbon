import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { entityTypes } from 'in-analyze/applicationFilter';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import locals from './RadioGroup.mless';

const RadioGroup = ({ disabled, onChange, value, sourceEntityAvailability }) => {
  return (
    <Tooltip content={toolTipContent(disabled, sourceEntityAvailability)} align="topMiddle">
      <div className={locals.inputGroup}>
        <label
          className={evaluateClassNames({
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
          className={evaluateClassNames({
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
    </Tooltip>
  );
};

export default RadioGroup;

function toolTipContent(disabled, sourceEntityAvailability) {
  if (!sourceEntityAvailability) {
    return 'Filtering and grouping on source is not available for the selected timeframe';
  } else if (disabled) {
    return 'This tag is independent of source and destination';
  } else {
    return '';
  }
}
