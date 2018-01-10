import React from 'react';

import createAgentResponseObservable from 'in-subscription/agentResponse';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import CenterAlignment from 'in-components/layout/CenterAlignment';
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
        action: 'java.threadDump',
        target: props.snapshot.get('volatileId'),
        args: {},
        time: props.time
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
        <CenterAlignment>
          Thread dump
          <CopyToClipboardButton targetId={codeTargetId} />
        </CenterAlignment>
      );
    }

    return (
      <Dialog header={header} onClose={close}>
        {!response ? <LoadingIndicator type="dark" /> : null}

        {response && response.error ? (
          <DashboardNotification type="danger">Error: {response.error}</DashboardNotification>
        ) : null}

        {response && response.data ? <Code code={response.data} id={codeTargetId} /> : null}
      </Dialog>
    );
  }
);
