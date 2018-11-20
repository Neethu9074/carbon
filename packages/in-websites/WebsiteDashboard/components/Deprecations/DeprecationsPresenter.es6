import React from 'react';

import CrossRegionForwarding from 'in-websites/WebsiteDashboard/components/Deprecations/deprecations/CrossRegionForwarding';
import CustomPages from 'in-websites/WebsiteDashboard/components/Deprecations/deprecations/CustomPages';

import locals from './DeprecationsPresenter.mless';

const presenterMapping = {
  xrf: CrossRegionForwarding,
  eh: CustomPages
};

export default function DeprecationsPresenter(props) {
  const { result } = props;
  if (!result || !result.data) {
    return null;
  }

  return (
    <ul className={locals.deprecations}>
      {result.data
        .map(code => {
          const Component = presenterMapping[code];
          if (Component) {
            return (
              <li key={code} className={locals.deprecation}>
                <Component {...props} />
              </li>
            );
          }
          return null;
        })
        .filter(Boolean)}
    </ul>
  );
}
