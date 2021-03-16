/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createGroupingConfigurator } from 'in-new-components/GroupingConfigurator';
import { successObservableFactory } from 'in-services/util/result';
import { getTagCatalog } from 'in-logging/api/catalog';

const suggestions = ['k8s-demo-cluster', 'sb-test-cluster', 'kube-node-lease', 'kube-public'];

const {
  GroupingConfigurator,
  isGroupingConfigurationValid: isGroupingConfigurationValidInternal
} = createGroupingConfigurator({
  getTagCatalog,
  getSuggestions: successObservableFactory({ suggestions, totalHits: suggestions.length + 10 })
});

export default GroupingConfigurator;

export const isGroupingConfigurationValid = isGroupingConfigurationValidInternal;
