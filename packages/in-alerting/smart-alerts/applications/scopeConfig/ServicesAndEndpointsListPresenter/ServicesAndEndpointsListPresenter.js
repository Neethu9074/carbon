/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { secondsToMilliseconds } from 'date-fns';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { SearchInput } from '@instana/components';

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
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { applicationDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

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
  includeInternal,
  includeSynthetic,
  ...otherProps
}) {
  const [state, dispatch] = useReducer(listReducer, {}, () => {
    return applicationsSelection;
  });

  useEffect(() => {
    // do not trigger an onChange on the first rendering, because it is no change at all.
    if (state === applicationsSelection) return;

    // update the form upwards
    onChange?.(state);
    // since onChange func can be re-created when parent re-renders we only want to trigger the effect if state changes
    // otherwise it could happen that we get an infinite rendering loop if parent forgets to use useCallback hook.
    // Since this can happen very likely it is better to disable the linter rule here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    // do not trigger a dispatch on the first rendering, because there is no change at all.
    if (state === applicationsSelection) return;

    // apply changes of the form downwards
    dispatch({ type: actionType.SET_SELECTION, applicationsSelection });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationsSelection]);

  const minute = secondsToMilliseconds(60);
  const to = new Date().getTime() + minute * 30;
  const [timeTo] = useState(to);
  const location = useLocation();

  const timeConfigWithFixedFocussedMoment = useMemo(
    () => ({ ...timeConfig, to: timeTo, focusedMoment: timeTo }),
    [timeConfig, timeTo]
  );

  return (
    <ApplicationsList
      isGlobalSmartAlert={isGlobalSmartAlert}
      stateManagement={{ state, dispatch }}
      timeConfig={timeConfigWithFixedFocussedMoment}
      boundaryScope={boundaryScope}
      editMode={editMode}
      readOnly={readOnly}
      appIdForIndividualSmartAlert={deriveAppIdForIndividualSmartAlert()}
      includeInternal={includeInternal}
      includeSynthetic={includeSynthetic}
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

export function ServicesAndEndpointsSearchInput({ query = '', placeholderText, onChange }) {
  const { value, onChange: debouncedOnChange } = useDebouncedValue(
    query,
    value => {
      onChange?.(value);
    },
    500
  );

  return (
    <SearchInput
      onChange={debouncedOnChange}
      query={value}
      placeholder={placeholderText ?? t('in-components:searchInput.placeholderSearch')}
    />
  );
}

ServicesAndEndpointsListPresenter.propTypes = {
  /**
   * Only needed for storybook/testing otherwise you may not want to inject custom API subscriptions
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
  readOnly: PropTypes.bool,
  includeInternal: PropTypes.bool,
  includeSynthetic: PropTypes.bool
};
