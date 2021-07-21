/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';

import { Link } from '@instana/components';

import { addFacetItem, getRangesFromFacets, removeFacetTag } from 'in-components/AnalyzeView/FacetedFilters/facets';
import FacetedExpandableCard from 'in-components/AnalyzeView/FacetedFilters/FacetedExpandableCard';
import { ua2FacetedSearchFilterAddedTracker } from 'in-components/tracker';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { Col, Row } from 'in-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import { isReturn } from 'in-components/keyCodes';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './FacetedFilterRangeInput.mless';

export default function FacetedFilterRangeInput({
  title,
  tag,
  facets,
  updateFacets,
  resetFacets,
  openByDefault,
  unit,
  dataSource,
  stickyHeader
}) {
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const [effectiveRange, setEffectiveRange] = useState({});
  const [isErroneous, setError] = useState(false);

  useEffect(() => {
    setError(false);
    const retrievedEffectiveRange = getRangesFromFacets(facets, tag)[0];
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
    }
  }, [tag, facets]);

  const subTitle =
    !isErroneous && isValidNumberRange(minInput, maxInput) ? t('in-components:analyze.rangeSelected') : undefined;

  return (
    <FacetedExpandableCard
      title={title}
      subtitle={subTitle}
      openByDefault={openByDefault}
      tag={tag}
      dataSource={dataSource}
      stickyHeader={stickyHeader}
    >
      <Row withoutTopMargin>
        <Col md={6}>
          <FormGroup className={locals.rangeForm}>
            <Label htmlFor="range-min" hasError={isErroneous}>
              {unit ? t('in-components:analyze.fromUnit', { unit: unit }) : t('in-components:analyze.from')}
            </Label>
            <Input
              id="range-min"
              className={locals.rangeInput}
              value={minInput}
              type="number"
              hasError={isErroneous}
              onChange={e => (Number(e.target.value) > 0 ? setMinInput(Number(e.target.value)) : setMinInput(''))}
              onBlur={() =>
                (effectiveRange.from !== minInput || isErroneous) &&
                validateInputAndSetFacetFilter(tag, minInput, maxInput, facets, updateFacets, setError, dataSource)
              }
              onKeyDown={e =>
                isReturn(e) &&
                (effectiveRange.from !== minInput || isErroneous) &&
                validateInputAndSetFacetFilter(tag, minInput, maxInput, facets, updateFacets, setError, dataSource)
              }
            />
          </FormGroup>
        </Col>

        <Col md={6}>
          <FormGroup className={locals.rangeForm}>
            <Label htmlFor="range-max" hasError={isErroneous}>
              {unit ? t('in-components:analyze.toUnit', { unit: unit }) : t('in-components:analyze.to')}
            </Label>
            <Input
              id="range-max"
              className={locals.rangeInput}
              value={maxInput}
              type="number"
              hasError={isErroneous}
              onChange={e => (Number(e.target.value) > 0 ? setMaxInput(Number(e.target.value)) : setMaxInput(''))}
              onBlur={() =>
                (effectiveRange.to !== maxInput || isErroneous) &&
                validateInputAndSetFacetFilter(tag, minInput, maxInput, facets, updateFacets, setError, dataSource)
              }
              onKeyDown={e =>
                isReturn(e) &&
                (effectiveRange.to !== maxInput || isErroneous) &&
                validateInputAndSetFacetFilter(tag, minInput, maxInput, facets, updateFacets, setError, dataSource)
              }
            />
          </FormGroup>
        </Col>
        {isErroneous && (
          <ValidationBlock className={locals.errorMessage}>{t('in-components:analyze.rangeOrder')}</ValidationBlock>
        )}
      </Row>
      {isValidNumberRange(minInput, maxInput) && (
        <div className={locals.buttonRow}>
          <Link href={resetFacets?.(tag)} className={locals.clearFacet}>
            {t('in-components:analyze.clearFacet')}
          </Link>
        </div>
      )}
    </FacetedExpandableCard>
  );
}

const isString = value => typeof value === 'string';

function validateInputAndSetFacetFilter(
  tag,
  minInput,
  maxInput,
  facetedSearchSelection,
  updateFacets,
  setError,
  dataSource
) {
  if (minInput > maxInput && maxInput !== '') {
    setError(true);
  } else {
    setError(false);
    ua2FacetedSearchFilterAddedTracker({ dataSource, tagName: tag });
    const removedRange = removeFacetTag(facetedSearchSelection, tag);
    if (!isValidNumberRange(minInput, maxInput)) {
      updateFacets(removedRange);
    } else {
      updateFacets(addFacetItem(removedRange, tag, { from: minInput, to: maxInput }));
    }
  }
}

function isValidNumberRange(minInput, maxInput) {
  return !((minInput <= 0 && maxInput <= 0) || (isString(minInput) && isString(maxInput)));
}
