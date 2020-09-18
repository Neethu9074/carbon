import { withKnobs, number } from '@storybook/addon-knobs';
import React from 'react';

import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import LoadingIndicator from 'in-components/LoadingIndicator';

export default {
  title: 'Molecules/Loading/Loading',
  decorators: [withKnobs]
};

export function InfiniteBar() {
  return (
    <HorizontalIndicator
      progress={{
        loading: true
      }}
    />
  );
}

export function ProgressBar() {
  return (
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
  );
}
export function Infinite() {
  return <InfiniteCircle width={400} height={100} />;
}
export function InfiniteCircleSmall() {
  return <InfiniteCircle width={72} height={24} />;
}
export function PageLoading() {
  return <LoadingIndicator type="dark" />;
}
