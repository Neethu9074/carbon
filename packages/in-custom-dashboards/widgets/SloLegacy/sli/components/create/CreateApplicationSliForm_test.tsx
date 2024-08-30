/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { shallow } from 'enzyme';
import { isMatch } from 'lodash';
import React from 'react';

import { Application, AvailabilitySliEntity } from '@instana/types';

import CreateApplicationSliForm from 'in-custom-dashboards/widgets/SloLegacy/sli/components/create/CreateApplicationSliForm';
import { useValidateApplicationFilterExpression as uVAFE } from 'in-service-levels/hooks/useApplicationQueryBuilder';
import CreateSliForm from 'in-custom-dashboards/widgets/SloLegacy/sli/components/create/CreateSliForm';
import { ApplicationSliForm } from 'in-custom-dashboards/widgets/SloLegacy/sli/ApplicationSliForm';
import { availabilityType, SliConfig } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import uA from 'in-applications/hooks/useApplication';

jest.mock('in-applications/hooks/useApplication', () => ({
  __esModule: true,
  default: jest.fn(() => [undefined, 'pending', []])
}));
jest.mock('in-service-levels/hooks/useApplicationQueryBuilder', () => ({
  useApplicationQueryBuilder: jest.fn(() => ({ QueryBuilder: jest.fn(), isQueryValid: jest.fn() })),
  useValidateApplicationFilterExpression: jest.fn(() => false)
}));
jest.mock('in-custom-dashboards/widgets/SloLegacy/sli/api', () => ({
  createSliConfiguration: jest.fn(() => ({ tap: jest.fn() }))
}));

const useApplication = uA as jest.MockedFunction<typeof uA>;
const useValidateApplicationFilterExpression = uVAFE as jest.MockedFunction<typeof uVAFE>;

describe('in-custom-dashboards/widgets/SloLegacy/sli/create/CreateApplicationSliForm', () => {
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
});
