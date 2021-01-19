/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import createAgentResponseObservable from 'in-subscription/agentResponse';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
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
    return (
      <Dialog title="Node.js module analysis" onClose={close}>
        {!response ? <LoadingIndicator /> : null}

        {response && response.error ? (
          <DashboardNotification type="danger">Error: {response.error}</DashboardNotification>
        ) : null}

        {response && response.data ? <Code code={JSON.stringify(response.data, 0, 2)} lang="json" /> : null}
      </Dialog>
    );
  }
);
