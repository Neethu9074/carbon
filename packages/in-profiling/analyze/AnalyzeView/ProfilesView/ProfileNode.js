import React, { Fragment, useState } from 'react';

import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { evaluateClassNames } from 'in-services/util/classnames';
import { lighten } from 'in-services/formatters/color';
import { getCodeView } from 'in-forge/codeView/java';
import SvgIcon from 'in-components/SvgIcon';
import theme from 'in-themes';

import locals from './ProfileNode.mless';

export default function ProfileNode({ processSnapshot, isOnline, profileNode, depth = 0, autoExpand = false }) {
  if (!profileNode) {
    return null;
  }

  const [expanded, setExpanded] = useState(autoExpand);
  const hasChildren = profileNode.children.length > 0;

  return (
    <>
      <Row depth={depth}>
        <ExpandIcon hasChildren={hasChildren} expanded={expanded} setExpanded={setExpanded} depth={depth} />
        <PercentIndicator percent={profileNode.percent} />
        <MethodName methodName={profileNode.methodName} />
        <At />
        <FileNameAndLine isOnline={isOnline} processSnapshot={processSnapshot} profileNode={profileNode} />
      </Row>

      {expanded &&
        hasChildren && (
          <div className={locals.childrenWrapper}>
            <ChildProfiles
              depth={depth}
              profiles={profileNode.children}
              processSnapshot={processSnapshot}
              isOnline={isOnline}
            />
          </div>
        )}
    </>
  );
}

function ChildProfiles({ depth, profiles, processSnapshot, isOnline }) {
  const lastProfile = profiles[profiles.length - 1];

  if (profiles.length <= 1) {
    return (
      <ProfileNode
        processSnapshot={processSnapshot}
        isOnline={isOnline}
        profileNode={lastProfile}
        depth={depth + 1}
        autoExpand
      />
    );
  }

  const profilesWithoutLast = profiles.slice(0, profiles.length - 1);
  return (
    <>
      <div className={locals.children}>
        {profilesWithoutLast.map((childNode, i) => (
          <Fragment key={i}>
            {i < profiles.length - 1 && <div className={locals.verticalLine} />}
            <ProfileNode
              processSnapshot={processSnapshot}
              isOnline={isOnline}
              key={i}
              profileNode={childNode}
              depth={depth + 1}
            />
          </Fragment>
        ))}
      </div>
      <ProfileNode processSnapshot={processSnapshot} isOnline={isOnline} profileNode={lastProfile} depth={depth + 1} />
    </>
  );
}

function Row({ depth, children }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.row]: depth > 0,
        [locals.firstRow]: depth === 0
      })}
    >
      {children}
    </div>
  );
}

function MethodName({ methodName }) {
  return (
    <span className={locals.methodName}>
      {`<`}
      {methodName}
      {`>`}
    </span>
  );
}

function At() {
  return <span className={locals.at}>at</span>;
}

function ExpandIcon({ hasChildren, expanded, setExpanded, depth }) {
  if (hasChildren) {
    return (
      <SvgIcon
        className={locals.expandIcon}
        type={expanded ? 'lib_openclose_remove_box' : 'lib_openclose_add_box'}
        size="s"
        onClick={() => setExpanded(!expanded)}
        {...toInteractiveElement({
          ariaLabel: expanded ? 'Collapse' : 'Expand',
          onDefaultInteraction: () => setExpanded(!expanded)
        })}
      />
    );
  }
  return (
    <span
      className={evaluateClassNames({
        [locals.iconPlaceHolder]: true,
        [locals.iconPlaceHolderWithLine]: depth > 0
      })}
    />
  );
}

function FileNameAndLine({ isOnline, processSnapshot, profileNode }) {
  return (
    <span
      className={evaluateClassNames({
        [locals.fileName]: true,
        [locals.fileNameWithSourceCode]: isOnline
      })}
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        if (isOnline) {
          setActiveDialog(getCodeView(processSnapshot, profileNode.fileName, profileNode.fileLine));
        }
      }}
    >
      {profileNode.fileName}:{profileNode.fileLine}
    </span>
  );
}

function PercentIndicator({ percent }) {
  // the percentage is given with high accurancy. Cap to 2 decimal places therefore
  const percentLabel = ((percent * 100) | 0) / 100;

  return (
    <div className={locals.percentWrapper}>
      <div
        style={{
          width: percent,
          background: lighten(theme.lib.colors.lightBlue800, Math.max(0.15, percent / 300))
        }}
        className={locals.percent}
      >
        {percentLabel}%
      </div>
    </div>
  );
}
