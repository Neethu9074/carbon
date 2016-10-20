import React from 'react';

import {changesAreVisible$, toggle} from 'in-components/eventView/stores/changesVisibilityStore';
import connectTo from 'in-hoc/connectTo';
import Button from 'in-components/Button';

import 'in-components/eventView/components/Incident/PopulationChart/ToggleChangesButton.less';


const block = 'in-event-view-toggle-changes-button';

export default connectTo({
  changesAreVisible: changesAreVisible$
},
function ToggleChangesButton({changesAreVisible}) {
  return (
    <Button className={block}
            onClick={toggle}
            kind='secondary'>
      {changesAreVisible ? 'Hide changes' : 'Show changes'}
    </Button>
  );
});
