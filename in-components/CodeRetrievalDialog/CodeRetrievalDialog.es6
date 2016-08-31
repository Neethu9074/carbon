import React from 'react';

import createAgentResponseObservable from 'in-services/subscription/agentResponse';
import {close} from 'in-components/DialogPresenter/store';
import DialogV2 from 'in-components/DialogV2';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
  return {
    code: createAgentResponseObservable({
      action: 'java.class',
      target: props.snapshot.get('volatileId'),
      args: {
        className: props.file
      }
    })
  };
}, function CodeDialog({snapshot, file, code}) {
  return (
    <DialogV2 header={file}
              onClose={close}>
      Grabbing code for {snapshot.get('id')} file {file}.

      Got: {JSON.stringify(code, 0, 2)}
    </DialogV2>
  );
});
