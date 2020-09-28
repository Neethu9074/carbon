import React from 'react';

import Select from 'in-components/form/Select';

export default function FormDropDown({ options, ...props }) {
  return (
    <Select {...props}>
      {(options ?? []).map(({ value, label, id }) => {
        return (
          <option id={id ?? value} key={id ?? value} value={value}>
            {label}
          </option>
        );
      })}
    </Select>
  );
}
