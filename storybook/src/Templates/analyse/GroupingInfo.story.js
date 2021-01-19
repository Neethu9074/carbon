/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { withKnobs, text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import React from 'react';

import GroupingInfo from 'in-analyze/components/GroupingInfo/GroupingInfo';

export default {
  title: 'Templates|analyze/GroupingInfo',
  component: GroupingInfo,
  decorators: [withKnobs]
};

export function Default() {
  return (
    <GroupingInfo
      group={{
        groupbyTag: text('Tag', 'docker.label'),
        groupbyTagSecondLevelKey: text('Key', 'environment')
      }}
      disableGrouping={action('disableGrouping')}
      openEditGroupDialog={action('openEditGroupDialog')}
    />
  );
}
