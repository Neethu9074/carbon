/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error import NewApplicationWaiter from 'in-applications/Forms/NewApplication/NewApplicationWaiter';
import NewApplicationWaiter from 'in-applications/Forms/NewApplication/NewApplicationWaiter';

export default {
  component: NewApplicationWaiter
};

export function Default() {
  return <NewApplicationWaiter match={{ params: { appId: '42' } }} result={{ progress: { loading: true } }} />;
}
