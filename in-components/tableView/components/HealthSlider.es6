import React from 'react';

import {severity$, setSeverity} from 'in-components/tableView/stores/search';
import connectTo from 'in-hoc/connectTo';

import './HealthSlider.less';

const block = 'in-health-slider';

export default connectTo({
    severity: severity$
  }, function HealthSlider({severity}) {
    return (
      <div className={block}>
        Health

        <input type='range'
               min='0'
               max='10'
               step='5'
               value={severity}
               onChange={e => setSeverity(parseInt(e.target.value, 10))}
               className={block + '__slider'} />
      </div>
    );
  }
);
