/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import presentationPresets from 'in-amp/components/presentationPresets';
import DropdownButton from 'in-components/Button/DropdownButton';

const PresentationSelection = ({ presentation, setPresentation, timeRange }) => {
  const options = presentationPresets.map(p => ({
    value: p,
    label: p.label,
    disabled: p.isDisabled(timeRange)
  }));

  const currentOption = options.find(({ value }) => value.presentation === presentation);

  return (
    <ComboBoxBehavior
      align="bottomRight"
      value={currentOption?.value}
      options={options}
      onChange={({ presentation }) => {
        setPresentation?.(presentation);
      }}
      disableAutomaticOptionSorting
    >
      {({ elementProps, isOpen }) => (
        <DropdownButton {...elementProps} kind="secondary" expanded={isOpen}>
          {currentOption?.label}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
};

export default PresentationSelection;
