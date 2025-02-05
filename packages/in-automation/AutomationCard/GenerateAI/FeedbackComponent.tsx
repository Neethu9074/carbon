/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { IconButton, Stack, Typography } from '@instana/components';

import { ActionForm } from 'in-automation/AutomationCard/GenerateAI/CopyActionStepForm';
import { useSegmentTracker } from 'in-automation/tracker';
import { t } from 'in-i18n';

export default function FeedbackComponent({
  trackerPayload,
  form,
  setForm
}: {
  trackerPayload: {
    prompt: string | { eventName?: string; eventDescription?: string; eventEntityType?: string };
    generatedContent: string;
    type: string;
  };
  form: ActionForm;
  setForm: (setValueFunc: (value: ActionForm) => ActionForm) => void;
}) {
  const { aiActionGoodFeedbackTrackerSegment, aiActionBadFeedbackTrackerSegment } = useSegmentTracker();
  const FeedbackStateVal = form.get('feedbackState').value;

  return (
    <Stack direction="horizontal" gap="small" align="center">
      {FeedbackStateVal === '' ? (
        <Typography variant="body-regular">{t('in-automation:feedback.contentHelpfulText')}</Typography>
      ) : (
        <Typography variant="body-regular">{t('in-automation:feedback.thankYouForYourFeedback')}</Typography>
      )}
      <IconButton
        kind="action"
        size="xl"
        type="lib_thumbs_up"
        iconSize="xs"
        onClick={() => {
          setForm(form => form.updateIn(['feedbackState'], item => item.setValue('thumbsUp').setTouched(true)));
          aiActionGoodFeedbackTrackerSegment({
            trackerPayload
          });
        }}
      />
      <IconButton
        kind="action"
        size="xl"
        type="lib_thumbs_down"
        iconSize="xs"
        onClick={() => {
          setForm(form => form.updateIn(['feedbackState'], item => item.setValue('thumbsdown').setTouched(true)));
          aiActionBadFeedbackTrackerSegment({
            trackerPayload
          });
        }}
      />
    </Stack>
  );
}
