import React from 'react';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import createAgentResponseObservable from 'in-subscription/agentResponse';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Prompt from 'in-new-components/Dialog/Prompt';
import { isEntityOnline } from 'in-stores/snapshot';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      isOnline: isEntityOnline(props.snapshot.get('id'))
    };
  },
  function HeapDumpButton({ snapshot, className, isOnline }) {
    const maxMemory = snapshot.get('data').get('memory.max');
    const description = maxMemory
      ? 'Taking a heap dump is an invasive operation and will require about ' +
        bytesTwoDecimalPlaces(maxMemory) +
        ' disk space. Please provide the path to store the heap dump:'
      : 'Taking a heap dump is an invasive operation. Please provide the path to store the heap dump:';
    const button = (
      <Button
        kind="secondary"
        onClick={() => {
          if (isOnline) {
            addActiveDialog(
              <Prompt
                header="JVM Heap Dump"
                description={description}
                inputLabel="Storage Path"
                confirmButtonLabel="Take Heap Dump"
                onSubmit={path => {
                  close();
                  takeHeapDump(path, snapshot);
                }}
              />
            );
          }
        }}
        className={className}
        disabled={!isOnline}
      >
        Get Heap Dump
      </Button>
    );

    if (isOnline) {
      return <Tooltip content="Heap dumps are always live.">{button}</Tooltip>;
    }

    return (
      <Tooltip content="Heap dumps can only be retrieved for JVMs that are still under monitoring by Instana.">
        {button}
      </Tooltip>
    );
  }
);

function takeHeapDump(path, snapshot) {
  addMessage(
    {
      type: 'info',
      content: `Taking heap dump…`
    },
    'jvm-heap-dump'
  );
  createAgentResponseObservable({
    action: 'java.heapDump',
    target: snapshot.get('volatileId'),
    args: {
      target: path
    }
  }).once(({ error, data }) => {
    if (data) {
      addMessage(
        {
          type: 'info',
          timeout: 5000,
          content: `Heap dump available via: ${data}.`
        },
        'jvm-heap-dump'
      );
    } else {
      addMessage(
        {
          type: 'danger',
          timeout: 5000,
          content: `Failed to collect heap dump: ${error}.`
        },
        'jvm-heap-dump'
      );
    }
  });
}
