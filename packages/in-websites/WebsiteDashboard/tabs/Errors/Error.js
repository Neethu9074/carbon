import { just } from 'reactive-observables';
import React, { Fragment } from 'react';

import { isScriptError, learnMoreLabel, learnMoreHref, explanation } from 'in-websites/definitions/scriptError';
import { getLinkToWebsite, errorsTabFullyQualified, getLinkToAnalyze } from 'in-websites/navigation/paths';
import LimitedCapabilitiesCard from 'in-websites/WebsiteDashboard/components/LimitedCapabilitiesCard';
import WebsiteMetricsKpiCard from 'in-websites/WebsiteDashboard/components/WebsiteMetricsKpiCard';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import DefaultLoadingDashboard from 'in-applications/Dashboards/DefaultLoadingDashboard';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import BrowserTopList from 'in-websites/WebsiteDashboard/tabs/Errors/BrowserTopList';
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Errors/PagesTopList';
import getWebsiteError from 'in-websites/subscriptions/getWebsiteError';
import { shorten, isNotBlank, removeBlankLines } from 'in-services/util/string';
import OsTopList from 'in-websites/WebsiteDashboard/tabs/Errors/OsTopList';
import { affectedUsers, affectedUsersChart } from 'in-websites/formatters';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import ErrorBreadcrumb from 'in-websites/breadcrumbs/ErrorBreadcrumb';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-websites/metrics';
import { Row, Col } from 'in-new-components/layout/Grid';
import { number } from 'in-services/formatters/number';
import BackButton from 'in-new-components/BackButton';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import Code from 'in-components/Code';
import theme from 'in-themes';

import locals from './Error.mless';

export default connectTo(({ location, timeConfig }) => {
  const observables = {};

  const errorId = getMatrixParameter(location, '/details', 'errorId');
  observables.errorId = just(errorId);
  if (errorId) {
    observables.result = getWebsiteError({
      timeConfig,
      errorId
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

  let content;
  if (result.progress.loading) {
    content = <DefaultLoadingDashboard />;
  } else if (result.errors && result.errors.length > 0) {
    content = <ErroneousResultPresenter errors={result.errors} />;
  } else {
    const granularity = getChartGranularity(timeConfig);

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
                  uniqueUsers: {
                    metric: 'uniqueUsers',
                    aggregation: 'DISTINCT_COUNT'
                  }
                }
              }}
            />
          </Col>
        </Row>

        {!isScriptError(result.data.message) && (
          <Row>
            <Col lg={6}>
              <Card title="Details">
                <Dl>
                  <Di title="Type">{result.data.type}</Di>
                  <Di title="Message">{result.data.message}</Di>
                </Dl>
              </Card>
            </Col>
            <Col lg={6}>
              <Card title="Stack Trace" withoutPadding>
                <Code
                  code={result.data.stackTrace}
                  showLineNumbers={false}
                  wrapperClassName={locals.code}
                  lang="plain"
                />
              </Card>
            </Col>
          </Row>
        )}

        {isScriptError(result.data.message) && (
          <Row>
            <Col lg={12}>
              <LimitedCapabilitiesCard
                cardTitle="Script Error"
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
              <Card title="Component Stack" withoutPadding>
                <Code code={removeBlankLines(result.data.componentStack)} lang="plain" />
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
              y1={{
                renderer: Renderer.bar,
                formatter: number.forcedCompact,
                labels: ['Page Views'],
                metricIds: ['pageViews']
              }}
              metricsConfiguration={{
                timeConfig,
                tagFilters,
                metrics: {
                  pageViews: {
                    metric: 'pageViews',
                    granularity,
                    aggregation: 'SUM'
                  }
                }
              }}
            />
          </Col>
          <Col lg={4}>
            <WebsiteChartWrapper
              cardTitle="Occurrences"
              timeConfig={timeConfig}
              renderLegend={false}
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
                    aggregation: 'SUM'
                  }
                }
              }}
            />
          </Col>
          <Col lg={4}>
            <WebsiteChartWrapper
              cardTitle="Affected Users"
              timeConfig={timeConfig}
              renderLegend={false}
              y1={{
                renderer: Renderer.bar,
                formatter: affectedUsersChart,
                labels: ['Affected Users'],
                metricIds: ['uniqueUsers']
              }}
              metricsConfiguration={{
                timeConfig,
                tagFilters: tagFiltersWithErrorId,
                metrics: {
                  uniqueUsers: {
                    metric: 'uniqueUsers',
                    granularity,
                    aggregation: 'DISTINCT_COUNT'
                  }
                }
              }}
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
      <Breadcrumbs items={[<ErrorBreadcrumb message={result && result.data && shorten(result.data.message, 32)} />]} />
      <Title title="Error Details" dynamic={result && result.data && result.data.message} />

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
    </Fragment>
  );
}
