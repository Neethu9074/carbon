/* global ga:false */

import config from 'in-services/config';

export function init() {
  if (config.trackJsToken) {
    install();
  }
}

function install() {
  const user = window.instana.user;
  const build = window.instana.build;

  window._trackJs = {
    token: config.trackJsToken,
    enabled: window.location.href.indexOf('local-instana.instana.io') === -1,
    application: `${config.environment}_${config.tenant}_${config.tenantUnit}`,
    userId: user.email,
    version: build.revision + ' (' + build.date + ')'
  };
  const script = document.createElement('script');
  script.src = 'https://d2zah9y47r7bi2.cloudfront.net/releases/current/tracker.js';
  script.async = 1;
  document.head.appendChild(script);
}
