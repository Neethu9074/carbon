import React from 'react';

import CopyToClipboard from 'in-components/CopyToClipboard';
import Button from 'in-new-components/Button';

export default function CopyToClipboardButton(props) {
  if (props.disabled) {
    return (
      <Button disabled size={props.size || 'normal'} kind={props.kind || 'create'} className={props.className}>
        Copy
      </Button>
    );
  }

  return (
    <CopyToClipboard {...props}>
      {refSetter => (
        <Button
          refSetter={refSetter}
          size={props.size || 'normal'}
          kind={props.kind || 'create'}
          className={props.className}
        >
          {props.children || 'Copy'}
        </Button>
      )}
    </CopyToClipboard>
  );
}
