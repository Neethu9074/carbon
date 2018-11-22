/* eslint-env mocha */

import proxyquire from 'proxyquire';
import { expect } from 'chai';

describe('in-services/eum', () => {
  let mod;

  beforeEach(() => {
    mod = null;
  });

  function loadWithFeatureFlags(useInstanaSaasEumTrackingUrlEnabled) {
    mod = proxyquire('in-services/eum', {
      'in-services/featureFlags': {
        useInstanaSaasEumTrackingUrlEnabled: useInstanaSaasEumTrackingUrlEnabled
      }
    });
  }

  describe('getEumSnippet', () => {
    it('must provide regular SAAS eum snippet', () => {
      loadWithFeatureFlags(true);
      expect(mod.getEumSnippet({ key: '123' })).to.equal(
        `
<script>
  (function(i,s,o,g,r,a,m){i['InstanaEumObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//eum.instana.io/eum.min.js','ineum');
  ineum('key', '123');
</script>
`.trim()
      );
    });

    it('must support additional lines', () => {
      loadWithFeatureFlags(true);
      expect(mod.getEumSnippet({ key: '123', additionalScript: 'ineum(true);\nineum(false);' })).to.equal(
        `
<script>
  (function(i,s,o,g,r,a,m){i['InstanaEumObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//eum.instana.io/eum.min.js','ineum');
  ineum('key', '123');
  ineum(true);
  ineum(false);
</script>
`.trim()
      );
    });

    it('must provide onprem eum snippet', () => {
      loadWithFeatureFlags(false);
      expect(mod.getEumSnippet({ key: '123' })).to.equal(
        `
<script>
  // Note: Replace the <trackingBaseUrl> with the base URL under
  // which you proxy the Instana eum-acceptor (note that this
  // needs to be replaced two times in this snippet).

  (function(i,s,o,g,r,a,m){i['InstanaEumObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','<trackingBaseUrl>/eum.min.js','ineum');
  ineum('reportingUrl', '<trackingBaseUrl>');
  ineum('key', '123');
</script>
`.trim()
      );
    });
  });
});
