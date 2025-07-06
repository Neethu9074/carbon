/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ViewOff, View } from '@carbon/icons-react'; // carbon icons
import React from 'react';

import Tooltip from 'in-components/Tooltip';

import './FilterEmptyValueToggle.less';

const FilterEmptyValuesToggle = ({ value, onToggle, hideLabel, showLabel }) => {
  const Icon = value ? View : ViewOff;
  const tooltip = value ? showLabel : hideLabel;

  return (
    <Tooltip content={tooltip} delay={500}>
      <button className="filter-empty-values-toggle" onClick={onToggle} aria-label={tooltip}>
        <Icon />
      </button>
    </Tooltip>
  );
};

export default FilterEmptyValuesToggle;
