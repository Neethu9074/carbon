/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dropdown } from '@instana/components';

import presentationPresets from 'in-amp/components/presentationPresets';

const PresentationSelection = ({ presentation, setPresentation, timeRange }) => {
  const options = presentationPresets.map(p => ({
    value: p,
    label: p.label,
    disabled: p.isDisabled(timeRange)
  }));

  const currentOption = options.find(({ value }) => value.presentation === presentation);

  return (
    <Dropdown
      items={options}
      size="md"
      value={currentOption?.value}
      onChange={({ presentation }) => {
        setPresentation?.(presentation);
      }}
    />
  );
};

export default PresentationSelection;
