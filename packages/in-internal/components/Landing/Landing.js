/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Card } from '@instana/components';
import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import OpenEventsCountChartWrapper from 'in-events/components/OpenEventsCountChartWrapper';
import { LinkList, LinkListItem } from 'in-internal/components/LinkList/LinkList';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { internalMonitoringUnit } from 'in-services/featureFlags';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getModifiedUrlStream } from 'in-stores/navigation';
import TimeZones from 'in-internal/components/TimeZones';
import { Row, Col } from 'in-new-components/layout/Grid';
import { getInfraGranularity } from 'in-stores/metric';
import { number } from 'in-services/formatters/number';
import { role, isInstanaEmail } from 'in-stores/user';
import { timeConfig$ } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import { config } from 'in-services/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './Landing.mless';

export default connectTo({ timeConfig: timeConfig$, isInternalVisible: isInternalVisible$ }, function Landing({
  timeConfig,
  isInternalVisible
}) {
  const granularity = getInfraGranularity(timeConfig);

  return (
    <>
      <div className={locals.header}>
        <TimeZones />
      </div>

      {internalMonitoringUnit && isInstanaEmail && (
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
                {isInstanaEmail && (
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
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/sloViolations')
                            )}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.eventView')}
                            href$={getModifiedUrlStream(params => {
                              params.pathname = '/events';
                              params.query.q =
                                '(event.text:"[SREInfaSLO]" OR event.text:"[SRESLO]" OR event.text:"[TUSLO]" OR event.text:"[ExpTUSLO]" OR event.text:"[DevTUSLO]") AND event.state:open';
                              setOrDeleteMatrixKey(params, '/events', 'view', 'issue');
                            })}
                          />
                        </LinkList>
                      </LinkListItem>
                      <LinkListItem
                        label={t('in-internal:components.landing.definition')}
                        external
                        href="https://github.com/instana/backend/tree/develop/objectives"
                        description={t('in-internal:components.landing.learnEvolveSLOs')}
                      />
                    </LinkList>
                  </LinkListItem>
                )}

                <LinkListItem
                  label={t('in-internal:components.landing.regionStatistics')}
                  href$={getModifiedUrlStream(params => (params.pathname = '/internal/monitoringUnit/region'))}
                  description={t('in-internal:components.landing.statisticsWholeMonitorUnit')}
                />

                <LinkListItem
                  label={t('in-internal:components.landing.units')}
                  description={t('in-internal:components.landing.gatherInsightsVarUnitsProblems')}
                >
                  <LinkList>
                    <LinkListItem
                      label={t('in-internal:components.landing.unitList')}
                      href$={getModifiedUrlStream(params => (params.pathname = '/internal/monitoringUnit/units'))}
                      description={t('in-internal:components.landing.allowsUnitLevelStability')}
                    />
                    <LinkListItem
                      label={t('in-internal:components.landing.agents')}
                      href$={getModifiedUrlStream(params => (params.pathname = '/internal/monitoringUnit/agents'))}
                      description={t('in-internal:components.landing.agentDesc')}
                    />
                  </LinkList>
                </LinkListItem>

                {role.canSeeExtendedInternalMonitoring && (
                  <LinkListItem label={t('in-internal:components.landing.pipelines')}>
                    <LinkList>
                      <LinkListItem
                        label={t('in-internal:components.landing.acceptor')}
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/sre/acceptors')
                        )}
                        description={t('in-internal:components.landing.acceptorDesc')}
                      />
                      <LinkListItem
                        label={t('in-internal:components.landing.serverlessAcceptor')}
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/serverless/serverlessacceptors')
                        )}
                        description={t('in-internal:components.landing.serverlessAcceptorDesc')}
                      />
                      <LinkListItem
                        label={t('in-internal:components.landing.cashiers')}
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/cashier/cashiers')
                        )}
                        description={t('in-internal:components.landing.cashiersDesc')}
                      />
                      <LinkListItem
                        label={t('in-internal:components.landing.hubforce')}
                        href$={getModifiedUrlStream(params => (params.pathname = '/internal/monitoringUnit/hubforce'))}
                        description={t('in-internal:components.landing.hubforceDesc')}
                      />
                      <LinkListItem
                        label={t('in-internal:components.landing.applMonitor')}
                        description={t('in-internal:components.landing.applMonitorDesc')}
                      >
                        <LinkList>
                          <LinkListItem
                            label={t('in-internal:components.landing.processing')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/appdataProcessing')
                            )}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.batchingWriting')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/appdataBatchingInsights')
                            )}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.writingReading')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/appdata')
                            )}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.readingRrealTime')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/appdataLiveAggregator')
                            )}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.healthProcessing')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/appdataHealthProcessor')
                            )}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.queryPerformance')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/appDataQueryPerformance')
                            )}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.callExtraction')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/callExtraction')
                            )}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.resilientMapping')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/resilientMapping')
                            )}
                          />
                        </LinkList>
                      </LinkListItem>

                      <LinkListItem
                        label={t('in-internal:components.landing.logMonitor')}
                        description={t('in-internal:components.landing.logMonitorDesc')}
                      >
                        <LinkList>
                          <LinkListItem
                            label={t('in-internal:components.landing.logMonitorProcessing')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/log/LogProcessor')
                            )}
                            description={t('in-internal:components.landing.logMonitorProcessingDesc')}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.logMonitorWriter')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/log/LogWriter')
                            )}
                            description={t('in-internal:components.landing.logMonitorWriterDesc')}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.logMonitorReader')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/log/LogReader')
                            )}
                            description={t('in-internal:components.landing.logMonitorReaderDesc')}
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
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/infrastructureMetrics/filler')
                            )}
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
                            href$={getModifiedUrlStream(params => (params.pathname = '/internal/monitoringUnit/eum'))}
                            description={t('in-internal:components.landing.overviewDesc')}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.landingEumAcceptor')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/eum/eum-acceptor')
                            )}
                            description={t('in-internal:components.landing.landingEumAcceptorDesc')}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.jsStackTraceTranslator')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/eum/jsStackTraceTranslator')
                            )}
                            description={t('in-internal:components.landing.jsStackTraceTranslatorDesc')}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.eumProcessor')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/eum/eum-processor')
                            )}
                            description={t('in-internal:components.landing.eumProcessorDesc')}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.eumHealthHrocessor')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/eum/eumHealthProcessor')
                            )}
                            description={t('in-internal:components.landing.eumHealthHrocessorDesc')}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.appdataWriter')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/eum/appdata-writer')
                            )}
                            description={t('in-internal:components.landing.appdataWriterDesc')}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.errorSimulator')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/eum/errorSimulator')
                            )}
                            description={t('in-internal:components.landing.errorSimulatorDesc')}
                          />
                        </LinkList>
                      </LinkListItem>
                    </LinkList>
                  </LinkListItem>
                )}

                {role.canSeeExtendedInternalMonitoring && (
                  <LinkListItem label={t('in-internal:components.landing.dataStores')}>
                    <LinkList>
                      <LinkListItem
                        label={t('in-internal:components.landing.metricsCassandra')}
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/sre/metricscassandra')
                        )}
                      />
                      <LinkListItem
                        label={t('in-internal:components.landing.spansCassandra')}
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/sre/spanscassandra')
                        )}
                      />
                      <LinkListItem
                        label={t('in-internal:components.landing.profilesCassandra')}
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/sre/profilescassandra')
                        )}
                      />
                      <LinkListItem
                        label={t('in-internal:components.landing.stateCassandra')}
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/sre/statecassandra')
                        )}
                      />
                      <LinkListItem label={t('in-internal:components.landing.clickhouse')}>
                        <LinkList>
                          <LinkListItem
                            label={t('in-internal:components.landing.overview')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/sre/clickhouse')
                            )}
                          />
                          <LinkListItem
                            label={t('in-internal:components.landing.tableSizes')}
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/sre/clickhouseTableSizes')
                            )}
                          />
                        </LinkList>
                      </LinkListItem>
                      <LinkListItem
                        label={t('in-internal:components.landing.elasticsearch')}
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/sre/elastic')
                        )}
                      />
                      <LinkListItem
                        label={t('in-internal:components.landing.elasticsearchNg')}
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/sre/elasticng')
                        )}
                      />
                      <LinkListItem
                        label={t('in-internal:components.landing.kafka')}
                        href$={getModifiedUrlStream(params => (params.pathname = '/internal/monitoringUnit/sre/kafka'))}
                      />
                      <LinkListItem
                        label={t('in-internal:components.landing.beeInstanaAggregators')}
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/sre/beeinstanaaggregators')
                        )}
                      />
                      <LinkListItem
                        label={t('in-internal:components.landing.beeInstanaIngestors')}
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/sre/beeinstanaingestors')
                        )}
                      />
                    </LinkList>
                  </LinkListItem>
                )}
              </LinkList>
            </Card>
          </Col>
        )}

        <Col lg={6}>
          {internalMonitoringUnit && isInstanaEmail && (
            <Row>
              <Col lg={12}>
                <Card title={t('in-internal:components.landing.tip')}>
                  <p className={locals.tip}>{t('in-internal:components.landing.internalMonitoringUnitInstanaEmail')}</p>
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
                    label={t('in-internal:components.landing.entityStatistics')}
                    href$={getModifiedUrlStream(params => (params.pathname = '/internal/thisUnit/entityStatistics'))}
                    description={t('in-internal:components.landing.entityStatisticsDesc')}
                  />
                  <LinkListItem
                    label={t('in-internal:components.landing.agents')}
                    href$={getModifiedUrlStream(params => (params.pathname = '/internal/thisUnit/agents'))}
                    description={t('in-internal:components.landing.agentsDesc')}
                  />
                  <LinkListItem
                    label={t('in-internal:components.landing.graphExplorer')}
                    href$={getModifiedUrlStream(params => (params.pathname = '/internal/thisUnit/graphExplorer'))}
                    description={t('in-internal:components.landing.graphExplorerDesc')}
                  />
                  <LinkListItem
                    label={t('in-internal:components.landing.infrastructureEntityVer')}
                    href$={getModifiedUrlStream(params => (params.pathname = '/internal/thisUnit/snapshotVersions'))}
                    description={t('in-internal:components.landing.infrastructureEntityVerDesc')}
                  />
                  <LinkListItem
                    label={t('in-internal:components.landing.internalEvents')}
                    href$={getModifiedUrlStream(params => (params.pathname = '/internal/thisUnit/internalEvents'))}
                    description={t('in-internal:components.landing.internalEventsDesc')}
                  />
                </LinkList>
              </Card>
            </Col>
          </Row>

          {isInternalVisible && isInstanaEmail && (
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
                          label={'🟢 ' + t('in-internal:components.landing.unitMonitoringWhite')}
                          href="https://green-instanaops.instana.io"
                          external
                          description={t('in-internal:components.landing.unitMonitoringWhiteDesc')}
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
                          href="https://demous-demo.instana.io"
                          external
                          description={t('in-internal:components.landing.demousDescUs')}
                        />
                        <LinkListItem
                          label={t('in-internal:components.landing.demous')}
                          href="https://demoeu-demo.instana.io"
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
});
