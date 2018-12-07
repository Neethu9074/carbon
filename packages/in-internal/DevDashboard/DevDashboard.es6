import React from 'react';

import TimeZones from 'in-internal/DevDashboard/TimeZones';

import locals from './DevDashboard.mless';

export default function DevDashboard() {
  return (
    <div className={locals.wrapper}>
      <TimeZones />

      <h3>SLO</h3>
      <ul className={locals.links}>
        <li>
          <a href="/#/cockpit">Cockpit</a>
        </li>
        <li>
          <a href="/#/events;view=issue?timeline.to&timeline.ws=900000&_k=0p6luz&q=(event.text%3A&quot;%5BSLO%5D&quot;%20OR%20event.text%3A&quot;%5Bexperimental%20SLO%5D&quot;)%20AND%20event.state%3Aopen%20&v2=true">
            SLO Violations
          </a>
        </li>
        <li>
          <a href="https://github.com/instana/internal-tools/tree/master/objectives">SLO Definitions</a>
        </li>
      </ul>

      <h3>Processing</h3>
      <ul className={locals.links}>
        <li>
          <span className={locals.subTitle}>App 1.0</span>
          <ul className={locals.links}>
            <li>
              <a href="/#/internal/fillerSpanProcessingStats">App 1.0 Data Processing</a>
            </li>
            <li>
              <a href="/#/internal/tracesSubscriptionStats">App 1.0 Traces Subscriptions Report</a>
            </li>
          </ul>
        </li>

        <li>
          <span className={locals.subTitle}>App 2.0</span>
          <ul className={locals.links}>
            <li>
              <a href="/#/internal/appdataProcessing">App 2.0 Data Processing</a>
            </li>
            <li>
              <a href="/#/internal/appdata">App 2.0 Data Reading & Writing</a>
            </li>
            <li>
              <a href="/#/internal/appDataQueryPerformance">App 2.0 Query Performance</a>
            </li>
          </ul>
        </li>

        <li>
          <span className={locals.subTitle}>EUM</span>
          <ul className={locals.links}>
            <li>
              <a href="/#/internal/eum">Overview</a>
            </li>
            <li>
              <a href="/#/internal/eum/eum-acceptor">eum-acceptor (data collection)</a>
            </li>
            <li>
              <a href="/#/internal/eum/eum-processor">eum-processor (data processing)</a>
            </li>
            <li>
              <a href="/#/internal/eum/appdata-writer">appdata-writer (data ingestion)</a>
            </li>
          </ul>
        </li>
      </ul>

      <h3>SRE</h3>
      <ul className={locals.links}>
        <li>
          <a href="/#/internal/sre/workerStats">Worker Allocation / Load</a>
        </li>
        <li>
          <a href="/#/internal/sre/selfserviceWorkerStats">Selfservice Worker Allocation / Load</a>
        </li>
        <li>
          <a href="/#/internal/sre/cassandra">Cassandra Clusters</a>
        </li>
        <li>
          <a href="/#/internal/sre/acceptors">Acceptors</a>
        </li>
      </ul>
    </div>
  );
}
