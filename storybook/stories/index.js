// Ensure that base CSS is loaded and added to the DOM.
import 'in-themes/foundation.less';

// ensure that some expected global variables exist
import './globals';

// load all the plugins
import 'in-forge';

// structuring and order is inspired by (see navigation)
// https://getbootstrap.com/docs/4.0/getting-started/introduction/

import './layout/GridStory';
import './layout/SidebarStory';
import './layout/StickyStory';

import './content/table/TableStory';
import './content/TypographyStory';

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

import './newComponents/Axis';
import './newComponents/BadgeKeyValueStory';
import './newComponents/health/HealthIndicatorStory';
import './newComponents/health/OpenIssuesListPresenterStory';
import './newComponents/HeatMap';
import './newComponents/overlays/OverlayStory';

import './analyse/CallTree';
import './analyse/IcicleChart';
import './analyse/TraceConverter';
import './designLibrary/application/AppHeaderStory';
import './designLibrary/application/EmptyAppListStory';

import './designLibrary/content/table/ServerTableStory';
import './designLibrary/content/table/SharedComponents';
import './designLibrary/content/TypographyStory';

import './designLibrary/utilities/ColorsStory';
import './designLibrary/utilities/IconStory';
import './designLibrary/utilities/ShadowsStory';
import './designLibrary/utilities/ShapesStory';

import './designLibrary/components/BadgeStory';
import './designLibrary/components/ButtonStory';
import './designLibrary/components/CardStory';
import './designLibrary/components/ChartStory';
import './designLibrary/components/DashboardHeaderStory';
import './designLibrary/components/EntityWithTypeAndIconStory';
import './designLibrary/components/KpiCardStory';
import './designLibrary/components/MultiSelectDropdownStory';
import './designLibrary/components/PaginationStory';
import './designLibrary/components/PillStory';
import './designLibrary/components/TagStory';
import './designLibrary/components/TechnologyIndicator';
import './designLibrary/components/ToggleStory';
import './designLibrary/components/TopListCardStory';
import './designLibrary/components/time/TimePresenterStory';
import './designLibrary/components/time/TimeSelectionDialogPresenterStory';
import './designLibrary/components/ViewSwitcherStory';

import './designLibrary/forms/ApplicationConfigurationStory';
import './designLibrary/forms/BasicFormStory';
import './designLibrary/forms/FormFieldsStory';
import './designLibrary/forms/ServiceConfigurationStory';
import './designLibrary/forms/TagFilterEditFormStory';
