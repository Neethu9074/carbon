/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { showGt, showLt } from 'in-analyze/components/filterBar/NumberBarItemBehavior/util';
import BarOverlay from 'in-analyze/components/filterBar/BarOverlay/BarOverlay';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

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
                label="equal to"
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
                label="not equal to"
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
                  label="greater than"
                  form={form}
                  fieldId="gt"
                  getOnChangeHandler={getOnChangeHandler}
                  autoFocus={!showEquality}
                  unit={unit}
                  minValue={minValue}
                />
              )) || (
                <InputGroup
                  label="greater than or equals"
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
                  label="less than"
                  form={form}
                  fieldId="lt"
                  getOnChangeHandler={getOnChangeHandler}
                  unit={unit}
                  minValue={minValue}
                />
              )) || (
                <InputGroup
                  label="less than or equals"
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
            Clear
          </Button>

          <Button type="submit" kind="primaryv2" disabled={form.touched && !form.hierarchyValid}>
            Save
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
