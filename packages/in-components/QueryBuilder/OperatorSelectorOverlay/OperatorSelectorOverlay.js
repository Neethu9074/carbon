/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Ul } from '@instana/components';

import * as operatorLabels from 'in-components/QueryBuilder/tagFilter/operatorLabelsMapping';
import { REGEX_MATCH } from 'in-components/QueryBuilder/tagFilter/operators';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import OverlayOption from 'in-components/OverlayOption/OverlayOption';
import { regexMatchEnabled } from 'in-services/featureFlags';

import locals from './OperatorSelectorOverlay.mless';

export default function OperatorSelectorOverlay({ value, allowedOperators, onChange, close, tagType, source }) {
  const { matrix } = useLocation();

  const isLogsRelated = Boolean(matrix['/logs'] || source === 'logs');
  const shouldFilterRegex = !regexMatchEnabled || !isLogsRelated;

  const filteredOperators = shouldFilterRegex
    ? allowedOperators.filter(operator => operator !== REGEX_MATCH)
    : allowedOperators;

  return (
    <Ul framed={false} className={locals.list} borderRadius="medium" onKeyDown={onArrowKeyDownFocusSiblings}>
      {filteredOperators.map(operator => {
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
  value: PropTypes.string,
  source: PropTypes.string
};
