/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { just } from '@instana/observables';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import AlertTestsList from 'in-alerting/smart-alerts/synthetics/components/AlertTestsList';
import NoTestSelected from 'in-alerting/smart-alerts/synthetics/components/NoTestSelected';

export default {
  component: AlertTestsList
};

export const Default = () => {
  const getSelectedAlertTests = () => just([]);
  return (
    <AlertTestsList
      setTitle={false}
      loadEntities={() => getSelectedAlertTests([])}
      hasRowNavigation
      renderNoDataAvailable={() => <NoTestSelected />}
      isSearchable={false}
      getHeader={() => null}
      rightHeader={null}
    />
  );
};

export const Loading = () => {
  const getSelectedAlertTests = () => just(null);
  return (
    <AlertTestsList
      setTitle={false}
      loadEntities={() => getSelectedAlertTests(null)}
      hasRowNavigation
      renderNoDataAvailable={() => <NoTestSelected />}
      isSearchable={false}
      getHeader={() => null}
      rightHeader={null}
    />
  );
};

export const WithData = () => {
  const sampleData = [
    {
      id: 'BaG3ePrWZ9F5Cf0szwEN',
      tenantId: 'saas_instana_test',
      label: 'Test Data',
      active: true,
      testFrequency: 1,
      playbackMode: 'Simultaneous',
      locations: ['hePG9UILXBmXgKnxLgCk'],
      locationLabels: ['MyPoPXYZ'],
      locationDisplayLabels: ['MyPoPXYZ'],
      configuration: {
        syntheticType: 'HTTPAction',
        markSyntheticCall: true,
        retries: 0,
        retryInterval: 5,
        timeout: '1m',
        url: 'https://www.ibm.com',
        operation: 'GET',
        followRedirect: true,
        allowInsecure: true
      },
      createdAt: 1679315880487,
      modifiedAt: 1679380172639
    }
  ];
  const alertTestIds = ['BaG3ePrWZ9F5Cf0szwEN'];
  const getSelectedAlertTests = createMemoizedObservableForReferencedEntities(function(alertTestIds = []) {
    return just(sampleData.filter(listItems => alertTestIds.filter(ids => ids === listItems?.id).length > 0) ?? null);
  });
  return (
    <AlertTestsList
      setTitle={false}
      loadEntities={() => getSelectedAlertTests(alertTestIds)}
      hasRowNavigation
      renderNoDataAvailable={() => <NoTestSelected />}
      isSearchable={false}
      getHeader={() => null}
      rightHeader={null}
    />
  );
};
