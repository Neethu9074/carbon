import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import NotificationDialog from 'in-components/NotificationDialog';
import connectTo from 'in-hoc/connectTo';

import { clearMessage, message$ } from './MessageDialogStores';

const rpt = React.PropTypes;

export default connectTo(
  {
    message: message$
  },
  React.createClass({
    displayName: 'MessageDialog',

    mixins: [PureRenderMixin],

    propTypes: {
      message: rpt.object
    },

    render() {
      const message = this.props.message;
      if (!message) {
        return null;
      }

      return (
        <NotificationDialog title={message.title} onClose={this.onClose}>
          <p>
            {message.text}
          </p>
        </NotificationDialog>
      );
    },

    onClose() {
      clearMessage();
    }
  })
);
