/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Stack } from '@instana/components';

import { withSiPrefixOneDecimalPlace } from 'in-services/formatters/number';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import Tooltip from 'in-components/Tooltip';

import locals from './CheckableSuggestion.mless';

export function CheckableSuggestion({ label, count, checked, onChange }) {
  return (
    <Tooltip content={String(label)} align="rightMiddle" delay={1000}>
      <Stack direction="horizontal" align="center" distribution="spaceBetween">
        <CheckboxFancy
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
