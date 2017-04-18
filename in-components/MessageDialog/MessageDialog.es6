import rpt from 'prop-types';
import React from 'react';

import NotificationDialog from 'in-components/NotificationDialog';
import connectTo from 'in-hoc/connectTo';

import { clearMessage, message$ } from './MessageDialogStores';

export default connectTo(
  {
    message: message$
  },
  class extends React.PureComponent {
    static displayName = 'MessageDialog';

    static propTypes = {
      message: rpt.object
    };

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
    }

    onClose = () => {
      clearMessage();
    };
  }
);
