/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { togglePresets, presetsVisible$ } from 'in-components/SearchBar/stores/presetsVisibility';
import { unvalidatedQuery$, query$, setQueryInput } from 'in-stores/search/query';
import ErrorIndicator from 'in-components/SearchBar/components/ErrorIndicator';
import FilterPresets from 'in-components/SearchBar/components/FilterPresets';
import SaveDialog from 'in-components/SearchBar/components/SaveDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { setValues } from 'in-components/SearchBar/stores/dialog';
import { refresh } from 'in-components/SearchBar/stores/filters';
import HelpDialog from 'in-components/helpSystem/HelpDialog';
import Input from 'in-components/SearchBar/Input';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './SearchBar.mless';

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
      const { style, theme = 'dark', showFilters = true, query, presetsVisible } = this.props;
      const hasContent = query.length > 0;

      const buttonClass = classNames({
        [locals.button]: true,
        [locals[`button${theme}`]]: theme
      });

      return (
        <div
          style={style}
          className={classNames({
            ['in-searchbar']: true,
            [`in-searchbar-${theme}`]: true,
            [locals.wrapper]: true,
            [locals[`wrapper${theme}`]]: theme
          })}
        >
          {presetsVisible ? <FilterPresets /> : null}

          <SvgIcon
            className={classNames({
              [locals.helpIcon]: true,
              [locals[`helpIcon${theme}`]]: theme
            })}
            onClick={onShowKeywordHelp}
            type="lib_help_error_help_outline"
            size="s"
          />

          <div
            className={classNames({
              [locals.inputWrapper]: true,
              [locals[`inputWrapper${theme}`]]: theme
            })}
          >
            <Input />
          </div>

          <ClearQueryButton buttonClass={buttonClass} />

          {hasContent && showFilters ? (
            <div
              className={buttonClass}
              onClick={e => {
                e.preventDefault();
                save(query);
              }}
            >
              {t('forms.actions.save')}
            </div>
          ) : null}

          {showFilters ? (
            <div className={buttonClass} onClick={togglePresets}>
              {t('in-components:searchBar.filtersBtn')}
              <SvgIcon
                className={classNames({
                  [locals.icon]: true,
                  [locals[`icon${theme}`]]: theme
                })}
                type={presetsVisible ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
                size="s"
              />
            </div>
          ) : (
            <div className={locals.filtersSpaceholder} />
          )}

          <ErrorIndicator />
        </div>
      );
    }
  }
);

function onShowKeywordHelp(e) {
  e.preventDefault();
  addActiveDialog(
    <HelpDialog
      title={t('in-components:searchBar.helpDialogTitleUsingTheSearchBar')}
      markdownContent={t('in-components:searchBar.usingTheSearchBar')}
    />
  );
}

function save(query) {
  setValues('', 'New filter', query);
  addActiveDialog(<SaveDialog />);
}

const ClearQueryButton = connectTo(
  {
    query: unvalidatedQuery$
  },
  function ClearQueryButton({ query, buttonClass }) {
    if (!query || !query.query || query.query.length === 0) {
      return null;
    }
    return (
      <div className={buttonClass} onClick={() => setQueryInput('', query.searchContext)}>
        <SvgIcon type="lib_openclose_cancel" size="s" color="#6b8088" />
      </div>
    );
  }
);
