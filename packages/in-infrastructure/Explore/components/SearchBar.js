import React from 'react';

import { infraExplorePath } from 'in-infrastructure/navigation/paths';
import SearchInput from 'in-new-components/SearchInput/SearchInput';
import withUrlState from 'in-hoc/withUrlState';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }
  componentDidMount() {
    let tagFilters = parseQuery(this.props.query);
    this.props.onFiltersChanged(tagFilters);
  }
  render() {
    return (
      <SearchInput
        placeholder="Search for entities. Examples: kubernetes.namespace=instana-agent for exact match // kubernetes.namespace~insta for partial match // k8s.ns=default with aliases"
        query={this.props.query}
        autoFocus
        onChange={searchText => {
          this.props.setUrlQuery({ query: searchText });
          onSearch(searchText, this.props.onFiltersChanged, hasError => this.setState({ hasError }));
        }}
        hasError={this.state.hasError} //todo: make this true when the search   .
      />
    );
  }
}

export default withUrlState({
  bind: [
    {
      path: infraExplorePath,
      name: 'search.query',
      as: 'query',
      initialState: ''
    }
  ],
  reducerName: 'setUrlQuery'
})(SearchBar);

let previousSearch = undefined;

function onSearch(searchText, onFiltersChanged, setHasError) {
  if (previousSearch) {
    clearTimeout(previousSearch);
  }
  previousSearch = setTimeout(() => {
    let tagFilters = parseQuery(searchText);
    if (tagFilters) {
      onFiltersChanged(tagFilters);
      setHasError(false);
    } else {
      setHasError(true);
    }
  }, 1000);
}

function parseQuery(searchText) {
  if (searchText === '') {
    return [];
  }

  let tagFilters = searchText
    .trim()
    .split(' ')
    .map(term => term.trim())
    .filter(term => term !== '')
    .map(term => termToTagFilter(term));

  if (tagFilters.some(filter => filter == null)) {
    return null;
  }
  return tagFilters;
}

function termToTagFilter(term) {
  if (term.includes('=')) {
    return exactMatchTagFilter(term);
  } else if (term.includes('~')) {
    return containsTagFilter(term);
  } else return keylessTagFilter(term);
}

function exactMatchTagFilter(term) {
  return keyValueTagFilter(term, '=');
}

function containsTagFilter(term) {
  return keyValueTagFilter(term, '~');
}

function keyValueTagFilter(term, splitter) {
  let [tagKey, tagValue, ...rest] = term.split(splitter);
  if (rest.length == 0 && tagValueIsValid(tagValue, splitter)) {
    let prefixedKey = tagKey.startsWith('entity.') ? tagKey : `entity.${tagKey}`;
    return {
      key: replaceAliases(prefixedKey),
      operator: splitter === '=' ? 'EQUALS' : 'CONTAINS',
      value: tagValue
    };
  } else return null;
}

function keylessTagFilter(term) {
  if (tagValueIsValid(term)) {
    return {
      operator: 'CONTAINS',
      value: term
    };
  }
  return null;
}

function tagValueIsValid(tagValue, operator = '~') {
  //values less than 3 characters in length cause ES error in backend
  return operator === '~' ? tagValue.length >= 3 : true;
}

const tagKeyAliases = {
  k8s: 'kubernetes',
  ns: 'namespace',
  type: 'pluginId'
};

function replaceAliases(tagKey) {
  Object.entries(tagKeyAliases).forEach(([alias, fullForm]) => {
    tagKey = tagKey.replace(alias, fullForm);
  });
  return tagKey;
}
