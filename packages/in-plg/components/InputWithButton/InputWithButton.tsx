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
  displayContent?: string;
  inputValue?: string;
  icon?: string;
  href?: string;
  size?: 'small' | 'large';
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
  const style = size === 'small' ? `${locals.input} ${locals.inputSmall}` : `${locals.input} ${locals.inputLarge}`;
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    inputValue = event.target.value;
  };

  const clickHandler = () => {
    if (type === 'copy') {
      if (inputRef.current) {
        const textArea = document.createElement('textarea');
        textArea.value = inputValue;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        addCopiedToClipboardMessage();
      }
    } else {
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.target = '_blank';
      anchor.download = inputValue;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };

  function renderButton() {
    if (href !== '') {
      return (
        <Button icon={icon} kind="action" iconSize="s" size="normal" href={href}>
          {''}
        </Button>
      );
    }
    return (
      <Button icon={icon} kind="action" iconSize="s" size="normal" onClick={clickHandler}>
        {''}
      </Button>
    );
  }

  return (
    <Stack direction="horizontal" gap="disabled" align="center">
      <Input
        ref={inputRef}
        className={style}
        value={displayContent ? displayContent : inputValue}
        onChange={handleInputChange}
      />
      {renderButton()}
    </Stack>
  );
}
