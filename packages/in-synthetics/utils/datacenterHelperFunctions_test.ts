/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  categorizeActivationRequestedDatacenters,
  formatRejectedDatacenters
} from 'in-synthetics/utils/datacenterHelperFunctions';

describe('formatRejectedDatacenters()', () => {
  it('should provide correct text for different lengths of rejectedDatacenters', () => {
    const rejectedDatacenters1 = [
      {
        code: 'us-west-1',
        label: 'us-west-1(NCalifornia)',
        provider: 'aws',
        countryName: 'USA',
        cityName: 'NCalifornia',
        latitude: 50.11,
        longitude: 8.68,
        status: 'Pending',
        locationLabel: 'instana-local-aws-us-west-1-NCalifornia',
        datacenterId: 'aws-us-west-1-NCalifornia'
      }
    ];
    expect(formatRejectedDatacenters(rejectedDatacenters1)).toBe('instana-local-aws-us-west-1-NCalifornia');

    const rejectedDatacenters2 = [
      {
        code: 'us-west-1',
        label: 'us-west-1(NCalifornia)',
        provider: 'aws',
        countryName: 'USA',
        cityName: 'NCalifornia',
        latitude: 50.11,
        longitude: 8.68,
        status: 'Pending',
        locationLabel: 'instana-local-aws-us-west-1-NCalifornia',
        datacenterId: 'aws-us-west-1-NCalifornia'
      },
      {
        code: 'us-east-1',
        label: 'us-east-1(NVirginia)',
        provider: 'aws',
        countryName: 'USA',
        cityName: 'NVirginia',
        latitude: 37.22,
        longitude: -81.44,
        status: 'Pending',
        locationLabel: 'instana-local-aws-us-east-1-NVirginia',
        datacenterId: 'aws-us-east-1-NVirginia'
      }
    ];
    expect(formatRejectedDatacenters(rejectedDatacenters2)).toBe(
      'instana-local-aws-us-west-1-NCalifornia and instana-local-aws-us-east-1-NVirginia'
    );

    const rejectedDatacenters3 = [
      {
        code: 'us-west-1',
        label: 'us-west-1(NCalifornia)',
        provider: 'aws',
        countryName: 'USA',
        cityName: 'NCalifornia',
        latitude: 50.11,
        longitude: 8.68,
        status: 'Pending',
        locationLabel: 'instana-local-aws-us-west-1-NCalifornia',
        datacenterId: 'aws-us-west-1-NCalifornia'
      },
      {
        code: 'us-east-1',
        label: 'us-east-1(NVirginia)',
        provider: 'aws',
        countryName: 'USA',
        cityName: 'NVirginia',
        latitude: 37.22,
        longitude: -81.44,
        status: 'Pending',
        locationLabel: 'instana-local-aws-us-east-1-NVirginia',
        datacenterId: 'aws-us-east-1-NVirginia'
      },
      {
        code: 'us-west-2',
        label: 'us-west-2(Oregon)',
        provider: 'aws',
        countryName: 'USA',
        cityName: 'Oregon',
        latitude: 50.11,
        longitude: 8.68,
        status: 'Pending',
        locationLabel: 'instana-local-aws-us-west-2-Oregon',
        datacenterId: 'aws-us-west-1-Oregon'
      }
    ];
    expect(formatRejectedDatacenters(rejectedDatacenters3)).toBe(
      'instana-local-aws-us-west-1-NCalifornia, instana-local-aws-us-east-1-NVirginia and instana-local-aws-us-west-2-Oregon'
    );
  });
});

describe('categorizeActivationRequestedDatacenters()', () => {
  it('rejectedArray should be empty if result contain a single item with 201 status code', () => {
    const getSyntheticDatacenterDeploymentResponse = [
      {
        cityName: 'NCalifornia',
        code: 'us-west-1',
        countryName: 'USA',
        label: 'us-west-1(NCalifornia)',
        latitude: 50.11,
        longitude: 8.68,
        provider: 'aws',
        locationLabel: 'instana-local-aws-us-west-1-NCalifornia',
        status: 'Pending',
        datacenterId: 'aws-us-west-1-NCalifornia'
      }
    ];
    expect(categorizeActivationRequestedDatacenters(getSyntheticDatacenterDeploymentResponse)).toMatchObject({
      rejectedArray: [],
      acceptedArray: [
        {
          cityName: 'NCalifornia',
          code: 'us-west-1',
          countryName: 'USA',
          label: 'us-west-1(NCalifornia)',
          latitude: 50.11,
          longitude: 8.68,
          provider: 'aws',
          locationLabel: 'instana-local-aws-us-west-1-NCalifornia',
          status: 'Pending',
          datacenterId: 'aws-us-west-1-NCalifornia'
        }
      ]
    });
  });

  it('acceptedArray should be empty if result contain a single item with 409 status code', () => {
    const getSyntheticDatacenterDeploymentResponse = [
      {
        cityName: 'NCalifornia',
        code: 'us-west-1',
        countryName: 'USA',
        label: 'us-west-1(NCalifornia)',
        latitude: 50.11,
        longitude: 8.68,
        provider: 'aws',
        locationLabel: '',
        status: '409',
        datacenterId: 'aws-us-west-1-NCalifornia'
      }
    ];
    expect(categorizeActivationRequestedDatacenters(getSyntheticDatacenterDeploymentResponse)).toMatchObject({
      rejectedArray: [
        {
          cityName: 'NCalifornia',
          code: 'us-west-1',
          countryName: 'USA',
          label: 'us-west-1(NCalifornia)',
          latitude: 50.11,
          longitude: 8.68,
          provider: 'aws',
          locationLabel: '',
          status: '409',
          datacenterId: 'aws-us-west-1-NCalifornia'
        }
      ],
      acceptedArray: []
    });
  });

  it('acceptedArray and rejectedArray should contain one item each if result contain one item each with 201 and 409 status codes', () => {
    const getSyntheticDatacenterDeploymentResponse = [
      {
        cityName: 'NCalifornia',
        code: 'us-west-1',
        countryName: 'USA',
        label: 'us-west-1(NCalifornia)',
        latitude: 50.11,
        longitude: 8.68,
        provider: 'aws',
        locationLabel: '',
        status: '409',
        datacenterId: 'aws-us-west-1-NCalifornia'
      },
      {
        cityName: 'NVirginia',
        code: 'us-east-1',
        countryName: 'USA',
        label: 'us-east-1(NVirginia)',
        latitude: 70.11,
        longitude: 5.68,
        provider: 'aws',
        locationLabel: 'instana-local-us-east-1-NVirginia',
        status: 'Pending',
        datacenterId: 'aws-us-east-1-NVirginia'
      }
    ];
    expect(categorizeActivationRequestedDatacenters(getSyntheticDatacenterDeploymentResponse)).toMatchObject({
      rejectedArray: [
        {
          cityName: 'NCalifornia',
          code: 'us-west-1',
          countryName: 'USA',
          label: 'us-west-1(NCalifornia)',
          latitude: 50.11,
          longitude: 8.68,
          provider: 'aws',
          locationLabel: '',
          status: '409',
          datacenterId: 'aws-us-west-1-NCalifornia'
        }
      ],
      acceptedArray: [
        {
          cityName: 'NVirginia',
          code: 'us-east-1',
          countryName: 'USA',
          label: 'us-east-1(NVirginia)',
          latitude: 70.11,
          longitude: 5.68,
          provider: 'aws',
          locationLabel: 'instana-local-us-east-1-NVirginia',
          status: 'Pending',
          datacenterId: 'aws-us-east-1-NVirginia'
        }
      ]
    });
  });
});
