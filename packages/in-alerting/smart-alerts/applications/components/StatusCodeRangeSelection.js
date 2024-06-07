/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Stack } from '@instana/components';

import TouchedMessages from 'in-components/form/TouchedMessages';
import { Col, Row } from 'in-components/layout/Grid';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import locals from './StatusCodeRangeSelection.mless';

export default function StatusCodeRangeSelection({
  startField,
  endField,
  onStartSelectionUpdate,
  onEndSelectionUpdate,
  tearSheetView
}) {
  const startHasError = !startField.valid && startField.touched;
  const endHasError = !endField.valid && endField.touched;
  return (
    <Row
      className={classNames({
        [locals.rowWidth]: tearSheetView
      })}
    >
      <Col lg={tearSheetView ? 6 : 3}>
        <Stack gap="xsmall">
          <Label hasError={startHasError} htmlFor="statusCodeStart" className={locals.label}>
            From
          </Label>
          <Input
            id="statusCodeStart"
            name="statusCodeStart"
            placeholder="500"
            value={startField.value}
            onChange={e => onStartSelectionUpdate(e.target.value)}
            hasError={startHasError}
            type="number"
            min="1"
          />
          <TouchedMessages field={startField} />
        </Stack>
      </Col>
      <Col lg={tearSheetView ? 6 : 3}>
        <Stack gap="xsmall">
          <Label hasError={endHasError} htmlFor="statusCodeEnd" className={locals.label}>
            To
          </Label>
          <Input
            id="statusCodeEnd"
            name="statusCodeEnd"
            placeholder="599"
            value={endField.value}
            onChange={e => onEndSelectionUpdate(e.target.value)}
            hasError={endHasError}
            type="number"
            min="1"
          />
          <TouchedMessages field={endField} />
        </Stack>
      </Col>
    </Row>
  );
}

StatusCodeRangeSelection.propTypes = {
  startField: PropTypes.object.isRequired,
  endField: PropTypes.object.isRequired,
  onStartSelectionUpdate: PropTypes.func.isRequired,
  onEndSelectionUpdate: PropTypes.func.isRequired,
  tearSheetView: PropTypes.bool
};
