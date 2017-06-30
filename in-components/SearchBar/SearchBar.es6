import React from 'react';

import { togglePresets, presetsVisible$ } from 'in-components/SearchBar/stores/presetsVisibility';
import ErrorIndicator from 'in-components/SearchBar/components/ErrorIndicator';
import FilterPresets from 'in-components/SearchBar/components/FilterPresets';
import { refresh } from 'in-components/SearchBar/stores/filters';
import { evaluateClassNames } from 'in-services/util/classnames';
import { query$, setInputString } from 'in-stores/search/query';
import { emitResizeEvent } from 'in-services/browser';
import Input from 'in-components/SearchBar/Input';
import { showHelp } from 'in-stores/navigation';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './SearchBar.less';

const block = 'in-searchbar';

export default connectTo(
  {
    hasContent: query$.map(query => query.length > 0).distinct(),
    presetsVisible: presetsVisible$
  },
  class extends React.Component {
    static displayName = 'SearchBar';

    componentDidMount() {
      emitResizeEvent();
      refresh();
    }

    render() {
      const { presetsVisible, keywordsVisible, hasContent } = this.props;
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

            {hasContent
              ? <div className={`${collapseClass}`} onClick={() => setInputString('')}>
                  <SvgIcon type="x" height={10} className={`${block}__icon`} />
                </div>
              : null}

            <div
              className={evaluateClassNames({
                [`${collapseClass}`]: true,
                [`${collapseClass}--menu-visible`]: presetsVisible
              })}
              onClick={togglePresets}
            >
              <SvgIcon type="menu" height={10} className={`${block}__icon`} />
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
