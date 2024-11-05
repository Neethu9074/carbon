/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { internalMonitoringUnit, pluginMetricStatisticsEnabled } from 'in-services/featureFlags';
import OpenEventsCountChartWrapper from 'in-events/components/OpenEventsCountChartWrapper';
import { LinkList, LinkListItem } from 'in-internal/components/LinkList/LinkList';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { canSeeExtendedInternalMonitoring, role } from 'in-stores/user';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getInfraGranularity } from 'in-stores/metric';
import { number } from 'in-services/formatters/number';
import { Col, Row } from 'in-components/layout/Grid';
import { timeConfig$ } from 'in-stores/time/config';
import { config } from 'in-services/config';
import Footer from 'in-components/Footer';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './Landing.mless';

export default connectTo(
  { timeConfig: timeConfig$, isInternalVisible: isInternalVisible$ },
  function Landing({ timeConfig, isInternalVisible }) {
    const granularity = getInfraGranularity(timeConfig);

    const { createHref, location } = useNavigation();
    const otlpAcceptorsHref = createHref({ ...location, pathname: '/internal/monitoringUnit/otlpAcceptors' });

    return (
      <>
        {internalMonitoringUnit && canSeeExtendedInternalMonitoring && (
          <Row>
            <Col lg={6}>
              <OpenEventsCountChartWrapper
                cardTitle={t('in-internal:components.landing.sharedCompSLOViolate')}
                timeConfig={timeConfig}
                y1={{
                  renderer: Renderer.stackedArea,
                  formatter: number.forcedCompact,
                  labels: ['SREInfaSLO', 'SRESLO'],
                  metricIds: ['sreinfraslo', 'sreslo']
                }}
                metricsConfiguration={{
                  timeConfig,
                  metrics: {
                    sreinfraslo: {
                      query: `event.text:"SREInfaSLO"`,
                      granularity
                    },
                    sreslo: {
                      query: `event.text:"SRESLO"`,
                      granularity
                    }
                  }
                }}
              />
            </Col>
            <Col lg={6}>
              <OpenEventsCountChartWrapper
                cardTitle={t('in-internal:components.landing.tUSLOViolate')}
                timeConfig={timeConfig}
                y1={{
                  renderer: Renderer.stackedArea,
                  formatter: number.forcedCompact,
                  labels: ['TUSLO', 'ExpTUSLO', 'DevTUSLO'],
                  metricIds: ['tuslo', 'exptuslo', 'devtuslo']
                }}
                metricsConfiguration={{
                  timeConfig,
                  metrics: {
                    tuslo: {
                      query: `event.text:"TUSLO"`,
                      granularity
                    },
                    exptuslo: {
                      query: `event.text:"ExpTUSLO"`,
                      granularity
                    },
                    devtuslo: {
                      query: `event.text:"DevTUSLO"`,
                      granularity
                    }
                  }
                }}
              />
            </Col>
          </Row>
        )}

        <Row>
          {internalMonitoringUnit && (
            <Col lg={6}>
              <Card title={t('in-internal:components.landing.instanaInstallMonitor')}>
                <LinkList>
                  {canSeeExtendedInternalMonitoring && (
                    <LinkListItem
                      label={t('in-internal:components.landing.serviceLevelObj')}
                      description={t('in-internal:components.landing.sloCheckCompDatastoresExpectedBounds')}
                    >
                      <LinkList>
                        <LinkListItem
                          label={t('in-internal:components.landing.violations')}
                          description={t('in-internal:components.landing.inspectSLObreakingViolating')}
                        >
                          <LinkList>
                            <LinkListItem
                              label={t('in-internal:components.landing.groupedView')}
                              href={createHref({ ...location, pathname: '/internal/monitoringUnit/sloViolations' })}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.eventView')}
                              href={linkToEventView({ ...location }, createHref)}
                            />
                          </LinkList>
                        </LinkListItem>
                        <LinkListItem
                          label={t('in-internal:components.landing.definition')}
                          external
                          href="https://github.ibm.com/instana/backend/tree/develop/objectives"
                          description={t('in-internal:components.landing.learnEvolveSLOs')}
                        />
                      </LinkList>
                    </LinkListItem>
                  )}

                  <LinkListItem
                    label={t('in-internal:components.landing.regionStatistics')}
                    href={createHref({ ...location, pathname: '/internal/monitoringUnit/region' })}
                    description={t('in-internal:components.landing.statisticsWholeMonitorUnit')}
                  />

                  <LinkListItem
                    label={t('in-internal:components.landing.units')}
                    description={t('in-internal:components.landing.gatherInsightsVarUnitsProblems')}
                  >
                    <LinkList>
                      <LinkListItem
                        label={t('in-internal:components.landing.unitList')}
                        href={createHref({ ...location, pathname: '/internal/monitoringUnit/units' })}
                        description={t('in-internal:components.landing.allowsUnitLevelStability')}
                      />
                      <LinkListItem
                        label={t('in-internal:components.landing.agents')}
                        href={createHref({ ...location, pathname: '/internal/monitoringUnit/agents' })}
                        description={t('in-internal:components.landing.agentDesc')}
                      />
                    </LinkList>
                  </LinkListItem>

                  {role.canSeeExtendedInternalMonitoring && (
                    <LinkListItem label={t('in-internal:components.landing.pipelines')}>
                      <LinkList>
                        <LinkListItem
                          label={t('in-internal:components.landing.acceptor')}
                          href={createHref({ ...location, pathname: '/internal/monitoringUnit/sre/acceptors' })}
                          description={t('in-internal:components.landing.acceptorDesc')}
                        />
                        <LinkListItem
                          label={t('in-internal:components.landing.serverlessAcceptor')}
                          href={createHref({
                            ...location,
                            pathname: '/internal/monitoringUnit/serverless/serverlessacceptors'
                          })}
                          description={t('in-internal:components.landing.serverlessAcceptorDesc')}
                        />
                        <LinkListItem
                          label={t('in-internal:components.landing.otlpAcceptor')}
                          href={otlpAcceptorsHref}
                          description={t('in-internal:components.landing.otlpAcceptorDesc')}
                        />
                        <LinkListItem
                          label={t('in-internal:components.landing.cashiers')}
                          href={createHref({ ...location, pathname: '/internal/monitoringUnit/cashier/cashiers' })}
                          description={t('in-internal:components.landing.cashiersDesc')}
                        />
                        <LinkListItem
                          label={t('in-internal:components.landing.hubforce')}
                          href={createHref({ ...location, pathname: '/internal/monitoringUnit/hubforce' })}
                          description={t('in-internal:components.landing.hubforceDesc')}
                        />
                        <LinkListItem
                          label={t('in-internal:components.landing.applMonitor')}
                          description={t('in-internal:components.landing.applMonitorDesc')}
                        >
                          <LinkList>
                            <LinkListItem
                              label={t('in-internal:components.landing.processing')}
                              href={createHref({ ...location, pathname: '/internal/monitoringUnit/appdataProcessing' })}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.batchingWriting')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/appdataBatchingInsights'
                              })}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.writingReading')}
                              href={createHref({ ...location, pathname: '/internal/monitoringUnit/appdata' })}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.readingRrealTime')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/appdataLiveAggregator'
                              })}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.healthAggregation')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/appdataHealthAggregator'
                              })}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.healthProcessing')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/appdataHealthProcessor'
                              })}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.queryPerformance')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/appDataQueryPerformance'
                              })}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.callExtraction')}
                              href={createHref({ ...location, pathname: '/internal/monitoringUnit/callExtraction' })}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.resilientMapping')}
                              href={createHref({ ...location, pathname: '/internal/monitoringUnit/resilientMapping' })}
                            />
                          </LinkList>
                        </LinkListItem>

                        <LinkListItem
                          label={t('in-internal:components.landing.syntheticsMonitor')}
                          description={t('in-internal:components.landing.syntheticsMonitorDesc')}
                        >
                          <LinkList>
                            <LinkListItem
                              label={t('in-internal:components.landing.syntheticsAcceptor')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/synthetics/SyntheticAcceptor'
                              })}
                              description={t('in-internal:components.landing.syntheticsAcceptorDesc')}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.syntheticsHealthProcessor')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/synthetics/SyntheticsHealthProcessor'
                              })}
                              description={t('in-internal:components.landing.syntheticsHealthProcessorDesc')}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.syntheticsMonitorWriter')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/synthetics/SyntheticsWriter'
                              })}
                              description={t('in-internal:components.landing.syntheticsMonitorWriterDesc')}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.syntheticsMonitorReader')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/synthetics/SyntheticsReader'
                              })}
                              description={t('in-internal:components.landing.syntheticsMonitorReaderDesc')}
                            />
                          </LinkList>
                        </LinkListItem>

                        <LinkListItem
                          label={t('in-internal:components.landing.infrastructureMetrics')}
                          description={t('in-internal:components.landing.infrastructureMetricsDesc')}
                        >
                          <LinkList>
                            <LinkListItem
                              label={t('in-internal:components.landing.fillerMetricExtraction')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/infrastructureMetrics/filler'
                              })}
                            />
                          </LinkList>
                        </LinkListItem>

                        <LinkListItem
                          label={t('in-internal:components.landing.endUserMonitoring')}
                          description={t('in-internal:components.landing.endUserMonitoringDesc')}
                        >
                          <LinkList>
                            <LinkListItem
                              label={t('in-internal:components.landing.overview')}
                              href={createHref({ ...location, pathname: '/internal/monitoringUnit/eum/overview' })}
                              description={t('in-internal:components.landing.overviewDesc')}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.landingEumAcceptor')}
                              href={createHref({ ...location, pathname: '/internal/monitoringUnit/eum/eum-acceptor' })}
                              description={t('in-internal:components.landing.landingEumAcceptorDesc')}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.jsStackTraceTranslator')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/eum/jsStackTraceTranslator'
                              })}
                              description={t('in-internal:components.landing.jsStackTraceTranslatorDesc')}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.eumProcessor')}
                              href={createHref({ ...location, pathname: '/internal/monitoringUnit/eum/eum-processor' })}
                              description={t('in-internal:components.landing.eumProcessorDesc')}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.eumHealthHrocessor')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/eum/eumHealthProcessor'
                              })}
                              description={t('in-internal:components.landing.eumHealthHrocessorDesc')}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.appdataWriter')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/eum/appdata-writer'
                              })}
                              description={t('in-internal:components.landing.appdataWriterDesc')}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.errorSimulator')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/eum/errorSimulator'
                              })}
                              description={t('in-internal:components.landing.errorSimulatorDesc')}
                            />
                          </LinkList>
                        </LinkListItem>

                        <LinkListItem
                          label={t('in-internal:components.landing.logMonitoring')}
                          description={t('in-internal:components.landing.logMonitoringDesc')}
                        >
                          <LinkList>
                            <LinkListItem
                              label={t('in-internal:components.landing.logHealthProcessor')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/log/logHealthProcessor'
                              })}
                            />
                          </LinkList>
                        </LinkListItem>
                      </LinkList>
                    </LinkListItem>
                  )}

                  {role.canSeeExtendedInternalMonitoring && (
                    <LinkListItem label={t('in-internal:components.landing.dataStores')}>
                      <LinkList>
                        <LinkListItem label={t('in-internal:components.landing.cassandra')}>
                          <LinkList>
                            <LinkListItem
                              label={t('in-internal:components.landing.metricsCassandra')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/sre/metricscassandra'
                              })}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.spansCassandra')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/sre/spanscassandra'
                              })}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.profilesCassandra')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/sre/profilescassandra'
                              })}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.stateCassandra')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/sre/statecassandra'
                              })}
                            />
                          </LinkList>
                        </LinkListItem>
                        <LinkListItem label={t('in-internal:components.landing.clickhouse')}>
                          <LinkList>
                            <LinkListItem
                              label={t('in-internal:components.landing.clickhouseApplication')}
                              href={createHref({ ...location, pathname: '/internal/monitoringUnit/sre/clickhouse' })}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.clickhouseLogs')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/sre/clickhouseLogs'
                              })}
                            />
                            <LinkListItem
                              label={t('in-internal:components.landing.tableSizes')}
                              href={createHref({
                                ...location,
                                pathname: '/internal/monitoringUnit/sre/clickhouseTableSizes'
                              })}
                            />
                          </LinkList>
                        </LinkListItem>
                        <LinkListItem
                          label={t('in-internal:components.landing.elasticsearch')}
                          href={createHref({ ...location, pathname: '/internal/monitoringUnit/sre/elastic' })}
                        />
                        <LinkListItem
                          label={t('in-internal:components.landing.elasticsearchNg')}
                          href={createHref({ ...location, pathname: '/internal/monitoringUnit/sre/elasticng' })}
                        />
                        <LinkListItem
                          label={t('in-internal:components.landing.kafka')}
                          href={createHref({ ...location, pathname: '/internal/monitoringUnit/sre/kafka' })}
                        />
                        <LinkListItem
                          label={t('in-internal:components.landing.beeInstanaAggregators')}
                          href={createHref({
                            ...location,
                            pathname: '/internal/monitoringUnit/sre/beeinstanaaggregators'
                          })}
                        />
                        <LinkListItem
                          label={t('in-internal:components.landing.beeInstanaIngestors')}
                          href={createHref({
                            ...location,
                            pathname: '/internal/monitoringUnit/sre/beeinstanaingestors'
                          })}
                        />
                      </LinkList>
                    </LinkListItem>
                  )}
                </LinkList>
              </Card>
            </Col>
          )}

          <Col lg={6}>
            {internalMonitoringUnit && canSeeExtendedInternalMonitoring && (
              <Row>
                <Col lg={12}>
                  <Card title={t('in-internal:components.landing.tip')}>
                    <p className={locals.tip}>
                      {t('in-internal:components.landing.internalMonitoringUnitInstanaEmail')}
                    </p>
                  </Card>
                </Col>
              </Row>
            )}

            <Row>
              <Col lg={12}>
                <Card
                  title={t('in-internal:components.landing.thisTenantUnit', {
                    configTenant: config.tenant,
                    configTenantUnit: config.tenantUnit
                  })}
                >
                  <LinkList>
                    <LinkListItem
                      label={
                        pluginMetricStatisticsEnabled
                          ? t('in-internal:components.landing.entityAndMetricStatistics')
                          : t('in-internal:components.landing.entityStatistics')
                      }
                      href={createHref({ ...location, pathname: '/internal/thisUnit/entityStatistics' })}
                      description={
                        pluginMetricStatisticsEnabled
                          ? t('in-internal:components.landing.entityAndMetricStatisticsDesc')
                          : t('in-internal:components.landing.entityStatisticsDesc')
                      }
                    />
                    <LinkListItem
                      label={t('in-internal:components.landing.agents')}
                      href={createHref({ ...location, pathname: '/internal/thisUnit/agents' })}
                      description={t('in-internal:components.landing.agentsDesc')}
                    />
                    <LinkListItem
                      label={t('in-internal:components.landing.graphExplorer')}
                      href={createHref({ ...location, pathname: '/internal/thisUnit/graphExplorer' })}
                      description={t('in-internal:components.landing.graphExplorerDesc')}
                    />
                    <LinkListItem
                      label={t('in-internal:components.landing.infrastructureEntityVer')}
                      href={createHref({ ...location, pathname: '/internal/thisUnit/snapshotVersions' })}
                      description={t('in-internal:components.landing.infrastructureEntityVerDesc')}
                    />
                    <LinkListItem
                      label="Infrastructure Metrics"
                      href={createHref({ ...location, pathname: '/internal/thisUnit/metrics' })}
                      description="Browse metrics associated with an entity"
                    />
                    <LinkListItem
                      label={t('in-internal:components.landing.internalEvents')}
                      href={createHref({ ...location, pathname: '/internal/thisUnit/internalEvents' })}
                      description={t('in-internal:components.landing.internalEventsDesc')}
                    />
                    <LinkListItem
                      label="Adaptive Baseline Model for AP/Website/MobileApp Smart Alert"
                      href={createHref({ ...location, pathname: '/internal/thisUnit/adaptiveBaselineModel' })}
                      description="Inspect an Adaptive Baseline Model for specific Appdata entity"
                    />
                    <LinkListItem
                      label={t('in-internal:components.landing.wsTesterTitle')}
                      href={createHref({ ...location, pathname: '/internal/thisUnit/wsApiTester' })}
                      description={t('in-internal:components.landing.wsTesterDescription')}
                    />
                    <LinkListItem
                      label={t('in-internal:components.landing.endUserMonitoring')}
                      href={createHref({ ...location, pathname: '/internal/thisUnit/eum' })}
                      description={t('in-internal:components.landing.eumDescription')}
                    />
                    <LinkListItem
                      label={t('in-internal:components.landing.tagProcessorState')}
                      href={createHref({ ...location, pathname: '/internal/thisUnit/tagProcessorState' })}
                      description={t('in-internal:components.landing.tagProcessorStateDescription')}
                    />
                    <LinkListItem
                      // needs i18n...:
                      label="Feature Flags"
                      href={createHref({ ...location, pathname: '/internal/featureflags' })}
                      // needs i18n...:
                      description="the feature flags available for this tenant unit."
                    />
                  </LinkList>
                </Card>
              </Col>
            </Row>

            {isInternalVisible && canSeeExtendedInternalMonitoring && (
              <Row>
                <Col lg={12}>
                  <Card title={t('in-internal:components.landing.availInstanaUnits')}>
                    <LinkList>
                      <LinkListItem
                        label={t('in-internal:components.landing.saaSMonitoringUnits')}
                        description={t('in-internal:components.landing.saaSMonitoringUnitsDesc')}
                      >
                        <LinkList>
                          <LinkListItem
                            label={'🟣 ' + t('in-internal:components.landing.unitMonitoringCoral')}
                            href="https://coral-instanaops.instana.io"
                            external
                            description={t('in-internal:components.landing.unitMonitoringCoralDesc')}
                          />
                          <LinkListItem
                            label={'🟢 ' + t('in-internal:components.landing.unitMonitoringGreen')}
                            href="https://green-instanaops.instana.io"
                            external
                            description={t('in-internal:components.landing.unitMonitoringGreenDesc')}
                          />
                          <LinkListItem
                            label={'🟠 ' + t('in-internal:components.landing.unitMonitoringOrange')}
                            href="https://orange-instanaops.instana.io"
                            external
                            description={t('in-internal:components.landing.unitMonitoringOrangeDesc')}
                          />
                          <LinkListItem
                            label={'🔴 ' + t('in-internal:components.landing.unitMonitoringRed')}
                            href="https://red-instanaops.instana.io"
                            external
                            description={t('in-internal:components.landing.unitMonitoringRedDesc')}
                          />
                          <LinkListItem
                            label={'🔵 ' + t('in-internal:components.landing.unitMonitoringBlue')}
                            href="https://blue-instanaops.instana.io"
                            external
                            description={t('in-internal:components.landing.unitMonitoringBlueDesc')}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.internal')}
                            href="https://internal-instanaops.instana.io"
                            external
                            description={t('in-internal:components.landing.internalDesc')}
                          />
                        </LinkList>
                      </LinkListItem>

                      <LinkListItem
                        label={t('in-internal:components.landing.devUnits')}
                        description={t('in-internal:components.landing.devUnitsDesc')}
                      >
                        <LinkList>
                          <LinkListItem
                            label={t('in-internal:components.landing.test')}
                            href="https://test-instana.pink.instana.rocks"
                            external
                            description={t('in-internal:components.landing.testDesc')}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.nightly')}
                            href="https://nightly-instana.pink.instana.rocks"
                            external
                            description={t('in-internal:components.landing.nightlyDesc')}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.staging')}
                            href="https://staging-instana.instana.rocks"
                            external
                            description={t('in-internal:components.landing.stagingDesc')}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.preview')}
                            href="https://preview-instana.instana.rocks"
                            external
                            description={t('in-internal:components.landing.previewDesc')}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.release')}
                            href="https://release-instana.instana.rocks"
                            external
                            description={t('in-internal:components.landing.releaseDesc')}
                          />
                        </LinkList>
                      </LinkListItem>

                      <LinkListItem
                        label={t('in-internal:components.landing.demoUnits')}
                        description={t('in-internal:components.landing.demoUnitsDesc')}
                      >
                        <LinkList>
                          <LinkListItem
                            label={t('in-internal:components.landing.demous')}
                            href="https://demous-instana.instana.io"
                            external
                            description={t('in-internal:components.landing.demousDescUs')}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.demoeu')}
                            href="https://demoeu-instana.instana.io"
                            external
                            description={t('in-internal:components.landing.demousDescEu')}
                          />
                        </LinkList>
                      </LinkListItem>
                    </LinkList>
                  </Card>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
        <Footer />
      </>
    );
  }
);

function linkToEventView(clonedLocation, createHref) {
  clonedLocation.pathname = '/events';
  clonedLocation.query.q =
    '(event.text:"[SREInfaSLO]" OR event.text:"[SRESLO]" OR event.text:"[TUSLO]" OR event.text:"[ExpTUSLO]" OR event.text:"[DevTUSLO]") AND event.state:open';
  setOrDeleteMatrixKey(clonedLocation, '/events', 'view', 'issue');

  return createHref(clonedLocation);
}
