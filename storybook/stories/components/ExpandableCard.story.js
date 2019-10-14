import { storiesOf } from '@storybook/react';
import React from 'react';

import ExpandableCard from 'in-new-components/ExpandableCard';

export default {
  title: 'Components/ExpandableCard',
  component: ExpandableCard
};

storiesOf('Components/ExpandableCard', module)
  .addParameters({ component: ExpandableCard })
  .add('default', () => (
    <ExpandableCard title="Title">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, enim, pariatur nihil delectus animi
      architecto modi harum eligendi nam neque. Commodi, velit, sed. Nulla vel, culpa quisquam vitae dolorem rerum.
    </ExpandableCard>
  ));
