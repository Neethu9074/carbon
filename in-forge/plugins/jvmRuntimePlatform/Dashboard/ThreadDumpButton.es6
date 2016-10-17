import React from 'react';

import ThreadDumpDialog from 'in-forge/plugins/jvmRuntimePlatform/ThreadDumpDialog';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import {isEntityOnline} from 'in-stores/snapshot';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
  return {
    isOnline: isEntityOnline(props.snapshot.get('id'))
  };
}, function ThreadDumpButton({snapshot, className, isOnline}) {
  const button = (
    <Button onClick={onClick}
            className={className}
            disabled={!isOnline}>
      Get Thread Dump
    </Button>
  );

  if (isOnline) {
    return button;
  }

  return (
    <Tooltip content='The entity is no longer monitored and therefore a thread dump cannot be retrieved.'>
      {button}
    </Tooltip>
  );

  function onClick() {
    if (isOnline) {
      setActiveDialog(<ThreadDumpDialog snapshot={snapshot} time={Date.now()}/>);
    }
  }
});
