/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { applicationsItemTreePropType } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import {
  actionType,
  listReducer
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/listReducer';
import ApplicationsList from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/ApplicationsList';
import getApplicationsCursorPaginated from 'in-applications/subscriptions/getApplicationsCursorPaginated';
import getEndpointsCursorPaginated from 'in-applications/subscriptions/getEndpointsCursorPaginated';
import getServicesCursorPaginated from 'in-applications/subscriptions/getServicesCursorPaginated';
import { firstApplicationId } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { applicationId as applicationIdMatrixParam } from 'in-applications/navigation/matrix';
import getApplication from 'in-applications/subscriptions/getApplication';
import { applicationDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { boundaryScopes } from 'in-applications/constants';
import SearchInput from 'in-components/SearchInput';
import usePrevious from 'in-hooks/usePrevious';

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
  readOnly,
  ...otherProps
}) {
  const [state, dispatch] = useReducer(listReducer, {}, () => {
    return applicationsSelection;
  });

  const previousBoundaryScope = usePrevious(boundaryScope);

  useEffect(() => {
    onChange?.(state);
    // since onChange func can be re-created when parent rerenders we only want to trigger the effect if  state changes
    // otherwise it could happen that we get an infinite rendering loop if parent forgets to use useCallback hook.
    // Since this can happen very likely it is better to disable the linter rule here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    // NOTE: We are resetting A/S/E selection if user changes boundary scope from All -> Inbound
    if (
      previousBoundaryScope === boundaryScopes.all &&
      boundaryScope === boundaryScopes.inbound &&
      Object.values(state).some(({ services }) => !isEmpty(services))
    ) {
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
  const location = useLocation();

  const timeConfigWithFixedFocussedMoment = useMemo(() => ({ ...timeConfig, to: timeTo, focusedMoment: timeTo }), [
    timeConfig,
    timeTo
  ]);

  return (
    <ApplicationsList
      isGlobalSmartAlert={isGlobalSmartAlert}
      stateManagement={{ state, dispatch }}
      timeConfig={timeConfigWithFixedFocussedMoment}
      boundaryScope={boundaryScope}
      editMode={editMode}
      readOnly={readOnly}
      appIdForIndividualSmartAlert={deriveAppIdForIndividualSmartAlert()}
      {...apiSubscriptions}
      {...otherProps}
    />
  );

  function deriveAppIdForIndividualSmartAlert() {
    if (editMode) {
      return firstApplicationId(initialConfiguredApplications);
    }

    if (isEmpty(applicationsSelection)) {
      return getMatrixParameter(location, applicationDashboard, applicationIdMatrixParam);
    }

    return firstApplicationId(applicationsSelection);
  }
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
  editMode: PropTypes.bool,
  readOnly: PropTypes.bool
};
