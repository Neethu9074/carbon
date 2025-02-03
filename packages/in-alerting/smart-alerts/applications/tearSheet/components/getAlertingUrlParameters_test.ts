/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import getAlertingUrlParameters from 'in-alerting/smart-alerts/applications/tearSheet/components/getAlertingUrlParameters';
import { Location } from 'in-stores/navigation/types';

describe('in-alerting/smart-alerts/applications/tearSheet/components/getAlertingUrlParameters', () => {
  it('test GSA create mode', () => {
    const location = {
      pathname: '/applicationSmartalerts',
      query: {},
      matrix: {
        '/applicationSmartalerts': {
          configsCategory: 'global',
          cancelUrl:
            '/#/alerts;orderBy=name;orderDirection=ASC;page=1;query?timeline.ws=604800000&timeline.to&timeline.fm&timeline.ar=false'
        }
      }
    };

    const result = getAlertingUrlParameters(location as unknown as Location);
    expect(result).toEqual({
      migrationMode: false,
      editMode: false,
      duplicateMode: false,
      potentialProblemMode: false,
      isGlobalSmartAlert: true,
      alertConfigId: '',
      alertConfigCreated: NaN,
      boundaryScope: undefined,
      applicationId: undefined,
      serviceId: undefined,
      endpointId: undefined,
      eventSpecificationId: '',
      cancelTearSheet: expect.any(String)
    });
  });

  it('test edit mode', () => {
    const location = {
      pathname: '/applicationSmartalerts',
      query: {},
      matrix: {
        '/applicationSmartalerts': {
          alertId: 'pf4j8dNcTGG4833j1M4s7Q',
          alertCreated: '1717596929028',
          configsCategory: 'local',
          cancelUrl:
            '/#/alerts;orderBy=name;orderDirection=ASC;page=1;query?timeline.ws=604800000&timeline.to&timeline.fm&timeline.ar=false',
          isEditMode: 'true'
        }
      }
    };
    const result = getAlertingUrlParameters(location as unknown as Location);
    expect(result).toEqual({
      migrationMode: false,
      editMode: true,
      duplicateMode: false,
      potentialProblemMode: false,
      isGlobalSmartAlert: false,
      alertConfigId: 'pf4j8dNcTGG4833j1M4s7Q',
      alertConfigCreated: 1717596929028,
      boundaryScope: undefined,
      applicationId: undefined,
      serviceId: undefined,
      endpointId: undefined,
      eventSpecificationId: '',
      cancelTearSheet: expect.any(String)
    });
  });

  it('test migration mode', () => {
    const location = {
      pathname: '/applicationSmartalerts',
      query: {},
      matrix: {
        '/applicationSmartalerts': {
          eventSpecificationId: '7vNcXYo5WEsjfEol',
          isMigration: 'true',
          configsCategory: 'global',
          cancelUrl:
            '/#/config/team/alerting/events/custom/7vNcXYo5WEsjfEol?timeline.ws=604800000&timeline.to&timeline.fm&timeline.ar=false'
        }
      }
    };
    const result = getAlertingUrlParameters(location as unknown as Location);
    expect(result).toEqual({
      migrationMode: true,
      editMode: false,
      duplicateMode: false,
      potentialProblemMode: false,
      isGlobalSmartAlert: true,
      alertConfigId: '',
      alertConfigCreated: NaN,
      boundaryScope: undefined,
      applicationId: undefined,
      serviceId: undefined,
      endpointId: undefined,
      eventSpecificationId: '7vNcXYo5WEsjfEol',
      cancelTearSheet: expect.any(String)
    });
  });

  it('test duplicate mode', () => {
    const location = {
      pathname: '/applicationSmartalerts',
      query: {},
      matrix: {
        '/applicationSmartalerts': {
          alertId: 'pf4j8dNcTGG4833j1M4s7Q',
          alertCreated: '1717596929028',
          configsCategory: 'local',
          cancelUrl:
            '/#/alerts;orderBy=name;orderDirection=ASC;page=1;query?timeline.ws=604800000&timeline.to&timeline.fm&timeline.ar=false',
          isDuplicateMode: 'true'
        }
      }
    };
    const result = getAlertingUrlParameters(location as unknown as Location);
    expect(result).toEqual({
      migrationMode: false,
      editMode: false,
      duplicateMode: true,
      potentialProblemMode: false,
      isGlobalSmartAlert: false,
      alertConfigId: 'pf4j8dNcTGG4833j1M4s7Q',
      alertConfigCreated: 1717596929028,
      boundaryScope: undefined,
      applicationId: undefined,
      serviceId: undefined,
      endpointId: undefined,
      eventSpecificationId: '',
      cancelTearSheet: expect.any(String)
    });
  });

  it('test potentialProblem mode', () => {
    const location = {
      pathname: '/applicationSmartalerts',
      query: {},
      matrix: {
        '/applicationSmartalerts': {
          configsCategory: 'local',
          cancelUrl:
            '/#/application;appId=mwVo3lG-TD-4ssDa3w0pGA/summary;callsTab=http;latencyTab=overTime?timeline.ws=86400000&timeline.to=1719081000000&timeline.fm=1719081000000&timeline.ar=false',
          isPotentialProblem: 'true'
        }
      }
    };
    const result = getAlertingUrlParameters(location as unknown as Location);
    expect(result).toEqual({
      migrationMode: false,
      editMode: false,
      duplicateMode: false,
      potentialProblemMode: true,
      isGlobalSmartAlert: false,
      alertConfigId: '',
      alertConfigCreated: NaN,
      boundaryScope: undefined,
      applicationId: undefined,
      serviceId: undefined,
      endpointId: undefined,
      eventSpecificationId: '',
      cancelTearSheet: expect.any(String)
    });
  });
});
