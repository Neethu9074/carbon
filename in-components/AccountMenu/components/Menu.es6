import React from 'react';

import TenantUnitSwitcher from 'in-components/AccountMenu/components/TenantUnitSwitcher';
import {setSettingsVisibility} from 'in-stores/settings/visibility';
import {showReleaseNotes} from 'in-stores/releaseNotes';
import {
  isOpen$,
  closeMenu
} from 'in-components/AccountMenu/accountMenuStore';
import {goToGraph} from 'in-stores/navigation';
import {isOnPremise} from 'in-services/config';
import {config} from 'in-services/config';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './Menu.less';

const block = 'in-account-menu';
const umpLink = `https://${config.groundskeeperDomain}/ump/${config.tenant}/${config.tenantUnit}`;

export default connectTo({
    isOpen: isOpen$
  }, function Menu({isOpen}) {
    if (!isOpen) {
      return null;
    }

    return (
      <section className={block}>
        <p className={block + '__account-name'}>
          Signed in as {window.instana.user.fullName}
        </p>

        <a href={umpLink}
           target='_blank'
           className={block + '__account-menu-link'}
           onClick={closeMenu}>
          Account Menu

          <Icon type='right'
                className={block + '__account-menu-arrow'}/>
        </a>

        <Separator />

        <TenantUnitSwitcher />

        <Separator />

        <a className={block + '__link'}
           href='#'
           onClick={closeAndCall(() => setSettingsVisibility(true))}>
          Settings
        </a>

        {!isOnPremise() ?
          <a className={block + '__link'}
             href='#'
             onClick={closeAndCall(showReleaseNotes)}>
            Release Notes
          </a>
        : null}

        <a className={block + '__link'}
           href='#'
           onClick={closeAndCall(goToGraph)}>
          Graph Showcase
        </a>

        <Separator />

        <form action='/auth/signOut' method='post'>
          <button type='submit'
                  className={block + '__signout'}>
            Sign Out
          </button>
        </form>
      </section>
    );
  }
);


function Separator() {
  return <div className={block + '__separator'} />;
}


function closeAndCall(fn) {
  return e => {
    e.preventDefault();
    closeMenu();
    fn();
  };
}
