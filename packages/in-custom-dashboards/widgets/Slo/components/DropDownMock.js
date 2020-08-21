import React from 'react';

import Select from 'in-components/form/Select';

export default function DropDownMock({ options, ...props }) {
  return (
    <Select {...props}>
      {(options ?? []).map(({ value, label }) => {
        const text = value && value !== '' ? `${label}` : label;
        return (
          <option id={value} key={value} value={value}>
            {text}
          </option>
        );
      })}
    </Select>
  );
}
