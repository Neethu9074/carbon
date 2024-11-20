/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  pageTransitionMethods,
  frameworkTypes
} from 'in-websites/trackingSnippet/AutoPageTransitionDetection/constants';
import { useInstanaSaasEumTrackingUrlEnabled } from 'in-services/featureFlags';
import { weaselSubresourceIntegrityEnabled } from 'in-services/featureFlags';
import config, { region } from 'in-services/config';

interface SnippetProps {
  setTrackSessions: (value: string) => void;
  setEnableSRI: (value: string) => void;
  key: string;
  additionalScript: string | null;
  trackSessions: boolean;
  enableSRI: boolean;
  urlWeaselVersion: string;
  shaValue: string;
  enableAutoPageDetection: boolean;
  pageTransitionMethod: string;
  regexMappingRules: [];
  frameworkType: string;
}

const undefinedTrackingUrlPlaceholder = '<trackingBaseUrl>';
const formatMappingRule = (regexMappingRules: []) => {
  return regexMappingRules
    .map(({ rule, replaceText }) => {
      return `[${rule}, '${replaceText}']`;
    })
    .join(', ');
};

export function getTrackingSnippet({
  key,
  additionalScript = null,
  trackSessions = false,
  enableSRI = false,
  urlWeaselVersion,
  shaValue,
  enableAutoPageDetection = false,
  pageTransitionMethod = '',
  regexMappingRules = [],
  frameworkType = ''
}: SnippetProps) {
  const TITLE_AS_PAGE_NAME = `  ineum('autoPageDetection', { titleAsPageName: ${enableAutoPageDetection} });`;
  const AUTO_PAGE_DETECTION = `  ineum('autoPageDetection', ${enableAutoPageDetection});`;

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

  if (frameworkType === frameworkTypes.SPA && enableAutoPageDetection) {
    if (pageTransitionMethod === pageTransitionMethods.PAGE_TITLE) {
      lines.push(TITLE_AS_PAGE_NAME);
    } else if (pageTransitionMethod === pageTransitionMethods.PAGE_URL) {
      if (regexMappingRules.length > 0) {
        const formattedMappingRule = formatMappingRule(regexMappingRules);
        lines.push(`  ineum('autoPageDetection', { mappingRule: [${formattedMappingRule}] });`);
      } else {
        lines.push(AUTO_PAGE_DETECTION);
      }
    }
  }

  if (additionalScript) {
    additionalScript.split('\n').forEach((line: string) => {
      lines.push(`  ${line}`);
    });
  }

  lines.push(`</script>`);

  let scriptSrc = config?.websiteScriptSource || 'https://eum.instana.io/eum.min.js';
  if (weaselSubresourceIntegrityEnabled && enableSRI) {
    scriptSrc = scriptSrc.replace('eum.min.js', `${urlWeaselVersion}/eum.min.js`);
  }

  if (!useInstanaSaasEumTrackingUrlEnabled) {
    scriptSrc = `${undefinedTrackingUrlPlaceholder}/eum.min.js`;
  }

  lines.push(
    weaselSubresourceIntegrityEnabled && enableSRI
      ? `<script defer crossorigin="anonymous" src="${scriptSrc}" \n integrity="${shaValue}"></script>`
      : `<script defer crossorigin="anonymous" src="${scriptSrc}"></script>`
  );

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
