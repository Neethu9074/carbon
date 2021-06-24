/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import { generateStableHash } from '@instana/utils';

import { TimeConfigContext } from 'in-stores/time/TimeConfigContext';
import { emptyArray } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function LocalTimeConfigContextModification({ children, modification, valuesToWatch }) {
  const globalTimeConfig = useTimeConfig();
  const [state, setState] = useState(() => modification(globalTimeConfig));

  useEffect(() => {
    const change = modification(globalTimeConfig);
    setState(current => {
      if (isEqual(current, change)) {
        return current;
      }
      return change;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash(globalTimeConfig), modification, ...(valuesToWatch || emptyArray)]);

  return <TimeConfigContext.Provider value={state}>{children}</TimeConfigContext.Provider>;
}

LocalTimeConfigContextModification.propTypes = {
  children: PropTypes.node.isRequired,
  modification: PropTypes.func.isRequired,
  valuesToWatch: PropTypes.array
};
