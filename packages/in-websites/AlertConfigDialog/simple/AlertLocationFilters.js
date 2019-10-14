import PropTypes from 'prop-types';
import React from 'react';

import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { fieldNames } from 'in-websites/AlertConfigDialog/form/alertDialogFormDefinition';

import locals from './AlertLocationFilters.mless';

export default function AlertLocationFilters({ form }) {
  return (
    form && (
      <div className={locals.container}>
        <div className={locals.wrapper}>
          <div className={locals.filterList}>
            <TagFilterListPresenter tagFilters={form && form.get(fieldNames.tagFilters).value} readonly />
          </div>
        </div>
      </div>
    )
  );
}

AlertLocationFilters.propTypes = {
  form: PropTypes.object.isRequired
};
