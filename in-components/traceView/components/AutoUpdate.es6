import React from 'react';

import connectTo from 'in-hoc/connectTo';
import {toggleAutoRefresh, autoUpdate$} from 'in-components/traceView/traceViewStore';

import './AutoUpdate.less';


const block = 'in-trace-auto-update';
const checkboxId = 'trace-view-auto-update';

export default connectTo(
  {
    autoUpdateActive: autoUpdate$
  }, function AutoUpdate({autoUpdateActive}) {
    return (
      <div className={block}>
        <input type='checkbox'
               id={checkboxId}
               value={autoUpdateActive}
               onChange={toggleAutoRefresh}/>
        <label htmlFor={checkboxId}
               className={`${block}__label`}>
          Refresh every 10 seconds
        </label>
      </div>
    );
  }
);
