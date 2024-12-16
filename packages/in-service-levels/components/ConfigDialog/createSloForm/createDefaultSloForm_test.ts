/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { formatDate } from '@instana/format-date';

import {
  createDefaultSloForm,
  getDefaultEntityFields,
  getDefaultScopeFields,
  getDefaultIndicatorFields,
  getDefaultObjectiveFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/createDefaultSloForm';
import { testDate } from 'in-service-levels/components/ConfigDialog/createSloForm/testData';

describe('in-service-levels/components/SloList/components/DialogSections/createSloForm/createDefaultSloForm', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(testDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('field getters work properly', () => {
    it('returns correct values when using getDefaultEntityFields with a website entity type', () => {
      // Given
      const websiteEntityType = 'website';

      // When
      const entityFields = getDefaultEntityFields(websiteEntityType);

      const entityTypeValue = entityFields.type.value;
      const entityIdValue = entityFields.entityIds.value[0];

      // Then
      expect(entityTypeValue).toEqual('website');
      expect(entityIdValue).toEqual(undefined);
    });

    it('returns correct values when using getDefaultEntityFields with an application entity type', () => {
      // Given
      const applicationEntityType = 'application';

      // When
      const entityFields = getDefaultEntityFields(applicationEntityType);

      const entityTypeValue = entityFields.type.value;
      const entityIdValue = entityFields.entityIds.value[0];

      // Then
      expect(entityIdValue).toEqual(undefined);
      expect(entityTypeValue).toEqual('application');
    });

    it('returns correct values when using getDefaultScopeFields ', () => {
      // When
      const scopeFields = getDefaultScopeFields();

      const beaconTypeValue = scopeFields.beaconType.value;
      const boundaryScopeValue = scopeFields.boundaryScope.value;
      const includeInternalValue = scopeFields.includeInternal.value;
      const includeSyntheticValue = scopeFields.includeSynthetic.value;
      const endpointIdValue = scopeFields.endpointId.value;
      const serviceIdValue = scopeFields.serviceId.value;
      const tagFilterExpressionValue = scopeFields.tagFilterExpression.value;

      // Then
      expect(beaconTypeValue).toEqual('httpRequest');
      expect(boundaryScopeValue).toEqual('ALL');
      expect(includeInternalValue).toEqual(false);
      expect(includeSyntheticValue).toEqual(false);
      expect(endpointIdValue).toEqual('');
      expect(serviceIdValue).toEqual('');
      expect(tagFilterExpressionValue).toEqual([]);
    });

    it('returns correct values when using getDefaultIndicatorFields', () => {
      // When
      const indicatorFields = getDefaultIndicatorFields();

      const aggregationValue = indicatorFields.aggregation.value;
      const badEventsFilterValue = indicatorFields.badEventsFilter.value;
      const blueprintValue = indicatorFields.blueprint.value;
      const goodEventsFilterValue = indicatorFields.goodEventsFilter.value;
      const thresholdValue = indicatorFields.threshold.value;
      const indicatorTypeValue = indicatorFields.type.value;

      // Then
      expect(aggregationValue).toEqual('MEAN');
      expect(badEventsFilterValue).toEqual([]);
      expect(blueprintValue).toEqual('latency');
      expect(goodEventsFilterValue).toEqual([]);
      expect(thresholdValue).toEqual(undefined);
      expect(indicatorTypeValue).toEqual('timeBased');
    });

    it('returns correct values when using getDefaultObjectiveFields', () => {
      // When
      const timeWindowFields = getDefaultObjectiveFields();
      const durationValue = timeWindowFields.duration.value;
      const durationUnitValue = timeWindowFields.durationUnit.value;
      const startTimestampValue = timeWindowFields.startTimestamp.toJS().date;
      const timeWindowTypeValue = timeWindowFields.type.value;
      const timeStamp = formatDate(new Date().setHours(0, 0, 0, 0));
      // Then
      expect(durationValue).toEqual(1);
      expect(durationUnitValue).toEqual('week');
      expect(startTimestampValue).toEqual(timeStamp);
      expect(timeWindowTypeValue).toEqual('fixed');
    });
  });

  describe('createDefaultSloForm function returns correct form', () => {
    it('createDefaultSloForm returns correct form data when website entity type is passed', () => {
      // Given
      const websiteEntityType = 'website';

      // When
      const websiteForm = createDefaultSloForm(websiteEntityType);

      const entityTypeValue = websiteForm.getIn(['entity', 'type']).value;
      const entityIdIdValue = websiteForm.getIn(['entity', 'entityIds']).value[0];
      const beaconTypeValue = websiteForm.getIn(['scope', 'beaconType']).value;
      const boundaryScopeValue = websiteForm.getIn(['scope', 'boundaryScope']).value;
      const includeInternalValue = websiteForm.getIn(['scope', 'includeInternal']).value;
      const includeSyntheticValue = websiteForm.getIn(['scope', 'includeSynthetic']).value;
      const endpointIdValue = websiteForm.getIn(['scope', 'endpointId']).value;
      const serviceIdValue = websiteForm.getIn(['scope', 'serviceId']).value;
      const tagFilterExpressionValue = websiteForm.getIn(['scope', 'tagFilterExpression']).value;
      const aggregationValue = websiteForm.getIn(['indicator', 'aggregation']).value;
      const badEventsFilterValue = websiteForm.getIn(['indicator', 'badEventsFilter']).value;
      const blueprintValue = websiteForm.getIn(['indicator', 'blueprint']).value;
      const goodEventsFilterValue = websiteForm.getIn(['indicator', 'goodEventsFilter']).value;
      const thresholdValue = websiteForm.getIn(['indicator', 'threshold']).value;
      const indicatorTypeValue = websiteForm.getIn(['indicator', 'type']).value;
      const durationValue = websiteForm.getIn(['objective', 'duration']).value;
      const durationUnitValue = websiteForm.getIn(['objective', 'durationUnit']).value;
      const startTimestampValue = websiteForm.getIn(['objective', 'startTimestamp', 'date']).value;
      const timeWindowTypeValue = websiteForm.getIn(['objective', 'type']).value;
      const timeStamp = formatDate(new Date().setHours(0, 0, 0, 0));

      // Then
      expect(entityTypeValue).toEqual('website');
      expect(entityIdIdValue).toEqual(undefined);
      expect(beaconTypeValue).toEqual('httpRequest');
      expect(boundaryScopeValue).toEqual('ALL');
      expect(includeInternalValue).toEqual(false);
      expect(includeSyntheticValue).toEqual(false);
      expect(endpointIdValue).toEqual('');
      expect(serviceIdValue).toEqual('');
      expect(tagFilterExpressionValue).toEqual([]);
      expect(aggregationValue).toEqual('MEAN');
      expect(badEventsFilterValue).toEqual([]);
      expect(blueprintValue).toEqual('latency');
      expect(goodEventsFilterValue).toEqual([]);
      expect(thresholdValue).toEqual(undefined);
      expect(indicatorTypeValue).toEqual('timeBased');
      expect(durationValue).toEqual(1);
      expect(durationUnitValue).toEqual('week');
      expect(startTimestampValue).toEqual(timeStamp);
      expect(timeWindowTypeValue).toEqual('fixed');
    });

    it('createDefaultSloForm returns correct form data when applicaiton entity type is passed', () => {
      // Given
      const applicationEntityType = 'application';

      // When
      const applicationForm = createDefaultSloForm(applicationEntityType);

      const entityTypeValue = applicationForm.getIn(['entity', 'type']).value;
      const entityIdIdValue = applicationForm.getIn(['entity', 'entityIds']).value[0];
      const beaconTypeValue = applicationForm.getIn(['scope', 'beaconType']).value;
      const boundaryScopeValue = applicationForm.getIn(['scope', 'boundaryScope']).value;
      const includeInternalValue = applicationForm.getIn(['scope', 'includeInternal']).value;
      const includeSyntheticValue = applicationForm.getIn(['scope', 'includeSynthetic']).value;
      const endpointIdValue = applicationForm.getIn(['scope', 'endpointId']).value;
      const serviceIdValue = applicationForm.getIn(['scope', 'serviceId']).value;
      const tagFilterExpressionValue = applicationForm.getIn(['scope', 'tagFilterExpression']).value;
      const aggregationValue = applicationForm.getIn(['indicator', 'aggregation']).value;
      const badEventsFilterValue = applicationForm.getIn(['indicator', 'badEventsFilter']).value;
      const blueprintValue = applicationForm.getIn(['indicator', 'blueprint']).value;
      const goodEventsFilterValue = applicationForm.getIn(['indicator', 'goodEventsFilter']).value;
      const thresholdValue = applicationForm.getIn(['indicator', 'threshold']).value;
      const indicatorTypeValue = applicationForm.getIn(['indicator', 'type']).value;
      const durationValue = applicationForm.getIn(['objective', 'duration']).value;
      const durationUnitValue = applicationForm.getIn(['objective', 'durationUnit']).value;
      const startTimestampValue = applicationForm.getIn(['objective', 'startTimestamp', 'date']).value;
      const timeWindowTypeValue = applicationForm.getIn(['objective', 'type']).value;
      const timeStamp = formatDate(new Date().setHours(0, 0, 0, 0));

      // Then
      expect(entityTypeValue).toEqual('application');
      expect(entityIdIdValue).toEqual(undefined);
      expect(beaconTypeValue).toEqual('httpRequest');
      expect(boundaryScopeValue).toEqual('ALL');
      expect(includeInternalValue).toEqual(false);
      expect(includeSyntheticValue).toEqual(false);
      expect(endpointIdValue).toEqual('');
      expect(serviceIdValue).toEqual('');
      expect(tagFilterExpressionValue).toEqual([]);
      expect(aggregationValue).toEqual('MEAN');
      expect(badEventsFilterValue).toEqual([]);
      expect(blueprintValue).toEqual('latency');
      expect(goodEventsFilterValue).toEqual([]);
      expect(thresholdValue).toEqual(undefined);
      expect(indicatorTypeValue).toEqual('timeBased');
      expect(durationValue).toEqual(1);
      expect(durationUnitValue).toEqual('week');
      expect(startTimestampValue).toEqual(timeStamp);
      expect(timeWindowTypeValue).toEqual('fixed');
    });
  });
});
