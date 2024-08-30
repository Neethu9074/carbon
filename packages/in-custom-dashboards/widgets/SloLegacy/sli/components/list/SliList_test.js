/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import { SvgIcon } from '@instana/components';

import {
  websiteTimeBased,
  websiteEventBased,
  availabilityType,
  applicationType
} from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import SliList from 'in-custom-dashboards/widgets/SloLegacy/sli/components/list/SliList';
import { role } from 'in-stores/user';

jest.mock('in-stores/user', () => ({
  role: { canConfigureServiceLevelIndicators: true }
}));

describe('in-custom-dashboards/widgets/SloLegacy/sli/components/list/SliList', () => {
  beforeEach(() => {
    role.canConfigureServiceLevelIndicators = true;
  });

  it('does not allow to selectSli if role.canConfigureServiceLevelIndicators is false', () => {
    // Given
    role.canConfigureServiceLevelIndicators = false;
    const selectSli = jest.fn();

    // When
    const wrapper = shallow(<SliList selectSli={selectSli} fetchedConfigState={[]} />);

    // Then
    expect(wrapper.first().prop('onRowClick')).toBeUndefined();
  });

  describe('name column', () => {
    it.each([[websiteTimeBased], [websiteEventBased]])('renders a website icon for %s sli', type => {
      // Given
      const config = {
        sliEntity: {
          sliType: type
        },
        sliName: 'Stans Lab Experiment Explosions'
      };

      // When
      const listWrapper = shallow(<SliList fetchedConfigState={[]} />);
      const columnDefinitions = listWrapper.first().prop('columnDefinitions');
      const nameColumn = columnDefinitions.find(definition => definition.id === 'name');
      const wrapper = shallow(nameColumn.getContent(config));

      // Then
      expect(wrapper.containsMatchingElement(<SvgIcon type="lib_website" />));
    });

    it('renders an endpoint icon for application sli that define an endpointId', () => {
      // Given
      const config = {
        sliEntity: {
          sliType: availabilityType,
          endpointId: 'boom',
          serviceId: 'experiments',
          applicationId: 'stans lab'
        },
        sliName: 'Stans Lab Experiment Explosions'
      };

      // When
      const listWrapper = shallow(<SliList fetchedConfigState={[]} />);
      const columnDefinitions = listWrapper.first().prop('columnDefinitions');
      const nameColumn = columnDefinitions.find(definition => definition.id === 'name');
      const wrapper = shallow(nameColumn.getContent(config));

      // Then
      expect(wrapper.containsMatchingElement(<SvgIcon type="lib_application_endpoint" />));
    });

    it('renders a service icon for application sli that define a serviceId, but no endpointId', () => {
      // Given
      const config = {
        sliEntity: {
          sliType: availabilityType,
          serviceId: 'experiments',
          applicationId: 'stans lab'
        },
        sliName: 'Stans Lab Experiment Explosions'
      };

      // When
      const listWrapper = shallow(<SliList fetchedConfigState={[]} />);
      const columnDefinitions = listWrapper.first().prop('columnDefinitions');
      const nameColumn = columnDefinitions.find(definition => definition.id === 'name');
      const wrapper = shallow(nameColumn.getContent(config));

      // Then
      expect(wrapper.containsMatchingElement(<SvgIcon type="lib_application_service" />));
    });

    it('renders an application icon for application sli that define neither an endpointId nor a serviceId', () => {
      // Given
      const config = {
        sliEntity: {
          sliType: availabilityType,
          applicationId: 'stans lab'
        },
        sliName: 'Stans Lab Experiment Explosions'
      };

      // When
      const listWrapper = shallow(<SliList fetchedConfigState={[]} />);
      const columnDefinitions = listWrapper.first().prop('columnDefinitions');
      const nameColumn = columnDefinitions.find(definition => definition.id === 'name');
      const wrapper = shallow(nameColumn.getContent(config));

      // Then
      expect(wrapper.containsMatchingElement(<SvgIcon type="lib_application" />));
    });
  });

  describe('metric column', () => {
    it('renders a label indicating the sli is time based and including the metric name for application time based sli configs', () => {
      // Given
      const config = {
        sliEntity: {
          sliType: applicationType,
          applicationId: 'stans lab'
        },
        sliName: 'Stans Lab Experiment Explosions',
        metricConfiguration: {
          metricName: 'explosions'
        }
      };

      // When
      const listWrapper = shallow(<SliList fetchedConfigState={[]} />);
      const columnDefinitions = listWrapper.first().prop('columnDefinitions');
      const metricColumn = columnDefinitions.find(definition => definition.id === 'metric');
      const content = metricColumn.getContent(config);

      // Then
      expect(content).toEqual(expect.stringContaining('explosions'));
      expect(content).toEqual(expect.stringContaining('Time'));
    });

    it('renders a label indicating the sli is time based and including the metric name and aggregation for application time based sli configs with the latency metric', () => {
      // Given
      const config = {
        sliEntity: {
          sliType: applicationType,
          applicationId: 'stans lab'
        },
        sliName: 'Stans Lab Experiment Explosions',
        metricConfiguration: {
          metricName: 'latency',
          metricAggregation: 'P55'
        }
      };

      // When
      const listWrapper = shallow(<SliList fetchedConfigState={[]} />);
      const columnDefinitions = listWrapper.first().prop('columnDefinitions');
      const metricColumn = columnDefinitions.find(definition => definition.id === 'metric');
      const content = metricColumn.getContent(config);

      // Then
      expect(content).toEqual(expect.stringContaining('latency'));
      expect(content).toEqual(expect.stringContaining('Time'));
      expect(content).toEqual(expect.stringContaining('P55'));
    });

    it('renders a label indicating the sli is time based and including the metric name for website time based sli configs', () => {
      // Given
      const config = {
        sliEntity: {
          sliType: websiteTimeBased
        },
        sliName: 'Stans Lab Experiment Explosions',
        metricConfiguration: {
          metricName: 'explosions'
        }
      };

      // When
      const listWrapper = shallow(<SliList fetchedConfigState={[]} />);
      const columnDefinitions = listWrapper.first().prop('columnDefinitions');
      const metricColumn = columnDefinitions.find(definition => definition.id === 'metric');
      const content = metricColumn.getContent(config);

      // Then
      expect(content).toEqual(expect.stringContaining('explosions'));
      expect(content).toEqual(expect.stringContaining('Time'));
    });

    it.each([[availabilityType], [websiteEventBased]])(
      'renders a event based labels for sli configs of type %s',
      type => {
        // Given
        const config = {
          sliEntity: {
            sliType: type
          },
          sliName: 'Stans Lab Experiment Explosions',
          metricConfiguration: {
            metricName: 'explosions'
          }
        };

        // When
        const listWrapper = shallow(<SliList fetchedConfigState={[]} />);
        const columnDefinitions = listWrapper.first().prop('columnDefinitions');
        const metricColumn = columnDefinitions.find(definition => definition.id === 'metric');
        const content = metricColumn.getContent(config);

        // Then
        expect(content).toEqual(expect.stringContaining('Event'));
      }
    );
  });

  describe('delete column', () => {
    it('does not render a delete icon if role.canConfigureServiceLevelIndicators is false', () => {
      // Given
      role.canConfigureServiceLevelIndicators = false;
      const onDelete = jest.fn();

      // When
      const listWrapper = shallow(<SliList fetchedConfigState={[]} />);
      const columnDefinitions = listWrapper.first().prop('columnDefinitions');
      const deleteColumn = columnDefinitions.find(definition => definition.id === 'delete');
      const content = deleteColumn.getContent({}, { onDelete });

      // Then
      expect(content).toBeNull();
    });
  });
});
