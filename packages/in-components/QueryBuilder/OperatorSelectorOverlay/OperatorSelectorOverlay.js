/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Ul } from '@instana/components';

import * as operatorLabels from 'in-components/QueryBuilder/tagFilter/operatorLabelsMapping';
import { REGEX_MATCH } from 'in-components/QueryBuilder/tagFilter/operators';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import OverlayOption from 'in-components/OverlayOption/OverlayOption';

import locals from './OperatorSelectorOverlay.mless';

export default function OperatorSelectorOverlay({ value, allowedOperators, onChange, close, tagType }) {
  const { matrix } = useLocation();
  const isLogging = Boolean(matrix['/logs'] || matrix['/customDashboards']);
  allowedOperators = isLogging ? allowedOperators : allowedOperators.filter(operator => operator !== REGEX_MATCH);

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
