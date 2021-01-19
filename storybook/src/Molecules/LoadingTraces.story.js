/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from '@storybook/addon-knobs/react';
import React from 'react';

import LoadingStates from 'in-analyze/AnalyzeView/components/LoadingStates';

export function Default() {
  return <LoadingStates progress={prepProgress} />;
}
export function QueryRunning() {
  return <LoadingStates progress={runningProgress} />;
}
export function QueryFailedServer() {
  return <LoadingStates progress={failedProgress} errors={errorServer} />;
}
export function QueryFailedClient() {
  return <LoadingStates progress={failedProgress} errors={errorClient} />;
}
export function QueryFailedTimeOut() {
  return <LoadingStates progress={failedProgress} errors={errorOther} />;
}

const prepProgress = {
  loading: true
};

const runningProgress = {
  loading: true,
  percentage: number('Percentage', 0.5, {
    range: true,
    min: 0,
    max: 1,
    step: 0.01
  })
};

const errorServer = [
  {
    code: 'SERVER',
    message: ''
  }
];

const errorClient = [
  {
    code: 'CLIENT',
    message: ''
  }
];

const errorOther = [
  {
    code: 504,
    message: ''
  }
];

const failedProgress = {
  loading: false,
  percentage: null
};

export default {
  title: 'Molecules|Loading/LoadingTraces',
  component: LoadingStates
};
