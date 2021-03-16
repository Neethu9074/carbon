/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { withState } from 'recompose';

import StackTraceBehavior from 'in-analyze/TraceDetail/components/CallDetails/components/StackTrace/StackTraceBehavior';
import LogIndicator from 'in-analyze/TraceDetail/components/LogIndicator';
import { shorten } from 'in-services/util/string';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Code from 'in-components/Code/Code';
import { t } from 'in-i18n';

import locals from './ExpandableStackTrace.mless';

export default withState(
  'isExpanded',
  'setIsExpanded',
  false
)(function ExpandableStackTrace({ call, log, isExpanded, setIsExpanded }) {
  const logData = log.data.log;
  const msg = logData && logData.message;
  const isString = typeof msg === 'string';

  return (
    <div className={locals.wrapper}>
      <div className={locals.header}>
        <div className={locals.headerContent}>
          <LogIndicator log={log} />
          <div className={isExpanded ? locals.headerLabelsExpanded : locals.headerLabels}>
            <div className={log.errorCount > 0 ? locals.severityLabelFailure : locals.severityLabelWarning}>
              {log.errorCount > 0
                ? t('in-analyze:traceDetail.components.callDetails.error')
                : t('in-analyze:traceDetail.components.callDetails.warning')}
            </div>
            {msg ? (
              isExpanded ? (
                <div className={locals.labelExpanded}>
                  {isString ? msg : <Code code={JSON.stringify(msg, 0, 2)} lang="json" showLineNumbers={false} />}
                </div>
              ) : (
                <div className={locals.label}>{shorten(isString ? msg : JSON.stringify(msg), 32)}</div>
              )
            ) : null}
          </div>
        </div>
        <div className={locals.headerActions}>
          <Tooltip content={t('in-analyze:traceDetail.components.callDetails.showStackTrace')}>
            <SvgIcon
              className={locals.expandIcon}
              type={isExpanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
              aria-label={t('in-analyze:traceDetail.components.callDetails.expandButtonForContent')}
              tabIndex={0}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </Tooltip>
        </div>
      </div>
      {isExpanded && (
        <Fragment>
          {logData && logData.parameters && (
            <div className={locals.stackTraceWrapper}>
              <div className={locals.stackTraceWrapperHeader}>
                {t('in-analyze:traceDetail.components.callDetails.logParameters')}
              </div>
              <div className={locals.logParameters}>{logData.parameters}</div>
            </div>
          )}

          {log.stackTrace.length > 0 && (
            <div className={locals.stackTraceWrapper}>
              <div className={locals.stackTraceWrapperHeader}>
                {t('in-analyze:traceDetail.components.callDetails.logStackTrace')}
              </div>
              <StackTraceBehavior stackTrace={log.stackTrace} relation={call.destination} noPadding />
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
});
