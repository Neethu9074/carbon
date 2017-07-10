/* global require:false */
import invariant from 'invariant';
import ReactDOM from 'react-dom';
import rpt from 'prop-types';
import React from 'react';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import RefWrapper from 'in-components/RefWrapper';
import Button from 'in-components/Button';

let Clipboard;

export default class extends React.Component {
  static displayName = 'CopyToClipboardButton';

  static propTypes = {
    getText: rpt.func,
    targetId: rpt.string,
    children: rpt.any
  };

  constructor(props) {
    super(props);

    if (__DEV__) {
      const { getText, targetId } = this.props;
      invariant(getText != null || targetId != null, 'Either getText or targetId must be set.');
    }
  }

  componentDidMount() {
    if (!Clipboard) {
      Clipboard = require('clipboard');
    }

    if (this.props.getText == null) {
      this.clipboard = new Clipboard(ReactDOM.findDOMNode(this.refs.button), {
        target: () => document.getElementById(this.props.targetId)
      });
    } else {
      this.clipboard = new Clipboard(ReactDOM.findDOMNode(this.refs.button), {
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
    const text = this.props.children || 'Copy to clipboard';
    return (
      <RefWrapper ref="button">
        <Button kind="secondary" size="sm">
          {text}
        </Button>
      </RefWrapper>
    );
  }
}
