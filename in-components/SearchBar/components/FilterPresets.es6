import React from 'react';

import { filters$, refresh, remove } from 'in-components/SearchBar/stores/filters';
import { togglePresets } from 'in-components/SearchBar/stores/presetsVisibility';
import UserFilterLink from 'in-components/SearchBar/components/UserFilterLink';
import MenuHeading from 'in-components/SearchBar/components/MenuHeading';
import SaveDialog from 'in-components/SearchBar/components/SaveDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import throttleNextFrame from 'in-services/util/throttleNextFrame';
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
    }

    componentWillUnmount() {
      window.removeEventListener('click', this.onMouseUp, false);
    }

    render() {
      const { filters, query } = this.props;

      return (
        <section className={block} ref={menu => (this.menu = menu)}>
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

function save(query) {
  setValues('', 'New filter', query);
  setActiveDialog(<SaveDialog />);
}

function edit(filter) {
  setValues(filter.get('id'), filter.get('name'), filter.get('definition'));
  setActiveDialog(<SaveDialog />);
}
