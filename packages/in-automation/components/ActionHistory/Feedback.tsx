/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createMapForm, createField, Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { KeyValue, Message, Stack } from '@instana/components';

// import OptionBox from 'in-applications/components/OptionBox';
import { close } from 'in-components/DialogPresenter/store';
import FormFooter from 'in-components/form/FormFooter/FormFooter';
import { notBlankValidator } from 'in-services/validators/string';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { updateActionInstanceFeedback } from 'in-automation/api';
import CancelButton from 'in-components/form/CancelButton';
import Form from 'in-components/form/binding/Form';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeConfig } from 'in-types';

// import Input from 'in-components/form/Input/Input';

export default function Feedback({
  id,
  feedback,
  setReload,
  comment
}: {
  id: string;
  feedback: string;
  setReload: (updateFn: (counter: number) => number) => void;
  comment: string;
}) {
  const [form, setForm] = useState<FeedbackForm>(createForm(feedback, comment));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  // const [sliderMessage, setSliderMessage] = useState("Current feedback " + form.get('feedback').value);
  const timeConfig = useTimeConfig();

  /**
   * This function handles the change when the slider moves, setting form and setting message
   * @param value
   */

  const handleFeedbackChange = ({ value }: { value: number }) => {
    setForm(form.updateIn(['feedback'], field => field.setValue(value.toString())));
  };

  const handleCommentChange = (value: string) => {
    setForm(form.updateIn(['comment'], field => field.setValue(value)));
  };

  return (
    <Form
      form={form}
      setForm={form => setForm(form as FeedbackForm)}
      onSubmit={form =>
        handleSubmit({ form: form as FeedbackForm, id, timeConfig, setSuccess, setIsSaving, setError, setReload })
      }
    >
      {/* sets error and success codes */}
      {error && <Message type="error">Error occured saving feedback</Message>}
      {success && <Message type="success">Feedback successfully saved!</Message>}

      <div style={{ padding: '4em', paddingTop: '0px' }}>
        <KeyValue label="Tell us about your experience with this action" />
        <Stack direction="vertical" gap={'small'}>
          {[
            'I am extremely unhappy',
            'I am dissatisfied',
            'I am neutral',
            'I was satisfied',
            'I was extremely satisfied'
          ].map((label, i) => (
            <label>
              <input
                type="radio"
                checked={i + 1 == parseInt(form.get('feedback').value)}
                onChange={() => handleFeedbackChange({ value: i + 1 })}
              />
              {label}
            </label>
          ))}
          <KeyValue label="Additional Comments (optional)" />
          <textarea rows={10} value={form.get('comment').value} onChange={e => handleCommentChange(e.target.value)} />
        </Stack>
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

/**
 * Handles submission upon pressing save function
 * @param form, id, setIsSaving, setError, timeConfig, setSuccess
 */

const handleSubmit = ({
  form,
  id,
  setIsSaving,
  setError,
  timeConfig,
  setSuccess
}: // setReload
{
  form: FeedbackForm;
  id: string;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  timeConfig: TimeConfig;
  setReload: (updateFn: (counter: number) => number) => void;
}) => {
  setIsSaving(true);
  setError(false);

  updateActionInstanceFeedback({
    id,
    feedback: form.get('feedback').value,
    comment: form.get('comment').value,
    to: timeConfig.to ?? Date.now(),
    windowSize: timeConfig.windowSize
  }).once(
    () => {
      setIsSaving(false);
      setSuccess(true);
      // setReload((old: number) => old + 1);
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
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
