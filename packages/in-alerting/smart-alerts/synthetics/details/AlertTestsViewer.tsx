/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import { getTestsAsResultObservable, getTestsAsResultObservableInternal } from 'in-synthetics/api';
import AlertTestsList from 'in-alerting/smart-alerts/synthetics/components/AlertTestsList';
import NoTestSelected from 'in-alerting/smart-alerts/synthetics/components/NoTestSelected';

interface AlertTestsViewerProps {
  alertTestIds: string[];
}
export default function AlertTestsViewer({ alertTestIds = [] }: AlertTestsViewerProps) {
  const syntheticTests = useObservable(
    () => getTestsAsResultObservable(getTestsAsResultObservableInternal).startWith(null),
    []
  );

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
      //@ts-expect-error
      loadEntities={() => getSelectedAlertTests(alertTestIds)}
      renderNoDataAvailable={() => <NoTestSelected />}
      isSearchable={false}
      getHeader={() => null}
      rightHeader={null}
    />
  );
}
