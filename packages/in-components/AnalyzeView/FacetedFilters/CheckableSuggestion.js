/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { uniqueId } from 'lodash';
import React from 'react';

import { Stack, Checkbox } from '@instana/components';

import { approximateValueIndicator } from 'in-components/AnalyzeView/FacetedFilters/approximateValueIndicator';
import { withSiPrefixOneDecimalPlace } from 'in-services/formatters/number';
import { twoDigitApproximation } from 'in-components/AnalyzeView/utils.ts';
import Tooltip from 'in-components/Tooltip';

import locals from './CheckableSuggestion.mless';

export function CheckableSuggestion({ label, count, checked, onChange }) {
  const id = uniqueId('suglab_');
  return (
    <Tooltip content={`${label}`} align="rightMiddle" delay={1000} overwriteBlock>
      <Stack direction="horizontal" align="center" distribution="spaceBetween">
        <Checkbox id={id} checked={checked} label={label} onChange={onChange} labelClassName={locals.label} />
        {count && (
          <div aria-describedby={id} className={locals.count}>
            <span>{approximateValueIndicator} </span>
            <span>{withSiPrefixOneDecimalPlace(twoDigitApproximation(count))}</span>
          </div>
        )}
      </Stack>
    </Tooltip>
  );
}
