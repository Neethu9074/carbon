import {showHelp, closeHelpIfOpen} from 'in-stores/navigation';
import {isMonitoring$} from 'in-stores/isMonitoring';

// We only want to show the monitoring dialog once, so we keep track of it.
let notMonitoringDialogShownBefore = false;

export function init() {
  isMonitoring$.subscribe(isMonitoring => {
    if (isMonitoring === false && notMonitoringDialogShownBefore === false) {
      notMonitoringDialogShownBefore = true;
      showHelp('notMonitoring');
    } else if (isMonitoring) {
      closeHelpIfOpen('notMonitoring');
    }
  });
}
