/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { formatDate } from '@instana/format-date';

import {
  testApplicationForm,
  testDate,
  testWebsiteForm
} from 'in-service-levels/components/ConfigDialog/createSloForm/testData';
import createSloFormFromPreviousForm from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromPreviousForm';
import { SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/types';

describe('in-service-levels/components/SloList/components/DialogSections/createSloForm/createSloFormFromPreviousForm', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(testDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('field getters work properly', () => {
    it('returns correct values when using createSloFormFromPreviousForm with a website SLO form', () => {
      // Given
      const givenWebsiteForm = testWebsiteForm;

      // When
      const websiteForm = createSloFormFromPreviousForm(givenWebsiteForm);

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
      const startTimestampValue = websiteForm.getIn(['objective', 'startTimestamp', 'date'])?.value;
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

    it('returns correct values when using createSloFormFromPreviousForm with an application SLO form', () => {
      const givenApplicationForm = testApplicationForm;

      // When
      const applicationForm = createSloFormFromPreviousForm(givenApplicationForm as SloForm);

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
      const startTimestampValue = applicationForm.getIn(['objective', 'startTimestamp', 'date'])?.value;
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
});
