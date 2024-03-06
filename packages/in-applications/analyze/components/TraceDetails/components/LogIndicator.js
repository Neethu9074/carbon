/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import { useLogsInCallsContext } from 'in-components/Logging/TraceDetails/LogsInCallsContext';
import { getLogLevelAndColor } from 'in-components/Logging/TraceDetails/utils';
import { role } from 'in-stores/user';

import locals from './LogIndicator.mless';

export default forwardRef(function LogIndicator(props, ref) {
  return <LogV2Indicator {...props} ref={ref} />;
});

const LogV2Indicator = forwardRef(function LogV2IndicatorFn(props, ref) {
  const { onCallClicked } = props;
  const { setSelectedLog } = useLogsInCallsContext();

  return (
    <div
      ref={ref}
      {...getStyleProps(props)}
      onClick={e => {
        if (role.canViewLogs) {
          onCallClicked?.({ ...props.log, id: props.parentCall.id });
          setSelectedLog(props.log);
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    />
  );
});

function getStyleProps({ left, inTimeline, log }) {
  const { color } = getLogLevelAndColor(log);

  return {
    style: {
      left: `calc(${left}% - 10px`,
      top: `calc(${top}px - 7.5px)`,
      borderColor: `${color} transparent transparent`
    },
    className: inTimeline ? locals.logIndicatorTimeline : locals.logIndicator
  };
}
