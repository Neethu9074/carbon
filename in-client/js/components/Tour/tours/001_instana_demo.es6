import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';
import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';
import {create} from 'in-services/conveyer';
import {plugins} from 'in-forge/constants';

let snapshots;
export const observable = create(SnapshotConveyer, {pluginId: plugins.os})
                            .subscribe(data => snapshots = data);

function openDashboard(tour) {
  const snapshot = snapshots.get(0);
  tour.transitionTo(
    'dashboard',
    {
      pluginId: snapshot.get('pluginId'),
      steadyId: snapshot.get('steadyId'),
      hostId: snapshot.get('hostId')
    }
  );
}

function clickOnCssItem(tag) {
  document.querySelector(tag).click();
}

export const tourDefinition = {
  id: '1',
  steps: [
    {
      title: 'Welcome to your server and application landscape',
      text: 'The set of boxes are the hosts that have been discovered grouped into data centers.',
      nextStepLabel: 'Start the tour!'
    },
    {
      title: 'Each box is a host - you can click it!',
      text: 'Single click to see a side dashboard of details about that host ' +
            'and notice the lines indicating TCP connections to other hosts.',
      nextStepLabel: 'Click on a box',
      element: 'ALL',
      after() {
        selectedSnapshot.select(snapshots.get(0));
      }
    },
    {
      title: 'Get a look at the real-time dashboard',
      text: 'Double click a box or use the Open Dashboard button to get a comprehensive view of real-time, ' +
            '1 second resolution metric details along with environmental details.',
      nextStepLabel: 'Open the dashboard',
      element: 'ALL',
      after(tour) {
        openDashboard(tour);
      },
      undo() {
        selectedSnapshot.clear();
      }
    },
    {
      title: 'Such dashboard',
      text: '',
      element: 'ALL',
      undo() {
        clickOnCssItem('.in-dashboard-header__close');
      }
    },
    {
      title: 'Back to map',
      text: 'close the dashboard and go back to 3D map.',
      element: '.in-dashboard-header__close',
      nextStepLabel: 'Click it',
      after() {
        clickOnCssItem('.in-dashboard-header__close');
        selectedSnapshot.clear();
      }
    },
    {
      title: 'Welcome back to map',
      text: 'Would\'t it be great to get live metrics from dashboard inside each box?',
      nextStepLabel: 'I shit in my pants if that\'s true!',
      undo(tour) {
        openDashboard(tour);
      },
      after() {
        clickOnCssItem('.icon-metrics.in-sidebar-controls__control-icon');
      }
    },
    {
      title: 'Select the metrics view',
      text: 'There is a set of metrics to Visualize in the map.',
      element: 'ALL',
      nextStepLabel: 'Expand the CPU metrics',
      after() {
        clickOnCssItem('.icon-open.in-sidebar-metric-header__icon');
      },
      undo() {
        clickOnCssItem('.icon-metrics.in-sidebar-controls__control-icon');
      }
    },
    {
      title: 'Select metrics for viewing across all hosts',
      text: 'Visualize how a specific metric is behaving in real-time across all hosts, ' +
            'for example, CPU Load, or Memory Consumption.',
      nextStepLabel: 'Choose CPU Load',
      element: 'ALL',
      after() {
        clickOnCssItem('.in-sidebar-metric-tree--leaf');
      },
      undo() {
        clickOnCssItem('.icon-close.in-sidebar-metric-header__icon');
      }
    },
    {
      title: 'watch metrics',
      text: '',
      element: 'ALL',
      nextStepLabel: 'Awesome stuff!',
      after() {
        clickOnCssItem('.in-sidebar-metrics__clear-button');
      },
      undo() {
        clickOnCssItem('.in-sidebar-metrics__clear-button');
      }
    },
    {
      title: 'this is the end',
      text: 'my only friend',
      after() {
        clickOnCssItem('.icon-metrics.in-sidebar-controls__control-icon');
      },
      undo() {
        clickOnCssItem('.in-sidebar-metric-tree--leaf');
      }
    }
  ]
};
