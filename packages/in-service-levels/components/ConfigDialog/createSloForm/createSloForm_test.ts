/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { formatDate } from '@instana/format-date';

import {
  testWebsiteForm,
  testApplicationForm,
  testApplicationSloConfig,
  testWebsiteSloConfig,
  testDate
} from 'in-service-levels/components/ConfigDialog/createSloForm/testData';
import { createSloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/createSloForm';

describe('in-service-levels/components/SloList/components/DialogSections/createSloForm/createSloForm', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(testDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('createSloForm returns correct form fields when entityType, form, previousForm and sloConfig parameters are passed', () => {
    it('returns a form created from a website SLO config when a website SLO config is provided', () => {
      // Given
      const givenEntityType = 'website';
      const givenForm = testWebsiteForm;
      const givenPreviousForm = testWebsiteForm;
      const givenSloConfig = testWebsiteSloConfig;

      // When
      const websiteForm = createSloForm({
        entityType: givenEntityType,
        form: givenForm,
        previousForm: givenPreviousForm,
        sloConfig: givenSloConfig
      });

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

    it('returns a form created from an application SLO config when an application SLO config is provided', () => {
      // Given
      const givenEntityType = 'application';
      const givenForm = testApplicationForm;
      const givenPreviousForm = testApplicationForm;
      const givenSloConfig = testApplicationSloConfig;

      // When
      const applicationForm = createSloForm({
        entityType: givenEntityType,
        form: givenForm,
        previousForm: givenPreviousForm,
        sloConfig: givenSloConfig
      });

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

  describe('createSloForm returns correct form fields when entityType, form and previousForm parameters are passed', () => {
    it('returns a form created from a website form when a website form is provided', () => {
      // Given
      const givenEntityType = 'website';
      const givenForm = testWebsiteForm;
      const givenPreviousForm = testWebsiteForm;

      // When
      const websiteForm = createSloForm({
        entityType: givenEntityType,
        form: givenForm,
        previousForm: givenPreviousForm
      });

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
      expect(entityIdIdValue).toEqual('22222');
      expect(beaconTypeValue).toEqual('httpRequest');
      expect(boundaryScopeValue).toEqual('INBOUND');
      expect(includeInternalValue).toEqual(false);
      expect(includeSyntheticValue).toEqual(false);
      expect(endpointIdValue).toEqual('');
      expect(serviceIdValue).toEqual('');
      expect(tagFilterExpressionValue).toEqual([]);
      expect(aggregationValue).toEqual('P90');
      expect(badEventsFilterValue).toEqual([]);
      expect(blueprintValue).toEqual('latency');
      expect(goodEventsFilterValue).toEqual([]);
      expect(thresholdValue).toEqual(55);
      expect(indicatorTypeValue).toEqual('eventBased');
      expect(durationValue).toEqual(100);
      expect(durationUnitValue).toEqual('day');
      expect(startTimestampValue).toEqual(formatDate(new Date().setHours(0, 0, 0, 0)));
      expect(timeWindowTypeValue).toEqual('rolling');
    });

    it('returns a form created from an application form when an application form is provided', () => {
      // Given
      const givenEntityType = 'application';
      const givenForm = testApplicationForm;
      const givenPreviousForm = testApplicationForm;

      // When
      const applicationForm = createSloForm({
        entityType: givenEntityType,
        form: givenForm,
        previousForm: givenPreviousForm
      });

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
      expect(entityIdIdValue).toEqual('11111');
      expect(beaconTypeValue).toEqual('httpRequest');
      expect(boundaryScopeValue).toEqual('ALL');
      expect(includeInternalValue).toEqual(true);
      expect(includeSyntheticValue).toEqual(false);
      expect(endpointIdValue).toEqual('endpoindNotEmpty');
      expect(serviceIdValue).toEqual('12345');
      expect(tagFilterExpressionValue).toEqual([]);
      expect(aggregationValue).toEqual('MAX');
      expect(badEventsFilterValue).toEqual([]);
      expect(blueprintValue).toEqual('availability');
      expect(goodEventsFilterValue).toEqual([]);
      expect(thresholdValue).toEqual(66);
      expect(indicatorTypeValue).toEqual('timeBased');
      expect(durationValue).toEqual(100);
      expect(durationUnitValue).toEqual('day');
      expect(startTimestampValue).toEqual(formatDate(new Date().setHours(0, 0, 0, 0)));
      expect(timeWindowTypeValue).toEqual('fixed');
    });
  });

  describe('createSloForm returns correct form fields when entityType and previousForm parameters are passed', () => {
    it('returns a form created from a previous website form when a previous website form is provided', () => {
      // Given
      const givenEntityType = 'website';
      const givenPreviousForm = testWebsiteForm;

      // When
      const websiteForm = createSloForm({
        entityType: givenEntityType,
        previousForm: givenPreviousForm
      });

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
      expect(entityIdIdValue).toEqual(undefined);
      expect(beaconTypeValue).toEqual('httpRequest');
      expect(boundaryScopeValue).toEqual('ALL');
      expect(includeInternalValue).toEqual(false);
      expect(includeSyntheticValue).toEqual(false);
      expect(endpointIdValue).toEqual('');
      expect(serviceIdValue).toEqual('');
      expect(tagFilterExpressionValue).toEqual([]);
      expect(aggregationValue).toEqual('P90');
      expect(badEventsFilterValue).toEqual([]);
      expect(blueprintValue).toEqual('latency');
      expect(goodEventsFilterValue).toEqual([]);
      expect(thresholdValue).toEqual(55);
      expect(indicatorTypeValue).toEqual('eventBased');
      expect(durationValue).toEqual(1);
      expect(durationUnitValue).toEqual('week');
      expect(startTimestampValue).toEqual(formatDate(new Date().setHours(0, 0, 0, 0)));
      expect(timeWindowTypeValue).toEqual('fixed');
    });

    it('returns a form created from a previous application form when a previous application form is provided', () => {
      // Given
      const givenEntityType = 'application';
      const givenPreviousForm = testApplicationForm;

      // When
      const applicationForm = createSloForm({
        entityType: givenEntityType,
        previousForm: givenPreviousForm
      });

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
      expect(entityIdIdValue).toEqual(undefined);
      expect(beaconTypeValue).toEqual('httpRequest');
      expect(boundaryScopeValue).toEqual('ALL');
      expect(includeInternalValue).toEqual(false);
      expect(includeSyntheticValue).toEqual(false);
      expect(endpointIdValue).toEqual('');
      expect(serviceIdValue).toEqual('');
      expect(tagFilterExpressionValue).toEqual([]);
      expect(aggregationValue).toEqual('MAX');
      expect(badEventsFilterValue).toEqual([]);
      expect(blueprintValue).toEqual('availability');
      expect(goodEventsFilterValue).toEqual([]);
      expect(thresholdValue).toEqual(66);
      expect(indicatorTypeValue).toEqual('timeBased');
      expect(durationValue).toEqual(1);
      expect(durationUnitValue).toEqual('week');
      expect(startTimestampValue).toEqual(formatDate(new Date().setHours(0, 0, 0, 0)));
      expect(timeWindowTypeValue).toEqual('fixed');
    });
  });

  describe('createSloForm returns correct form fields whenonly an entityType parameter is passed', () => {
    it('returns a default website SLO form when entityType equal to website is passed', () => {
      // Given
      const entityType = 'website';

      // When
      const websiteForm = createSloForm({ entityType });

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
      expect(startTimestampValue).toEqual(formatDate(new Date().setHours(0, 0, 0, 0)));
      expect(timeWindowTypeValue).toEqual('fixed');
    });

    it('returns a default application SLO form when entityType equal to application is passed', () => {
      // Given
      const entityType = 'application';

      // When
      const applicationForm = createSloForm({ entityType });

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
      expect(startTimestampValue).toEqual(formatDate(new Date().setHours(0, 0, 0, 0)));
      expect(timeWindowTypeValue).toEqual('fixed');
    });

    it('triggers an error when passing no arguments', () => {
      // Then
      expect(() => {
        createSloForm({});
      }).toThrowError('You have to pass at least one param to the function');
    });
  });
});
