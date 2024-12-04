/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, IconButton } from '@instana/components';

import { addCopiedToClipboardMessage } from 'in-components/CopyToClipboard';
import Input from 'in-components/form/Input';

import locals from 'in-plg/components/InputWithButton/InputWithButton.mless';

interface InputWithButtonProps {
  type: 'copy' | 'download';
  displayContent?: string; // Content displayed on the Input field.
  inputValue?: string; // Actual content which is copied.
  icon?: string;
  href?: string;
  size?: 'small' | 'large' | 'fullWidth';
  callBack?: () => void;
}

export default function InputWithButton({
  type = 'copy',
  inputValue = '',
  displayContent = '',
  icon = type === 'copy' ? 'lib_actions_copy' : 'lib_actions_download',
  href = '',
  size = 'small',
  callBack
}: InputWithButtonProps): JSX.Element {
  const style =
    size === 'small'
      ? `${locals.input} ${locals.inputSmall}`
      : size === 'fullWidth'
      ? `${locals.input} ${locals.fullWidth}`
      : `${locals.input} ${locals.inputLarge}`;
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    inputValue = event.target.value;
  };

  const clickHandler = () => {
    if (typeof callBack === 'function') callBack();

    if (type === 'copy') {
      navigator.clipboard.writeText(inputValue).then(() => {
        addCopiedToClipboardMessage();
      });
    }
  };

  return (
    <Stack direction="horizontal" gap="disabled" align="center">
      <Input className={style} value={displayContent ? displayContent : inputValue} onChange={handleInputChange} />
      <IconButton
        type={icon}
        kind="action"
        iconSize="xs"
        size="normal"
        className={locals.button}
        {...(href ? { href: href, target: '_blank' } : { onClick: clickHandler })}
      />
    </Stack>
  );
}
