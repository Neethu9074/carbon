import {createLogger} from 'instalog';

import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';
import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';
import {create} from 'in-services/conveyer';
import {plugins} from 'in-forge/constants';

const logger = createLogger('tour.001');

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
  try {
    document.querySelector(tag).click();
  } catch (e) {
    logger.error('Cannot click on', tag, e);
  }
}

export const tourDefinition = {
  id: '1',
  steps: [
    {
      title: 'Welcome to the Instana Demo',
      text: 'This tour will guide you through Instana and its features. During the tour ' +
            'you cannot interact with the application as the ' +
            'user interface will be locked.',
      nextStepLabel: 'Start the tour'
    },
    {
      title: 'Server and Application Landscape',
      text: 'The set of boxes represents the hosts that have been discovered, grouped into data centers.',
      element: 'ALL',
      nextStepLabel: 'Tell me more'
    },
    {
      title: 'Each box is a host - you can click it!',
      text: 'Single click a box to select it and reveal a sidebar containing details ' +
            'about a host. ',
      nextStepLabel: 'Click on a box',
      element: 'ALL',
      after() {
        let indexToClick = 0;
        if (snapshots.size > 1) {
          indexToClick = Math.floor(snapshots.size / 2);
        }
        selectedSnapshot.select(snapshots.get(indexToClick));
      }
    },
    {
      title: 'The Sidebar',
      text: 'An overview about a selected host is presented in the sidebar. Also notice the ' +
            'lines indicating TCP connections to other hosts.',
      element: 'ALL',
      undo() {
        selectedSnapshot.clear();
      }
    },
    {
      title: 'Look at the real-time dashboard',
      text: 'Double click a host or use the Open Dashboard button in the sidebar to get a ' +
            'comprehensive view of host details with 1 second resolution metrics.',
      nextStepLabel: 'Open the dashboard',
      element: '.in-sidebar-details__open-dashboard',
      after(tour) {
        openDashboard(tour);
      }
    },
    {
      title: 'Real-time Charts',
      text: 'Dashboards contain real-time, 1 second resolution metrics and charts along with ' +
            'environmental information, e.g. Amazon Web-Service data and applications that are ' +
            'running on this host.',
      element: 'ALL',
      undo(tour) {
        tour.transitionTo('map');
      }
    },
    {
      title: 'Timeshift Investigation',
      text: 'Configure chart time windows to inspect interesting situations, e.g. when an ' +
            'application was deployed or issues were detected.',
      element: '.in-timeline'
    },
    {
      title: 'Back to the 3D Map',
      text: 'Close the dashboard and go back to the 3D map using this button.',
      element: '.in-dashboard-header__close',
      nextStepLabel: 'Back to the 3D Map',
      after() {
        clickOnCssItem('.in-dashboard-header__close');
        selectedSnapshot.clear();
      }
    },
    {
      title: 'Metrics for the Whole Application Landscape',
      text: 'Visualize real-time metrics in 3D for a whole application landscape!',
      nextStepLabel: 'Show me how to do this',
      undo(tour) {
        openDashboard(tour);
      }
    },
    {
      title: 'Opening the Metric Selector',
      text: 'The sidebar can be controlled via buttons on the right side of the screen. ' +
            'The metric selector is part of the sidebar.',
      nextStepLabel: 'Show the metric selector',
      element: '.icon-metrics.in-sidebar-controls__control-icon',
      after() {
        clickOnCssItem('.icon-metrics.in-sidebar-controls__control-icon');
        clickOnCssItem('.in-sidebar-metric-header--0');
        clickOnCssItem('.in-sidebar-metric-tree--leaf');
      }
    },
    {
      title: 'CPU Load for All Hosts',
      text: 'Instana can visualize the real-time CPU load of all hosts in the application ' +
            'landscape. This information can be used to easily identify overloaded hosts.',
      element: 'ALL',
      undo() {
        clickOnCssItem('.in-sidebar-metrics__clear-button');
        clickOnCssItem('.icon-metrics.in-sidebar-controls__control-icon');
      }
    },
    {
      title: 'Stopping Real-Time Metrics',
      text: 'To stop real-time metric visualization, use the clear button in the sidebar.',
      element: '.in-sidebar-metrics__clear-button',
      nextStepLabel: 'Stop Real-Time Metrics',
      after() {
        // stop metrics from flowing
        clickOnCssItem('.in-sidebar-metrics__clear-button');
        // close sidebar
        clickOnCssItem('.icon-metrics.in-sidebar-controls__control-icon');
      }
    },
    {
      title: 'End of Tour',
      text: 'Thank you for checking out our tour. Time for you to try Instana yourself!',
      nextStepLabel: 'Finish tour and unlock user interface',
      undo() {
        clickOnCssItem('.icon-metrics.in-sidebar-controls__control-icon');
        clickOnCssItem('.in-sidebar-metric-header--0');
        clickOnCssItem('.in-sidebar-metric-tree--leaf');
      }
    }
  ]
};
