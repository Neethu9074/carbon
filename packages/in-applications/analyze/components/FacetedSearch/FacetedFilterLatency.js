import React from 'react';

import { EQUALS, GREATER_OR_EQUAL_THAN, LESS_OR_EQUAL_THAN } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { getLatencySelectionFromFilters } from 'in-new-components/LatencyDistributionBase10Chart/latencyUtils';
import FacetedExpandableCard from 'in-applications/analyze/components/FacetedSearch/FacetedExpandableCard';
import { EXPRESSION, OPERATOR_AND } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import keyCodes from 'in-components/keyCodes';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import locals from './Suggestion.mless';

const CALL_LATENCY = 'call.latency';

export default function FacetedFilterGeneric({ title, tagFilterExpression, updateFilter, isValid }) {
  return (
    <FacetedExpandableCard title={title}>
      <Body tagFilterExpression={tagFilterExpression} updateFilter={updateFilter} isValid={isValid} />
    </FacetedExpandableCard>
  );
}

function Body({ tagFilterExpression, updateFilter, isValid }) {
  const [minInput, setMinInput] = React.useState('');
  const [maxInput, setMaxInput] = React.useState('');
  const [effectiveLatencies, setEffectiveLatencies] = React.useState({});
  const [isError, setError] = React.useState(false);

  React.useEffect(() => {
    setError(false);
    const retrievedEffectiveLatencies = getMinMaxLatencyFromExpression(tagFilterExpression);
    if (retrievedEffectiveLatencies) {
      setEffectiveLatencies(retrievedEffectiveLatencies);
      if (retrievedEffectiveLatencies.from) {
        setMinInput(retrievedEffectiveLatencies.from);
      } else {
        setMinInput('');
      }
      if (retrievedEffectiveLatencies.to) {
        setMaxInput(retrievedEffectiveLatencies.to - 1);
      } else {
        setMaxInput('');
      }
    } else if (isValid) {
      setMinInput('');
      setMaxInput('');
    }
  }, [tagFilterExpression]);

  return (
    <Row withoutTopMargin>
      <Col md={6}>
        <FormGroup className={locals.latencyForm}>
          <Label htmlFor="latency-min" hasError={isError}>
            From (ms)
          </Label>
          <Input
            id="latency-min"
            value={minInput}
            type="number"
            hasError={isError}
            onChange={e => (Number(e.target.value) > 0 ? setMinInput(Number(e.target.value)) : setMinInput(''))}
            onBlur={() =>
              (effectiveLatencies.from !== minInput || isError) &&
              validateInputAndSetTagFilter(minInput, maxInput, tagFilterExpression, updateFilter, setError)
            }
            onKeyDown={e =>
              e.keyCode === keyCodes.enter &&
              (effectiveLatencies.from !== minInput || isError) &&
              validateInputAndSetTagFilter(minInput, maxInput, tagFilterExpression, updateFilter, setError)
            }
          />
        </FormGroup>
      </Col>

      <Col md={6}>
        <FormGroup className={locals.latencyForm}>
          <Label htmlFor="latency-max" hasError={isError}>
            To (ms)
          </Label>
          <Input
            id="latency-max"
            value={maxInput}
            type="number"
            hasError={isError}
            onChange={e => (Number(e.target.value) > 0 ? setMaxInput(Number(e.target.value)) : setMaxInput(''))}
            onBlur={() =>
              (effectiveLatencies.to - 1 !== maxInput || isError) &&
              validateInputAndSetTagFilter(minInput, maxInput, tagFilterExpression, updateFilter, setError)
            }
            onKeyDown={e =>
              e.keyCode === keyCodes.enter &&
              (effectiveLatencies.to - 1 !== maxInput || isError) &&
              validateInputAndSetTagFilter(minInput, maxInput, tagFilterExpression, updateFilter, setError)
            }
          />
        </FormGroup>
      </Col>
      {isError && (
        <ValidationBlock className={locals.errorMessage}>
          The latency range has to be in ascending order.
        </ValidationBlock>
      )}
    </Row>
  );
}

function validateInputAndSetTagFilter(minLatency, maxLatency, tagFilterExpression, updateFilter, setError) {
  if (minLatency > maxLatency && maxLatency !== '') {
    setError(true);
  } else {
    setError(false);
    buildAndSetTagFilter(minLatency, maxLatency, tagFilterExpression, updateFilter);
  }
}

function buildAndSetTagFilter(minLatency, maxLatency, tagFilterExpression, updateFilter) {
  const removedFilters = getFiltersToRemove(tagFilterExpression);
  let minFilter, maxFilter;
  if (typeof minLatency === 'number') {
    minFilter = {
      type: TAG,
      name: CALL_LATENCY,
      operator: GREATER_OR_EQUAL_THAN,
      value: minLatency
    };
  }
  if (typeof maxLatency === 'number') {
    maxFilter = {
      type: TAG,
      name: CALL_LATENCY,
      operator: LESS_OR_EQUAL_THAN,
      value: maxLatency
    };
  }
  if (minFilter && maxFilter) {
    if (minFilter.value === maxFilter.value) {
      updateFilter({
        add: [
          {
            type: TAG,
            name: CALL_LATENCY,
            operator: EQUALS,
            value: minLatency
          }
        ],
        remove: removedFilters
      });
    } else {
      updateFilter({
        add: [minFilter, maxFilter],
        remove: removedFilters
      });
    }
  } else if (minFilter) {
    updateFilter({
      add: [minFilter],
      remove: removedFilters
    });
  } else if (maxFilter) {
    updateFilter({
      add: [maxFilter],
      remove: removedFilters
    });
  } else {
    updateFilter({
      remove: removedFilters
    });
  }
}

function getFiltersToRemove(tagFilterExpression) {
  if (tagFilterExpression.type === EXPRESSION && tagFilterExpression.logicalOperator === OPERATOR_AND) {
    return tagFilterExpression.elements.filter(
      element => element.type === TAG_FILTER_TYPE && element.name === CALL_LATENCY
    );
  } else if (tagFilterExpression.type === TAG_FILTER_TYPE && tagFilterExpression.name === CALL_LATENCY) {
    return [tagFilterExpression];
  }
}

function getMinMaxLatencyFromExpression(tagFilterExpression) {
  if (tagFilterExpression.type === EXPRESSION && tagFilterExpression.logicalOperator === OPERATOR_AND) {
    return getLatencySelectionFromFilters(CALL_LATENCY, tagFilterExpression.elements);
  }
  if (tagFilterExpression.type === TAG_FILTER_TYPE && tagFilterExpression.name === CALL_LATENCY) {
    return getLatencySelectionFromFilters(CALL_LATENCY, [tagFilterExpression]);
  }
}
