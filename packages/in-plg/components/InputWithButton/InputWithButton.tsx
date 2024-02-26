/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useRef } from 'react';

import { Stack, SvgIcon } from '@instana/components';
import { themes } from '@instana/design-tokens';

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

  return (
    <Stack direction="horizontal" gap="xsmall" align="center">
      <Input
        ref={inputRef}
        className={style}
        value={displayContent ? displayContent : inputValue}
        onChange={handleInputChange}
      />
      <SvgIcon type={icon} size="xs" color={themes.default.ids.color.option.teal[500]} onClick={clickHandler} />
    </Stack>
  );
}
