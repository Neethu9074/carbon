/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';

import {
  cloneNewStateWithApplication,
  listReducer
} from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/listReducer';
import { applicationsItemTreePropType } from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import ApplicationsList from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/ApplicationsList';
import SearchInput from 'in-new-components/SearchInput/SearchInput';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { propTypeTimeConfig } from 'in-stores/time/config';

export default function ServicesAndEndpointsListPresenter({
  apiSubscriptions,
  applicationsSelection,
  onChange,
  alertApplicationId,
  timeConfig,
  isGlobalSmartAlert,
  ...props
}) {
  const [state, dispatch] = useReducer(listReducer, {}, () => {
    if (!applicationsSelection && alertApplicationId && !isGlobalSmartAlert) {
      return cloneNewStateWithApplication({}, alertApplicationId, { inclusive: true, services: {} });
    }
    return applicationsSelection;
  });

  useEffect(() => {
    onChange?.(state);
    // since onChange func can be re-created when parent rerenders we only want to trigger the effect if  state changes
    // otherwise it could happen that we get an infinite rendering loop if parent forgets to use useCallback hook.
    // Since this can happen very likely it is better to disable the linter rule here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const [timeTo] = useState(Date.now());

  return (
    <ApplicationsList
      {...props}
      {...apiSubscriptions}
      isGlobalSmartAlert={isGlobalSmartAlert}
      alertApplicationId={alertApplicationId}
      stateManagement={{ state, dispatch }}
      timeConfig={{ ...timeConfig, to: timeTo, focusedMoment: timeTo }}
    />
  );
}

export function ServicesAndEndpointsSearchInput({ query = '', onChange }) {
  const { value, onChange: debouncedOnChange } = useDebouncedValue(
    query,
    value => {
      onChange?.(value);
    },
    500
  );
  return <SearchInput onChange={debouncedOnChange} query={value} />;
}

ServicesAndEndpointsListPresenter.propTypes = {
  apiSubscriptions: PropTypes.shape({
    getApplicationsCursorPaginated: PropTypes.func.isRequired,
    getApplication: PropTypes.func.isRequired,
    getServicesCursorPaginated: PropTypes.func.isRequired,
    getEndpointsCursorPaginated: PropTypes.func.isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  applicationsSelection: applicationsItemTreePropType,
  alertApplicationId: PropTypes.string,
  timeConfig: propTypeTimeConfig.isRequired,
  isGlobalSmartAlert: PropTypes.bool
};
