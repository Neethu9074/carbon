import React from 'react';
import rpt from 'prop-types';

import { joinClassNames } from 'in-services/util/classnames';
import locals from './BadgeKeyValue.mless';

export default BadgeKeyValue;
function BadgeKeyValue({
  label,
  value,
  className,
  size = 'mid',
  style = {},
  labelBackground = '#a5b6be',
  labelColor = '#0C1415',
  labelBorderColor,
  valueBackground = '#fff',
  valueColor = '#0C1415',
  valueBorderColor
}) {
  labelBorderColor = labelBorderColor || labelBackground;
  valueBorderColor = valueBorderColor || labelBorderColor;
  valueColor = valueColor || labelBackground;

  return (
    <span style={style}>
      <span
        className={joinClassNames(locals.badge, locals.badgeKey, className, `${locals[size]}`)}
        style={{
          borderColor: labelBorderColor,
          background: labelBackground,
          color: labelColor
        }}
      >
        {label}
      </span>
      <span
        className={joinClassNames(locals.badge, locals.badgeValue, className, `${locals[size]}`)}
        style={{
          borderColor: valueBorderColor,
          background: valueBackground,
          color: valueColor
        }}
      >
        {value}
      </span>
    </span>
  );
}

BadgeKeyValue.propTypes = {
  label: rpt.string,
  value: rpt.string,
  size: rpt.string,
  className: rpt.string,
  style: rpt.object,
  labelBackground: rpt.string,
  labelColor: rpt.string,
  labelBorderColor: rpt.string,
  valueBackground: rpt.string,
  valueColor: rpt.string,
  valueBorderColor: rpt.string
};
