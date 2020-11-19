import React from 'react';

import { getLatencySelectionFromTagFilterExpression, updateLatencySelection } from 'in-applications/analyze/utils/latencyUtils';
import FacetedExpandableCard from 'in-applications/analyze/components/FacetedSearch/FacetedExpandableCard';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import keyCodes from 'in-components/keyCodes';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import locals from './Suggestion.mless';

export default function FacetedFilterLatency({ title, dataSource, tagFilterExpression, updateFilter, isValid }) {
  return (
    <FacetedExpandableCard title={title}>
      <Body dataSource={dataSource} tagFilterExpression={tagFilterExpression} updateFilter={updateFilter} isValid={isValid} />
    </FacetedExpandableCard>
  );
}

function Body({ dataSource, tagFilterExpression, updateFilter, isValid }) {
  const [minInput, setMinInput] = React.useState('');
  const [maxInput, setMaxInput] = React.useState('');
  const [effectiveLatencies, setEffectiveLatencies] = React.useState({});
  const [isError, setError] = React.useState(false);

  React.useEffect(() => {
    setError(false);
    const retrievedEffectiveLatencies = getLatencySelectionFromTagFilterExpression(dataSource, tagFilterExpression);
    if (retrievedEffectiveLatencies) {
      setEffectiveLatencies(retrievedEffectiveLatencies);
      if (retrievedEffectiveLatencies.from) {
        setMinInput(retrievedEffectiveLatencies.from);
      } else {
        setMinInput('');
      }
      if (retrievedEffectiveLatencies.to) {
        setMaxInput(retrievedEffectiveLatencies.to);
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
              validateInputAndSetTagFilter(dataSource, minInput, maxInput, tagFilterExpression, updateFilter, setError)
            }
            onKeyDown={e =>
              e.keyCode === keyCodes.enter &&
              (effectiveLatencies.from !== minInput || isError) &&
              validateInputAndSetTagFilter(dataSource, minInput, maxInput, tagFilterExpression, updateFilter, setError)
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
              (effectiveLatencies.to !== maxInput || isError) &&
              validateInputAndSetTagFilter(dataSource, minInput, maxInput, tagFilterExpression, updateFilter, setError)
            }
            onKeyDown={e =>
              e.keyCode === keyCodes.enter &&
              (effectiveLatencies.to !== maxInput || isError) &&
              validateInputAndSetTagFilter(dataSource, minInput, maxInput, tagFilterExpression, updateFilter, setError)
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

function validateInputAndSetTagFilter(dataSource, minLatency, maxLatency, tagFilterExpression, updateFilter, setError) {
  if (minLatency > maxLatency && maxLatency !== '') {
    setError(true);
  } else {
    setError(false);
    updateLatencySelection({
      dataSource: dataSource,
      selection: {
        from: minLatency,
        to: maxLatency
      },
      tagFilterExpression: tagFilterExpression,
      updateFilter: updateFilter
    });
  }
}
