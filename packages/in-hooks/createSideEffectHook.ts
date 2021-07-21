/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useLayoutEffect, useState } from 'react';

interface State<T> {
  arg: T;
  instanceId: Symbol;
}

// A modern hook-based variant of react-side-effect
// Check out the react-side-effect documentation for rationale/inspiration
// https://github.com/gaearon/react-side-effect
export default function createSideEffectHook<ARG, REDUCED>(
  reduceArgs: (args: ARG[]) => REDUCED,
  applySideEffect: (value: REDUCED) => void
) {
  const states: State<ARG>[] = [];

  return (arg: ARG) => {
    // Using Symbol to create a unique ID
    const [instanceId] = useState(Symbol('instanceId'));

    useLayoutEffect(() => {
      addInstance(instanceId, arg);
      emitChange();

      return () => {
        removeInstance(instanceId);
        emitChange();
      };
    });
  };

  function addInstance(instanceId: Symbol, arg: ARG) {
    states.push({
      instanceId,
      arg
    });
  }

  function removeInstance(instanceId: Symbol) {
    const index = states.findIndex(s => s.instanceId === instanceId);
    if (index >= 0) {
      states.splice(index, 1);
    }
  }

  function emitChange() {
    applySideEffect(reduceArgs(states.map(s => s.arg)));
  }
}
