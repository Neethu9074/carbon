import { withState } from 'recompose';
import React from 'react';

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
  return (
    <div className={locals.wrapper}>
      <div className={locals.header}>
        <div className={locals.headerContent}>
          <LogIndicator log={log} />
          <div className={isExpanded ? locals.headerLabelsExpanded : locals.headerLabels}>
            <div className={log.errorCount > 0 ? locals.severityLabelFailure : locals.severityLabelWarning}>
              {log.errorCount > 0 ? 'Error' : 'Warning'}
            </div>
            <div className={isExpanded ? locals.labelExpanded : locals.label}>
              {isExpanded ? log.data.log.message : shorten(log.data.log.message, 32)}
            </div>
          </div>
        </div>
        <div className={locals.headerActions}>
          <Tooltip content="Show Stack Trace">
            <SvgIcon
              className={locals.expandIcon}
              type={isExpanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
              aria-label="Expand button for content"
              tabIndex={0}
              width={24}
              height={24}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </Tooltip>
        </div>
      </div>
      {isExpanded && (
        <div className={locals.stackTraceWrapper}>
          <div className={locals.stackTraceWrapperHeader}>Log Stack Trace</div>
          <StackTraceBehavior stackTrace={log.stackTrace} relation={call.source} />
        </div>
      )}
    </div>
  );
});
