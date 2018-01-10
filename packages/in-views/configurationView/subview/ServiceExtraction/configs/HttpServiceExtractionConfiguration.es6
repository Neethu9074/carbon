import { defaults } from 'lodash';
import React from 'react';

import {
  matchSpecificationOptions as generalMatchSpecificationOptions,
  matchSpecificationOptionsTree as generalMatchSpecificationOptionsTree
} from 'in-views/configurationView/subview/ServiceExtraction/configs/GeneralServiceExtractionConfiguration';
import GenericServiceExtractionConfiguration from 'in-views/configurationView/subview/ServiceExtraction/ServiceExtraction';
import commonHelpTexts from 'in-views/configurationView/subview/ServiceExtraction/configs/serviceExtractionHelpTexts';
import { httpServiceExtractionPath, generalServiceExtractionView$ } from 'in-stores/navigation/paths/settingPaths';
import Link from 'in-components/Link';

export const ruleType = 'webapp';

export const pathname = httpServiceExtractionPath;

export const helpTexts = defaults(
  {
    viewHelp: (
      <span>
        Configure how Instana uses HTTP request attributes to extract services. You can define multiple rules which will
        be executed in order, i.e. the first rule of which all match expression match, will be used to extract a service
        name. Should no rule match, the defaults from the{' '}
        <Link href$={generalServiceExtractionView$}>General config</Link> apply. Should these not match as well, a
        default service name consisting of the first URL segment is used.
        <br />
        View our{' '}
        <Link href="https://docs.instana.io/products/application_service_management/#configuration" external>
          documentation
        </Link>{' '}
        for further information.
      </span>
    ),

    matchesHelp:
      'Select here which HTTP request attributes should be used to match and extract a service. At least one match ' +
      'expression is required. HTTP request attributes such as HTTP host headers and request paths can be matched ' +
      "to extract services. When all of the configured match expressions match an HTTP request's attributes, a " +
      'service will be extracted.',

    serviceNameHelp: (
      <span>
        Give this service a name. This service name will be used throughout Instana. You can reference capture groups{' '}
        extracted from the match expressions to dynamically build a service name. Additionally, Docker labels, host tags
        and headers that were captured due to manual configuration can be used. The following example shows how to use
        the <code>com.amazonaws.ecs.cluster</code> Docker label:{' '}
        <code>{'{docker.label-com.amazonaws.ecs.cluster}'}</code>. The following example shows how to use the{' '}
        <code>zone</code> host tag: <code>{'{host.tag-zone}'}</code>. The following example shows how to use the{' '}
        <code>x-region</code> custom header: <code>{'{header-x-region}'}</code>.
      </span>
    ),
    serviceEndpointNameHelp: (
      <span>
        Give this endpoint a name. This endpoint name will be used throughout Instana. You can reference capture groups{' '}
        extracted from the match expressions to dynamically build an endpoint name. Additionally, Docker labels, host
        tags and headers that were captured due to manual configuration can be used. The following example shows how to
        use the <code>com.amazonaws.ecs.cluster</code> Docker label:{' '}
        <code>{'{docker.label-com.amazonaws.ecs.cluster}'}</code>. The following example shows how to use the{' '}
        <code>zone</code> host tag: <code>{'{host.tag-zone}'}</code>. The following example shows how to use the{' '}
        <code>x-region</code> custom header: <code>{'{header-x-region}'}</code>.
      </span>
    )
  },
  commonHelpTexts
);

export const matchSpecificationOptions = defaults(
  {
    path: {
      titleName: 'Request Path',
      placeholder: '(.*)',
      testPlaceholder: '/',
      initialValue: '(/shop($|/))',
      help: (
        <span>
          Define a regular expression to match requests paths. Capture groups from matches of this regular expression
          are available in the service name field via the prefix <code>path</code>, e.g. <code>{'{path-1}'}</code>{' '}
          references the first capture group.
        </span>
      )
    },

    host: {
      titleName: 'Host',
      placeholder: '(.*)',
      testPlaceholder: 'example.com',
      initialValue: '(.*)',
      help: (
        <span>
          Define a regular expression to match HTTP host headers. Capture groups from matches of this regular expression
          are available in the service name field via the prefix <code>host</code>, e.g. <code>{'{host-1}'}</code>{' '}
          references the first capture group.
        </span>
      )
    },

    method: {
      titleName: 'Request Method',
      placeholder: 'GET',
      testPlaceholder: 'GET',
      initialValue: '(.*)',
      help: (
        <span>
          Define a regular expression to match HTTP request methods. Capture groups from matches of this regular{' '}
          expression are available in the service name field via the prefix <code>method</code>, e.g.{' '}
          <code>{'{method-1}'}</code> references the first capture group.
        </span>
      )
    },

    params: {
      titleName: 'Query Parameters',
      placeholder: '',
      testPlaceholder: 'user=123&foo=bar',
      initialValue: '',
      help: (
        <span>
          Define a regular expression to match HTTP query parameters. Capture groups from matches of this regular{' '}
          expression are available in the service name field via the prefix <code>params</code>, e.g.{' '}
          <code>{'{params-1}'}</code> references the first capture group. Query parameters are captured in the form{' '}
          <code>key=value&otherKey=otherValue</code>
        </span>
      )
    },

    status: {
      titleName: 'Status Code',
      placeholder: '',
      testPlaceholder: '',
      initialValue: '',
      help: (
        <span>
          Define a regular expression to match HTTP status codes. Capture groups from matches of this regular expression
          are available in the service name field via the prefix <code>status</code>, e.g. <code>{'{status-1}'}</code>{' '}
          references the first capture group.
        </span>
      )
    }
  },
  generalMatchSpecificationOptions
);

export const matchSpecificationOptionsTree = [
  {
    label: 'Request Path',
    value: 'path'
  },
  {
    label: 'Query Parameters',
    value: 'params'
  },
  {
    label: 'Host',
    value: 'host'
  },
  {
    label: 'Request Method',
    value: 'method'
  },
  {
    label: 'Status Code',
    value: 'status'
  }
].concat(generalMatchSpecificationOptionsTree);

export default function HttpServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration
      ruleType="webapp"
      link="httpServiceExtraction"
      title="HTTP Service Extraction Rules"
      helpTexts={helpTexts}
    />
  );
}
