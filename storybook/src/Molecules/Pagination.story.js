/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from '@storybook/addon-knobs/react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import React from 'react';

import Pagination from 'in-new-components/Pagination';

export default {
  title: 'Molecules|Pagination',
  component: Pagination,
  decorators: [withKnobs]
};

export function Default() {
  const page = number('Page', 3, {
    range: true,
    min: 1,
    max: 10,
    step: 1
  });
  return <Pagination currentPage={page} numPages={10} onChange={action('onChange')} />;
}
