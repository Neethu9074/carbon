/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import * as operatorLabels from 'in-new-components/QueryBuilder/tagFilter/operatorLabelsMapping';
import OverlayOption from 'in-new-components/OverlayOption/OverlayOption';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { Ul } from 'in-new-components/lists/List/List';

import locals from './OperatorSelectorOverlay.mless';

export default function OperatorSelectorOverlay({ value, allowedOperators, onChange, close, tagType }) {
  return (
    <Ul framed={false} className={locals.list} borderRadius="medium" onKeyDown={onArrowKeyDownFocusSiblings}>
      {allowedOperators.map(operator => {
        const description = operatorLabels[`${tagType}_${operator}_DESCRIPTION`];
        return (
          <OverlayOption
            key={operator}
            className={locals.option}
            autoFocus={value === operator}
            onChange={onChange}
            close={close}
            selectedValue={value}
            value={operator}
          >
            {operatorLabels[`${tagType}_${operator}`]}
            {description ? ` (${description})` : null}
          </OverlayOption>
        );
      })}
    </Ul>
  );
}

OperatorSelectorOverlay.propTypes = {
  allowedOperators: PropTypes.array.isRequired,
  tagType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  value: PropTypes.string
};
