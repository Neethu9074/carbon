/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { shallow } from 'enzyme';
import React from 'react';

import { LoadingSkeleton } from '@instana/components';

import WidgetLeftHeader from 'in-custom-dashboards/widgets/SloLegacy/components/widget/WidgetLeftHeader';
import SliConfigInfo from 'in-custom-dashboards/widgets/SloLegacy/components/SliConfigInfo';
import SloEntityInfo from 'in-service-levels/components/SloList/components/SloEntityInfo';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/SloLegacy/components/widget/WidgetLeftHeader', () => {
  describe('if status equals pending and monitoredEntity is set', () => {
    it('should render a LoadingSkeleton component', () => {
      const wrapper = shallow(<WidgetLeftHeader status="pending" monitoredEntity={{ id: 'foo', label: 'bar' }} />);
      expect(wrapper.find(LoadingSkeleton)).toHaveLength(1);
    });
  });
  describe('if monitoredEntity is not set and status does not equals pending ', () => {
    it('should render a LoadingSkeleton component', () => {
      const wrapper = shallow(<WidgetLeftHeader status="resolved" />);
      expect(wrapper.find(LoadingSkeleton)).toHaveLength(1);
    });
  });
  describe('if monitoredEntity is not set and status equals pending', () => {
    it('should render a LoadingSkeleton component', () => {
      const wrapper = shallow(<WidgetLeftHeader status="pending" />);
      expect(wrapper.find(LoadingSkeleton)).toHaveLength(1);
    });
  });
  describe('if status is not pending and monitoredEntity is set', () => {
    it('should render a SloEntityInfo component', () => {
      const wrapper = shallow(<WidgetLeftHeader status="resolved" monitoredEntity={{ id: 'foo', label: 'bar' }} />);
      expect(wrapper.find(SloEntityInfo)).toHaveLength(1);
    });
    it('should render a SliConfigInfo component', () => {
      const wrapper = shallow(<WidgetLeftHeader status="resolved" monitoredEntity={{ id: 'foo', label: 'bar' }} />);
      expect(wrapper.find(SliConfigInfo)).toHaveLength(1);
    });
  });
  it('should render a preview message if isPreview is true', () => {
    // Given
    const isPreview = true;

    // When
    const wrapper = shallow(<WidgetLeftHeader isPreview={isPreview} title="" status="" monitoredEntityType="" />);

    // Then
    expect(
      wrapper.containsMatchingElement(t('in-custom-dashboards:widgets.slo.widgetLeftHeader.previewDataInfo'))
    ).toBeTruthy();
  });
});
