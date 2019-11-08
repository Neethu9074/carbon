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
  if (pathname.includes('/websiteMonitoring/website/configuration')) {
    return {
      vertical: convertRemToPx(0.75),
      horizontal: 0,
      mobile: { horizontal: 0 }
    };
  }

  if (pathname !== '/websiteMonitoring/websites' && pathname.includes('/websiteMonitoring/website')) {
    return {
      vertical: convertRemToPx(0.75),
      horizontal: convertRemToPx(11.25),
      mobile: { horizontal: convertRemToPx(11.25) }
    };
  }

  switch (pathname) {
    case '/physical':
      return { vertical: convertRemToPx(6.375), mobile: { vertical: convertRemToPx(6.375) } }; // 90px
    case '/events':
      return { vertical: convertRemToPx(5.125), mobile: { vertical: convertRemToPx(5.125) } }; // 70px
    case '/application/map':
      return { vertical: convertRemToPx(8.875), mobile: { vertical: convertRemToPx(8.875) } }; // 130px
    case '/service/flowMap':
    case '/endpoint/flowMap':
      return { vertical: convertRemToPx(5.75), mobile: { vertical: convertRemToPx(5.75) } }; // 80px
    default:
      return { horizontal: 0, vertical: '12', mobile: { vertical: '12', horizontal: 0 } };
  }
}
