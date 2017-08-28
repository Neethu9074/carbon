/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe('in-services/eum', () => {
  let mod;
  let isOnPremise;

  beforeEach(() => {
    isOnPremise = sinon.stub();
    isOnPremise.returns(false);
    mod = proxyquire('in-services/eum', {
      'in-services/config': {
        isOnPremise: isOnPremise
      }
    });
  });

  describe('getEumSnippet', () => {
    it('must provide regular SAAS eum snippet', () => {
      expect(mod.getEumSnippet({ key: '123' })).to.equal(
        `
<script>
  (function(i,s,o,g,r,a,m){i['InstanaEumObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//eum.instana.io/eum.min.js','ineum');
  ineum('apiKey', '123');
</script>
`.trim()
      );
    });

    it('must support additional lines', () => {
      expect(mod.getEumSnippet({ key: '123', additionalScript: 'ineum(true);\nineum(false);' })).to.equal(
        `
<script>
  (function(i,s,o,g,r,a,m){i['InstanaEumObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//eum.instana.io/eum.min.js','ineum');
  ineum('apiKey', '123');
  ineum(true);
  ineum(false);
</script>
`.trim()
      );
    });

    it('must provide onprem eum snippet', () => {
      isOnPremise.returns(true);
      expect(mod.getEumSnippet({ key: '123' })).to.equal(
        `
<script>
  // Note: Replace the <trackingBaseUrl> with the base URL under which you proxy
  // the Instana eumtracer (note that this needs to be replaced two times in this snippet).

  (function(i,s,o,g,r,a,m){i['InstanaEumObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','<trackingBaseUrl>/eum.min.js','ineum');
  ineum('reportingUrl', '<trackingBaseUrl>');
  ineum('apiKey', '123');
</script>
`.trim()
      );
    });
  });
});
