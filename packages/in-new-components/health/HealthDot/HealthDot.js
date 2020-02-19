import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { getColorBySeverity } from 'in-stores/events';
import Tooltip from 'in-components/Tooltip';

import locals from './HealthDot.mless';

export default function HealthDot({ severity = 0, explanation, iconSize, className }) {
  const dot = (
    <div
      style={{
        width: iconSize,
        height: iconSize,
        backgroundColor: getColorBySeverity(severity, { defaultColor: theme.lib.colors.success })
      }}
      className={evaluateClassNames({ [locals.dot]: true, [className]: true })}
    />
  );
  if (!explanation) {
    return dot;
  }
  return <Tooltip content={explanation}>{dot}</Tooltip>;
}

HealthDot.propTypes = {
  severity: PropTypes.number,
  explanation: PropTypes.string,
  iconSize: PropTypes.number,
  className: PropTypes.string
};
