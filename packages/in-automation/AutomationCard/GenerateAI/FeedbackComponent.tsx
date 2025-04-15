/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { IconButton, Stack, Typography, Button, CarbonTextArea } from '@instana/components';

import { ActionForm } from 'in-automation/AutomationCard/GenerateAI/CopyActionStepForm';
import { useSegmentTracker } from 'in-automation/tracker';
import { t, Trans } from 'in-i18n';

import locals from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/GenerateAIActionDialog.mless';

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
  const [showTextarea, setShowTextArea] = useState(false);
  const { aiActionGoodFeedbackTrackerSegment, aiActionBadFeedbackTrackerSegment } = useSegmentTracker();
  const FeedbackStateVal = form.get('feedbackState').value;
  const badFeedbackVal = form.get('badFeedback').value;

  return (
    <>
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
            setShowTextArea(true);
          }}
        />
      </Stack>
      {showTextarea && (
        <Stack direction="vertical" gap="small" align="center">
          <CarbonTextArea
            id="bad-feedback"
            labelText={t('in-automation:feedback.additionalFeedbacklabel')}
            className={locals.feedbackTextarea}
            placeholder={t('in-automation:feedback.additionalFeedbackPlaceholder')}
            value={badFeedbackVal}
            onChange={e =>
              setForm(form =>
                form.updateIn(['badFeedback'], item =>
                  item.setValue((e.target as HTMLTextAreaElement).value).setTouched(true)
                )
              )
            }
          />
          <Button
            kind="secondary"
            onClick={() => {
              setForm(form => form.updateIn(['feedbackState'], item => item.setValue('thumbsdown').setTouched(true)));
              aiActionBadFeedbackTrackerSegment({
                Feedback: form.get('badFeedback').value,
                trackerPayload
              });
              setShowTextArea(false);
            }}
          >
            {t('in-automation:feedback.submitFeedback')}
          </Button>
        </Stack>
      )}
      <Typography variant="body-regular">
        {typeof trackerPayload.prompt === 'object' && trackerPayload.prompt?.eventDescription ? (
          <Trans i18nKey="in-automation:feedback.manualActionTip" />
        ) : (
          <Trans i18nKey="in-automation:feedback.scriptTip" />
        )}
      </Typography>
    </>
  );
}
