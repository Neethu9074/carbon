/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  createDefaultSloForm,
  getDefaultApplicationEntityFields,
  getDefaultApplicationScopeFields,
  getDefaultCommonFields,
  getDefaultWebsiteEntityFields,
  getDefaultWebsiteScopeFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/createDefaultSloForm';

describe('in-service-levels/components/SloList/components/DialogSections/createSloForm/createDefaultSloForm', () => {
  describe('field getters work properly', () => {
    it('returns correct values when using getDefaultCommonFields with a website entity type', () => {
      // Given
      const websiteEntityType = 'website';

      // When
      const commonFields = getDefaultCommonFields(websiteEntityType);
      const entityType = commonFields.entityType.value;

      // Then
      expect(entityType).toEqual('website');
    });

    it('returns correct values when using getDefaultCommonFields with an application entity type', () => {
      // Given
      const applicationEntityType = 'application';

      // When
      const commonFields = getDefaultCommonFields(applicationEntityType);
      const entityType = commonFields.entityType.value;

      // Then
      expect(entityType).toEqual('application');
    });

    it('returns correct default values when using getDefaultCommonFields without params', () => {
      // When
      const commonFields = getDefaultCommonFields();

      const entityType = commonFields.entityType.value;

      // Then
      expect(entityType).toEqual('application');
    });

    it('returns correct values when using getDefaultWebsiteEntityFields', () => {
      // When
      const websiteEntityFields = getDefaultWebsiteEntityFields();

      const websiteId = websiteEntityFields.websiteId.value;

      // Then
      expect(websiteId).toEqual('');
    });

    it('returns correct values when using getDefaultWebsiteScopeFields', () => {
      // When
      const websiteScopeFields = getDefaultWebsiteScopeFields();

      const beaconType = websiteScopeFields.beaconType.value;
      const tagFilterExpression = websiteScopeFields.tagFilterExpression.value;

      // Then
      expect(beaconType).toEqual('httpRequest');
      expect(tagFilterExpression).toEqual([]);
    });

    it('returns correct values when using getDefaultApplicationEntityFields', () => {
      // When
      const applicationEntityFields = getDefaultApplicationEntityFields();

      const applicationId = applicationEntityFields.applicationId.value;

      // Then
      expect(applicationId).toEqual('');
    });

    it('returns correct values when using getDefaultApplicationScopeFields', () => {
      // When
      const applicationScopeFields = getDefaultApplicationScopeFields();

      const boundaryScope = applicationScopeFields.boundaryScope.value;
      const includeInternal = applicationScopeFields.includeInternal.value;
      const includeSynthetic = applicationScopeFields.includeSynthetic.value;
      const endpointId = applicationScopeFields.endpointId.value;
      const serviceId = applicationScopeFields.serviceId.value;
      const tagFilterExpression = applicationScopeFields.tagFilterExpression.value;

      // Then
      expect(boundaryScope).toEqual('ALL');
      expect(includeInternal).toEqual(false);
      expect(includeSynthetic).toEqual(false);
      expect(endpointId).toEqual('');
      expect(serviceId).toEqual('');
      expect(tagFilterExpression).toEqual([]);
    });
  });

  describe('createDefaultSloForm function returns correct form', () => {
    it('createDefaultSloForm returns correct form data when website entity type is passed', () => {
      // Given
      const websiteEntityType = 'website';

      // When
      const websiteForm = createDefaultSloForm(websiteEntityType);

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

    it('createDefaultSloForm returns correct form data when applicaiton entity type is passed', () => {
      // Given
      const applicationEntityType = 'application';

      // When
      const applicationForm = createDefaultSloForm(applicationEntityType);

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
