/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { shallow } from 'enzyme';
import { isMatch } from 'lodash';
import React from 'react';

import { SliConfig, websiteEventBased, websiteTimeBased } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import CreateWebsiteSliForm from 'in-custom-dashboards/widgets/SloLegacy/sli/components/create/CreateWebsiteSliForm';
import { useValidateWebsiteFilterExpression as uVWFE } from 'in-service-levels/hooks/useWebsiteQueryBuilder';
import CreateSliForm from 'in-custom-dashboards/widgets/SloLegacy/sli/components/create/CreateSliForm';
import { WebsiteSliForm } from 'in-custom-dashboards/widgets/SloLegacy/sli/WebsiteSliForm';
import { Website, WebsiteEventBasedSliEntity, WebsiteTimeBasedSliEntity } from 'in-types';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import uW from 'in-websites/hooks/useWebsite';

jest.mock('in-websites/hooks/useWebsite', () => ({
  __esModule: true,
  default: jest.fn(() => [undefined, 'pending', []])
}));
jest.mock('in-service-levels/hooks/useWebsiteQueryBuilder', () => ({
  useWebsiteQueryBuilder: jest.fn(() => ({ QueryBuilder: jest.fn(), isQueryValid: jest.fn() })),
  useValidateWebsiteFilterExpression: jest.fn(() => false)
}));
jest.mock('in-custom-dashboards/widgets/SloLegacy/sli/api', () => ({
  createSliConfiguration: jest.fn(() => ({ tap: jest.fn() }))
}));

const useWebsite = uW as jest.MockedFunction<typeof uW>;
const useValidateWebsiteFilterExpression = uVWFE as jest.MockedFunction<typeof uVWFE>;

describe('in-custom-dashboards/widgets/SloLegacy/sli/create/CreateWebsiteSliForm', () => {
  beforeEach(jest.clearAllMocks);

  const mockWebsite: Website = {
    id: '1',
    label: 'Stans Lab'
  };

  it('renders a LoadingIndicator if the website for entityId is still pending', () => {
    // Given
    useWebsite.mockReturnValueOnce([undefined, 'pending', [], { loading: false }]);

    // When
    const wrapper = shallow(
      <CreateWebsiteSliForm entityId="someString" close={jest.fn()} setFooter={jest.fn()} onSave={jest.fn()} />
    );

    // Then
    expect(wrapper.containsMatchingElement(<LoadingIndicator />)).toBeTruthy();
  });

  it('renders a LoadingIndicator if the sliConfig is undefined', () => {
    // Given
    const sliConfig = undefined;
    useWebsite.mockReturnValueOnce([{} as Website, 'resolved', [], { loading: false }]);

    // When
    const wrapper = shallow(
      <CreateWebsiteSliForm
        sliConfig={sliConfig}
        entityId="someString"
        close={jest.fn()}
        setFooter={jest.fn()}
        onSave={jest.fn()}
      />
    );

    // Then
    expect(wrapper.containsMatchingElement(<LoadingIndicator />)).toBeTruthy();
  });

  it('validates the forms filterExpression as valid if both good* and badEventFilterExpression are valid for event based sli', () => {
    // Given
    useWebsite.mockReturnValueOnce([mockWebsite, 'resolved', [], { loading: false }]);
    const sliConfig: SliConfig<WebsiteEventBasedSliEntity> = {
      sliName: 'someSli',
      sliEntity: {
        sliType: websiteEventBased,
        goodEventFilterExpression: tagFilter('beacon.http.status', 'EQUALS', '200'),
        badEventFilterExpression: tagFilter('beacon.http.status', 'NOT_EQUAL', '200'),
        beaconType: 'httpRequest'
      },
      id: 'someId',
      initialEvaluationTimestamp: 0
    };
    useValidateWebsiteFilterExpression.mockImplementation(({ filterExpression = [] }) => {
      const valid =
        isMatch(filterExpression[0], tagFilter('beacon.http.status', 'EQUALS', '200')) ||
        isMatch(filterExpression[0], tagFilter('beacon.http.status', 'NOT_EQUAL', '200'));
      return valid;
    });

    // When
    const wrapper = shallow(
      <CreateWebsiteSliForm
        sliConfig={sliConfig}
        entityId="someString"
        close={jest.fn()}
        setFooter={jest.fn()}
        onSave={jest.fn()}
      />
    ).dive();

    // Then
    expect(
      wrapper.containsMatchingElement(
        // @ts-expect-error
        <CreateSliForm filterExpressionValid>
          {/* @ts-expect-error */}
          <WebsiteSliForm />
        </CreateSliForm>
      )
    ).toBeTruthy();
  });

  it('validates the forms filterExpression as invalid if the goodEventFilterExpression is invalid for event based sli', () => {
    // Given
    useWebsite.mockReturnValueOnce([mockWebsite, 'resolved', [], { loading: false }]);
    const sliConfig: SliConfig<WebsiteEventBasedSliEntity> = {
      sliName: 'someSli',
      sliEntity: {
        sliType: websiteEventBased,
        goodEventFilterExpression: tagFilter('beacon.http.status', 'EQUALS', '200'),
        badEventFilterExpression: tagFilter('beacon.http.status', 'NOT_EQUAL', '200'),
        beaconType: 'httpRequest'
      },
      id: 'someId',
      initialEvaluationTimestamp: 0
    };
    useValidateWebsiteFilterExpression.mockImplementation(({ filterExpression = [] }) => {
      return isMatch(filterExpression[0], tagFilter('beacon.http.status', 'NOT_EQUAL', '200'));
    });

    // When
    const wrapper = shallow(
      <CreateWebsiteSliForm
        sliConfig={sliConfig}
        entityId="someString"
        close={jest.fn()}
        setFooter={jest.fn()}
        onSave={jest.fn()}
      />
    ).dive();

    // Then
    expect(
      wrapper.containsMatchingElement(
        // @ts-expect-error
        <CreateSliForm filterExpressionValid={false}>
          {/* @ts-expect-error */}
          <WebsiteSliForm />
        </CreateSliForm>
      )
    ).toBeTruthy();
  });

  it('validates the forms filterExpression as invalid if the badEventFilterExpression is invalid for event based sli', () => {
    // Given
    useWebsite.mockReturnValueOnce([mockWebsite, 'resolved', [], { loading: false }]);
    const sliConfig: SliConfig<WebsiteEventBasedSliEntity> = {
      sliName: 'someSli',
      sliEntity: {
        sliType: websiteEventBased,
        goodEventFilterExpression: tagFilter('beacon.http.status', 'EQUALS', '200'),
        badEventFilterExpression: tagFilter('beacon.http.status', 'NOT_EQUAL', '200'),
        beaconType: 'httpRequest'
      },
      id: 'someId',
      initialEvaluationTimestamp: 0
    };
    useValidateWebsiteFilterExpression.mockImplementation(({ filterExpression = [] }) => {
      return isMatch(filterExpression[0], tagFilter('beacon.http.status', 'EQUALS', '200'));
    });

    // When
    const wrapper = shallow(
      <CreateWebsiteSliForm
        sliConfig={sliConfig}
        entityId="someString"
        close={jest.fn()}
        setFooter={jest.fn()}
        onSave={jest.fn()}
      />
    ).dive();

    // Then
    expect(
      wrapper.containsMatchingElement(
        // @ts-expect-error
        <CreateSliForm filterExpressionValid={false}>
          {/* @ts-expect-error */}
          <WebsiteSliForm />
        </CreateSliForm>
      )
    ).toBeTruthy();
  });

  it('validates the forms filterExpression as valid if the filterExpression is valid for time based sli', () => {
    // Given
    useWebsite.mockReturnValueOnce([mockWebsite, 'resolved', [], { loading: false }]);
    const sliConfig: SliConfig<WebsiteTimeBasedSliEntity> = {
      sliName: 'someSli',
      sliEntity: {
        sliType: websiteTimeBased,
        filterExpression: tagFilter('beacon.http.status', 'EQUALS', '200'),
        beaconType: 'httpRequest'
      },
      id: 'someId',
      initialEvaluationTimestamp: 0
    };
    useValidateWebsiteFilterExpression.mockImplementation(({ filterExpression = [] }) => {
      return isMatch(filterExpression[0], tagFilter('beacon.http.status', 'EQUALS', '200'));
    });

    // When
    const wrapper = shallow(
      <CreateWebsiteSliForm
        sliConfig={sliConfig}
        entityId="someString"
        close={jest.fn()}
        setFooter={jest.fn()}
        onSave={jest.fn()}
      />
    ).dive();

    // Then
    expect(
      wrapper.containsMatchingElement(
        // @ts-expect-error
        <CreateSliForm filterExpressionValid>
          {/* @ts-expect-error */}
          <WebsiteSliForm />
        </CreateSliForm>
      )
    ).toBeTruthy();
  });
});
