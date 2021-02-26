/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import React from 'react';

import {
  toBackendQueryModel,
  getRangeFromBackendQueryModel,
  updateRange
} from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import FacetedExpandableCard from 'in-new-components/AnalyzeView/FacetedFilters/FacetedExpandableCard';
import { ua2FacetedSearchFilterAddedTracker } from 'in-new-components/tracker';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import keyCodes from 'in-components/keyCodes';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './FacetedFilterRangeInput.mless';

export default function FacetedFilterRangeInput({
  title,
  tag,
  formModel,
  updateFilter,
  isValid,
  openByDefault,
  unit,
  dataSource
}) {
  return (
    <FacetedExpandableCard title={title} openByDefault={openByDefault}>
      <Body
        tag={tag}
        formModel={formModel}
        updateFilter={updateFilter}
        isValid={isValid}
        unit={unit}
        dataSource={dataSource}
      />
    </FacetedExpandableCard>
  );
}

function Body({ tag, formModel, updateFilter, isValid, unit, dataSource }) {
  const [minInput, setMinInput] = React.useState('');
  const [maxInput, setMaxInput] = React.useState('');
  const [effectiveRange, setEffectiveRange] = React.useState({});
  const [isError, setError] = React.useState(false);

  React.useEffect(() => {
    setError(false);
    const retrievedEffectiveRange = getRangeFromBackendQueryModel(tag, toBackendQueryModel(formModel));
    if (retrievedEffectiveRange) {
      setEffectiveRange(retrievedEffectiveRange);
      if (retrievedEffectiveRange.from != null) {
        setMinInput(retrievedEffectiveRange.from);
      } else {
        setMinInput('');
      }
      if (retrievedEffectiveRange.to != null) {
        setMaxInput(retrievedEffectiveRange.to);
      } else {
        setMaxInput('');
      }
    } else if (isValid) {
      setMinInput('');
      setMaxInput('');
    }
  }, [tag, isValid, formModel]);

  return (
    <Row withoutTopMargin>
      <Col md={6}>
        <FormGroup className={locals.rangeForm}>
          <Label htmlFor="range-min" hasError={isError}>
            {unit ? t('in-new-components:analyze.fromUnit', { unit: unit }) : t('in-new-components:analyze.from')}
          </Label>
          <Input
            id="range-min"
            className={locals.rangeInput}
            value={minInput}
            type="number"
            hasError={isError}
            onChange={e => (Number(e.target.value) > 0 ? setMinInput(Number(e.target.value)) : setMinInput(''))}
            onBlur={() =>
              (effectiveRange.from !== minInput || isError) &&
              validateInputAndSetTagFilter(tag, minInput, maxInput, formModel, updateFilter, setError, dataSource)
            }
            onKeyDown={e =>
              e.keyCode === keyCodes.enter &&
              (effectiveRange.from !== minInput || isError) &&
              validateInputAndSetTagFilter(tag, minInput, maxInput, formModel, updateFilter, setError, dataSource)
            }
          />
        </FormGroup>
      </Col>

      <Col md={6}>
        <FormGroup className={locals.rangeForm}>
          <Label htmlFor="range-max" hasError={isError}>
            {unit ? t('in-new-components:analyze.toUnit', { unit: unit }) : t('in-new-components:analyze.to')}
          </Label>
          <Input
            id="range-max"
            className={locals.rangeInput}
            value={maxInput}
            type="number"
            hasError={isError}
            onChange={e => (Number(e.target.value) > 0 ? setMaxInput(Number(e.target.value)) : setMaxInput(''))}
            onBlur={() =>
              (effectiveRange.to !== maxInput || isError) &&
              validateInputAndSetTagFilter(tag, minInput, maxInput, formModel, updateFilter, setError, dataSource)
            }
            onKeyDown={e =>
              e.keyCode === keyCodes.enter &&
              (effectiveRange.to !== maxInput || isError) &&
              validateInputAndSetTagFilter(tag, minInput, maxInput, formModel, updateFilter, setError, dataSource)
            }
          />
        </FormGroup>
      </Col>
      {isError && (
        <ValidationBlock className={locals.errorMessage}>{t('in-new-components:analyze.rangeOrder')}</ValidationBlock>
      )}
    </Row>
  );
}

function validateInputAndSetTagFilter(tag, minInput, maxInput, formModel, updateFilter, setError, dataSource) {
  if (minInput > maxInput && maxInput !== '') {
    setError(true);
  } else {
    setError(false);
    ua2FacetedSearchFilterAddedTracker({ dataSource, tagName: tag });
    updateRange({
      tag: tag,
      selection: {
        from: minInput,
        to: maxInput
      },
      backendQueryModel: toBackendQueryModel(formModel),
      updateFilter: updateFilter
    });
  }
}
