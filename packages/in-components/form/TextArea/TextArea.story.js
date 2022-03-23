/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import TextArea from 'in-components/form/TextArea';

export default {
  component: TextArea
};

export const Default = () => {
  return <TextArea />;
};

export const WithError = () => {
  return <TextArea hasError />;
};

export const WithErrorAndHiddenValidationInfoOnFocus = () => {
  return <TextArea hasError hideValidityInformationOnFocus />;
};

export const Debounced = () => {
  const [debouncedText, setDebouncedText] = useState('please edit this text and see changes');
  const [withoutDebouncing, setDirect] = useState(() => debouncedText);
  return (
    <>
      <DebouncedTextArea
        value={debouncedText}
        onValueChange={setDebouncedText}
        onChange={({ target }) => setDirect(target.value)}
      />
      <p>
        <strong>Without debouncing:</strong> {withoutDebouncing}
      </p>
      <p>
        <strong>Debounced:</strong> {debouncedText}
      </p>
    </>
  );
};
