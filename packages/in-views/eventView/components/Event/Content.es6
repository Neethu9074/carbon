import React from 'react';

import AnalyzeIssueCallsButton from 'in-views/eventView/components/AnalyzeIssueCallsButton';
import EventDependecyGraph from 'in-views/eventView/components/EventDependecyGraph';
import ProblemDescription from 'in-views/eventView/components/ProblemDescription';
import EventTraces from 'in-views/eventView/components/EventTraces';
import EventChart from 'in-views/eventView/components/EventChart';
import Header from 'in-views/eventView/components/Event/Header';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import Section from 'in-views/eventView/components/Section';

import locals from './Content.mless';

export default function EventContent({ event }) {
  return (
    <div>
      <Header event={event} />

      <ProblemDescription event={event} sectionized className="in-event-view-event-content" />

      <Section>
        <div className={locals.chartWrapper}>
          <EventChart event={event} />
          {twoZeroModeEnabled && (
            <div className={locals.analyzeButtonWrapper}>
              <AnalyzeIssueCallsButton event={event} className={locals.spaceTop} />
            </div>
          )}
        </div>
      </Section>

      {!twoZeroModeEnabled && <EventTraces event={event} sectionized />}

      <EventDependecyGraph event={event} sectionized />
    </div>
  );
}
