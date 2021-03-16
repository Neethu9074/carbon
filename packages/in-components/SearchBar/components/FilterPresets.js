/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { filters$, refresh, remove } from 'in-components/SearchBar/stores/filters';
import { togglePresets } from 'in-components/SearchBar/stores/presetsVisibility';
import UserFilterLink from 'in-components/SearchBar/components/UserFilterLink';
import MenuHeading from 'in-components/SearchBar/components/MenuHeading';
import SaveDialog from 'in-components/SearchBar/components/SaveDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import throttleNextFrame from 'in-services/util/throttleNextFrame';
import { setValues } from 'in-components/SearchBar/stores/dialog';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import './FilterPresets.less';

const block = 'in-search-presets';

export default connectTo(
  {
    filters: filters$
  },
  class extends React.Component {
    static displayName = 'FilterPresets';

    componentDidMount() {
      this.onMouseUp = throttleNextFrame(this.onMouseUp);

      // Delay listener registration. If we would do this synchronously,
      // we would receive the click event which opened this dialog and
      // the dialog would be immediately closed.
      setTimeout(() => {
        window.addEventListener('click', this.onMouseUp, false);
        this.registered = true;
      }, 0);

      refresh();
    }

    componentWillUnmount() {
      window.removeEventListener('click', this.onMouseUp, false);
    }

    render() {
      const { filters } = this.props;
      return (
        <section className={block} ref={menu => (this.menu = menu)}>
          <MenuHeading className={`${block}__heading`}>
            {t('in-components:searchBar.filterPresetsMenuHeading')}
          </MenuHeading>
          <ul className={`${block}__preset-list`}>
            {filters.size === 0 ? (
              <span className={`${block}__no-filters-help-text`}>
                {t('in-components:searchBar.filterPresetsSaveFilters')}
              </span>
            ) : null}
            {filters.toArray().map(filter => (
              <li key={filter.get('id')} className={`${block}__preset-item`}>
                <UserFilterLink onClick={togglePresets} filter={filter} />

                <div className={`${block}__item-actions`}>
                  <a
                    href=""
                    onClick={e => {
                      e.preventDefault();
                      edit(filter);
                    }}
                    className={`${block}__edit`}
                  >
                    {t('in-components:searchBar.filterPresetsEditFilter')}
                  </a>
                  <a
                    href=""
                    onClick={e => {
                      e.preventDefault();
                      remove(filter.get('id'), filter.get('name'), filter.get('definition'));
                    }}
                    className={`${block}__remove`}
                  >
                    {t('in-components:searchBar.filterPresetsRemoveFilter')}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      );
    }

    onMouseUp = e => {
      if (!this.menu) {
        return;
      }

      const rect = this.menu.getBoundingClientRect();
      if (e.clientX > rect.right || e.clientX < rect.left || e.clientY < rect.top || e.clientY > rect.bottom) {
        // the click was done outside this component so close it
        togglePresets();
      }
    };
  }
);

function edit(filter) {
  setValues(filter.get('id'), filter.get('name'), filter.get('definition'));
  addActiveDialog(<SaveDialog />);
}
