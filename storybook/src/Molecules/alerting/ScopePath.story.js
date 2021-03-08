/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ScopePath from 'in-alerting/components/ScopePath';

export default {
  title: 'Molecules|alerting/ScopePath',
  component: ScopePath
};

export const scopePaths = () => (
  <div>
    <ScopePath
      entries={[
        {
          iconType: 'lib_application',
          label: 'Application'
        }
      ]}
    />
    <ScopePath
      entries={[
        {
          iconType: 'lib_application',
          label: 'Application'
        },
        {
          iconType: 'lib_application_service',
          label: 'Service'
        }
      ]}
    />
    <ScopePath
      entries={[
        {
          iconType: 'lib_application',
          label: 'Application'
        },
        {
          iconType: 'lib_application_service',
          label: 'Service'
        },
        {
          iconType: 'lib_application_endpoint',
          label: 'Endpoint'
        }
      ]}
    />
    <ScopePath
      entries={[
        {
          iconType: 'lib_website',
          label: 'No Bottom Margin'
        }
      ]}
      noBottomMargin
    />
    <ScopePath
      entries={[
        {
          iconType: 'lib_website',
          label: 'Website With XS icons'
        }
      ]}
      iconSize="xs"
    />
    <ScopePath
      entries={[
        {
          iconType: 'lib_application',
          label: 'Linked',
          href: '#'
        }
      ]}
    />
  </div>
);
