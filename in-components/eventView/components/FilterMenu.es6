import React from 'react';

import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './FilterMenu.less';


const block = 'in-event-filter-menu';

export default connectTo({

},
function FilterMenu({field, onApplyClicked, onCancelClicked}) {
  return (
    <div className={block}>
      wow, much filters for {field}

      <Row>
        <Button onClick={onApplyClicked}>
          Apply
        </Button>
        <Button onClick={onCancelClicked}
                kind='secondary'>
          Cancel
        </Button>
      </Row>
    </div>
  );
});

function Row({children}) {
  return (
    <div className={`${block}__row`}>
      {children}
    </div>
  );
}
