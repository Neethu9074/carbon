import React from 'react';

import CopyToClipboard from 'in-components/CopyToClipboard';
import Button from 'in-new-components/Button';

/* eslint-disable react/display-name */
export default function CopyToClipboardButton(props) {
  const clipboardProps = {
    ...props,
    children: refSetter => (
      <span ref={refSetter}>
        <Button kind={props.kind || 'create'}>Copy</Button>
      </span>
    )
  };
  return <CopyToClipboard {...clipboardProps} />;
}
