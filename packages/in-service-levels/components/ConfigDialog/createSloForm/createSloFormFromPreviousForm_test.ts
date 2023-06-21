/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  createSloFormFromPreviousForm,
  getCommonFieldsFromPreviousForm
} from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromPreviousForm';
import { testApplicationForm, testWebsiteForm } from 'in-service-levels/components/ConfigDialog/createSloForm/testData';

describe('in-service-levels/components/SloList/components/DialogSections/createSloForm/createSloFormFromPreviousForm', () => {
  describe('field getters work properly', () => {
    it('returns correct values when using getCommonFieldsFromPreviousForm with a website SLO form', () => {
      // Given
      const websiteForm = testWebsiteForm;

      // When
      const commonFields = getCommonFieldsFromPreviousForm(websiteForm);

      const entityType = commonFields.entityType.value;

      // Then
      expect(entityType).toEqual('website');
    });

    it('returns correct values when using getCommonFieldsFromPreviousForm with an application SLO form', () => {
      // Given
      const applicationForm = testApplicationForm;

      // When
      const commonFields = getCommonFieldsFromPreviousForm(applicationForm);

      const entityType = commonFields.entityType.value;

      // Then
      expect(entityType).toEqual('application');
    });
  });

  describe('createSloFormFromPreviousForm returns correct forms', () => {
    it('createSloFormFromPreviousForm returns correct form data for a website entity type and a website SLO form', () => {
      // Given
      const websiteEntityType = 'website';
      const givenWebsiteForm = testWebsiteForm;

      // When
      const websiteForm = createSloFormFromPreviousForm<'website'>({
        entityType: websiteEntityType,
        previousForm: givenWebsiteForm
      });

      const entityType = websiteForm.get('entityType').value;
      const websiteId = websiteForm.getIn(['entity', 'websiteId']).value;
      const beaconType = websiteForm.getIn(['scope', 'beaconType']).value;
      const tagFilterExpression = websiteForm.getIn(['scope', 'tagFilterExpression']).value;

      // Then
      expect(entityType).toEqual('website');
      expect(websiteId).toEqual('');
      expect(beaconType).toEqual('httpRequest');
      expect(tagFilterExpression).toEqual([]);
    });

    it('createSloFormFromPreviousForm returns correct form data for application SLO', () => {
      // Given
      const applicaitonEntityType = 'application';
      const givenApplicationForm = testApplicationForm;

      // When
      const applicationForm = createSloFormFromPreviousForm<'application'>({
        entityType: applicaitonEntityType,
        previousForm: givenApplicationForm
      });

      const entityType = applicationForm.get('entityType').value;
      const applicationId = applicationForm.getIn(['entity', 'applicationId']).value;
      const boundaryScope = applicationForm.getIn(['scope', 'boundaryScope']).value;
      const includeInternal = applicationForm.getIn(['scope', 'includeInternal']).value;
      const includeSynthetic = applicationForm.getIn(['scope', 'includeInternal']).value;
      const endpointId = applicationForm.getIn(['scope', 'endpointId']).value;
      const serviceId = applicationForm.getIn(['scope', 'serviceId']).value;
      const tagFilterExpression = applicationForm.getIn(['scope', 'tagFilterExpression']).value;

      // Then
      expect(entityType).toEqual('application');
      expect(applicationId).toEqual('');
      expect(boundaryScope).toEqual('ALL');
      expect(includeInternal).toEqual(false);
      expect(includeSynthetic).toEqual(false);
      expect(endpointId).toEqual('');
      expect(serviceId).toEqual('');
      expect(tagFilterExpression).toEqual([]);
    });
  });
});
