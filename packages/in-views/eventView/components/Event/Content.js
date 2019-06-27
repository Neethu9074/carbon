import React, { Fragment } from 'react';

import EventSpecificationLink from 'in-views/eventView/components/Event/EventSpecificationLink';
import AnalyzeIssueCallsButton from 'in-views/eventView/components/AnalyzeIssueCallsButton';
import EventDependecyGraph from 'in-views/eventView/components/EventDependecyGraph';
import ProblemDescription from 'in-views/eventView/components/ProblemDescription';
import EventChart from 'in-views/eventView/components/EventChart';
import OfflineEventDescription from './OfflineEventDescription';
import Header from 'in-views/eventView/components/Event/Header';
import Section from 'in-views/eventView/components/Section';

import locals from './Content.mless';

export default function EventContent({ event }) {
  return (
    event && (
      <div>
        <Header event={event} />

        <Section>
          <div>
            <ProblemDescription event={event} className="in-event-view-event-content" />
            <EventSpecificationLink event={event} />
          </div>
        </Section>

        {isOfflineEvent(event) ? (
          <Section>
            <OfflineEventDescription event={event} />
          </Section>
        ) : (
          <Fragment>
            <Section>
              <div className={locals.chartWrapper}>
                <EventChart event={event} />
                <div className={locals.analyzeButtonWrapper}>
                  <AnalyzeIssueCallsButton event={event} className={locals.spaceTop} />
                </div>
              </div>
            </Section>

            <EventDependecyGraph event={event} sectionized />
          </Fragment>
        )}
      </div>
    )
  );
}

function isOfflineEvent(event) {
  return event.hasIn(['metadata', 'entityVerificationSnapshotId']);
}
