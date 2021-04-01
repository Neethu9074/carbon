/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import React from 'react';

import SuggestionsPresenter from 'in-applications/analyze/components/FacetedSearch/SuggestionsPresenter';

export default {
  title: 'Molecules|FacetedSearch/Suggestion',
  component: SuggestionsPresenter,
  decorator: { text, action }
};

export const Default = () => (
  <div>
    <SuggestionsPresenter
      suggestions={[
        { value: 'suggestion A', metrics: { calls_SUM_Agg: [[0, 8]] } },
        { value: 'suggestion B', metrics: { calls_SUM_Agg: [[0, 7]] } },
        { value: 'suggestion C', metrics: { calls_SUM_Agg: [[0, 6]] } },
        { value: 'suggestion D', metrics: { calls_SUM_Agg: [[0, 5]] } },
        { value: 'suggestion E', metrics: { calls_SUM_Agg: [[0, 4]] } },
        { value: 'suggestion F', metrics: { calls_SUM_Agg: [[0, 3]] } },
        { value: 'suggestion G', metrics: { calls_SUM_Agg: [[0, 2]] } },
        { value: 'suggestion H', metrics: { calls_SUM_Agg: [[0, 1]] } }
      ]}
      addFilter={() => alert('add filter')}
      tag="tag"
      dataSource="calls"
    />
  </div>
);
export const Loading = () => (
  <div>
    <SuggestionsPresenter loading />
  </div>
);

export const Errors = () => (
  <div>
    <SuggestionsPresenter
      errors={[
        { code: 1, message: 'error 1' },
        { code: 2, message: 'error 2' },
        { code: 3, message: 'error 3' }
      ]}
    />
  </div>
);
export const NoResult = () => (
  <div>
    <SuggestionsPresenter suggestions={[]} />
  </div>
);
