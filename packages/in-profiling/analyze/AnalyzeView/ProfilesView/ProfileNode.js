import React, { Fragment, useRef, useState } from 'react';

import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { evaluateClassNames } from 'in-services/util/classnames';
import { treeViewExpanded } from 'in-profiling/tracker';
import { scrollIntoView } from 'in-services/util/dom';
import { getCodeView } from 'in-forge/codeView/java';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ProfileNode.mless';

export default function ProfileNode({
  processSnapshot,
  highlightedProfileConfig,
  selectedProfileNode,
  setSelectedProfileNode,
  canFetchSourceCode,
  profileNode,
  depth = 0,
  onKeyDown
}) {
  if (!profileNode) {
    return null;
  }

  const highlightedNodeDomRef = useRef(null);
  const [expanded, setExpanded] = useState(
    highlightedProfileConfig && highlightedProfileConfig.expandedIds.has(profileNode.__uid)
  );
  const isHighlighted = highlightedProfileConfig && highlightedProfileConfig.highlightedId === profileNode.__uid;
  if (highlightedNodeDomRef && highlightedNodeDomRef.current) {
    scrollIntoView(highlightedNodeDomRef.current, {
      behavior: 'smooth',
      block: 'center'
    });
  }
  const hasChildren = profileNode.children.length > 0;
  const isSelectedRow = selectedProfileNode === profileNode;

  return (
    <div onKeyDown={e => onKeyDown(selectedProfileNode, e)}>
      <Row
        depth={depth}
        isSelected={isSelectedRow}
        isHighlighted={isHighlighted}
        highlightedNodeDomRef={highlightedNodeDomRef}
      >
        <ExpandIcon
          isFocusedIcon={isSelectedRow}
          hasChildren={hasChildren}
          expanded={expanded}
          setExpanded={expand => {
            setExpanded(expand);
            if (expand) {
              treeViewExpanded(depth);
            }
          }}
          depth={depth}
          select={() => setSelectedProfileNode(profileNode)}
          unselect={() => setSelectedProfileNode(null)}
        />
        <PercentIndicator percent={profileNode.percent} />
        <MethodName methodName={profileNode.methodName} />
        <At />
        <FileNameAndLine
          canFetchSourceCode={canFetchSourceCode}
          processSnapshot={processSnapshot}
          profileNode={profileNode}
        />
      </Row>

      {expanded &&
        hasChildren && (
          <div className={locals.childrenWrapper}>
            <ChildProfiles
              depth={depth}
              highlightedProfileConfig={highlightedProfileConfig}
              profiles={profileNode.children}
              processSnapshot={processSnapshot}
              canFetchSourceCode={canFetchSourceCode}
              selectedProfileNode={selectedProfileNode}
              setSelectedProfileNode={setSelectedProfileNode}
              onKeyDown={onKeyDown}
            />
          </div>
        )}
    </div>
  );
}

function ChildProfiles({
  selectedProfileNode,
  highlightedProfileConfig,
  onKeyDown,
  setSelectedProfileNode,
  depth,
  profiles,
  processSnapshot,
  canFetchSourceCode
}) {
  const lastProfile = profiles[profiles.length - 1];

  const nodeProps = {
    selectedProfileNode,
    highlightedProfileConfig,
    setSelectedProfileNode,
    onKeyDown,
    processSnapshot,
    canFetchSourceCode,
    depth: depth + 1
  };

  if (profiles.length <= 1) {
    return <ProfileNode {...nodeProps} profileNode={lastProfile} autoExpand />;
  }

  const profilesWithoutLast = profiles.slice(0, profiles.length - 1);
  return (
    <>
      <div className={locals.children}>
        {profilesWithoutLast.map((childNode, i) => (
          <Fragment key={i}>
            {i < profiles.length - 1 && <div className={locals.verticalLine} />}
            <ProfileNode key={i} {...nodeProps} profileNode={childNode} />
          </Fragment>
        ))}
      </div>
      <ProfileNode {...nodeProps} profileNode={lastProfile} />
    </>
  );
}

function Row({ depth, isSelected, isHighlighted, highlightedNodeDomRef, children }) {
  return (
    <div
      ref={isHighlighted ? highlightedNodeDomRef : undefined}
      className={evaluateClassNames({
        [locals.row]: true,
        [locals.expandedRow]: depth > 0,
        [locals.firstRow]: depth === 0,
        [locals.selectedRow]: isSelected,
        [locals.highlightedRow]: isHighlighted,
        [locals.nonHighlightedRow]: !isHighlighted
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

function ExpandIcon({ hasChildren, isFocusedIcon, expanded, setExpanded, select, unselect, depth }) {
  if (hasChildren) {
    return (
      <SvgIcon
        className={evaluateClassNames({
          [locals.expandIcon]: true,
          [locals.focusedIcon]: isFocusedIcon
        })}
        type={expanded ? 'lib_openclose_remove_box' : 'lib_openclose_add_box'}
        size="s"
        onClick={() => setExpanded(!expanded)}
        onBlur={unselect}
        onFocus={select}
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

function FileNameAndLine({ canFetchSourceCode, processSnapshot, profileNode }) {
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
              addActiveDialog(getCodeView(processSnapshot, profileNode.fileName, profileNode.fileLine));
            }
          : undefined
      }
    >
      {profileNode.fileName}:{profileNode.fileLine}
    </span>
  );
}

function PercentIndicator({ percent }) {
  // the percentage is given with high accurancy. Cap to 2 decimal places therefore
  const percentLabel = ((percent * 100) | 0) / 100;

  return (
    <>
      <div className={locals.percentWrapper}>
        <div className={locals.percent} style={{ width: percent }} />
      </div>
      <span className={locals.percentLabel}>{percentLabel}%</span>
    </>
  );
}
