/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import useLogInformation from 'in-applications/analyze/AnalyzeView2_0/components_alt/CallTree/hooks/useLogInformation';
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import ContentWrapper from 'in-components/LocationAwareTabView/components/ContentWrapper';
import getTraceActivityTree from 'in-subscription/application/getTraceActivityTree';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import Logs from 'in-applications/analyze/AnalyzeView2_0/components_alt/Logs';
import { refreshWindowSizeDependingState } from 'in-services/browser';
import { jumpToLogs } from 'in-logging/analyze/AnalyzeView/tracker';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import { getTraceIdTagFilter } from 'in-logging/queryBuilder';
import { pendingResult } from 'in-services/fixedObjects';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

import locals from './Logs.mless';

export default function LogsView({ data: trace, callId, traceId }) {
  const callTreeResult = useObservable(() => getTraceActivityTree({ id: traceId }), [traceId]) ?? pendingResult;
  const effectiveCallId = callId === 'ROOT' && callTreeResult.data ? callTreeResult.data.id : callId;
  const { totalNumberOfLogs, timeConfigForLogs } = useLogInformation(trace, callTreeResult);

  const traceDetails = (
    <ContentWrapper>
      <SideEffectOnPropertyChange callId={!effectiveCallId} sideEffect={refreshWindowSizeDependingState} />

      {totalNumberOfLogs > 0 ? (
        <>
          <Row withoutSideMargin>
            <Col lg={12}>
              <Button
                className={locals.button}
                kind="secondary"
                icon="lib_analyze"
                href$={getLinkToAnalyze({
                  tagFilterExpression: [getTraceIdTagFilter(traceId)],
                  timeConfig: timeConfigForLogs
                })}
                onClick={() => jumpToLogs({ source: 'analyze logs' })}
              >
                {t('in-analyze:traceDetail.tabs.summary.analyzeLogs')}
              </Button>

              <Logs traceId={traceId} timeConfigForLogs={timeConfigForLogs} totalNumberOfLogs={totalNumberOfLogs} />
            </Col>
          </Row>
        </>
      ) : (
        <NoDataAvailable
          height={230}
          text={t('in-analyze:traceDetail.tabs.logs.noDataMessage')}
          type="lib_application_logging"
        />
      )}
    </ContentWrapper>
  );

  return <HeightRestrictedView render={() => traceDetails} />;
}
