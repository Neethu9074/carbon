/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { AreaExpandableList } from './AreaExpandableList';

export default {
  component: AreaExpandableList
};

export const Default = args => <AreaExpandableList {...args}>Hello there</AreaExpandableList>;

Default.args = {
  iconType: 'lib_release_rocket',
  firstColumnHeadline: 'First column Header',
  firstColumnLabel: 'First column Label',
  secondColumnHeadline: 'Second column Header',
  secondColumnLabel: 'Second column Label'
};
