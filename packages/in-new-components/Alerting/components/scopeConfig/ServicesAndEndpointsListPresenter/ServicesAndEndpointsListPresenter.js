/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  cloneNewStateWithApplication,
  listReducer
} from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/listReducer';
import { applicationsItemTreePropType } from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import ApplicationsList from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/ApplicationsList';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function ServicesAndEndpointsListPresenter({
  apiSubscriptions,
  applicationsSelection = {},
  onChange,
  alertApplicationId,
  isGlobalSmartAlert,
  ...props
}) {
  const [state, dispatch] = useReducer(listReducer, {}, () => {
    if (isEmpty(applicationsSelection) && alertApplicationId && !isGlobalSmartAlert) {
      return {
        inExplicitSelectionMode: new Set(),
        ...cloneNewStateWithApplication({}, alertApplicationId, {
          inclusive: true,
          services: {}
        })
      };
    }

    const newState = {
      inExplicitSelectionMode: new Set(Object.keys(applicationsSelection)),
      userSelectionModel: { ...applicationsSelection }
    };

    return newState;
  });

  useEffect(() => {
    onChange?.(state.userSelectionModel);
    // since onChange func can be re-created when parent rerenders we only want to trigger the effect if  state changes
    // otherwise it could happen that we get an infinite rendering loop if parent forgets to use useCallback hook.
    // Since this can happen very likely it is better to disable the linter rule here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const timeConfig = useTimeConfig();

  return (
    <ApplicationsList
      {...props}
      {...apiSubscriptions}
      isGlobalSmartAlert={isGlobalSmartAlert}
      alertApplicationId={alertApplicationId}
      initialApplicationSelection={applicationsSelection}
      stateManagement={{ state, dispatch }}
      timeConfig={timeConfig}
    />
  );
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
  isGlobalSmartAlert: PropTypes.bool
};
