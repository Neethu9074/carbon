/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import { debounce } from 'lodash';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { togglePresets, presetsVisible$ } from 'in-components/SearchBar/stores/presetsVisibility';
import ErrorIndicator from 'in-components/SearchBar/components/ErrorIndicator';
import FilterPresets from 'in-components/SearchBar/components/FilterPresets';
import { ClearQueryButton } from 'in-components/SearchBar/SearchBar';
import { refresh } from 'in-components/SearchBar/stores/filters';
import { setQueryInput } from 'in-stores/search/query';
import { trim } from 'in-components/SearchBar/Input';
import Input from 'in-components/SearchBar/Input';
import { query$ } from 'in-stores/search/query';
import connectTo from 'in-hoc/connectTo';

import locals from 'in-components/SearchBar/SearchBar.mless';

export default connectTo(
  {
    presetsVisible: presetsVisible$,
    query: query$.distinct().startWith('')
  },
  class SearchBarDfq extends React.Component {
    componentDidMount() {
      refresh();
      setQueryInput(this.props.dfqEntry, '', true);
    }

    componentWillUnmount() {
      if (this.props.presetsVisible) togglePresets();
    }

    render() {
      const {
        theme = 'light',
        dfqInsideCustomWidget,
        saveFilterDisabled,
        presetsVisible,
        dfqHandleChange,
        dfqEntry
      } = this.props;
      const buttonClass = classNames({
        [locals.button]: true,
        [locals[`button${theme}`]]: theme
      });

      function setFilter(value) {
        dfqHandleChange(value);
        setQueryInput(value, '', true);
        togglePresets();
      }

      return (
        <div
          className={classNames({
            ['in-searchbar']: true,
            [`in-searchbar-${theme}`]: true,
            [locals.wrapper]: true,
            [locals.wrapperWithPadding]: !dfqInsideCustomWidget,
            [locals[`wrapper${theme}`]]: theme
          })}
        >
          {presetsVisible ? (
            <FilterPresets dfqInsideCustomWidget={dfqInsideCustomWidget} setFilter={setFilter} />
          ) : null}

          <div
            className={classNames({
              [locals.inputWrapper]: true,
              [locals.withoutSaveFilter]: saveFilterDisabled,
              [locals[`inputWrapper${theme}`]]: theme
            })}
          >
            <Input
              dfqInsideCustomWidget={dfqInsideCustomWidget}
              saveFilterDisabled={saveFilterDisabled}
              dfqHandleChange={handleChangeWithDebounce(dfqHandleChange)}
              dfqEntry={dfqEntry}
            />
          </div>
          <ClearQueryButton buttonClass={buttonClass} />
          <div className={buttonClass} onClick={togglePresets}>
            <SvgIcon
              className={classNames({
                [locals.icon]: true,
                [locals[`icon${theme}`]]: theme
              })}
              type={presetsVisible ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
              size="s"
            />
          </div>
          <ErrorIndicator />
        </div>
      );
    }
  }
);

function handleChangeWithDebounce(dfqHandleChange) {
  const debounceFn = debounce(dfqHandleChange, 500);
  return function handleChange(dfQuery) {
    debounceFn(trim(dfQuery));
  };
}
