import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import Value from 'in-new-components/lists/KeyValue/components/Value';
import Key from 'in-new-components/lists/KeyValue/components/Key';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './KeyValue.mless';

export const themes = {
  default: 'default',
  blue: 'blue'
};

const KeyValue = forwardRef(function KeyValue(
  { className, label, value, customValue, theme = themes.default, inverted, accentuated },
  ref
) {
  const k = <Key label={label} />;
  const v = <Value value={customValue || value} theme={theme} accentuated={accentuated} />;

  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [className]: className
      })}
      ref={ref}
    >
      {inverted ? (
        <>
          {v}
          {k}
        </>
      ) : (
        <>
          {k}
          {v}
        </>
      )}
    </div>
  );
});
export default KeyValue;

KeyValue.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  className: PropTypes.string,
  customValue: PropTypes.any,
  inverted: PropTypes.bool,
  accentuated: PropTypes.bool,
  theme: PropTypes.oneOf(Object.keys(themes))
};
