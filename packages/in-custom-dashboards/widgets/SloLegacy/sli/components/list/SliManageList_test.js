/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import { Message } from '@instana/components';

import SliManageList from 'in-custom-dashboards/widgets/SloLegacy/sli/components/list/SliManageList';
import { getSliConfigurationsByEntity } from 'in-custom-dashboards/widgets/SloLegacy/sli/api';
import SliList from 'in-custom-dashboards/widgets/SloLegacy/sli/components/list/SliList';
import { success, error, hasError } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { role } from 'in-stores/user';
import { Trans } from 'in-i18n';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn((o, d) => o(d))
}));

jest.mock('in-custom-dashboards/widgets/SloLegacy/sli/api', () => ({
  deleteSliConfiguration: jest.fn(),
  getSliConfigurationsByEntity: jest.fn()
}));

jest.mock('in-stores/user', () => ({
  role: { canConfigureServiceLevelIndicators: true }
}));

describe('in-custom-dashboards/widgets/SloLegacy/sli/components/list/SliManageList', () => {
  expect.extend({
    toHaveError(actual) {
      const isErroneous = hasError(actual);
      if (isErroneous) {
        return {
          message: () => `expected ${JSON.stringify(actual, undefined, 2)} to be an erroneous Result`,
          pass: true
        };
      } else {
        return {
          message: () => `expected ${JSON.stringify(actual, undefined, 2)} to be an erroneous Result, but it was not`,
          pass: false
        };
      }
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    getSliConfigurationsByEntity.mockImplementation(() => {
      return {
        ...pendingResult,
        map: mapper => mapper(pendingResult)
      };
    });
    role.canConfigureServiceLevelIndicators = true;
  });

  it('deselects any selected sli when the slideIn content is closed', () => {
    // Given
    const entityType = 'application';
    const entityId = 'someApplication';
    const value = {};
    const onChange = jest.fn();
    const wrapper = shallow(
      <SliManageList onChange={onChange} value={value} entityType={entityType} entityId={entityId} />
    );
    const close = wrapper.prop('onShowSlideInContentChange');

    // When
    close();

    // Then
    expect(onChange).toHaveBeenLastCalledWith(undefined);
  });

  it('filters the sli by name with the content of the SliLists search field', () => {
    // Given
    const sli = [{ sliName: 'Uncaught typos' }, { sliName: 'Cookies available' }];
    getSliConfigurationsByEntity.mockImplementation(() => {
      return {
        ...success(sli),
        map: mapper => mapper(success(sli))
      };
    });
    const listWrapper = shallow(<SliManageList onChange={jest.fn()} entityType={'application'} entityId={'someId'} />);
    const staticContent = listWrapper.prop('staticContent');
    const wrapper = shallow(staticContent);
    const onFilter = wrapper.find(SliList).prop('onChange');

    // When
    onFilter({ query: 'typo' });
    wrapper.rerender();
    const [sliResult] = wrapper.find(SliList).prop('fetchedConfigState');

    // Then
    expect(sliResult).toEqual([expect.objectContaining({ sliName: 'Uncaught typos' })]);
  });

  it('displays an info message if role.canConfigureServiceLevelIndicators if false', () => {
    // Given
    role.canConfigureServiceLevelIndicators = false;

    // When
    const listWrapper = shallow(<SliManageList onChange={jest.fn()} entityType={'application'} entityId={''} />);
    const staticContent = listWrapper.prop('staticContent');
    const wrapper = shallow(staticContent);

    // Then
    expect(
      wrapper.containsMatchingElement(
        <Message>
          <Trans i18nKey="in-custom-dashboards:widgets.slo.sliManageList.configSrvLevelIndicatorsMsg" />
        </Message>
      )
    ).toBeTruthy();
  });

  it('does not allow the creation of sli if role.canConfigureServiceLevelIndicators if false', () => {
    // Given
    role.canConfigureServiceLevelIndicators = false;

    // When
    const manageListWrapper = shallow(<SliManageList onChange={jest.fn()} entityType={'application'} entityId={''} />);
    const staticContent = manageListWrapper.prop('staticContent');
    const listWrapper = shallow(staticContent);
    const rightHeader = listWrapper.find(SliList).prop('rightHeader');

    // Then
    expect(rightHeader).toBeFalsy();
  });

  it('displays the slideIn content when create sli is clicked', () => {
    // Given
    const onShowCreateForm = jest.fn();
    const manageListWrapper = shallow(
      <SliManageList
        onChange={jest.fn()}
        entityType={'application'}
        entityId={''}
        onShowCreateForm={onShowCreateForm}
      />
    );
    const staticContent = manageListWrapper.prop('staticContent');
    const listWrapper = shallow(staticContent);
    const wrapper = shallow(listWrapper.find(SliList).prop('rightHeader'));

    // When
    wrapper.first().props().onClick();

    // Then
    expect(onShowCreateForm).toHaveBeenCalled();
  });

  it('calls onChange for a specific sli when it is selected', () => {
    // Given
    const onChange = jest.fn();
    const sliConfig = { sliName: 'Hidden typos' };
    const manageListWrapper = shallow(<SliManageList onChange={onChange} entityType={'application'} entityId={''} />);
    const staticContent = manageListWrapper.prop('staticContent');
    const wrapper = shallow(staticContent);

    // When
    wrapper.find(SliList).props().selectSli(sliConfig);

    // Then
    expect(onChange).toHaveBeenLastCalledWith(sliConfig);
  });

  it('passes a loading result to SliList if getSliConfigurationsByEntity returns a loading result', () => {
    // Given
    getSliConfigurationsByEntity.mockImplementation(() => {
      return {
        ...pendingResult,
        map: mapper => mapper(pendingResult)
      };
    });

    // When
    const manageListWrapper = shallow(
      <SliManageList onChange={jest.fn} entityType={'application'} entityId={'someId'} />
    );
    const staticContent = manageListWrapper.prop('staticContent');
    const wrapper = shallow(staticContent);

    // Then
    expect(wrapper.find(SliList).prop('fetchedConfigState')).toEqual(expect.arrayContaining(['pending']));
  });

  it('passes an erroneous result to SliList of getSliConfigurationsByEntity returns one', () => {
    // Given
    const err = error([{ code: 1, message: 'a typo happened' }]);
    getSliConfigurationsByEntity.mockImplementation(() => {
      return {
        ...err,
        map: mapper => mapper(err)
      };
    });

    // When
    const manageListWrapper = shallow(
      <SliManageList onChange={jest.fn} entityType={'application'} entityId={'someId'} />
    );
    const staticContent = manageListWrapper.prop('staticContent');
    const wrapper = shallow(staticContent);

    // Then
    expect(wrapper.find(SliList).prop('fetchedConfigState')).toEqual(expect.arrayContaining(['rejected']));
  });
});
