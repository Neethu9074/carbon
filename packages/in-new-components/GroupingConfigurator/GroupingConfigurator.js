/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef } from 'react';
import rpt from 'prop-types';

import ActiveGroupingConfiguration from 'in-new-components/GroupingConfigurator/ActiveGroupingConfiguration';
import TagSelectorOverlay from 'in-new-components/TagSelectorOverlay/TagSelectorOverlay';
import LoadingIndicator from 'in-new-components/GroupingConfigurator/LoadingIndicator';
import { DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

import locals from './GroupingConfigurator.mless';

export default function GroupingConfigurator({
  value: group,
  tagFilterExpression,
  getTagCatalog,
  getSuggestions,
  onChange,
  tracking,
  label = t('in-new-components:groupingConfigurator.addGroup'),
  loadingLabel
}) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  const autoFocus = useRef();

  if (!tagCatalog) {
    return <LoadingIndicator text={loadingLabel} />;
  }

  return (
    <>
      <Overlay
        content={TagSelectorOverlay}
        props={{
          tagCatalog,
          onChange: ({ name }) => {
            autoFocus.current = Date.now();
            const selectedGroup = setEntityIfNecessary(name);
            tracking?.onGroupAdded?.(selectedGroup);
            onChange(selectedGroup);
          }
        }}
        align={'bottomLeft'}
        withoutWrapper
      >
        {({ toggle, refSetter }) =>
          group?.groupbyTag ? (
            <ActiveGroupingConfiguration
              onChange={onChange}
              onGroupRemoved={tracking?.onGroupRemoved}
              getSuggestions={getSuggestions}
              group={group}
              toggle={toggle}
              ref={refSetter}
              tagCatalog={tagCatalog}
              tagFilterExpression={tagFilterExpression}
              autoFocus={autoFocus.current}
            />
          ) : (
            <Button
              className={locals.noActiveGroupingButton}
              kind={'subtle'}
              size="compact"
              icon={'lib_openclose_add'}
              refSetter={refSetter}
              onClick={toggle}
            >
              {label}
            </Button>
          )
        }
      </Overlay>
    </>
  );

  function setEntityIfNecessary(groupbyTag) {
    const tagTreeNode = tagCatalog?.tagsByName[groupbyTag];
    if (tagTreeNode.canApplyToSource && tagTreeNode.canApplyToDestination) {
      return {
        groupbyTag,
        groupbyTagEntity: DESTINATION
      };
    }

    return { groupbyTag };
  }
}

export const trackingProps = {
  onGroupAdded: rpt.func,
  onGroupRemoved: rpt.func
};

GroupingConfigurator.propTypes = {
  onChange: rpt.func.isRequired,
  value: rpt.object,
  getTagCatalog: rpt.func.isRequired,
  getSuggestions: rpt.func.isRequired,
  tagFilterExpression: rpt.object.isRequired,
  tracking: rpt.shape(trackingProps),
  label: rpt.string,
  loadingLabel: rpt.string
};
