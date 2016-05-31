import React from 'react';

import {maintenanceMessage$} from 'in-stores/maintenance';
import connectTo from 'in-hoc/connectTo';

import './MaintenanceNote.less';

const block = 'in-maintenance-note';

export default connectTo({
    maintenanceMessage: maintenanceMessage$
  }, function MaintenanceNote({maintenanceMessage}) {
    if (!maintenanceMessage) {
      return null;
    }

    // TODO markdown
    return (
      <div className={block}>
        {maintenanceMessage}
      </div>
    );
  });
