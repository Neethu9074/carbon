import { withKnobs, text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import GroupingInfo from 'in-analyze/components/GroupingInfo/GroupingInfo';

import Root from '../_helpers/Root';

storiesOf('Analyse/GroupingInfo', module)
  .addDecorator(withKnobs)
  .add('Default', () => <Default />);

function Default() {
  return (
    <Root>
      <GroupingInfo
        group={{
          groupbyTag: text('Tag', 'docker.label'),
          groupbyTagSecondLevelKey: text('Key', 'environment')
        }}
        disableGrouping={action('disableGrouping')}
        openEditGroupDialog={action('openEditGroupDialog')}
      />
    </Root>
  );
}
