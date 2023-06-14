/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createMapForm, createField, Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { DistinctSlider, Message } from '@instana/components';

import FormFooter from 'in-components/form/FormFooter/FormFooter';
import { notBlankValidator } from 'in-services/validators/string';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { updateActionInstanceFeedback } from 'in-automation/api';
import Form from 'in-components/form/binding/Form';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeConfig } from 'in-types';

export default function Feedback({ id, feedback }: { id: string; feedback: string }) {
  const [form, setForm] = useState<FeedbackForm>(createForm(feedback));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const timeConfig = useTimeConfig();
  return (
    <Form
      form={form}
      setForm={form => setForm(form as FeedbackForm)}
      onSubmit={form => handleSubmit({ form: form as FeedbackForm, id, timeConfig, setSuccess, setIsSaving, setError })}
    >
      {error && <Message type="error">Error occured saving feedback</Message>}
      {success && <Message type="success">Feedback successfully saved!</Message>}
      <DistinctSlider
        marks={[{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }]}
        max={5}
        min={1}
        value={parseInt(form.get('feedback').value)}
        onChange={(_, value) => setForm(form => form.updateIn(['feedback'], field => field.setValue(value.toString())))}
      />
      <FormFooter>
        <SaveButton form={form} isSaving={isSaving} />
      </FormFooter>
    </Form>
  );
}

type FormItems = {
  feedback: Field<string>;
};
type FeedbackForm = MapForm<FormItems>;

const handleSubmit = ({
  form,
  id,
  setIsSaving,
  setError,
  timeConfig,
  setSuccess
}: {
  form: FeedbackForm;
  id: string;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  timeConfig: TimeConfig;
}) => {
  setIsSaving(true);
  setError(false);
  updateActionInstanceFeedback({
    id,
    feedback: form.get('feedback').value,
    to: timeConfig.to ?? Date.now(),
    windowSize: timeConfig.windowSize
  }).once(
    () => {
      setIsSaving(false);
      setSuccess(true);
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

const createForm = (feedback: string) => {
  let form = createMapForm().put(
    'feedback',
    createField({
      value: feedback,
      validator: notBlankValidator
    })
  );

  return form;
};
