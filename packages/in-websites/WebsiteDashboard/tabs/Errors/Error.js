/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Button } from '@instana/components';
import { just } from '@instana/observables';
import { Card } from '@instana/components';

import { getLinkToWebsite, errorsTabFullyQualified, getLinkToAnalyze, detailsPath } from 'in-websites/navigation/paths';
import WebsiteDashboardsMarkerLanes from 'in-websites/WebsiteDashboard/components/WebsiteDashboardsMarkerLanes';
import { isScriptError, learnMoreLabel, learnMoreHref, explanation } from 'in-websites/definitions/scriptError';
import WebsiteMetricsKpiCard from 'in-websites/WebsiteDashboard/components/WebsiteMetricsKpiCard';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import BrowserTopList from 'in-websites/WebsiteDashboard/tabs/Errors/BrowserTopList';
import DefaultLoadingDashboard from 'in-components/Loading/DefaultLoadingDashboard';
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Errors/PagesTopList';
import { translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import StackTrace from 'in-websites/WebsiteDashboard/tabs/Errors/StackTrace';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import OsTopList from 'in-websites/WebsiteDashboard/tabs/Errors/OsTopList';
import { affectedUsers, affectedUsersChart } from 'in-websites/formatters';
import getWebsiteError from 'in-websites/subscriptions/getWebsiteError';
import { isNotBlank, removeBlankLines } from 'in-services/util/string';
import LearnMoreCard from 'in-websites/LearnMoreCard/LearnMoreCard';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import BackButton from 'in-components/BackButton';
import Footer from 'in-components/Footer';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import Code from 'in-components/Code';
import theme from 'in-themes';
import { t } from 'in-i18n';

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
  const tagCatalogError = useTagCatalog('error');
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
              title={t('in-websites:websiteDashboard.tabs.errors.errorTitleOccurrences')}
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
                text: t('in-websites:websiteDashboard.tabs.errors.errorLabelViewInAnalyze'),
                kind: 'subtle',
                icon: 'lib_analyze',
                href$:
                  tagCatalogError &&
                  getLinkToAnalyze({
                    beaconType: 'error',
                    formModel: translateDemocratisationTagFiltersToFormModel({
                      websiteLabel,
                      tagFilters: tagFiltersWithErrorId,
                      tagCatalog: tagCatalogError
                    }),
                    groupBy: {
                      groupbyTag: 'beacon.location.path'
                    }
                  })
              }}
            />
          </Col>
          <Col lg={3}>
            <WebsiteMetricsKpiCard
              title={t('in-websites:websiteDashboard.tabs.errors.errorTitleAffectedUsers')}
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
                text: t('in-websites:websiteDashboard.tabs.errors.errorLabelViewInAnalyze'),
                kind: 'subtle',
                icon: 'lib_analyze',
                href$:
                  tagCatalogError &&
                  getLinkToAnalyze({
                    beaconType: 'error',
                    formModel: translateDemocratisationTagFiltersToFormModel({
                      websiteLabel,
                      tagFilters: tagFiltersWithErrorId,
                      tagCatalog: tagCatalogError
                    }),
                    groupBy: {
                      groupbyTag: 'beacon.location.path'
                    },
                    fields: [
                      {
                        metricId: 'uniqueUsersOrSessions',
                        aggregationId: 'DISTINCT_COUNT',
                        type: metricType
                      }
                    ],
                    chartedMetrics: [
                      {
                        metricId: 'uniqueUsersOrSessions',
                        aggregationId: 'DISTINCT_COUNT'
                      }
                    ]
                  })
              }}
            />
          </Col>
        </Row>

        {!isScriptError(result.data.message) && (
          <Fragment>
            <Row>
              <Col lg={12}>
                <Card title={t('in-websites:websiteDashboard.tabs.errors.errorTitleOetails')}>
                  <Dl>
                    <Di title={t('in-websites:websiteDashboard.tabs.errors.errorTitleType')}>{result.data.type}</Di>
                    <Di title={t('in-websites:websiteDashboard.tabs.errors.errorTitleMessage')}>
                      {result.data.message}
                    </Di>
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
                    <Card
                      title={t('in-websites:websiteDashboard.tabs.errors.errorTitleStackTrace')}
                      header={<div className={locals.stackTraceActions}>{actions}</div>}
                    >
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
                title={t('in-websites:websiteDashboard.tabs.errors.errorTitleScriptError')}
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
              <Card title={t('in-websites:websiteDashboard.tabs.errors.errorTitleComponentStack')}>
                <Code showLineNumbers={false} code={removeBlankLines(result.data.componentStack)} lang="plain" />
              </Card>
            </Col>
          </Row>
        )}

        <Row>
          <Col lg={4}>
            <WebsiteChartWrapper
              cardTitle={t('in-websites:websiteDashboard.tabs.errors.errorCardTitlePageViews')}
              timeConfig={timeConfig}
              renderLegend={false}
              viewInAnalytics={viewInAnalytics}
              y1={{
                renderer: Renderer.stackedBar,
                formatter: number.forcedCompact,
                labels: [
                  t('in-websites:websiteDashboard.tabs.errors.errorLabelPageLoads'),
                  t('in-websites:websiteDashboard.tabs.errors.errorLabelPageTransitions')
                ],
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
              cardTitle={t('in-websites:websiteDashboard.tabs.errors.errorCardTitleOccurrences')}
              timeConfig={timeConfig}
              renderLegend={false}
              viewInAnalytics={viewInAnalytics}
              y1={{
                renderer: Renderer.bar,
                formatter: number.forcedCompact,
                labels: [t('in-websites:websiteDashboard.tabs.errors.errorLabelOccurrences')],
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
              cardTitle={t('in-websites:websiteDashboard.tabs.errors.errorCardTitleAffectedUsers')}
              timeConfig={timeConfig}
              renderLegend={false}
              viewInAnalytics={viewInAnalytics}
              y1={{
                renderer: Renderer.bar,
                formatter: affectedUsersChart,
                labels: [t('in-websites:websiteDashboard.tabs.errors.errorLabelAffectedUsers')],
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
                urlMatrixParamConfig={{ path: detailsPath, paramTab: 'pagesTab' }}
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
              urlMatrixParamConfig={{ path: detailsPath, paramTab: 'browserTab' }}
            />
          </Col>
          <Col lg={pageId == null ? 4 : 6}>
            <OsTopList
              websiteId={websiteId}
              websiteLabel={websiteLabel}
              tagFilters={tagFiltersWithErrorId}
              timeConfig={timeConfig}
              pageId={pageId}
              urlMatrixParamConfig={{ path: detailsPath, paramTab: 'osTab' }}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Title
        title={t('in-websites:websiteDashboard.tabs.errors.errorTitleWebsiteJSErrorDetails')}
        dynamic={result && result.data && result.data.message}
      />

      <div className={locals.actions}>
        <BackButton
          label={t('in-websites:websiteDashboard.tabs.errors.errorLabelBackToListOfJSErrors')}
          href$={getLinkToWebsite(websiteId, { tabPath: '/errors', pageId })}
          withoutMargin
        />

        <Button
          kind="secondary"
          href$={
            tagCatalogError &&
            getLinkToAnalyze({
              beaconType: 'error',
              formModel: translateDemocratisationTagFiltersToFormModel({
                websiteLabel,
                tagFilters: tagFilters.concat([{ name: 'beacon.error.id', stringValue: errorId, operator: 'EQUALS' }]),
                tagCatalog: tagCatalogError
              }),
              groupBy: {
                groupbyTag: 'beacon.location.path'
              }
            })
          }
        >
          {t('in-websites:websiteDashboard.tabs.errors.errorButtonAnalyzeJSError')}
        </Button>
      </div>

      {content}
      <Footer />
    </Fragment>
  );
}
