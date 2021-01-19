/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import createAgentResponseObservable from 'in-subscription/agentResponse';
import CopyToClipboardButton from 'in-new-components/CopyToClipboardButton';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

export default connectTo(
  ({ snapshot }) => ({
    response: createAgentResponseObservable({
      action: 'crio.containerInfo',
      target: snapshot.get('volatileId'),
      args: {
        containerId: snapshot.getIn(['data', 'id'])
      }
    })
  }),
  function CodeDialog({ response }) {
    const codeTargetId = 'codeContainerInfo';
    let header;
    if (response && !response.error) {
      header = <CopyToClipboardButton kind="secondary" size="compact" targetId={codeTargetId} />;
    }

    return (
      <Dialog title="Container info" onClose={close} renderCustomCloseBehaviour={() => header}>
        {!response && <LoadingIndicator />}

        {response && response.error && (
          <DashboardNotification type="danger">Error: {response.error}</DashboardNotification>
        )}

        {response && response.data && (
          <Code code={JSON.stringify(JSON.parse(response.data), null, 2)} id={codeTargetId} lang="json" />
        )}
      </Dialog>
    );
  }
);
