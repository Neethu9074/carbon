/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import {
  PER_AP_SERVICE,
  PER_AP_ENDPOINT
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import { searchResultsToListItems } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/searchResults';

describe('in-alerting/smart-alerts/applications/chart/ChartEntitySelector/searchResults', () => {
  describe('createOptionList for an empty AP selection', () => {
    it('should be empty when no searchResult given', () => {
      const list = searchResultsToListItems();

      expect(list).toStrictEqual([]);
    });
    it('should be empty when empty searchResult given', () => {
      const list = searchResultsToListItems([]);

      expect(list).toStrictEqual([]);
    });
  });

  describe('createOptionList for PER_AP_SERVICE', () => {
    it('should create list with all important data', () => {
      const searchItem = {
        appDataEntityChain: {
          applicationId: 'applicationId',
          applicationName: 'applicationName',
          serviceName: 'serviceName',
          serviceId: 'serviceId'
        }
      };

      const list = searchResultsToListItems({ items: [searchItem] }, PER_AP_SERVICE);

      // eslint-disable-next-line no-unused-vars
      expect(list.map(({ path, ...withoutPath }) => withoutPath)).toMatchInlineSnapshot(`
        Array [
          Object {
            "applicationId": "applicationId",
            "id": "serviceId",
            "label": "serviceName",
            "type": "SERVICE",
          },
        ]
      `);
    });
  });

  describe('createOptionList for PER_AP_ENDPOINT', () => {
    it('should create list with all important data', () => {
      const searchItem = {
        appDataEntityChain: {
          applicationId: 'applicationId',
          serviceId: 'serviceId',
          endpointId: 'endpointId',
          applicationName: 'applicationName',
          serviceName: 'serviceName',
          endpointName: 'endpointName'
        }
      };

      const list = searchResultsToListItems({ items: [searchItem] }, PER_AP_ENDPOINT);

      // eslint-disable-next-line no-unused-vars
      expect(list.map(({ path, ...withoutPath }) => withoutPath)).toMatchInlineSnapshot(`
        Array [
          Object {
            "applicationId": "applicationId",
            "id": "endpointId",
            "label": "endpointName",
            "serviceId": "serviceId",
            "type": "ENDPOINT",
          },
        ]
      `);
    });
  });
});
