import PropTypes from 'prop-types';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Value from 'in-new-components/KeyValue/components/Value';
import Key from 'in-new-components/KeyValue/components/Key';

import locals from './KeyValue.mless';

export const themes = {
  default: 'default',
  blue: 'blue'
};

export default function KeyValue({ className, label, value, theme = themes.d, inverted, accentuated }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [className]: className
      })}
    >
      <Key label={label} theme={theme} inverted={inverted} accentuated={accentuated && inverted} />
      <Value value={value} theme={theme} inverted={inverted} accentuated={!inverted && accentuated} />
    </div>
  );
}

KeyValue.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  value: PropTypes.string,
  inverted: PropTypes.bool,
  accentuated: PropTypes.bool,
  theme: PropTypes.oneOf(Object.keys(themes))
};
