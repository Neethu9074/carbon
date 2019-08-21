/* eslint-env mocha */

import proxyquire from 'proxyquire';
import { expect } from 'chai';

describe('in-websites/trackingSnippet', () => {
  let mod;

  beforeEach(() => {
    mod = null;
  });

  function loadWithFeatureFlags(useInstanaSaasEumTrackingUrlEnabled) {
    mod = proxyquire('in-websites/trackingSnippet/trackingSnippet', {
      'in-services/featureFlags': {
        useInstanaSaasEumTrackingUrlEnabled: useInstanaSaasEumTrackingUrlEnabled
      }
    });
  }

  describe('getTrackingSnippet', () => {
    it('must provide regular SAAS eum snippet', () => {
      loadWithFeatureFlags(true);
      expect(mod.getTrackingSnippet({ key: '123' })).to.equal(
        `
<script>
  (function(c,e,f,k,g,h,b,a,d){c[g]||(c[g]=h,b=c[h]=function(){
  b.q.push(arguments)},b.q=[],b.l=1*new Date,a=e.createElement(f),a.async=1,
  a.src=k,a.setAttribute("crossorigin", "anonymous"),d=e.getElementsByTagName(f)[0],
  d.parentNode.insertBefore(a,d))})(window,document,"script",
  "//eum.instana.io/eum.min.js","InstanaEumObject","ineum");
  ineum('key', '123');
</script>
`.trim()
      );
    });

    it('must support additional lines', () => {
      loadWithFeatureFlags(true);
      expect(mod.getTrackingSnippet({ key: '123', additionalScript: 'ineum(true);\nineum(false);' })).to.equal(
        `
<script>
  (function(c,e,f,k,g,h,b,a,d){c[g]||(c[g]=h,b=c[h]=function(){
  b.q.push(arguments)},b.q=[],b.l=1*new Date,a=e.createElement(f),a.async=1,
  a.src=k,a.setAttribute("crossorigin", "anonymous"),d=e.getElementsByTagName(f)[0],
  d.parentNode.insertBefore(a,d))})(window,document,"script",
  "//eum.instana.io/eum.min.js","InstanaEumObject","ineum");
  ineum('key', '123');
  ineum(true);
  ineum(false);
</script>
`.trim()
      );
    });

    it('must provide onprem eum snippet', () => {
      loadWithFeatureFlags(false);
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
  });
});
