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

export default function Feedback({ id, feedback }: { id: string; feedback: string }) {
  const [form, setForm] = useState<FeedbackForm>(createForm(feedback));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  // const [sliderMessage, setSliderMessage] = useState("Current feedback " + form.get('feedback').value);
  const timeConfig = useTimeConfig();

  /**
   * This function handles the change when the slider moves, setting form and setting message
   * @param value
   */

  const handleChange = ({ value }: { value: number }) => {
    setForm(form.updateIn(['feedback'], field => field.setValue(value.toString())));
    // switch (value) {
    //   case 1:
    //     setSliderMessage(value + ': This script was completely ineffective and/or made the issue worse');
    //     break;
    //   case 2:
    //     setSliderMessage(value + ": This script was not very effective, but it didn't make it worse");
    //     break;
    //   case 3:
    //     setSliderMessage(
    //       value + ': This script did not resolve the issue, but it helped me learn more about the problem'
    //     );
    //     break;
    //   case 4:
    //     setSliderMessage(
    //       value + ': This script did not completely fix the issue, but it came close and improved the situation'
    //     );
    //     break;
    //   case 5:
    //     setSliderMessage(value + ': This script worked nearly perfectly and completely solved my problem');
    //     break;
    // }
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

      <div style={{ padding: '4em', paddingTop: '0px' }}>
        <KeyValue label="Tell us about your experience with this action" />
        <Stack direction="vertical" gap={'small'}>
          <label>
            <input
              type="radio"
              checked={1 == parseInt(form.get('feedback').value)}
              onChange={() => handleChange({ value: 1 })}
            />
            {/* <Typography variant='body-regular'>I am extremely unhappy</Typography> */}I am extremely unhappy
          </label>

          <label>
            <input
              type="radio"
              checked={2 == parseInt(form.get('feedback').value)}
              onChange={() => handleChange({ value: 2 })}
            />
            I am dissatisfied
          </label>

          <label>
            <input
              type="radio"
              checked={3 == parseInt(form.get('feedback').value)}
              onChange={() => handleChange({ value: 3 })}
            />
            I am neutral
          </label>

          <label>
            <input
              type="radio"
              checked={4 == parseInt(form.get('feedback').value)}
              onChange={() => handleChange({ value: 4 })}
            />
            I was satisfied
          </label>

          <label>
            <input
              type="radio"
              checked={5 == parseInt(form.get('feedback').value)}
              onChange={() => handleChange({ value: 5 })}
            />
            I was extremely satisfied
          </label>

          {/* <Message>{sliderMessage}</Message> */}
          <KeyValue label="Additional Comments (optional)" />
          <textarea rows={10} />
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
