/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import PropTypes from 'prop-types';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import AlertTestsList from 'in-alerting/smart-alerts/synthetics/components/AlertTestsList';
import NoTestSelected from 'in-alerting/smart-alerts/synthetics/components/NoTestSelected';
import { getTestsAsResultObservable } from 'in-synthetics/api';
import { role } from 'in-stores/user';

export default function AlertTestsViewer({ alertTestIds = [] }) {
  const syntheticTests = useObservable(() => getTestsAsResultObservable().startWith(null), []);

  const getSelectedAlertTests = createMemoizedObservableForReferencedEntities(function (alertTestIds = []) {
    // null is treated as a pending result when converting the HTTP response into a result
    if (syntheticTests === undefined || syntheticTests?.progress?.loading) {
      return just(null);
    }
    return just(
      syntheticTests?.data?.filter(listItems => alertTestIds.filter(ids => ids === listItems?.id).length > 0) ?? []
    );
  });

  return (
    <AlertTestsList
      setTitle={false}
      loadEntities={() => getSelectedAlertTests(alertTestIds)}
      hasRowNavigation={role.canConfigureIntegrations}
      renderNoDataAvailable={() => <NoTestSelected />}
      isSearchable={false}
      getHeader={() => null}
      rightHeader={null}
    />
  );
}

AlertTestsViewer.propTypes = {
  alertTestIds: PropTypes.arrayOf(PropTypes.string).isRequired
};
