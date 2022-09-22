/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { MapForm } from 'formalistic';
import { shallow } from 'enzyme';
import { isMatch } from 'lodash';
import React from 'react';

import { just } from '@instana/observables';

import { useValidateWebsiteFilterExpression as uVWFE } from 'in-custom-dashboards/widgets/Slo/sli/hooks/useWebsiteQueryBuilder';
import { SliConfig, websiteEventBased, websiteTimeBased } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import CreateWebsiteSliForm from 'in-custom-dashboards/widgets/Slo/sli/components/create/CreateWebsiteSliForm';
import CreateSliForm from 'in-custom-dashboards/widgets/Slo/sli/components/create/CreateSliForm';
import { Website, WebsiteEventBasedSliEntity, WebsiteTimeBasedSliEntity } from 'in-types';
import { createSliConfiguration as cSC } from 'in-custom-dashboards/widgets/Slo/sli/api';
import { WebsiteSliForm } from 'in-custom-dashboards/widgets/Slo/sli/WebsiteSliForm';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import uW from 'in-websites/hooks/useWebsite';

jest.mock('in-websites/hooks/useWebsite', () => ({
  __esModule: true,
  default: jest.fn(() => [undefined, 'pending', []])
}));
jest.mock('in-custom-dashboards/widgets/Slo/sli/hooks/useWebsiteQueryBuilder', () => ({
  useWebsiteQueryBuilder: jest.fn(() => ({ QueryBuilder: jest.fn(), isQueryValid: jest.fn() })),
  useValidateWebsiteFilterExpression: jest.fn(() => false)
}));
jest.mock('in-custom-dashboards/widgets/Slo/sli/api', () => ({
  createSliConfiguration: jest.fn(() => ({ tap: jest.fn() }))
}));

const useWebsite = uW as jest.MockedFunction<typeof uW>;
const useValidateWebsiteFilterExpression = uVWFE as jest.MockedFunction<typeof uVWFE>;
const createSliConfiguration = cSC as jest.MockedFunction<typeof cSC>;

describe('in-custom-dashboards/widgets/Slo/sli/create/CreateWebsiteSliForm', () => {
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
    // @ts-expect-error
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
    // @ts-expect-error
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

  it('correctly maps the form data for an website event based sli entity to a SliConfig on submit', () => {
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
    const wrapper = shallow(
      <CreateWebsiteSliForm
        sliConfig={sliConfig}
        entityId="someString"
        close={jest.fn()}
        setFooter={jest.fn()}
        onSave={jest.fn()}
      />
    ).dive();

    // When
    const form = wrapper.first().prop('form') as MapForm;
    wrapper.first().simulate('submit', form.toJS());

    // Then
    expect(createSliConfiguration).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sliEntity: expect.objectContaining({
          goodEventFilterExpression: expect.objectContaining(tagFilter('beacon.http.status', 'EQUALS', '200')),
          badEventFilterExpression: expect.objectContaining(tagFilter('beacon.http.status', 'NOT_EQUAL', '200'))
        })
      })
    );
  });

  it('correctly maps the form data for an website time based sli entity to a SliConfig on submit', () => {
    // Given
    useWebsite.mockReturnValueOnce([mockWebsite, 'resolved', [], { loading: false }]);
    const sliConfig: SliConfig<WebsiteTimeBasedSliEntity> = {
      sliName: 'someSli',
      sliEntity: {
        sliType: websiteTimeBased,
        filterExpression: tagFilter('beacon.http.status', 'EQUALS', '200'),
        beaconType: 'httpRequest'
      },
      metricConfiguration: {
        metricName: 'some.metric',
        threshold: 99
      },
      id: 'someId',
      initialEvaluationTimestamp: 0
    };
    const wrapper = shallow(
      <CreateWebsiteSliForm
        sliConfig={sliConfig}
        entityId="someString"
        close={jest.fn()}
        setFooter={jest.fn()}
        onSave={jest.fn()}
      />
    ).dive();

    // When
    const form = wrapper.first().prop('form') as MapForm;
    wrapper.first().simulate('submit', form.toJS());

    // Then
    expect(createSliConfiguration).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sliEntity: expect.objectContaining({
          filterExpression: expect.objectContaining(tagFilter('beacon.http.status', 'EQUALS', '200'))
        })
      })
    );
  });

  it('calls on save with the response body if submit was successful', done => {
    // Given
    const onSave = jest.fn();
    useWebsite.mockReturnValueOnce([mockWebsite, 'resolved', [], { loading: false }]);
    const sliConfig: SliConfig<WebsiteTimeBasedSliEntity> = {
      sliName: 'someSli',
      sliEntity: {
        sliType: websiteTimeBased,
        filterExpression: tagFilter('beacon.http.status', 'EQUALS', '200'),
        beaconType: 'httpRequest'
      },
      metricConfiguration: {
        metricName: 'some.metric',
        threshold: 99
      },
      id: 'someId',
      initialEvaluationTimestamp: 0
    };
    // @ts-expect-error
    createSliConfiguration.mockReturnValueOnce(just({ status: 200, body: { id: 'successId' } }));
    const wrapper = shallow(
      <CreateWebsiteSliForm
        sliConfig={sliConfig}
        entityId="someString"
        close={jest.fn()}
        setFooter={jest.fn()}
        onSave={onSave}
      />
    ).dive();
    const onSubmit = wrapper.first().prop('onSubmit');

    // When
    // @ts-expect-error
    const submit$ = onSubmit({ sliEntity: {} });

    // Then
    submit$.once(
      () => {
        expect(onSave).toHaveBeenCalledWith({ id: 'successId' });
        done();
      },
      () => {
        done.fail('the observable should not fail');
      }
    );
  });

  it('does not call on save with the response body if submit failed', done => {
    // Given
    const onSave = jest.fn();
    useWebsite.mockReturnValueOnce([mockWebsite, 'resolved', [], { loading: false }]);
    const sliConfig: SliConfig<WebsiteTimeBasedSliEntity> = {
      sliName: 'someSli',
      sliEntity: {
        sliType: websiteTimeBased,
        filterExpression: tagFilter('beacon.http.status', 'EQUALS', '200'),
        beaconType: 'httpRequest'
      },
      metricConfiguration: {
        metricName: 'some.metric',
        threshold: 99
      },
      id: 'someId',
      initialEvaluationTimestamp: 0
    };
    // @ts-expect-error
    createSliConfiguration.mockReturnValueOnce(just({ status: 400, body: {} }));
    const wrapper = shallow(
      <CreateWebsiteSliForm
        sliConfig={sliConfig}
        entityId="someString"
        close={jest.fn()}
        setFooter={jest.fn()}
        onSave={onSave}
      />
    ).dive();
    const onSubmit = wrapper.first().prop('onSubmit');

    // When
    // @ts-expect-error
    const submit$ = onSubmit({ sliEntity: {} });

    // Then
    submit$.once(
      () => {
        expect(onSave).not.toHaveBeenCalled();
        done();
      },
      () => {
        done.fail('the observable should not fail');
      }
    );
  });
});
