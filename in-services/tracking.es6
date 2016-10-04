/* global ga:false */

import {isInstanaEmployee} from 'in-stores/user';
import config from 'in-services/config';

export function init() {
  if (config.analyticsTrackingId && !isInstanaEmployee()) {
    installGoogleAnalyticsTracking();
  }

  if (config.eumTrackingId) {
    installEumTracking();
  }
}


function installGoogleAnalyticsTracking() {
  /*eslint-disable*/
  (function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })
  (window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  ga('create', config.analyticsTrackingId, 'auto');
  ga('send', 'pageview');
  /*eslint-enable*/
}


function installEumTracking() {
  /* eslint-disable */
  (function(i,s,o,g,r,a,m){i['InstanaEumObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//internal-eum.instana.io:447/eum.js','ineum');
  ineum('apiKey', config.eumTrackingId);
  ineum('reportingUrl', '//internal-eum.instana.io:447');
  /* eslint-enable */
}
