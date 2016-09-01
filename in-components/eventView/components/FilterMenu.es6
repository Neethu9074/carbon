import React from 'react';

import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './FilterMenu.less';


const block = 'in-event-filter-menu';

export default connectTo({

},
function FilterMenu({}) {
  return (
    <div className={block}>
      wow, much filters

      <div className={`${block}__buttons`}>
        <Button>
          Apply
        </Button>
        <Button kind='secondary'>
          Cancel
        </Button>
      </div>
    </div>
  );
});
