/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getSolisIntegrationUrl } from 'in-services/integrations/solis';

/* enables setting or overriding the feature flag in
 * import { solisEnabled } from 'in-services/featureFlags';
 */
jest.mock('in-services/featureFlags', () => ({
  __esModule: true,
  ...jest.requireActual('in-services/featureFlags')
}));

describe('in-services/integrations/solis', () => {
  // Ensure we have a consistent default location
  beforeEach(() => {
    // @ts-expect-error TS2790: The operand of a 'delete' operator must be optional.
    delete window.location;

    // @ts-expect-errorTS2322: Type 'URL' is not assignable to type 'Location | (string & Location)'.
    window.location = new URL('https://instana.io');
  });

  const url =
    'https://concert.test.saas.ibm.com/' +
    'concert/#/vulnerability/cves/CVE-2024-1234?' +
    'instance_id=20250410-1234-5678-1234';

  it('returns same url when solis was not enabled', () => {
    const featureFlags = jest.requireMock('in-services/featureFlags');
    featureFlags.solisEnabled = false;

    const result = getSolisIntegrationUrl(url, 'concert');

    expect(result).toEqual(url);
  });

  it('retains the Instana hostname from the browser with a give extra context path', () => {
    const featureFlags = jest.requireMock('in-services/featureFlags');
    featureFlags.solisEnabled = true;

    const result = getSolisIntegrationUrl(url, '_CONTEXT_');

    expect(result).toEqual(
      'https://instana.io/_CONTEXT_/concert/#/vulnerability/cves/CVE-2024-1234?instance_id=20250410-1234-5678-1234'
    );
  });

  it('retains the Instana hostname from the browser with no extra context path if not specified', () => {
    const featureFlags = jest.requireMock('in-services/featureFlags');
    featureFlags.solisEnabled = true;

    // no context given
    // @ts-expect-error argument 'context' would not be optional - needs follow-up clarification
    const result = getSolisIntegrationUrl(url, undefined);

    expect(result).toEqual(
      'https://instana.io/concert/#/vulnerability/cves/CVE-2024-1234?instance_id=20250410-1234-5678-1234'
    );
  });
});
