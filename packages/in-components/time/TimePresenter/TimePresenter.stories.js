/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React from 'react';

import TimePresenter from 'in-components/time/TimePresenter';

export default {
  component: TimePresenter,
  parameters: {
    // ignoring this story because it renders differently everytime
    chromatic: { disable: true }
  }
};

export function Fixed(props) {
  return (
    <TimePresenter
      expanded={props.expanded}
      timeConfig={{ windowSize: props.windowSize, to: Date.now() }}
      onClick={action('click')}
    />
  );
}
Fixed.args = {
  windowSize: 3600000,
  retention: 7,
  expanded: false
};

export function Live(props) {
  return (
    <TimePresenter
      expanded={props.expanded}
      timeConfig={{ windowSize: props.windowSize, to: null }}
      onClick={action('click')}
    />
  );
}
Live.args = {
  windowSize: 3600000,
  retention: 7,
  expanded: false
};
Live.argTypes = {
  windowSize: {
    control: {
      type: 'range',
      min: 60000,
      max: 2592000000,
      step: 60000
    }
  },
  retention: {
    control: {
      type: 'range',
      min: 1,
      max: 365,
      step: 1
    }
  }
};
