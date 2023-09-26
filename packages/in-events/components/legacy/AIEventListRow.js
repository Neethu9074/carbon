/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import { ThumbsUp, ThumbsUpFilled, ThumbsDown, ThumbsDownFilled } from '@carbon/icons-react';
import React, { useState } from 'react';

import { Button, Card, Message, Stack, Typography } from '@instana/components';

import {
  expandedRCAEventCardTracker,
  helpfulRCASuggestionTracker,
  unhelpfulRCASuggestionTracker
} from 'in-events/tracker';
import { default as EmptyStateMagnifyingGlass } from './assets/empty-state-magnifying-glass.svg';
import EventListPagination from 'in-components/EventListPagination/EventListPagination';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import EventListItem from 'in-events/components/legacy/EventListItem';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

export default function AIEventListRow({
  title,
  events,
  triggeringProblemId,
  latestSnapshot,
  isRCA,
  rcaSnapshotID,
  RegenerateComponentOnClick,
  pageNum,
  totalPages,
  setPageNum
}) {
  const [feedbackState, setFeedbackState] = useState({ thumbsUp: false, thumbsDown: false });
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card
          title={title}
          leftHeaderContent={<BetaBadge />}
          rightHeaderContent={<Message className={locals.rcaAIMessage} title={t('in-events:RCA.AIGenBadgeText')} />}
        >
          <Stack direction="vertical" gap="medium">
            <div className={locals.timeline}>
              {!events && <LoadingIndicator />}
              {events?.map(_event => (
                <div onClick={expandedRCAEventCardTracker}>
                  <EventListItem
                    key={_event.get('id')}
                    triggeringProblemId={triggeringProblemId}
                    event={_event}
                    latestSnapshot={latestSnapshot}
                    isRCA={isRCA}
                  />
                </div>
              ))}
              {rcaSnapshotID && events.length === 0 && (
                <RCAErrorMessage
                  title={t('in-events:RCA.noEventsErrorTitle')}
                  description={t('in-events:RCA.noEventsErrorDescription')}
                />
              )}
              {!rcaSnapshotID && (
                <RCAErrorMessage
                  title={t('in-events:RCA.noEntitiesErrorTitle')}
                  description={t('in-events:RCA.noEntitiesErrorDescription')}
                />
              )}
            </div>
            {rcaSnapshotID && (
              <Stack direction="horizontal" distribution="spaceBetween">
                <Stack direction="horizontal" gap="small" align="center">
                  <Typography variant="body-small">{t('in-events:RCA.suggestionHelpfulText')}</Typography>
                  <Button
                    kind="subtle"
                    size="compact"
                    onClick={() => {
                      setFeedbackState({ thumbsDown: false, thumbsUp: true });
                      helpfulRCASuggestionTracker();
                    }}
                  >
                    {feedbackState.thumbsUp ? <ThumbsUpFilled /> : <ThumbsUp />}
                  </Button>
                  <Button
                    kind="subtle"
                    size="compact"
                    onClick={() => {
                      setFeedbackState({ thumbsDown: true, thumbsUp: false });
                      unhelpfulRCASuggestionTracker();
                    }}
                  >
                    {feedbackState.thumbsDown ? <ThumbsDownFilled /> : <ThumbsDown />}
                  </Button>
                </Stack>

                <Stack direction="horizontal" gap="normal" distribution="end" align="center">
                  <EventListPagination pageNum={pageNum} numPages={totalPages} setPageNum={setPageNum} />
                  <Button
                    icon="lib_actions_sync"
                    size="compact"
                    kind="secondary"
                    onClick={RegenerateComponentOnClick}
                    disabled
                    className={locals.rcaRegenerate}
                  >
                    {t('in-events:RCA.regenerate')}
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Card>
      </Col>
    </Row>
  );
}

function RCAErrorMessage({ title, description }) {
  return (
    <Stack direction="horizontal" gap="small" distribution="center">
      <img src={EmptyStateMagnifyingGlass} />
      <Stack direction="vertical" gap="xxsmall">
        <Typography variant="heading-200">{title}</Typography>
        <div className={locals.errorMessageContainer}>
          <Typography variant="body-regular">{description}</Typography>
        </div>
      </Stack>
    </Stack>
  );
}
