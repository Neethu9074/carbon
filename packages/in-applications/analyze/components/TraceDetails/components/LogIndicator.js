/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef, useContext } from 'react';

import LogsInCallsContext from 'in-applications/analyze/AnalyzeView2_0/LogsInCallsContext';
import { role } from 'in-stores/user';
import { useTheme } from 'in-themes';

import locals from './LogIndicator.mless';

export default forwardRef(function LogIndicator(props, ref) {
  const theme = useTheme();
  const indicatorProps = { theme, ...props };
  return <LogV2Indicator {...indicatorProps} ref={ref} />;
});

const LogV2Indicator = forwardRef(function LogV2IndicatorFn(props, ref) {
  const { onCallClicked } = props;
  const { setSelectedLog } = useContext(LogsInCallsContext);

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

function getStyleProps({ left, inTimeline, log, theme }) {
  return {
    style: {
      left: `calc(${left}% - 10px`,
      top: `calc(${top}px - 7.5px)`,
      borderColor: `${
        log.errorCount ? theme.ids.color.option.red['500'] : theme.ids.color.option.yellow['500']
      } transparent transparent`
    },
    className: inTimeline ? locals.logIndicatorTimeline : locals.logIndicator
  };
}
