/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import StepsContainer from 'in-components/StepsContainer/StepsContainer';

export default {
  component: StepsContainer
};

export const Default = props => <StepsContainer {...props} />;

Default.args = {
  navItems: [
    {
      scrollId: '1',
      label: 'step 1, checked, valid',
      title: 'Step One',
      checked: true,
      valid: true
    },
    {
      scrollId: '2',
      label: 'step 2, invalid',
      title: 'Step Two',
      checked: false,
      valid: false,
      content: <span>Invalid Step</span>
    },
    {
      scrollId: '3',
      label: 'step 2, checked, invalid',
      title: 'Step Two',
      checked: true,
      valid: false,
      content: <span>Invalid Step</span>
    }
  ],
  messages: [
    {
      level: 'warning',
      message: 'some message'
    },
    {
      level: 'error',
      message: 'some failure'
    }
  ]
};
