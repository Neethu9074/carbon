/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Button from 'in-new-components/Button/Button';

import locals from './RecalculateBaselineButton.mless';

export default function RecalculateBaselineButton({ onChange, editMode }) {
  const isRecalculated = useRef(false);

  if (!editMode) {
    return null;
  }

  return (
    <Button
      className={locals.buttonWrapper}
      kind="secondaryDarker"
      onClick={() => {
        isRecalculated.current = true;
        onChange(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true));
      }}
      disabled={isRecalculated.current}
    >
      Recalculate Baseline
    </Button>
  );
}

RecalculateBaselineButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  editMode: PropTypes.bool
};
