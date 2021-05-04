/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Col, Row } from 'in-new-components/layout/Grid';
import Stack from 'in-new-components/layout/Stack';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import locals from './StatusCodeRangeSelection.mless';

export default function StatusCodeRangeSelection({
  start = '',
  end = '',
  startHasError,
  endHasError,
  onStartSelectionUpdate,
  onEndSelectionUpdate
}) {
  return (
    <Row>
      <Col lg={3}>
        <Stack space="xsmall">
          <Label hasError={startHasError} htmlFor="statusCodeStart" className={locals.label}>
            From
          </Label>
          <Input
            id="statusCodeStart"
            name="statusCodeStart"
            placeholder="500"
            value={start}
            onChange={e => onStartSelectionUpdate(e.target.value)}
            hasError={startHasError}
            type="number"
          />
        </Stack>
      </Col>
      <Col lg={3}>
        <Stack space="xsmall">
          <Label hasError={endHasError} htmlFor="statusCodeEnd" className={locals.label}>
            To
          </Label>
          <Input
            id="statusCodeEnd"
            name="statusCodeEnd"
            placeholder="599"
            value={end}
            onChange={e => onEndSelectionUpdate(e.target.value)}
            hasError={endHasError}
            type="number"
          />
        </Stack>
      </Col>
    </Row>
  );
}

StatusCodeRangeSelection.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number,
  startHasError: PropTypes.bool,
  endHasError: PropTypes.bool,
  onStartSelectionUpdate: PropTypes.func.isRequired,
  onEndSelectionUpdate: PropTypes.func.isRequired
};
