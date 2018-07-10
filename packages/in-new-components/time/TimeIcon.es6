import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TimeIcon.mless';

export default function TimeIcon({ selected, containsPastLiveData, theme = 'dark', className }) {
  return (
    <div className={locals.iconWrapper}>
      <SvgIcon
        className={evaluateClassNames({
          [locals.timeIcon]: true,
          [locals.timeIconExpanded]: selected,
          [className]: className
        })}
        type="lib_datetime_time_inverted"
        width={24}
      />
      {containsPastLiveData && (
        <SvgIcon
          width={16}
          className={evaluateClassNames({
            [locals.pastLiveDataIndicator]: true,
            [locals[theme]]: true
          })}
          type="lib_help_error_error_circle"
        />
      )}
    </div>
  );
}
