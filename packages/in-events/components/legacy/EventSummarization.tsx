/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Map, List as ImmutableList } from 'immutable';
import React, { useMemo, useState } from 'react';

import { Button, Card, Stack, SvgIcon, Typography, Pill, Link } from '@instana/components';
import { Snapshot, TimeConfig } from '@instana/types';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { Trans, t } from '@instana/i18n-react';

import {
  incidentSummarizationFeedbackHelpfulTracker,
  incidentSummarizationFeedbackUnhelpfulTracker
} from 'in-events/tracker';
//@ts-expect-error
import { getTimeConfigForSnapshotRetrieval } from 'in-events/components/eventUtil';
import { getEntityIdView, teamSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
//@ts-expect-error
import { getAlertChannelsInfosMutable } from 'in-api/alertChannels';
import EventEntityDetails from 'in-events/components/legacy/EventEntityDetails';
import EventSummaryCard from 'in-events/components/legacy/EventSummaryCard';
//@ts-expect-error
import { getEvent } from 'in-stores/events';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import Tooltip from 'in-components/Tooltip/Tooltip';
import List from 'in-settings/components/List';
import { EventOrMap } from 'in-events/types';

import locals from 'in-events/components/legacy/EventSummary.mless';

interface EventSummarizationProps {
  title: string;
  incident: EventOrMap;
  latestSnapshot: Snapshot;
}
interface BulletPointSummaryListProps {
  timeConfig: TimeConfig;
  incidentSummary: Map<string, string | Map<string, string>>;
  triggeringEvent: EventOrMap | null | {};
}

interface EventSummaryErrorMessageProps {
  title: string;
  description: string;
  tooltipDescription?: string;
}

interface FeedbackState {
  thumbsUp: boolean;
  thumbsDown: boolean;
}

const columnDefinitionsForAlertChannels = [
  {
    id: 'name',
    label: t('in-settings:tabs.name'),
    getContent: (entity: any) => (
      <Link href={getEntityIdView(teamSettingsAlertingAlertChannels, entity.id)} ellipsis>
        {entity.name}
      </Link>
    )
  },
  {
    id: 'kind',
    label: t('in-settings:tabs.type'),
    getContent: (entity: any) => entity.kind
  }
];

export default function EventSummarization({ title, incident, latestSnapshot }: EventSummarizationProps): JSX.Element {
  const incidentSummary = useMemo(() => extractSummaryFromIncident(incident), [incident]);
  const associatedChannelIds = useMemo(() => extractAlertChannelIdsFromIncident(incident), [incident]);

  const triggeringEvent = useObservable(getEvent(incident.getIn(['triggeringEvent'], '')), [incident, title]) ?? null;
  const timeConfigFromEvent = triggeringEvent
    ? getTimeConfigForSnapshotRetrieval(triggeringEvent as EventOrMap, latestSnapshot)
    : null;
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card
          title={title}
          leftHeaderContent={
            <Pill kind="primary" color={themes.default.ids.color.option.blue['500']}>
              {t('in-events:notes.techPreview')}
            </Pill>
          }
        >
          <Stack gap="small">
            <Stack direction="horizontal">
              {incidentSummary && incidentSummary.size > 0 && (
                <BulletPointSummaryList
                  incidentSummary={incidentSummary}
                  timeConfig={timeConfigFromEvent}
                  triggeringEvent={triggeringEvent}
                />
              )}
              {incidentSummary && incidentSummary.size <= 0 && (
                <EventSummaryErrorMessage
                  title={t('in-events:incidentSummarization.errorTitle')}
                  description={t('in-events:incidentSummarization.errorDescription')}
                />
              )}
              {associatedChannelIds && (
                <div className={locals.alertChannelsList}>
                  <List
                    title={t('in-events:incidentSummarization.alertChannelTableTitle')}
                    getHeader={() => (
                      <Typography variant="heading-200">
                        {t('in-events:incidentSummarization.alertChannelTableTitle')}
                      </Typography>
                    )}
                    columnDefinitions={columnDefinitionsForAlertChannels}
                    loadEntities={() =>
                      associatedChannelIds.length > 0
                        ? getAlertChannelsInfosMutable(associatedChannelIds)
                        : alwaysEmptyArray
                    }
                    initialOrderBy="name"
                    pageSize={2}
                    noDataMessage={t('in-events:incidentSummarization.noDataAlertChannels')}
                  />
                </div>
              )}
            </Stack>
            <FeedbackComponent incident={incident} />
          </Stack>
        </Card>
      </Col>
    </Row>
  );
}

function BulletPointSummaryList({
  incidentSummary,
  timeConfig,
  triggeringEvent
}: BulletPointSummaryListProps): JSX.Element {
  const actionKey = 'action';
  const hasAction = incidentSummary.has(actionKey);
  const actionMap = incidentSummary.get(actionKey, Map()) as Map<string, string>;

  return (
    <div className={locals.containerForIncidentSummaryBullets}>
      <Stack gap="small">
        <EventSummaryCard summaryType="topology">
          {triggeringEvent && (
            <div>
              {t('in-events:titleIncidentTriggeredBy')}
              <EventEntityDetails
                triggeringEvent={triggeringEvent as EventOrMap}
                timeConfig={timeConfig}
                shouldDisplayDefaultLabel={false}
              />
            </div>
          )}
        </EventSummaryCard>
        {hasAction && (
          <EventSummaryCard summaryType={actionKey}>
            <Typography variant="body-regular">
              <Trans
                i18nKey={'in-events:incidentSummarization.actionText'}
                values={{
                  timeWindow: actionMap.get('timeWindow', 'Unknown'),
                  timeWindowFormat: actionMap.get('timeWindowFormat', ''),
                  eventSpecId: actionMap.get('eventSpecId', ''),
                  actionStats: actionMap.get('actionStats', '')
                }}
              />
            </Typography>
          </EventSummaryCard>
        )}
        {incidentSummary
          .keySeq()
          .filter(sType => sType !== actionKey)
          .map(
            summaryType =>
              summaryType && (
                <EventSummaryCard summaryType={summaryType}>
                  <Typography variant="body-regular">{incidentSummary.get(summaryType, '')}</Typography>
                </EventSummaryCard>
              )
          )}
      </Stack>
    </div>
  );
}

function EventSummaryErrorMessage({
  title,
  description,
  tooltipDescription
}: EventSummaryErrorMessageProps): JSX.Element {
  return (
    <Stack direction="horizontal" gap="small" distribution="center">
      <Stack direction="vertical" gap="xxsmall">
        <Typography variant="heading-200">{title}</Typography>
        <Stack direction="horizontal" gap="xxsmall">
          <Typography variant="body-regular">{description}</Typography>
          {tooltipDescription && (
            <Tooltip align="rightMiddle" content={tooltipDescription}>
              <SvgIcon
                type="lib_help_error_help_outline"
                size="s"
                color={themes.default.ids.color.option.neutral['700']}
              />
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

function extractSummaryFromIncident(incident: EventOrMap): Map<string, string> | null {
  return incident.getIn(['metadata', 'incidentSummary'], null);
}

function extractAlertChannelIdsFromIncident(incident: EventOrMap): string[] | null {
  const alertChannelIds = incident.getIn(['metadata', 'alertChannelIds'], null);
  if (ImmutableList.isList(alertChannelIds)) return (alertChannelIds as ImmutableList<string>).toArray();
  return alertChannelIds;
}

function FeedbackComponent({ incident }: { incident: EventOrMap }): JSX.Element {
  const [feedbackState, setFeedbackState] = useState<FeedbackState>({ thumbsDown: false, thumbsUp: false });
  return (
    <Stack direction="horizontal" gap="small" align="center">
      {feedbackState.thumbsUp || feedbackState.thumbsDown ? (
        <Typography variant="body-small" align="center">
          {t('in-events:thankYouForYourFeedback')}
        </Typography>
      ) : (
        <Typography variant="body-small">{t('in-events:incidentSummarization.summarizationHelpfulText')}</Typography>
      )}

      <Button
        kind="subtle"
        size="compact"
        style={feedbackState.thumbsUp ? { background: themes.default.ids.color.option.neutral['300'] } : undefined}
        onClick={() => {
          setFeedbackState({ thumbsDown: false, thumbsUp: true });
          incidentSummarizationFeedbackHelpfulTracker(incident);
        }}
      >
        <SvgIcon type="lib_thumbs_up" size="s" />
      </Button>
      <Button
        kind="subtle"
        size="compact"
        style={feedbackState.thumbsDown ? { background: themes.default.ids.color.option.neutral['300'] } : undefined}
        onClick={() => {
          setFeedbackState({ thumbsDown: true, thumbsUp: false });
          incidentSummarizationFeedbackUnhelpfulTracker(incident);
        }}
      >
        <SvgIcon type="lib_thumbs_down" size="s" />
      </Button>
    </Stack>
  );
}
