import React from 'react';

import connectTo from 'in-hoc/connectTo';

import './AutoUpdate.less';


const block = 'in-auto-update';

export default connectTo(props => {
  return {
    autoUpdateActive: props.autoUpdate$
  };
},
function AutoUpdate({toggleAutoUpdate, checkboxId, autoUpdateActive}) {
  return (
    <div className={block}>
      <input type='checkbox'
             id={checkboxId}
             checked={autoUpdateActive}
             onChange={toggleAutoUpdate}/>
      <label htmlFor={checkboxId}
             className={`${block}__label`}>
        Refresh every 10 seconds
      </label>
    </div>
  );
});
