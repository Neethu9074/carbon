import React from 'react';

import createAgentResponseObservable from 'in-services/subscription/agentResponse';
import {getLabel} from 'in-sdk/snapshot';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {close} from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

export default connectTo(props => {
  return {
    response: createAgentResponseObservable({
      action: 'java.threadDump',
      target: props.snapshot.get('volatileId'),
      args: {}
    })
  };
}, function CodeDialog({snapshot, response}) {
  let header;
  if (!response) {
    header = `Retrieving thread dump for JVM: ${getLabel(snapshot)}`;
  } else if (response.error) {
    header = `Failed to retrieve thread dump for JVM: ${getLabel(snapshot)}`;
  } else {
    header = `Thread dump for JVM: ${getLabel(snapshot)}`;
  }

  return (
    <Dialog header={header}
              onClose={close}>

      {!response ?
        <LoadingIndicator type='dark' />
      : null}

      {response && response.error ?
        <p>
          Failed to retrieve thread drump. Error: {response.error}
        </p>
      : null}

      {response && response.data ?
        <Code code={response.data} />
      : null}
    </Dialog>
  );
});
