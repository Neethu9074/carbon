/* eslint-disable react/display-name */
import React from 'react';

import CopyToClipboard from 'in-components/CopyToClipboard';
import Button from 'in-components/Button';

export default function CopyToClipboardButton(props) {
  const text = props.children || 'Copy to clipboard';
  const clipboardProps = {
    ...props,
    children: refSetter => (
      <span ref={refSetter}>
        <Button kind="secondary" size="sm">
          {text}
        </Button>
      </span>
    )
  };
  return <CopyToClipboard {...clipboardProps} />;
}
