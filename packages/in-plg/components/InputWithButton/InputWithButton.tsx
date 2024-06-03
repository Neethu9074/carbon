/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useRef } from 'react';

import { Stack } from '@instana/components';
import { Button } from '@instana/legacy';

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
}

export default function InputWithButton({
  type = 'copy',
  inputValue = '',
  displayContent = '',
  icon = type === 'copy' ? 'lib_actions_copy' : 'lib_actions_download',
  href = '',
  size = 'small'
}: InputWithButtonProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement | null>(null);
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
    if (type === 'copy') {
      navigator.clipboard.writeText(inputValue).then(() => {
        addCopiedToClipboardMessage();
      });
    }
  };

  return (
    <Stack direction="horizontal" gap="disabled" align="center">
      <Input
        ref={inputRef}
        className={style}
        value={displayContent ? displayContent : inputValue}
        onChange={handleInputChange}
      />
      <Button
        icon={icon}
        kind="action"
        iconSize="s"
        size="normal"
        className={locals.button}
        {...(href ? { href: href, target: '_blank' } : { onClick: clickHandler })}
      >
        {''}
      </Button>
    </Stack>
  );
}
