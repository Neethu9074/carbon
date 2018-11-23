import { just } from 'reactive-observables';
import React, { Fragment } from 'react';

import WebsiteMetricsKpiCard from 'in-websites/WebsiteDashboard/components/WebsiteMetricsKpiCard';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import DefaultLoadingDashboard from 'in-applications/Dashboards/DefaultLoadingDashboard';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { getLinkToWebsite, errorsTabFullyQualified } from 'in-websites/navigation/paths';
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Errors/PagesTopList';
import getWebsiteError from 'in-subscription/websiteMonitoring/getWebsiteError';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { shorten, isNotBlank } from 'in-services/util/string';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getChartGranularity } from 'in-websites/metrics';
import { Row, Col } from 'in-new-components/layout/Grid';
import { number } from 'in-services/formatters/number';
import BackButton from 'in-new-components/BackButton';
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

function ErrorTab({ errorId, result, websiteId, pageId, tagFilters, timeConfig }) {
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
              formatter={number.compact}
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
              <Code code={result.data.stackTrace} showLineNumbers={false} wrapperClassName={locals.code} lang="plain" />
            </Card>
          </Col>
        </Row>

        {isNotBlank(result.data.componentStack) && (
          <Row>
            <Col lg={12}>
              <Card title="Component Stack" withoutPadding>
                <Code code={result.data.componentStack} lang="plain" />
              </Card>
            </Col>
          </Row>
        )}

        <Row>
          <Col lg={4}>
            <WebsiteChartWrapper
              cardTitle="Page Loads"
              timeConfig={timeConfig}
              y1={{
                renderer: Renderer.bar,
                formatter: number.forcedCompact,
                labels: ['Page Loads'],
                metricIds: ['pageLoads']
              }}
              metricsConfiguration={{
                timeConfig,
                tagFilters,
                metrics: {
                  pageLoads: {
                    metric: 'pageLoads',
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
              y1={{
                renderer: Renderer.bar,
                formatter: number.forcedCompact,
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
              <PagesTopList websiteId={websiteId} tagFilters={tagFiltersWithErrorId} timeConfig={timeConfig} />
            </Col>
          )}
          <Col lg={pageId == null ? 4 : 6}>TODO browsers</Col>
          <Col lg={pageId == null ? 4 : 6}>TODO os</Col>
        </Row>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Breadcrumbs
        items={[
          <Breadcrumb label="Error Details">{result && result.data && shorten(result.data.message, 32)}</Breadcrumb>
        ]}
      />
      <Title title="Error Details" dynamic={result && result.data && result.data.message} />
      <BackButton label="Back to list of errors" href$={getLinkToWebsite(websiteId, { tabPath: '/errors', pageId })} />
      {content}
    </Fragment>
  );
}
