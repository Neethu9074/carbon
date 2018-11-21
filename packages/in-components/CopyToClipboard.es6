/* global require:false */
import invariant from 'invariant';
import rpt from 'prop-types';
import React from 'react';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';

let Clipboard;

export default class extends React.Component {
  static displayName = 'CopyToClipboard';

  static propTypes = {
    getText: rpt.func,
    targetId: rpt.string,
    children: rpt.func.isRequired
  };

  constructor(props) {
    super(props);

    if (__DEV__) {
      const { getText, targetId } = this.props;
      invariant(getText != null || targetId != null, 'Either getText or targetId must be set.');
    }
  }

  setButton = btn => {
    this.button = btn;
  };

  componentDidMount() {
    if (!Clipboard) {
      Clipboard = require('clipboard');
    }

    if (this.props.getText == null) {
      this.clipboard = new Clipboard(this.button, {
        target: () => document.getElementById(this.props.targetId)
      });
    } else {
      this.clipboard = new Clipboard(this.button, {
        text: () => this.props.getText()
      });
    }

    this.clipboard.on('success', e => {
      addMessage(
        {
          type: 'info',
          timeout: 2000,
          content: 'Copied!'
        },
        'copyToClipboard'
      );
      e.clearSelection();
    });

    this.clipboard.on('error', () => {
      addMessage(
        {
          type: 'info',
          timeout: 2000,
          content: 'Press CTRL+C / CMD+C to copy!'
        },
        'copyToClipboard'
      );
    });
  }

  componentWillUnmount() {
    if (this.clipboard) {
      this.clipboard.destroy();
    }
  }

  render() {
    return this.props.children(this.setButton);
  }
}
