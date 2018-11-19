import React from 'react';

import TabHeader from 'in-new-components/LocationAwareTabView/tabs/TabHeader';
import { number } from 'in-services/formatters/number';
import connect from 'in-hoc/connectTo';

export default function getTabHeaderWithCount({ icon = null, getCount$, formatter = number.compact }) {
  return connect(props => {
    return {
      count: getCount$(props)
    };
  })(props => <TabHeader {...props} icon={icon} count={props.count != null ? formatter(props.count) : null} />);
}
