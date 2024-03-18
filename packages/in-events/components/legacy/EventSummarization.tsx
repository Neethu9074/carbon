/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo, useState } from 'react';

import { Card, Stack, SvgIcon, Typography, Pill, Link } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { Incident } from '@instana/types';
import { Button } from '@instana/legacy';
import { t } from '@instana/i18n-react';

import {
  incidentSummarizationFeedbackHelpfulTracker,
  incidentSummarizationFeedbackUnhelpfulTracker
} from 'in-events/tracker';
import { getEntityIdView, teamSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
//@ts-expect-error
import { getAlertChannelsInfosMutable } from 'in-api/alertChannels';
import EventSummaryCard from 'in-events/components/legacy/EventSummaryCard';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import Tooltip from 'in-components/Tooltip/Tooltip';
import List from 'in-settings/components/List';

import locals from 'in-events/components/legacy/EventSummary.mless';

interface EventSummarizationProps {
  title: string;
  incident: Incident;
}
interface BulletPointSummaryListProps {
  incidentSummary: IncidentSummaryType;
}

interface EventSummaryErrorMessageProps {
  title: string;
  description: string;
  tooltipDescription?: string;
}

interface IncidentSummaryType {
  severity?: string;
  metric?: string;
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

export default function EventSummarization({ title, incident }: EventSummarizationProps): JSX.Element {
  const incidentSummary = useMemo(() => extractSummaryFromIncident(incident), [incident]);
  const associatedChannelIds = useMemo(() => extractAlertChannelIdsFromIncident(incident), [incident]);

  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card
          title={title}
          leftHeaderContent={
            <Pill kind="primary" color={themes.default.ids.color.option.blue['500']}>
              {t('in-events:RCA.techPreview')}
            </Pill>
          }
        >
          <Stack gap="small">
            <Stack direction="horizontal">
              {Object.keys(incidentSummary).length > 0 && <BulletPointSummaryList incidentSummary={incidentSummary} />}
              {Object.keys(incidentSummary).length <= 0 && (
                <EventSummaryErrorMessage
                  title={t('in-events:incidentSummarization.errorTitle')}
                  description={t('in-events:incidentSummarization.errorDescription')}
                />
              )}
              {associatedChannelIds && Array.isArray(associatedChannelIds) && (
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

function BulletPointSummaryList({ incidentSummary }: BulletPointSummaryListProps): JSX.Element {
  return (
    <div className={locals.containerForIncidentSummaryBullets}>
      <Stack gap="small">
        {Object.keys(incidentSummary).map(summaryType => (
          //@ts-expect-error
          <EventSummaryCard content={incidentSummary[summaryType] || ''} summaryType={summaryType} />
        ))}
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

function extractSummaryFromIncident(incident: Incident): IncidentSummaryType {
  if (incident.metadata && incident.metadata.incidentSummary) {
    return incident.metadata.incidentSummary;
  } else {
    return {};
  }
}

function extractAlertChannelIdsFromIncident(incident: Incident): string[] | null {
  if (incident.metadata && incident.metadata.alertChannelIds) {
    return incident.metadata.alertChannelIds;
  } else {
    return null;
  }
}

function FeedbackComponent({ incident }: { incident: Incident }): JSX.Element {
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
