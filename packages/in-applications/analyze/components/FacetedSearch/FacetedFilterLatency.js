/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  getLatencySelectionFromTagFilterExpression,
  updateLatencySelection
} from 'in-applications/analyze/utils/latencyUtils';
import FacetedExpandableCard from 'in-applications/analyze/components/FacetedSearch/FacetedExpandableCard';
import { ua2FacetedSearchFilterAddedTracker } from 'in-applications/tracker';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import keyCodes from 'in-components/keyCodes';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './Suggestion.mless';

export default function FacetedFilterLatency({
  title,
  dataSource,
  tagFilterExpression,
  updateFilter,
  isValid,
  openByDefault
}) {
  return (
    <FacetedExpandableCard title={title} openByDefault={openByDefault}>
      <Body
        dataSource={dataSource}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        isValid={isValid}
      />
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
      if (retrievedEffectiveLatencies.from != null) {
        setMinInput(retrievedEffectiveLatencies.from);
      } else {
        setMinInput('');
      }
      if (retrievedEffectiveLatencies.to != null) {
        setMaxInput(retrievedEffectiveLatencies.to);
      } else {
        setMaxInput('');
      }
    } else if (isValid) {
      setMinInput('');
      setMaxInput('');
    }
  }, [isValid, dataSource, tagFilterExpression]);

  return (
    <Row withoutTopMargin>
      <Col md={6}>
        <FormGroup className={locals.latencyForm}>
          <Label htmlFor="latency-min" hasError={isError}>
            {t('in-applications:analyze.fromMs')}
          </Label>
          <Input
            id="latency-min"
            className={locals.latencyInput}
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
            {t('in-applications:analyze.toMs')}
          </Label>
          <Input
            id="latency-max"
            className={locals.latencyInput}
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
          {t('in-applications:analyze.theLatencyRangeHasToBeInAscendingOrder')}
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
    ua2FacetedSearchFilterAddedTracker({ dataSource, tagName: dataSourceConstants[dataSource].latencyTag });
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
