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
import { useTheme } from 'in-themes';

import locals from './LogIndicator.mless';

export default forwardRef(function LogIndicator(props, ref) {
  const theme = useTheme();
  const indicatorProps = { theme, ...props };
  if (loggingEnabled && props.totalNumberOfLogs > 0) {
    return <LogV2Indicator {...indicatorProps} ref={ref} />;
  }
  return <LogV1Indicator {...indicatorProps} ref={ref} />;
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
