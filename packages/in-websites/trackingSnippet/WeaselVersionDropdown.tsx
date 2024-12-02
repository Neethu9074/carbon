/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

//This button will be replaced by a common component when Dropdown is migrated to Carbon.
import React from 'react';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-components/Button/DropdownButton';
import { Option } from 'in-components/ComboBox';

interface DropdownProps {
  selectedWeaselVersion: string;
  handleVersionChange: (value: string) => void;
  weaselArray: Option[];
}

export default function WeaselVersionDropdown({
  selectedWeaselVersion,
  handleVersionChange,
  weaselArray
}: DropdownProps) {
  return (
    <ComboBoxBehavior
      value={selectedWeaselVersion}
      onChange={handleVersionChange}
      options={weaselArray}
      disableAutomaticOptionSorting
    >
      {({ elementProps, isOpen }) => (
        <div>
          {/*@ts-expect-error the 'ref' property does not match here against HTMLElement:*/}
          <DropdownButton {...elementProps} expanded={isOpen} kind="secondary">
            {selectedWeaselVersion}
          </DropdownButton>
        </div>
      )}
    </ComboBoxBehavior>
  );
}
