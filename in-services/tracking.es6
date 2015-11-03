/* global ga:false */

import config from './config';

// please refer to the Google Analytics guidelines about good categories
// and actions:
// https://support.google.com/analytics/answer/1033068
export const events = {};
addEvent('clickOnServerIn3DMap', 'map', 'click on node');
addEvent('clickOnServerInSidebar', 'map sidebar', 'click on node');
addEvent('openingADashboardUsingTheSidebar', 'map sidebar', 'open dashboard');
addEvent('openingADashboardUsingTheMap', 'map', 'open dashboard');
addEvent('showMetricIn3dMap', 'map', 'show metrics');
addEvent('clickOnConnectionBetweenCubes', 'map', 'click on connection');
addEvent('changingTimeWindowUsingTimeline', 'timeline', 'change time window');
addEvent('clickOnUnMonitoredIn3dMap', 'map', 'click on unmonitored host');
addEvent('startATour', 'tour', 'start');
addEvent('finishATour', 'tour', 'finish');
addEvent('skipATour', 'tour', 'skip');
addEvent('nextStepInTour', 'tour', 'next');
addEvent('previousStepInTour', 'tour', 'prev');
addEvent('navigateToAWiredComponentFromTheDashboard', 'dashboard', 'navigate to wired component');
addEvent('antialiasWasChosenInSettings', 'setting', 'change anti alias');


// track for local and demo environments. Customer environments are not yet supported.
// Need to figure out how to use multiple domains with a single tracking ID.
const shouldTrack = window.location.href.indexOf('local-instana.instana.io') !== -1 ||
  window.location.href.indexOf('demo.instana.io') !== -1;
if (shouldTrack) {
  installTracking();
}


export function identify() {
  // currently unsupported by Google Analytics API. Will keep this for now
  // as our sales portal will probably require this functionality.
  // push('identify', {'email': window.instana.user.email});
}


function installTracking() {
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


function addEvent(name, category, action) {
  events[name] = function trackEvent() {
    if (shouldTrack) {
      ga('send', 'event', category, action);
    }
  };
}
