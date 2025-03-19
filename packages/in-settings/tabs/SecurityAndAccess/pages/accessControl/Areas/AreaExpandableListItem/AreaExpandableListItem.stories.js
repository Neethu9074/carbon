/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Typography, Ul } from '@instana/components';

import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';

export default {
  component: AreaExpandableListItem
};

export const Default = args => (
  <Ul>
    <AreaExpandableListItem {...args}>
      <Typography variant="body-regular">Whatever you pass will be displayed here</Typography>
    </AreaExpandableListItem>
  </Ul>
);

Default.args = {
  iconType: 'lib_release_rocket',
  firstColumnHeadline: 'First column Headline',
  firstColumnLabel: 'First column Label',
  secondColumnHeadline: 'Second column Headline',
  secondColumnLabel: 'Second column Label'
};
