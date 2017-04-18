/* global require:false */

import ReactDOM from 'react-dom';
import rpt from 'prop-types';
import React from 'react';

import { setTemporaryNotification } from 'in-stores/temporaryNotification';
import RefWrapper from 'in-components/RefWrapper';
import Button from 'in-components/Button';

let Clipboard;

export default React.createClass({
  displayName: 'CopyToClipboardButton',

  propTypes: {
    getText: rpt.func.isRequired,
    children: rpt.any
  },

  componentDidMount() {
    if (!Clipboard) {
      Clipboard = require('clipboard');
    }
    this.clipboard = new Clipboard(ReactDOM.findDOMNode(this.refs.button), {
      text: () => this.props.getText()
    });

    this.clipboard.on('success', e => {
      setTemporaryNotification('Copied!');
      e.clearSelection();
    });

    this.clipboard.on('error', () => {
      setTemporaryNotification('Press CTRL+C / CMD+C to copy!');
    });
  },

  componentWillUnmount() {
    if (this.clipboard) {
      this.clipboard.destroy();
    }
  },

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
});
