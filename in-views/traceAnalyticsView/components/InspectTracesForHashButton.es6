import React from 'react';

import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      href: getTraceViewLinkWithQuery(`span.hash:"default=${props.hash}"`)
    };
  },
  function InspectTracesForHashButton({ href }) {
    return (
      <Button size="sm" kind="info" href={href} className="pull-right">
        Inspect traces
      </Button>
    );
  }
);
