/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SvgIconSizes } from '@instana/components';
import { themes } from '@instana/design-tokens';

import IndeterminateLoadingIndicator from 'in-components/LoadingIndicators/IndeterminateLoadingIndicator';

export default {
  component: IndeterminateLoadingIndicator
};

export const Default = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <IndeterminateLoadingIndicator />
    </div>
  ),

  name: 'default'
};

export const CustomStyles = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <IndeterminateLoadingIndicator
        customStyle={{
          strokeWidth: 1.75,
          pillTopFillColor: themes.default.ids.color.option.blue['400'],
          hexagonFillColor: themes.default.ids.color.option.neutral['300']
        }}
        size={SvgIconSizes.xl}
      />
    </div>
  ),

  name: 'custom styles'
};
