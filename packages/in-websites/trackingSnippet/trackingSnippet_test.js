/* eslint-env mocha */

import proxyquire from 'proxyquire';
import { expect } from 'chai';

describe('in-websites/trackingSnippet', () => {
  let mod;

  beforeEach(() => {
    mod = null;
  });

  function load({ useInstanaSaasEumTrackingUrlEnabled, region }) {
    mod = proxyquire('in-websites/trackingSnippet/trackingSnippet', {
      'in-services/featureFlags': {
        useInstanaSaasEumTrackingUrlEnabled: useInstanaSaasEumTrackingUrlEnabled
      },
      'in-services/config': {
        region
      }
    });
  }

  describe('getTrackingSnippet', () => {
    it('must provide regular SAAS eum snippet', () => {
      load({
        useInstanaSaasEumTrackingUrlEnabled: true
      });
      expect(mod.getTrackingSnippet({ key: '123' })).to.equal(
        `
<script>
  (function(c,e,f,k,g,h,b,a,d){c[g]||(c[g]=h,b=c[h]=function(){
  b.q.push(arguments)},b.q=[],b.l=1*new Date,a=e.createElement(f),a.async=1,
  a.src=k,a.setAttribute("crossorigin", "anonymous"),d=e.getElementsByTagName(f)[0],
  d.parentNode.insertBefore(a,d))})(window,document,"script",
  "https://eum.instana.io/eum.min.js","InstanaEumObject","ineum");
  ineum('reportingUrl', '<trackingBaseUrl>');
  ineum('key', '123');
</script>
`.trim()
      );
    });

    testSaasUrl('blue', 'https://eum-blue-saas.instana.io');
    testSaasUrl('eu-west-1', 'https://eum-blue-saas.instana.io');
    testSaasUrl('red', 'https://eum-red-saas.instana.io');
    testSaasUrl('us-west-2', 'https://eum-red-saas.instana.io');
    testSaasUrl('pink', 'https://eum-pink-saas.instana.io');
    testSaasUrl('', '<trackingBaseUrl>');

    it('must support additional lines', () => {
      load({
        useInstanaSaasEumTrackingUrlEnabled: true,
        region: 'us-west-2'
      });
      expect(mod.getTrackingSnippet({ key: '123', additionalScript: 'ineum(true);\nineum(false);' })).to.equal(
        `
<script>
  (function(c,e,f,k,g,h,b,a,d){c[g]||(c[g]=h,b=c[h]=function(){
  b.q.push(arguments)},b.q=[],b.l=1*new Date,a=e.createElement(f),a.async=1,
  a.src=k,a.setAttribute("crossorigin", "anonymous"),d=e.getElementsByTagName(f)[0],
  d.parentNode.insertBefore(a,d))})(window,document,"script",
  "https://eum.instana.io/eum.min.js","InstanaEumObject","ineum");
  ineum('reportingUrl', 'https://eum-red-saas.instana.io');
  ineum('key', '123');
  ineum(true);
  ineum(false);
</script>
`.trim()
      );
    });

    it('must provide onprem eum snippet', () => {
      load({
        useInstanaSaasEumTrackingUrlEnabled: false
      });
      expect(mod.getTrackingSnippet({ key: '123' })).to.equal(
        `
<script>
  // Note: Replace the <trackingBaseUrl> with the base URL under
  // which you proxy the Instana eum-acceptor (note that this
  // needs to be replaced two times in this snippet).

  (function(c,e,f,k,g,h,b,a,d){c[g]||(c[g]=h,b=c[h]=function(){
  b.q.push(arguments)},b.q=[],b.l=1*new Date,a=e.createElement(f),a.async=1,
  a.src=k,a.setAttribute("crossorigin", "anonymous"),d=e.getElementsByTagName(f)[0],
  d.parentNode.insertBefore(a,d))})(window,document,"script",
  "<trackingBaseUrl>/eum.min.js","InstanaEumObject","ineum");
  ineum('reportingUrl', '<trackingBaseUrl>');
  ineum('key', '123');
</script>
`.trim()
      );
    });

    function testSaasUrl(region, expectedReportingUrl) {
      it(`must provide regular SAAS eum snippet for region ${region || '<empty>'}`, () => {
        load({
          useInstanaSaasEumTrackingUrlEnabled: true,
          region
        });
        expect(mod.getTrackingSnippet({ key: '123' })).to.equal(
          `
<script>
  (function(c,e,f,k,g,h,b,a,d){c[g]||(c[g]=h,b=c[h]=function(){
  b.q.push(arguments)},b.q=[],b.l=1*new Date,a=e.createElement(f),a.async=1,
  a.src=k,a.setAttribute("crossorigin", "anonymous"),d=e.getElementsByTagName(f)[0],
  d.parentNode.insertBefore(a,d))})(window,document,"script",
  "https://eum.instana.io/eum.min.js","InstanaEumObject","ineum");
  ineum('reportingUrl', '${expectedReportingUrl}');
  ineum('key', '123');
</script>
`.trim()
        );
      });
    }
  });
});
