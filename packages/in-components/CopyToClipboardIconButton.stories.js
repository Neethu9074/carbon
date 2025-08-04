/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import CopyToClipboardIconButton from 'in-components/CopyToClipboardIconButton';

const CenteredCopyToClipboardIconButton = props => (
  <div style={{ marginLeft: '3rem' }}>
    <CopyToClipboardIconButton {...props} />
  </div>
);

export default {
  component: CenteredCopyToClipboardIconButton,
  title: 'in-components/CopyToClipboardIconButton',
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled'
    },
    getText: {
      control: 'function',
      description: 'function to return text to copy'
    },
    targetId: {
      control: 'string',
      description: 'the target element idk containing text to copy'
    },
    ref: {
      description: 'ref'
    }
  },
  args: {
    disabled: false,
    getText: () => 'Default Test String to Copy to Clipboard'
  }
};

export const Default = {
  args: {}
};

export function Disabled(args) {
  return <CopyToClipboardIconButton disabled />;
}

export function UsingTarget(args) {
  return (
    <div>
      <div id="copyThis">Using target id: copyThis</div>
      <CopyToClipboardIconButton targetId="copyThis" />
    </div>
  );
}

// Made with Bob
