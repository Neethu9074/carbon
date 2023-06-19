/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  testWebsiteForm,
  testApplicationForm,
  testApplicationSloConfig,
  testWebsiteSloConfig
} from 'in-service-levels/components/ConfigDialog/createSloForm/testData';
import { createSloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/createSloForm';

describe('in-service-levels/components/SloList/components/DialogSections/createSloForm/createSloForm', () => {
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

    it('returns a form created from a previous application form when a previous application form is provided', () => {
      // Given
      const givenEntityType = 'application';
      const givenPreviousForm = testApplicationForm;

      // When
      const applicationForm = createSloForm({
        entityType: givenEntityType,
        previousForm: givenPreviousForm
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
      expect(applicationId).toEqual('');
      expect(boundaryScope).toEqual('ALL');
      expect(includeInternal).toEqual(false);
      expect(includeSynthetic).toEqual(false);
      expect(endpointId).toEqual('');
      expect(serviceId).toEqual('');
      expect(tagFilterExpression).toEqual([]);
    });
  });

  describe('createSloForm returns correct form fields whenonly an entityType parameter is passed', () => {
    it('returns a default website SLO form when entityType equal to website is passed', () => {
      // Given
      const givenEntityType = 'website';

      // When
      const websiteForm = createSloForm({
        entityType: givenEntityType
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

    it('returns a default application SLO form when entityType equal to application is passed', () => {
      // Given
      const givenEntityType = 'application';

      // When
      const applicationForm = createSloForm({
        entityType: givenEntityType
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
