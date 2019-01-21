import React from 'react';

import BarOverlay from 'in-analyze/components/filterBar/BarOverlay/BarOverlay';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Button from 'in-new-components/Button';

import locals from './NumberBarOverlayPresenter.mless';

export default function NumberBarOverlayPresenter({
  form,
  showRange,
  showEquality,
  getOnChangeHandler,
  onSubmit,
  onClear,
  unit
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
              />
            </Col>
            <Col xs={6}>
              <InputGroup
                label="not equal to"
                form={form}
                fieldId="neq"
                getOnChangeHandler={getOnChangeHandler}
                unit={unit}
              />
            </Col>
          </Row>
        )}

        {showRange && (
          <Row>
            <Col xs={6}>
              <InputGroup
                label="greater than"
                form={form}
                fieldId="gt"
                getOnChangeHandler={getOnChangeHandler}
                autoFocus={!showEquality}
                unit={unit}
              />
            </Col>
            <Col xs={6}>
              <InputGroup
                label="less than"
                form={form}
                fieldId="lt"
                getOnChangeHandler={getOnChangeHandler}
                unit={unit}
              />
            </Col>
          </Row>
        )}

        <div className={locals.actions}>
          <Button type="button" kind="action--danger" onClick={onClear}>
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

function InputGroup({ label, form, fieldId, getOnChangeHandler, autoFocus, unit }) {
  return form.get(fieldId).map(field => (
    <FormGroup withoutBottomMargin>
      <Label htmlFor={`filter-${fieldId}`} hasError={!field.valid && field.touched}>
        {label}
      </Label>
      <span className={locals.inputWithUnit}>
        <Input
          type="number"
          id={`filter-${fieldId}`}
          value={field.value || ''}
          onChange={getOnChangeHandler(fieldId)}
          hasError={!field.valid && field.touched}
          autoFocus={autoFocus}
        />
        {unit && <span>{unit}</span>}
      </span>
      <TouchedMessages field={field} />
    </FormGroup>
  ));
}
