/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo, useState } from 'react';

import { Button, Card, Stack, SvgIcon, Typography, Pill } from '@instana/components';
import { Incident } from '@instana/types';
import { t } from '@instana/i18n-react';

//@ts-expect-error
import { default as EmptyStateMagnifyingGlass } from 'in-events/components/legacy/assets/empty-state-magnifying-glass.svg';
import {
  incidentSummarizationFeedbackHelpfulTracker,
  incidentSummarizationFeedbackUnhelpfulTracker
} from 'in-events/tracker';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { useTheme } from 'in-themes';

import locals from 'in-events/components/legacy/EventList.mless';

interface EventSummarizationProps {
  title: string;
  incident: Incident;
}
interface BulletPointSummaryListProps {
  incidentSummary: string[];
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

export default function EventSummarization({ title, incident }: EventSummarizationProps): JSX.Element {
  const incidentSummary = useMemo(() => extractSummaryFromIncident(incident), [incident]);
  const theme = useTheme();

  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card
          title={title}
          leftHeaderContent={
            <Pill kind="primary" color={theme.ids.color.option.blue['500']}>
              {t('in-events:RCA.techPreview')}
            </Pill>
          }
        >
          <Stack>
            {incidentSummary.length > 0 && <BulletPointSummaryList incidentSummary={incidentSummary} />}
            {incidentSummary.length <= 0 && (
              <EventSummaryErrorMessage
                title={t('in-events:incidentSummarization.errorTitle')}
                description={t('in-events:incidentSummarization.errorDescription')}
              />
            )}
            <FeedbackComponent incident={incident} />
          </Stack>
        </Card>
      </Col>
    </Row>
  );
}

function BulletPointSummaryList({ incidentSummary }: BulletPointSummaryListProps): JSX.Element {
  return (
    <Stack gap="xxsmall">
      <Typography variant="body-regular">{t('in-events:incidentSummarization.thisIncident')}</Typography>
      <ul>
        {incidentSummary.map(
          summaryPoint =>
            summaryPoint && (
              <li>
                <Typography variant="body-regular">{summaryPoint}</Typography>
              </li>
            )
        )}
      </ul>
    </Stack>
  );
}

function EventSummaryErrorMessage({
  title,
  description,
  tooltipDescription
}: EventSummaryErrorMessageProps): JSX.Element {
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

function extractSummaryFromIncident(incident: Incident): string[] {
  if (incident.metadata && incident.metadata.incidentSummary) {
    return incident.metadata.incidentSummary;
  } else {
    return [];
  }
}

function FeedbackComponent({ incident }: { incident: Incident }): JSX.Element {
  const [feedbackState, setFeedbackState] = useState<FeedbackState>({ thumbsDown: false, thumbsUp: false });
  const theme = useTheme();
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
        style={feedbackState.thumbsUp ? { background: `${theme.ids.color.option.neutral[300]}` } : undefined}
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
        style={feedbackState.thumbsDown ? { background: `${theme.ids.color.option.neutral[300]}` } : undefined}
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
