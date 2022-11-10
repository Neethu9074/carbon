/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React from 'react';

import KpiCard from 'in-components/KpiCard/KpiCard';
import theme from 'in-themes';

export default {
  component: KpiCard
};

export const Default = ({ disabled }) => <KpiCard value="100ms" borderless={disabled} />;
Default.args = { disabled: false };

export const WithTitle = ({ disabled }) => <KpiCard title="Title" value="Value" borderless={disabled} />;
WithTitle.args = { disabled: false };

export const WithRaw = ({ disabled }) => <KpiCard title="Title" value="10ms" borderless={disabled} raw />;
WithRaw.args = { disabled: false };

export const UndefinedValue = () => <KpiCard title="Title" />;
export const UndefinedValueRaw = () => <KpiCard title="Title" raw />;

export const NullValue = () => <KpiCard title="Title" value={null} />;
export const NullValueRaw = () => <KpiCard title="Title" value={null} raw />;

export const FalseValue = () => <KpiCard title="Title" value={false} />;
export const FalseValueRaw = () => <KpiCard title="Title" value={false} raw />;

export const WithColor = () => <KpiCard title="Errors" value="10" color={theme.lib.colors.failure} />;
export const WithCompanionValue = () => <KpiCard title="Title" value="Value" companionValue="Companion Value" />;
export const withActions = () => <KpiCard title="Title" value="Value" actions={<div>Action</div>} />;
export const WithIconAction = () => (
  <KpiCard
    title="Title"
    value="Value"
    companionValue="Companion Value"
    iconAction={{
      icon: 'lib_analyze_inverted',
      text: 'Action',
      kind: 'subtle',
      onClick: () => action('action click')
    }}
  />
);
export const WithApproximateData = () => (
  <KpiCard title="Title" value="Value" resultPrecision={'PRECISION_APPROXIMATE'} />
);
