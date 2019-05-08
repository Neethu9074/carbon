import React, { Fragment } from 'react';

import { LinkList, LinkListItem } from 'in-internal/components/LinkList/LinkList';
import { internalMonitoringUnit } from 'in-services/featureFlags';
import TimeZones from 'in-internal/components/TimeZones';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

import locals from './Landing.mless';

export default function Landing() {
  return (
    <Fragment>
      <div className={locals.header}>
        <TimeZones />
      </div>

      <Row>
        {internalMonitoringUnit && (
          <Col lg={6}>
            <Card title="This Region">
              <h3>Deployed Unit Insights</h3>
              <ul className={locals.links}>
                <li>
                  <a href="/#/internal/monitoringUnit/units">Unit Details</a>
                </li>
                <li>
                  <a href="/#/internal/monitoringUnit/agents">Agent Statistics</a>
                </li>
              </ul>

              <h3>SLO</h3>
              <ul className={locals.links}>
                <li>
                  <a href="/#/events;view=issue?timeline.to&timeline.ws=900000&_k=0p6luz&q=(event.text%3A&quot;%5BSLO%5D&quot;%20OR%20event.text%3A&quot;%5Bexperimental%20SLO%5D&quot;)%20AND%20event.state%3Aopen%20&v2=true">
                    Violations (event view)
                  </a>
                </li>
                <li>
                  <a href="/#/internal/monitoringUnit/sloViolations">Violations (grouped view)</a>
                </li>
                <li>
                  <a href="https://github.com/instana/internal-tools/tree/master/objectives">Definitions</a>
                </li>
              </ul>

              <h3>Processing</h3>
              <ul className={locals.links}>
                <li>
                  <span className={locals.subTitle}>App 1.0</span>
                  <ul className={locals.links}>
                    <li>
                      <a href="/#/internal/monitoringUnit/fillerSpanProcessingStats">App 1.0 Data Processing</a>
                    </li>
                    <li>
                      <a href="/#/internal/monitoringUnit/tracesSubscriptionStats">
                        App 1.0 Traces Subscriptions Report
                      </a>
                    </li>
                  </ul>
                </li>

                <li>
                  <span className={locals.subTitle}>App 2.0</span>
                  <ul className={locals.links}>
                    <li>
                      <a href="/#/internal/monitoringUnit/appdataProcessing">App 2.0 Data Processing</a>
                    </li>
                    <li>
                      <a href="/#/internal/monitoringUnit/appdata">App 2.0 Data Reading & Writing</a>
                    </li>
                    <li>
                      <a href="/#/internal/monitoringUnit/appDataQueryPerformance">App 2.0 Query Performance</a>
                    </li>
                    <li>
                      <a href="/#/internal/monitoringUnit/callExtraction">Call Extraction</a>
                    </li>
                    <li>
                      <a href="/#/internal/monitoringUnit/resilientMapping">Resilient Mapping</a>
                    </li>
                  </ul>
                </li>

                <li>
                  <span className={locals.subTitle}>EUM</span>
                  <ul className={locals.links}>
                    <li>
                      <a href="/#/internal/monitoringUnit/eum">Overview</a>
                    </li>
                    <li>
                      <a href="/#/internal/monitoringUnit/eum/eum-acceptor">eum-acceptor (data collection)</a>
                    </li>
                    <li>
                      <a href="/#/internal/monitoringUnit/eum/eum-processor">eum-processor (data processing)</a>
                    </li>
                    <li>
                      <a href="/#/internal/monitoringUnit/eum/appdata-writer">appdata-writer (data ingestion)</a>
                    </li>
                  </ul>
                </li>
              </ul>

              <h3>SRE</h3>
              <ul className={locals.links}>
                <li>
                  <a href="/#/internal/monitoringUnit/sre/workerStats">Worker Allocation/Load</a>
                </li>
                <li>
                  <a href="/#/internal/monitoringUnit/sre/selfserviceWorkerStats">Selfservice Worker Allocation/Load</a>
                </li>
                <li>
                  <a href="/#/internal/monitoringUnit/sre/acceptors">Acceptors</a>
                </li>
                <li>
                  <a href="/#/internal/monitoringUnit/sre/cassandra">Cassandra Clusters</a>
                </li>
                <li>
                  <a href="/#/internal/monitoringUnit/sre/clickhouse">Clickhouse Clusters</a>
                </li>
                <li>
                  <a href="/#/internal/monitoringUnit/sre/elastic">Elastic Clusters</a>
                </li>
                <li>
                  <a href="/#/internal/monitoringUnit/sre/kafka">Kafka Clusters</a>
                </li>
              </ul>
            </Card>
          </Col>
        )}

        <Col lg={6}>
          <Row>
            <Col lg={12}>
              <Card title="This Unit">
                <ul className={locals.links}>
                  <li>
                    <a href="/#/internal/thisUnit/entityStatistics">Entity Statistics (Cockpit)</a>
                  </li>
                  <li>
                    <a href="/#/internal/thisUnit/agents">Agents</a>
                  </li>
                  <li>
                    <a href="/#/internal/thisUnit/graphExplorer">Graph Explorer</a>
                  </li>
                  <li>
                    <a href="/#/internal/thisUnit/snapshotVersions">Snapshot Versions</a>
                  </li>
                </ul>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card title="Links">
                <LinkList>
                  <LinkListItem
                    label="SaaS Monitoring Units"
                    description="These two units exist to monitor our own SaaS installations. They themselves are SaaS units."
                  >
                    <LinkList>
                      <LinkListItem
                        label="EU"
                        href="https://eu-instanaops.instana.io"
                        external
                        description="Unit monitoring the EU SaaS installation, as well as the environment-wide components Groundskeeper, Butler and CockroachDB."
                      />
                      <LinkListItem
                        label="US"
                        href="https://us-instanaops.instana.io"
                        external
                        description="Unit monitoring the US SaaS installation."
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
                        href="https://test-instana.instana.io"
                        external
                        description="Auto-deployed on every commit to the develop branches. This is the unit on which most of the engineering work is integrated first. Notoriously unstable due to the deployment frequency. Choose a different unit if possible."
                      />
                      <LinkListItem
                        label="Release"
                        href="https://release-instana.instana.io"
                        external
                        description="Auto-deployed from the release-XYZ branch on every commit. Mainly used as part of the release preparation, but also for hot-fixes."
                      />
                      <LinkListItem
                        label="Load"
                        href="https://load-instana.instana.io"
                        external
                        description="Used to execute load tests and other experiments. Typically used as part of the release preparation."
                      />
                    </LinkList>
                  </LinkListItem>

                  <LinkListItem
                    label="Demo Units"
                    description="These units are frequently used by the whole company for demo / presentation purposes."
                  >
                    <LinkList>
                      <LinkListItem
                        label="current"
                        href="https://current-instana.instana.io"
                        external
                        description="A SaaS demo unit running within the US."
                      />
                      <LinkListItem
                        label="current2"
                        href="https://current2-instana.instana.io"
                        external
                        description="A SaaS demo unit running within EU. This one is typically only used when 'current' is unavailable."
                      />
                    </LinkList>
                  </LinkListItem>

                  <LinkListItem
                    label="Kubernetes Based Units"
                    description="Kubernetes based environments are currently being build. They aren't yet ready to replace our day-to-day environments, but will be in the near future. Once they are ready they will replace the similarly named non-Kubernetes based units."
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
                    </LinkList>
                  </LinkListItem>
                </LinkList>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Fragment>
  );
}
