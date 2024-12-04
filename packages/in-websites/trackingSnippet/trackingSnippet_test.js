/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */

describe('in-websites/trackingSnippet', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  function load({ useInstanaSaasEumTrackingUrlEnabled, weaselSubresourceIntegrityEnabled, region }) {
    jest.doMock('in-services/featureFlags', () => ({
      useInstanaSaasEumTrackingUrlEnabled: useInstanaSaasEumTrackingUrlEnabled,
      weaselSubresourceIntegrityEnabled: weaselSubresourceIntegrityEnabled
    }));
    jest.doMock('in-services/config', () => ({
      region
    }));
    return import('in-websites/trackingSnippet/trackingSnippet');
  }

  describe('getTrackingSnippet', () => {
    it('must provide regular SAAS eum snippet when SRI option is enabled', () => {
      return load({
        useInstanaSaasEumTrackingUrlEnabled: true,
        weaselSubresourceIntegrityEnabled: true
      }).then(module => {
        expect(
          module.getTrackingSnippet({
            key: '123',
            enableSRI: true,
            weaselVersionNumber: '1.6.6',
            shaValue: 'sha384-fakeSHAValue'
          })
        ).toBe(
          `
<script>
  (function(s,t,a,n){s[t]||(s[t]=a,n=s[a]=function(){n.q.push(arguments)},
  n.q=[],n.v=2,n.l=1*new Date)})(window,"InstanaEumObject","ineum");

  ineum('reportingUrl', '<trackingBaseUrl>');
  ineum('key', '123');
</script>
<script defer crossorigin="anonymous" src="https://eum.instana.io/1.6.6/eum.min.js" \n integrity="sha384-fakeSHAValue"></script>
`.trim()
        );
      });
    });

    it('must provide regular SAAS eum snippet when SRI option is disabled', () => {
      return load({
        useInstanaSaasEumTrackingUrlEnabled: true,
        weaselSubresourceIntegrityEnabled: true
      }).then(module => {
        expect(module.getTrackingSnippet({ key: '123', enableSRI: false })).toBe(
          `
<script>
  (function(s,t,a,n){s[t]||(s[t]=a,n=s[a]=function(){n.q.push(arguments)},
  n.q=[],n.v=2,n.l=1*new Date)})(window,"InstanaEumObject","ineum");

  ineum('reportingUrl', '<trackingBaseUrl>');
  ineum('key', '123');
</script>
<script defer crossorigin="anonymous" src="https://eum.instana.io/eum.min.js"></script>
`.trim()
        );
      });
    });

    it('must provide regular SAAS eum snippet when SRI feature flag is off', () => {
      return load({
        useInstanaSaasEumTrackingUrlEnabled: true,
        weaselSubresourceIntegrityEnabled: false
      }).then(module => {
        expect(module.getTrackingSnippet({ key: '123' })).toBe(
          `
<script>
  (function(s,t,a,n){s[t]||(s[t]=a,n=s[a]=function(){n.q.push(arguments)},
  n.q=[],n.v=2,n.l=1*new Date)})(window,"InstanaEumObject","ineum");

  ineum('reportingUrl', '<trackingBaseUrl>');
  ineum('key', '123');
</script>
<script defer crossorigin="anonymous" src="https://eum.instana.io/eum.min.js"></script>
`.trim()
        );
      });
    });

    testSaasUrl('blue', 'https://eum-blue-saas.instana.io');
    testSaasUrl('eu-west-1', 'https://eum-blue-saas.instana.io');
    testSaasUrl('red', 'https://eum-red-saas.instana.io');
    testSaasUrl('us-west-2', 'https://eum-red-saas.instana.io');
    testSaasUrl('pink', 'https://eum-pink-saas.instana.io');
    testSaasUrl('', '<trackingBaseUrl>');

    it('must support additional lines', () => {
      return load({
        useInstanaSaasEumTrackingUrlEnabled: true,
        weaselSubresourceIntegrityEnabled: true,
        region: 'us-west-2'
      }).then(mod => {
        expect(
          mod.getTrackingSnippet({
            key: '123',
            additionalScript: 'ineum(true);\nineum(false);'
          })
        ).toBe(
          `
<script>
  (function(s,t,a,n){s[t]||(s[t]=a,n=s[a]=function(){n.q.push(arguments)},
  n.q=[],n.v=2,n.l=1*new Date)})(window,"InstanaEumObject","ineum");

  ineum('reportingUrl', 'https://eum-red-saas.instana.io');
  ineum('key', '123');
  ineum(true);
  ineum(false);
</script>
<script defer crossorigin="anonymous" src="https://eum.instana.io/eum.min.js"></script>
`.trim()
        );
      });
    });

    it('must provide onprem eum snippet with SRI enabled', () => {
      return load({
        useInstanaSaasEumTrackingUrlEnabled: false,
        weaselSubresourceIntegrityEnabled: true
      }).then(mod => {
        expect(mod.getTrackingSnippet({ key: '123', enableSRI: true, shaValue: 'sha384-fakeSHAValue' })).toBe(
          `
<script>
  // Note: Replace the <trackingBaseUrl> with the base URL under
  // which you proxy the Instana eum-acceptor (note that this
  // needs to be replaced two times in this snippet).

  (function(s,t,a,n){s[t]||(s[t]=a,n=s[a]=function(){n.q.push(arguments)},
  n.q=[],n.v=2,n.l=1*new Date)})(window,"InstanaEumObject","ineum");

  ineum('reportingUrl', '<trackingBaseUrl>');
  ineum('key', '123');
</script>
<script defer crossorigin="anonymous" src="<trackingBaseUrl>/eum.min.js" \n integrity="sha384-fakeSHAValue"></script>
`.trim()
        );
      });
    });

    it('must provide onprem eum snippet with SRI disabled', () => {
      return load({
        useInstanaSaasEumTrackingUrlEnabled: false,
        weaselSubresourceIntegrityEnabled: true
      }).then(mod => {
        expect(mod.getTrackingSnippet({ key: '123', enableSRI: false })).toBe(
          `
<script>
  // Note: Replace the <trackingBaseUrl> with the base URL under
  // which you proxy the Instana eum-acceptor (note that this
  // needs to be replaced two times in this snippet).

  (function(s,t,a,n){s[t]||(s[t]=a,n=s[a]=function(){n.q.push(arguments)},
  n.q=[],n.v=2,n.l=1*new Date)})(window,"InstanaEumObject","ineum");

  ineum('reportingUrl', '<trackingBaseUrl>');
  ineum('key', '123');
</script>
<script defer crossorigin="anonymous" src="<trackingBaseUrl>/eum.min.js"></script>
`.trim()
        );
      });
    });

    it('must provide onprem eum snippet when SRI feature flag is off.', () => {
      return load({
        useInstanaSaasEumTrackingUrlEnabled: false,
        weaselSubresourceIntegrityEnabled: false
      }).then(mod => {
        expect(mod.getTrackingSnippet({ key: '123' })).toBe(
          `
<script>
  // Note: Replace the <trackingBaseUrl> with the base URL under
  // which you proxy the Instana eum-acceptor (note that this
  // needs to be replaced two times in this snippet).

  (function(s,t,a,n){s[t]||(s[t]=a,n=s[a]=function(){n.q.push(arguments)},
  n.q=[],n.v=2,n.l=1*new Date)})(window,"InstanaEumObject","ineum");

  ineum('reportingUrl', '<trackingBaseUrl>');
  ineum('key', '123');
</script>
<script defer crossorigin="anonymous" src="<trackingBaseUrl>/eum.min.js"></script>
`.trim()
        );
      });
    });

    function testSaasUrl(region, expectedReportingUrl) {
      it(`must provide regular SAAS eum snippet for region ${region || '<empty>'}`, () => {
        return load({
          useInstanaSaasEumTrackingUrlEnabled: true,
          weaselSubresourceIntegrityEnabled: true,
          region
        }).then(mod => {
          expect(mod.getTrackingSnippet({ key: '123' })).toBe(
            `
<script>
  (function(s,t,a,n){s[t]||(s[t]=a,n=s[a]=function(){n.q.push(arguments)},
  n.q=[],n.v=2,n.l=1*new Date)})(window,"InstanaEumObject","ineum");

  ineum('reportingUrl', '${expectedReportingUrl}');
  ineum('key', '123');
</script>
<script defer crossorigin="anonymous" src="https://eum.instana.io/eum.min.js"></script>
`.trim()
          );
        });
      });
    }
  });
});
