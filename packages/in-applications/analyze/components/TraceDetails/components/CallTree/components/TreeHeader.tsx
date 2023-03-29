/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';

import { TraceActivityTreeNode, TraceSummary } from '@instana/types';
import { SvgIcon } from '@instana/components';

import { LazyCallTree } from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';
import CallTimeAxis from 'in-applications/analyze/components/TraceDetails/components/CallTimeAxis';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { latencyDetailed } from 'in-stores/metric/formatters';
import { t } from 'in-i18n';

import locals from './TreeHeader.mless';

interface TreeHeaderProps {
  rootCall: LazyCallTree | TraceActivityTreeNode;
  traceSummary: TraceSummary;
  isLazyOrHiddenParent?: boolean;
}

export default function TreeHeader({ rootCall, traceSummary, isLazyOrHiddenParent = false }: TreeHeaderProps) {
  return (
    <Fragment>
      {traceSummary && (
      <div
        className={classNames({
          [locals.treeHeader2]: true,
          [locals.extraMargin]: isLazyOrHiddenParent
        })}
      >
        <div className={locals.started}>
          <SvgIcon size="s" type="lib_datetime_time" />
          <p>Started: {formatDateWithActiveLanguage(traceSummary.startTime, 'yyyy-MM-dd, HH:mm:ss')}</p>
        </div>
        <p className={locals.latency}>
          {t('in-applications:traceDetail.components.treeHeaderLatency')}{' '}
          {latencyDetailed.formatter(traceSummary.latency)}
        </p>
      </div>
      )}
      {!isLazyOrHiddenParent && (
        <div className={locals.axisWrapper}>
          <div className={locals.axis2}>{rootCall && <CallTimeAxis call={rootCall} />}</div>
        </div>
      )}
    </Fragment>
  );
}
