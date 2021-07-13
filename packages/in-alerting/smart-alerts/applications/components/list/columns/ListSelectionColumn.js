/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import CheckboxFancy from 'in-components/form/CheckboxFancy';

export default function ListSelectionColumn({ config, selection, onSelect, isGlobalSmartAlertConfig }) {
  const { id } = config;
  const selected = selection.some(i => id === i);
  return (
    <CheckboxFancy
      onChange={() => {
        onSelect(id, !selected, isGlobalSmartAlertConfig);
      }}
      checked={selected}
      size="larger"
    />
  );
}

ListSelectionColumn.propTypes = {
  config: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  selection: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
  isGlobalSmartAlertConfig: PropTypes.bool
};
