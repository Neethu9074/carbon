import { withKnobs, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import theme from 'in-themes';
import React from 'react';

import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default {
  title: 'Atoms/KpiCard',
  component: KpiCard,
  decorators: [withKnobs]
};

export const Default = () => <KpiCard value="100ms" borderless={boolean('Disabled', false)} />;
export const WithTitle = () => <KpiCard title="Title" value="Value" borderless={boolean('Disabled', false)} />;
export const WithColor = () => <KpiCard title="Errors" value="10" color={theme.lib.colors.failure} />;
export const WithCompanionValue = () => <KpiCard title="Title" value="Value" companionValue="Companion Value" />;
export const withActions = () => <KpiCard title="Title" value="Value" actions={<div>Action</div>} />;
export const WithIconAction = () => (
  <KpiCard
    title="Title"
    value="Value"
    companionValue="Companion Value"
    iconAction={{ icon: 'lib_analyze_inverted', text: 'Action', kind: 'subtle', onClick: () => action('action click') }}
  />
);
