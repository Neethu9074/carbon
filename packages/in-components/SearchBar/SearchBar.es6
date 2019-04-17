import React from 'react';

import { togglePresets, presetsVisible$ } from 'in-components/SearchBar/stores/presetsVisibility';
import { unvalidatedQuery$, query$, setQueryInput } from 'in-stores/search/query';
import TimeSelection from 'in-new-components/time/TimeSelection/TimeSelection';
import ErrorIndicator from 'in-components/SearchBar/components/ErrorIndicator';
import FilterPresets from 'in-components/SearchBar/components/FilterPresets';
import SaveDialog from 'in-components/SearchBar/components/SaveDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { setValues } from 'in-components/SearchBar/stores/dialog';
import { evaluateClassNames } from 'in-services/util/classnames';
import { refresh } from 'in-components/SearchBar/stores/filters';
import Input from 'in-components/SearchBar/Input';
import { showHelp } from 'in-stores/navigation';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './SearchBar.less';

const block = 'in-searchbar';

export default connectTo(
  {
    presetsVisible: presetsVisible$,
    query: query$.distinct().startWith('')
  },
  class extends React.Component {
    static displayName = 'SearchBar';

    componentDidMount() {
      refresh();
    }

    render() {
      const { query, presetsVisible, keywordsVisible, withTimeSelection } = this.props;
      const hasContent = query.length > 0;
      const collapseClass = `${block}__expand-collapse-wrapper`;

      return (
        <div>
          {presetsVisible ? <FilterPresets /> : null}

          <div
            className={evaluateClassNames({
              [block]: true,
              [`${block}__with-time-selection`]: withTimeSelection
            })}
          >
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
                className={`${block}__icon`}
                type={presetsVisible ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
                width={20}
                height={20}
              />
            </div>
            <ErrorIndicator />
            {withTimeSelection && <TimeSelection />}
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
    if (!query || !query.query || query.query.length === 0) {
      return null;
    }
    return (
      <div className={`${block}__delete-query-button`} onClick={() => setQueryInput('', query.searchContext)}>
        <SvgIcon type="x" height={10} color="#6b8088" />
      </div>
    );
  }
);
