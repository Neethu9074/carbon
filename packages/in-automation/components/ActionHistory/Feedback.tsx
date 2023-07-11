/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createMapForm, createField, Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { KeyValue, Message, Stack } from '@instana/components';

import { actionHistoryInstanceFeedbackTracker } from 'in-automation/tracker';
import { positiveNumberValidator } from 'in-services/validators/number';
import FormFooter from 'in-components/form/FormFooter/FormFooter';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { updateActionInstanceFeedback } from 'in-automation/api';
import { close } from 'in-components/DialogPresenter/store';
import TextArea from 'in-components/form/TextArea/TextArea';
import CancelButton from 'in-components/form/CancelButton';
import Form from 'in-components/form/binding/Form';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from './Feedback.mless';

interface FeedbackProps {
  id: string;
  feedback: number;
  comment: string;
  setHasStaleFeedback: (v: boolean) => void;
}

export default function Feedback({ id, feedback, comment, setHasStaleFeedback }: FeedbackProps) {
  const [form, setForm] = useState<FeedbackForm>(createForm(feedback, comment));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const timeConfig = useTimeConfig();
  const feedbackField = form.get('feedback');

  return (
    <Form
      form={form}
      setForm={form => setForm(form as FeedbackForm)}
      onSubmit={form =>
        handleSubmit({
          form: form as FeedbackForm,
          id,
          timeConfig,
          setSuccess,
          setIsSaving,
          setError,
          setHasStaleFeedback
        })
      }
    >
      <div className={locals.feedbackForm}>
        {error && (
          <Message withIcon type="error" className={locals.message}>
            {t('in-automation:actionHistory.feedbackError')}
          </Message>
        )}
        {feedbackField.touched && !feedbackField.valid && (
          <Message withIcon type="error" className={locals.message}>
            {t('in-automation:actionHistory.feedbackNotSelectedError')}
          </Message>
        )}
        {success && (
          <Message withIcon type="success" className={locals.message}>
            <b>{t('in-automation:actionHistory.feedbackSuccessTitle')}</b>{' '}
            {t('in-automation:actionHistory.feedbackSuccessMessage')}
          </Message>
        )}

        <KeyValue className={locals.prompt} label={t('in-automation:actionHistory.inputPrompt')} />
        <Stack gap="small">
          {[
            t('in-automation:actionHistory.unhappyFeedback'),
            t('in-automation:actionHistory.dissatisfiedFeedback'),
            t('in-automation:actionHistory.neutralFeedback'),
            t('in-automation:actionHistory.satisfiedFeedback'),
            t('in-automation:actionHistory.verySatisfiedFeedback')
          ].map((label, i) => (
            <label key={label} className={locals.feedbackLabel}>
              <input
                type="radio"
                className={locals.feedbackInput}
                checked={i + 1 == form.get('feedback').value}
                onChange={() => setForm(form.updateIn(['feedback'], field => field.setValue(i + 1)))}
              />
              {label}
            </label>
          ))}
        </Stack>
        <KeyValue className={locals.commentLabel} label={t('in-automation:actionHistory.additionalFeedback')} />
        <TextArea
          className={locals.commentBox}
          value={form.get('comment').value}
          onChange={e =>
            setForm(form.updateIn(['comment'], field => field.setValue((e.target as HTMLInputElement).value)))
          }
        />
      </div>
      <FormFooter>
        <CancelButton onClick={close} />
        <SaveButton form={form} isSaving={isSaving}>
          {t('in-automation:actionHistory.saveButton')}
        </SaveButton>
      </FormFooter>
    </Form>
  );
}

type FormItems = {
  feedback: Field<number>;
  comment: Field<string>;
};
type FeedbackForm = MapForm<FormItems>;

interface HandleSubmitParams {
  form: FeedbackForm;
  id: string;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  timeConfig: TimeConfig;
  setHasStaleFeedback: (v: boolean) => void;
}

const handleSubmit = ({
  form,
  id,
  setIsSaving,
  setError,
  timeConfig,
  setSuccess,
  setHasStaleFeedback
}: HandleSubmitParams) => {
  setIsSaving(true);
  setError(false);

  const newFeedback = form.get('feedback').value;
  const newComment = form.get('comment').value;

  updateActionInstanceFeedback({
    id,
    feedback: newFeedback,
    comment: newComment,
    to: timeConfig.to ?? Date.now(),
    windowSize: timeConfig.windowSize
  }).once(
    () => {
      setIsSaving(false);
      setSuccess(true);
      setHasStaleFeedback(true);
      setTimeout(() => {
        setSuccess(false);
      }, 5 * 1000);
      // tracks feedback and comment
      actionHistoryInstanceFeedbackTracker({
        actionInstanceId: id,
        actionInstanceFeedback: newFeedback,
        actionInstanceComment: newComment
      });
    },
    () => {
      setIsSaving(false);
      setError(true);
    }
  );
};

const createForm = (feedback: number, comment: string): FeedbackForm => {
  return createMapForm()
    .put(
      'feedback',
      createField({
        value: feedback,
        validator: positiveNumberValidator // this ensures the default value of 0 can't be submitted
      })
    )
    .put(
      'comment',
      createField({
        value: comment
      })
    ) as unknown as FeedbackForm;
};
