import {addKeywordOperator} from 'in-sdk/search/registry';
import {fullyQualifiedPlugins} from 'in-forge/constants';


addKeywordOperator({
  context: 'entity',
  type: 'string',
  keyword: 'tag',
  field: 'processor_tags'
});

const searchableEntityTypes = {
  // <type> => [<fully qualified plugin ids>]
};
addKeywordOperator({
  context: 'entity',
  type: 'selection',
  keyword: 'type',
  field: 'plugin_id',
  validate(selection, queryPart) {
    if (this.getSelectableItems().indexOf(selection.toLowerCase()) === -1) {
      return `Unknown entity type ${selection} for key type at row ${queryPart.row}.`;
    }
    return null;
  },
  getSelectableItems() {
    return Object.keys(searchableEntityTypes);
  },
  toValue: translateSearchableEntityTypeToFullyQualifiedPluginIds
});
export function addSearchableEntityType(label, shortPluginId) {
  label = label.toLowerCase();
  const typesForLabel = searchableEntityTypes[label] = searchableEntityTypes[label] || [];
  typesForLabel.push(fullyQualifiedPlugins[shortPluginId]);
}

export function translateSearchableEntityTypeToFullyQualifiedPluginIds(type) {
  return searchableEntityTypes[type.toLowerCase()];
}


const searchableTraceTypes = {
  // <type> => [<full name of trace plugin>]
};
addKeywordOperator({
  context: 'trace',
  type: 'selection',
  keyword: 'type',
  field: 'n',
  validate(selection, queryPart) {
    if (this.getSelectableItems().indexOf(selection.toLowerCase()) === -1) {
      return `Unknown trace type ${selection} for key type at row ${queryPart.row}.`;
    }
    return null;
  },
  getSelectableItems() {
    return Object.keys(searchableTraceTypes);
  },
  toValue(selection) {
    return searchableTraceTypes[selection.toLowerCase()];
  }
});
export function addSearchableTraceType(label, name) {
  label = label.toLowerCase();
  const typesForLabel = searchableTraceTypes[label] = searchableTraceTypes[label] || [];
  typesForLabel.push(name);
}


addKeywordOperator({
  context: 'trace',
  type: 'string',
  keyword: 'startingAt',
  field: 'logical_destination_service_id'
});

addKeywordOperator({
  context: 'trace',
  type: 'string',
  keyword: 'startingAtInstance',
  field: 'destination_service_instance_id'
});

addKeywordOperator({
  context: 'trace',
  type: 'number',
  keyword: 'duration',
  field: 'd'
});

addKeywordOperator({
  context: 'trace',
  type: 'number',
  keyword: 'time',
  field: 'd'
});

addKeywordOperator({
  context: 'trace',
  type: 'number',
  keyword: 'latency',
  field: 'd'
});

addKeywordOperator({
  context: 'trace',
  type: 'number',
  keyword: 'error',
  field: 'total_error_count'
});

addKeywordOperator({
  context: 'trace',
  type: 'number',
  keyword: 'errors',
  field: 'total_error_count'
});

const searchableEventTypes = {
  event: 'issue',
  incident: 'incident'
};
addKeywordOperator({
  context: 'event',
  type: 'selection',
  keyword: 'type',
  field: 'eventtype',
  validate(selection, queryPart) {
    if (this.getSelectableItems().indexOf(selection.toLowerCase()) === -1) {
      return `Unknown event type ${selection} for key type at row ${queryPart.row}.`;
    }
    return null;
  },
  getSelectableItems() {
    return Object.keys(searchableEventTypes);
  },
  toValue(selection) {
    return searchableEventTypes[selection.toLowerCase()];
  }
});
