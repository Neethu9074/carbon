import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import createAgentResponseObservable from 'in-subscription/agentResponse';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import DashboardNotification from 'in-components/DashboardNotification';
import FlexHeader from 'in-components/Dialog/components/FlexHeader';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';
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
    let header;

    const codeTargetId = 'codeContainerInfo';

    if (!response) {
      header = `Retrieving info for CRI-O container…`;
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
        {!response && <LoadingIndicator />}

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
