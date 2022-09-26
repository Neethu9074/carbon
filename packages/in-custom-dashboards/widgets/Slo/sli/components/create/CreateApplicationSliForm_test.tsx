/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { MapForm } from 'formalistic';
import { shallow } from 'enzyme';
import { isMatch } from 'lodash';
import React from 'react';

import { just } from '@instana/observables';

import { useValidateApplicationFilterExpression as uVAFE } from 'in-custom-dashboards/widgets/Slo/sli/hooks/useApplicationQueryBuilder';
import CreateApplicationSliForm from 'in-custom-dashboards/widgets/Slo/sli/components/create/CreateApplicationSliForm';
import { applicationType, availabilityType, SliConfig } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import CreateSliForm from 'in-custom-dashboards/widgets/Slo/sli/components/create/CreateSliForm';
import { ApplicationSliForm } from 'in-custom-dashboards/widgets/Slo/sli/ApplicationSliForm';
import { createSliConfiguration as cSC } from 'in-custom-dashboards/widgets/Slo/sli/api';
import { Application, ApplicationSliEntity, AvailabilitySliEntity } from 'in-types';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import uA from 'in-applications/hooks/useApplication';

jest.mock('in-applications/hooks/useApplication', () => ({
  __esModule: true,
  default: jest.fn(() => [undefined, 'pending', []])
}));
jest.mock('in-custom-dashboards/widgets/Slo/sli/hooks/useApplicationQueryBuilder', () => ({
  useApplicationQueryBuilder: jest.fn(() => ({ QueryBuilder: jest.fn(), isQueryValid: jest.fn() })),
  useValidateApplicationFilterExpression: jest.fn(() => false)
}));
jest.mock('in-custom-dashboards/widgets/Slo/sli/api', () => ({
  createSliConfiguration: jest.fn(() => ({ tap: jest.fn() }))
}));

const useApplication = uA as jest.MockedFunction<typeof uA>;
const useValidateApplicationFilterExpression = uVAFE as jest.MockedFunction<typeof uVAFE>;
const createSliConfiguration = cSC as jest.MockedFunction<typeof cSC>;

describe('in-custom-dashboards/widgets/Slo/sli/create/CreateApplicationSliForm', () => {
  beforeEach(jest.clearAllMocks);

  const mockApplication: Application = {
    id: '1',
    label: 'Stans Lab',
    boundaryScope: 'INBOUND'
  };

  it('renders a LoadingIndicator if the application for entityId is still pending', () => {
    // Given
    useApplication.mockReturnValueOnce([undefined, 'pending', [], { loading: false }]);

    // When
    const wrapper = shallow(
      <CreateApplicationSliForm entityId="someString" close={jest.fn()} setFooter={jest.fn()} onSave={jest.fn()} />
    );

    // Then
    // @ts-expect-error
    expect(wrapper.containsMatchingElement(<LoadingIndicator />)).toBeTruthy();
  });

  it('renders a LoadingIndicator if the sliConfig is undefined', () => {
    // Given
    const sliConfig = undefined;
    useApplication.mockReturnValueOnce([{} as Application, 'resolved', [], { loading: false }]);

    // When
    const wrapper = shallow(
      <CreateApplicationSliForm
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

  it('validates the forms filterExpression as valid if both good* and badEventFilterExpression are valid', () => {
    // Given
    useApplication.mockReturnValueOnce([mockApplication, 'resolved', [], { loading: false }]);
    const sliConfig: SliConfig<AvailabilitySliEntity> = {
      sliName: 'someSli',
      sliEntity: {
        sliType: availabilityType,
        goodEventFilterExpression: tagFilter('call.erroneous', 'EQUALS', 'true'),
        badEventFilterExpression: tagFilter('call.erroneous', 'NOT_EQUAL', 'true'),
        boundaryScope: 'INBOUND',
        includeInternal: false,
        includeSynthetic: false
      },
      id: 'someId',
      initialEvaluationTimestamp: 0
    };
    useValidateApplicationFilterExpression.mockImplementation(() => {
      return true;
    });

    // When
    const wrapper = shallow(
      <CreateApplicationSliForm
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
          <ApplicationSliForm />
        </CreateSliForm>
      )
    ).toBeTruthy();
  });

  it('validates the forms filterExpression as invalid if the goodEventFilterExpression is invalid', () => {
    // Given
    useApplication.mockReturnValueOnce([mockApplication, 'resolved', [], { loading: false }]);
    const sliConfig: SliConfig<AvailabilitySliEntity> = {
      sliName: 'someSli',
      sliEntity: {
        sliType: availabilityType,
        goodEventFilterExpression: tagFilter('call.erroneous', 'EQUALS', 'true'),
        badEventFilterExpression: tagFilter('call.erroneous', 'NOT_EQUAL', 'true'),
        boundaryScope: 'INBOUND',
        includeInternal: false,
        includeSynthetic: false
      },
      id: 'someId',
      initialEvaluationTimestamp: 0
    };
    useValidateApplicationFilterExpression.mockImplementation(({ filterExpression = [] }) => {
      return isMatch(filterExpression[0], tagFilter('call.erroneous', 'EQUALS', 'true'));
    });

    // When
    const wrapper = shallow(
      <CreateApplicationSliForm
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
          <ApplicationSliForm />
        </CreateSliForm>
      )
    ).toBeTruthy();
  });

  it('validates the forms filterExpression as invalid if the badEventFilterExpression is invalid', () => {
    // Given
    useApplication.mockReturnValueOnce([mockApplication, 'resolved', [], { loading: false }]);
    const sliConfig: SliConfig<AvailabilitySliEntity> = {
      sliName: 'someSli',
      sliEntity: {
        sliType: availabilityType,
        goodEventFilterExpression: tagFilter('call.erroneous', 'EQUALS', 'true'),
        badEventFilterExpression: tagFilter('call.erroneous', 'NOT_EQUAL', 'true'),
        boundaryScope: 'INBOUND',
        includeInternal: false,
        includeSynthetic: false
      },
      id: 'someId',
      initialEvaluationTimestamp: 0
    };
    useValidateApplicationFilterExpression.mockImplementation(({ filterExpression = [] }) => {
      return isMatch(filterExpression[0], tagFilter('call.erroneous', 'NOT_EQUAL', 'true'));
    });

    // When
    const wrapper = shallow(
      <CreateApplicationSliForm
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
          <ApplicationSliForm />
        </CreateSliForm>
      )
    ).toBeTruthy();
  });

  it('correctly maps the form data for an availability sli entity to a SliConfig on submit', () => {
    // Given
    useApplication.mockReturnValueOnce([mockApplication, 'resolved', [], { loading: false }]);
    const sliConfig: SliConfig<AvailabilitySliEntity> = {
      sliName: 'someSli',
      sliEntity: {
        sliType: availabilityType,
        goodEventFilterExpression: tagFilter('call.erroneous', 'EQUALS', 'true'),
        badEventFilterExpression: tagFilter('call.erroneous', 'NOT_EQUAL', 'true'),
        boundaryScope: 'INBOUND',
        includeInternal: false,
        includeSynthetic: false
      },
      id: 'someId',
      initialEvaluationTimestamp: 0
    };
    const wrapper = shallow(
      <CreateApplicationSliForm
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
          goodEventFilterExpression: expect.objectContaining(tagFilter('call.erroneous', 'EQUALS', 'true')),
          badEventFilterExpression: expect.objectContaining(tagFilter('call.erroneous', 'NOT_EQUAL', 'true'))
        })
      })
    );
  });

  it('correctly maps the form data for an application sli entity to a SliConfig on submit', () => {
    // Given
    useApplication.mockReturnValueOnce([mockApplication, 'resolved', [], { loading: false }]);
    const sliConfig: SliConfig<ApplicationSliEntity> = {
      sliName: 'someSli',
      sliEntity: {
        sliType: applicationType,
        boundaryScope: 'INBOUND'
      },
      metricConfiguration: {
        metricName: 'some.metric',
        threshold: 99
      },
      id: 'someId',
      initialEvaluationTimestamp: 0
    };
    const wrapper = shallow(
      <CreateApplicationSliForm
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
    expect(createSliConfiguration).toHaveBeenLastCalledWith(expect.objectContaining(form.toJS()));
  });

  it('calls on save with the response body if submit was successful', done => {
    // Given
    const onSave = jest.fn();
    useApplication.mockReturnValueOnce([mockApplication, 'resolved', [], { loading: false }]);
    const sliConfig: SliConfig<ApplicationSliEntity> = {
      sliName: 'someSli',
      sliEntity: {
        sliType: applicationType,
        boundaryScope: 'INBOUND'
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
      <CreateApplicationSliForm
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
    useApplication.mockReturnValueOnce([mockApplication, 'resolved', [], { loading: false }]);
    const sliConfig: SliConfig<ApplicationSliEntity> = {
      sliName: 'someSli',
      sliEntity: {
        sliType: applicationType,
        boundaryScope: 'INBOUND'
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
      <CreateApplicationSliForm
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
