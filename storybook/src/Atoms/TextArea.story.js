/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import TextArea from 'in-components/form/TextArea';

export default {
  title: 'Atoms|FormControl/TextArea',
  component: TextArea
};

export const Default = () => {
  return <TextArea />;
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
