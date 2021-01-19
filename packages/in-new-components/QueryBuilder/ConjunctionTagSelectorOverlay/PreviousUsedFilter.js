/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { Li, ColumnizedContent } from 'in-new-components/lists/List/List';
import KeyValue from 'in-new-components/lists/KeyValue';
import SvgIcon from 'in-components/SvgIcon';

import locals from './PreviousUsedFilter.mless';

const columnDefinitions = [
  {
    width: '2rem',
    getContent() {
      return <SvgIcon className={locals.icon} type="lib_actions_revert" />;
    }
  },
  {
    getContent({ filter }) {
      return <KeyValue value="Use previous filters" label={filter} inverted accentuated />;
    }
  }
];

export default function PreviousUsedFilter({ filter, onClick }) {
  if (!filter) {
    return null;
  }

  return (
    <Li onClick={onClick}>
      <ColumnizedContent columnDefinitions={columnDefinitions} filter={filter} />
    </Li>
  );
}

PreviousUsedFilter.propTypes = {
  filter: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};
