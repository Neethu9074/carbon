/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { string, arrayOf, shape, func, bool } from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-components/Button/DropdownButton';

import locals from 'in-alerting/components/Dropdown/Dropdown.mless';

export default function Dropdown({
  icon,
  align = 'bottomMiddle',
  items,
  value,
  onChange,
  asSimpleDropdown,
  className
}) {
  const selectedLabel = (value && items?.find?.(item => item.value === value)?.label) ?? items[0]?.label;
  return (
    <ComboBoxBehavior
      align={align}
      options={items}
      value={value}
      onChange={newValue => {
        if (newValue === value) {
          return;
        }
        onChange(newValue);
      }}
      disableAutomaticOptionSorting
    >
      {({ elementProps, isOpen }) => (
        <DropdownButton
          {...elementProps}
          className={classNames({
            [locals.simpleDropdown]: asSimpleDropdown,
            [className]: className
          })}
          kind={asSimpleDropdown ? 'subtle' : 'primaryv2'}
          icon={icon}
          expanded={isOpen}
        >
          {selectedLabel}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}

Dropdown.propTypes = {
  icon: string,
  align: string,
  items: arrayOf(
    shape({
      label: string.isRequired,
      value: string.isRequired
    })
  ).isRequired,
  value: string.isRequired,
  onChange: func.isRequired,
  asSimpleDropdown: bool,
  className: string
};
