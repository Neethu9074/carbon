import { storiesOf } from '@storybook/react';
import React from 'react';

import HttpFilterSelect from 'in-components/HttpFilterSelect';

storiesOf('components/MultiSelect', module)
  .add('Http Filters', () => <HttpFilterSelect />);
