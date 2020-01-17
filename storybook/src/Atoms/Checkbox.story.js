import React, { Fragment, useState } from 'react';

import CheckboxFancy from 'in-components/form/CheckboxFancy';

const sizes = ['default', 'large', 'larger', 'largest'];

export default {
  title: 'Atoms|FormControl/Checkbox',
  component: CheckboxFancy
};

export const checkbox = () => {
  const [value, setValue] = useState(true);
  return sizes.map((size, i) => (
    <Fragment key={i}>
      <h3>Size: {size}</h3>
      <p>
        <CheckboxFancy
          label="This is a fancy checkbox which is not disabled."
          checked={value}
          onChange={() => setValue(!value)}
          size={size}
        />
      </p>
      <p>
        <CheckboxFancy
          label="This is a disabled fancy checkbox."
          checked={value}
          onChange={() => setValue(!value)}
          size={size}
          disabled
        />
      </p>
    </Fragment>
  ));
};

export const asRadioButton = () => {
  const [value, setValue] = useState(true);
  return sizes.map((size, i) => (
    <Fragment key={i}>
      <h3>Size: {size}</h3>
      <p>
        <CheckboxFancy
          label="This is a fancy radio button which is not disabled"
          checked={value}
          onChange={() => setValue(!value)}
          size={size}
          asRadioButton
        />
      </p>
      <p>
        <CheckboxFancy
          label="This is a disabled fancy radio button."
          checked={value}
          onChange={() => setValue(!value)}
          size={size}
          asRadioButton
          disabled
        />
      </p>
    </Fragment>
  ));
};
