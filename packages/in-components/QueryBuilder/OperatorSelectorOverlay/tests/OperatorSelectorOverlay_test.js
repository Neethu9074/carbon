/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import { render } from '@testing-library/react';
import React from 'react';

import OperatorSelectorOverlay from 'in-components/QueryBuilder/OperatorSelectorOverlay/OperatorSelectorOverlay';

describe('OperatorSelectorOverlay', () => {
  it('filters REGEX_MATCH when shouldFilterRegex is true', () => {
    const allowedOperators = ['EQUALS', 'REGEX_MATCH'];
    const { queryByText } = render(
      <OperatorSelectorOverlay
        value="EQUALS"
        allowedOperators={allowedOperators}
        onChange={() => {}}
        close={() => {}}
        tagType="SOME_TYPE"
        source="logs"
      />
    );

    expect(queryByText(/REGEX_MATCH/)).toBeNull();
  });
});
