/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { Ul } from '@instana/components';

import { GroupExpandableToggleListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/GroupExpandableToggleListItem';

export default {
  component: GroupExpandableToggleListItem
};

export const Default = args => {
  const [isExpanded, setIsExpanded] = useState(false);

  const onToggle = () => setIsExpanded(prevState => !prevState);

  return (
    <Ul>
      <GroupExpandableToggleListItem {...args} isExpanded={isExpanded} onToggle={onToggle}>
        Hello there
      </GroupExpandableToggleListItem>
    </Ul>
  );
};

Default.args = {
  headline: 'This is a headline',
  iconType: 'lib_release_rocket',
  id: 'testAriaId',
  isBeta: true
};

Default.argTypes = {
  isExpanded: {
    control: false
  }
};
