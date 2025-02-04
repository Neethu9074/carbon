/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { get } from 'lodash';

import EndpointExtractionRuleDialog from 'in-applications/Forms/CustomEndpointMapping/EndpointExtractionRuleDialog/EndpointExtractionRuleDialog';
import ExtractionRule from 'in-applications/Forms/CustomEndpointMapping/ExtractionRule';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { testRules } from 'in-api/endpointConfiguration';

import locals from './DragAndDropRuleList.mless';

function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    position: 'relative',
    zIndex: isDragging ? 1000 : 'auto',
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function DragAndDropRuleList(props) {
  const { rules, form, setValue, switchIndices, onSave, onRemove } = props;
  const [state, setState] = useState({ testResult: null, loading: false, error: false });
  const { testResult } = state;
  const onSuccess$ = useRef(null);
  const onError$ = useRef(null);

  const testRulesAndUpdateState = useCallback(() => {
    const rulesToCheck = form.get('rules').toJS();
    if (rulesToCheck.length === 0) {
      setState({
        testResult: null,
        loading: false,
        error: false
      });
      return;
    }

    const result$ = testRules(rulesToCheck);
    setState({
      testResult: null,
      loading: true,
      error: false
    });

    onSuccess$.current = result$.once(testResult => {
      setState({
        testResult,
        loading: false,
        error: false
      });
      onSuccess$.current = null;
    });

    onError$.current = result$.errors().once(() => {
      setState({
        loading: false,
        error: true
      });
      onError$.current = null;
    });
  }, [form]);

  useEffect(() => {
    testRulesAndUpdateState();

    return () => {
      if (onSuccess$.current) {
        onSuccess$.current.dispose();
        onSuccess$.current = null;
      }
      if (onError$.current) {
        onError$.current.dispose();
        onError$.current = null;
      }
    };
  }, [testRulesAndUpdateState]);

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over.id) {
      switchIndices(active.id, over.id);
    }
  };

  const onRuleClicked = (rules, rule, index) => {
    addActiveDialog(
      <EndpointExtractionRuleDialog
        rules={rules}
        ruleIndex={index}
        rule={rule}
        onSave={_rule => onSave(_rule, index)}
        onRemove={() => onRemove(index)}
      />
    );
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  if (rules.length === 0) {
    return null;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={rules.map((_, i) => String(i))}>
        <div>
          {rules.map((rule, index) => (
            <SortableItem key={String(index)} id={String(index)}>
              <div className={locals.item}>
                <ExtractionRule
                  reorderable
                  rule={rule.toJS()}
                  onToggleEnable={enabled => setValue(['rules', index, 'enabled'], enabled, form)}
                  onClick={e => onRuleClicked(rules, e, index)}
                  testResult={testResult ? get(testResult, [index], []) : undefined}
                />
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
