/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { showGt, showLt } from 'in-analyze/components/filterBar/NumberBarItemBehavior/util';
import BarOverlay from 'in-analyze/components/filterBar/BarOverlay/BarOverlay';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { Row, Col } from 'in-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './NumberBarOverlayPresenter.mless';

export default function NumberBarOverlayPresenter({
  form,
  showRange,
  showEquality,
  getOnChangeHandler,
  onSubmit,
  onClear,
  unit,
  minValue
}) {
  return (
    <BarOverlay>
      <form onSubmit={onSubmit}>
        {showEquality && (
          <Row>
            <Col xs={6}>
              <InputGroup
                label={t('in-analyze:components.filterBar.equalTo')}
                form={form}
                fieldId="eq"
                getOnChangeHandler={getOnChangeHandler}
                autoFocus
                unit={unit}
                minValue={minValue}
              />
            </Col>
            <Col xs={6}>
              <InputGroup
                label={t('in-analyze:components.filterBar.notEqualTo')}
                form={form}
                fieldId="neq"
                getOnChangeHandler={getOnChangeHandler}
                unit={unit}
                minValue={minValue}
              />
            </Col>
          </Row>
        )}

        {showRange && (
          <Row>
            <Col xs={6}>
              {(showGt(form.items.gt?.value, form.items.gte?.value) && (
                <InputGroup
                  label={t('in-analyze:components.filterBar.greaterThan')}
                  form={form}
                  fieldId="gt"
                  getOnChangeHandler={getOnChangeHandler}
                  autoFocus={!showEquality}
                  unit={unit}
                  minValue={minValue}
                />
              )) || (
                <InputGroup
                  label={t('in-analyze:components.filterBar.greaterThanOrEquals')}
                  form={form}
                  fieldId="gte"
                  getOnChangeHandler={getOnChangeHandler}
                  autoFocus={!showEquality}
                  unit={unit}
                  minValue={minValue}
                />
              )}
            </Col>
            <Col xs={6}>
              {(showLt(form.items.lt?.value, form.items.lte?.value) && (
                <InputGroup
                  label={t('in-analyze:components.filterBar.lessThan')}
                  form={form}
                  fieldId="lt"
                  getOnChangeHandler={getOnChangeHandler}
                  unit={unit}
                  minValue={minValue}
                />
              )) || (
                <InputGroup
                  label={t('in-analyze:components.filterBar.lessThanOrEquals')}
                  form={form}
                  fieldId="lte"
                  getOnChangeHandler={getOnChangeHandler}
                  unit={unit}
                  minValue={minValue}
                />
              )}
            </Col>
          </Row>
        )}

        <div className={locals.actions}>
          <Button type="button" kind="subtle" onClick={onClear}>
            {t('in-analyze:components.filterBar.clear')}
          </Button>

          <Button type="submit" kind="primaryv2" disabled={form.touched && !form.hierarchyValid}>
            {t('in-analyze:components.filterBar.save')}
          </Button>
        </div>
      </form>
    </BarOverlay>
  );
}

function InputGroup({ label, form, fieldId, getOnChangeHandler, autoFocus, unit, minValue }) {
  return form.get(fieldId).map(field => (
    <FormGroup withoutBottomMargin>
      <Label htmlFor={`filter-${fieldId}`} hasError={!field.valid && field.touched}>
        {label} {unit && `(${unit})`}
      </Label>
      <span className={locals.inputWithUnit}>
        <Input
          type="number"
          id={`filter-${fieldId}`}
          value={field.value || ''}
          onChange={getOnChangeHandler(fieldId)}
          hasError={!field.valid && field.touched}
          autoFocus={autoFocus}
          min={minValue || '0'}
        />
      </span>
      <TouchedMessages field={field} />
    </FormGroup>
  ));
}
