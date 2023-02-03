/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import {
  getTraceIdTagFilter,
  LOG_CUSTOM,
  LOG_SPAN_ID,
  LOG_LEVEL,
  LOG_EXCEPTION_TYPE,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE
} from 'in-logging/queryBuilder';
import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import { loggingEnabled } from 'in-services/featureFlags';
import getLogs from 'in-logging/subscriptions/getLogs';
import { role } from 'in-stores/user';
import theme from 'in-themes';

import locals from './LogIndicator.mless';

export default forwardRef(function LogIndicator(props, ref) {
  if (loggingEnabled && props.totalNumberOfLogs > 0) {
    return <LogV2Indicator {...props} ref={ref} />;
  }
  return <LogV1Indicator {...props} ref={ref} />;
});

const LogV1Indicator = forwardRef(function LogV1IndicatorFn(props, ref) {
  const { parentCall, onCallClicked } = props;
  return (
    <div
      ref={ref}
      {...getStyleProps(props)}
      onClick={
        onCallClicked != null
          ? e => {
              if (!role.canViewLogs) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              onCallClicked(parentCall);
            }
          : null
      }
    />
  );
});

const LogV2Indicator = forwardRef(function LogV2IndicatorFn(props, ref) {
  const { selectLogId, onCallClicked, parentCall, log } = props;

  const logId = useLogId({ ...props, spanId: log.id });

  return (
    <div
      ref={ref}
      {...getStyleProps(props)}
      onClick={e => {
        if (!role.canViewLogs) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        if (logId) {
          e.preventDefault();
          e.stopPropagation();
          return selectLogId({ logId, spanId: log.id });
        }
        if (onCallClicked) {
          onCallClicked(parentCall);
        }
      }}
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
    tags.some(({ name, stringValue }) => name === LOG_SPAN_ID && stringValue === spanId)
  )[0]?.itemId;
}

function getData({ traceId, timeConfigForLogs, totalNumberOfLogs }) {
  return getLogs({
    timeConfig: timeConfigForLogs,
    retrievalSize: totalNumberOfLogs,
    tagFilterExpression: getTraceIdTagFilter(traceId),
    requestedTags: [LOG_CUSTOM, LOG_LEVEL, LOG_EXCEPTION_TYPE, LOG_EXCEPTION_MESSAGE, LOG_EXCEPTION_STACK_TRACE]
  });
}
