import React from 'react';

import {filters$, refresh, remove} from 'in-components/SearchBar/stores/filters';
import UseFilterLink from 'in-components/SearchBar/components/UseFilterLink';
import SaveDialog from 'in-components/SearchBar/components/SaveDialog';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import LifecycleObserver from 'in-components/LifecycleObserver';
import {setValues} from 'in-components/SearchBar/stores/dialog';
import {rawQuery$} from 'in-stores/search';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './FilterPresets.less';

const block = 'in-search-presets';

export default connectTo({
  filters: filters$,
  query: rawQuery$
}, function FilterPresets({filters, query}) {
  return (
    <section className={block}>
      <LifecycleObserver onWillMount={refresh} />

      <h1 className={`${block}__heading`}>
        Presets

        <Button kind='info'
                size='sm'
                onClick={() => save(query)}
                className={`${block}__save`}
                disabled={!query}>
          Save current filter as new preset
        </Button>
      </h1>

      <ul className={`${block}__preset-list`}>
        {filters.toArray().map(filter =>
          <li key={filter.get('id')}
              className={`${block}__preset-item`}>
            <UseFilterLink filter={filter} />

            <div className={`${block}__item-actions`}>
              <Button kind='secondary'
                      size='xs'
                      onClick={() => edit(filter)}>
                Edit
              </Button>
              {' '}
              <Button kind='danger'
                      size='xs'
                      onClick={() => remove(filter.get('id'))}>
                Remove
              </Button>
            </div>
          </li>
        )}
      </ul>
    </section>
  );
});


function save(query) {
  setValues('', 'New filter', query);
  setActiveDialog(<SaveDialog />);
}


function edit(filter) {
  setValues(filter.get('id'), filter.get('name'), filter.get('definition'));
  setActiveDialog(<SaveDialog />);
}
