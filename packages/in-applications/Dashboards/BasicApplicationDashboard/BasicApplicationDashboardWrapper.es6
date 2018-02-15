import React from 'react';

import TabView from 'in-applications/TabView/TabView';
import { timeframe$ } from 'in-stores/timeline';

export default function BasicApplicationDashboard(props) {
  const { get, location } = props;
  return (
    <TabView
      {...props}
      get={() =>
        timeframe$.flatMap(timeframe =>
          get({
            timeframe,
            location
          })
        )
      }
    />
  );
}
