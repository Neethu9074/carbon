import React from 'react';

import { createLogger } from 'instalog';

import createAgentResponseObservable from 'in-subscription/agentResponse';
import { isEntityOnline } from 'in-stores/snapshot';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

const logger = createLogger('in-forge/instanaAgent/selfMonitoring');

export default connectTo(
  props => {
    return {
      isOnline: isEntityOnline(props.snapshot.get('id'))
    };
  },
  function HeapDumpButton({ snapshot, className, isOnline }) {
    const button = (
      <Button kind="secondary" onClick={onClick} className={className} disabled={!isOnline}>
        Get Heap Dump
      </Button>
    );

    if (isOnline) {
      return <Tooltip content="Heap dumps are always live.">{button}</Tooltip>;
    }

    return (
      <Tooltip content="Heap dumps can only be retrieved for entities that are still under monitoring by Instana.">
        {button}
      </Tooltip>
    );

    function onClick() {
      if (isOnline) {
        const path = prompt(
          'Please provide the path to store the heap dump.\nTaking a heap dump is an invasive operation.'
        );
        if (path) {
          createAgentResponseObservable({
            action: 'java.heapDump',
            target: snapshot.get('volatileId'),
            args: {
              target: path
            }
          }).once(response => {
            logger.info('Response', response);
          });
        }
      }
    }
  }
);
