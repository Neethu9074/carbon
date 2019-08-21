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
  props => {
    return {
      response: createAgentResponseObservable({
        action: 'java.threadDump',
        target: props.snapshot.get('volatileId'),
        args: {}
      })
    };
  },
  function CodeDialog({ response }) {
    let header;

    const codeTargetId = 'codeThreadDump';

    if (!response) {
      header = `Retrieving thread dump for JVM…`;
    } else if (response.error) {
      header = `Failed to retrieve thread dump`;
    } else {
      header = (
        <FlexHeader>
          Thread dump
          <CopyToClipboardButton targetId={codeTargetId} />
        </FlexHeader>
      );
    }

    return (
      <Dialog header={header} onClose={close}>
        {!response && <LoadingIndicator type="dark" />}

        {response &&
          response.error && <DashboardNotification type="danger">Error: {response.error}</DashboardNotification>}

        {response && response.data && <Code code={response.data} id={codeTargetId} />}
      </Dialog>
    );
  }
);
