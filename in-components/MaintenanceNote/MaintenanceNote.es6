import React from 'react';

import {maintenanceMessage$, markAsRead} from 'in-stores/maintenance';
import {toHtml} from 'in-services/formatters/markdown';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './MaintenanceNote.less';

const block = 'in-maintenance-note';

export default connectTo({
    maintenanceMessage: maintenanceMessage$
  }, function MaintenanceNote({maintenanceMessage}) {
    if (!maintenanceMessage) {
      return null;
    }

    return (
      <div className={block}
           onClick={markAsRead}>
        <Icon type='server'
              className={block + '__icon'}/>
        <div className={block + '__text'}
             dangerouslySetInnerHTML={{__html: toHtml(maintenanceMessage)}} />
      </div>
    );
  });
