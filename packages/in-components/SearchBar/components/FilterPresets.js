/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef } from 'react';

import { useObservable } from '@instana/hooks';

import { filters$, refresh, remove } from 'in-components/SearchBar/stores/filters';
import { togglePresets } from 'in-components/SearchBar/stores/presetsVisibility';
import UserFilterLink from 'in-components/SearchBar/components/UserFilterLink';
import MenuHeading from 'in-components/SearchBar/components/MenuHeading';
import SaveDialog from 'in-components/SearchBar/components/SaveDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import throttleNextFrame from 'in-services/util/throttleNextFrame';
import { setValues } from 'in-components/SearchBar/stores/dialog';
import { t } from 'in-i18n';

import './FilterPresets.less';

const block = 'in-search-presets';
const wgtDropdown = 'widget-dropdown-position';

export default function FilterPresets(props) {
  const { manageFiltersDisabled, setFilter } = props;
  const filters = useObservable(filters$, []);
  const menu = useRef();
  const onMouseUp = e => {
    if (!menu.current) {
      return;
    }

    const rect = menu.current.getBoundingClientRect();
    if (e.clientX > rect.right || e.clientX < rect.left || e.clientY < rect.top || e.clientY > rect.bottom) {
      // the click was done outside this component so close it
      togglePresets();
    }
  };
  useEffect(() => {
    const onMouseUpEvent = throttleNextFrame(onMouseUp);

    // Delay listener registration. If we would do this synchronously,
    // we would receive the click event which opened this dialog and
    // the dialog would be immediately closed.
    setTimeout(() => {
      window.addEventListener('click', onMouseUpEvent, false);
    }, 0);

    refresh();

    return () => {
      window.removeEventListener('click', onMouseUpEvent, false);
    };
  }, []);

  return (
    <section className={!manageFiltersDisabled ? block : `${block} ${wgtDropdown}`} ref={menu}>
      <MenuHeading className={`${block}__heading`}>{t('in-components:searchBar.filterPresetsMenuHeading')}</MenuHeading>
      <ul className={`${block}__preset-list`}>
        {filters && filters.size === 0 ? (
          <span className={`${block}__no-filters-help-text`}>
            {t('in-components:searchBar.filterPresetsSaveFilters')}
          </span>
        ) : null}
        {filters &&
          filters.toArray().map(filter => (
            <li key={filter.get('id')} className={`${block}__preset-item`}>
              <UserFilterLink onClick={togglePresets} filter={filter} setFilter={setFilter} />

              {!manageFiltersDisabled && (
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
              )}
            </li>
          ))}
      </ul>
    </section>
  );
}

function edit(filter) {
  setValues(filter.get('id'), filter.get('name'), filter.get('definition'));
  addActiveDialog(<SaveDialog />);
}
