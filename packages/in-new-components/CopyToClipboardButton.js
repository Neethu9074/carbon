import React from 'react';

import CopyToClipboard from 'in-components/CopyToClipboard';
import Button from 'in-new-components/Button';

export default function CopyToClipboardButton(props) {
  if (props.disabled) {
    return (
      <Button disabled kind={props.kind || 'create'}>
        Copy
      </Button>
    );
  }

  return (
    <CopyToClipboard {...props}>
      {refSetter => (
        <Button refSetter={refSetter} kind={props.kind || 'create'}>
          {props.children || 'Copy'}
        </Button>
      )}
    </CopyToClipboard>
  );
}
