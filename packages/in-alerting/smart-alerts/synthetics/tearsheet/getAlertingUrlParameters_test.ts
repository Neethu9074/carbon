/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import getAlertingUrlParameters from 'in-alerting/smart-alerts/synthetics/tearsheet/getAlertingUrlParameters';

describe('getAlertingUrlParameters', () => {
  it('should return correct values', () => {
    const location = {
      pathname: '/synthetic/smartAlert',
      query: {},
      matrix: {
        '/synthetic': {
          testId: 'nyCmhPmVybSNJXF5KZOU',
          testLabel: '260-screen'
        },
        '/smartAlert': {
          alertId: 'x2x-YOdfSfyM-ODChy',
          alertCreated: '1739957741387',
          isEditMode: 'true',
          cancelUrl:
            '%2F%23%2Fsynthetic%3BtestId%3DnyCmhPmVybSNJXF5KZOU%3BtestLabel%3D260-screen%3Btype%3DBrowserScript%3BlocationDisplayLabels%3DE2ETest%2520PoP%252Cpink-master-2%3BlocationIds%3D18WyhtDb5jpVOsjlNdeV%252CZk2ImReJS1naYZVf1YdP%2Falerts%3BorderBy%3Dcreated%3BorderDirection%3DDESC%3Bpage%3D1%3Bquery'
        }
      }
    };

    const result = getAlertingUrlParameters(location);

    expect(result.editMode).toBe(true);
    expect(result.syntheticTestId).toBe('nyCmhPmVybSNJXF5KZOU');
    expect(result.duplicateMode).toBe(false);
    expect(result.alertConfigId).toBe('x2x-YOdfSfyM-ODChy');
    expect(result.alertConfigCreated).toBe(1739957741387);
    expect(result.cancelTearSheet).toBe(
      '%2F%23%2Fsynthetic%3BtestId%3DnyCmhPmVybSNJXF5KZOU%3BtestLabel%3D260-screen%3Btype%3DBrowserScript%3BlocationDisplayLabels%3DE2ETest%2520PoP%252Cpink-master-2%3BlocationIds%3D18WyhtDb5jpVOsjlNdeV%252CZk2ImReJS1naYZVf1YdP%2Falerts%3BorderBy%3Dcreated%3BorderDirection%3DDESC%3Bpage%3D1%3Bquery'
    );
  });
});
