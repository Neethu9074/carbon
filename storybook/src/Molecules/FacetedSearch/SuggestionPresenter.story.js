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
        'suggestion A',
        'suggestion B',
        'suggestion C',
        'suggestion D',
        'suggestion E',
        'suggestion F',
        'suggestion G',
        'suggestion H'
      ]}
      addFilter={() => alert('add filter')}
      tag="tag"
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
    <SuggestionsPresenter errors={['error 1', 'error 2', 'error 3']} />
  </div>
);
export const NoResult = () => (
  <div>
    <SuggestionsPresenter suggestions={[]} />
  </div>
);
