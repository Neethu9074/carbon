/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import ClickAwayListener from 'react-click-away-listener';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { SvgIcon } from '@instana/components';

import { getAllFilters } from 'in-api/filters';
import Input from 'in-components/form/Input';
import StoredFilters from './StoredFilters';
import connectTo from 'in-hoc/connectTo';

import locals from './InputWithDFQSelectionList.mless';

export default connectTo({ filters: getAllFilters() })(InputWithSelectionList);

function InputWithSelectionList({ id, placeholder, hasError, disabled, filters, positionAbove, onChange, value }) {
  const [listVisible, setListVisible] = useState(false);
  const [values, setValues] = useState(value || '');

  function onToggleFiltersList() {
    setListVisible(!listVisible);
  }

  function handleSelect(values) {
    setListVisible(false);
    setValues(values);
    onChange(values);
  }

  function onCloseList() {
    setListVisible(false);
  }

  return (
    <div className={locals.container}>
      <div className={locals.inputWithSelectionList}>
        <Input
          disabled={disabled}
          className={locals.input}
          id={id}
          type="text"
          placeholder={placeholder}
          value={values}
          maxLength={2048}
          onChange={e => {
            const value = e.target.value;
            setValues(value);
            onChange(value);
          }}
          hasError={hasError}
        />
        {!disabled && (
          <SvgIcon
            className={locals.icon}
            type="lib_actions_star_filled"
            size="s"
            onClick={() => onToggleFiltersList()}
          />
        )}
      </div>
      {listVisible && filters && filters.toArray() && (
        <ClickAwayListener onClickAway={onCloseList}>
          <StoredFilters filters={filters && filters.toArray()} onSelect={e => handleSelect(e)} above={positionAbove} />
        </ClickAwayListener>
      )}
    </div>
  );
}

InputWithSelectionList.propTypes = {
  // Filters object from backend
  filters: PropTypes.object,
  // Is input value valid?
  hasError: PropTypes.bool,
  // Id of input field
  id: PropTypes.string.isRequired,
  // Change function of the parent form
  onChange: PropTypes.func.isRequired,
  // Placeholder text for input field
  placeholder: PropTypes.string,
  // Should the list popup appear below or above the input field? [default: below]
  positionAbove: PropTypes.bool,
  disabled: PropTypes.bool,
  // Value of input field
  value: PropTypes.string.isRequired
};
