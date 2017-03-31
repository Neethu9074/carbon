import React from 'react';

import { clearContent } from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterContentStore';
import 'in-components/DetailPopupPresenter/components/CloseButton.less';
import SvgIcon from 'in-components/SvgIcon';

const block = 'in-popupable-close-button';

export default function CloseButton() {
  return (
    <div className={block} onClick={() => clearContent()}>
      <SvgIcon type="x" width={9} color="#92a5ae" />
    </div>
  );
}
