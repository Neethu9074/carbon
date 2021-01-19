/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import LocalTimeConfigContextModification from 'in-stores/time/LocalTimeConfigContextModification';
import { fixateTimeConfig } from 'in-stores/time/config';

export default function FixatedTimeConfigContextModification({ children }) {
  const [refreshIndicator, setRefreshIndicator] = useState();

  return (
    <LocalTimeConfigContextModification modification={fixateTimeConfig} valuesToWatch={[refreshIndicator]}>
      {children({ refresh })}
    </LocalTimeConfigContextModification>
  );

  function refresh() {
    setRefreshIndicator(Date.now());
  }
}

FixatedTimeConfigContextModification.propTypes = {
  children: PropTypes.func.isRequired
};
