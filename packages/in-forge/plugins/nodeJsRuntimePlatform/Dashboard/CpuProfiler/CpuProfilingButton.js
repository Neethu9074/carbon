import React from 'react';

import { startProfiling } from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/store';
import { track, NODEJS_CPU_PROFILING_START } from 'in-services/tracking/tracking';
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
  function CpuProfilingDumpButton({ snapshot, isOnline }) {
    const button = (
      <Button kind="primary" onClick={onClick} disabled={!isOnline}>
        Gather CPU Profile for 10 seconds
      </Button>
    );

    if (isOnline) {
      return <Tooltip content="CPU profiling is always live.">{button}</Tooltip>;
    }

    return (
      <Tooltip content="CPU profiling is only available for entities which are still under monitoring by Instana.">
        {button}
      </Tooltip>
    );

    function onClick() {
      if (isOnline) {
        startProfiling(snapshot, 1000 * 10);
        track(NODEJS_CPU_PROFILING_START);
      }
    }
  }
);
