/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { toClassPathTree } from 'in-sdk/components/sidebar/ClassPathLayouter/treeStructureGenerator';

describe('in-sdk/components/sidebar/ClassPathLayouter/treeStructureGenerator', () => {
  it('must transform a classpath string for Windows environments', () => {
    const classpath =
      'E:\\Wildfly\\wildfly-10.1.0.Final\\jboss-modules.jar;E:\\Wildfly\\APM_Insight_wild\\apminsight-javaagent.jar';
    const result = toClassPathTree(classpath);
    expect(result.numberOfEntries).toEqual(2);
    expect(result.tree).toMatchInlineSnapshot(`
      Object {
        "E:\\\\Wildfly\\\\APM_Insight_wild\\\\": Array [
          "E:\\\\Wildfly\\\\APM_Insight_wild\\\\apminsight-javaagent.jar",
        ],
        "E:\\\\Wildfly\\\\wildfly-10.1.0.Final\\\\": Array [
          "E:\\\\Wildfly\\\\wildfly-10.1.0.Final\\\\jboss-modules.jar",
        ],
      }
    `);
  });

  it('must transform a classpath string for Linux environments', () => {
    const classpath =
      '/usr/share/lucene/lib/lucene-grouping-7.3.1.jar:/usr/share/elasticsearch/lib/elasticsearch-x-content-6.3.2.jar:/usr/share/elasticsearch/lib/spatial4j-0.7.jar:/usr/share/elasticsearch/lib/elasticsearch-launchers-6.3.2.jar';
    const result = toClassPathTree(classpath);
    expect(result.numberOfEntries).toEqual(4);
    expect(result.tree).toMatchInlineSnapshot(`
      Object {
        "/usr/share/elasticsearch/lib/": Array [
          "/usr/share/elasticsearch/lib/elasticsearch-x-content-6.3.2.jar",
          "/usr/share/elasticsearch/lib/spatial4j-0.7.jar",
          "/usr/share/elasticsearch/lib/elasticsearch-launchers-6.3.2.jar",
        ],
        "/usr/share/lucene/lib/": Array [
          "/usr/share/lucene/lib/lucene-grouping-7.3.1.jar",
        ],
      }
    `);
  });
});
