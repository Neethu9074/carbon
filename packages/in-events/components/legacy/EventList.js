/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { List, Map } from 'immutable';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';

import {
  isApplicationSmartAlertEvent,
  isWebsiteSmartAlertEvent,
  isMobileAppSmartAlertEvent
} from 'in-events/components/eventUtil';
import AssociatedAndRecommendedActions from 'in-automation/AssociatedActions/AssociatedAndRecommendedActions';
import { actionAutomationEnabled, rcaUIEnabled } from 'in-services/featureFlags';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import AIEventListRow from 'in-events/components/legacy/AIEventListRow';
import EventListItem from 'in-events/components/legacy/EventListItem';
import { emptyList } from 'in-services/fixedImmutables';
import { Row, Col } from 'in-components/layout/Grid';
import { getEvent } from 'in-stores/events';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function IncidentEventList({ incident, latestSnapshot, snapshot }) {
  const events =
    useObservable(
      combineLatest(incident.get('recentEvents', emptyList).toArray().map(getEvent))
        .map(events =>
          events
            .filter(e => e && !e.isEmpty())
            .sort(
              (a, b) =>
                incident.getIn(['issueOrderMap', a.get('id')], a.get('start')) -
                incident.getIn(['issueOrderMap', b.get('id')], b.get('start'))
            )
        )
        .throttle(250),
      [incident]
    ) ?? null;
  const incidentHasRCAProperty = useMemo(() => incident.get('metadata').has('probableRootCause'), [incident]);

  const rcaSnapshotMap = useMemo(
    () => extractProbableRootCauseFromIncident(incident, incidentHasRCAProperty, rcaUIEnabled),
    [incident, incidentHasRCAProperty]
  ); // Holds map of { snapshot_ID: [event_id, event_id] }

  const snapshots = useMemo(() => (rcaSnapshotMap ? Array.from(rcaSnapshotMap.keys()) : []), [rcaSnapshotMap]); // gets an array of snapshot_IDs [snapshot_ID_1, snapshot_ID_2 ...]

  const [currentRCAEntity, setCurrentRCAEntity] = useState(
    rcaSnapshotMap && rcaSnapshotMap.size > 0 ? snapshots[0] : null
  ); // Selects a given snapshot ID
  const [pageNum, setPageNum] = useState(1); // Pagination
  const [observablesList, setObservablesList] = useState(
    currentRCAEntity ? combineLatest(rcaSnapshotMap.get(currentRCAEntity).map(getEvent)).throttle(250) : null
  ); // Gets an array of event Observable requests based on the selected rca entity

  const eventTests = useObservable(observablesList, [currentRCAEntity, observablesList]) ?? []; // generates a list of event information based on Observables

  useEffect(() => {
    if (currentRCAEntity) {
      const rcaEventList = rcaSnapshotMap.get(currentRCAEntity);
      if (rcaEventList.length > 0) {
        setObservablesList(combineLatest(rcaSnapshotMap.get(currentRCAEntity).map(getEvent)));
      } else {
        setObservablesList(null);
      }
    }
  }, [currentRCAEntity, rcaSnapshotMap]);

  useEffect(() => {
    setCurrentRCAEntity(snapshots[pageNum - 1]);
  }, [pageNum, snapshots]);

  if (!events) {
    return <ListRow title={t('in-events:titleTriggerEvent')} />;
  }
  const triggeringProblemId = incident.getIn(['problem', 'id']);

  const isTriggeringEvent = ev => ev.getIn(['problem', 'id']) === triggeringProblemId;
  const triggerEvent = events.find(isTriggeringEvent);

  const RegenerateButtonOnClick = () => {
    setPageNum(pageNum);
  };

  return (
    <>
      {eventTests && incidentHasRCAProperty && rcaUIEnabled && (
        <AIEventListRow
          title={t('in-events:RCA.titlePRCA')}
          events={Array.isArray(eventTests) ? eventTests.sort((a, b) => a.get('start') - b.get('start')) : []}
          triggeringProblemId={eventTests.length > 0 && eventTests[0] && eventTests[0].get('id')}
          latestSnapshot={latestSnapshot}
          isRCA={incidentHasRCAProperty}
          rcaSnapshotID={currentRCAEntity}
          RegenerateComponentOnClick={RegenerateButtonOnClick}
          pageNum={pageNum}
          totalPages={rcaSnapshotMap ? Array.from(rcaSnapshotMap.keys()).length : null}
          setPageNum={setPageNum}
        />
      )}

      <ListRow
        title={t('in-events:titleTriggerEvent')}
        events={events.filter(isTriggeringEvent)}
        triggeringProblemId={triggeringProblemId}
        latestSnapshot={latestSnapshot}
      />
      <ListRow
        title={t('in-events:titleRelatedEvents', {
          eventCount: events.length - 1
        })}
        events={events.filter(ev => !isTriggeringEvent(ev))}
        triggeringProblemId={triggeringProblemId}
        latestSnapshot={latestSnapshot}
      />
      {actionAutomationEnabled &&
        role.canConfigureAutomationActions &&
        role.canConfigureCustomAlerts &&
        !isWebsiteSmartAlertEvent(triggerEvent) &&
        !isApplicationSmartAlertEvent(triggerEvent) &&
        !isMobileAppSmartAlertEvent(triggerEvent) && (
          <AssociatedAndRecommendedActions
            associatedActionsTitle={t('in-events:associatedActionsForTriggeringEvent')}
            volatileId={snapshot?.get('volatileId')?.toJS() ?? {}}
            event={triggerEvent?.toJS()}
          />
        )}
    </>
  );
}

function ListRow({ title, events, triggeringProblemId, latestSnapshot }) {
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card title={title}>
          {!events && <LoadingIndicator />}
          {events?.map(_event => (
            <EventListItem
              key={_event.get('id')}
              triggeringProblemId={triggeringProblemId}
              event={_event}
              latestSnapshot={latestSnapshot}
            />
          ))}
        </Card>
      </Col>
    </Row>
  );
}

function extractProbableRootCauseFromIncident(incident, incidentHasRCAProperty, rcaUIEnabled) {
  //    () => (rcaUIEnabled && incidentHasRCAProperty ? incident.get('metadata').get('probableRootCause') || null : null),
  if (!rcaUIEnabled || !incidentHasRCAProperty) return null;

  const probableRootCauseFromIncident = incident.get('metadata').get('probableRootCause');
  if (Array.isArray(probableRootCauseFromIncident)) {
    return probableRootCauseFromIncident;
  } else if (List.isList(probableRootCauseFromIncident)) {
    let probableRootCauseWithSnapshotIDsAsKeys = Map();

    probableRootCauseFromIncident.forEach(snapshot => {
      if (!snapshot || !snapshot.has('RCASnapshotID') || !snapshot.has('rcaEvents')) return null;

      const rcaEvents = snapshot.get('rcaEvents').toArray();
      let snapshotID = '';

      if (List.isList(snapshot.get('RCASnapshotID'))) {
        snapshotID = snapshot.get('RCASnapshotID').first();
      }
      probableRootCauseWithSnapshotIDsAsKeys = probableRootCauseWithSnapshotIDsAsKeys.set(snapshotID, rcaEvents);
    });
    return probableRootCauseWithSnapshotIDsAsKeys;
  }
}
