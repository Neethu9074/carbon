/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';
import React from 'react';

import getWebsiteBackendTraces from 'in-websites/subscriptions/getWebsiteBackendTraces';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import { navigateToBackendTraceFromPageLoad } from 'in-websites/tracker';
import { latencyFixed, number } from 'in-services/formatters/number';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { Di } from 'in-new-components/HorizontalDescriptionList';
import Tooltip from 'in-components/Tooltip';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

export default connect(({ beacon }) => ({
  traceSummaries:
    beacon.backendTraceId &&
    getWebsiteBackendTraces({
      correlationId: beacon.backendTraceId
    })
      .filter(r => r.data != null)
      .map(r => r.data)
      .flatMap(traces =>
        combineLatest(
          traces.map(trace =>
            getTraceSummary({ id: trace.traceId })
              .filter(r => r.data != null)
              .map(r => r.data)
          )
        )
      )
}))(BackendDi);

function BackendDi({ traceSummaries }) {
  if (traceSummaries == null || traceSummaries.length === 0) {
    return null;
  }

  return (
    <Di title={t('in-websites:analyze.analyzeView.pageLoadView.backendDiTitleBackend')}>
      {traceSummaries.map((summary, i) => (
        <Tooltip
          key={i}
          content={t('in-websites:analyze.analyzeView.pageLoadView.backendDiOpenBackendTrace')}
          align="topMiddle"
        >
          <div>
            <Link href$={getLinkToTraceDetail(summary.id)} onClick={() => navigateToBackendTraceFromPageLoad()}>
              {t('in-websites:analyze.analyzeView.pageLoadView.backendDiLinkLabel', {
                duration: latencyFixed.compact(summary.duration),
                callCount: t('in-websites:analyze.analyzeView.pageLoadView.backendDiSummaryCallCount', {
                  count: summary.callCount,
                  callCount: number.compact(summary.callCount)
                }),
                errorCount: t('in-websites:analyze.analyzeView.pageLoadView.backendDiSummaryTotalErrorCount', {
                  count: summary.totalErrorCount,
                  totalErrorCount: number.compact(summary.totalErrorCount)
                })
              })}
            </Link>
          </div>
        </Tooltip>
      ))}
    </Di>
  );
}
