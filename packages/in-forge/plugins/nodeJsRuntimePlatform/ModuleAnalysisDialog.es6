import React from 'react';

import createAgentResponseObservable from 'in-subscription/agentResponse';
import DashboardNotification from 'in-components/DashboardNotification';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

export default connectTo(
  props => {
    return {
      response: createAgentResponseObservable({
        action: 'node.getModuleAnalysis',
        target: props.snapshot.get('volatileId'),
        args: {}
      })
    };
  },
  function CodeDialog({ response }) {
    let header;

    if (!response) {
      header = 'Retrieving Node.js module analysis';
    } else if (response.error) {
      header = 'Failed to retrieve Node.js module analysis';
    } else {
      header = 'Node.js module analysis';
    }

    return (
      <Dialog header={header} onClose={close}>
        {!response ? <LoadingIndicator type="dark" /> : null}

        {response && response.error ? (
          <DashboardNotification type="danger">Error: {response.error}</DashboardNotification>
        ) : null}

        {response && response.data ? <Code code={JSON.stringify(response.data, 0, 2)} lang="json" /> : null}
      </Dialog>
    );
  }
);
