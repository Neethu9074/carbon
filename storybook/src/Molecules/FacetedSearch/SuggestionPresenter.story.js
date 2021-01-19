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
        { label: 'suggestion A', metrics: { calls_SUM_Agg: [[0, 8]] } },
        { label: 'suggestion B', metrics: { calls_SUM_Agg: [[0, 7]] } },
        { label: 'suggestion C', metrics: { calls_SUM_Agg: [[0, 6]] } },
        { label: 'suggestion D', metrics: { calls_SUM_Agg: [[0, 5]] } },
        { label: 'suggestion E', metrics: { calls_SUM_Agg: [[0, 4]] } },
        { label: 'suggestion F', metrics: { calls_SUM_Agg: [[0, 3]] } },
        { label: 'suggestion G', metrics: { calls_SUM_Agg: [[0, 2]] } },
        { label: 'suggestion H', metrics: { calls_SUM_Agg: [[0, 1]] } }
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
