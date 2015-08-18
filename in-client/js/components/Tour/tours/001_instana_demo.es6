import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';
import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';
import {create} from 'in-services/conveyer';
import {plugins} from 'in-forge/constants';

let snapshots;
export const observable = create(SnapshotConveyer, {pluginId: plugins.os})
                            .subscribe(data => snapshots = data);

export const tourDefinition = {
  id: '1',
  steps: [
    {
      title: 'Welcome to your server and application landscape',
      text: 'The set of boxes are the hosts that have been discovered grouped into data centers.',
      nextStepLabel: 'Fucking start the tour!'
    },
    {
      title: 'Each box is a host - you can click it!',
      text: 'Single click to see a side dashboard of details about that host ' +
            'and notice the lines indicating TCP connections to other hosts.',
      nextStepLabel: 'Click the node',
      element: '.in-map',
      after() {
        selectedSnapshot.select(snapshots.get(0));
      }
    },
    {
      title: 'Get a look at the real-time dashboard',
      text: 'Double click a box or use the Open Dashboard button to get a comprehensive view of real-time, ' +
            '1 second resolution metric details along with environmental details.',
      nextStepLabel: 'Open the dashboard',
      element: '.in-map',
      after() {
        document.querySelector('.in-sidebar-details__open-dashboard').click();
      }
    },
    {
      title: 'Such dashboard',
      text: '',
      element: '.in-map'
    },
    {
      title: 'Back to map',
      text: 'close the dashboard and go back to 3D map.',
      nextStepLabel: 'Click it',
      element: '.in-dashboard-header__close',
      after() {
        document.querySelector('.in-dashboard-header__close').click();
        selectedSnapshot.clear();
      }
    },
    {
      title: 'Welcome back to map',
      text: 'Would\'t it be great to get live metrics from dashboard inside each box?',
      nextStepLabel: 'I shit in my pants if that\'s true!'
    },
    {
      title: 'Select the metrics view',
      text: 'There is a set of metrics to Visualize in the map.',
      element: '.in-map',
      nextStepLabel: 'Expand the CPU metrics',
      before() {
        document.querySelector('.icon-metrics.in-sidebar-controls__control-icon').click();
      },
      after() {
        document.querySelector('.icon-open.in-sidebar-metric-header__icon').click();
      }
    },
    {
      title: 'Select metrics for viewing across all hosts',
      text: 'Visualize how a specific metric is behaving in real-time across all hosts, ' +
            'for example, CPU Load, or Memory Consumption.',
      nextStepLabel: 'Choose CPU Load',
      element: '.in-map',
      after() {
        document.querySelector('.in-sidebar-metric-tree--leaf').click();
      }
    },
    {
      title: 'watch metrics',
      text: '',
      element: '.in-map',
      nextStepLabel: 'Awesome stuff!',
      after() {
        document.querySelector('.in-sidebar-metrics__clear-button').click();
      }
    },
    {
      title: 'this is the end',
      text: 'my only friend'
    }
  ]
};
