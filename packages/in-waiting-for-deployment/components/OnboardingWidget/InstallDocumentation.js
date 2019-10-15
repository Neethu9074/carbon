import React from 'react';

import { SideNavigation, SideNavigationItem } from 'in-new-components/SideNavigation/SideNavigation';
import HelpAndSupport from 'in-waiting-for-deployment/components/OnboardingWidget/HelpAndSupport';
import Collaboration from 'in-waiting-for-deployment/components/OnboardingWidget/Collaboration';
import EntryContent from 'in-waiting-for-deployment/components/OnboardingWidget/EntryContent';
import getEntries from 'in-waiting-for-deployment/components/OnboardingWidget/content';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './InstallDocumentation.mless';

export default function InstallDocumentation(props) {
  const entries = getEntries(props);

  return (
    <div className={locals.wrapper}>
      <div className={locals.heading}>Installing the Instana agent</div>
      <div className={locals.contentWithNavigation}>
        <div className={locals.navigationWrapper}>
          <SideNavigation title="Platform">
            {entries.map((entry, i) => (
              <SideNavigationItem
                key={i}
                omitEmptyIcon
                icon={entry.icon || 'lib_missing_data'}
                label={entry.label}
                isActive={props.selectedEntryIndex === i}
                onClick={() => {
                  props.onSubEntrySelected(null);
                  props.onEntrySelected(i);
                }}
              />
            ))}
          </SideNavigation>
        </div>

        <div
          className={evaluateClassNames({
            [locals.content]: true,
            [props.contentClassName]: props.contentClassName
          })}
        >
          <EntryContent {...props} entry={entries[props.selectedEntryIndex]} />

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
