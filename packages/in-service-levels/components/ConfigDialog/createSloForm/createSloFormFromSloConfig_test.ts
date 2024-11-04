/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ServiceLevelObjectiveConfiguration } from '@instana/types';

import {
  createSloFormFromSloConfig,
  getEntityFieldsFromSloConfig,
  getScopeFieldsFromSloConfig
} from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromSloConfig';
import {
  testApplicationSloConfig,
  testDate,
  testWebsiteSloConfig
} from 'in-service-levels/components/ConfigDialog/createSloForm/testData';
import { formatDate } from 'in-services/formatters/date';

describe('in-service-levels/components/SloList/components/DialogSections/createSloForm/createSloFormFromSloConfig', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(testDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('field getters work properly', () => {
    it('returns correct values when using getEntityFieldsFromSloConfig with a website SLO config', () => {
      // Given
      const websiteSloConfig = testWebsiteSloConfig;

      // When
      const entityFields = getEntityFieldsFromSloConfig(websiteSloConfig);

      const entityIdValue = entityFields.entityIds.value[0];
      const entityTypeValue = entityFields.type.value;

      // Then
      expect(entityIdValue).toEqual('websiteIdHere');
      expect(entityTypeValue).toEqual('website');
    });

    it('returns correct values when using getEntityFieldsFromSloConfig with an application SLO config', () => {
      // Given
      const applicationSloConfig = testApplicationSloConfig;

      // When
      const entityFields = getEntityFieldsFromSloConfig(applicationSloConfig);

      const entityIdValue = entityFields.entityIds.value[0];
      const entityTypeValue = entityFields.type.value;

      // Then
      expect(entityIdValue).toEqual('applicationIdHere');
      expect(entityTypeValue).toEqual('application');
    });

    it('returns correct values when using getScopeFieldsFromSloConfig with a website SLO config', () => {
      // Given
      const websiteSloConfig = testWebsiteSloConfig;

      // When
      const websiteEntityFields = getScopeFieldsFromSloConfig(websiteSloConfig);

      const beaconType = websiteEntityFields.beaconType.value;
      const tagFilterExpression = websiteEntityFields.tagFilterExpression.value;

      // Then
      expect(beaconType).toEqual('httpRequest');
      expect(tagFilterExpression).toEqual([]);
    });

    it('returns correct values when using getScopeFieldsFromSloConfig with an application SLO config', () => {
      // Given
      const applicationSloConfig = testApplicationSloConfig;

      // When
      const applicationScopeFields = getScopeFieldsFromSloConfig(applicationSloConfig);

      const boundaryScope = applicationScopeFields.boundaryScope.value;
      const includeInternal = applicationScopeFields.includeInternal.value;
      const includeSynthetic = applicationScopeFields.includeSynthetic.value;
      const endpointId = applicationScopeFields.endpointId.value;
      const serviceId = applicationScopeFields.serviceId.value;
      const tagFilterExpression = applicationScopeFields.tagFilterExpression.value;

      // Then
      expect(boundaryScope).toEqual('INBOUND');
      expect(includeInternal).toEqual(true);
      expect(includeSynthetic).toEqual(true);
      expect(endpointId).toEqual('endpointIdHere');
      expect(serviceId).toEqual('serviceIdHere');
      expect(tagFilterExpression).toEqual([]);
    });
  });

  describe('createSloFormFromSloConfig returns correct forms', () => {
    it('returns correct form values when using createSloFormFromSloConfig with a website SLO config', () => {
      // Given
      const websiteSloConfig = testWebsiteSloConfig;

      // When
      const websiteForm = createSloFormFromSloConfig(websiteSloConfig);

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

      // Then
      expect(entityTypeValue).toEqual('website');
      expect(entityIdIdValue).toEqual('websiteIdHere');
      expect(beaconTypeValue).toEqual('httpRequest');
      expect(boundaryScopeValue).toEqual('ALL');
      expect(includeInternalValue).toEqual(false);
      expect(includeSyntheticValue).toEqual(false);
      expect(endpointIdValue).toEqual('');
      expect(serviceIdValue).toEqual('');
      expect(tagFilterExpressionValue).toEqual([]);
      expect(aggregationValue).toEqual('P95');
      expect(badEventsFilterValue).toEqual([]);
      expect(blueprintValue).toEqual('latency');
      expect(goodEventsFilterValue).toEqual([]);
      expect(thresholdValue).toEqual(50);
      expect(indicatorTypeValue).toEqual('timeBased');
      expect(durationValue).toEqual(1);
      expect(durationUnitValue).toEqual('week');
      expect(startTimestampValue).toEqual(formatDate(testDate));
      expect(timeWindowTypeValue).toEqual('fixed');
    });

    it('returns correct form values when using createSloFormFromSloConfig with an application SLO config', () => {
      // Given
      const applicationSloConfig = testApplicationSloConfig;

      // When
      const applicationForm = createSloFormFromSloConfig(applicationSloConfig as ServiceLevelObjectiveConfiguration);

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

      // Then
      expect(entityTypeValue).toEqual('application');
      expect(entityIdIdValue).toEqual('applicationIdHere');
      expect(beaconTypeValue).toEqual('httpRequest');
      expect(boundaryScopeValue).toEqual('INBOUND');
      expect(includeInternalValue).toEqual(true);
      expect(includeSyntheticValue).toEqual(true);
      expect(endpointIdValue).toEqual('endpointIdHere');
      expect(serviceIdValue).toEqual('serviceIdHere');
      expect(tagFilterExpressionValue).toEqual([]);
      expect(aggregationValue).toEqual('P95');
      expect(badEventsFilterValue).toEqual([]);
      expect(blueprintValue).toEqual('latency');
      expect(goodEventsFilterValue).toEqual([]);
      expect(thresholdValue).toEqual(50);
      expect(indicatorTypeValue).toEqual('timeBased');
      expect(durationValue).toEqual(1);
      expect(durationUnitValue).toEqual('week');
      expect(startTimestampValue).toEqual(formatDate(testDate));
      expect(timeWindowTypeValue).toEqual('fixed');
    });
  });
});
