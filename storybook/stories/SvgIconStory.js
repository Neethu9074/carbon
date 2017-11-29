import { storiesOf } from '@storybook/react';
import React from 'react';

import { SvgIconList } from 'in-components/SvgIcon';

import './SvgIconStory.less';

storiesOf('SvgIcon', module)
  .add('all icons', () => (
    <SvgIconList className="story-svg-icons" />
  ));
