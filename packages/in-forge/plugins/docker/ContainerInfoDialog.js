import React from 'react';

import createAgentResponseObservable from 'in-subscription/agentResponse';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import DashboardNotification from 'in-components/DashboardNotification';
import FlexHeader from 'in-components/Dialog/components/FlexHeader';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

export default connectTo(
  ({ snapshot }) => ({
    response: createAgentResponseObservable({
      action: 'docker.containerInfo',
      target: snapshot.get('volatileId'),
      args: {
        containerId: snapshot.getIn(['data', 'Id'])
      }
    })
  }),
  function CodeDialog({ response }) {
    let header;

    const codeTargetId = 'codeContainerInfo';

    if (!response) {
      header = `Retrieving info for Docker container…`;
    } else if (response.error) {
      header = `Failed to retrieve container info`;
    } else {
      header = (
        <FlexHeader>
          Container Info
          <CopyToClipboardButton targetId={codeTargetId} />
        </FlexHeader>
      );
    }

    return (
      <Dialog header={header} onClose={close}>
        {!response && <LoadingIndicator type="dark" />}

        {response &&
          response.error && <DashboardNotification type="danger">Error: {response.error}</DashboardNotification>}

        {response &&
          response.data && (
            <Code code={JSON.stringify(JSON.parse(response.data), null, 2)} id={codeTargetId} lang="json" />
          )}
      </Dialog>
    );
  }
);
