/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React from 'react';

import Pagination from 'in-components/Pagination';

export default {
  component: Pagination
};

export function Default(props) {
  return <Pagination currentPage={props.page} numPages={10} onChange={action('onChange')} />;
}
Default.args = {
  page: 3
};
Default.argTypes = {
  page: {
    control: {
      type: 'range',
      min: 1,
      max: 10,
      step: 1
    }
  }
};
