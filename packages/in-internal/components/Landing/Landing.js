import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { LinkList, LinkListItem } from 'in-internal/components/LinkList/LinkList';
import SloViolationsChart from 'in-internal/components/SloViolationsChart';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { isInstanaEngineer, isInstanaEmail } from 'in-stores/user';
import { internalMonitoringUnit } from 'in-services/featureFlags';
import { getModifiedUrlStream } from 'in-stores/navigation';
import TimeZones from 'in-internal/components/TimeZones';
import { Row, Col } from 'in-new-components/layout/Grid';
import { timeConfig$ } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import { config } from 'in-services/config';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

import locals from './Landing.mless';

export default connectTo({ timeConfig: timeConfig$, isInternalVisible: isInternalVisible$ }, function Landing({
  timeConfig,
  isInternalVisible
}) {
  return (
    <>
      <div className={locals.header}>
        <TimeZones />
      </div>

      {internalMonitoringUnit && isInstanaEmail && (
        <Row>
          <Col lg={6}>
            <SloViolationsChart
              timeConfig={timeConfig}
              cardTitle="Shared Component SLO Violations"
              query={
                'NOT (entity.jvm.app.name:"filler*" OR entity.jvm.app.name:"processor*" OR entity.jvm.app.name:"issue-tracker*" OR entity.jvm.app.name:"appdata-processor*" OR entity.jvm.app.name:"appdata-legacy-*" OR entity.jvm.app.name:"ui-backend*")'
              }
            />
          </Col>
          <Col lg={6}>
            <SloViolationsChart
              timeConfig={timeConfig}
              cardTitle="TU SLO Violations"
              query={
                '(entity.jvm.app.name:"filler*" OR entity.jvm.app.name:"processor*" OR entity.jvm.app.name:"issue-tracker*" OR entity.jvm.app.name:"appdata-processor*" OR entity.jvm.app.name:"appdata-legacy-*" OR entity.jvm.app.name:"ui-backend*")'
              }
            />
          </Col>
        </Row>
      )}

      <Row>
        {internalMonitoringUnit && (
          <Col lg={6}>
            <Card title="Instana Installation Monitoring">
              <LinkList>
                {isInstanaEmail && (
                  <LinkListItem
                    label="Service-Level Objectives (SLOs)"
                    description="SLOs are used to check whether our components and data-stores are operating within expected bounds."
                  >
                    <LinkList>
                      <LinkListItem label="Violations" description="Inspect which SLOs we are breaking/violating.">
                        <LinkList>
                          <LinkListItem
                            label="Grouped View"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/sloViolations')
                            )}
                          />
                          <LinkListItem
                            label="Event View"
                            href$={getModifiedUrlStream(params => {
                              params.pathname = '/events';
                              params.query.q =
                                '(event.text:"[SLO]" OR event.text:"[experimental SLO]") AND event.state:open';
                              setOrDeleteMatrixKey(params, '/events', 'view', 'issue');
                            })}
                          />
                        </LinkList>
                      </LinkListItem>
                      <LinkListItem
                        label="Definition"
                        external
                        href="https://github.com/instana/backend/tree/develop/objectives"
                        description="Learn about & evolve our SLOs."
                      />
                    </LinkList>
                  </LinkListItem>
                )}

                <LinkListItem
                  label="Region Statistics"
                  href$={getModifiedUrlStream(params => (params.pathname = '/internal/monitoringUnit/region'))}
                  description="Statistics across the whole monitoring unit, i.e. all units and shared components."
                />

                <LinkListItem
                  label="Units"
                  description="Gather insights how the various units are performing and identify which unit is having problems."
                >
                  <LinkList>
                    <LinkListItem
                      label="Unit List"
                      href$={getModifiedUrlStream(params => (params.pathname = '/internal/monitoringUnit/units'))}
                      description="Allows unit-level insights, e.g. infrastructure and application monitoring stability."
                    />
                    <LinkListItem
                      label="Agents"
                      href$={getModifiedUrlStream(params => (params.pathname = '/internal/monitoringUnit/agents'))}
                      description="Learn which unit has agents that are experiencing problems."
                    />
                  </LinkList>
                </LinkListItem>

                {isInstanaEngineer && (
                  <LinkListItem label="Pipelines">
                    <LinkList>
                      <LinkListItem
                        label="Acceptor"
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/sre/acceptors')
                        )}
                        description="Agents transmit data to acceptors. Acceptors are therefore the first-mile for most of the data transmitted to Instana."
                      />
                      <LinkListItem
                        label="ServerlessAcceptor"
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/serverless/serverlessacceptors')
                        )}
                        description="Serverless-acceptors are the first-mile for serverless tracing and monitoring, when data is transmitted directly from a serverless enitity to our back end, without an Instana agent in between."
                      />
                      <LinkListItem
                        label="Cashiers"
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/cashier/cashiers')
                        )}
                        description="Cashier components are used for generating usage stats for customers and internal accounting."
                      />
                      <LinkListItem
                        label="Hubforce"
                        href$={getModifiedUrlStream(params => (params.pathname = '/internal/monitoringUnit/hubforce'))}
                        description="Hubforce (i.e. Portal) "
                      />
                      <LinkListItem
                        label="Application Monitoring"
                        description="Dashboards showing how application data, i.e. traces and spans, are written and read."
                      >
                        <LinkList>
                          <LinkListItem
                            label="Processing"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/appdataProcessing')
                            )}
                          />
                          <LinkListItem
                            label="Batching & Writing"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/appdataBatchingInsights')
                            )}
                          />
                          <LinkListItem
                            label="Writing & Reading"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/appdata')
                            )}
                          />
                          <LinkListItem
                            label="Reading (real-time)"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/appdataLiveAggregator')
                            )}
                          />
                          <LinkListItem
                            label="Health Processing"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/appdataHealthProcessor')
                            )}
                          />
                          <LinkListItem
                            label="Query Performance"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/appDataQueryPerformance')
                            )}
                          />
                          <LinkListItem
                            label="Call Extraction"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/callExtraction')
                            )}
                          />
                          <LinkListItem
                            label="Resilient Mapping"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/resilientMapping')
                            )}
                          />
                        </LinkList>
                      </LinkListItem>

                      <LinkListItem
                        label="Infrastructure Metrics"
                        description="Information about our infrastructure metric pipeline."
                      >
                        <LinkList>
                          <LinkListItem
                            label="Filler (metric extraction)"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/infrastructureMetrics/filler')
                            )}
                          />
                        </LinkList>
                      </LinkListItem>

                      <LinkListItem
                        label="End-User Monitoring (EUM)"
                        description="Information about our website monitoring processing pipeline. This includes acceptance of end-user requests as well as processing and writing of the received beacons."
                      >
                        <LinkList>
                          <LinkListItem
                            label="Overview"
                            href$={getModifiedUrlStream(params => (params.pathname = '/internal/monitoringUnit/eum'))}
                            description="Gain an overview across the whole EUM pipeline. This dashboard is a combination and subset of the eum-acceptor, eum-processor and appdata-writer dashboards."
                          />
                          <LinkListItem
                            label="eum-acceptor (beacon acceptance)"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/eum/eum-acceptor')
                            )}
                            description="eum-acceptor accepts end-user requests, validates, maps and transmits them via Kafka for processing."
                          />
                          <LinkListItem
                            label="js-stack-trace-translator (beacon pre-processing)"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/eum/jsStackTraceTranslator')
                            )}
                            description="Parses and attempts to make JavaScript stack traces more readable by means of JavaScript source maps."
                          />
                          <LinkListItem
                            label="eum-processor (beacon processing)"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/eum/eum-processor')
                            )}
                            description="eum-processor enriches received beacons and forwards them to Kafka for persistence."
                          />
                          <LinkListItem
                            label="eum-health-processor (health rule execution)"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/eum/eumHealthProcessor')
                            )}
                            description="eum-health-processor reads processed beacons from Kafka and executes rules on buckets of beacons."
                          />
                          <LinkListItem
                            label="appdata-writer (beacon ingestion)"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/eum/appdata-writer')
                            )}
                            description="appdata-writer persists enriched beacons to ClickHouse."
                          />
                          <LinkListItem
                            label="Error Simulator"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/eum/errorSimulator')
                            )}
                            description="Trigger JavaScript errors to verify website monitoring behavior."
                          />
                        </LinkList>
                      </LinkListItem>
                    </LinkList>
                  </LinkListItem>
                )}

                {isInstanaEngineer && (
                  <LinkListItem label="Data Stores">
                    <LinkList>
                      <LinkListItem
                        label="Metrics Cassandra"
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/sre/metricscassandra')
                        )}
                      />
                      <LinkListItem
                        label="Spans Cassandra"
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/sre/spanscassandra')
                        )}
                      />
                      <LinkListItem
                        label="Profiles Cassandra"
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/sre/profilescassandra')
                        )}
                      />
                      <LinkListItem label="Clickhouse">
                        <LinkList>
                          <LinkListItem
                            label="Overview"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/sre/clickhouse')
                            )}
                          />
                          <LinkListItem
                            label="Table Sizes"
                            href$={getModifiedUrlStream(
                              params => (params.pathname = '/internal/monitoringUnit/sre/clickhouseTableSizes')
                            )}
                          />
                        </LinkList>
                      </LinkListItem>
                      <LinkListItem
                        label="Elasticsearch"
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/sre/elastic')
                        )}
                      />
                      <LinkListItem
                        label="Kafka"
                        href$={getModifiedUrlStream(params => (params.pathname = '/internal/monitoringUnit/sre/kafka'))}
                      />
                    </LinkList>
                  </LinkListItem>
                )}

                {isInstanaEngineer && (
                  <LinkListItem label="Workers">
                    <LinkList>
                      <LinkListItem
                        label="Worker Allocation/Load"
                        href$={getModifiedUrlStream(
                          params => (params.pathname = '/internal/monitoringUnit/sre/workerStats')
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
                <Card title="Tip">
                  <p className={locals.tip}>
                    Did you know that these features are also available on customer tenant units? They are hidden by
                    default, but can be shown with a small trick. To enable them click 10 times (within 2 seconds) on
                    the non-interactive part of our main navigation!
                  </p>
                </Card>
              </Col>
            </Row>
          )}

          <Row>
            <Col lg={12}>
              <Card title={`This Unit (${config.tenant}-${config.tenantUnit})`}>
                <LinkList>
                  <LinkListItem
                    label="Entity Statistics"
                    href$={getModifiedUrlStream(params => (params.pathname = '/internal/thisUnit/entityStatistics'))}
                    description="Shows how many infrastructure entities are monitored within this unit, broken down by plugin. This was formerly called 'Cockpit'."
                  />
                  <LinkListItem
                    label="Agents"
                    href$={getModifiedUrlStream(params => (params.pathname = '/internal/thisUnit/agents'))}
                    description="Metrics for all agents reporting to this unit."
                  />
                  <LinkListItem
                    label="Graph Explorer"
                    href$={getModifiedUrlStream(params => (params.pathname = '/internal/thisUnit/graphExplorer'))}
                    description="Use this to analyze graph relations between infrastructure entities existing within this unit."
                  />
                  <LinkListItem
                    label="Infrastructure Entity Versions"
                    href$={getModifiedUrlStream(params => (params.pathname = '/internal/thisUnit/snapshotVersions'))}
                    description="Inspect versions for a single infrastructure entity and visualize when they were created and for how long they were valid/"
                  />
                  <LinkListItem
                    label="Internal Events"
                    href$={getModifiedUrlStream(params => (params.pathname = '/internal/thisUnit/internalEvents'))}
                    description="Request a list of internal events such as Agent Crash Reports"
                  />
                </LinkList>
              </Card>
            </Col>
          </Row>

          {isInternalVisible && isInstanaEmail && (
            <Row>
              <Col lg={12}>
                <Card title="Available Instana Units">
                  <LinkList>
                    <LinkListItem
                      label="SaaS Monitoring Units"
                      description="These units exist to monitor our own SaaS installations. They themselves are SaaS units."
                    >
                      <LinkList>
                        <LinkListItem
                          label="🟢 Green"
                          href="https://green-instanaops.instana.io"
                          external
                          description="Unit monitoring the Green (GCP) SaaS installation."
                        />
                        <LinkListItem
                          label="🟠 Orange"
                          href="https://orange-instanaops.instana.io"
                          external
                          description="Unit monitoring the Orange (GCP) SaaS installation."
                        />
                        <LinkListItem
                          label="🔴 Red"
                          href="https://red-instanaops.instana.io"
                          external
                          description="Unit monitoring the Red (AWS US) SaaS installation."
                        />
                        <LinkListItem
                          label="🔵 Blue"
                          href="https://blue-instanaops.instana.io"
                          external
                          description="Unit monitoring the Blue (AWS EU) SaaS installation."
                        />
                        <LinkListItem
                          label="🇪🇺 EU (deprecated)"
                          href="https://eu-instanaops.instana.io"
                          external
                          description="Deprecated: Unit monitoring the EU SaaS installation, as well as the environment-wide components Groundskeeper, Butler and CockroachDB."
                        />
                        <LinkListItem
                          label="🇺🇸 US (deprecated)"
                          href="https://us-instanaops.instana.io"
                          external
                          description="Deprecated: Unit monitoring the US SaaS installation."
                        />
                      </LinkList>
                    </LinkListItem>

                    <LinkListItem
                      label="Development Units"
                      description="These units are designed to be used mainly by the product organization of Instana to continue to evolve Instana itself."
                    >
                      <LinkList>
                        <LinkListItem
                          label="Test"
                          href="https://test-instana.pink.instana.rocks"
                          external
                          description="Auto-deployed from the develop branches every hour."
                        />
                        <LinkListItem
                          label="Nightly"
                          href="https://nightly-instana.pink.instana.rocks"
                          external
                          description="Auto-deployed from the develop branches every night."
                        />
                        <LinkListItem
                          label="Staging"
                          href="https://staging-instana.peach.instana.rocks"
                          external
                          description="Auto-deployed from the release-XYZ branch on every commit."
                        />
                        <LinkListItem
                          label="Preview"
                          href="https://preview-instana.peach.instana.rocks"
                          external
                          description="Manually deployed latest release-XYZ branch 1 week before the SaaS release. Sales / CS / SE / PM has access to this unit."
                        />
                        <LinkListItem
                          label="Release"
                          href="https://release-instana.magenta.instana.rocks"
                          external
                          description="Manually deployed latest release-XYZ on demand."
                        />
                        <LinkListItem
                          label="Load"
                          href="https://load-instana.rose.instana.rocks"
                          external
                          description="Manually deployed from any branch on demand."
                        />
                        <LinkListItem
                          label="SRE"
                          href="https://sre-instana.melon.instana.rocks"
                          external
                          description="Manually deployed from any branch on demand. Used by SRE to develop instanactl."
                        />
                        <LinkListItem
                          label="Internal"
                          href="https://internal-instanaops.instana.io"
                          external
                          description="A SaaS unit monitoring the internal development units."
                        />
                      </LinkList>
                    </LinkListItem>

                    <LinkListItem
                      label="Demo Units"
                      description="These units are frequently used by the whole company for demo / presentation purposes."
                    >
                      <LinkList>
                        <LinkListItem
                          label="demous"
                          href="https://demous-demo.instana.io"
                          external
                          description="A SaaS demo unit running within the US."
                        />
                        <LinkListItem
                          label="demous"
                          href="https://demoeu-demo.instana.io"
                          external
                          description="A SaaS demo unit running within the EU."
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
