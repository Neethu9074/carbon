/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Stack, Checkbox } from '@instana/components';

import { withSiPrefixOneDecimalPlace } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';

import locals from './CheckableSuggestion.mless';

export function CheckableSuggestion({ label, count, checked, onChange }) {
  return (
    <Tooltip content={`${label}`} align="rightMiddle" delay={1000} overwriteBlock>
      <Stack direction="horizontal" align="center" distribution="spaceBetween">
        <Checkbox
          checked={checked}
          label={label}
          onChange={onChange}
          labelClassName={locals.label}
          className={locals.leftAlignedCheckbox}
          size={'large'}
        />
        {count != null && <div className={locals.count}>{withSiPrefixOneDecimalPlace(count)}</div>}
      </Stack>
    </Tooltip>
  );
}
