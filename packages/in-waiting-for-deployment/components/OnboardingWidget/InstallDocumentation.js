/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';

import { SideNavigation, SideNavigationSection, SideNavigationItem } from 'in-components/SideNavigation/SideNavigation';
import { categorise, filter, score } from 'in-waiting-for-deployment/components/OnboardingWidget/contentUtils';
import HelpAndSupport from 'in-waiting-for-deployment/components/OnboardingWidget/HelpAndSupport';
import Collaboration from 'in-waiting-for-deployment/components/OnboardingWidget/Collaboration';
import EntryContent from 'in-waiting-for-deployment/components/OnboardingWidget/EntryContent';
import getEntries from 'in-waiting-for-deployment/components/OnboardingWidget/content';
import SearchInput from 'in-components/SearchInput';
import { t } from 'in-i18n';

import locals from './InstallDocumentation.mless';

export default function InstallDocumentation(props) {
  const entities = getEntries(props);
  let filteredEntities = filter(score(entities, props.query));
  let hasError = false;

  if (filteredEntities.length === 0) {
    hasError = true;
    filteredEntities = entities;
  }
  const categories = categorise(filteredEntities);

  let index = 0;
  return (
    <div className={locals.wrapper}>
      <div className={locals.heading}>
        <span className={locals.headingText}>{t('in-waiting-for-deployment:installingInstanaAgents')}</span>
      </div>
      <div className={locals.contentWithNavigation}>
        <div className={locals.navigationWrapper}>
          <SearchInput onChange={props.onQueryChange} query={props.query} autoFocus hasError={hasError} />
          <SideNavigation>
            {categories.map(({ title, items }) => (
              <Fragment key={title}>
                <SideNavigationSection title={title} />
                {items.map(({ icon, label }) => {
                  const i = index++;
                  return (
                    <SideNavigationItem
                      key={i}
                      omitEmptyIcon
                      icon={icon || 'lib_missing_data'}
                      label={label}
                      isActive={props.selectedEntryIndex === i}
                      onClick={() => props.onEntrySelected(i, label)}
                    />
                  );
                })}
              </Fragment>
            ))}
          </SideNavigation>
        </div>

        <div
          className={classNames(locals.content, {
            [locals.withoutHeightRestriction]: props.withoutHeightRestriction
          })}
        >
          <EntryContent {...props} entry={filteredEntities[props.selectedEntryIndex]} />

          {/* need to wrap this to have all the content inside the div bottom aligned */}
          <div>
            <Collaboration {...props} />
            <HelpAndSupport {...props} />
          </div>
        </div>
      </div>
    </div>
  );
}
