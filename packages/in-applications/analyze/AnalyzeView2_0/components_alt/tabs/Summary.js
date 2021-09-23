/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';
import { SvgIcon } from '@instana/components';
import { create } from '@instana/observables';
import { Button } from '@instana/components';
import { Card } from '@instana/components';
import { Link } from '@instana/components';

import MobileAppMonitoringData from 'in-applications/analyze/components/TraceDetails/tabs/Summary/MobileAppMonitoringData';
import useLogInformation from 'in-applications/analyze/AnalyzeView2_0/components_alt/CallTree/hooks/useLogInformation';
import WebsiteMonitoringData from 'in-applications/analyze/components/TraceDetails/tabs/Summary/WebsiteMonitoringData';
import TraceValidationResult from 'in-applications/analyze/components/TraceDetails/tabs/Summary/TraceValidationResult';
import ServerIcicleChart from 'in-applications/analyze/AnalyzeView2_0/components_alt/IcicleChart/ServerIcicleChart';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import CallDetails from 'in-applications/analyze/components/TraceDetails/components/CallDetails/CallDetails';
import LogDetails from 'in-applications/analyze/components/TraceDetails/components/LogDetails/LogDetails';
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import SettingsButton from 'in-applications/analyze/AnalyzeView2_0/components_alt/SettingsButton';
import ContentWrapper from 'in-components/LocationAwareTabView/components/ContentWrapper';
import CallTree from 'in-applications/analyze/AnalyzeView2_0/components_alt/CallTree';
import getTraceActivityTree from 'in-applications/subscriptions/getTraceActivityTree';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { refreshWindowSizeDependingState } from 'in-services/browser';
import { number, latency } from 'in-services/formatters/number';
import { callDetailClickedTracker } from 'in-analyze/tracker';
import { pendingResult } from 'in-services/fixedObjects';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import ButtonGroup from 'in-components/ButtonGroup';
import Tooltip from 'in-components/Tooltip';
import { Trans, t } from 'in-i18n';
import theme from 'in-themes';

import locals from './Summary.mless';

const maximumNumberOfCallsForLargeTraceConsideration = 1000;

export default function Summary({
  data: trace,
  callId,
  traceId,
  setLogId,
  getColor,
  setCallId,
  colorCodeType,
  logId: logIdPair,
  setColorCodeMechanism,
  activeView,
  setActiveView,
  showServiceInformation,
  setShowServiceInformation,
  showSubCallBars,
  setShowSubCallBars
}) {
  // backward compatibility for old links.
  // TODO: Remove after once released
  if (typeof logIdPair === 'string') {
    logIdPair = { logId: logIdPair, spanId: undefined };
  }

  const hasWebsiteCorrelationId = trace.eumCorrelationId != null && trace.eumCorrelationType === 'web';
  const hasMobileCorrelationId = trace.eumCorrelationId != null && trace.eumCorrelationType === 'mobile';
  const missingEumCorrelation = !hasWebsiteCorrelationId && !hasMobileCorrelationId;

  const isInternalVisible = useObservable(isInternalVisible$, []) ?? false;
  const callTreeResult = useObservable(() => getTraceActivityTree({ id: traceId }), [traceId]) ?? pendingResult;

  const effectiveCallId = callId === 'ROOT' && callTreeResult.data ? callTreeResult.data.id : callId;
  const rootCall = callTreeResult.data;

  // The number of visual items we would have to render dictates whether a trace is large or not.
  // The callCount itself is misleading, because a call can be batched. So a single visual item
  // would represent 500 calls. This is why we are preferrring callCountIgnoringBatchSize over callCount.
  const isLargeTrace =
    trace != null &&
    (trace.callCountIgnoringBatchSize || trace.callCount) > maximumNumberOfCallsForLargeTraceConsideration;

  const [showLargeTrace, setShowLargeTrace] = useState(false);

  const [expandCollapseSignal$] = useState(create({ emitLatestOnSubscribe: false }));

  const onCallClicked = call => {
    if (call) {
      setCallId(call.id);
      callDetailClickedTracker();
    } else {
      setCallId(null);
    }
  };

  const clearSelectedLogId = () => {
    setLogId(null);
  };

  const { totalNumberOfLogs, timeConfigForLogs } = useLogInformation(trace, callTreeResult);

  const traceDetails = (
    <ContentWrapper>
      <SideEffectOnPropertyChange callId={!effectiveCallId} sideEffect={refreshWindowSizeDependingState} />

      {hasWebsiteCorrelationId && (
        <WebsiteMonitoringData traceId={traceId} correlationId={trace.eumCorrelationId} startTime={trace.startTime} />
      )}
      {hasMobileCorrelationId && <MobileAppMonitoringData traceId={traceId} startTime={trace.startTime} />}
      {missingEumCorrelation && (
        <div>
          <WebsiteMonitoringData traceId={traceId} correlationId={traceId} startTime={trace.startTime} />
          <MobileAppMonitoringData traceId={traceId} startTime={trace.startTime} />
        </div>
      )}

      <Row withoutSideMargin>
        <Col lg={12}>
          <Message
            // Dear i18n team Please DO NOT translate this. It's only there for a few weeks and not visible to any customer. thx!
            title="Experimental view"
            description="This view is experimental and exclusively shown on test. We want to gather feedback so please send all of it (praise or not)."
          />
        </Col>
      </Row>

      {trace.issues && trace.issues.length > 0 && (
        <Row withoutSideMargin>
          <Col lg={12}>
            <TraceValidationResult issues={trace.issues} />
          </Col>
        </Row>
      )}

      {isInternalVisible &&
      trace.callRecordCount &&
      trace.callCountIgnoringBatchSize &&
      trace.callRecordCount !== trace.callCountIgnoringBatchSize ? (
        <Row withoutSideMargin>
          <Col lg={12}>
            <Message
              type="warning"
              title={t('in-applications:traceDetail.tabs.summary.duplicateCalls')}
              description={t('in-applications:traceDetail.tabs.summary.duplicateCallsDesc', {
                traceCallCountIgnoringBatchSize: trace.callCountIgnoringBatchSize,
                traceCallRecordCount: trace.callRecordCount
              })}
            />
          </Col>
        </Row>
      ) : null}

      {isInternalVisible && trace.ingestionBatchesCount && trace.ingestionBatchesCount > 1 ? (
        <Row withoutSideMargin>
          <Col lg={12}>
            <Message
              type="warning"
              title={t('in-applications:traceDetail.tabs.summary.batchedIngestion')}
              description={t('in-applications:traceDetail.tabs.summary.traceIngestionBatchCount', {
                traceIngestionBatchesCount: trace.ingestionBatchesCount
              })}
            />
          </Col>
        </Row>
      ) : null}

      {rootCall && rootCall.errorCount ? (
        <Row withoutSideMargin>
          <Col lg={12}>
            <Message type="warning" title={t('in-applications:traceDetail.tabs.summary.erroneousTrace')} />
          </Col>
        </Row>
      ) : null}

      <Row withoutSideMargin withoutTopMargin>
        <Col xs preserveVerticalGutter>
          <KpiCard
            title={t('in-applications:traceDetail.tabs.summary.subCalls')}
            value={number.compact(trace.callCount)}
          />
        </Col>
        <Col xs preserveVerticalGutter>
          <KpiCard
            title={t('in-applications:traceDetail.tabs.summary.erroneousCalls')}
            color={trace.totalErrorCount > 0 ? theme.lib.colors.failure : theme.lib.colors.N900Primary}
            value={number.compact(trace.totalErrorCount)}
          />
        </Col>
        <Col xs preserveVerticalGutter>
          <KpiCard
            title={t('in-applications:traceDetail.tabs.summary.errorLogs')}
            color={trace.totalErrorLogCount > 0 ? theme.lib.colors.failure : theme.lib.colors.N900Primary}
            value={number.compact(trace.totalErrorLogCount)}
          />
        </Col>
        <Col xs preserveVerticalGutter>
          <KpiCard
            title={t('in-applications:traceDetail.tabs.summary.warnLogs')}
            color={trace.totalWarnLogCount > 0 ? theme.lib.colors.warning : theme.lib.colors.N900Primary}
            value={number.compact(trace.totalWarnLogCount)}
          />
        </Col>
        <Col xs preserveVerticalGutter>
          <KpiCard
            title={t('in-applications:traceDetail.tabs.summary.latency')}
            value={
              trace.issues && trace.issues.includes('missing_root_span') ? 'N/A' : latency.detailed(trace.duration)
            }
          />
        </Col>
      </Row>

      {isLargeTrace && !showLargeTrace && (
        <Row withoutSideMargin>
          <Col xs>
            <Card title={t('in-applications:traceDetail.tabs.summary.largeTrace')}>
              <Trans
                i18nKey="in-applications:traceDetail.tabs.summary.largeTraceLink"
                components={{
                  linkToDocs: (
                    <Link
                      target="_blank"
                      external
                      href={`/api/application-monitoring/analyze/traces;id=${encodeURIComponent(traceId)}?pretty`}
                    />
                  )
                }}
              />
              <Button onClick={() => setShowLargeTrace(true)} className={locals.attemptRendering}>
                {t('in-applications:traceDetail.tabs.summary.attemptToRenderTrace')}
              </Button>
            </Card>
          </Col>
        </Row>
      )}

      {(!isLargeTrace || showLargeTrace) && (
        <>
          <Row withoutSideMargin>
            <Col xs>
              <Card
                title={t('in-analyze:traceDetail.components.callTree.cardTitle')}
                leftHeaderContent={
                  activeView === 'tree' && (
                    <>
                      <Tooltip
                        themeStyle="light"
                        content={t('in-analyze:traceDetail.components.callTree.collapseButtonForRow')}
                      >
                        <SvgIcon
                          className={locals.expandCollapseIcon}
                          type={'lib_openclose_remove_box'}
                          aria-label={t('in-analyze:traceDetail.components.callTree.collapseButtonForRow')}
                          onClick={() => expandCollapseSignal$.emit('collapse')}
                        />
                      </Tooltip>
                      <Tooltip
                        themeStyle="light"
                        content={t('in-analyze:traceDetail.components.callTree.expandButtonForRow')}
                      >
                        <SvgIcon
                          className={locals.expandCollapseIcon}
                          type={'lib_openclose_add_box'}
                          aria-label={t('in-analyze:traceDetail.components.callTree.expandButtonForRow')}
                          onClick={() => expandCollapseSignal$.emit('expand')}
                        />
                      </Tooltip>
                    </>
                  )
                }
                rightHeaderContent={
                  <>
                    <HorizontalFlexWrapper className={locals.chartToggleWrapper}>
                      <span className={locals.chartToggleLabel}>
                        {t('in-analyze:traceDetail.components.viewToggleButtons.expl')}
                      </span>
                      <ButtonGroup
                        buttonPropsList={[
                          {
                            text: t('in-analyze:traceDetail.components.viewToggleButtons.chart'),
                            key: 'chart',
                            onClick: () => setActiveView('chart')
                          },
                          {
                            text: t('in-analyze:traceDetail.components.viewToggleButtons.tree'),
                            key: 'tree',
                            onClick: () => setActiveView('tree')
                          }
                        ]}
                        activeKey={activeView}
                      />
                    </HorizontalFlexWrapper>
                    <SettingsButton
                      showServiceInformation={showServiceInformation}
                      setShowServiceInformation={setShowServiceInformation}
                      colorCodeType={colorCodeType}
                      setColorCodeMechanism={setColorCodeMechanism}
                      setShowSubCallBars={setShowSubCallBars}
                      showSubCallBars={showSubCallBars}
                      disableShowServiceInformation={isLargeTrace}
                      activeView={activeView}
                    />
                  </>
                }
              >
                {activeView === 'tree' ? (
                  <CallTree
                    callTreeResult={callTreeResult}
                    traceId={traceId}
                    getColor={getColor}
                    onCallClicked={onCallClicked}
                    openedCallId={effectiveCallId}
                    isLargeTrace={isLargeTrace}
                    timeConfigForLogs={timeConfigForLogs}
                    selectLogId={setLogId}
                    totalNumberOfLogs={totalNumberOfLogs}
                    showServiceInformation={showServiceInformation}
                    showSubCallBars={showSubCallBars}
                    expandCollapseSignal$={expandCollapseSignal$}
                    initialExpandAllCalls={trace.callCount < 15}
                  />
                ) : (
                  <ServerIcicleChart
                    traceId={traceId}
                    getColor={getColor}
                    onCallClicked={onCallClicked}
                    openedCallId={effectiveCallId}
                    timeConfigForLogs={timeConfigForLogs}
                    selectLogId={setLogId}
                    totalNumberOfLogs={totalNumberOfLogs}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </ContentWrapper>
  );

  let detailView = null;
  if (logIdPair) {
    detailView = (
      <LogDetails
        selectedLogIdPair={logIdPair}
        callId={callId}
        onClose={clearSelectedLogId}
        timeConfigForLogs={timeConfigForLogs}
        totalNumberOfLogs={totalNumberOfLogs}
      />
    );
  } else if (effectiveCallId) {
    detailView = (
      <CallDetails
        callId={effectiveCallId}
        traceId={traceId}
        correlationId={trace.eumCorrelationId}
        correlationType={trace.eumCorrelationType}
        getColor={getColor}
        onClose={() => setCallId(null)}
        startTime={trace.startTime}
        rootCall={callTreeResult.data}
      />
    );
  }

  return (
    <div className={locals.twoColumnViewWrapper}>
      <div
        className={classNames({
          [locals.left]: detailView,
          [locals.leftFullWidth]: !detailView
        })}
      >
        <HeightRestrictedView render={() => traceDetails} />
      </div>
      {detailView && (
        <div className={locals.right}>
          <HeightRestrictedView render={() => detailView} scrollResetProps={['callId']} callId={effectiveCallId} />
        </div>
      )}
    </div>
  );
}
