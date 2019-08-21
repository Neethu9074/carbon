import { useInstanaSaasEumTrackingUrlEnabled } from 'in-services/featureFlags';
import { region } from 'in-services/config';

export function getTrackingSnippet({ key, additionalScript = null }) {
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
      `  "<trackingBaseUrl>/eum.min.js","InstanaEumObject","ineum");`,
      `  ineum('reportingUrl', '<trackingBaseUrl>');`
    );
  } else {
    lines.push(`  "//eum.instana.io/eum.min.js","InstanaEumObject","ineum");`);

    if (region) {
      lines.push(`  ineum('reportingUrl', 'https://eum-${region}.instana.io');`);
    }
  }

  lines.push(`  ineum('key', '${key}');`);

  if (additionalScript) {
    additionalScript.split('\n').forEach(line => {
      lines.push(`  ${line}`);
    });
  }

  lines.push(`</script>`);
  return lines.join('\n');
}
