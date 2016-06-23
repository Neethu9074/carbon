import {goToMap, PATH_NAMES, navigationParameters$} from 'in-stores/navigation';


export function register(registerShortcut, unregisterShortcut, keyCodes) {
  navigationParameters$.map(params => params.pathname === PATH_NAMES.DASHBOARD)
                       .distinct()
                       .subscribe(isDashboardOpen =>  {
                         isDashboardOpen ?
                           registerShortcut(keyCodes.ESC, onEscInDashboard) :
                           unregisterShortcut(keyCodes.ESC, onEscInDashboard);
                         });
}

function onEscInDashboard() {
  goToMap();
}
