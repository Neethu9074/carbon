/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { TagCatalog } from 'in-types';

export const someCommonTags: TagCatalog = {
  tagTree: [
    {
      label: 'Commonly Used',
      description: undefined,
      icon: undefined,
      children: [
        {
          label: 'Website Label',
          description: 'Name of the website as configured within the Instana user interface.',
          tagName: 'beacon.website.name',
          type: 'TAG'
        },
        {
          label: 'Page Name',
          description: "The name of the page as defined via our JavaScript agent's page API.",
          tagName: 'beacon.page.name',
          type: 'TAG'
        },
        {
          label: 'Browser Name',
          description: 'Normalized browser name as inferred from the User-Agent string.',
          tagName: 'beacon.browser.name',
          type: 'TAG'
        },
        {
          label: 'Country',
          tagName: 'beacon.geo.country',
          type: 'TAG'
        },
        {
          label: 'Meta',
          description: "Custom meta data as defined via our JavaScript agent's meta API.",
          tagName: 'beacon.meta',
          type: 'TAG'
        },
        {
          label: 'Document Location URL',
          description: 'The fully qualified URL of the HTML document as seen in the browser address bar.',
          tagName: 'beacon.location.url',
          type: 'TAG'
        }
      ],
      type: 'LEVEL',
      queryable: false
    },
    {
      label: 'Commonly Used',
      description: undefined,
      icon: undefined,
      children: [
        {
          label: 'Pod label',
          description: 'Custom meta data.',
          tagName: 'kubernetes.pod.label',
          type: 'TAG'
        }
      ],
      type: 'LEVEL',
      queryable: false
    },
    {
      label: 'Platform',
      description: undefined,
      icon: undefined,
      children: [
        {
          label: 'OpenShift',
          description: undefined,
          icon: undefined,
          children: [
            {
              label: 'Deployment Config Label',
              description: 'Deployment Config Label. bla. bla.',
              tagName: 'openshift.deploymentconfig.label',
              type: 'TAG'
            }
          ],
          type: 'LEVEL',
          queryable: false
        }
      ],
      type: 'LEVEL',
      queryable: false
    },
    {
      label: 'Location',
      description: undefined,
      icon: undefined,
      children: [
        {
          label: 'URL',
          description: 'The fully qualified URL of the HTML document as seen in the browser address bar.',
          tagName: 'beacon.location.url',
          type: 'TAG'
        },
        {
          label: 'Page Name',
          description: "The name of the page as defined via our JavaScript agent's page API.",
          tagName: 'beacon.page.name',
          type: 'TAG'
        }
      ],
      type: 'LEVEL',
      queryable: false
    },
    {
      label: 'User',
      description: undefined,
      icon: undefined,
      children: [
        {
          label: 'Language',
          description: 'The end-users understood languages as configured within her web browser.',
          tagName: 'beacon.user.language',
          type: 'TAG'
        },
        {
          label: 'Browser',
          description: undefined,
          icon: undefined,
          children: [
            {
              label: 'Name',
              description: 'Normalized browser name as inferred from the User-Agent string.',
              tagName: 'beacon.browser.name',
              type: 'TAG'
            },
            {
              label: 'Version',
              description: 'Major version of the browser as inferred from the User-Agent string.',
              tagName: 'beacon.browser.version',
              type: 'TAG'
            }
          ],
          type: 'LEVEL',
          queryable: false
        }
      ],
      type: 'LEVEL',
      queryable: false
    },
    {
      label: 'Data Collection',
      description: undefined,
      icon: undefined,
      children: [
        {
          label: 'Meta',
          description: "Custom meta data as defined via our JavaScript agent's meta API.",
          tagName: 'beacon.meta',
          type: 'TAG'
        }
      ],
      type: 'LEVEL',
      queryable: false
    }
  ],
  tags: [
    {
      name: 'beacon.user.language',
      label: 'Language',
      type: 'STRING',
      description: 'The end-users understood languages as configured within her web browser.',
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'beacon.location.url',
      label: 'URL',
      type: 'STRING',
      description: 'The fully qualified URL of the HTML document as seen in the browser address bar.',
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'beacon.page.name',
      label: 'Page Name',
      type: 'STRING',
      description: "The name of the page as defined via our JavaScript agent's page API.",
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'beacon.browser.name',
      label: 'Name',
      type: 'STRING',
      description: 'Normalized browser name as inferred from the User-Agent string.',
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'beacon.browser.version',
      label: 'Version',
      type: 'STRING',
      description: 'Major version of the browser as inferred from the User-Agent string.',
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'beacon.geo.city',
      label: 'City',
      type: 'STRING',
      description: undefined,
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'beacon.geo.country',
      label: 'Country',
      type: 'STRING',
      description: undefined,
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'beacon.location.origin',
      label: 'Origin',
      type: 'STRING',
      description: 'The origin of the HTML document, i.e., the combination of scheme, host and (optionally) port.',
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'beacon.location.path',
      label: 'Path',
      type: 'STRING',
      description: 'The path of the HTML document.',
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'beacon.meta',
      label: 'Meta',
      type: 'KEY_VALUE_PAIR',
      description: "Custom meta data as defined via our JavaScript agent's meta API.",
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'kubernetes.pod.label',
      label: 'Pod label',
      type: 'KEY_VALUE_PAIR',
      description: 'Custom pod label.',
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'beacon.website.name',
      label: 'Name',
      type: 'STRING',
      description: 'Name of the website as configured within the Instana user interface.',
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'openshift.deploymentconfig.label',
      label: 'Deployment Config Label',
      type: 'KEY_VALUE_PAIR',
      description: 'Deployment Config Label. bla. bla.',
      canApplyToSource: false,
      canApplyToDestination: false
    }
  ]
};
