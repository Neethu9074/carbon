import React, { useRef } from 'react';
import rpt from 'prop-types';

import ActiveGroupingConfiguration from 'in-new-components/GroupingConfigurator/ActiveGroupingConfiguration';
import TagSelectorOverlay from 'in-new-components/TagSelectorOverlay/TagSelectorOverlay';
import { DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';
import Overlay from 'in-new-components/overlays/Overlay';
import useObservable from 'in-hooks/useObservable';
import Button from 'in-new-components/Button';

import locals from './GroupingConfigurator.mless';

export default function GroupingConfigurator({
  value: group,
  tagFilterExpression,
  onChange,
  getTagCatalog,
  getSuggestions
}) {
  const tagCatalog = useObservable(getTagCatalog(), [getTagCatalog]);
  const autoFocus = useRef();

  // TODO: loading state
  if (!tagCatalog || !tagCatalog.data) {
    return null;
  }

  return (
    <>
      <Overlay
        content={TagSelectorOverlay}
        props={{
          tagCatalog: tagCatalog.data,
          onChange: ({ name }) => {
            autoFocus.current = Date.now();
            onChange(setEntityIfNecessary(name));
          }
        }}
        align={'bottomLeft'}
        withoutWrapper
      >
        {({ toggle, refSetter }) =>
          group?.groupbyTag ? (
            <ActiveGroupingConfiguration
              onChange={onChange}
              getSuggestions={getSuggestions}
              group={group}
              toggle={toggle}
              ref={refSetter}
              tagCatalog={tagCatalog.data}
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
              Add Group
            </Button>
          )
        }
      </Overlay>
    </>
  );

  function setEntityIfNecessary(groupbyTag) {
    const tagTreeNode = tagCatalog.data.tagsByName[groupbyTag];
    if (tagTreeNode.canApplyToSource && tagTreeNode.canApplyToDestination) {
      return {
        groupbyTag,
        groupbyTagEntity: DESTINATION
      };
    }

    return { groupbyTag };
  }
}

GroupingConfigurator.propTypes = {
  onChange: rpt.func.isRequired,
  value: rpt.object,
  getTagCatalog: rpt.func.isRequired,
  getSuggestions: rpt.func.isRequired,
  tagFilterExpression: rpt.object.isRequired
};
