import React from 'react';

import Select from 'in-components/form/Select';

export default function FormDropDown({ options, ...props }) {
  return (
    <Select {...props}>
      {(options ?? []).map(({ value, label }) => {
        return (
          <option id={value} key={value} value={value}>
            {label}
          </option>
        );
      })}
    </Select>
  );
}
