// Ensure that base CSS is loaded and added to the DOM.
import 'in-themes/foundation.less';

// ensure that some expected global variables exist
import './globals';
import './globalTagDefinition';

import './storybookTheme.mless';

// load all the plugins
import 'in-forge';

// structuring and order is inspired by (see navigation)
// https://getbootstrap.com/docs/4.0/getting-started/introduction/

import './analyse/CallTree';
import './analyse/EditGroupDialogStory';
import './analyse/EditTagFilterDialogStory';
import './analyse/FilterBarStory';
import './analyse/GroupingInfoStory';
import './analyse/IcicleChart';
import './analyse/MetricSelectorStory';
import './analyse/StackTraceStory';
import './analyse/TagFilterListStory';
import './analyse/TraceConverter';
import './analyse/TraceDetail/ErroneousTraceIndicatorStory';

import './application/ApplicationMap';
import './application/CreatingNewApplicationWaiterStory';
import './application/EmptyAppListStory';

import './website/BeaconUserSummaryStory';
import './website/BrowserIconsStory';
import './website/DeprecationsStory';
import './website/NewWebsiteStory';
import './website/OverviewChart';
import './website/PageLoadView/PageLoadViewStory';

import './components/Axis';
import './components/BadgeStory';
import './components/ButtonGroupStory';
import './components/ButtonSegmentedControlStory';
import './components/ButtonStory';
import './components/CardStory';
import './components/ChartStory';
import './components/CheckboxStory';
import './components/DashboardHeaderStory';
import './components/DialogStory';
import './components/EntityVersionListStory';
import './components/EntityWithTypeAndIconStory';
import './components/Errors';
import './components/ExpandableCardStory';
import './components/flyouts/UsageStory';
import './components/GeoHeatMapStory';
import './components/Globe';
import './components/health/HealthIndicatorStory';
import './components/health/OpenIssuesListPresenterStory';
import './components/HeatMap';
import './components/KpiCardStory';
import './components/Loading';
import './components/MapControlsStory';
import './components/MessageStory';
import './components/overlays/OverlayStory';
import './components/PaginationStory';
import './components/PillStory';
import './components/SearchInputStory';
import './components/SparkChart';
import './components/TechnologyIndicator';
import './components/time/TimePresenterStory';
import './components/time/TimeSelectionDialogPresenterStory';
import './components/ToggleStory';
import './components/TopListCardStory';
import './components/TreeMap';
import './components/ViewSwitcherStory';

import './content/table/ServerTableStory';
import './content/table/SharedComponents';
import './content/table/TableStory';
import './content/TypographyStory';

import './forms/ApplicationConfigurationStory';
import './forms/BasicFormStory';
import './forms/FormFieldsStory';
import './forms/ServiceConfigurationStory';

import './layout/GridStory';
import './layout/SidebarStory';
import './layout/StickySidebarStory';
import './layout/StickyStory';

import './utilities/ColorsStory';
import './utilities/IconStory';
import './utilities/ShadowsStory';
import './utilities/ShapesStory';
import './utilities/TypographyStory';

import './x_old_components/BadgeStory';
import './x_old_components/ButtonStory';
import './x_old_components/CodeEditor';
import './x_old_components/CodeStory';
import './x_old_components/ComboBoxStory';
import './x_old_components/form/DateInputStory';
import './x_old_components/form/InputStory';
import './x_old_components/IconStory';
import './x_old_components/KeyValuePopup';
import './x_old_components/KpiStory';
import './x_old_components/MultiSelectStory';
import './x_old_components/sdk/CollapsibleStory';
import './x_old_components/sdk/Descriptions';
