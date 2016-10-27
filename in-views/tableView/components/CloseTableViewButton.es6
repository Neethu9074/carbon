import React from 'react';

import {physicalViewLink$} from 'in-stores/navigation';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  href: physicalViewLink$
}, function CloseTableViewButton({href}) {
  return (
    <Button href={href}
            size='sm'
            kind='secondary'>
      Close
    </Button>
  );
});
