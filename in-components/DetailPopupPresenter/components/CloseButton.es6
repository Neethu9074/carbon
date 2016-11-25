import React from 'react';

import {clearContent} from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterContentStore';
import 'in-components/DetailPopupPresenter/components/CloseButton.less';
import Icon from 'in-components/Icon';


const block = 'in-popupable-close-button';

export default function CloseButton() {
  return (
    <div className={block}
         onClick={() => clearContent()}>
      <Icon type='delete'
            className={block + '__icon'} />
    </div>
  );

}
