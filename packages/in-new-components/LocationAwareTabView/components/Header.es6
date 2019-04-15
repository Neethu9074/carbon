import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import TabList from 'in-new-components/LocationAwareTabView/components/TabList';
import Tab from 'in-new-components/LocationAwareTabView/components/Tab';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getModifiedUrlStream } from 'in-stores/navigation';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Header.mless';

export default function Header({
  tabs,
  result,
  HeaderComponent,
  location,
  props,
  useFullAvailableWidth,
  tabChangeTracker
}) {
  const Wrapper = useFullAvailableWidth ? UseFullAvailableWidth : MaxWidthFullscreenContainer;
  return (
    <div className={locals.header}>
      <Wrapper>
        <HeaderComponent result={result} {...props} />
        {tabs.length === 1 && tabs[0].hideTabLabelWhenAlone ? null : (
          <TabList>
            {tabs.map(tab => (
              <TabComponent
                key={tab.label}
                tab={tab}
                location={location}
                props={props}
                tabChangeTracker={tabChangeTracker}
              />
            ))}
          </TabList>
        )}
      </Wrapper>
      {result && <HorizontalIndicator progress={result.progress} />}
    </div>
  );
}

function UseFullAvailableWidth({ children }) {
  return <div className={locals.fullWidthWrapper}>{children}</div>;
}

function TabComponent({ tab, location, props, tabChangeTracker }) {
  const isActive = location && location.pathname.indexOf(tab.path) === 0;
  const Header = tab.header || DefaultHeader;
  return (
    <Link
      className={evaluateClassNames({
        [locals.link]: true,
        [locals.selectedLink]: isActive
      })}
      href$={getModifiedUrlStream(params => {
        params.pathname = tab.path;
      })}
      onClick={() => {
        if (tabChangeTracker) {
          tabChangeTracker({
            tab: tab.label
          });
        }
      }}
    >
      <Tab key={tab.label} isSelected={isActive}>
        <div className={locals.flexWrapper}>
          {tab.icon && <SvgIcon className={locals.icon} type={tab.icon} width={24} height={24} />}
          <Header tab={tab} {...props} />
        </div>
      </Tab>
    </Link>
  );
}

function DefaultHeader({ tab }) {
  return tab.label;
}
