/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withState, setPropTypes, withHandlers, withProps } from 'recompose';
import ClickAwayListener from 'react-click-away-listener';
import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { getAllFilters } from 'in-api/filters';
import Input from 'in-components/form/Input';
import StoredFilters from './StoredFilters';
import connectTo from 'in-hoc/connectTo';

import locals from './InputWithDFQSelectionList.mless';

export default compose(
  connectTo({ filters: getAllFilters() }),
  withState('listVisible', 'setListVisible', false),
  withState('value', 'setValue', ({ value }) => value || ''),
  withProps(props => ({ ...props, onCloseList: onCloseList(props) })),
  withHandlers({ onToggleFiltersList, handleSelect }),
  setPropTypes(withPropTypes())
)(InputWithSelectionList);

function InputWithSelectionList({
  id,
  placeholder,
  value,
  hasError,
  listVisible,
  filters,
  positionAbove,
  onToggleFiltersList,
  onCloseList,
  onChange,
  handleSelect,
  setValue
}) {
  return (
    <div className={locals.container}>
      <div className={locals.inputWithSelectionList}>
        <Input
          className={locals.input}
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          maxLength={2048}
          onChange={e => {
            const value = e.target.value;
            setValue(value);
            onChange(value);
          }}
          hasError={hasError}
        />
        <SvgIcon
          className={locals.icon}
          type="lib_actions_star_filled"
          size="s"
          onClick={() => onToggleFiltersList(listVisible)}
        />
      </div>
      {listVisible && (
        <ClickAwayListener onClickAway={onCloseList}>
          <StoredFilters filters={filters && filters.toArray()} onSelect={e => handleSelect(e)} above={positionAbove} />
        </ClickAwayListener>
      )}
    </div>
  );
}

function handleSelect({ setListVisible, setValue, onChange }) {
  return value => {
    setListVisible(false);
    setValue(value);
    onChange(value);
  };
}

function onToggleFiltersList({ listVisible, setListVisible }) {
  return () => {
    setListVisible(!listVisible);
  };
}

function onCloseList({ setListVisible }) {
  return () => {
    setListVisible(false);
  };
}

function withPropTypes() {
  return {
    // Filters object from backend
    filters: PropTypes.object,
    // Is input value valid?
    hasError: PropTypes.bool,
    // Id of input field
    id: PropTypes.string.isRequired,
    // If true, show list popup
    listVisible: PropTypes.bool.isRequired,
    // Change function of the parent form
    onChange: PropTypes.func.isRequired,
    // Placeholder text for input field
    placeholder: PropTypes.string,
    // Should the list popup appear below or above the input field? [default: below]
    positionAbove: PropTypes.bool,
    // Value of input field
    value: PropTypes.string.isRequired
  };
}
