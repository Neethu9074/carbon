import { withKnobs, boolean } from '@storybook/addon-knobs';
import React from 'react';

import KpiCard from 'in-new-components/KpiCard/KpiCard';

import theme from 'in-themes';

export default {
  title: 'Atoms|KpiCard',
  component: KpiCard,
  decorators: [withKnobs]
};

export const Default = () => <KpiCard value="100ms" borderless={boolean('Disabled', false)} />;
export const WithTitle = () => <KpiCard title="Title" value="Value" borderless={boolean('Disabled', false)} />;
export const WithColor = () => <KpiCard title="Errors" value="10" color={theme.lib.colors.failure} />;
export const WithCompanionValue = () => <KpiCard title="Title" value="Value" companionValue="Companion Value" />;
