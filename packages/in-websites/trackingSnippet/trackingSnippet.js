import { useInstanaSaasEumTrackingUrlEnabled } from 'in-services/featureFlags';
import { region } from 'in-services/config';

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
    `  (function(c,e,f,k,g,h,b,a,d){c[g]||(c[g]=h,b=c[h]=function(){`,
    `  b.q.push(arguments)},b.q=[],b.l=1*new Date,a=e.createElement(f),a.async=1,`,
    `  a.src=k,a.setAttribute("crossorigin", "anonymous"),d=e.getElementsByTagName(f)[0],`,
    `  d.parentNode.insertBefore(a,d))})(window,document,"script",`
  );

  if (!useInstanaSaasEumTrackingUrlEnabled) {
    lines.push(
      `  "${undefinedTrackingUrlPlaceholder}/eum.min.js","InstanaEumObject","ineum");`,
      `  ineum('reportingUrl', '${undefinedTrackingUrlPlaceholder}');`
    );
  } else {
    lines.push(`  "https://eum.instana.io/eum.min.js","InstanaEumObject","ineum");`);
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
  return lines.join('\n');
}

export function getEumAcceptorBaseUrl() {
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
