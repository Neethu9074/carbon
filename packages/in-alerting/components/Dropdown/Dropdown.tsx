/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { string, arrayOf, shape, func, bool } from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-components/Button/DropdownButton';
import { Option } from 'in-components/ComboBox';

import locals from 'in-alerting/components/Dropdown/Dropdown.mless';

interface DropdownProps {
  icon: string;
  // this had no effect
  // align = 'bottomMiddle',
  items: Option[];
  value: string;
  onChange: (value: string) => void;
  asSimpleDropdown?: boolean;
  className?: string;
}

export default function Dropdown({
  icon,
  // this had no effect
  // align = 'bottomMiddle',
  items,
  value,
  onChange,
  asSimpleDropdown,
  className
}: DropdownProps) {
  const selectedLabel = (value && items?.find?.(item => item.value === value)?.label) ?? items[0]?.label;
  return (
    <ComboBoxBehavior<string>
      // broken since a while as it was not using the new props: overlayAlignment
      // align={align}
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
        <DropdownButton
          {...elementProps}
          className={classNames({
            [locals.simpleDropdown]: asSimpleDropdown,
            [className as string]: className
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

// left for extra checking when used by javascript based components
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
