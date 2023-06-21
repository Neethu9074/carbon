/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  createSloFormFromSloConfig,
  getApplicationEntityFieldsFromSloConfig,
  getApplicationScopeFieldsFromSloConfig,
  getCommonFieldsFromSloConfig,
  getWebsiteEntityFieldsFromSloConfig,
  getWebsiteScopeFieldsFromSloConfig
} from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromSloConfig';
import {
  testApplicationSloConfig,
  testWebsiteSloConfig
} from 'in-service-levels/components/ConfigDialog/createSloForm/testData';

describe('in-service-levels/components/SloList/components/DialogSections/createSloForm/createSloFormFromSloConfig', () => {
  describe('field getters work properly', () => {
    it('returns correct values when using getCommonFieldsFromSloConfig with a website entity type and a website SLO config', () => {
      // Given
      const websiteEntityType = 'website';
      const websiteSloConfig = testWebsiteSloConfig;

      // When
      const commonFields = getCommonFieldsFromSloConfig({ entityType: websiteEntityType, sloConfig: websiteSloConfig });

      const entityType = commonFields.entityType.value;

      // Then
      expect(entityType).toEqual('website');
    });

    it('returns correct values when using getCommonFieldsFromSloConfig with an application SLO config', () => {
      // Given
      const applicationEntityType = 'application';
      const applicationSloConfig = testApplicationSloConfig;

      // When
      const commonFields = getCommonFieldsFromSloConfig({
        entityType: applicationEntityType,
        sloConfig: applicationSloConfig
      });

      const entityType = commonFields.entityType.value;

      // Then
      expect(entityType).toEqual('application');
    });

    it('returns correct values when using getWebsiteEntityFieldsFromSloConfig with a website SLO config', () => {
      // Given
      const websiteSloConfig = testWebsiteSloConfig;

      // When
      const websiteEntityFields = getWebsiteEntityFieldsFromSloConfig(websiteSloConfig);

      const websiteId = websiteEntityFields.websiteId.value;

      // Then
      expect(websiteId).toEqual('websiteIdHere');
    });

    it('returns correct values when using getWebsiteScopeFieldsFromSloConfig with a website SLO config', () => {
      // Given
      const websiteSloConfig = testWebsiteSloConfig;

      // When
      const websiteEntityFields = getWebsiteScopeFieldsFromSloConfig(websiteSloConfig);

      const beaconType = websiteEntityFields.beaconType.value;
      const tagFilterExpression = websiteEntityFields.tagFilterExpression.value;

      // Then
      expect(beaconType).toEqual('httpRequest');
      expect(tagFilterExpression).toEqual([]);
    });

    it('returns correct values when using getApplicationEntityFieldsFromSloConfig with an application SLO config', () => {
      // Given
      const applicationSloConfig = testApplicationSloConfig;

      // When
      const applicationEntityFields = getApplicationEntityFieldsFromSloConfig(applicationSloConfig);
      const applicationId = applicationEntityFields.applicationId.value;

      // Then
      expect(applicationId).toEqual('applicationIdHere');
    });

    it('returns correct values when using getApplicationScopeFieldsFromSloConfig with an application SLO config', () => {
      // Given
      const applicationSloConfig = testApplicationSloConfig;

      // When
      const applicationScopeFields = getApplicationScopeFieldsFromSloConfig(applicationSloConfig);

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
      const websiteEntityType = 'website';
      const websiteSloConfig = testWebsiteSloConfig;

      // When
      const websiteForm = createSloFormFromSloConfig<'website'>({
        entityType: websiteEntityType,
        sloConfig: websiteSloConfig
      });

      const entityType = websiteForm.get('entityType').value;
      const websiteId = websiteForm.getIn(['entity', 'websiteId']).value;
      const beaconType = websiteForm.getIn(['scope', 'beaconType']).value;
      const tagFilterExpression = websiteForm.getIn(['scope', 'tagFilterExpression']).value;

      // Then
      expect(entityType).toEqual('website');
      expect(websiteId).toEqual('websiteIdHere');
      expect(beaconType).toEqual('httpRequest');
      expect(tagFilterExpression).toEqual([]);
    });

    it('returns correct form values when using createSloFormFromSloConfig with an application SLO config', () => {
      // Given
      const applicationEntityType = 'application';
      const applicationSloConfig = testApplicationSloConfig;

      // When
      const applicationForm = createSloFormFromSloConfig<'application'>({
        entityType: applicationEntityType,
        sloConfig: applicationSloConfig
      });

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
      expect(applicationId).toEqual('applicationIdHere');
      expect(boundaryScope).toEqual('INBOUND');
      expect(includeInternal).toEqual(true);
      expect(includeSynthetic).toEqual(true);
      expect(endpointId).toEqual('endpointIdHere');
      expect(serviceId).toEqual('serviceIdHere');
      expect(tagFilterExpression).toEqual([]);
    });
  });
});
