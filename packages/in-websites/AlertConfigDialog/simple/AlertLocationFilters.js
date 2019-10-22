import PropTypes from 'prop-types';
import React from 'react';

import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { fieldNames } from 'in-websites/AlertConfigDialog/form/alertDialogFormDefinition';
import HelpText from 'in-components/form/HelpText/HelpText';

import locals from './AlertLocationFilters.mless';

export default function AlertLocationFilters({ form, websiteLabel }) {
  return (
    form && (
      <div className={locals.container}>
        <div className={locals.wrapper}>
          <div className={locals.filterList}>
            <TagFilterListPresenter
              tagFilters={[
                {
                  name: 'beacon.website.name',
                  operator: 'EQUALS',
                  stringValue: websiteLabel
                },
                ...form.get(fieldNames.tagFilters).value
              ]}
              readonly
            />
            <div className={locals.disableHover} />
          </div>
        </div>
        {/* TODO: HelpText is only for first, minimal, scope of this feature and needs to be removed in next iteration */}
        <HelpText>
          For new alerts you can set the filters using the filter bar on the website dashboard.
          <br />
          Filters cannot be changed afterwards.
        </HelpText>
      </div>
    )
  );
}

AlertLocationFilters.propTypes = {
  form: PropTypes.object.isRequired,
  websiteLabel: PropTypes.string.isRequired
};
