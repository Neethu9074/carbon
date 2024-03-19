/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Button } from '@instana/legacy';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
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
  return (
    <ComboBoxBehavior
      options={aggregations}
      value={selectedAggregation}
      disableAutomaticOptionSorting
      onChange={onChange}
      requiresCustomInteractivity
      aria-label={t('in-components:chartingConfigurator.labelChangeSelectedAggregation')}
    >
      {({ elementProps }) => (
        <Button
          {...elementProps}
          kind="subtle"
          size="compact"
          icon="lib_arrow_drop_down"
          className={locals.aggregation}
        >
          <span>{aggregationLabels[selectedAggregation]}</span>
        </Button>
      )}
    </ComboBoxBehavior>
  );
}
