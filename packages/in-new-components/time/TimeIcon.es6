import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './TimeIcon.mless';

export default function TimeIcon({ selected, containsPastLiveData, theme = 'dark', className }) {
  const content = (
    <div
      className={evaluateClassNames({
        [locals.iconWrapper]: true,
        [locals[theme]]: true
      })}
    >
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
        <SvgIcon width={16} className={locals.pastLiveDataIndicator} type="lib_help_error_error_circle" />
      )}
    </div>
  );

  if (containsPastLiveData) {
    return (
      <Tooltip themeStyle="light" content="Sampled Data - Significant calls and all KPIs have been preserved.">
        {content}
      </Tooltip>
    );
  }

  return content;
}
