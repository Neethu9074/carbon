/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ThumbsUp, ThumbsDown, ThumbsUpFilled, ThumbsDownFilled, ChatLaunch } from '@carbon/icons-react';
import React, { useState } from 'react';

import { Button, IconButton } from '@instana/carbon';

import FeedbackModal from 'in-events/components/NotesAndActivity/components/NoteTypes/FeedbackModal';
import { EVENT_AI_CHAT_API_RESULT_POS_NEG_FEEDBACK } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { t } from 'in-i18n';

import locals from './ThumbsFeedback.mless';

interface ThumbsFeedbackProps {
  TRACKING_EVENT_POS: string;
  TRACKING_EVENT_NEG: string;
}

export default function ThumbsFeedback({ TRACKING_EVENT_POS, TRACKING_EVENT_NEG }: ThumbsFeedbackProps) {
  const { trackCta } = useSegmentTracking();
  const [feedbackState, setFeedbackState] = useState<'up' | 'down' | null>(null); // up, down, or null
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className={locals.thumbsFeedbackWrapper}>
      {/* Positive feedback button */}
      <IconButton
        kind={'ghost'}
        size={'sm'}
        autoAlign
        label={t('in-events:aichat.helpfulResult')}
        onClick={() => {
          setFeedbackState('up');
          trackCta(TRACKING_EVENT_POS);
        }}
      >
        {feedbackState === 'up' ? <ThumbsUpFilled size={'16'} /> : <ThumbsUp size={'16'} />}
      </IconButton>
      {/* Negative feedback button */}
      <IconButton
        kind={'ghost'}
        size={'sm'}
        autoAlign
        label={t('in-events:aichat.notHelpfulResult')}
        onClick={() => {
          setFeedbackState('down');
          trackCta(TRACKING_EVENT_NEG);
        }}
      >
        {feedbackState === 'down' ? <ThumbsDownFilled size={'16'} /> : <ThumbsDown size={'16'} />}
      </IconButton>
      {/* Share feedback button */}
      {feedbackState && (
        <Button
          kind="tertiary"
          className={locals.feedbackSurveyBtn}
          size="sm"
          onClick={() => setOpenModal(true)}
          renderIcon={() => <ChatLaunch size="16" />}
        >
          <div className={locals.surveyBtnContents}> {t('in-events:notes.surveyButtonTxt')}</div>
        </Button>
      )}
      <FeedbackModal
        handleSubmitTracking={e => trackCta(EVENT_AI_CHAT_API_RESULT_POS_NEG_FEEDBACK, e)}
        feedbackState={feedbackState}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        feedbackTextSubject={t('in-events:aichat.result')}
      />
    </div>
  );
}
