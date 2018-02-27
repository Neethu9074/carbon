import React from 'react';

import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator/HorizontalIndicator';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
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
        <ul className={locals.tabList}>
          {tabs.map(tab => <Tab key={tab.label} tab={tab} location={location} props={props} />)}
        </ul>
      </MaxWidthFullscreenContainer>
      <HorizontalIndicator progress={result.progress} />
    </div>
  );
}

function Tab({ tab, location, props }) {
  const isActive = location.pathname.indexOf(tab.path) === 0;
  const Header = tab.header || DefaultHeader;
  return (
    <li
      key={tab.label}
      className={evaluateClassNames({
        [locals.tab]: true,
        [locals.selected]: isActive
      })}
    >
      <Link
        className={evaluateClassNames({
          [locals.link]: true,
          [locals.selectedLink]: isActive
        })}
        href$={getModifiedUrlStream(params => {
          params.pathname = tab.path;
        })}
      >
        <div className={locals.flexWrapper}>
          {tab.icon && <SvgIcon type={tab.icon} width={16} height={16} color="#6c8a91" />}
          <Header tab={tab} {...props} />
        </div>
      </Link>
    </li>
  );
}

function DefaultHeader({ tab }) {
  return tab.label;
}
