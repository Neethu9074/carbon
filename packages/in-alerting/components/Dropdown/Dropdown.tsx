/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { arrayOf, func, shape, string } from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { Dropdown as CarbonDropdown } from '@instana/components';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-components/Button/DropdownButton';
import { carbonDropdownEnabled } from 'in-services/featureFlags';
import { Option } from 'in-components/ComboBox';

import locals from 'in-alerting/components/Dropdown/Dropdown.mless';

interface DropdownProps {
  items: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Dropdown({ items, value, onChange, className }: DropdownProps) {
  const selectedLabel = (value && items?.find?.(item => item.value === value)?.label) ?? items[0]?.label;

  if (carbonDropdownEnabled) {
    return (
      <CarbonDropdown
        className={classNames(className, {
          [locals.visuallyHiddenLabel]: true
        })}
        items={items}
        value={value}
        onChange={onChange}
        size="sm"
      />
    );
  }
  return (
    <ComboBoxBehavior<string>
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
        // @ts-expect-error the 'ref' property does not match here against HTMLElement:
        // const DropdownButton = React.forwardRef<HTMLButtonElement, Props>(function DropdownButton(
        // Let's revamp after the DropdownButton in ui-foundation
        <DropdownButton {...elementProps} className={locals.simpleDropdown} kind="subtle" expanded={isOpen}>
          {selectedLabel}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}

// left for extra checking when used by javascript based components
Dropdown.propTypes = {
  items: arrayOf(
    shape({
      label: string.isRequired,
      value: string.isRequired
    })
  ).isRequired,
  value: string.isRequired,
  onChange: func.isRequired
};
