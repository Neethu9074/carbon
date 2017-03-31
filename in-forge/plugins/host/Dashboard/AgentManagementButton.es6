import React from 'react';

import { start } from 'in-forge/plugins/instanaAgent/selfMonitoring';
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
  function EnableSelfMonitoringButton({ snapshot, isOnline }) {
    const button = (
      <Button
        onClick={onClick}
        style={{
          background: '#e2e9ec'
        }}
      >
        Open Agent Management
      </Button>
    );

    if (isOnline) {
      return button;
    }

    return (
      <Tooltip content="Agent management is only available when the agent is running.">
        {button}
      </Tooltip>
    );

    function onClick() {
      if (isOnline) {
        start(snapshot, true);
      }
    }
  }
);
