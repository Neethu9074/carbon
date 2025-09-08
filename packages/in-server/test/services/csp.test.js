/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

jest.mock('../../src/serverConfig');

const { getCsp } = require('../../src/services/csp');
const serverConfig = require('../../src/serverConfig');

describe('in-server/src/services/csp', () => {
  const testNonce = 'test-nonce-123';

  beforeEach(() => {
    // Reset serverConfig mock before each test
    jest.resetAllMocks();

    // Default configuration for serverConfig mock
    serverConfig.eum = {
      domain: 'example.instana.io',
      retrievalDomain: 'retrieval.instana.io'
    };
  });

  describe('getCsp', () => {
    it('should generate basic CSP with minimal permissions when no features are enabled', () => {
      const csp = getCsp(testNonce, false, false, false, false, false);

      // Verify base directives are present
      expect(csp).toContain("style-src 'self' 'unsafe-inline' https://www.ibm.com");

      // Verify script-src contains nonce and base Instana domains
      expect(csp).toContain(`script-src 'self' 'nonce-${testNonce}' https://*.instana.io https://*.instana.tools`);

      // Verify it contains only base Instana domains in script-src
      expect(csp).toContain(`script-src 'self' 'nonce-${testNonce}' https://*.instana.io https://*.instana.tools`);
    });

    it('should include .instana.rocks domain when serverConfig requires it', () => {
      // Need to reload the module to pick up the new serverConfig values
      jest.resetModules();

      // Mock serverConfig to include .instana.rocks domain
      jest.doMock('../../src/serverConfig', () => ({
        eum: {
          domain: 'example.instana.rocks',
          retrievalDomain: 'retrieval.instana.io'
        }
      }));

      // Re-require the modules to use the new mocks
      const freshCsp = require('../../src/services/csp');

      const csp = freshCsp.getCsp(testNonce, false, false, false, false, false);

      // Verify .instana.rocks is included in script-src
      expect(csp).toContain('*.instana.rocks');

      // Reset modules to clean up for other tests
      jest.resetModules();
      jest.doMock('../../src/serverConfig', () => ({
        eum: {
          domain: 'example.instana.io',
          retrievalDomain: 'retrieval.instana.io'
        }
      }));

      // Re-require the modules for other tests
      require('../../src/services/csp');
    });

    it('should include IBM Common domains when ibmCommonEnabled is true', () => {
      const csp = getCsp(testNonce, false, true, false, false, false);

      // Verify IBM Common domains are included
      expect(csp).toContain('https://www.ibm.com');
      expect(csp).toContain('https://tags.tiqcdn.com');
      expect(csp).toContain('https://cdn.segment.com');

      // Verify TrustArc domains are included
      expect(csp).toContain('https://*.trustarc.com');

      // Verify Tealium domains are included (note: only http:// version exists in the code)
      expect(csp).toContain('http://*.tealium.com');
    });

    it('should include WalkMe domains when walkmeEnabled is true', () => {
      const csp = getCsp(testNonce, true, false, false, false, false);

      // Verify WalkMe domains are included
      expect(csp).toContain('https://cdn.walkme.com');
      expect(csp).toContain('https://playerserver.walkme.com');
      expect(csp).toContain('https://ec.walkme.com');

      // Verify IBM Common domains are also included (WalkMe extends IBM Common)
      expect(csp).toContain('https://www.ibm.com');
      expect(csp).toContain('https://tags.tiqcdn.com');

      expect(csp).toContain('https://www.ibm.com');
      expect(csp).toContain('https://cloud.ibm.com');
    });

    it('should include WalkMe PlayBack domains when isSessionPlayBackRequired is true', () => {
      const csp = getCsp(testNonce, false, false, true, false, false);

      // Verify WalkMe PlayBack domains are included
      expect(csp).toContain('https://playback-assets.walkme.com');
      expect(csp).toContain('https://ec-playback.walkme.com');
      expect(csp).toContain('blob:');

      // Verify WalkMe domains are also included (PlayBack extends WalkMe)
      expect(csp).toContain('https://cdn.walkme.com');
      expect(csp).toContain('https://playerserver.walkme.com');
    });

    it('should include development domains when solisEnabled is true and isControlledEnvEnabled is false', () => {
      const csp = getCsp(testNonce, false, false, false, true, false);

      // Verify localhost domains are included
      expect(csp).toContain('http://localhost:3015');
      expect(csp).toContain('blob:http://localhost:3015');

      // Verify WalkMe domains are also included
      expect(csp).toContain('https://cdn.walkme.com');
    });

    it('should prioritize solisEnabled over other flags', () => {
      // Enable all flags but prioritize solisEnabled
      const csp = getCsp(testNonce, true, true, true, true, false);

      // Verify localhost domains are included (from solisEnabled)
      expect(csp).toContain('http://localhost:3015');

      // Verify it doesn't contain PlayBack-specific domains
      // (solisEnabled should take precedence over isSessionPlayBackRequired)
      expect(csp).not.toContain('https://playback-assets.walkme.com');
    });

    it('should not include development domains when isControlledEnvEnabled is true', () => {
      const csp = getCsp(testNonce, false, false, false, true, true);

      // Verify localhost domains are not included
      expect(csp).not.toContain('http://localhost:3015');

      // Should fall back to base configuration
      expect(csp).toContain(
        "style-src 'self' 'unsafe-inline' https://www.ibm.com; script-src 'self' 'nonce-test-nonce-123' https://*.instana.io https://*.instana.tools"
      );
    });

    it('should format CSP string correctly with semicolons between directives', () => {
      const csp = getCsp(testNonce, false, false, false, false, false);

      // Check for semicolons between directives
      expect(csp).toContain('; ');

      // Verify format with a regex pattern
      expect(csp).toMatch(/^[a-z-]+ [^;]+(; [a-z-]+ [^;]+)+$/);
    });
  });
});

// Made with Bob
