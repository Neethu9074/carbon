/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createMapForm, createField, Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { KeyValue, Message, Stack } from '@instana/components';

import FormFooter from 'in-components/form/FormFooter/FormFooter';
import { notBlankValidator } from 'in-services/validators/string';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { updateActionInstanceFeedback } from 'in-automation/api';
import { close } from 'in-components/DialogPresenter/store';
import TextArea from 'in-components/form/TextArea/TextArea';
import CancelButton from 'in-components/form/CancelButton';
import Form from 'in-components/form/binding/Form';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeConfig } from 'in-types';

import locals from './Feedback.mless';

export default function Feedback({
  id,
  feedback,
  comment,
  setHasStaleFeedback
}: {
  id: string;
  feedback: string;
  comment: string;
  setHasStaleFeedback: (v: boolean) => void;
}) {
  const [form, setForm] = useState<FeedbackForm>(createForm(feedback, comment));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const timeConfig = useTimeConfig();

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
            Error occured saving feedback
          </Message>
        )}
        {success && (
          <Message withIcon type="success" className={locals.message}>
            Feedback successfully saved!
          </Message>
        )}

        <KeyValue className={locals.prompt} label="Tell us about your experience with this action:" />

        <Stack gap="small">
          {[
            'I am extremely unhappy',
            'I am dissatisfied',
            'I am neutral',
            'I was satisfied',
            'I was extremely satisfied'
          ].map((label, i) => (
            <label key={label} className={locals.feedbackLabel}>
              <input
                type="radio"
                className={locals.feedbackInput}
                checked={i + 1 == parseInt(form.get('feedback').value)}
                onChange={() => setForm(form.updateIn(['feedback'], field => field.setValue((i + 1).toString())))}
              />
              {label}
            </label>
          ))}
        </Stack>
        <KeyValue className={locals.commentLabel} label="Additional Comments (optional)" />
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
        <SaveButton form={form} isSaving={isSaving} />
      </FormFooter>
    </Form>
  );
}

type FormItems = {
  feedback: Field<string>;
  comment: Field<string>;
};
type FeedbackForm = MapForm<FormItems>;

const handleSubmit = ({
  form,
  id,
  setIsSaving,
  setError,
  timeConfig,
  setSuccess,
  setHasStaleFeedback
}: {
  form: FeedbackForm;
  id: string;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  timeConfig: TimeConfig;
  setHasStaleFeedback: (v: boolean) => void;
}) => {
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
      }, 10 * 1000);
    },
    () => {
      setIsSaving(false);
      setError(true);
    }
  );
};

const createForm = (feedback: string, comment: string): FeedbackForm => {
  return createMapForm()
    .put(
      'feedback',
      createField({
        value: feedback,
        validator: notBlankValidator
      })
    )
    .put(
      'comment',
      createField({
        value: comment
      })
    ) as unknown as FeedbackForm;
};
