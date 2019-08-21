import React from 'react';

import CopyToClipboard from 'in-components/CopyToClipboard';
import Button from 'in-new-components/Button';

export default function CopyToClipboardButton(props) {
  return (
    <CopyToClipboard {...props}>
      {refSetter => (
        <Button {...props} refSetter={refSetter}>
          {props.children || 'Copy to clipboard'}
        </Button>
      )}
    </CopyToClipboard>
  );
}
