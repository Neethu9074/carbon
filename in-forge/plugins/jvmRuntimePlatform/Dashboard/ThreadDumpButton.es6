import React from 'react';

import ThreadDumpDialog from 'in-forge/plugins/jvmRuntimePlatform/ThreadDumpDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { isEntityOnline } from 'in-stores/snapshot';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      isOnline: isEntityOnline(props.snapshot.get('id'))
    };
  },
  function ThreadDumpButton({ snapshot, className, isOnline }) {
    const button = (
      <Button onClick={onClick} className={className} disabled={!isOnline}>
        Get Thread Dump
      </Button>
    );

    if (isOnline) {
      return (
        <Tooltip content="Thread dumps are always live.">
          {button}
        </Tooltip>
      );
    }

    return (
      <Tooltip content="Thread dumps can only be retrieved for entities which are still under monitoring by Instana.">
        {button}
      </Tooltip>
    );

    function onClick() {
      if (isOnline) {
        setActiveDialog(<ThreadDumpDialog snapshot={snapshot} time={Date.now()} />);
      }
    }
  }
);
