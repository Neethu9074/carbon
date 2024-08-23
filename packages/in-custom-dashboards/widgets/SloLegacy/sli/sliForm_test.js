/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import {
  applicationType,
  availabilityType,
  websiteTimeBased,
  websiteEventBased
} from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes.ts';
import {
  createForm,
  toApplicationSliConfiguration,
  toWebsiteSliConfiguration
} from 'in-custom-dashboards/widgets/SloLegacy/sli/sliForm';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';

describe('in-custom-dashboards/widgets/SloLegacy/sli/sliForm', () => {
  expect.extend({
    toBeFormField(actual) {
      const formalisticFieldKeys = [
        'value',
        'touched',
        'hierarchyTouched',
        'messages',
        'maxSeverity',
        'valid',
        'maxSeverityOfHierarchy',
        'hierarchyValid'
      ];

      const pass = typeof actual === 'object' && formalisticFieldKeys.every(key => key in actual);
      const serializedJson = JSON.stringify(actual, undefined, 2);
      const message = pass
        ? `expected ${serializedJson} to be a form field`
        : `expected ${serializedJson} to be a form field, but it was not`;

      return {
        message: () => message,
        pass
      };
    }
  });

  describe('createForm', () => {
    it('returns a form with a sliName field having sliConfig.sliName as value if sliConfig.sliName is set', () => {
      // Given
      const entityType = 'application';
      const sliConfig = { sliName: 'someSliName' };
      const entityId = 'someEntityId';
      const applicationEntity = {
        boundaryScope: 'INBOUND',
        id: 'someApplicationEntityId',
        label: 'someLabel'
      };

      // When
      const form = createForm(entityType, sliConfig, entityId, applicationEntity);

      // Then
      expect(form).toHaveProperty('items');
      expect(form.items).toHaveProperty('sliName');
      expect(form.items.sliName.value).toEqual('someSliName');
    });
    it('returns a form with a sliName field having an empty value if sliConfig.sliName is not set', () => {
      // Given
      const entityType = 'application';
      const sliConfig = { sliName: undefined };
      const entityId = 'someEntityId';
      const applicationEntity = {
        boundaryScope: 'INBOUND',
        id: 'someApplicationEntityId',
        label: 'someLabel'
      };

      // When
      const form = createForm(entityType, sliConfig, entityId, applicationEntity);

      // Then
      expect(form).toHaveProperty('items');
      expect(form.items).toHaveProperty('sliName');
      expect(form.items.sliName.value).toEqual('');
    });
    it('returns a form with a id field if sliConfig.id is set', () => {
      // Given
      const entityType = 'application';
      const sliConfig = { id: 'someSliId' };
      const entityId = 'someEntityId';
      const applicationEntity = {
        boundaryScope: 'INBOUND',
        id: 'someApplicationEntityId',
        label: 'someLabel'
      };

      // When
      const form = createForm(entityType, sliConfig, entityId, applicationEntity);

      // Then
      expect(form).toHaveProperty('items');
      expect(form.items).toHaveProperty('id');
      expect(form.items.id.value).toEqual('someSliId');
    });
    it('returns a form without a id field if sliConfig.id is not set', () => {
      // Given
      const entityType = 'application';
      const sliConfig = { id: undefined };
      const entityId = 'someEntityId';
      const applicationEntity = {
        boundaryScope: 'INBOUND',
        id: 'someApplicationEntityId',
        label: 'someLabel'
      };

      // When
      const form = createForm(entityType, sliConfig, entityId, applicationEntity);

      // Then
      expect(form).toHaveProperty('items');
      expect(form.items).not.toHaveProperty('id');
    });
    it('returns a ApplicationSliEntityForm if entityType is application', () => {
      // Given
      const entityType = 'application';
      const sliConfig = { sliName: 'someSliName' };
      const entityId = 'someEntityId';
      const applicationEntity = {
        boundaryScope: 'INBOUND',
        id: 'someApplicationEntityId',
        label: 'someLabel'
      };

      // When
      const form = createForm(entityType, sliConfig, entityId, applicationEntity);

      // Then
      expect(form).toHaveProperty('items');
      expect(form.items).toHaveProperty('sliEntity');
      expect(form.items.sliEntity).toHaveProperty('items');
      expect(form.items.sliEntity.items.sliType).toBeFormField();
      expect(form.items.sliEntity.items.applicationId).toBeFormField();
      expect(form.items.sliEntity.items.serviceId).toBeFormField();
      expect(form.items.sliEntity.items.endpointId).toBeFormField();
      expect(form.items.sliEntity.items.boundaryScope).toBeFormField();
      expect(form.items.sliEntity.items.includeInternal).toBeFormField();
      expect(form.items.sliEntity.items.includeSynthetic).toBeFormField();
    });
    it('returns a WebsiteSliEntityForm if entityType is website', () => {
      // Given
      const entityType = 'website';
      const sliConfig = { sliName: 'someSliName' };
      const entityId = 'someEntityId';
      const websiteEntity = {
        id: 'someWebsiteEntityId',
        label: 'someLabel'
      };

      // When
      const form = createForm(entityType, sliConfig, entityId, websiteEntity);

      // Then
      expect(form).toHaveProperty('items');
      expect(form.items).toHaveProperty('sliEntity');
      expect(form.items.sliEntity).toHaveProperty('items');
      expect(form.items.sliEntity.items.sliType).toBeFormField();
      expect(form.items.sliEntity.items.websiteId).toBeFormField();
      expect(form.items.sliEntity.items.beaconType).toBeFormField();
      expect(form.items.sliEntity.items.filterExpression).toBeFormField();
    });
    it('returns a ApplicationSliEntityForm unless whether application or website is provided as entityType', () => {
      // Given
      const entityType = 'someRandomEntity';
      const sliConfig = { sliName: 'someSliName' };
      const entityId = 'someEntityId';
      const applicationEntity = {
        boundaryScope: 'INBOUND',
        id: 'someApplicationEntityId',
        label: 'someLabel'
      };

      // When
      const form = createForm(entityType, sliConfig, entityId, applicationEntity);

      // Then
      expect(form).toHaveProperty('items');
      expect(form.items).toHaveProperty('sliEntity');
      expect(form.items.sliEntity).toHaveProperty('items');
      expect(form.items.sliEntity.items.sliType).toBeFormField();
      expect(form.items.sliEntity.items.applicationId).toBeFormField();
      expect(form.items.sliEntity.items.serviceId).toBeFormField();
      expect(form.items.sliEntity.items.endpointId).toBeFormField();
      expect(form.items.sliEntity.items.boundaryScope).toBeFormField();
      expect(form.items.sliEntity.items.includeInternal).toBeFormField();
      expect(form.items.sliEntity.items.includeSynthetic).toBeFormField();
    });
    it('returns a MetricForm if sliType in sliConfig.sliEntity is application', () => {
      // Given
      const entityType = 'application';
      const sliEntity = { sliType: 'application' };
      const sliConfig = { sliName: 'someSliName', sliEntity };
      const entityId = 'someEntityId';
      const applicationEntity = {
        boundaryScope: 'INBOUND',
        id: 'someApplicationEntityId',
        label: 'someLabel'
      };

      // When
      const form = createForm(entityType, sliConfig, entityId, applicationEntity);

      // Then
      expect(form).toHaveProperty('items');
      expect(form.items).toHaveProperty('metricConfiguration');
      expect(form.items.metricConfiguration).toHaveProperty('items');
      expect(form.items.metricConfiguration.items.metricName).toBeFormField();
      expect(form.items.metricConfiguration.items.metricAggregation).toBeFormField();
      expect(form.items.metricConfiguration.items.threshold).toBeFormField();
      expect(form.items.metricConfiguration.items.metricName.value).toEqual('latency');
      expect(form.items.metricConfiguration.items.metricAggregation.value).toEqual('P90');
      expect(form.items.metricConfiguration.items.threshold.value).toEqual('');
    });
    it('returns a MetricForm if sliType in sliConfig.sliEntity is websiteTimeBased', () => {
      // Given
      const entityType = 'website';
      const sliEntity = { sliType: 'websiteTimeBased' };
      const sliConfig = { sliName: 'someSliName', sliEntity };
      const entityId = 'someEntityId';
      const websiteEntity = {
        id: 'someWebsiteEntityId',
        label: 'someLabel'
      };

      // When
      const form = createForm(entityType, sliConfig, entityId, websiteEntity);

      // Then
      expect(form).toHaveProperty('items');
      expect(form.items).toHaveProperty('metricConfiguration');
      expect(form.items.metricConfiguration).toHaveProperty('items');
      expect(form.items.metricConfiguration.items.metricName).toBeFormField();
      expect(form.items.metricConfiguration.items.metricAggregation).toBeFormField();
      expect(form.items.metricConfiguration.items.threshold).toBeFormField();
      expect(form.items.metricConfiguration.items.metricName.value).toEqual('beaconErrorRate');
      expect(form.items.metricConfiguration.items.metricAggregation.value).toEqual('MEAN');
      expect(form.items.metricConfiguration.items.threshold.value).toEqual('');
    });
    it('returns a GoodBadEventsForm if entityType is application and sliType is availability', () => {
      // Given
      const entityType = 'application';
      const sliEntity = { sliType: 'availability' };
      const sliConfig = { sliName: 'someSliName', sliEntity };
      const entityId = 'someEntityId';
      const applicationEntity = {
        boundaryScope: 'INBOUND',
        id: 'someApplicationEntityId',
        label: 'someLabel'
      };

      // When
      const form = createForm(entityType, sliConfig, entityId, applicationEntity);

      // Then
      expect(form).toHaveProperty('items');
      expect(form.items).toHaveProperty('sliEntity');
      expect(form.items.sliEntity).toHaveProperty('items');
      expect(form.items.sliEntity.items.goodEventFilterExpression).toBeFormField();
      expect(form.items.sliEntity.items.badEventFilterExpression).toBeFormField();
    });
    it('returns a GoodBadEventsForm if entityType is website and sliType is websiteEventBased', () => {
      // Given
      const entityType = 'website';
      const sliEntity = { sliType: 'websiteEventBased' };
      const sliConfig = { sliName: 'someSliName', sliEntity };
      const entityId = 'someEntityId';
      const websiteEntity = {
        id: 'someWebsiteEntityId',
        label: 'someLabel'
      };

      // When
      const form = createForm(entityType, sliConfig, entityId, websiteEntity);

      // Then
      expect(form).toHaveProperty('items');
      expect(form.items).toHaveProperty('sliEntity');
      expect(form.items.sliEntity).toHaveProperty('items');
      expect(form.items.sliEntity.items.goodEventFilterExpression).toBeFormField();
      expect(form.items.sliEntity.items.badEventFilterExpression).toBeFormField();
    });
  });

  describe('toWebsiteSliConfiguration', () => {
    it('returns сorrect filterExpression, if website time based SLI entity is provided', () => {
      // Given
      const mockFilterExpresstion = tagFilter('beacon.http.status', 'EQUALS', '200');
      const mockWebsiteTimeBasedFormData = {
        sliName: 'someWebsiteSliName',
        sliEntity: {
          sliType: websiteTimeBased,
          applicationId: '123456',
          filterExpression: [mockFilterExpresstion]
        },
        metricConfiguration: {
          metricName: 'latency',
          metricAggregation: 'P90',
          threshold: 80
        }
      };

      // When
      const output = toWebsiteSliConfiguration(mockWebsiteTimeBasedFormData);

      // Then
      expect(output.sliEntity).toHaveProperty('filterExpression');
      expect(output.sliEntity.filterExpression).toEqual(mockFilterExpresstion);
    });

    it('returns сorrect goodEventFilterExpression and badEventFilterExpression, if website event based SLI entity is provided', () => {
      // Given
      const mockGoodEventFilterExpression = tagFilter('beacon.http.status', 'EQUALS', '200');
      const mockBadEventFilterExpression = tagFilter('beacon.http.status', 'NOT_EQUAL', '200');
      const mockWebsiteEventBasedFormData = {
        sliName: 'someWebsiteSliName',
        sliEntity: {
          sliType: websiteEventBased,
          applicationId: '123456',
          goodEventFilterExpression: [mockGoodEventFilterExpression],
          badEventFilterExpression: [mockBadEventFilterExpression]
        },
        metricConfiguration: {
          metricName: 'latency',
          metricAggregation: 'P90',
          threshold: 80
        }
      };

      // When
      const output = toWebsiteSliConfiguration(mockWebsiteEventBasedFormData);

      // Then
      expect(output.sliEntity).toHaveProperty('goodEventFilterExpression');
      expect(output.sliEntity).toHaveProperty('badEventFilterExpression');
      expect(output.sliEntity.goodEventFilterExpression).toEqual(mockGoodEventFilterExpression);
      expect(output.sliEntity.badEventFilterExpression).toEqual(mockBadEventFilterExpression);
    });

    it('returns undefined, if SLI entity is neither a website time based SLI, nor website event based SLI', () => {
      // Given
      const mockApplicationTypeFormData = {
        sliName: 'someWebsiteSliName',
        sliEntity: {
          sliType: applicationType,
          applicationId: '123456'
        },
        metricConfiguration: {
          metricName: 'latency',
          metricAggregation: 'P90',
          threshold: 80
        }
      };

      // When
      const output = toWebsiteSliConfiguration(mockApplicationTypeFormData);

      //Then
      expect(output).toEqual(undefined);
    });
  });

  describe('toApplicationSliConfiguration', () => {
    it('returns сorrect goodEventFilterExpression and badEventFilterExpression, if application availability type SLI entity is provided', () => {
      // Given
      const mockGoodEventFilterExpression = tagFilter('beacon.http.status', 'EQUALS', '200');
      const mockBadEventFilterExpression = tagFilter('beacon.http.status', 'NOT_EQUAL', '200');
      const mockAvailabilityTypeFormData = {
        sliName: 'someWebsiteSliName',
        sliEntity: {
          sliType: availabilityType,
          applicationId: '123456',
          goodEventFilterExpression: [mockGoodEventFilterExpression],
          badEventFilterExpression: [mockBadEventFilterExpression]
        },
        metricConfiguration: {
          metricName: 'latency',
          metricAggregation: 'P90',
          threshold: 80
        }
      };

      // When
      const output = toApplicationSliConfiguration(mockAvailabilityTypeFormData);

      // Then
      expect(output.sliEntity).toHaveProperty('goodEventFilterExpression');
      expect(output.sliEntity).toHaveProperty('badEventFilterExpression');
      expect(output.sliEntity.goodEventFilterExpression).toEqual(mockGoodEventFilterExpression);
      expect(output.sliEntity.badEventFilterExpression).toEqual(mockBadEventFilterExpression);
    });

    it('returns unchanged SLI form data, if a provided SLI entity is not an application availability type SLI entity', () => {
      // Given
      const mockApplicationTypeFormData = {
        sliName: 'someWebsiteSliName',
        sliEntity: {
          sliType: websiteEventBased,
          applicationId: '123456'
        },
        metricConfiguration: {
          metricName: 'latency',
          metricAggregation: 'P90',
          threshold: 80
        }
      };

      // When
      const output = toApplicationSliConfiguration(mockApplicationTypeFormData);

      // Then
      expect(output).toEqual(mockApplicationTypeFormData);
    });
  });
});
