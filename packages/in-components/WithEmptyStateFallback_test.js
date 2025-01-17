/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { create } from '@instana/observables';

import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';

describe('in-components/WithEmptyStateFallback', () => {
  it('does not render the FallbackComponent if $HasDataToRender has not yet emitted a value', () => {
    // Given
    const $hasDataToRender = create();

    // When
    const { rerender } = render(
      <WithEmptyStateFallback
        explanation="Some Explanation"
        getHasDataToRender={() => $hasDataToRender}
        FallbackComponent={() => <div>This is the fallback</div>}
      >
        <div>This should be rendered if the fallback is not active</div>
      </WithEmptyStateFallback>
    );

    // Rerender to make sure useObservable had a chance to provide a value
    rerender(
      <WithEmptyStateFallback
        explanation="Some updated Explanation"
        getHasDataToRender={() => $hasDataToRender}
        FallbackComponent={() => <div>This is the fallback</div>}
      >
        <div>This should be rendered if the fallback is not active</div>
      </WithEmptyStateFallback>
    );

    // Then
    expect(screen.queryByText('This is the fallback')).not.toBeInTheDocument();
    expect(screen.queryByText('This should be rendered if the fallback is not active')).toBeInTheDocument();
  });
});
