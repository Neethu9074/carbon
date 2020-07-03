import rpt from 'prop-types';
import React from 'react';

import { clearMessage, message$ } from './MessageDialogStores';
import Dialog from 'in-new-components/Dialog/Dialog';
import connectTo from 'in-hoc/connectTo';

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
        <Dialog title={message.title} onClose={this.onClose}>
          <p>{message.text}</p>
        </Dialog>
      );
    }

    onClose = () => {
      clearMessage();
    };
  }
);
