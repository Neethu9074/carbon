import { withKnobs, number } from '@storybook/addon-knobs/react';
import React from 'react';

import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import LoadingIndicator from 'in-components/LoadingIndicator';

export default {
  title: 'Molecules|Loading/Loading',
  decorators: [withKnobs]
};

export function LoadingStory() {
  return (
    <>
      <h2>Infinite Bar</h2>
      <HorizontalIndicator
        progress={{
          loading: true
        }}
      />

      <h2>Progress Bar</h2>
      <HorizontalIndicator
        progress={{
          loading: true,
          percentage: number('Percentage', 0.5, {
            range: true,
            min: 0,
            max: 1,
            step: 0.01
          })
        }}
      />

      <h2>Infinite Circle default</h2>
      <InfiniteCircle width={400} height={100} />

      <h2>Infinite Circle small</h2>
      <InfiniteCircle width={72} height={24} />

      <h2>Page Loading</h2>
      <LoadingIndicator type="dark" />
    </>
  );
}
