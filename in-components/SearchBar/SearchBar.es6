import React from 'react';

import { togglePresets, presetsVisible$ } from 'in-components/SearchBar/stores/presetsVisibility';
import { unvalidatedQuery$, query$, setInputString } from 'in-stores/search/query';
import ErrorIndicator from 'in-components/SearchBar/components/ErrorIndicator';
import FilterPresets from 'in-components/SearchBar/components/FilterPresets';
import SaveDialog from 'in-components/SearchBar/components/SaveDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { setValues } from 'in-components/SearchBar/stores/dialog';
import { evaluateClassNames } from 'in-services/util/classnames';
import { refresh } from 'in-components/SearchBar/stores/filters';
import { emitResizeEvent } from 'in-services/browser';
import Input from 'in-components/SearchBar/Input';
import { showHelp } from 'in-stores/navigation';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './SearchBar.less';

const block = 'in-searchbar';

export default connectTo(
  {
    presetsVisible: presetsVisible$,
    query: query$.distinct()
  },
  class extends React.Component {
    static displayName = 'SearchBar';

    componentDidMount() {
      emitResizeEvent();
      refresh();
    }

    render() {
      const { query, presetsVisible, keywordsVisible } = this.props;
      const hasContent = query.length > 0;
      const collapseClass = `${block}__expand-collapse-wrapper`;

      return (
        <div>
          {presetsVisible ? <FilterPresets /> : null}

          <div className={block}>
            <div
              className={evaluateClassNames({
                [`${collapseClass}`]: true,
                [`${collapseClass}--menu-visible`]: keywordsVisible
              })}
              onClick={onShowKeywordHelp}
            >
              ?
            </div>

            <div className={`${block}__input-wrapper`}>
              <Input />
            </div>

            <ClearQueryButton />

            {hasContent ? (
              <div
                className={`${block}__save-button`}
                onClick={e => {
                  e.preventDefault();
                  save(query);
                }}
              >
                Save
              </div>
            ) : null}

            <div
              className={evaluateClassNames({
                [`${block}__filter-menu-button`]: true,
                [`${collapseClass}--menu-visible`]: presetsVisible
              })}
              onClick={togglePresets}
            >
              Filters
              <SvgIcon
                type={presetsVisible ? 'triangle_up' : 'triangle_down'}
                height={5}
                className={`${block}__icon`}
                color="#6b8088"
              />
            </div>
            <ErrorIndicator />
          </div>
        </div>
      );
    }
  }
);

function onShowKeywordHelp(e) {
  e.preventDefault();
  showHelp('usingTheSearchBar');
}

function save(query) {
  setValues('', 'New filter', query);
  setActiveDialog(<SaveDialog />);
}

const ClearQueryButton = connectTo(
  {
    query: unvalidatedQuery$
  },
  function ClearQueryButton({ query }) {
    if (!query || query.length === 0) {
      return null;
    }

    return (
      <div className={`${block}__delete-query-button`} onClick={() => setInputString('')}>
        <SvgIcon type="x" height={10} color="#6b8088" />
      </div>
    );
  }
);
