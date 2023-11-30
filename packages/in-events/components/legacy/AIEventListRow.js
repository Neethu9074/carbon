/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { List, Map } from 'immutable';

import { Button, Card, Link, Message, Stack, SvgIcon, Typography } from '@instana/components';
import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  RCAFeedbackClosedManuallyTracker,
  RCAFeedbackNextTracker,
  RCAFeedbackSkipTracker,
  RCAFeedbackSubmitTracker,
  expandedRCAEventCardTracker,
  helpfulRCASuggestionTracker,
  unhelpfulRCASuggestionTracker
} from 'in-events/tracker';
import { default as EmptyStateMagnifyingGlass } from './assets/empty-state-magnifying-glass.svg';
import EventListPagination from 'in-components/EventListPagination/EventListPagination';
import { rcaStepConfig } from 'in-events/components/feedback/rcaStepConfig.tsx';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import { snapshotIdUrlParameter } from 'in-stores/snapshot/urlParameters';
import getApplication from 'in-applications/subscriptions/getApplication';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import EventListItem from 'in-events/components/legacy/EventListItem';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import EventFeedbackDialog from '../feedback/EventFeedbackDialog';
import { getSnapshotVersions } from 'in-stores/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import { rcaUIEnabled } from 'in-services/featureFlags';
import { setTimeConfig } from 'in-stores/time/config';
import { Row, Col } from 'in-components/layout/Grid';
import { getSnapshot } from 'in-stores/snapshot';
import { getEvent } from 'in-stores/events';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill';
import { useTheme } from 'in-themes';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

const endpointIDURLParameter = 'endpointId';
const serviceIDURLParameter = 'serviceId';
const appIDURLParameter = 'appId';

const defaultFeedbackState = { thumbsDown: false, thumbsUp: false };

export default function AIEventListRow({ title, incident, incidentHasRCAProperty, latestSnapshot }) {
  const theme = useTheme();
  // Holds map of { snapshot_ID: [event_id, event_id] }
  const rcaSnapshotMap = useMemo(
    () => extractProbableRootCauseFromIncident(incident, incidentHasRCAProperty, rcaUIEnabled),
    [incident, incidentHasRCAProperty]
  );

  // gets an array of snapshot_IDs [snapshot_ID_1, snapshot_ID_2 ...]
  const snapshots = useMemo(() => (rcaSnapshotMap ? Array.from(rcaSnapshotMap.keys()) : []), [rcaSnapshotMap]);

  // Selects a given snapshot ID
  const [currentRCAEntity, setCurrentRCAEntity] = useState(
    rcaSnapshotMap && rcaSnapshotMap.size > 0 ? snapshots[0] : null
  );

  //Pagination for different snapshots
  const [pageNum, setPageNum] = useState(1);

  // Holds the list of observables for RCA Events
  const [observablesList, setObservablesList] = useState(
    currentRCAEntity ? combineLatest(rcaSnapshotMap.get(currentRCAEntity).map(getEvent)).throttle(250) : null
  );
  const [feedbackState, setFeedbackState] = useState({ default: defaultFeedbackState });

  // generates a list of event information based on Observables
  const eventsRelatedToEntity =
    useObservable(currentRCAEntity ? observablesList : null, [currentRCAEntity, observablesList])?.sort(
      (a, b) => a.get('start') - b.get('start')
    ) ?? pendingResult;

  useEffect(() => {
    if (currentRCAEntity) setObservablesList(combineLatest(rcaSnapshotMap.get(currentRCAEntity).map(getEvent)));
  }, [currentRCAEntity, rcaSnapshotMap]);

  useEffect(() => {
    setCurrentRCAEntity(snapshots[pageNum - 1]);
  }, [pageNum, snapshots]);

  useEffect(() => {
    if (currentRCAEntity && !feedbackState[currentRCAEntity])
      setFeedbackState({ ...feedbackState, [currentRCAEntity]: defaultFeedbackState });
  }, [currentRCAEntity, feedbackState]);

  if (!currentRCAEntity) {
    return (
      <Row withoutSideMargin>
        <Col xs>
          <Card
            title={title}
            leftHeaderContent={
              <Tooltip align="rightTop" content={t('in-events:RCA.performanceConstantlyEvaluated')}>
                <div>
                  <Pill kind="primary" color={theme.ids.color.option.blue['500']}>
                    {t('in-events:RCA.experimental')}
                  </Pill>
                </div>
              </Tooltip>
            }
            rightHeaderContent={<Message className={locals.rcaAIMessage} title={t('in-events:RCA.AIGenBadgeText')} />}
          >
            <RCAErrorMessage
              title={t('in-events:RCA.noEntitiesErrorTitle')}
              description={t('in-events:RCA.noEntitiesErrorDescription')}
            />
            <FeedbackComponent
              feedbackState={feedbackState}
              setFeedbackState={setFeedbackState}
              currentEntity={currentRCAEntity ?? 'default'}
              incident={incident}
            />
          </Card>
        </Col>
      </Row>
    );
  }

  if (eventsRelatedToEntity?.progress?.loading || !eventsRelatedToEntity)
    return (
      <Row withoutSideMargin>
        <Col xs>
          <Card
            title={title}
            leftHeaderContent={
              <Tooltip align="topRight" content={t('in-events:RCA.performanceConstantlyEvaluated')}>
                <Pill kind="primary" color={theme.ids.color.option.blue['500']}>
                  {t('in-events:RCA.experimental')}
                </Pill>
              </Tooltip>
            }
            rightHeaderContent={<Message className={locals.rcaAIMessage} title={t('in-events:RCA.AIGenBadgeText')} />}
          >
            <LoadingIndicator />
          </Card>
        </Col>
      </Row>
    );

  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card
          title={title}
          leftHeaderContent={
            <Tooltip align="topRight" content={t('in-events:RCA.performanceConstantlyEvaluated')}>
              <Pill kind="primary" color={theme.ids.color.option.blue['500']}>
                {t('in-events:RCA.experimental')}
              </Pill>
            </Tooltip>
          }
          rightHeaderContent={<Message className={locals.rcaAIMessage} title={t('in-events:RCA.AIGenBadgeText')} />}
        >
          <Stack direction="vertical" gap="medium">
            <div className={locals.timeline}>
              {(eventsRelatedToEntity?.progress?.loading || !eventsRelatedToEntity) && <LoadingIndicator />}
              {eventsRelatedToEntity &&
                incident &&
                incident.get('metadata')?.get('probableRootCauseSnapshotMetadata')?.get(currentRCAEntity) && (
                  <RootCauseEntityDetails
                    selectedSnapshotMetadata={incident
                      .get('metadata')
                      .get('probableRootCauseSnapshotMetadata')
                      .get(currentRCAEntity)}
                    eventsRelatedToEntity={eventsRelatedToEntity}
                  />
                )}

              {eventsRelatedToEntity?.map(_event => (
                <div onClick={expandedRCAEventCardTracker}>
                  <EventListItem
                    key={_event.get('id')}
                    triggeringProblemId={eventsRelatedToEntity.length > 0 && eventsRelatedToEntity[0].get('id')}
                    event={_event}
                    latestSnapshot={latestSnapshot}
                    isRCA
                  />
                </div>
              ))}
            </div>
            <Stack direction="horizontal" distribution="spaceBetween">
              <FeedbackComponent
                feedbackState={feedbackState}
                setFeedbackState={setFeedbackState}
                incident={incident}
                snapshotMetadata={
                  incident.get('metadata')?.get('probableRootCauseSnapshotMetadata')?.get(currentRCAEntity) ?? null
                }
                currentEntity={currentRCAEntity ?? 'default'}
              />
              <EventListPagination
                pageNum={pageNum}
                numPages={rcaSnapshotMap ? Array.from(rcaSnapshotMap.keys()).length : null}
                setPageNum={setPageNum}
              />
            </Stack>
          </Stack>
        </Card>
      </Col>
    </Row>
  );
}

function FeedbackComponent({ feedbackState, setFeedbackState, incident, snapshotMetadata, currentEntity }) {
  const theme = useTheme();
  useEffect(() => {
    if (feedbackState[currentEntity] && feedbackState[currentEntity].thumbsDown) {
      addActiveDialog(
        <EventFeedbackDialog
          stepConfig={rcaStepConfig}
          nextStepTracker={RCAFeedbackNextTracker}
          skipStepTracker={RCAFeedbackSkipTracker}
          closedManuallyTracker={RCAFeedbackClosedManuallyTracker}
          submitTracker={RCAFeedbackSubmitTracker}
          submitMetadata={extractFeedbackMetadataFromIncident(incident, snapshotMetadata)}
        />
      );
    }
  }, [feedbackState, incident, snapshotMetadata, currentEntity]);
  /*
{'default': {thumbsUp: false, thumbsDown: false}}
*/
  return (
    <Stack direction="horizontal" gap="small" align="center">
      {feedbackState[currentEntity]?.thumbsDown || feedbackState[currentEntity]?.thumbsUp ? (
        <Typography variant="body-small">{t('in-events:RCA.thankYouForYourFeedback')}</Typography>
      ) : (
        <Typography variant="body-small">{t('in-events:RCA.suggestionHelpfulText')}</Typography>
      )}
      <Button
        kind="subtle"
        // I acknowledge this isn't ideal but we will release a preliminary version and a discussion will take place to find a new way to do this
        //TODO: Find an alternative to this (i.e. bring in a filled in thumbs up icon)
        style={
          feedbackState[currentEntity]?.thumbsUp ? { background: `${theme.ids.color.option.neutral[300]}` } : undefined
        }
        size="compact"
        icon={'lib_thumbs_up'}
        iconSize="s"
        onClick={() => {
          helpfulRCASuggestionTracker();
          if (feedbackState[currentEntity]?.thumbsUp) {
            setFeedbackState({ ...feedbackState, [currentEntity]: defaultFeedbackState });
          } else {
            setFeedbackState({ ...feedbackState, [currentEntity]: { ...defaultFeedbackState, thumbsUp: true } });
          }
        }}
      />
      <Button
        kind="subtle"
        // I acknowledge this isn't ideal but we will release a preliminary version and a discussion will take place to find a new way to do this
        //TODO: Find an alternative to this (i.e. bring in a filled in thumbs down icon)
        style={
          feedbackState[currentEntity]?.thumbsDown
            ? { background: `${theme.ids.color.option.neutral[300]}` }
            : undefined
        }
        size="compact"
        iconSize="s"
        icon={'lib_thumbs_down'}
        onClick={() => {
          unhelpfulRCASuggestionTracker();
          if (feedbackState[currentEntity]?.thumbsDown) {
            setFeedbackState({ ...feedbackState, [currentEntity]: defaultFeedbackState });
          } else {
            setFeedbackState({ ...feedbackState, [currentEntity]: { ...defaultFeedbackState, thumbsDown: true } });
          }
        }}
      />
    </Stack>
  );
}

function RCAErrorMessage({ title, description, tooltipDescription }) {
  const theme = useTheme();
  return (
    <Stack direction="horizontal" gap="small" distribution="center">
      <img className={locals.errorImg} src={EmptyStateMagnifyingGlass} />
      <Stack direction="vertical" gap="xxsmall">
        <Typography variant="heading-200">{title}</Typography>
        <Stack direction="horizontal" gap="xxsmall">
          <Typography variant="body-regular">{description}</Typography>
          {tooltipDescription && (
            <Tooltip align="rightMiddle" content={tooltipDescription}>
              <SvgIcon type="lib_help_error_help_outline" size="s" color={theme.ids.color.option.neutral['700']} />
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

function extractFeedbackMetadataFromIncident(incident, snapshotMetadata) {
  let entityType = '';

  const metrics = incident.get('metadata')?.get('metrics') ?? new List();

  const metricInfo = metrics
    .map(metricObject => {
      return metricObject.get('metricName');
    })
    .toArray();
  if (snapshotMetadata && snapshotMetadata.has('EntityType')) entityType = snapshotMetadata.get('EntityType');

  return { entityType, metricInfo };
}

// Eventually should be directly retrieved once all RCA inclusive events don't use the old data structure anymore
// See https://github.ibm.com/instana/ui-client/pull/13705
function extractProbableRootCauseFromIncident(incident, incidentHasRCAProperty, rcaUIEnabled) {
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

function useGenerateLinksForEntity(entityType, originalID, location) {
  const { createHref } = useNavigation();

  const query = { ...location.query };
  const matrixParam = {};
  let pathname = '';

  if (entityType === 'infrastructure' || entityType === 'process') {
    query[snapshotIdUrlParameter.name] = originalID;
    pathname = '/physical/dashboard';
  } else if (entityType === 'endpoint') {
    pathname = '/endpoint/summary';
    matrixParam['/endpoint'] = { [endpointIDURLParameter]: originalID };
  } else if (entityType === 'service') {
    pathname = '/service/summary';
    matrixParam['/service'] = { [serviceIDURLParameter]: originalID };
    //query[serviceIDURLParameter] = originalID;
  } else if (entityType === 'application') {
    pathname = '/application/summary';
    matrixParam['/application'] = { [appIDURLParameter]: originalID };
  }

  if (pathname !== '') {
    return createHref({
      ...location,
      pathname,
      query,
      matrix: matrixParam
    });
  }
}

function RootCauseEntityDetails({ selectedSnapshotMetadata, eventsRelatedToEntity }) {
  const [query, setQuery] = useState(null);
  const theme = useTheme();
  const { location } = useNavigation();
  const entityType = selectedSnapshotMetadata.get('EntityType');
  const originalID = selectedSnapshotMetadata.get('UntransformedEntityID');
  const urlForEntity = useGenerateLinksForEntity(entityType, originalID, location);

  // generates a list of event information based on Observables
  const entityInformation = useObservable(query, [query], { resetStateOnObservableChange: true }) ?? null;

  useEffect(() => {
    if (entityType === 'infrastructure' || entityType === 'process') {
      // Need to get snapshot versions first and then retrieve appropriate snapshot
      setQuery(
        getSnapshotVersions(originalID).map(versions => {
          if (List.isList(versions)) {
            const snapVersions = versions.toJS();
            if (snapVersions.length > 0) {
              const { to, from } = snapVersions[snapVersions.length - 1];

              const timeConfigFromSnapVersion = {
                windowSize: (to || Date.now()) - from,
                to,
                focusedMoment: to
              };
              setTimeConfig(location, timeConfigFromSnapVersion);
              setQuery(getSnapshot(originalID, timeConfigFromSnapVersion));
            }
          }
        })
      );
    } else if (entityType === 'endpoint') {
      setQuery(getEndpointInfo({ id: originalID }).map(data => data.data));
    } else if (entityType === 'service') {
      setQuery(getServiceLabel({ id: originalID }).map(data => data.data));
    } else if (entityType === 'application') {
      setQuery(getApplication({ id: originalID }).map(data => data.data));
    }
  }, [originalID, entityType, selectedSnapshotMetadata, location]);

  if (entityInformation === null || (entityInformation?.progress && entityInformation.progress?.loading)) {
    return <LoadingIndicator />;
  }

  return (
    <div className={locals.entityDescription}>
      <Stack gap="small">
        <Stack direction="horizontal" gap="small" align="center">
          <Typography variant="body-bold">{t('in-events:RCA.probableRootCauseLabel')}</Typography>
          {entityInformation !== null && (
            <Link href={urlForEntity}>
              <Stack direction="horizontal" align="center" gap="xxsmall">
                <SvgIcon type={getIcon(entityType)} color={theme.cds.link.primary} />
                {Map.isMap(entityInformation) ? entityInformation?.get('label') : entityInformation?.label}
              </Stack>
            </Link>
          )}
        </Stack>

        <Typography variant="body-regular">
          {t('in-events:RCA.relatedEventsLabel', {
            number_of_events: Array.isArray(eventsRelatedToEntity) ? eventsRelatedToEntity.length : 0
          })}
        </Typography>
      </Stack>
    </div>
  );
}

function getIcon(entityType) {
  if (entityType === 'infrastructure') {
    return 'lib_infrastructure';
  } else if (entityType === 'process') {
    return 'lib_infra_process';
  } else if (entityType === 'endpoint') {
    return 'lib_infra_endpoint';
  } else if (entityType === 'service') {
    return 'lib_infra_service';
  } else if (entityType === 'application') {
    return 'lib_application';
  } else {
    return 'lib_infra_unknownIcon';
  }
}
