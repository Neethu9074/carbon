import { withState, compose } from 'recompose';
import React from 'react';

import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { containsIgnoreCase } from 'in-services/util/string';
import { getTagFromList } from 'in-applications/tags';
import Input from 'in-components/form/Input/Input';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import connect from 'in-hoc/connectTo';

import locals from './ApplicationServiceEndpointSuggestions.mless';

export default compose(
  withState('value', 'setValue', ''),
  connect(({ filters, tagName }) => ({
    tagValueSuggestions: getTagSuggestions({
      filter: {
        timeConfig: filters.get('timeConfig')
      },
      tagFilters: getTagFilterList(tagName, filters),
      tagName,
      secondLevelKeyTagName: null,
      requestingSecondaryKeySuggestions: false,
      valueFilter: null
    })
      .startWith(null)
      .map(getEndpointTypesComboBoxItems)
  }))
)(ApplicationServiceEndpointSuggestions);

function ApplicationServiceEndpointSuggestions({ icon, value, setValue, tagValueSuggestions, onValueClick }) {
  if (tagValueSuggestions) {
    tagValueSuggestions = tagValueSuggestions.filter(suggestion => containsIgnoreCase(suggestion, value));
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (value) {
          onValueClick(value);
        }
      }}
    >
      <div className={locals.wrapper}>
        <div className={locals.searchRow}>
          <Input
            className={locals.loadingSelectPlaceholderInput}
            type="text"
            id="value"
            autoComplete="off"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          <Button className={locals.saveButton} onClick={() => onValueClick(value)} disabled={!value}>
            Save
          </Button>
        </div>
        {!tagValueSuggestions && (
          <SvgIcon className={locals.loadingIcon} type="lib_actions_loading" spinning width={36} height={36} />
        )}
        {tagValueSuggestions &&
          tagValueSuggestions.length === 0 && <span className={locals.noSuggestionsLabel}>No suggestions found</span>}
        {tagValueSuggestions &&
          tagValueSuggestions.length > 0 && (
            <ul className={locals.suggestionList}>
              {tagValueSuggestions.map(suggestion => (
                <li key={suggestion} className={locals.suggestion} onClick={() => onValueClick(suggestion)}>
                  <SvgIcon className={locals.entityIcon} type={icon} width={24} height={24} />
                  <span className={locals.itemText}>{suggestion}</span>
                </li>
              ))}
            </ul>
          )}
      </div>
    </form>
  );
}

function getEndpointTypesComboBoxItems(autoCompletedValuesResult) {
  if (!autoCompletedValuesResult || !autoCompletedValuesResult.data) {
    return null;
  }

  if (autoCompletedValuesResult.errors.length > 0) {
    return [];
  }

  return autoCompletedValuesResult.data.suggestions;
}

function getTagFilterList(tagName, filters) {
  const tagFilters = [];

  const tagFilter = filters.get('tagFilter').toJS();

  let application = getTagFromList(APPLICATION.name, tagFilter);
  let service = getTagFromList(SERVICE.name, tagFilter);
  let endpoint = getTagFromList(ENDPOINT.name, tagFilter);

  const isApplicationTag = tagName !== APPLICATION.name;
  const isServiceTag = tagName !== SERVICE.name;
  const isEndpointTag = tagName !== ENDPOINT.name;

  if (application && isApplicationTag) {
    tagFilters.push({ name: APPLICATION.technicalName, stringValue: application.value });
  }
  if (service && (isApplicationTag && isServiceTag)) {
    tagFilters.push({ name: SERVICE.technicalName, stringValue: service.value });
  }
  if (endpoint && (isApplicationTag && isServiceTag && isEndpointTag)) {
    tagFilters.push({ name: ENDPOINT.technicalName, stringValue: endpoint.value });
  }

  return tagFilters;
}
