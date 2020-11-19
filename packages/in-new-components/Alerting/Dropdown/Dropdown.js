import { string, arrayOf, any, shape, func, bool } from 'prop-types';
import React from 'react';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import evaluateClassNames from 'in-services/util/classnames';

import locals from './Dropdown.mless';

export default function Dropdown({
  icon,
  align = 'bottomMiddle',
  label,
  items,
  onChange,
  asSimpleDropdown,
  className
}) {
  return (
    <ComboBoxBehavior
      align={align}
      options={items.map(i => ({ value: i, label: i.label }))}
      onChange={newValue => {
        if (newValue.label === label) {
          return;
        }
        onChange(newValue);
      }}
      disableAutomaticOptionSorting
    >
      {({ elementProps, isOpen }) => (
        <DropdownButton
          {...elementProps}
          className={evaluateClassNames({
            [locals.simpleDropdown]: asSimpleDropdown,
            [className]: className
          })}
          kind={asSimpleDropdown ? 'subtle' : 'primaryv2'}
          icon={icon}
          expanded={isOpen}
        >
          {label}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}

Dropdown.propTypes = {
  icon: string,
  align: string,
  label: string.isRequired,
  items: arrayOf(
    shape({
      label: string.isRequired,
      value: any.isRequired
    })
  ).isRequired,
  onChange: func.isRequired,
  asSimpleDropdown: bool,
  className: string
};
