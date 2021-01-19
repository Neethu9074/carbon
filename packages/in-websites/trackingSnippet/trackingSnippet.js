/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { useInstanaSaasEumTrackingUrlEnabled } from 'in-services/featureFlags';
import config, { region } from 'in-services/config';

const undefinedTrackingUrlPlaceholder = '<trackingBaseUrl>';

export function getTrackingSnippet({ key, additionalScript = null, trackSessions = false }) {
  const lines = [`<script>`];

  if (!useInstanaSaasEumTrackingUrlEnabled) {
    lines.push(
      `  // Note: Replace the <trackingBaseUrl> with the base URL under`,
      `  // which you proxy the Instana eum-acceptor (note that this`,
      `  // needs to be replaced two times in this snippet).`,
      ``
    );
  }

  lines.push(
    `  (function(s,t,a,n){s[t]||(s[t]=a,n=s[a]=function(){n.q.push(arguments)},`,
    `  n.q=[],n.v=2,n.l=1*new Date)})(window,"InstanaEumObject","ineum");`,
    ``
  );

  if (!useInstanaSaasEumTrackingUrlEnabled) {
    lines.push(`  ineum('reportingUrl', '${undefinedTrackingUrlPlaceholder}');`);
  } else {
    lines.push(`  ineum('reportingUrl', '${getEumAcceptorBaseUrl()}');`);
  }

  lines.push(`  ineum('key', '${key}');`);
  if (trackSessions) {
    lines.push(`  ineum('trackSessions');`);
  }

  if (additionalScript) {
    additionalScript.split('\n').forEach(line => {
      lines.push(`  ${line}`);
    });
  }

  lines.push(`</script>`);

  let scriptSrc = config?.websiteScriptSource || 'https://eum.instana.io/eum.min.js';
  if (!useInstanaSaasEumTrackingUrlEnabled) {
    scriptSrc = `${undefinedTrackingUrlPlaceholder}/eum.min.js`;
  }
  lines.push(`<script defer crossorigin="anonymous" src="${scriptSrc}"></script>`);

  return lines.join('\n');
}

export function getEumAcceptorBaseUrl() {
  if (config.websiteEndpoint) {
    return config.websiteEndpoint;
  }

  if (useInstanaSaasEumTrackingUrlEnabled && region) {
    if (region === 'eu-west-1') {
      return 'https://eum-blue-saas.instana.io';
    } else if (region === 'us-west-2') {
      return 'https://eum-red-saas.instana.io';
    } else {
      return `https://eum-${region}-saas.instana.io`;
    }
  }

  return '<trackingBaseUrl>';
}
