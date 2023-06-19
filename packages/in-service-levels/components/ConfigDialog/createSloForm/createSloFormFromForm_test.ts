/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  createSloFormFromForm,
  getApplicationEntityFieldsFromForm,
  getApplicationScopeFieldsFromForm,
  getCommonFieldsFromForm,
  getWebsiteEntityFieldsFromForm,
  getWebsiteScopeFieldsFromForm
} from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromForm';
import { testApplicationForm, testWebsiteForm } from 'in-service-levels/components/ConfigDialog/createSloForm/testData';

describe('in-service-levels/components/SloList/components/DialogSections/createSloForm/createSloFormFromForm', () => {
  describe('field getters work properly', () => {
    it('returns correct values when using getCommonFieldsFromForm with a website SLO form', () => {
      // Given
      const websiteForm = testWebsiteForm;

      // When
      const commonFields = getCommonFieldsFromForm(websiteForm);

      const entityType = commonFields.entityType.value;

      // Then
      expect(entityType).toEqual('website');
    });

    it('returns correct values when using getCommonFieldsFromForm with an application SLO form', () => {
      // Given
      const applicationForm = testApplicationForm;

      // When
      const commonFields = getCommonFieldsFromForm(applicationForm);

      const entityType = commonFields.entityType.value;

      // Then
      expect(entityType).toEqual('application');
    });

    it('returns correct values when using getWebsiteEntityFieldsFromForm with a website SLO form', () => {
      // Given
      const websiteForm = testWebsiteForm;

      // When
      const websiteEntityFields = getWebsiteEntityFieldsFromForm(websiteForm);
      const websiteId = websiteEntityFields.websiteId.value;

      // Then
      expect(websiteId).toEqual('22222');
    });

    it('returns correct values when using getWebsiteScopeFieldsFromForm with a website SLO form', () => {
      // Given
      const websiteForm = testWebsiteForm;

      // When
      const websiteScopeFields = getWebsiteScopeFieldsFromForm(websiteForm);

      const beaconType = websiteScopeFields.beaconType.value;
      const tagFilterExpression = websiteScopeFields.tagFilterExpression.value;

      // Then
      expect(beaconType).toEqual('pageLoad');
      expect(tagFilterExpression).toEqual([]);
    });

    it('returns correct values when using getApplicationEntityFieldsFromForm with an application SLO form', () => {
      // Given
      const applicationForm = testApplicationForm;

      // When
      const applicationEntityFields = getApplicationEntityFieldsFromForm(applicationForm);

      const applicationId = applicationEntityFields.applicationId.value;

      // Then
      expect(applicationId).toEqual('11111');
    });

    it('returns correct values when using getApplicationScopeFieldsFromForm  with an application SLO form', () => {
      // Given
      const applicationForm = testApplicationForm;

      // When
      const applicationScopeFields = getApplicationScopeFieldsFromForm(applicationForm);

      const boundaryScope = applicationScopeFields.boundaryScope.value;
      const includeInternal = applicationScopeFields.includeInternal.value;
      const includeSynthetic = applicationScopeFields.includeSynthetic.value;
      const endpointId = applicationScopeFields.endpointId.value;
      const serviceId = applicationScopeFields.serviceId.value;
      const tagFilterExpression = applicationScopeFields.tagFilterExpression.value;

      // Then
      expect(boundaryScope).toEqual('ALL');
      expect(includeInternal).toEqual(true);
      expect(includeSynthetic).toEqual(false);
      expect(endpointId).toEqual('endpoindNotEmpty');
      expect(serviceId).toEqual('12345');
      expect(tagFilterExpression).toEqual([]);
    });

    describe('createSloFormFromForm function returns correct form', () => {
      it('createSloFormFromForm returns correct form data for a website SLO form', () => {
        // Given
        const givenWebsiteForm = testWebsiteForm;

        // When
        const websiteForm = createSloFormFromForm<'website'>(givenWebsiteForm);

        const entityType = websiteForm.get('entityType').value;
        const websiteId = websiteForm.getIn(['entity', 'websiteId']).value;
        const beaconType = websiteForm.getIn(['scope', 'beaconType']).value;
        const tagFilterExpression = websiteForm.getIn(['scope', 'tagFilterExpression']).value;

        // Then
        expect(entityType).toEqual('website');
        expect(websiteId).toEqual('22222');
        expect(beaconType).toEqual('pageLoad');
        expect(tagFilterExpression).toEqual([]);
      });

      it('createSloFormFromForm returns correct form data for an application SLO form', () => {
        // Given
        const givenApplicationForm = testApplicationForm;

        // When
        const applicationForm = createSloFormFromForm<'application'>(givenApplicationForm);

        const entityType = applicationForm.get('entityType').value;
        const applicationId = applicationForm.getIn(['entity', 'applicationId']).value;
        const boundaryScope = applicationForm.getIn(['scope', 'boundaryScope']).value;
        const includeInternal = applicationForm.getIn(['scope', 'includeInternal']).value;
        const includeSynthetic = applicationForm.getIn(['scope', 'includeSynthetic']).value;
        const endpointId = applicationForm.getIn(['scope', 'endpointId']).value;
        const serviceId = applicationForm.getIn(['scope', 'serviceId']).value;
        const tagFilterExpression = applicationForm.getIn(['scope', 'tagFilterExpression']).value;

        // Then
        expect(entityType).toEqual('application');
        expect(applicationId).toEqual('11111');
        expect(boundaryScope).toEqual('ALL');
        expect(includeInternal).toEqual(true);
        expect(includeSynthetic).toEqual(false);
        expect(endpointId).toEqual('endpoindNotEmpty');
        expect(serviceId).toEqual('12345');
        expect(tagFilterExpression).toEqual([]);
      });
    });
  });
});
