/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { arrayOf, func, shape, string } from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { Dropdown as CarbonDropdown } from '@instana/components';

import { Option } from 'in-components/ComboBox';

import locals from 'in-alerting/components/Dropdown/Dropdown.mless';

interface DropdownProps {
  items: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Dropdown({ items, value, onChange, className }: DropdownProps) {
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
