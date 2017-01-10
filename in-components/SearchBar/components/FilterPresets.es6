import React from 'react';

import {filters$, refresh, remove} from 'in-components/SearchBar/stores/filters';
import UseFilterButton from 'in-components/SearchBar/components/UseFilterButton';
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
  filters: filters$
}, function FilterPresets({filters}) {
  return (
    <section className={block}>
      <LifecycleObserver onWillMount={refresh} />

      <h1 className={`${block}__heading`}>
        Presets
      </h1>

      <Button kind='secondary'
              size='sm'
              onClick={save}>
        Save current filter as new preset
      </Button>

      <ul>
        {filters.toArray().map(filter =>
          <li key={filter.get('id')}>
            {filter.get('name')}

            <Button kind='secondary'
                    size='sm'
                    onClick={() => edit(filter)}>
              Edit
            </Button>

            <Button kind='danger'
                    size='sm'
                    onClick={() => remove(filter.get('id'))}>
              Remove
            </Button>

            <UseFilterButton filter={filter} />
          </li>
        )}
      </ul>
    </section>
  );
});


function save() {
  rawQuery$.once(rawQuery => {
    setValues('', 'New filter', rawQuery);
    setActiveDialog(<SaveDialog />);
  });
}


function edit(filter) {
  setValues(filter.get('id'), filter.get('name'), filter.get('definition'));
  setActiveDialog(<SaveDialog />);
}
