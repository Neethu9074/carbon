import React from 'react';
import rpt from 'prop-types';

import { joinClassNames } from 'in-services/util/classnames';
import locals from './BadgeKeyValue.mless';

export default BadgeKeyValue;
function BadgeKeyValue({
  label,
  value,
  className,
  labelBackground,
  labelColor,
  labelBorderColor,
  valueBackground,
  valueColor,
  valueBorderColor
}) {
  labelBorderColor = labelBorderColor || labelBackground;
  valueBorderColor = valueBorderColor || labelBorderColor;
  valueColor = valueColor || labelBackground;

  return (
    <span className={joinClassNames(locals.badgeWrapper, className)}>
      <span
        className={joinClassNames(locals.badge, locals.badgeKey)}
        style={{
          borderColor: labelBorderColor,
          background: labelBackground,
          color: labelColor
        }}
      >
        {label}
      </span>
      <span
        className={joinClassNames(locals.badge, locals.badgeValue)}
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
  className: rpt.string,
  labelBackground: rpt.string,
  labelColor: rpt.string,
  labelBorderColor: rpt.string,
  valueBackground: rpt.string,
  valueColor: rpt.string,
  valueBorderColor: rpt.string
};
