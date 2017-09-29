import { defaults } from 'lodash';
import React from 'react';

import GenericServiceExtractionConfiguration from 'in-views/configurationView/subview/ServiceExtraction/ServiceExtraction';
import commonHelpTexts from 'in-views/configurationView/subview/ServiceExtraction/configs/serviceExtractionHelpTexts';
import {
  matchSpecificationOptions as generalMatchSpecificationOptions,
  matchSpecificationOptionsTree as generalMatchSpecificationOptionsTree
} from 'in-views/configurationView/subview/ServiceExtraction/configs/GeneralServiceExtractionConfiguration';
import { generalServiceExtractionConfigurationViewLink$ } from 'in-stores/navigation/configuration';
import { ejbServiceExtractionConfigViewPath } from 'in-stores/navigation/configuration';
import Link from 'in-components/Link';

export const ruleType = 'ejb';

export const pathname = ejbServiceExtractionConfigViewPath;

export const helpTexts = defaults(
  {
    viewHelp: (
      <span>
        Configure how Instana uses EJB attributes to extract services. You can define multiple rules which will be
        executed in order, i.e. the first rule of which all match expression match, will be used to extract a service
        name. Should no rule match, the defaults from the{' '}
        <Link href$={generalServiceExtractionConfigurationViewLink$}>General config</Link> apply. Should these not match
        as well, a default service name using the bean name is used.
      </span>
    ),
    matchesHelp:
      'Select here which EJB attributes should be used to match and extract a service. At least one match ' +
      'expression is required. EJB attributes such as Module and Bean name can be matched ' +
      "to extract services. When all of the configured match expressions match an EJB's attributes, a " +
      'service will be extracted.'
  },
  commonHelpTexts
);

export const matchSpecificationOptionsTree = [
  {
    label: 'Module',
    value: 'module'
  },
  {
    label: 'App',
    value: 'app'
  },
  {
    label: 'Bean',
    value: 'bean'
  }
].concat(generalMatchSpecificationOptionsTree);

export const matchSpecificationOptions = defaults(
  {
    module: {
      titleName: 'Module',
      placeholder: '',
      testPlaceholder: '',
      initialValue: '',
      help: (
        <span>
          Define a regular expression to modules. Capture groups from matches of this regular expression are available
          in the service name field via the prefix <code>module</code>, e.g. <code>{'{module-1}'}</code> references the
          first capture group.
        </span>
      )
    },

    app: {
      titleName: 'App',
      placeholder: '',
      testPlaceholder: '',
      initialValue: '',
      help: (
        <span>
          Define a regular expression to match application names. Capture groups from matches of this regular {' '}
          expression are available in the service name field via the prefix <code>app</code>, e.g. {' '}
          <code>{'{app-1}'}</code> references the first capture group.
        </span>
      )
    },

    bean: {
      titleName: 'Bean',
      placeholder: '',
      testPlaceholder: '',
      initialValue: '',
      help: (
        <span>
          Define a regular expression to match beans. Capture groups from matches of this regular expression are
          available in the service name field via the prefix <code>bean</code>, e.g. <code>{'{bean-1}'}</code>{' '}
          references the first capture group.
        </span>
      )
    }
  },
  generalMatchSpecificationOptions
);

export default function EjbServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration
      ruleType="ejb"
      link="ejbServiceExtraction"
      title="EJB Service Extraction Rules"
      helpTexts={helpTexts}
    />
  );
}
