/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import NewApplication from 'in-applications/Forms/NewApplication/NewApplication';

export default {
  title: 'Templates|forms/NewApplication',
  component: NewApplication
};

export function DefaultStory() {
  return <NewApplication timeconfig={{}} />;
}
