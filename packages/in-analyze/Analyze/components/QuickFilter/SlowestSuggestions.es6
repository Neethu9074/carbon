import { withState } from 'recompose';
import React from 'react';

import Input from 'in-components/form/Input/Input';
import Button from 'in-new-components/Button';

import locals from './SlowestSuggestions.mless';

export default withState('value', 'setValue', 1000)(SlowestSuggestions);
function SlowestSuggestions({ value, setValue, onValueClick }) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (value) {
          onValueClick(value);
        }
      }}
    >
      <div className={locals.wrapper}>
        <span className={locals.text}>Slower than</span>
        <Input
          className={locals.input}
          type="number"
          min={0}
          step="1"
          id="value"
          value={value}
          autoComplete="off"
          onChange={e => setValue(e.target.value)}
        />
        <span className={locals.millis}>ms</span>
        <Button onClick={() => onValueClick(value)} disabled={!value}>
          Save
        </Button>
      </div>
    </form>
  );
}
