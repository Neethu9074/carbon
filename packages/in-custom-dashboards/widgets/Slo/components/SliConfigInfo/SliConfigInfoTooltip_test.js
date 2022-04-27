/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import SliConfigInfoTooltip from 'in-custom-dashboards/widgets/Slo/components/SliConfigInfo/SliConfigInfoTooltip';
import SliConfigInfoItem from 'in-custom-dashboards/widgets/Slo/components/SliConfigInfo/SliConfigInfoItem';
import SliConfigInfoMetricItem from './SliConfigInfoMetricItem';
import { t } from 'in-i18n';

describe('packages/in-custom-dashboards/widgets/Slo/components/SliConfigInfo/SliConfigInfoTooltip', () => {
  it('should have an item containing label and value for sli name', () => {
    const wrapper = shallow(
      <SliConfigInfoTooltip sliConfig={{ sliEntity: { sliType: 'application' }, sliName: 'foo' }} />
    );

    expect(
      wrapper
        .find(SliConfigInfoItem)
        .first()
        .prop('label')
    ).toEqual(`${t(`in-custom-dashboards:widgets.slo.sliConfig.sliName`)}:`);
    expect(
      wrapper
        .find(SliConfigInfoItem)
        .first()
        .prop('value')
    ).toEqual('foo');
  });

  it('should have an item containing label and value for sli type', () => {
    const wrapper = shallow(
      <SliConfigInfoTooltip sliConfig={{ sliEntity: { sliType: 'application' }, sliName: 'foo' }} />
    );

    expect(
      wrapper
        .find(SliConfigInfoItem)
        .last()
        .prop('label')
    ).toEqual(`${t(`in-custom-dashboards:widgets.slo.sliConfig.sliType`)}:`);
    expect(
      wrapper
        .find(SliConfigInfoItem)
        .last()
        .prop('value')
    ).toEqual(t(`in-custom-dashboards:widgets.slo.timeBased`));
  });

  it('should have an item containing label and time based SLI type as value', () => {
    const wrapper = shallow(
      <SliConfigInfoTooltip sliConfig={{ sliEntity: { sliType: 'websiteTimeBased' }, sliName: 'foo' }} />
    );

    expect(
      wrapper
        .find(SliConfigInfoItem)
        .last()
        .prop('label')
    ).toEqual(`${t(`in-custom-dashboards:widgets.slo.sliConfig.sliType`)}:`);
    expect(
      wrapper
        .find(SliConfigInfoItem)
        .last()
        .prop('value')
    ).toEqual(t(`in-custom-dashboards:widgets.slo.timeBased`));
  });

  it('should have an item containing metric infos', () => {
    const wrapper = shallow(
      <SliConfigInfoTooltip
        sliConfig={{ sliEntity: { sliType: 'application' }, sliName: 'foo' }}
        entityType="application"
      />
    );

    expect(wrapper.find(SliConfigInfoMetricItem)).toHaveLength(1);
  });

  it('should have a ApplicationBadEventFilters component if sliType is availability ', () => {
    const wrapper = shallow(
      <SliConfigInfoTooltip
        sliConfig={{ sliEntity: { sliType: 'availability' }, sliName: 'foo' }}
        entityType="application"
      />
    );

    expect(wrapper.find('ApplicationBadEventFilters')).toHaveLength(1);
  });

  it('should have a WebsiteBadEventFilters component if sliType is websiteEventBased', () => {
    const wrapper = shallow(
      <SliConfigInfoTooltip
        sliConfig={{ sliEntity: { sliType: 'websiteEventBased' }, sliName: 'foo' }}
        entityType="website"
      />
    );

    expect(wrapper.find('WebsiteBadEventFilters')).toHaveLength(1);
  });

  it('should not have any BadEventFilters component if sliType is neither websiteEventBased nor availability', () => {
    const wrapper = shallow(
      <SliConfigInfoTooltip
        sliConfig={{ sliEntity: { sliType: 'application' }, sliName: 'foo' }}
        entityType="application"
      />
    );

    expect(wrapper.find('ApplicationBadEventFilters')).toHaveLength(0);
    expect(wrapper.find('WebsiteBadEventFilters')).toHaveLength(0);
  });
});
