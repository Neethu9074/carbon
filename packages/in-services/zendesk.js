import { navigationParameters$ } from 'in-stores/navigation';
import getUsageInfo from 'in-subscription/getUsageInfo';
import { convertRemToPx } from 'in-services/util/dom';
import { config } from 'in-services/config';

export function init() {
  if (!config.zendeskKey) {
    // Zendesk support capabilities not enabled.
    return;
  }

  getUsageInfo().once(usageInfo => {
    // usageInfo can be null when there is no active license.
    if (usageInfo && usageInfo.activeLicenseType === 'selfService') {
      addZendeskStyles();
      addZendeskSnippet();
    }
  });
}

function addZendeskStyles() {
  window.zESettings = {
    webWidget: {
      color: {
        theme: '#00B3B3',
        launcherText: '#fff'
      },
      zIndex: 100
    }
  };
}

export function shouldShowFloatingFooter() {
  return getUsageInfo().map(usageInfo => usageInfo && usageInfo.activeLicenseType === 'selfService');
}

function addZendeskSnippet() {
  const zendeskScript = document.createElement('script');
  zendeskScript.type = 'text/javascript';
  zendeskScript.id = 'ze-snippet';
  zendeskScript.src = `https://static.zdassets.com/ekr/snippet.js?key=${encodeURIComponent(config.zendeskKey)}`;
  zendeskScript.addEventListener('load', onZendeskLoaded, false);
  document.body.appendChild(zendeskScript);
}

function onZendeskLoaded() {
  // Check that the Zendesk script is not blocked
  if (typeof window.zE === 'function') {
    navigationParameters$.subscribe(updateZendeskPosition);
  }
}

function updateZendeskPosition(navigationParameters) {
  window.zE('webWidget', 'updateSettings', {
    webWidget: {
      offset: getZendeskOffset(navigationParameters.pathname),
      contactForm: hideZEndeskChat(navigationParameters.pathname)
    }
  });
}

function hideZEndeskChat(pathname) {
  if (pathname === '/events') {
    return { suppress: true };
  }

  return { suppress: false };
}

function getZendeskOffset(pathname) {
  switch (pathname) {
    case '/physical':
      return { vertical: convertRemToPx(5.625), mobile: { vertical: convertRemToPx(5.625) } }; // 90px
    case '/events':
      return { vertical: convertRemToPx(4.375), mobile: { vertical: convertRemToPx(4.375) } }; // 70px
    case '/websiteMonitoring/website/geography':
      return { vertical: convertRemToPx(11.25), mobile: { vertical: convertRemToPx(11.25) } }; // 180px
    case '/websiteMonitoring/website/geography/globe':
      return { vertical: convertRemToPx(10.625), mobile: { vertical: convertRemToPx(10.625) } }; // 170px
    case '/application/map':
      return { vertical: convertRemToPx(8.125), mobile: { vertical: convertRemToPx(8.125) } }; // 130px
    case '/service/flowMap':
    case '/endpoint/flowMap':
      return { vertical: convertRemToPx(5), mobile: { vertical: convertRemToPx(5) } }; // 80px
    default:
      return { vertical: '0', mobile: { vertical: '0' } };
  }
}
