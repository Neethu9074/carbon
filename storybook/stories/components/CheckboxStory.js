import { storiesOf } from '@storybook/react';
import { withState } from 'recompose';
import React, { Fragment } from 'react';

import CheckboxFancy from 'in-components/form/CheckboxFancy';
import Root from '../_helpers/Root';

const sizes = ['default', 'large', 'larger', 'largest'];

storiesOf('Components/Checkbox', module)
  .add('styled', () => <CheckBoxStory/>);


function CheckBoxStory() {
  return (
    <Root>
      <StatefulCheckboxStory/>
    </Root>);
}

const StatefulCheckboxStory = withState('value', 'setValue', true)(Foobar);

function Foobar({ value, setValue }) {
  return (
    <Fragment>
      <p>
        <label>
          <input type="checkbox" checked={value} onChange={() => setValue(!value)} style={{ marginRight: '1rem' }}/>
          This is a standard browser checkbox.
        </label>
      </p>
      <p>
        <label>
          <input
            type="checkbox"
            checked={value}
            onChange={() => setValue(!value)}
            disabled
            style={{ marginRight: '1rem' }}
          />
          This is a standard browser checkbox which is disabled.
        </label>
      </p>

      <hr/>

      {sizes.map((size, i) => (
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
      ))}
    </Fragment>
  );
}
