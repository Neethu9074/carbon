import { just } from 'reactive-observables';
import React, { Fragment } from 'react';
import theme from 'in-themes';

import WebsiteDashboardsMarkerLanes from 'in-websites/WebsiteDashboard/components/WebsiteDashboardsMarkerLanes';
import { isScriptError, learnMoreLabel, learnMoreHref, explanation } from 'in-websites/definitions/scriptError';
import { getLinkToWebsite, errorsTabFullyQualified, getLinkToAnalyze } from 'in-websites/navigation/paths';
import WebsiteMetricsKpiCard from 'in-websites/WebsiteDashboard/components/WebsiteMetricsKpiCard';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import DefaultLoadingDashboard from 'in-new-components/Loading/DefaultLoadingDashboard';
import BrowserTopList from 'in-websites/WebsiteDashboard/tabs/Errors/BrowserTopList';
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Errors/PagesTopList';
import StackTrace from 'in-websites/WebsiteDashboard/tabs/Errors/StackTrace';
import OsTopList from 'in-websites/WebsiteDashboard/tabs/Errors/OsTopList';
import { affectedUsers, affectedUsersChart } from 'in-websites/formatters';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import getWebsiteError from 'in-websites/subscriptions/getWebsiteError';
import { isNotBlank, removeBlankLines } from 'in-services/util/string';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import LearnMoreCard from 'in-new-components/Card/LearnMoreCard';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-websites/metrics';
import { Row, Col } from 'in-new-components/layout/Grid';
import { number } from 'in-services/formatters/number';
import BackButton from 'in-new-components/BackButton';
import Button from 'in-new-components/Button';
import Footer from 'in-new-components/Footer';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import Code from 'in-components/Code';

import locals from './Error.mless';

export default connectTo(({ location, timeConfig, websiteId }) => {
  const observables = {};

  const errorId = getMatrixParameter(location, '/details', 'errorId');
  observables.errorId = just(errorId);
  if (errorId) {
    observables.result = getWebsiteError({
      timeConfig,
      errorId,
      websiteId
    });
  }
  return observables;
})(ErrorTab);

function ErrorTab({ errorId, result, websiteId, websiteLabel, pageId, tagFilters, timeConfig }) {
  if (!errorId) {
    return <RedirectWithHash to={errorsTabFullyQualified} />;
  }

  const tagFiltersWithErrorId = tagFilters.slice();
  tagFiltersWithErrorId.push({ name: 'beacon.error.id', stringValue: errorId, operator: 'EQUALS' });

  const MarkerLanes = WebsiteDashboardsMarkerLanes({ websiteId, pageId });

  let content;
  if (result.progress.loading) {
    content = <DefaultLoadingDashboard />;
  } else if (result.errors && result.errors.length > 0) {
    content = <ErroneousResultPresenter errors={result.errors} />;
  } else {
    const granularity = getChartGranularity(timeConfig);
    const viewInAnalytics = {
      websiteLabel,
      group: {
        groupbyTag: 'beacon.location.path'
      }
    };

    content = (
      <Fragment>
        <Row>
          <Col lg={3}>
            <WebsiteMetricsKpiCard
              title="Occurrences"
              formatter={number.compact}
              metricsConfig={{
                tagFilters: tagFiltersWithErrorId,
                timeConfig,
                metrics: {
                  errors: {
                    metric: 'errors',
                    aggregation: 'SUM'
                  }
                }
              }}
              iconAction={{
                text: 'View in Analyze',
                kind: 'subtle',
                icon: 'lib_analyze',
                href$: getLinkToAnalyze({
                  beaconType: 'error',
                  tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
                    websiteLabel,
                    tagFilters: tagFiltersWithErrorId
                  }),
                  group: {
                    groupbyTag: 'beacon.location.path'
                  },
                  showGraph: true
                })
              }}
            />
          </Col>
          <Col lg={3}>
            <WebsiteMetricsKpiCard
              title="Affected Users"
              formatter={affectedUsers.compact}
              metricsConfig={{
                tagFilters: tagFiltersWithErrorId,
                timeConfig,
                metrics: {
                  uniqueUsersOrSessions: {
                    metric: 'uniqueUsersOrSessions',
                    aggregation: 'DISTINCT_COUNT'
                  }
                }
              }}
              iconAction={{
                text: 'View in Analyze',
                kind: 'subtle',
                icon: 'lib_analyze',
                href$: getLinkToAnalyze({
                  beaconType: 'error',
                  tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
                    websiteLabel,
                    tagFilters: tagFiltersWithErrorId
                  }),
                  group: {
                    groupbyTag: 'beacon.location.path'
                  },
                  showGraph: true,
                  metrics: [
                    {
                      metric: 'uniqueUsersOrSessions',
                      aggregation: 'DISTINCT_COUNT'
                    }
                  ],
                  focusedMetric: 'uniqueUsersOrSessions',
                  focusedMetricAggregation: 'DISTINCT_COUNT'
                })
              }}
            />
          </Col>
        </Row>

        {!isScriptError(result.data.message) && (
          <Fragment>
            <Row>
              <Col lg={12}>
                <Card title="Details">
                  <Dl>
                    <Di title="Type">{result.data.type}</Di>
                    <Di title="Message">{result.data.message}</Di>
                  </Dl>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <StackTrace
                  websiteId={websiteId}
                  stackTrace={result.data.stackTrace}
                  parsedStackTrace={result.data.parsedStackTrace}
                  stackTraceParsingStatus={result.data.stackTraceParsingStatus}
                  buttonSize="normal"
                >
                  {({ actions, content }) => (
                    <Card title="Stack Trace" header={<div className={locals.stackTraceActions}>{actions}</div>}>
                      {content}
                    </Card>
                  )}
                </StackTrace>
              </Col>
            </Row>
          </Fragment>
        )}

        {isScriptError(result.data.message) && (
          <Row>
            <Col lg={12}>
              <LearnMoreCard
                title="Script Error"
                explanation={explanation}
                learnMoreHref={learnMoreHref}
                learnMoreLabel={learnMoreLabel}
              />
            </Col>
          </Row>
        )}

        {isNotBlank(result.data.componentStack) && (
          <Row>
            <Col lg={12}>
              <Card title="Component Stack">
                <Code showLineNumbers={false} code={removeBlankLines(result.data.componentStack)} lang="plain" />
              </Card>
            </Col>
          </Row>
        )}

        <Row>
          <Col lg={4}>
            <WebsiteChartWrapper
              cardTitle="Page Views"
              timeConfig={timeConfig}
              renderLegend={false}
              viewInAnalytics={viewInAnalytics}
              y1={{
                renderer: Renderer.stackedBar,
                formatter: number.forcedCompact,
                labels: ['Page Loads', 'Page Transitions'],
                metricIds: ['pageLoads', 'pageTransitions']
              }}
              metricsConfiguration={{
                timeConfig,
                tagFilters,
                metrics: {
                  pageLoads: {
                    metric: 'pageLoads',
                    granularity,
                    aggregation: 'SUM',
                    omitMetricInAnalytics: true,
                    beaconType: 'pageLoad'
                  },
                  pageTransitions: {
                    metric: 'pageTransitions',
                    granularity,
                    aggregation: 'SUM'
                  }
                }
              }}
              renderPostChartContent={MarkerLanes}
            />
          </Col>
          <Col lg={4}>
            <WebsiteChartWrapper
              cardTitle="Occurrences"
              timeConfig={timeConfig}
              renderLegend={false}
              viewInAnalytics={viewInAnalytics}
              y1={{
                renderer: Renderer.bar,
                formatter: number.forcedCompact,
                labels: ['Occurrences'],
                metricIds: ['errors'],
                colors: [theme.lib.colors.failure]
              }}
              metricsConfiguration={{
                timeConfig,
                tagFilters: tagFiltersWithErrorId,
                metrics: {
                  errors: {
                    metric: 'errors',
                    granularity,
                    aggregation: 'SUM',
                    omitMetricInAnalytics: true,
                    beaconType: 'error'
                  }
                }
              }}
              renderPostChartContent={MarkerLanes}
            />
          </Col>
          <Col lg={4}>
            <WebsiteChartWrapper
              cardTitle="Affected Users"
              timeConfig={timeConfig}
              renderLegend={false}
              viewInAnalytics={viewInAnalytics}
              y1={{
                renderer: Renderer.bar,
                formatter: affectedUsersChart,
                labels: ['Affected Users'],
                metricIds: ['uniqueUsersOrSessions']
              }}
              metricsConfiguration={{
                timeConfig,
                tagFilters: tagFiltersWithErrorId,
                metrics: {
                  uniqueUsersOrSessions: {
                    metric: 'uniqueUsersOrSessions',
                    granularity,
                    aggregation: 'DISTINCT_COUNT',
                    beaconType: 'error'
                  }
                }
              }}
              renderPostChartContent={MarkerLanes}
            />
          </Col>
        </Row>

        <Row>
          {pageId == null && (
            <Col lg={4}>
              <PagesTopList
                websiteId={websiteId}
                websiteLabel={websiteLabel}
                tagFilters={tagFiltersWithErrorId}
                timeConfig={timeConfig}
              />
            </Col>
          )}
          <Col lg={pageId == null ? 4 : 6}>
            <BrowserTopList
              websiteId={websiteId}
              websiteLabel={websiteLabel}
              tagFilters={tagFiltersWithErrorId}
              timeConfig={timeConfig}
              pageId={pageId}
            />
          </Col>
          <Col lg={pageId == null ? 4 : 6}>
            <OsTopList
              websiteId={websiteId}
              websiteLabel={websiteLabel}
              tagFilters={tagFiltersWithErrorId}
              timeConfig={timeConfig}
              pageId={pageId}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Title title="Website JS Error Details" dynamic={result && result.data && result.data.message} />

      <div className={locals.actions}>
        <BackButton
          label="Back to list of JS errors"
          href$={getLinkToWebsite(websiteId, { tabPath: '/errors', pageId })}
          withoutMargin
        />

        <Button
          kind="secondary"
          href$={getLinkToAnalyze({
            beaconType: 'error',
            tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
              websiteLabel,
              tagFilters: tagFilters.concat([{ name: 'beacon.error.id', stringValue: errorId, operator: 'EQUALS' }])
            }),
            group: {
              groupbyTag: 'beacon.location.path'
            }
          })}
        >
          Analyze JS Error
        </Button>
      </div>

      {content}
      <Footer />
    </Fragment>
  );
}
