/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import { loggingEnabledOnTrace } from 'in-services/featureFlags';
import { getTraceIdTagFilter } from 'in-logging/queryBuilder';
import getLogs from 'in-logging/subscriptions/getLogs';
import theme from 'in-themes';

import locals from './LogIndicator.mless';

export default forwardRef(function LogIndicator(props, ref) {
  if (loggingEnabledOnTrace) {
    return <LogV2Indicator {...props} ref={ref} />;
  }
  return <LogV1Indicator {...props} ref={ref} />;
});

const LogV1Indicator = forwardRef(function LogV1IndicatorFn(props, ref) {
  const { parentCall, onCallClicked } = props;
  return (
    <div ref={ref} {...getStyleProps(props)} onClick={onCallClicked != null ? () => onCallClicked(parentCall) : null} />
  );
});

const LogV2Indicator = forwardRef(function LogV2IndicatorFn(props, ref) {
  const { selectLogId, onCallClicked, parentCall, log } = props;

  const logId = useLogId({ ...props, spanId: log.id });

  return (
    <div
      ref={ref}
      {...getStyleProps(props)}
      onClick={() => (logId ? selectLogId(logId) : onCallClicked != null ? () => onCallClicked(parentCall) : null)}
    />
  );
});

function getStyleProps({ left, inTimeline, log }) {
  return {
    style: {
      left: `calc(${left}% - 10px`,
      top: `calc(${top}px - 7.5px)`,
      borderColor: `${log.errorCount ? theme.lib.colors.failure : theme.lib.colors.warning} transparent transparent`
    },
    className: inTimeline ? locals.logIndicatorTimeline : locals.logIndicator
  };
}

function useLogId(props) {
  const { spanId, traceId, timeConfigForLogs, totalNumberOfLogs } = props;
  const { items = [] } = useLogsCursorPagination(
    params => getData({ traceId, timeConfigForLogs, totalNumberOfLogs, ...params }),
    [traceId, traceId, totalNumberOfLogs]
  );

  return items.filter(({ tags }) =>
    tags.some(({ name, stringValue }) => name === 'log.spanId' && stringValue === spanId)
  )[0]?.itemId;
}

function getData({ traceId, timeConfigForLogs, totalNumberOfLogs }) {
  return getLogs({
    timeConfig: timeConfigForLogs,
    retrievalSize: totalNumberOfLogs,
    tagFilterExpression: getTraceIdTagFilter(traceId)
  });
}
