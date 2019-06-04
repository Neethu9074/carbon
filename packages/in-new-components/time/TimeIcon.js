import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { percentage } from 'in-services/formatters/number';
import { isInstanaEngineer } from 'in-stores/user';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './TimeIcon.mless';

const HISTORIC_DATA_MESSAGE = 'Historic Data - Showing approximate data due to the data retention settings. ';
const LARGE_DATA_MESSAGE =
  'Large Dataset - Showing approximate data, reduce the selected time range for precise data. ';

export default function TimeIcon({
  selected,
  containsPastLiveData,
  largeData,
  samplingLevel,
  theme = 'dark',
  className
}) {
  const content = (
    <div
      className={evaluateClassNames({
        [locals.iconWrapper]: true,
        [locals[theme]]: true,
        [className]: className
      })}
    >
      <SvgIcon
        className={evaluateClassNames({
          [locals.timeIcon]: true,
          [locals.timeIconExpanded]: selected
        })}
        type="lib_datetime_time"
        width={24}
      />

      {containsPastLiveData && <SvgIcon width={16} className={locals.indicator} type="lib_help_error_error_circle" />}

      {largeData && <SvgIcon width={16} className={locals.indicator} type="lib_approximately_equal" />}
    </div>
  );

  if (containsPastLiveData) {
    return (
      <Tooltip themeStyle="light" align="leftMiddle" content={<TooltipContent message={HISTORIC_DATA_MESSAGE} />}>
        {content}
      </Tooltip>
    );
  }

  if (largeData) {
    return (
      <Tooltip
        themeStyle="light"
        align="leftMiddle"
        content={<TooltipContent message={LARGE_DATA_MESSAGE} samplingLevel={samplingLevel} />}
      >
        {content}
      </Tooltip>
    );
  }

  return content;
}

function TooltipContent({ message, samplingLevel }) {
  return (
    <div>
      {message}
      {isInstanaEngineer && samplingLevel && ` (sampling ratio = ${percentage.detailed(samplingLevel.samplingRatio)})`}
    </div>
  );
}
