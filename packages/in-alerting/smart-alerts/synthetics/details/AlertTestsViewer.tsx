/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import { getTestsAsResultObservable, getTestsAsResultObservableInternal } from 'in-synthetics/api';
import AlertTestsList from 'in-alerting/smart-alerts/synthetics/components/AlertTestsList';
import NoItemSelected from 'in-alerting/smart-alerts/components/NoItemSelected';
import { t } from 'in-i18n';

interface AlertTestsViewerProps {
  alertTestIds: string[];
  setTitle: boolean;
}
export default function AlertTestsViewer({ alertTestIds = [], setTitle }: AlertTestsViewerProps) {
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
      setTitle={setTitle}
      //@ts-expect-error
      loadEntities={() => getSelectedAlertTests(alertTestIds)}
      renderNoDataAvailable={() => (
        <NoItemSelected text={t('in-alerting:smartAlerts.synthetics.selectTests.noTestSelectedText')} />
      )}
      isSearchable={false}
      getHeader={() => null}
      rightHeader={null}
      displayApplicationLabel={false}
      hasRowNavigation
    />
  );
}
