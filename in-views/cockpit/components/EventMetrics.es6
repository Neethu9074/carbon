import React from 'react';

import Metric from 'in-views/cockpit/components/Metric';
import { eventsInTimeframe$ } from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    eventsInTimeframe: eventsInTimeframe$
  },
  function EventMetrics({ eventsInTimeframe }) {
    return (
      <div>
        <Metric label="Objectives">
          {eventsInTimeframe.objectives.length}
        </Metric>
        <Metric label="Incidents">
          {eventsInTimeframe.incidents.length}
        </Metric>
        <Metric label="Issues">
          {eventsInTimeframe.issues.length}
        </Metric>
        <Metric label="Changes">
          {eventsInTimeframe.changes.length}
        </Metric>
      </div>
    );
  }
);
