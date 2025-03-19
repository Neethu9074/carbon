/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React from 'react';

import { themes } from '@instana/design-tokens';

import KpiCard from 'in-components/KpiCard/KpiCard';

export default {
  component: KpiCard,
  args: {
    value: '100ms'
  }
};

export const Default = { args: { borderless: false } };

export const WithTitle = { args: { ...Default.args, value: 'Value', title: 'Title' } };

export const WithRaw = { args: { ...WithTitle.args, value: '10ms', raw: true } };

export const UndefinedValue = { args: { ...Default.args, title: 'Title' } };
export const UndefinedValueRaw = { args: { ...UndefinedValue.args, raw: true } };

export const NullValue = { args: { ...UndefinedValue.args, title: 'Title', value: null } };
export const NullValueRaw = { args: { ...NullValue.args, raw: true } };

export const FalseValue = { args: { ...UndefinedValue.args, title: 'Title', value: false } };
export const FalseValueRaw = { args: { ...FalseValue.args, raw: true } };

export const WithColor = {
  args: { ...Default.args, value: '10', title: 'Errors', color: themes.default.ids.color.option.red['500'] }
};
export const WithCompanionValue = { args: { ...WithTitle.args, companionValue: 'Companion Value' } };
export const WithActions = { args: { ...WithTitle.args, actions: <div>Action</div> } };
export const WithIconAction = {
  args: {
    ...WithTitle.args,
    companionValue: 'Companion Value',
    iconAction: {
      icon: 'lib_analyze_inverted',
      text: 'Action',
      kind: 'subtle',
      onClick: () => action('action click')
    }
  }
};
export const WithApproximateData = { args: { ...WithTitle.args, resultPrecision: 'PRECISION_APPROXIMATE' } };
