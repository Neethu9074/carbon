/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { CarbonMenuButton as MenuButton, CarbonMenuItem as MenuItem } from '@instana/components';

// @ts-expect-error
import { aggregationLabels } from 'in-stores/metric';
import { AggregationType } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-components/AnalyzeView/Charting/AggregationSelector.mless';

export type ValidAggregationSelectorAggregation = Omit<
  AggregationType,
  'P99_9' | 'P99_99' | 'DISTINCT_COUNT' | 'SUM_POSITIVE'
>;

export type AggregationSelectorOption = {
  value: ValidAggregationSelectorAggregation;
  label: string;
};

export type AggregationSelectorProps = {
  aggregations: AggregationSelectorOption[];
  selectedAggregation: ValidAggregationSelectorAggregation;
  onChange: (v: any) => void;
};

export default function AggregationSelector({ aggregations, selectedAggregation, onChange }: AggregationSelectorProps) {
  const onClick = (item: AggregationSelectorOption) => {
    if (onChange) {
      onChange(item.value);
    }
  };

  return (
    <MenuButton
      kind="ghost"
      size="sm"
      label={aggregationLabels[selectedAggregation]}
      aria-label={t('in-components:chartingConfigurator.labelChangeSelectedAggregation')}
      menuAlignment="bottom-start"
    >
      {aggregations?.length
        ? aggregations.map(item => {
            return (
              <MenuItem
                key={item.label}
                label={item.label}
                onClick={() => onClick(item)}
                className={item.value === selectedAggregation ? locals.selected : undefined}
              />
            );
          })
        : null}
    </MenuButton>
  );
}
