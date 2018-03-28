// Ensure that base CSS is loaded and added to the DOM.
import 'in-themes/foundation.less';

// ensure that some expected global variables exist
import './globals';

// load all the plugins
import 'in-forge';

// structuring and order is inspired by (see navigation)
// https://getbootstrap.com/docs/4.0/getting-started/introduction/

import './layout/GridStory';
import './layout/StickyStory';

import './content/ServerTableStory';
import './content/TypographyStory';
import './content/TableStory';
// import './content/ServiceDashboardStory';

import './components/BadgeStory';
import './components/ButtonStory';
import './components/CodeEditor';
import './components/CodeStory';
import './components/form/DateInputStory';
import './components/form/InputStory';
import './components/KpiStory';
import './components/ComboBoxStory';
import './components/IconStory';
import './components/KeyValuePopup';
import './components/MultiSelectStory';
import './components/SparkChart';
import './components/ProgressStory';
import './components/SparkChart';
import './components/sdk/CollapsibleStory';
import './components/sdk/Descriptions';

import './newComponents/application/NewApplicationStory';
import './newComponents/Axis';
import './newComponents/BadgeStory';
import './newComponents/BadgeKeyValueStory';
import './newComponents/ButtonStory';
import './newComponents/CardStory';
import './newComponents/Chart';
import './newComponents/ColorsStory';
import './newComponents/CounterStory';
import './newComponents/DashboardHeaderStory';
import './newComponents/DotStory';
import './newComponents/EntityWithTypeAndIconStory';
import './newComponents/HeatMap';
import './newComponents/KpiCardStory';
import './newComponents/overlays/OverlayStory';
import './newComponents/PaginationStory';
import './newComponents/time/TimePresenterStory';
import './newComponents/time/TimeSelectionDialogPresenterStory';
import './newComponents/TopListCardStory';
import './newComponents/ViewSwitcherStory';

import './analyse/CallTree';
import './analyse/IcicleChart';
import './analyse/TraceConverter';
