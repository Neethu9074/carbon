/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render, cleanup } from '@testing-library/react';
import React from 'react';

import { Select } from '@instana/components';

import AggregationSelectorWithUrlState from 'in-components/AggregationSelectorWithUrlState';
import useUrlState from 'in-hooks/useUrlState';

const mockSetUrlState = jest.fn();

jest.mock('in-hooks/useUrlState', () => ({
  default: jest.fn(() => [{}, mockSetUrlState]),
  __esModule: true
}));

jest.mock('@instana/components', () => ({
  ...jest.requireActual('@instana/components'),
  Select: jest.fn(() => <div />)
}));

describe('in-components/AggregationSelectorWithUrlState', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('uses defaultAggregation when there is not aggregation found in the url state', () => {
    // GIVEN
    const children = jest.fn(({ aggregationSelector }) => <div> {aggregationSelector} </div>);

    // WHEN
    render(
      <AggregationSelectorWithUrlState
        defaultAggregation="foobar"
        urlMatrixParamConfig={{
          path: '',
          paramName: ''
        }}
      >
        {children}
      </AggregationSelectorWithUrlState>
    );

    // THEN
    expect(children).toBeCalledWith(
      expect.objectContaining({
        aggregation: 'foobar'
      }),
      expect.anything()
    );
    expect(Select).toBeCalledWith(
      expect.objectContaining({
        value: 'foobar'
      }),
      expect.anything()
    );
  });

  test('uses aggregation from url state if present', () => {
    // GIVEN
    const paramName = 'mockAgg';
    const urlState = { mockAgg: 'P99' };
    useUrlState.mockReturnValueOnce([urlState, mockSetUrlState]);
    const children = jest.fn(() => <div />);

    // WHEN
    render(
      <AggregationSelectorWithUrlState
        defaultAggregation="foobar"
        urlMatrixParamConfig={{
          path: '',
          paramName
        }}
      >
        {children}
      </AggregationSelectorWithUrlState>
    );

    // THEN
    expect(children).toBeCalledWith(
      expect.objectContaining({
        aggregation: 'P99'
      }),
      expect.anything()
    );
  });

  test('updates url state on selection change', () => {
    // GIVEN
    const children = jest.fn(({ aggregationSelector }) => <div> {aggregationSelector} </div>);

    // WHEN
    render(
      <AggregationSelectorWithUrlState
        defaultAggregation="foobar"
        urlMatrixParamConfig={{
          path: '',
          paramName: 'foobar'
        }}
      >
        {children}
      </AggregationSelectorWithUrlState>
    );
    Select.mock.calls[0][0].onChange({ target: { value: 'P50' } });

    // THEN
    expect(mockSetUrlState).toBeCalledWith(
      expect.objectContaining({
        foobar: 'P50'
      })
    );
  });
});
