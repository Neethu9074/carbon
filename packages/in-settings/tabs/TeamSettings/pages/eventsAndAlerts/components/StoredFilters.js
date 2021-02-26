/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import locals from './StoredFilters.mless';

export default function StoredFiltersList({ filters, above, onSelect }) {
  return (
    <section
      className={classNames(
        locals.filtersList,
        classNames({
          [locals.posAbove]: above,
          [locals.posBelow]: !above
        })
      )}
    >
      <p className={locals.heading}>{t('in-settings:tabs.savedFilters')}</p>
      <ul className={locals.list}>
        {filters.length > 0 ? (
          filters.map(filter => (
            <li key={filter.get('id')} className={locals.listItem} onClick={() => onSelect(filter.get('definition'))}>
              {filter.get('name')}
            </li>
          ))
        ) : (
          <span className={locals.noFiltersHelpText}>{t('in-settings:tabs.saveFiltersForEasyAccessHere')}</span>
        )}
      </ul>
    </section>
  );
}

StoredFiltersList.propTypes = {
  // Set if popup should appear above or below input field. [default: below]
  above: PropTypes.bool,
  // List of stored filters
  filters: PropTypes.array.isRequired,
  // Function to call when list item is selected
  onSelect: PropTypes.func.isRequired
};
