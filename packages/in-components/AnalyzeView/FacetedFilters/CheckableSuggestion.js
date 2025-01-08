/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { uniqueId } from 'lodash';
import React from 'react';

import { CarbonCheckbox as Checkbox } from '@instana/components';

import { approximateValueIndicator } from 'in-components/AnalyzeView/FacetedFilters/approximateValueIndicator';
import { withSiPrefixOneDecimalPlace } from 'in-services/formatters/number';
import { twoDigitApproximation } from 'in-components/AnalyzeView/utils.ts';
import Tooltip from 'in-components/Tooltip';

import locals from './CheckableSuggestion.mless';

export function CheckableSuggestion({ label, count, checked, onChange }) {
  const id = uniqueId('suglab_');
  const cid = uniqueId('sugchk_');
  const labelText = <div className={locals.label}>{label}</div>;
  return (
    <Tooltip content={`${label}`} align="rightMiddle" delay={1000} overwriteBlock>
      <div className={locals.checkableSuggestion}>
        <Checkbox id={cid} aria-describedby={id} checked={checked} labelText={labelText} onChange={onChange} />
        {count && (
          <div id={id} className={locals.count}>
            <span>{approximateValueIndicator} </span>
            <span>{withSiPrefixOneDecimalPlace(twoDigitApproximation(count))}</span>
          </div>
        )}
      </div>
    </Tooltip>
  );
}
