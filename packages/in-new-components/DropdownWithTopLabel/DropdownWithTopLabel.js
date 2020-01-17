import PropTypes from 'prop-types';
import React from 'react';

import FormGroup from 'in-components/form/FormGroup/FormGroup';
import Dropdown from 'in-new-components/Dropdown';
import Label from 'in-components/form/Label';

import locals from './DropdownWithTopLabel.mless';

export default function DropdownWithTopLabel({
  icon,
  align = 'bottomMiddle',
  label,
  topLabel,
  items,
  renderItemContent,
  onClick
}) {
  return (
    <FormGroup className={locals.container} withoutBottomMargin>
      <Label className={locals.label}>{topLabel}</Label>
      <Dropdown
        icon={icon}
        align={align}
        label={label}
        items={items}
        renderItemContent={renderItemContent}
        onClick={onClick}
        asSimpleDropdown
      />
    </FormGroup>
  );
}

DropdownWithTopLabel.propTypes = {
  align: PropTypes.string,
  icon: PropTypes.string,
  items: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  renderItemContent: PropTypes.func,
  topLabel: PropTypes.string.isRequired
};
