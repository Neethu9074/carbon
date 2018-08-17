import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import TabList from 'in-new-components/TabView/sharedComponents/TabList';
import Tab from 'in-new-components/TabView/sharedComponents/Tab';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getModifiedUrlStream } from 'in-stores/navigation';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Header.mless';

export default function Header({ tabs, result, HeaderComponent, location, props }) {
  return (
    <div className={locals.header}>
      <MaxWidthFullscreenContainer>
        <HeaderComponent result={result} {...props} />
        {tabs.length === 1 && tabs[0].hideTabLabelWhenAlone ? null : (
          <TabList>
            {tabs.map(tab => <TabComponent key={tab.label} tab={tab} location={location} props={props} />)}
          </TabList>
        )}
      </MaxWidthFullscreenContainer>
      <HorizontalIndicator progress={result.progress} />
    </div>
  );
}

function TabComponent({ tab, location, props }) {
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
