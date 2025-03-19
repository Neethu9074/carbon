/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DeprecationsPresenter from 'in-websites/WebsiteDashboard/components/Deprecations/DeprecationsPresenter';

export default {
  component: DeprecationsPresenter
};

export function Default(props) {
  return (
    <DeprecationsPresenter
      websiteId="790jk_3dsaikhu90321"
      tagFilters={[]}
      result={{
        data: [
          props['Cross Region Forwarding Deprecation?'] && 'xrf',
          props['Edmunds Hack Deprecation?'] && 'eh',
          props['Unknown Deprecation?'] && 'unsupported!'
        ]
      }}
    />
  );
}
Default.args = {
  'Cross Region Forwarding Deprecation?': true,
  'Edmunds Hack Deprecation?': true,
  'Unknown Deprecation?': true
};
