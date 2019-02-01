import { defaults } from 'lodash';
import React from 'react';

import {
  httpServiceExtractionView$,
  batchServiceExtractionView$,
  ejbServiceExtractionView$,
  elasticsearchServiceExtractionView$,
  messageBrokerServiceExtractionView$,
  generalServiceExtractionPath
} from 'in-views/configurationView/navigation/paths';
import GenericServiceExtractionConfiguration from 'in-views/configurationView/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/ServiceExtraction';
import commonHelpTexts from 'in-views/configurationView/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/serviceExtractionHelpTexts';
import Link from 'in-components/Link';

export const ruleType = 'general';

export const pathname = generalServiceExtractionPath;

export const helpTexts = defaults(
  {
    viewHelp: (
      <span>
        Configure how Instana uses attributes of underlying components to extract services. You can define multiple
        rules which will be executed in order, i.e. the first rule of which all match expression match, will be used to
        extract a service name. General rules are only applied when more specific rules like{' '}
        <Link href$={httpServiceExtractionView$}>HTTP</Link>, <Link href$={batchServiceExtractionView$}>Batch</Link>,{' '}
        <Link href$={ejbServiceExtractionView$}>EJB</Link>,{' '}
        <Link href$={elasticsearchServiceExtractionView$}>Elasticsearch</Link> or{' '}
        <Link href$={messageBrokerServiceExtractionView$}>Message Brokers</Link> did not produce a service name.
        <br />
        View our{' '}
        <Link href="https://docs.instana.io/products/application_service_management/#configuration" external>
          documentation
        </Link>{' '}
        for further information.
      </span>
    ),
    matchesHelp: (
      <span>
        Select here which attributes should be used to match and extract a service. At least one match expression is
        required. Currently supported is matching tags of a host, labels of Docker containers, labels and application id
        for Marathon hosted containers and task name and job name for Nomad hosted containers. Host tags are split by{' '}
        <code>=</code> or <code>:</code> into a key value pair.
      </span>
    )
  },
  commonHelpTexts
);

export const matchSpecificationOptionsTree = [
  {
    label: 'Host Tag',
    value: 'host.tag'
  },
  {
    label: 'JVM Name',
    value: 'jvm.name'
  },
  {
    label: 'Docker Label',
    value: 'docker.label'
  },
  {
    label: 'Marathon Application ID',
    value: 'marathon.appId'
  },
  {
    label: 'Marathon Label',
    value: 'marathon.label'
  },
  {
    label: 'Nomad Task Name',
    value: 'nomad.taskName'
  },
  {
    label: 'Nomad Job Name',
    value: 'nomad.jobName'
  }
];

export const matchSpecificationOptions = {
  'host.tag': {
    titleName: 'Host Tag',
    type: 'kv',
    typeArgs: {
      key: {
        placeholder: 'zone for a tag zone=us-east',
        testPlaceholder: '',
        initialValue: '',
        help: (
          <span>
            Host tags are split by <code>=</code> or <code>:</code> into a key value pair. So <code>zone:test</code>{' '}
            would have the key <code>zone</code>. This value needs to be an exact case sensitive match. No wildcards or
            regular expressions allowed.
          </span>
        )
      },
      value: {
        placeholder: '^([^-]+).*$ for a tag zone=us-east to extract us',
        testPlaceholder: '',
        initialValue: '',
        help: (
          <span>
            Host tags are split by <code>=</code> or <code>:</code> into a key value pair. So <code>zone:test</code>{' '}
            would have the value <code>test</code>. To use the value in a service name, use{' '}
            <code>{'{host.tag-zone}'}</code>. When a regular expression is used to match parts of the value, they can be
            accessed with <code>{'{host.tag-zone-1'}</code> (for the first match group).
          </span>
        )
      }
    }
  },
  'jvm.name': {
    titleName: 'JVM Name',
    placeholder: '(.*)',
    testPlaceholder: '',
    initialValue: '(.*)',
    help: (
      <span>
        Define a regular expression to match the JVM name. See https://docs.instana.io/ecosystem/jvm/#configuration,
        section &quot;Configuring the Display Name&quot; for information on how the JVM name is obtained and how the JVM
        name can be customized. Capture groups from matches of this regular expression are available in the service name
        field via the prefix <code>jvm.name</code>, e.g. <code>{'{jvm.name-1}'}</code> references the first capture
        group.
      </span>
    )
  },
  'docker.label': {
    titleName: 'Docker Label',
    type: 'kv',
    typeArgs: {
      key: {
        placeholder: 'Docker label key',
        testPlaceholder: '',
        initialValue: '',
        help: (
          <span>
            This value needs to be an exact case sensitive match. No wildcards or regular expressions allowed. For the
            Docker label <code>com.amazonaws.ecs.cluster: prod</code> just provide{' '}
            <code>com.amazonaws.ecs.cluster</code>.
          </span>
        )
      },
      value: {
        placeholder: 'Docker label value',
        testPlaceholder: '',
        initialValue: '',
        help: (
          <span>
            To use the value of the Docker label <code>com.amazonaws.ecs.cluster: prod</code> in a service name, use{' '}
            <code>{'{docker.label-com.amazonaws.ecs.cluster}'}</code>. When a regular expression is used to match parts
            of the value, they can be accessed with <code>{'{docker.label-com.amazonaws.ecs.cluster-1}'}</code> (for the
            first match group).
          </span>
        )
      }
    }
  },
  'marathon.appId': {
    titleName: 'Marathon Application ID',
    placeholder: '(.*)',
    testPlaceholder: '/',
    initialValue: '(/shop($|/))',
    help: (
      <span>
        Define a regular expression to match Marathon application ids. Capture groups from matches of this regular
        expression are available in the service name field via the prefix <code>maration.appId</code>, e.g.{' '}
        <code>{'{marathon.appId-1}'}</code> references the first capture group.
      </span>
    )
  },
  'marathon.label': {
    titleName: 'Marathon Label',
    type: 'kv',
    typeArgs: {
      key: {
        placeholder: 'Marathon label key',
        testPlaceholder: '',
        initialValue: '',
        help: (
          <span>
            This value needs to be an exact case sensitive match. No wildcards or regular expressions allowed. For the
            Marathon label <code>HAPROXY-GROUP: shop</code> just provide <code>HAPROXY-GROUP</code>.
          </span>
        )
      },
      value: {
        placeholder: 'Marathon label value',
        testPlaceholder: '',
        initialValue: '',
        help: (
          <span>
            To use the value of the Marathon label <code>HAPROXY-GROUP: shop</code> in a service name, use{' '}
            <code>{'{marathon.label-HAPROXY-GROUP}'}</code>. When a regular expression is used to match parts of the
            value, they can be accessed with <code>{'{marathon.label-HAPROXY-GROUP-1}'}</code> (for the first match
            group).
          </span>
        )
      }
    }
  },
  'nomad.taskName': {
    titleName: 'Nomad Task Name',
    placeholder: '(.*)',
    testPlaceholder: 'task-name',
    initialValue: '(.*)',
    help: (
      <span>
        Define a regular expression to match Nomad task name. Capture groups from matches of this regular expression are
        available in the service name field via the prefix <code>nomad.taskName</code>, e.g.{' '}
        <code>{'{nomad.taskName-1}'}</code> references the first capture group.
      </span>
    )
  },
  'nomad.jobName': {
    titleName: 'Nomad Job Name',
    placeholder: '(.*)',
    testPlaceholder: 'job-name',
    initialValue: '(.*)',
    help: (
      <span>
        Define a regular expression to match Nomad job name. Capture groups from matches of this regular expression are
        available in the service name field via the prefix <code>nomad.jobName</code>, e.g.{' '}
        <code>{'{nomad.jobName-1}'}</code> references the first capture group.
      </span>
    )
  }
};

export default function GeneralServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration
      ruleType="general"
      title="General Service Extraction Rules"
      link="generalServiceExtraction"
      helpTexts={helpTexts}
    />
  );
}
