import { withState } from 'recompose';
import React, { Fragment } from 'react';

import StackTraceBehavior from 'in-analyze/TraceDetail/components/CallDetails/components/StackTrace/StackTraceBehavior';
import LogIndicator from 'in-analyze/TraceDetail/components/LogIndicator';
import { shorten } from 'in-services/util/string';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './ExpandableStackTrace.mless';

export default withState('isExpanded', 'setIsExpanded', false)(function ExpandableStackTrace({
  call,
  log,
  isExpanded,
  setIsExpanded
}) {
  const logData = log.data.log;

  function logLabel(log) {
    if (!logData) {
      return log.name;
    }
    return isExpanded ? logData.message : shorten(logData.message, 32);
  }

  return (
    <div className={locals.wrapper}>
      <div className={locals.header}>
        <div className={locals.headerContent}>
          <LogIndicator log={log} />
          <div className={isExpanded ? locals.headerLabelsExpanded : locals.headerLabels}>
            <div className={log.errorCount > 0 ? locals.severityLabelFailure : locals.severityLabelWarning}>
              {log.errorCount > 0 ? 'Error' : 'Warning'}
            </div>
            <div className={isExpanded ? locals.labelExpanded : locals.label}>{logLabel(log)}</div>
          </div>
        </div>
        <div className={locals.headerActions}>
          <Tooltip content="Show Stack Trace">
            <SvgIcon
              className={locals.expandIcon}
              type={isExpanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
              aria-label="Expand button for content"
              tabIndex={0}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </Tooltip>
        </div>
      </div>
      {isExpanded && (
        <Fragment>
          {logData &&
            logData.parameters && (
              <div className={locals.stackTraceWrapper}>
                <div className={locals.stackTraceWrapperHeader}>Log Parameters</div>
                <div className={locals.logParameters}>{logData.parameters}</div>
              </div>
            )}

          {log.stackTrace.length > 0 && (
            <div className={locals.stackTraceWrapper}>
              <div className={locals.stackTraceWrapperHeader}>Log Stack Trace</div>
              <StackTraceBehavior stackTrace={log.stackTrace} relation={call.destination} />
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
});
