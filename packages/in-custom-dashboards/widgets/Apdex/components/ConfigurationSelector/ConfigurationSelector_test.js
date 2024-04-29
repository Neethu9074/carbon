/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import { getEmptyTagFilterExpression } from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import ConfigurationSelector from 'in-custom-dashboards/widgets/Apdex/components/ConfigurationSelector';
import useApdexConfigurations from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexConfigurations';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { createForm } from 'in-custom-dashboards/widgets/Apdex/form';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

jest.mock('in-custom-dashboards/widgets/Apdex/hooks/useApdexConfigurations', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('in-custom-dashboards/widgets/Apdex/components/ConfigurationSelector/ConfigurationSelector', () => {
  beforeEach(jest.clearAllMocks);

  it('renders the correct option text if some config is available and nothing has been selected.', () => {
    // Given
    const entityId = 'someEntityId';
    const entityType = 'website';

    useApdexConfigurations.mockReturnValueOnce(
      resultToFetchedStateResponse(
        success([
          {
            apdexEntity: {
              apdexType: entityType,
              entityId,
              tagFilterExpression: getEmptyTagFilterExpression(),
              threshold: 0.8,
              beaconType: 'httpRequest'
            },
            createdAt: Date.now(),
            id: 'someId',
            apdexName: 'Foo'
          }
        ])
      )
    );

    // When
    const wrapper = shallow(
      <ConfigurationSelector
        form={createForm()}
        entityId={entityId}
        entityType={entityType}
        updateForm={() => {}}
        onOpenConfigurationManager={() => {}}
      />
    );

    // Then
    expect(wrapper.find('option').first().text()).toEqual(
      t('in-custom-dashboards:widgets.apdex.configurationSelector.pleaseSelect')
    );
  });

  it('renders a notice if no config is available and disables select element', () => {
    // Given
    const entityId = 'someEntityId';
    const entityType = 'website';

    useApdexConfigurations.mockReturnValueOnce(resultToFetchedStateResponse(success([])));

    // When
    const wrapper = shallow(
      <ConfigurationSelector
        form={createForm()}
        entityId={entityId}
        entityType={entityType}
        updateForm={() => {}}
        onOpenConfigurationManager={() => {}}
      />
    ).dive();

    // Then
    expect(wrapper.find('Section').children().find('.cds--select--disabled')).toBeTruthy();
    expect(wrapper.find('AdditionalSectionContent').dive().children().first().text()).toEqual(
      t('in-custom-dashboards:widgets.apdex.configurationSelector.noneAvailCreateOne')
    );
  });
});
