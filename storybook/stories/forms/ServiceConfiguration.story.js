import { storiesOf } from '@storybook/react';
import React from 'react';

import CustomServiceMappingDialog from 'in-applications/Forms/CustomServiceMapping/CustomServiceMappingDialog';

import Root from '../_helpers/Root';

storiesOf('Forms/Service Configuration', module).add('Default', () => <DefaultStory />);

function DefaultStory() {
  return (
    <Root>
      <CustomServiceMappingDialog />
    </Root>
  );
}
