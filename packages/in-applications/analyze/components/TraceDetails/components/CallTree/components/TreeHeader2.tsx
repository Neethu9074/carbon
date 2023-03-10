/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, {Fragment} from 'react';

import {TraceActivityTreeNode, TraceSummary} from '@instana/types';
import { SvgIcon } from '@instana/components';

import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { latencyDetailed } from 'in-stores/metric/formatters';
import { t } from 'in-i18n';

import locals from './TreeHeader.mless';
import CallTimeAxis from "in-applications/analyze/components/TraceDetails/components/CallTimeAxis";
import {LazyCallTree} from "in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree";

interface TreeHeaderProps {
  rootCall:  LazyCallTree | TraceActivityTreeNode;
  traceSummary: TraceSummary;
}

export default function TreeHeader2({ rootCall, traceSummary }: TreeHeaderProps) {
  return (
    <Fragment>
      <div className={locals.treeHeader2}>
        <div className={locals.started}>
          <SvgIcon size="s" type="lib_datetime_time" />
          <p>Started: {formatDateWithActiveLanguage(traceSummary.startTime, 'yyyy-MM-dd, HH:mm:ss')}</p>
        </div>
        <p className={locals.latency}>
          {t('in-applications:traceDetail.components.treeHeaderLatency')}{' '}
          {latencyDetailed.formatter(traceSummary.latency)}
        </p>
      </div>
      <div className={locals.axisWrapper}>
        <div className={locals.axis2}>{rootCall && <CallTimeAxis call={rootCall} />}</div>
      </div>
    </Fragment>
  );
}
