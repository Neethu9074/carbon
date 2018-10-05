import { withState, compose } from 'recompose';
import React, { Fragment } from 'react';

import { operators } from 'in-analyze/applicationFilter';
import Input from 'in-components/form/Input/Input';
import Button from 'in-new-components/Button';

import locals from './LatencySuggestions.mless';

export default compose(
  withState('fasterThanValue', 'setFasterThanValue', 1000),
  withState('slowerThanValue', 'setSlowerThanValue', 1000)
)(LatencySuggestions);

function LatencySuggestions({
  tagName,
  filters,
  onChangeAnalyzeConfig,
  slowerThanValue,
  setSlowerThanValue,
  fasterThanValue,
  setFasterThanValue,
  onAddTagFilter,
  close
}) {
  return (
    <Fragment>
      <form
        className={locals.wrapper}
        onSubmit={e => {
          e.preventDefault();
          if (isValid(fasterThanValue)) {
            onSubmit(fasterThanValue, operators.LESS_THAN);
          }
        }}
      >
        <span className={locals.text}>&lt;</span>
        <Input
          className={locals.input}
          type="number"
          min={0}
          step="1"
          id="value"
          value={fasterThanValue}
          autoComplete="off"
          onChange={e => setFasterThanValue(e.target.value)}
        />
        <span className={locals.millis}>ms</span>
        <Button type="submit" disabled={!isValid(fasterThanValue)}>
          Add
        </Button>
      </form>

      <form
        className={locals.wrapper}
        onSubmit={e => {
          e.preventDefault();
          if (isValid(slowerThanValue)) {
            onSubmit(slowerThanValue, operators.GREATER_THAN);
          }
        }}
      >
        <span className={locals.text}>&gt;</span>
        <Input
          className={locals.input}
          type="number"
          min={0}
          step="1"
          id="value"
          value={slowerThanValue}
          autoComplete="off"
          onChange={e => setSlowerThanValue(e.target.value)}
        />
        <span className={locals.millis}>ms</span>
        <Button type="submit" disabled={!isValid(slowerThanValue)}>
          Add
        </Button>
      </form>
    </Fragment>
  );

  function onSubmit(value, operator) {
    if (isValid(value)) {
      onAddTagFilter({ name: tagName, value, operator }, filters, onChangeAnalyzeConfig);
      close();
    }
  }
}

function isValid(str) {
  return /^\d+$/.test(str);
}
