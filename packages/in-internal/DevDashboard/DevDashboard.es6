import React from 'react';

import TimeZones from 'in-internal/DevDashboard/TimeZones';

import locals from './DevDashboard.mless';

export default function DevDashboard() {
  return (
    <div>
      <TimeZones />

      <ul className={locals.links}>
        <li>
          <a href="/#/events;view=issue?timeline.to&timeline.ws=900000&_k=0p6luz&q=(event.text%3A&quot;%5BSLO%5D&quot;%20OR%20event.text%3A&quot;%5Bexperimental%20SLO%5D&quot;)%20AND%20event.state%3Aopen%20&v2=true">
            SLO Violations
          </a>
        </li>
        <li>
          <a href="https://github.com/instana/internal-tools/tree/master/objectives">SLO Definitions</a>
        </li>
        <li>
          <a href="/#/internal/fillerSpanProcessingStats">App 1.0 Data Processing</a>
        </li>
        <li>
          <a href="/#/internal/tracesSubscriptionStats">App 1.0 Traces Subscriptions Report</a>
        </li>
        <li>
          <a href="/#/internal/appdataProcessing">App 2.0 Data Processing</a>
        </li>
        <li>
          <a href="/#/internal/appdata">App 2.0 Data Reading & Writing</a>
        </li>
        <li>
          <a href="/#/internal/appDataQueryPerformance">App 2.0 Query Performance</a>
        </li>
        <li>
          <a href="/#/internal/eumstats">Website Monitoring Processing</a>
        </li>
        <li>
          <a href="/#/internal/qualityOfServiceStats">Quality Of Service - Fleet Worker</a>
        </li>
        <li>
          <a href="/#/internal/selfServiceQualityOfServiceStats">Quality Of Service - SelfService Fleet Worker</a>
        </li>
      </ul>
    </div>
  );
}
