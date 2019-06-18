/* global require:false */

require('in-map/singleMeshFactories/pluginIconsGlyphTexture').init();
require('in-services/browser').init();
require('in-stores/timeOffset').init();
require('in-components/timeline/timelineStore').init();
require('in-components/MessageDialog/MessageDialogStores').init();
require('in-services/shortcuts').init();
require('in-services/notMonitoringDialogPresenter').init();
require('in-services/security/csrf').init();
require('in-components/SearchBar/stores/highlightedSuggestion').init();
require('in-stores/usageInfo').init();
require('in-stores/maintenance').init();
require('in-services/unhandledErrors').init();
require('in-map/services/focus').init();
require('in-stores/events').init();
require('in-stores/eventsInTimeframe').init();
require('in-services/favicon').init();
require('in-components/ErrorBoundary/store').init();
require('in-services/debuggingBackchannel').init();
require('in-services/tracking/mixpanelTrackers').init();
require('in-services/tracking/appcues').init();
require('in-stores/isMonitoring').init();
require('in-new-components/SelectedElementHighlighter').init();
require('in-services/uiClientVersion').init();
require('in-services/zendesk').init();
