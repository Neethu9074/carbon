/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { Result, SyntheticTest } from '@instana/types';

import { TestsTableWithUrlState } from 'in-synthetics/dashboards/global/tabs/tests/components/TestsTableWithUrlState';

describe('TestsTableWithUrlState', () => {
  const associations = {
    applications: ['Xmt3alc-Qcmo2Xvnk-Xvzg', '2xJjXXStSj2tusnfRZCvSw'],
    mobileApps: ['eXZjG_P-QAmnWOlXnItMlg', 'OIi4pjWjRu29X6_Cg9aGnQ'],
    websites: ['YsM9UB5qS4WpkipEcnrlWg', '_XXvJdJFQ9uDbSfLSt6nmg']
  };
  const setFilter = jest.fn();
  it('should render the component without errors', () => {
    const syntheticTests = {
      data: [
        {
          id: 'perf-dns-query-a_162',
          tenantId: 'saas_instana_test',
          label: 'perf-dns-query-a_162',
          description: 'this is to do DNS test with query type A',
          active: true,
          testFrequency: 1,
          playbackMode: 'Simultaneous',
          locations: ['9xblOq15RyzLj2koBWwc'],
          locationLabels: ['pop-pink-master'],
          locationDisplayLabels: ['pop-pink-master'],
          configuration: {
            syntheticType: 'DNS',
            markSyntheticCall: true,
            retries: 1,
            retryInterval: 5,
            timeout: '60000ms',
            acceptCNAME: false,
            lookup: 'www.ibm.com',
            lookupServerName: false,
            port: 53,
            queryType: 'A',
            recursiveLookups: true,
            server: '8.8.8.8',
            serverRetries: 1,
            transport: 'UDP'
          },
          customProperties: {},
          createdAt: 1744834285232,
          createdBy: 'ApiToken: Grafana Test',
          modifiedAt: 1744834285232,
          rbacTags: []
        },
        {
          id: 'perf-dns-query-cname_221',
          tenantId: 'saas_instana_test',
          label: 'perf-dns-query-cname_221',
          description: 'this is to do DNS test with query type A',
          active: true,
          testFrequency: 1,
          playbackMode: 'Simultaneous',
          locations: ['9xblOq15RyzLj2koBWwc'],
          locationLabels: ['pop-pink-master'],
          locationDisplayLabels: ['pop-pink-master'],
          configuration: {
            syntheticType: 'DNS',
            markSyntheticCall: true,
            retries: 1,
            retryInterval: 5,
            timeout: '60000ms',
            acceptCNAME: false,
            lookup: 'www.ibm.com',
            lookupServerName: false,
            port: 53,
            queryType: 'CNAME',
            recursiveLookups: true,
            server: '8.8.8.8',
            serverRetries: 1,
            transport: 'UDP'
          },
          customProperties: {},
          createdAt: 1744842068989,
          createdBy: 'ApiToken: Grafana Test',
          modifiedAt: 1744842068989,
          rbacTags: []
        }
      ],
      errors: [],
      progress: { loading: false }
    } as Result<SyntheticTest[]>;

    const { container } = render(
      <TestsTableWithUrlState
        syntheticTypes={[]}
        locationIds={[]}
        entityIds={[]}
        associations={associations}
        runType={'Scheduled'}
        syntheticTests={syntheticTests}
        timeConfig={{
          to: 1754159400000,
          windowSize: 604800000,
          focusedMoment: 1754159400000,
          autoRefresh: false
        }}
        setFilter={setFilter}
      />
    );
    expect(document.body).toBeTruthy();
    expect(container.querySelector('div[role="search"][aria-label="Search synthetic tests"]')).not.toBeNull();
    expect(screen.getByText('Configure columns')).toBeTruthy();
  });

  it('should render loading state without errors', () => {
    const syntheticTests = {
      errors: [],
      progress: { loading: false }
    } as Result<SyntheticTest[]>;
    const { container } = render(
      <TestsTableWithUrlState
        syntheticTypes={[]}
        locationIds={[]}
        entityIds={[]}
        associations={associations}
        runType={'Scheduled'}
        syntheticTests={syntheticTests}
        timeConfig={{
          to: 1754159400000,
          windowSize: 604800000,
          focusedMoment: 1754159400000,
          autoRefresh: false
        }}
        setFilter={setFilter}
      />
    );
    expect(document.body).toBeTruthy();
    expect(container.querySelector('.cds--skeleton')).not.toBeNull();
  });
});
