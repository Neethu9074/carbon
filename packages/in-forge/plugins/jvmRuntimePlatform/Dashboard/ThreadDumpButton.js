/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ThreadDumpDialog from 'in-forge/plugins/jvmRuntimePlatform/ThreadDumpDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
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
  function ThreadDumpButton({ snapshot, className, isOnline }) {
    const button = (
      <Button kind="secondary" onClick={onClick} className={className} disabled={!isOnline}>
        Get Thread Dump
      </Button>
    );

    if (isOnline) {
      return <Tooltip content="Thread dumps are always live.">{button}</Tooltip>;
    }

    return (
      <Tooltip content="Thread dumps can only be retrieved for entities that are still under monitoring by Instana.">
        {button}
      </Tooltip>
    );

    function onClick() {
      if (isOnline) {
        addActiveDialog(<ThreadDumpDialog snapshot={snapshot} time={Date.now()} />);
      }
    }
  }
);
