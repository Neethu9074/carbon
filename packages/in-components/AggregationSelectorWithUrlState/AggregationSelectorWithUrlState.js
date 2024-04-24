/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Select } from '@instana/components';

import { aggregationLabels } from 'in-stores/metric/metric';
import useUrlState from 'in-hooks/useUrlState';

import locals from './AggregationSelectorWithUrlState.mless';

const options = ['MEAN', 'MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX'];

export default function AggregationSelectorWithUrlState({
  defaultAggregation,
  urlMatrixParamConfig: { path, paramName },
  children: Children
}) {
  const urlStateDefinition = {
    bind: [
      {
        path: path,
        name: paramName
      }
    ]
  };
  const [urlState, setUrlState] = useUrlState(urlStateDefinition);
  const aggregation = urlState[paramName];

  return (
    <Children
      aggregation={aggregation || defaultAggregation}
      aggregationSelector={
        <Select
          className={locals.selector}
          value={aggregation || defaultAggregation}
          onChange={e => setUrlState({ [paramName]: e.target.value || defaultAggregation })}
        >
          {options.map(option => (
            <option value={option} key={option}>
              {aggregationLabels[option]}
            </option>
          ))}
        </Select>
      }
    />
  );
}

AggregationSelectorWithUrlState.propTypes = {
  defaultAggregation: PropTypes.string.isRequired,
  urlMatrixParamConfig: PropTypes.shape({
    path: PropTypes.string.isRequired,
    paramName: PropTypes.string.isRequired
  }).isRequired,
  children: PropTypes.func.isRequired
};
