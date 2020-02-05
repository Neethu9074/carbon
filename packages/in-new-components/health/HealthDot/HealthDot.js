import PropTypes from 'prop-types';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { getColorBySeverity } from 'in-stores/events';
import Tooltip from 'in-components/Tooltip';

import locals from './HealthDot.mless';

export default function HealthDot({ severity = 0, explanation, iconSize, className }) {
  return (
    <Tooltip content={explanation}>
      <div
        style={{ width: iconSize, height: iconSize, backgroundColor: getColorBySeverity(severity) }}
        className={evaluateClassNames({ [locals.dot]: true, [className]: true })}
      />
    </Tooltip>
  );
}

HealthDot.propTypes = {
  severity: PropTypes.number,
  explanation: PropTypes.string,
  iconSize: PropTypes.number,
  className: PropTypes.string
};
