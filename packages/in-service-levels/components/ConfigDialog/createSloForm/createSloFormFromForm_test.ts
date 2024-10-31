/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { formatDate } from '@instana/format-date';

import {
  createSloFormFromForm,
  getEntityFieldsFromForm,
  getScopeFieldsFromForm
} from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromForm';
import {
  testApplicationForm,
  testDate,
  testWebsiteForm
} from 'in-service-levels/components/ConfigDialog/createSloForm/testData';

describe('in-service-levels/components/SloList/components/DialogSections/createSloForm/createSloFormFromForm', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(testDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('field getters work properly', () => {
    it('returns correct values when using getEntityFieldsFromForm with a website SLO form', () => {
      // Given
      const websiteForm = testWebsiteForm;

      // When
      const entityFields = getEntityFieldsFromForm(websiteForm);

      const entityIdValue = entityFields.entityIds.value[0];
      const entityTypeValue = entityFields.type.value;

      // Then
      expect(entityIdValue).toEqual('22222');
      expect(entityTypeValue).toEqual('website');
    });

    it('returns correct values when using getScopeFieldsFromForm with a website SLO form', () => {
      // Given
      const websiteForm = testWebsiteForm;

      // When
      const scopeFields = getScopeFieldsFromForm(websiteForm);

      const beaconTypeValue = scopeFields.beaconType.value;
      const boundaryScopeValue = scopeFields.boundaryScope.value;
      const includeInternalValue = scopeFields.includeInternal.value;
      const includeSyntheticValue = scopeFields.includeSynthetic.value;
      const endpointIdValue = scopeFields.endpointId.value;
      const serviceIdValue = scopeFields.serviceId.value;
      const tagFilterExpressionValue = scopeFields.tagFilterExpression.value;

      // Then
      expect(beaconTypeValue).toEqual('pageLoad');
      expect(boundaryScopeValue).toEqual('INBOUND');
      expect(includeInternalValue).toEqual(false);
      expect(includeSyntheticValue).toEqual(false);
      expect(endpointIdValue).toEqual('');
      expect(serviceIdValue).toEqual('');
      expect(tagFilterExpressionValue).toEqual([]);
    });

    it('returns correct values when using getApplicationEntityFieldsFromForm with an application SLO form', () => {
      // Given
      const applicationForm = testApplicationForm;

      // When
      const entityFields = getEntityFieldsFromForm(applicationForm);

      const entityIdValue = entityFields.entityIds.value[0];
      const entityTypeValue = entityFields.type.value;

      // Then
      expect(entityIdValue).toEqual('11111');
      expect(entityTypeValue).toEqual('application');
    });

    it('returns correct values when using getScopeFieldsFromForm with an application SLO form', () => {
      // Given
      const applicationForm = testApplicationForm;

      // When
      const scopeFields = getScopeFieldsFromForm(applicationForm);

      const beaconTypeValue = scopeFields.beaconType.value;
      const boundaryScopeValue = scopeFields.boundaryScope.value;
      const includeInternalValue = scopeFields.includeInternal.value;
      const includeSyntheticValue = scopeFields.includeSynthetic.value;
      const endpointIdValue = scopeFields.endpointId.value;
      const serviceIdValue = scopeFields.serviceId.value;
      const tagFilterExpressionValue = scopeFields.tagFilterExpression.value;

      // Then
      expect(beaconTypeValue).toEqual('pageLoad');
      expect(boundaryScopeValue).toEqual('ALL');
      expect(includeInternalValue).toEqual(true);
      expect(includeSyntheticValue).toEqual(false);
      expect(endpointIdValue).toEqual('endpoindNotEmpty');
      expect(serviceIdValue).toEqual('12345');
      expect(tagFilterExpressionValue).toEqual([]);
    });

    describe('createSloFormFromForm function returns correct form', () => {
      it('createSloFormFromForm returns correct form data for a website SLO form', () => {
        // Given
        const givenWebsiteForm = testWebsiteForm;

        // When
        const websiteForm = createSloFormFromForm(givenWebsiteForm);

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
        expect(beaconTypeValue).toEqual('pageLoad');
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

      it('createSloFormFromForm returns correct form data for an application SLO form', () => {
        // Given
        const givenApplicationForm = testApplicationForm;

        // When
        const applicationForm = createSloFormFromForm(givenApplicationForm);

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
        expect(beaconTypeValue).toEqual('pageLoad');
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
  });
});
