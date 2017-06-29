import React from 'react';

import { filters$, refresh, remove } from 'in-components/SearchBar/stores/filters';
import { togglePresets } from 'in-components/SearchBar/stores/presetsVisibility';
import UseFilterLink from 'in-components/SearchBar/components/UseFilterLink';
import MenuHeading from 'in-components/SearchBar/components/MenuHeading';
import SaveDialog from 'in-components/SearchBar/components/SaveDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { setValues } from 'in-components/SearchBar/stores/dialog';
import LifecycleObserver from 'in-components/LifecycleObserver';
import { query$ } from 'in-stores/search/query';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './FilterPresets.less';

const block = 'in-search-presets';

export default connectTo(
  {
    filters: filters$,
    query: query$
  },
  function FilterPresets({ filters, query }) {
    return (
      <section className={block}>
        <LifecycleObserver onWillMount={refresh} />

        <MenuHeading className={`${block}__heading`}>
          Filter

          {query
            ? <a
                href=""
                onClick={e => {
                  e.preventDefault();
                  save(query);
                }}
                className={`${block}__save`}
              >
                <SvgIcon type="plus" className={`${block}__save-icon`} width={12} />
                {' Save current filter as new preset'}
              </a>
            : <span className={`${block}__save ${block}__save--disabled`}>
                <SvgIcon type="plus" className={`${block}__save-icon`} width={12} />
                {' Save current filter as new preset'}
              </span>}
        </MenuHeading>

        <ul className={`${block}__preset-list`}>
          {filters.toArray().map(filter =>
            <li key={filter.get('id')} className={`${block}__preset-item`}>
              <UseFilterLink onClick={togglePresets} filter={filter} />

              <div className={`${block}__item-actions`}>
                <a
                  href=""
                  onClick={e => {
                    e.preventDefault();
                    edit(filter);
                  }}
                  className={`${block}__edit`}
                >
                  Edit
                </a>
                <a
                  href=""
                  onClick={e => {
                    e.preventDefault();
                    remove(filter.get('id'), filter.get('name'));
                  }}
                  className={`${block}__remove`}
                >
                  Remove
                </a>
              </div>
            </li>
          )}
        </ul>
      </section>
    );
  }
);

function save(query) {
  setValues('', 'New filter', query);
  setActiveDialog(<SaveDialog />);
}

function edit(filter) {
  setValues(filter.get('id'), filter.get('name'), filter.get('definition'));
  setActiveDialog(<SaveDialog />);
}
