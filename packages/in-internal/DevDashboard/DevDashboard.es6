import React from 'react';

import TimeZones from 'in-internal/DevDashboard/TimeZones';

export default function DevDashboard() {
  return (
    <div>
      <TimeZones />

      <ul>
        <li>
          <a href="/#/internal/fillerSpanProcessingStats">App 1.0 Data Processing</a>
        </li>
        <li>
          <a href="/#/internal/appdata">App 2.0 Data Processing</a>
        </li>
        <li>
          <a href="/#/internal/eumstats">Website Monitoring Processing</a>
        </li>
      </ul>
    </div>
  );
}
