/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createMapForm, createField, Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { Message, Stack } from '@instana/components';

import FormFooter from 'in-components/form/FormFooter/FormFooter';
import { notBlankValidator } from 'in-services/validators/string';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { updateActionInstanceFeedback } from 'in-automation/api';
import OptionBox from 'in-applications/components/OptionBox';
import Form from 'in-components/form/binding/Form';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeConfig } from 'in-types';

export default function Feedback({ id, feedback }: { id: string; feedback: string }) {
  const [form, setForm] = useState<FeedbackForm>(createForm(feedback));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sliderMessage, setSliderMessage] = useState('Use the slider to select a feedback input');
  const timeConfig = useTimeConfig();

  /**
   * This function handles the change when the slider moves, setting form and setting message
   * @param value
   */

  const handleChange = ({ value }: { value: number }) => {
    setForm(form.updateIn(['feedback'], field => field.setValue(value.toString())));
    switch (value) {
      case 1:
        setSliderMessage(value + ': This script was completely ineffective and/or made the issue worse');
        break;
      case 2:
        setSliderMessage(value + ": This script was not very effective, but it didn't make it worse");
        break;
      case 3:
        setSliderMessage(
          value + ': This script did not resolve the issue, but it helped me learn more about the problem'
        );
        break;
      case 4:
        setSliderMessage(
          value + ': This script did not completely fix the issue, but it came close and improved the situation'
        );
        break;
      case 5:
        setSliderMessage(value + ': This script worked nearly perfectly and completely solved my problem');
        break;
    }
  };

  return (
    <Form
      form={form}
      setForm={form => setForm(form as FeedbackForm)}
      onSubmit={form => handleSubmit({ form: form as FeedbackForm, id, timeConfig, setSuccess, setIsSaving, setError })}
    >
      {/* sets error and success codes */}
      {error && <Message type="error">Error occured saving feedback</Message>}
      {success && <Message type="success">Feedback successfully saved!</Message>}
      <Stack direction="vertical">
        <OptionBox
          icon={''}
          title={'1'}
          description="Total Failure"
          asRadioButton
          checked={1 == parseInt(form.get('feedback').value)}
          onChange={() => handleChange({ value: 1 })}
        />
        <OptionBox
          icon={''}
          title={'2'}
          description="Mostly failed, but with some success"
          asRadioButton
          checked={2 == parseInt(form.get('feedback').value)}
          onChange={() => handleChange({ value: 2 })}
        />
        <OptionBox
          icon={''}
          title={'3'}
          description="Worked, but with some issues"
          asRadioButton
          checked={3 == parseInt(form.get('feedback').value)}
          onChange={() => handleChange({ value: 3 })}
        />
        <OptionBox
          icon={''}
          title={'4'}
          description="Almost, but with some issues"
          asRadioButton
          checked={4 == parseInt(form.get('feedback').value)}
          onChange={() => handleChange({ value: 4 })}
        />
        <OptionBox
          icon={''}
          title={'5'}
          description="Worked completely"
          asRadioButton
          checked={5 == parseInt(form.get('feedback').value)}
          onChange={() => handleChange({ value: 5 })}
        />
        <Message>{sliderMessage}</Message>
      </Stack>
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
    // updates the actioninstance feedback in backend
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
