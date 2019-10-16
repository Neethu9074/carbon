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

import './analyse/CallDetail/InfraEntityLink.story';
import './analyse/CallDetail/LocationComponent.story';
import './analyse/CallTree.story';
import './analyse/DownshiftSearch.story';
import './analyse/EditGroupDialog.story';
import './analyse/EditTagFilterDialog.story';
import './analyse/FilterBar.story';
import './analyse/GroupingInfo.story';
import './analyse/IcicleChart.story';
import './analyse/StackTrace.story';
import './analyse/TagFilterList.story';
import './analyse/TraceDetail/ErroneousTraceIndicator.story';

import './application/ApplicationMap.story';
import './application/CreatingNewApplicationWaiter.story';
import './application/EmptyAppList.story';
import './application/ServiceListPopup.story';

import './website/BeaconUserSummary.story';
import './website/BrowserIcons.story';
import './website/Deprecations.story';
import './website/NewWebsite.story';
import './website/OverviewChart.story';
import './website/PageLoadView/PageLoadView.story';
import './website/StackTraceTranslationConfiguration.story';
import './website/AlertConfigDialog/componets/Menu.story';
import './website/AlertConfigDialog/componets/TabSwitch.story';
import './website/AlertConfigDialog/componets/CreateAlertButton.story';
import './website/AlertConfigDialog/SimpleAlertDialog.story';

import './components/Axis.story';
import './components/Badge.story';
import './components/Button.story';
import './components/ButtonGroup.story';
import './components/ButtonRounded.story';
import './components/ButtonSegmentedControl.story';
import './components/Capitalize.story';
import './components/Card.story';
import './components/Chart.story';
import './components/Checkbox.story';
import './components/DashboardHeader.story';
import './components/DashboardNotification.story';
import './components/Dialog.story';
import './components/Dialog2.story';
import './components/EntityVersionList.story';
import './components/EntityWithTypeAndIcon.story';
import './components/Errors.story';
import './components/ExpandableCard.story';
import './components/ExpandableCard.story';
import './components/flyouts/Usage.story';
import './components/GeoHeatMap.story';
import './components/Globe.story';
import './components/health/HealthIndicator.story';
import './components/health/OpenIssuesListPresenter.story';
import './components/health/WithHealthIndication.story';
import './components/HeatMap.story';
import './components/InlineTabNavigation.story';
import './components/KpiCard.story';
import './components/KpiGridRow.story';
import './components/Loading.story';
import './components/LoadingTraces.story';
import './components/MapControls.story';
import './components/Message.story';
import './components/overlays/Overlay.story';
import './components/Pagination.story';
import './components/Pill.story';
import './components/ProblemIndicator.story';
import './components/SearchInput.story';
import './components/SparkChart.story';
import './components/Stack.story';
import './components/StackTrace.story';
import './components/StepProgressBar.story';
import './components/TechnologyIndicator.story';
import './components/time/TimeCount.story';
import './components/time/TimePresenter.story';
import './components/time/TimeSelectionDialogPresenter.story';
import './components/Toggle.story';
import './components/TopListCard.story';
import './components/TreeMap.story';
import './components/VersionTimeline.story';
import './components/ViewSwitcher.story';

import './content/List.story';
import './content/table/ServerTable.story';
import './content/table/SharedComponents.story';
import './content/table/Table.story';
import './content/Typography.story';

import './forms/ApplicationConfiguration.story';
import './forms/BasicForm.story';
import './forms/FormFields.story';
import './forms/ServiceConfiguration.story';

import './layout/Grid.story';
import './layout/Sidebar.story';
import './layout/StickySidebar.story';
import './layout/Sticky.story';

import './utilities/Colors.story';
import './utilities/Icon.story';
import './utilities/Shadows.story';
import './utilities/Shapes.story';
import './utilities/Typography.story';

import './x_old_components/Badge.story';
import './x_old_components/Button.story';
import './x_old_components/Code.story';
import './x_old_components/ComboBox.story';
import './x_old_components/form/DateInput.story';
import './x_old_components/form/Input.story';
import './x_old_components/Icon.story';
import './x_old_components/Kpi.story';
import './x_old_components/sdk/Collapsible.story';
import './x_old_components/sdk/Descriptions.story';

import './releases/ReleaseStatusRow.story';

import './terms/Terms.story';

import './selfService/OnboardingWidget.story';
