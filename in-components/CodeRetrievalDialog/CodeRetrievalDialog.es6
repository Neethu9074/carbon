import React from 'react';

import createAgentResponseObservable from 'in-services/subscription/agentResponse';
import DialogNotification from 'in-components/DialogNotification';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {close} from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

export default connectTo(props => {
  return {
    response: createAgentResponseObservable({
      action: 'java.class',
      target: props.snapshot.get('volatileId'),
      args: {
        className: props.file
      }
    })
  };
}, function CodeDialog({file, response, lang}) {
  let header;
  if (!response) {
    header = `Retrieving file: ${file}`;
  } else if (response.error) {
    header = `Failed to retrieve file: ${file}`;
  } else {
    header = `File: ${file}`;
  }

  return (
    <Dialog header={header}
              onClose={close}>

      {!response ?
        <LoadingIndicator type='dark' />
      : null}

      {response && response.error ?
        <DialogNotification type='danger'>
          Error: {response.error}
        </DialogNotification>
      : null}

      {response && response.data ?
        <Code lang={lang}
              code={response.data} />
      : null}
    </Dialog>
  );
});
