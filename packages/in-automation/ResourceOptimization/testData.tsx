/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export const testData = {
  recommendedActions: [
    {
      id: '638625938196419:2024-10-09T16:45:21Z',
      name: 'Move Container Pod openshift-console/downloads-76489d6548-cq7l5 from worker2.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"openshift-console/downloads-76489d6548-cq7l5" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187693,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196419',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196564:2024-10-09T18:25:21Z',
      name: 'Provision Virtual Machine similar to worker3.zturbo.cp.fyre.ibm.com',
      description: 'Clone worker3.zturbo.cp.fyre.ibm.com on cloned openshift-monitoring/prometheus-k8s-1',
      actionType: 'PROVISION',
      actionCategory: 'PERFORMANCE_ASSURANCE',
      impactedServices: 0,
      createdDate: 1728501187693,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196564',
      targetClass: 'VirtualMachine'
    },
    {
      id: '638627166984448:2024-10-09T19:05:21Z',
      name: 'Move Container Pod openshift-kube-storage-version-migrator/migrator-74c47b59fb-2clhx from worker4.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description:
        '"openshift-kube-storage-version-migrator/migrator-74c47b59fb-2clhx" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187693,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638627166984448',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196422:2024-10-09T04:25:21Z',
      name: 'Move Container Pod openshift-monitoring/thanos-querier-5f8b5bb66d-d79bh from worker2.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"openshift-monitoring/thanos-querier-5f8b5bb66d-d79bh" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187692,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196422',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196462:2024-10-08T00:55:21Z',
      name: 'Move Container Pod openshift-kube-scheduler/openshift-kube-scheduler-guard-master1.zturbo.cp.fyre.ibm.com from master1.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description:
        '"openshift-kube-scheduler/openshift-kube-scheduler-guard-master1.zturbo.cp.fyre.ibm.com" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187691,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196462',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196423:2024-10-08T16:55:21Z',
      name: 'Move Container Pod openshift-network-diagnostics/network-check-source-648896c45f-wjrcv from worker4.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description:
        '"openshift-network-diagnostics/network-check-source-648896c45f-wjrcv" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187691,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196423',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196460:2024-10-08T00:55:21Z',
      name: 'Move Container Pod openshift-kube-apiserver/kube-apiserver-guard-master1.zturbo.cp.fyre.ibm.com from master1.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description:
        '"openshift-kube-apiserver/kube-apiserver-guard-master1.zturbo.cp.fyre.ibm.com" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187690,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196460',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196461:2024-10-08T00:55:21Z',
      name: 'Move Container Pod openshift-kube-controller-manager/kube-controller-manager-guard-master1.zturbo.cp.fyre.ibm.com from master1.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description:
        '"openshift-kube-controller-manager/kube-controller-manager-guard-master1.zturbo.cp.fyre.ibm.com" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187690,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196461',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196458:2024-10-08T00:55:21Z',
      name: 'Move Container Pod openshift-kube-scheduler/openshift-kube-scheduler-guard-master0.zturbo.cp.fyre.ibm.com from master0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description:
        '"openshift-kube-scheduler/openshift-kube-scheduler-guard-master0.zturbo.cp.fyre.ibm.com" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187689,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196458',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196459:2024-10-08T00:55:21Z',
      name: 'Move Container Pod openshift-etcd/etcd-guard-master1.zturbo.cp.fyre.ibm.com from master1.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"openshift-etcd/etcd-guard-master1.zturbo.cp.fyre.ibm.com" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187689,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196459',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196456:2024-10-08T00:55:21Z',
      name: 'Move Container Pod openshift-kube-apiserver/kube-apiserver-guard-master0.zturbo.cp.fyre.ibm.com from master0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description:
        '"openshift-kube-apiserver/kube-apiserver-guard-master0.zturbo.cp.fyre.ibm.com" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187688,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196456',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196457:2024-10-08T00:55:21Z',
      name: 'Move Container Pod openshift-kube-controller-manager/kube-controller-manager-guard-master0.zturbo.cp.fyre.ibm.com from master0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description:
        '"openshift-kube-controller-manager/kube-controller-manager-guard-master0.zturbo.cp.fyre.ibm.com" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187688,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196457',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196454:2024-10-08T00:55:21Z',
      name: 'Move Container Pod openshift-kube-scheduler/openshift-kube-scheduler-guard-master2.zturbo.cp.fyre.ibm.com from master2.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description:
        '"openshift-kube-scheduler/openshift-kube-scheduler-guard-master2.zturbo.cp.fyre.ibm.com" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187687,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196454',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196455:2024-10-08T00:55:21Z',
      name: 'Move Container Pod openshift-etcd/etcd-guard-master0.zturbo.cp.fyre.ibm.com from master0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"openshift-etcd/etcd-guard-master0.zturbo.cp.fyre.ibm.com" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187687,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196455',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196452:2024-10-08T00:55:21Z',
      name: 'Move Container Pod openshift-kube-apiserver/kube-apiserver-guard-master2.zturbo.cp.fyre.ibm.com from master2.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description:
        '"openshift-kube-apiserver/kube-apiserver-guard-master2.zturbo.cp.fyre.ibm.com" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187686,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196452',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196453:2024-10-08T00:55:21Z',
      name: 'Move Container Pod openshift-kube-controller-manager/kube-controller-manager-guard-master2.zturbo.cp.fyre.ibm.com from master2.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description:
        '"openshift-kube-controller-manager/kube-controller-manager-guard-master2.zturbo.cp.fyre.ibm.com" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187686,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196453',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196416:2024-10-07T23:05:21Z',
      name: 'Move Container Pod openshift-ingress/router-default-75b95c87bb-xqphr from worker2.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"openshift-ingress/router-default-75b95c87bb-xqphr" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187685,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196416',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196417:2024-10-07T23:05:21Z',
      name: 'Move Container Pod openshift-ingress/router-default-75b95c87bb-zr8fg from worker4.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"openshift-ingress/router-default-75b95c87bb-zr8fg" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187685,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196417',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196451:2024-10-01T18:45:21Z',
      name: 'Move Container Pod openshift-etcd/etcd-guard-master2.zturbo.cp.fyre.ibm.com from master2.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"openshift-etcd/etcd-guard-master2.zturbo.cp.fyre.ibm.com" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187684,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196451',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196560:2024-09-30T19:05:22Z',
      name: 'Reconfigure Container Pod rook-ceph/rook-ceph-osd-1-5bd6f88bcb-wl45k to provide Segmentation',
      description: '"rook-ceph/rook-ceph-osd-1-5bd6f88bcb-wl45k" doesn\'t comply with "Movetoworker3"',
      actionType: 'RECONFIGURE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187683,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196560',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196561:2024-09-30T19:05:22Z',
      name: 'Reconfigure Container Pod rook-ceph/rook-ceph-osd-4-5c9db8f57c-mj85t to provide Segmentation',
      description: '"rook-ceph/rook-ceph-osd-4-5c9db8f57c-mj85t" doesn\'t comply with "Movetoworker3"',
      actionType: 'RECONFIGURE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187683,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196561',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196562:2024-09-30T19:05:22Z',
      name: 'Reconfigure Container Pod rook-ceph/rook-ceph-crashcollector-worker4.zturbo.cp.fyre.ibm.com-68bjf6d to provide Segmentation',
      description:
        '"rook-ceph/rook-ceph-crashcollector-worker4.zturbo.cp.fyre.ibm.com-68bjf6d" doesn\'t comply with "Movetoworker3"',
      actionType: 'RECONFIGURE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187683,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196562',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196563:2024-09-30T19:05:22Z',
      name: 'Reconfigure Container Pod rook-ceph/rook-ceph-mon-m-6f84966cbb-vfl4s to provide Segmentation',
      description: '"rook-ceph/rook-ceph-mon-m-6f84966cbb-vfl4s" doesn\'t comply with "Movetoworker3"',
      actionType: 'RECONFIGURE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187683,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196563',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196556:2024-09-30T19:05:22Z',
      name: 'Reconfigure Container Pod rook-ceph/rook-ceph-osd-0-596d4788f6-cn8zb to provide Segmentation',
      description: '"rook-ceph/rook-ceph-osd-0-596d4788f6-cn8zb" doesn\'t comply with "Movetoworker3"',
      actionType: 'RECONFIGURE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187682,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196556',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196557:2024-09-30T19:05:22Z',
      name: 'Reconfigure Container Pod rook-ceph/rook-ceph-osd-3-5f79cc6dc8-dqq9m to provide Segmentation',
      description: '"rook-ceph/rook-ceph-osd-3-5f79cc6dc8-dqq9m" doesn\'t comply with "Movetoworker3"',
      actionType: 'RECONFIGURE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187682,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196557',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196558:2024-09-30T19:05:22Z',
      name: 'Reconfigure Container Pod rook-ceph/rook-ceph-crashcollector-worker1.zturbo.cp.fyre.ibm.com-6c7f5xh to provide Segmentation',
      description:
        '"rook-ceph/rook-ceph-crashcollector-worker1.zturbo.cp.fyre.ibm.com-6c7f5xh" doesn\'t comply with "Movetoworker3"',
      actionType: 'RECONFIGURE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187682,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196558',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196559:2024-09-30T19:05:22Z',
      name: 'Reconfigure Container Pod rook-ceph/rook-ceph-mon-k-77797c9785-ztnmn to provide Segmentation',
      description: '"rook-ceph/rook-ceph-mon-k-77797c9785-ztnmn" doesn\'t comply with "Movetoworker3"',
      actionType: 'RECONFIGURE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187682,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196559',
      targetClass: 'ContainerPod'
    },
    {
      id: '638610516393360:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/market-66d59d7ff8-gdpdh from worker5.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/market-66d59d7ff8-gdpdh" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187681,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638610516393360',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196555:2024-09-30T19:05:22Z',
      name: 'Reconfigure Container Pod rook-ceph/rook-ceph-crashcollector-worker0.zturbo.cp.fyre.ibm.com-74hgzpc to provide Segmentation',
      description:
        '"rook-ceph/rook-ceph-crashcollector-worker0.zturbo.cp.fyre.ibm.com-74hgzpc" doesn\'t comply with "Movetoworker3"',
      actionType: 'RECONFIGURE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187681,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196555',
      targetClass: 'ContainerPod'
    },
    {
      id: '638610731783104:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/cost-56479b994f-dt4gm from worker5.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/cost-56479b994f-dt4gm" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187680,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638610731783104',
      targetClass: 'ContainerPod'
    },
    {
      id: '638610923781520:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/history-747d6c976-ms9c8 from worker5.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/history-747d6c976-ms9c8" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187680,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638610923781520',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196449:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/clustermgr-78d457d96c-4x795 from worker5.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/clustermgr-78d457d96c-4x795" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187679,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196449',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196447:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/rsyslog-6c6f89ccf8-sb8z9 from worker4.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/rsyslog-6c6f89ccf8-sb8z9" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187678,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196447',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196448:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/ui-5b8b7fb456-7z2l9 from worker4.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/ui-5b8b7fb456-7z2l9" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187678,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196448',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196446:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/server-power-modeler-6c9cc9574b-dx9xk from worker0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/server-power-modeler-6c9cc9574b-dx9xk" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187677,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196446',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196444:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/db-59ccbdb45b-v2r6f from worker1.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/db-59ccbdb45b-v2r6f" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187676,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196444',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196445:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/zookeeper-66bd985cfc-95dwg from worker1.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/zookeeper-66bd985cfc-95dwg" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187676,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196445',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196443:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/action-orchestrator-7c6494c744-hjn45 from worker1.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/action-orchestrator-7c6494c744-hjn45" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187675,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196443',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196441:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/t8c-operator-ccf78cdcd-7zgjn from worker0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/t8c-operator-ccf78cdcd-7zgjn" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187674,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196441',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196442:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/api-d66458544-7x4h7 from worker0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/api-d66458544-7x4h7" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187674,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196442',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196440:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/suspend-7986489cdf-zzhnl from worker0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/suspend-7986489cdf-zzhnl" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187673,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196440',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196439:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/redis-7fdb48d7f9-qstdk from worker0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/redis-7fdb48d7f9-qstdk" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187672,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196439',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196437:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/nginx-5b4d69c8b6-w8lwl from worker0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/nginx-5b4d69c8b6-w8lwl" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187671,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196437',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196438:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/prometheus-kube-state-metrics-5686b46ccc-q95hj from worker0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/prometheus-kube-state-metrics-5686b46ccc-q95hj" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187671,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196438',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196436:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/kafka-cc7d78dd4-xd7vc from worker0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/kafka-cc7d78dd4-xd7vc" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187670,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196436',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196434:2024-09-30T19:05:22Z',
      name: 'Move Container Pod rook-ceph/rook-ceph-operator-6df5b5bfd7-tfx9j from worker0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"rook-ceph/rook-ceph-operator-6df5b5bfd7-tfx9j" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187669,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196434',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196435:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/consul-5876997977-cxtcp from worker0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/consul-5876997977-cxtcp" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187669,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196435',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196433:2024-09-30T19:05:22Z',
      name: 'Move Container Pod kubeturbo-operator/kubeturbo-operator-56d55f8dff-vrt7b from worker0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"kubeturbo-operator/kubeturbo-operator-56d55f8dff-vrt7b" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187668,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196433',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196431:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/telemetry-7f4f947b77-ld649 from worker2.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/telemetry-7f4f947b77-ld649" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187667,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196431',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196432:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/prometheus-server-846d8b9f95-nk5c4 from worker2.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/prometheus-server-846d8b9f95-nk5c4" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187667,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196432',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196430:2024-09-30T19:05:22Z',
      name: 'Move Container Pod openshift-monitoring/prometheus-operator-admission-webhook-76776d7749-f9gvv from worker2.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description:
        '"openshift-monitoring/prometheus-operator-admission-webhook-76776d7749-f9gvv" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187666,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196430',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196428:2024-09-30T19:05:22Z',
      name: 'Move Container Pod rook-ceph/csi-cephfsplugin-provisioner-64fb879689-hf7mw from worker1.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"rook-ceph/csi-cephfsplugin-provisioner-64fb879689-hf7mw" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187665,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196428',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196429:2024-09-30T19:05:22Z',
      name: 'Move Container Pod rook-ceph/csi-rbdplugin-provisioner-7db5f4d577-57g2l from worker1.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"rook-ceph/csi-rbdplugin-provisioner-7db5f4d577-57g2l" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187665,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196429',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196427:2024-09-30T19:05:22Z',
      name: 'Move Container Pod rook-ceph/rook-ceph-mgr-a-784fbb6668-8pbqt from worker2.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"rook-ceph/rook-ceph-mgr-a-784fbb6668-8pbqt" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187664,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196427',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196426:2024-09-30T19:05:22Z',
      name: 'Move Container Pod rook-ceph/rook-ceph-mds-myfs-b-65f7dd7867-7rt6b from worker0.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"rook-ceph/rook-ceph-mds-myfs-b-65f7dd7867-7rt6b" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187663,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196426',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196424:2024-09-30T19:05:22Z',
      name: 'Move Container Pod openshift-monitoring/kube-state-metrics-58d76bf89b-xfj89 from worker4.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"openshift-monitoring/kube-state-metrics-58d76bf89b-xfj89" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187662,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196424',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196425:2024-09-30T19:05:22Z',
      name: 'Move Container Pod openshift-monitoring/openshift-state-metrics-ff95cf97b-7qvgm from worker4.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description:
        '"openshift-monitoring/openshift-state-metrics-ff95cf97b-7qvgm" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187662,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196425',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196420:2024-09-30T19:05:22Z',
      name: 'Move Container Pod openshift-monitoring/alertmanager-main-0 from worker2.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"openshift-monitoring/alertmanager-main-0" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187661,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196420',
      targetClass: 'ContainerPod'
    },
    {
      id: '638638379782656:2024-10-09T19:05:21Z',
      name: 'Move Container Pod instana-agent/controller-manager-7d8c89b6c5-gbqzg from worker3.zturbo.cp.fyre.ibm.com to worker2.zturbo.cp.fyre.ibm.com',
      description: 'Improve overall performance',
      actionType: 'MOVE',
      actionCategory: 'PREVENTION',
      impactedServices: 0,
      createdDate: 1728501187660,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638638379782656',
      targetClass: 'ContainerPod'
    },
    {
      id: '638625938196418:2024-09-30T19:05:22Z',
      name: 'Move Container Pod openshift-monitoring/prometheus-k8s-0 from worker2.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"openshift-monitoring/prometheus-k8s-0" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728501187660,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196418',
      targetClass: 'ContainerPod'
    },
    {
      id: '638610626186192:2024-09-30T19:05:22Z',
      name: 'Move Container Pod turbonomic/mediation-webhook-8555bdf84c-c2vwz from worker5.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
      description: '"turbonomic/mediation-webhook-8555bdf84c-c2vwz" doesn\'t comply with "Movetoworker3"',
      actionType: 'MOVE',
      actionCategory: 'COMPLIANCE',
      impactedServices: 0,
      createdDate: 1728500587645,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638610626186192',
      targetClass: 'ContainerPod'
    },
    {
      id: '638638350980544:2024-10-09T18:35:21Z',
      name: 'Move Container Pod instana-agent/controller-manager-7d8c89b6c5-gbqzg from worker3.zturbo.cp.fyre.ibm.com to worker5.zturbo.cp.fyre.ibm.com',
      description: 'Improve overall performance',
      actionType: 'MOVE',
      actionCategory: 'PREVENTION',
      impactedServices: 0,
      createdDate: 1728500587621,
      actionDetailsURL:
        'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638638350980544',
      targetClass: 'ContainerPod'
    }
  ],
  actionTypesCount: {
    MOVE: 52,
    PROVISION: 1,
    RECONFIGURE: 9
  },
  actionCategoriesCount: {
    COMPLIANCE: 59,
    PREVENTION: 2,
    PERFORMANCE_ASSURANCE: 1
  },
  totalRecommendedActionsCount: 62
};

export const recommendedList = { data: testData.recommendedActions, erros: [], progress: { loading: false } };
