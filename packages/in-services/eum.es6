import { isOnPremise, region } from 'in-services/config';

export function ineum() {
  if (typeof window !== 'undefined' && window.ineum) {
    window.ineum.apply(window, arguments);
  }
}

export function getEumSnippet({ key, additionalScript = null }) {
  const lines = [`<script>`];
  if (isOnPremise()) {
    lines.push(
      `  // Note: Replace the <trackingBaseUrl> with the base URL under which you proxy`,
      `  // the Instana eumtracer (note that this needs to be replaced two times in this snippet).`,
      ``
    );
  }

  lines.push(
    `  (function(i,s,o,g,r,a,m){i['InstanaEumObject']=r;i[r]=i[r]||function(){`,
    `  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),`,
    `  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)`
  );

  if (isOnPremise()) {
    lines.push(
      `  })(window,document,'script','<trackingBaseUrl>/eum.min.js','ineum');`,
      `  ineum('reportingUrl', '<trackingBaseUrl>');`
    );
  } else {
    lines.push(`  })(window,document,'script','//eum.instana.io/eum.min.js','ineum');`);

    if (region) {
      lines.push(`  ineum('reportingUrl', 'https://eum-${region}.instana.io');`);
    }
  }

  lines.push(`  ineum('apiKey', '${key}');`);

  if (additionalScript) {
    additionalScript.split('\n').forEach(line => {
      lines.push(`  ${line}`);
    });
  }

  lines.push(`</script>`);
  return lines.join('\n');
}
