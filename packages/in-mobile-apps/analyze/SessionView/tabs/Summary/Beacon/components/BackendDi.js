/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';
import React from 'react';

import getMobileAppBackendTraces from 'in-mobile-apps/subscriptions/getMobileAppBackendTraces';
import { navigateToBackendTraceFromSession } from 'in-mobile-apps/tracker';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
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
    getMobileAppBackendTraces({
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
    <Di title={t('in-mobile-apps:sessionView.tabsSumBackendDi.backendTitle')}>
      {traceSummaries.map((summary, i) => (
        <Tooltip
          key={i}
          content={t('in-mobile-apps:sessionView.tabsSumBackendDi.backendTooltipContent')}
          align="topMiddle"
        >
          <div>
            <Link href$={getLinkToTraceDetail(summary.id)} onClick={() => navigateToBackendTraceFromSession()}>
              {t('in-mobile-apps:sessionView.tabsSumBackendDi.backendTooltipLink', {
                duration: latencyFixed.compact(summary.duration),
                callCount: number.compact(summary.callCount),
                call: t('in-mobile-apps:sessionView.tabsSumBackendDi.backendTooltipCall', { count: summary.callCount }),
                totalErrorCount: number.compact(summary.totalErrorCount),
                error: t('in-mobile-apps:sessionView.tabsSumBackendDi.backendTooltipError', {
                  count: summary.totalErrorCount
                })
              })}
            </Link>
          </div>
        </Tooltip>
      ))}
    </Di>
  );
}
