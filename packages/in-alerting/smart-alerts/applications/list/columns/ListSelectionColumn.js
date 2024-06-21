/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Checkbox } from '@instana/components';

export default function ListSelectionColumn({ config, selection, onSelect }) {
  const { id } = config;
  const selected = selection.some(i => id === i);
  return (
    <Checkbox
      onChange={() => {
        onSelect(id, !selected);
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
  onSelect: PropTypes.func.isRequired
};
