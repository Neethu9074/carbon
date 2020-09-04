import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getCodeView } from 'in-sdk/snapshot/snapshot';

import locals from './FileNameAndLine.mless';

export default function FileNameAndLine({ canFetchSourceCode, entitySnapshot, profileNode }) {
  return (
    <span
      className={evaluateClassNames({
        [locals.fileName]: true,
        [locals.fileNameWithSourceCode]: canFetchSourceCode
      })}
      onClick={
        canFetchSourceCode
          ? e => {
              stopPropagationAndPreventDefault(e);
              addActiveDialog(getCodeView(entitySnapshot, profileNode.fileName, profileNode.fileLine));
            }
          : undefined
      }
    >
      {profileNode.fileName}:{profileNode.fileLine}
    </span>
  );
}
