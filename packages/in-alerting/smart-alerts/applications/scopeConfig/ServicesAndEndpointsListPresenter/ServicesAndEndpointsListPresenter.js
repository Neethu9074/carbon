/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { applicationsItemTreePropType } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import {
  actionType,
  listReducer
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/listReducer';
import ApplicationsList from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/ApplicationsList';
import getApplicationsCursorPaginated from 'in-subscription/application/getApplicationsCursorPaginated';
import getEndpointsCursorPaginated from 'in-applications/subscriptions/getEndpointsCursorPaginated';
import { firstApplicationId } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import getServicesCursorPaginated from 'in-subscription/application/getServicesCursorPaginated';
import getApplication from 'in-subscription/application/getApplication';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { boundaryScopes } from 'in-applications/constants';
import SearchInput from 'in-new-components/SearchInput';

const backendApiSubscriptions = {
  getApplication,
  getApplicationsCursorPaginated,
  getServicesCursorPaginated,
  getEndpointsCursorPaginated
};

export default function ServicesAndEndpointsListPresenter({
  apiSubscriptions = backendApiSubscriptions,
  applicationsSelection,
  onChange,
  timeConfig,
  isGlobalSmartAlert,
  boundaryScope,
  editMode,
  initialConfiguredApplications,
  ...otherProps
}) {
  const [state, dispatch] = useReducer(listReducer, {}, () => {
    return applicationsSelection;
  });
  const alertApplicationId = firstApplicationId(applicationsSelection);

  useEffect(() => {
    onChange?.(state);
    // since onChange func can be re-created when parent rerenders we only want to trigger the effect if  state changes
    // otherwise it could happen that we get an infinite rendering loop if parent forgets to use useCallback hook.
    // Since this can happen very likely it is better to disable the linter rule here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (boundaryScope === boundaryScopes.inbound && Object.values(state).some(({ services }) => !isEmpty(services))) {
      const getInitialStateForIndividualSmartAlert = () => {
        const applicationId = Object.keys(initialConfiguredApplications)[0];

        return {
          [applicationId]: {
            applicationId,
            inclusive: true,
            services: {}
          }
        };
      };

      const initialState = !isGlobalSmartAlert ? getInitialStateForIndividualSmartAlert() : {};

      dispatch({ type: actionType.RESET_STATE, initialState });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundaryScope]);

  const [timeTo] = useState(Date.now());

  return (
    <ApplicationsList
      isGlobalSmartAlert={isGlobalSmartAlert}
      alertApplicationId={alertApplicationId}
      stateManagement={{ state, dispatch }}
      timeConfig={{ ...timeConfig, to: timeTo, focusedMoment: timeTo }}
      boundaryScope={boundaryScope}
      editMode={editMode}
      {...apiSubscriptions}
      {...otherProps}
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
  /**
   * Only needed for storybook/testing otherwise yopu may not want to inject custom API subscriptions
   */
  apiSubscriptions: PropTypes.shape({
    getApplicationsCursorPaginated: PropTypes.func.isRequired,
    getApplication: PropTypes.func.isRequired,
    getServicesCursorPaginated: PropTypes.func.isRequired,
    getEndpointsCursorPaginated: PropTypes.func.isRequired
  }),
  onChange: PropTypes.func.isRequired,
  applicationsSelection: applicationsItemTreePropType,
  alertApplicationId: PropTypes.string,
  timeConfig: propTypeTimeConfig.isRequired,
  isGlobalSmartAlert: PropTypes.bool,
  boundaryScope: PropTypes.string.isRequired,
  initialConfiguredApplications: PropTypes.object,
  editMode: PropTypes.bool
};
