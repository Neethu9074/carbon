import React from 'react';

import { getStart } from 'in-analyze/TraceDetail/components/callStartAndEndTime';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { joinClassNames } from 'in-services/util/classnames';
import { formatTime } from 'in-services/formatters/date';
import SvgIcon from 'in-components/SvgIcon';

import locals from './CallStartLabel.mless';

export default getElementDimensions(({ startTime, call, className }) => {
  startTime = startTime || getStart(call);

  return (
    <span className={joinClassNames(locals.callStartLabel, className)}>
      <SvgIcon className={locals.icon} type="lib_datetime_time" width={24} height={24} />
      {`Started: ${formatTime(startTime)}`}
    </span>
  );
});
