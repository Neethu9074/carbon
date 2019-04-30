import React, { Fragment } from 'react';

import { internalMonitoringUnit } from 'in-services/featureFlags';
import TimeZones from 'in-internal/components/TimeZones';
import { Row, Col } from 'in-new-components/layout/Grid';

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
            <h3>Unit Insights</h3>
            <ul className={locals.links}>
              <li>
                <a href="/#/internal/monitoringUnit/units">Units</a>
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
                    <a href="/#/internal/monitoringUnit/tracesSubscriptionStats">App 1.0 Traces Subscriptions Report</a>
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
                <a href="/#/internal/monitoringUnit/sre/workerStats">Worker Allocation / Load</a>
              </li>
              <li>
                <a href="/#/internal/monitoringUnit/sre/selfserviceWorkerStats">Selfservice Worker Allocation / Load</a>
              </li>
              <li>
                <a href="/#/internal/monitoringUnit/sre/cassandra">Cassandra Clusters</a>
              </li>
              <li>
                <a href="/#/internal/monitoringUnit/sre/elastic">Elastic Clusters</a>
              </li>
              <li>
                <a href="/#/internal/monitoringUnit/sre/clickhouse">Clickhouse Cluster</a>
              </li>
              <li>
                <a href="/#/internal/monitoringUnit/sre/acceptors">Acceptors</a>
              </li>
            </ul>
          </Col>
        )}

        <Col lg={6}>
          <h2>Data About This Unit</h2>
          <ul className={locals.links}>
            <li>
              <a href="/#/internal/thisUnit/entityStatistics">Entity Statistics (Cockpit)</a>
            </li>
            <li>
              <a href="/#/internal/thisUnit/graphExplorer">Graph Explorer</a>
            </li>
            <li>
              <a href="/#/internal/thisUnit/snapshotVersions">Snapshot Versions</a>
            </li>
          </ul>
        </Col>
      </Row>
    </Fragment>
  );
}
