import React from 'react';

import {closeMenu} from 'in-components/AccountMenu/accountMenuStore';
import {setSettingsVisibility} from 'in-stores/settings/visibility';
import {isProductionEnvironment} from 'in-services/config';
import {showReleaseNotes} from 'in-stores/releaseNotes';

import './MenuFooter.less';

const block = 'in-menu-footer';

export default function MenuFooter() {
  return (
    <div className={block}>

      <div onClick={onClickSettings}
           className={block + '__settings'}>
        Settings
      </div>

      <div onClick={onClickReleaseNotes}
           className={block + '__release-notes'}>
        Release Notes
      </div>


      {isProductionEnvironment() ?
        <form action='/auth/signOut' method='post'>
          <button type='submit'
                  className={block + '__signout'}>
            Logout
          </button>
        </form>
      : null}

    </div>
  );
}

function onClickReleaseNotes() {
  showReleaseNotes();
  closeMenu();
}

function onClickSettings() {
  setSettingsVisibility(true);
  closeMenu();
}
