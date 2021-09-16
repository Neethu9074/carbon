/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import StackTraceBehavior from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/StackTrace/StackTraceBehavior';

export default {
  title: 'Templates|analyze/StackTraceBehavior',
  parameters: {
    chromatic: { disable: true }
  },
  component: StackTraceBehavior
};

export function StackTraceDirect() {
  const logs = callExample.logs;

  return (
    <>
      {logs.map((log, i) => (
        <StackTraceBehavior key={i} stackTrace={log.stackTrace} call={callExample} />
      ))}
    </>
  );
}

export const callExample = {
  id: '102e510838b4fd97',
  label: 'GET /productsearch',
  start: 1560842704107,
  duration: 2,
  minSelfTime: 1,
  networkTime: 0,
  errorCount: 1,
  batchSize: 1,
  batchSelfTime: 2,
  source: {
    applications: [
      {
        id: 'j4Lli9InT5OL3_9A74tp9g',
        label: 'Demo',
        entityType: 'APPLICATION'
      },
      {
        id: 'MQLskXfATwaoqZfEVxEitg',
        label: 'With quotes """""',
        entityType: 'APPLICATION'
      },
      {
        id: 'aQbvtzgeSHKXGjQWQOoUPA',
        label: 'marathon',
        entityType: 'APPLICATION'
      },
      {
        id: '7zSO6R7XRlKnYy4gIVohoQ',
        label: 'myRBACapp',
        entityType: 'APPLICATION'
      },
      {
        id: 'rLBelBBcRWuBNpOcOqHMcA',
        label: 'yiquan test',
        entityType: 'APPLICATION'
      },
      {
        id: 'Ygu5Pst6QW2_-5Tr0CbLCQ',
        label: 'Kuberbac',
        entityType: 'APPLICATION'
      },
      {
        id: 'nPdJN2jQQl204KwJwhYmbQ',
        label: 'Service Cluster',
        entityType: 'APPLICATION'
      },
      {
        id: 'h2Qy2ZkVRV2mCspAvyTLQw',
        label: 'All',
        entityType: 'APPLICATION'
      },
      {
        id: 'fIoBpuYHS0Ouv0FeDGx5jg',
        label: 'Test Technologies Set',
        entityType: 'APPLICATION'
      },
      {
        id: 'a0O8VEYmSU2GUIVfvuBUEA',
        label: 'SC (with brackets)',
        entityType: 'APPLICATION'
      },
      {
        id: '9als3H8hRAqSaXsR7Slshw',
        label: 'Shop',
        entityType: 'APPLICATION'
      },
      {
        id: 'wrC8uSdaSHSHtNZq8YIw9w',
        label: 'All AWS Components',
        entityType: 'APPLICATION'
      }
    ],
    service: {
      id: '5042d146667518a1a5017644946b8650aafca44c',
      label: 'shop',
      types: [],
      technologies: [],
      entityType: 'SERVICE'
    },
    endpoint: {
      id: 'KkQNCKd9LdBMqqmfGVuhtVnXsAI',
      label: 'GET /shop',
      type: 'HTTP',
      serviceId: '',
      technologies: [],
      entityType: 'ENDPOINT'
    },
    physicalContext: {
      process: {
        id: 'Fo1b_SCs2HYRdA1nR9kVGW2ZRgA',
        time: 1560831016000,
        label: 'Instana Demo - Shop Service 0.0.1',
        plugin: 'springbootApplicationContainer'
      },
      container: {
        id: 'DjdvUBaAiifhNunVtMD4FSJfCDw',
        time: 1560830937000,
        label: '/shop',
        plugin: 'docker'
      },
      host: {
        id: 'DrDCT_PLWmoCGyHPZ6jDM_Vt8w4',
        time: 1560830559000,
        label: 'ip-172-31-16-127.ec2.internal',
        plugin: 'host'
      },
      zone: {
        id: 'DqbOBPSFtQUIIlNLuUnxXNSGgl4',
        time: 1560805527000,
        label: 'Service Cluster',
        plugin: 'genericZone'
      },
      cluster: null
    }
  },
  destination: {
    applications: [
      {
        id: 'MQLskXfATwaoqZfEVxEitg',
        label: 'With quotes """""',
        entityType: 'APPLICATION'
      },
      {
        id: 'j4Lli9InT5OL3_9A74tp9g',
        label: 'Demo',
        entityType: 'APPLICATION'
      },
      {
        id: 'nPdJN2jQQl204KwJwhYmbQ',
        label: 'Service Cluster',
        entityType: 'APPLICATION'
      },
      {
        id: 'rLBelBBcRWuBNpOcOqHMcA',
        label: 'yiquan test',
        entityType: 'APPLICATION'
      },
      {
        id: 'wrC8uSdaSHSHtNZq8YIw9w',
        label: 'All AWS Components',
        entityType: 'APPLICATION'
      },
      {
        id: 'aQbvtzgeSHKXGjQWQOoUPA',
        label: 'marathon',
        entityType: 'APPLICATION'
      },
      {
        id: 'Ygu5Pst6QW2_-5Tr0CbLCQ',
        label: 'Kuberbac',
        entityType: 'APPLICATION'
      },
      {
        id: 'h2Qy2ZkVRV2mCspAvyTLQw',
        label: 'All',
        entityType: 'APPLICATION'
      },
      {
        id: 'FimCxphHSFiWSOU2YEYrrw',
        label: 'Not shop',
        entityType: 'APPLICATION'
      },
      {
        id: 'a0O8VEYmSU2GUIVfvuBUEA',
        label: 'SC (with brackets)',
        entityType: 'APPLICATION'
      },
      {
        id: 'fIoBpuYHS0Ouv0FeDGx5jg',
        label: 'Test Technologies Set',
        entityType: 'APPLICATION'
      }
    ],
    service: {
      id: '0852e7761b43b8494956b2831f9a8270f4628e53',
      label: 'productsearch',
      types: [],
      technologies: [],
      entityType: 'SERVICE'
    },
    endpoint: {
      id: 'ta1tvXKnYyl-V25MlifjE38RnoM',
      label: 'GET /productsearch',
      type: 'HTTP',
      serviceId: '',
      technologies: [],
      entityType: 'ENDPOINT'
    },
    physicalContext: {
      process: {
        id: '1QS2RVkIT1ip4eqkBMzXoT07LiU',
        time: 1560831057000,
        label: 'Instana Demo - Product Search 0.0.1',
        plugin: 'springbootApplicationContainer'
      },
      container: {
        id: 'tNk1AWYh2SOxtn0kbHoGQifN9pU',
        time: 1560831006000,
        label: '/productsearch',
        plugin: 'docker'
      },
      host: {
        id: 'DrDCT_PLWmoCGyHPZ6jDM_Vt8w4',
        time: 1560830559000,
        label: 'ip-172-31-16-127.ec2.internal',
        plugin: 'host'
      },
      zone: {
        id: 'DqbOBPSFtQUIIlNLuUnxXNSGgl4',
        time: 1560805527000,
        label: 'Service Cluster',
        plugin: 'genericZone'
      },
      cluster: null
    }
  },
  spans: [
    {
      name: 'spring-rest',
      kind: 'EXIT',
      start: 1560842704107,
      duration: 2,
      errorCount: 1,
      stackTrace: [
        {
          file: 'org.springframework.http.client.AbstractClientHttpRequest',
          method: 'execute',
          line: '52'
        },
        {
          file: 'org.springframework.web.client.RestTemplate',
          method: 'doExecute',
          line: '619'
        },
        {
          file: 'org.springframework.web.client.RestTemplate',
          method: 'execute',
          line: '580'
        },
        {
          file: 'org.springframework.web.client.RestTemplate',
          method: 'getForObject',
          line: '287'
        },
        {
          file: 'com.instanademo.ShopController',
          method: 'getProductFromSearch',
          line: '231'
        },
        {
          file: 'com.instanademo.ShopController',
          method: 'shop',
          line: '130'
        },
        {
          file: 'org.springframework.web.method.support.InvocableHandlerMethod',
          method: 'doInvoke',
          line: '221'
        },
        {
          file: 'org.springframework.web.method.support.InvocableHandlerMethod',
          method: 'invokeForRequest',
          line: '136'
        },
        {
          file: 'org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod',
          method: 'invokeAndHandle',
          line: '114'
        },
        {
          file: 'org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter',
          method: 'invokeHandlerMethod',
          line: '827'
        },
        {
          file: 'org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter',
          method: 'handleInternal',
          line: '738'
        },
        {
          file: 'org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter',
          method: 'handle',
          line: '85'
        },
        {
          file: 'org.springframework.web.servlet.DispatcherServlet',
          method: 'doDispatch',
          line: '963'
        },
        {
          file: 'org.springframework.web.servlet.DispatcherServlet',
          method: 'doService',
          line: '897'
        },
        {
          file: 'org.springframework.web.servlet.FrameworkServlet',
          method: 'processRequest',
          line: '970'
        },
        {
          file: 'org.springframework.web.servlet.FrameworkServlet',
          method: 'doGet',
          line: '861'
        },
        {
          file: 'javax.servlet.http.HttpServlet',
          method: 'service',
          line: '622'
        },
        {
          file: 'org.springframework.web.servlet.FrameworkServlet',
          method: 'service',
          line: '846'
        },
        {
          file: 'javax.servlet.http.HttpServlet',
          method: 'service',
          line: '729'
        }
      ],
      data: {
        http: {
          path: '/productsearch',
          protocol: 'http',
          method: 'GET',
          size: '22',
          host: 'ip-172-31-16-127.ec2.internal:85',
          params: 'name=demoproduct-365324048',
          url: 'http://ip-172-31-16-127.ec2.internal:85/productsearch',
          status: '500'
        }
      }
    },
    {
      name: 'spring-web',
      kind: 'ENTRY',
      start: 1560842704107,
      duration: 2,
      errorCount: 1,
      stackTrace: [],
      data: {
        http: {
          rawUrl: '/productsearch',
          path: '/productsearch',
          method: 'GET',
          headerSearch: [
            'user-agent=Java/1.8.0_72-internal',
            'accept=text/plain, application/json, application/*+json, */*'
          ],
          host: 'ip-172-31-16-127.ec2.internal:85',
          header: {
            'user-agent': 'Java/1.8.0_72-internal',
            accept: 'text/plain, application/json, application/*+json, */*'
          },
          params: 'name=demoproduct-365324048',
          path_tpl: '/productsearch',
          status: '500'
        }
      }
    }
  ],
  logs: [
    {
      name: 'log.slf4j',
      kind: null,
      start: 1560842704109,
      duration: 0,
      errorCount: 1,
      stackTrace: [
        {
          file: 'ch.qos.logback.classic.Logger',
          method: 'error',
          line: '522'
        },
        {
          file: 'com.instanademo.ProductSearchController',
          method: 'searchProduct',
          line: '128'
        },
        {
          file: 'org.springframework.web.method.support.InvocableHandlerMethod',
          method: 'doInvoke',
          line: '221'
        },
        {
          file: 'org.springframework.web.method.support.InvocableHandlerMethod',
          method: 'invokeForRequest',
          line: '136'
        },
        {
          file: 'org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod',
          method: 'invokeAndHandle',
          line: '114'
        },
        {
          file: 'org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter',
          method: 'invokeHandlerMethod',
          line: '827'
        }
      ],
      data: {
        log: {
          message: 'ES cluster not healthy - return 500'
        }
      }
    }
  ],
  synthetic: false
};
