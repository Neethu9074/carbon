import { defaults } from 'lodash';
import React from 'react';

import GenericServiceExtractionConfiguration from 'in-views/configurationView/subview/ServiceExtraction/ServiceExtraction';
import commonHelpTexts from 'in-views/configurationView/subview/ServiceExtraction/configs/serviceExtractionHelpTexts';
import { elasticsearchServiceExtractionConfigurationViewLink$ } from 'in-stores/navigation/configuration';
import { messageBrokerServiceExtractionConfigurationViewLink$ } from 'in-stores/navigation/configuration';
import { batchServiceExtractionConfigurationViewLink$ } from 'in-stores/navigation/configuration';
import { httpServiceExtractionConfigurationViewLink$ } from 'in-stores/navigation/configuration';
import { ejbServiceExtractionConfigurationViewLink$ } from 'in-stores/navigation/configuration';
import { generalServiceExtractionConfigViewPath } from 'in-stores/navigation/configuration';
import Link from 'in-components/Link';

export const ruleType = 'general';

export const pathname = generalServiceExtractionConfigViewPath;

export const helpTexts = defaults(
  {
    viewHelp: (
      <span>
        Configure how Instana uses attributes of underlying components to extract services. You can define multiple
        rules which will be executed in order, i.e. the first rule of which all match expression match, will be used to
        extract a service name. General rules are only applied when more specific rules like{' '}
        <Link href$={httpServiceExtractionConfigurationViewLink$}>HTTP</Link>,{' '}
        <Link href$={batchServiceExtractionConfigurationViewLink$}>Batch</Link>,{' '}
        <Link href$={ejbServiceExtractionConfigurationViewLink$}>EJB</Link>,{' '}
        <Link href$={elasticsearchServiceExtractionConfigurationViewLink$}>Elasticsearch</Link> or{' '}
        <Link href$={messageBrokerServiceExtractionConfigurationViewLink$}>Message Brokers</Link> did not produce a
        service name.
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
        required. Currently supported is matching tags of a host, and labels of docker containers. Host tags are split
        by <code>=</code> or <code>:</code> into a key value pair.
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
    label: 'Docker Label',
    value: 'docker.label'
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
            docker label <code>com.amazonaws.ecs.cluster: prod</code> just provide{' '}
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
            To use the value of the docker label <code>com.amazonaws.ecs.cluster: prod</code> in a service name, use{' '}
            <code>{'{docker.label-com.amazonaws.ecs.cluster}'}</code>. When a regular expression is used to match parts
            of the value, they can be accessed with <code>{'{docker.label-com.amazonaws.ecs.cluster-1}'}</code> (for the
            first match group).
          </span>
        )
      }
    }
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
