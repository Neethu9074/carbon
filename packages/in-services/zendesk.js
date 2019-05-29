import { navigationParameters$ } from 'in-stores/navigation';
import getUsageInfo from 'in-subscription/getUsageInfo';
import { config } from 'in-services/config';

export function init() {
  if (!config.zendeskKey) {
    // Zendesk support capabilities not enabled.
    return;
  }

  getUsageInfo().once(({ activeLicenseType }) => {
    if (activeLicenseType === 'selfService') {
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
      }
    }
  };
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
      offset: getZendeskOffset(navigationParameters.pathname)
    }
  });
}

function getZendeskOffset(pathname) {
  switch (pathname) {
    case '/physical':
      return { vertical: '90px', mobile: { vertical: '90px' } };
    case '/events':
      return { vertical: '70px', mobile: { vertical: '70px' } };
    case '/websiteMonitoring/website/geography':
      return { vertical: '180px', mobile: { vertical: '180px' } };
    case '/websiteMonitoring/website/geography/globe':
      return { vertical: '170px', mobile: { vertical: '170px' } };
    case '/application/map':
      return { vertical: '130px', mobile: { vertical: '130px' } };
    case '/service/flowMap':
    case '/endpoint/flowMap':
      return { vertical: '80px', mobile: { vertical: '80px' } };
    default:
      return { vertical: '0', mobile: { vertical: '0' } };
  }
}
