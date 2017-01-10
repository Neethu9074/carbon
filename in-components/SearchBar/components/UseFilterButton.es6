import React from 'react';

import {getCurrentViewWithFilter} from 'in-stores/navigation/search';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
  return {
    link: getCurrentViewWithFilter(props.filter.get('definition'))
  };
}, function UseFilterButton({link}) {
  return (
    <Button kind='secondary'
            size='sm'
            href={link}>
      Use
    </Button>
  );
});
