import React, { forwardRef } from 'react';

import CopyToClipboard from 'in-components/CopyToClipboard';
import { compositeRef } from 'in-services/util/react';
import Button from 'in-new-components/Button';

export default forwardRef(function CopyToClipboardButton(props, ref) {
  if (props.disabled) {
    return (
      <Button
        disabled
        size={props.size || 'normal'}
        kind={props.kind || 'create'}
        className={props.className}
        ref={ref}
      >
        Copy
      </Button>
    );
  }

  return (
    <CopyToClipboard {...props}>
      {copyToClipboardRef => (
        <Button
          ref={compositeRef(copyToClipboardRef, ref)}
          size={props.size || 'normal'}
          kind={props.kind || 'create'}
          className={props.className}
        >
          {props.children || 'Copy'}
        </Button>
      )}
    </CopyToClipboard>
  );
});
