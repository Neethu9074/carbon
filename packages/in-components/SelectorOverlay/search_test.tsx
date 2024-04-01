/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { expect } from 'chai';
import React from 'react';

import { Options } from 'in-components/TagSelectorOverlay/TagSelectorOverlay';
import { search } from 'in-components/SelectorOverlay/search';

const nodes: Options[] = [
  {
    label: 'Root Level Leaf',
    description: 'Funky root leaf',
    icon: 'plugin:host',
    badge: null,
    keywords: '',
    tagName: '',
    children: [],
    parentLabels: []
  },
  {
    label: 'Root Level Node',
    description: 'Some description',
    icon: 'plugin:neo4j',
    badge: null,
    keywords: '',
    tagName: '',
    parentLabels: [],
    children: [
      {
        label: 'First Level Leaf',
        description: 'Some description',
        icon: 'plugin:docker',
        badge: null,
        keywords: '',
        tagName: '',
        children: [],
        parentLabels: []
      },
      {
        label: 'First Level Node',
        description: 'Some description',
        icon: 'plugin:mule',
        badge: null,
        keywords: 'firstLevelNode',
        tagName: '',
        parentLabels: [],
        children: [
          {
            label: 'Second Level Leaf',
            keywords: 'foobar',
            badge: null,
            tagName: '',
            children: [],
            parentLabels: []
          },
          {
            label: 'Second Level Node',
            description: 'Some description',
            icon: 'plugin:mule',
            badge: null,
            keywords: '',
            tagName: '',
            children: [
              {
                label: 'Third Level Leaf',
                description: 'Some description',
                keywords: 'fobar',
                badge: null,
                tagName: '',
                children: [],
                parentLabels: []
              }
            ],
            parentLabels: []
          }
        ]
      }
    ]
  }
];

const namespaceOptions: Options[] = [
  {
    label: 'uid',
    description: 'Kubernetes Namespace UID',
    keywords: 'Kubernetes namespace uid',
    badge: null,
    tagName: 'kubernetes.namespace.uid',
    children: [],
    parentLabels: []
  },
  {
    label: 'name',
    description: 'Kubernetes namespace name',
    keywords: 'Kubernetes namespace name',
    badge: null,
    tagName: 'kubernetes.namespace.name',
    children: [],
    parentLabels: []
  }
];

const appNameOptions: Options[] = [
  {
    label: 'JVM Application name',
    description: 'JVM Application name',
    keywords: 'jvm application name',
    badge: null,
    tagName: 'jvm.application.name',
    children: [],
    parentLabels: []
  },
  {
    label: 'Application name',
    description: 'Application name',
    keywords: 'application name',
    badge: null,
    tagName: 'application.name',
    children: [],
    parentLabels: [],
    scoreBoost: 10
  }
];

describe('in-components/SelectorOverlay/search', () => {
  it('should return the whole tree if the query is empty', () => {
    expect(search(nodes, '')).to.deep.equal(nodes);
  });

  it('should filter by label', () => {
    expect(search(nodes, 'third')).to.deep.equal([
      {
        badge: null,
        children: [],
        label: 'Third Level Leaf',
        description: 'Some description',
        withHighlights: {
          label: (
            <>
              <span key="0" className="local-css-highlight">Third</span> Level Leaf
            </>
          ),
          description: 'Some description',
          parentLabels: []
        },
        keywords: 'fobar',
        parentLabels: [],
        tagName: ''
      }
    ]);
  });

  it('should filter by description', () => {
    expect(search(nodes, 'FunKy')).to.deep.equal([
      {
        badge: null,
        children: [],
        label: 'Root Level Leaf',
        description: 'Funky root leaf',
        withHighlights: {
          label: 'Root Level Leaf',
          description: (
            <>
              <span key="0" className="local-css-highlight">Funky</span> root leaf
            </>
          ),
          parentLabels: []
        },
        icon: 'plugin:host',
        keywords: '',
        parentLabels: [],
        tagName: ''
      }
    ]);
  });
  it('should sort by relevance', () => {
    expect(search(namespaceOptions, 'namespace name')).to.deep.equal([
      {
        label: 'name',
        description: 'Kubernetes namespace name',
        withHighlights: {
          label: 'name',
          description: (
            <>
              Kubernetes <span key="0" className="local-css-highlight">namespace name</span>
            </>
          ),
          parentLabels: []
        },
        keywords: 'Kubernetes namespace name',
        badge: null,
        tagName: 'kubernetes.namespace.name',
        parentLabels: [],
        children: []
      },
      {
        label: 'uid',
        description: 'Kubernetes Namespace UID',
        withHighlights: {
          label: 'uid',
          description: (
            <>
              Kubernetes <span key="0" className="local-css-highlight">Namespace</span> UID
            </>
          ),
          parentLabels: []
        },
        keywords: 'Kubernetes namespace uid',
        badge: null,
        tagName: 'kubernetes.namespace.uid',
        parentLabels: [],
        children: []
      }
    ]);
  });
  it('should sort by relevance with score boost', () => {
    expect(search(appNameOptions, 'app name')).to.deep.equal([
      {
        label: 'Application name',
        description: 'Application name',
        withHighlights: {
          label: (
            <>
              <span key="0" className="local-css-highlight">App</span>lication <span key="1" className="local-css-highlight">name</span>
            </>
          ),
          description: (
            <>
              <span key="0" className="local-css-highlight">App</span>lication <span key="1" className="local-css-highlight">name</span>
            </>
          ),
          parentLabels: []
        },
        keywords: 'application name',
        badge: null,
        tagName: 'application.name',
        children: [],
        parentLabels: [],
        scoreBoost: 10
      },
      {
        label: 'JVM Application name',
        description: 'JVM Application name',
        withHighlights: {
          label: (
            <>
              JVM <span key="0" className="local-css-highlight">App</span>lication <span key="1" className="local-css-highlight">name</span>
            </>
          ),
          description: (
            <>
              JVM <span key="0" className="local-css-highlight">App</span>lication <span key="1" className="local-css-highlight">name</span>
            </>
          ),
          parentLabels: []
        },
        keywords: 'jvm application name',
        badge: null,
        tagName: 'jvm.application.name',
        children: [],
        parentLabels: []
      }
    ]);
  });
  it('should not return elements with children', () => {
    expect(search(nodes, 'firstLevelNode')).to.deep.equal([]);
  });
});
