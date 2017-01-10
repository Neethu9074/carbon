import React from 'react';

import {filters$, refresh, saveNewRule} from 'in-components/SearchBar/stores/filters';
import LifecycleObserver from 'in-components/LifecycleObserver';
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
        Filter
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
          </li>
        )}
      </ul>
    </section>
  );
});


function save() {
  saveNewRule('my rule', 'foo:bar');
}
