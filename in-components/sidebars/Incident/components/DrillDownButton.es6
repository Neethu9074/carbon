import React from 'react';

import {getEventViewWithIncident} from 'in-stores/navigation/view';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
  return {
    href: getEventViewWithIncident(props.incidentId)
  };
}, function DrillDownButton({href}) {
  return (
    <Button size='sm'
            href={href}>
      Drill down
    </Button>
  );
});
