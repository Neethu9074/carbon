/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-disable no-console */

import React, { Fragment } from 'react';
import { withState } from 'recompose';

import Button from 'in-new-components/Button';

export default withState(
  'throwError',
  'setThrowError',
  false
)(function ErrorSimulator({ throwError, setThrowError }) {
  if (throwError) {
    triggerError();
  }

  return (
    <Fragment>
      <Button onClick={() => setTimeout(triggerError, 100)}>Trigger error outside of React</Button>
      <Button onClick={triggerError}>Trigger error in React click handler</Button>
      <Button onClick={() => setThrowError(true)}>Trigger error in React render lifecycle</Button>
    </Fragment>
  );
});

function triggerError() {
  intermediateFunctionDepth1.call(this, arguments.length);
}

function intermediateFunctionDepth1() {
  intermediateFunctionDepth2.call(this, arguments.length);
}

function intermediateFunctionDepth2() {
  intermediateFunctionDepth3.call(this, arguments.length);
}

function intermediateFunctionDepth3() {
  console.log('Before error');
  throw new Error('Deliberately thrown error');
}
