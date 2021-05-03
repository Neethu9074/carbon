/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable no-console */
import React, { Fragment } from 'react';
import { withState } from 'recompose';

import { Button } from '@instana/components';

import { t } from 'in-i18n';

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
      <Button onClick={() => setTimeout(triggerError, 100)}>
        {t('in-internal:monitoringUnit.eum.errorSimulator.triggerErrOutsideReact')}
      </Button>
      <Button onClick={triggerError}>
        {t('in-internal:monitoringUnit.eum.errorSimulator.triggerErrReactClickHandler')}
      </Button>
      <Button onClick={() => setThrowError(true)}>
        {t('in-internal:monitoringUnit.eum.errorSimulator.triggerErrReactRenderLifecycle')}
      </Button>
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
