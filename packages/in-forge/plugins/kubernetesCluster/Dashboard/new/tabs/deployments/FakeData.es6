import { fromJS } from 'immutable';

export default function FakeData() {
  return fromJS({
    dependencies: [],
    embedded: [],
    from: 1505289107000,
    entityId: {
      host: '',
      pluginId: 'com.instana.forge.infrastructure.paas.kubernetes.KubernetesCluster',
      steadyId: 'localhost'
    },
    id: 'K7zx-SJMCaS7nnLwDXjcTgV9n1A',
    label: 'Kubernetes Cluster',
    plugin: 'kubernetesCluster',
    to: 1505290441000,
    volatileId: {
      entity_id: 'localhost',
      host_id: 'be:4e:36:ff:fe:a4:57:8d',
      sensor_name: 'com.instana.plugin.kubernetes'
    },
    data: {
      clusterId: '34.201.209.64',
      pods: {
        data: {
          'instana-agent:instana-agent-cghx1': {
            hostIp: '172.20.46.234',
            podIp: '172.20.46.234',
            phase: 'Running',
            containers: {
              data: {
                'docker://53319c96c674691f7dba2b3d8012da5ab8617ffd21d6006fa68ad0431831a351': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'instana-agent',
                  uid: 'docker://53319c96c674691f7dba2b3d8012da5ab8617ffd21d6006fa68ad0431831a351',
                  id: 'docker://53319c96c674691f7dba2b3d8012da5ab8617ffd21d6006fa68ad0431831a351',
                  image: 'instana/agent:latest'
                }
              },
              itemIds: ['docker://53319c96c674691f7dba2b3d8012da5ab8617ffd21d6006fa68ad0431831a351']
            },
            name: 'instana-agent-cghx1',
            namespace: 'instana-agent',
            uid: '343f0198-9860-11e7-acc5-027253a6576e',
            labels: {
              app: 'instana-agent',
              'controller-revision-hash': '2096616296',
              'pod-template-generation': '1'
            },
            owners: {
              DaemonSet: '343a7297-9860-11e7-acc5-027253a6576e'
            }
          },
          'instana-agent:instana-agent-kf8wl': {
            hostIp: '172.20.91.235',
            podIp: '172.20.91.235',
            phase: 'Running',
            containers: {
              data: {
                'docker://a4017ac0182eff753d2d8fcd7347033e97d0c1a309ca3209989e9d1835c9ab60': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'instana-agent',
                  uid: 'docker://a4017ac0182eff753d2d8fcd7347033e97d0c1a309ca3209989e9d1835c9ab60',
                  id: 'docker://a4017ac0182eff753d2d8fcd7347033e97d0c1a309ca3209989e9d1835c9ab60',
                  image: 'instana/agent:latest'
                }
              },
              itemIds: ['docker://a4017ac0182eff753d2d8fcd7347033e97d0c1a309ca3209989e9d1835c9ab60']
            },
            name: 'instana-agent-kf8wl',
            namespace: 'instana-agent',
            uid: '343ee3da-9860-11e7-acc5-027253a6576e',
            labels: {
              app: 'instana-agent',
              'controller-revision-hash': '2096616296',
              'pod-template-generation': '1'
            },
            owners: {
              DaemonSet: '343a7297-9860-11e7-acc5-027253a6576e'
            }
          },
          'instana-agent:instana-agent-nfds0': {
            hostIp: '172.20.118.192',
            podIp: '172.20.118.192',
            phase: 'Running',
            containers: {
              data: {
                'docker://93b208a82d28f93548c9f4703ea7401dbd7ea8d13c134b0785acdff1a1031e16': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'instana-agent',
                  uid: 'docker://93b208a82d28f93548c9f4703ea7401dbd7ea8d13c134b0785acdff1a1031e16',
                  id: 'docker://93b208a82d28f93548c9f4703ea7401dbd7ea8d13c134b0785acdff1a1031e16',
                  image: 'instana/agent:latest'
                }
              },
              itemIds: ['docker://93b208a82d28f93548c9f4703ea7401dbd7ea8d13c134b0785acdff1a1031e16']
            },
            name: 'instana-agent-nfds0',
            namespace: 'instana-agent',
            uid: '343e906f-9860-11e7-acc5-027253a6576e',
            labels: {
              app: 'instana-agent',
              'controller-revision-hash': '2096616296',
              'pod-template-generation': '1'
            },
            owners: {
              DaemonSet: '343a7297-9860-11e7-acc5-027253a6576e'
            }
          },
          'instana-agent:instana-agent-szhl8': {
            hostIp: '172.20.74.127',
            podIp: '172.20.74.127',
            phase: 'Running',
            containers: {
              data: {
                'docker://c3909eaeaeae6003b7b3dfe9b77685498ef62553be9c7b79abc2c1f1796c9338': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'instana-agent',
                  uid: 'docker://c3909eaeaeae6003b7b3dfe9b77685498ef62553be9c7b79abc2c1f1796c9338',
                  id: 'docker://c3909eaeaeae6003b7b3dfe9b77685498ef62553be9c7b79abc2c1f1796c9338',
                  image: 'instana/agent:latest'
                }
              },
              itemIds: ['docker://c3909eaeaeae6003b7b3dfe9b77685498ef62553be9c7b79abc2c1f1796c9338']
            },
            name: 'instana-agent-szhl8',
            namespace: 'instana-agent',
            uid: '343ed328-9860-11e7-acc5-027253a6576e',
            labels: {
              app: 'instana-agent',
              'controller-revision-hash': '2096616296',
              'pod-template-generation': '1'
            },
            owners: {
              DaemonSet: '343a7297-9860-11e7-acc5-027253a6576e'
            }
          },
          'instana-agent:instana-agent-xlpm9': {
            hostIp: '172.20.33.90',
            podIp: '172.20.33.90',
            phase: 'Running',
            containers: {
              data: {
                'docker://7806c9e59d87fe505418c1214b6dd72ea5b0e0fdadd90827bd3b6c3287f3fb17': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'instana-agent',
                  uid: 'docker://7806c9e59d87fe505418c1214b6dd72ea5b0e0fdadd90827bd3b6c3287f3fb17',
                  id: 'docker://7806c9e59d87fe505418c1214b6dd72ea5b0e0fdadd90827bd3b6c3287f3fb17',
                  image: 'instana/agent:latest'
                }
              },
              itemIds: ['docker://7806c9e59d87fe505418c1214b6dd72ea5b0e0fdadd90827bd3b6c3287f3fb17']
            },
            name: 'instana-agent-xlpm9',
            namespace: 'instana-agent',
            uid: '343eb8a1-9860-11e7-acc5-027253a6576e',
            labels: {
              app: 'instana-agent',
              'controller-revision-hash': '2096616296',
              'pod-template-generation': '1'
            },
            owners: {
              DaemonSet: '343a7297-9860-11e7-acc5-027253a6576e'
            }
          },
          'kube-system:dns-controller-1163813304-8m9w0': {
            hostIp: '172.20.74.127',
            podIp: '172.20.74.127',
            phase: 'Running',
            containers: {
              data: {
                'docker://fbb9eced3dae660cd58157ddc9fc6c5de166cda23a241f2813c6e96544120d08': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'dns-controller',
                  uid: 'docker://fbb9eced3dae660cd58157ddc9fc6c5de166cda23a241f2813c6e96544120d08',
                  id: 'docker://fbb9eced3dae660cd58157ddc9fc6c5de166cda23a241f2813c6e96544120d08',
                  image: 'kope/dns-controller:1.7.1'
                }
              },
              itemIds: ['docker://fbb9eced3dae660cd58157ddc9fc6c5de166cda23a241f2813c6e96544120d08']
            },
            name: 'dns-controller-1163813304-8m9w0',
            namespace: 'kube-system',
            uid: '5a6dfb84-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-addon': 'dns-controller.addons.k8s.io',
              'k8s-app': 'dns-controller',
              'pod-template-hash': '1163813304',
              version: 'v1.7.1'
            },
            owners: {
              ReplicaSet: '5a698814-985d-11e7-acc5-027253a6576e'
            }
          },
          'kube-system:etcd-server-events-ip-172-20-118-192.ec2.internal': {
            hostIp: '172.20.118.192',
            podIp: '172.20.118.192',
            phase: 'Running',
            containers: {
              data: {
                'docker://aa44513062464490953afdb479ce16d48428043c93e036152c6951b984d019ef': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'etcd-container',
                  uid: 'docker://aa44513062464490953afdb479ce16d48428043c93e036152c6951b984d019ef',
                  id: 'docker://aa44513062464490953afdb479ce16d48428043c93e036152c6951b984d019ef',
                  image: 'gcr.io/google_containers/etcd:2.2.1'
                }
              },
              itemIds: ['docker://aa44513062464490953afdb479ce16d48428043c93e036152c6951b984d019ef']
            },
            name: 'etcd-server-events-ip-172-20-118-192.ec2.internal',
            namespace: 'kube-system',
            uid: '75fc6434-985d-11e7-bdb8-06a0ce04c50c',
            labels: {
              'k8s-app': 'etcd-server-events'
            }
          },
          'kube-system:etcd-server-events-ip-172-20-46-234.ec2.internal': {
            hostIp: '172.20.46.234',
            podIp: '172.20.46.234',
            phase: 'Running',
            containers: {
              data: {
                'docker://9744f4be6cfe4e54cf7f007b995b59731e34a4baeed09f1bfdcb3f67845b4137': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'etcd-container',
                  uid: 'docker://9744f4be6cfe4e54cf7f007b995b59731e34a4baeed09f1bfdcb3f67845b4137',
                  id: 'docker://9744f4be6cfe4e54cf7f007b995b59731e34a4baeed09f1bfdcb3f67845b4137',
                  image: 'gcr.io/google_containers/etcd:2.2.1'
                }
              },
              itemIds: ['docker://9744f4be6cfe4e54cf7f007b995b59731e34a4baeed09f1bfdcb3f67845b4137']
            },
            name: 'etcd-server-events-ip-172-20-46-234.ec2.internal',
            namespace: 'kube-system',
            uid: '6f9a762a-985d-11e7-b88c-0efdf82c16e6',
            labels: {
              'k8s-app': 'etcd-server-events'
            }
          },
          'kube-system:etcd-server-events-ip-172-20-74-127.ec2.internal': {
            hostIp: '172.20.74.127',
            podIp: '172.20.74.127',
            phase: 'Running',
            containers: {
              data: {
                'docker://4aa5e6059f1bc1247b311ad2624fbd5e9d9d6d2d177842705b9f6b53cd337f70': {
                  state: 'running',
                  restartCount: 1,
                  namespace: 'etcd-container',
                  uid: 'docker://4aa5e6059f1bc1247b311ad2624fbd5e9d9d6d2d177842705b9f6b53cd337f70',
                  id: 'docker://4aa5e6059f1bc1247b311ad2624fbd5e9d9d6d2d177842705b9f6b53cd337f70',
                  image: 'gcr.io/google_containers/etcd:2.2.1'
                }
              },
              itemIds: ['docker://4aa5e6059f1bc1247b311ad2624fbd5e9d9d6d2d177842705b9f6b53cd337f70']
            },
            name: 'etcd-server-events-ip-172-20-74-127.ec2.internal',
            namespace: 'kube-system',
            uid: '6d43b8fc-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-app': 'etcd-server-events'
            }
          },
          'kube-system:etcd-server-ip-172-20-118-192.ec2.internal': {
            hostIp: '172.20.118.192',
            podIp: '172.20.118.192',
            phase: 'Running',
            containers: {
              data: {
                'docker://c6e6b42965f4dc08b19cb31f5143092309ce518df902745401202114007a8f7b': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'etcd-container',
                  uid: 'docker://c6e6b42965f4dc08b19cb31f5143092309ce518df902745401202114007a8f7b',
                  id: 'docker://c6e6b42965f4dc08b19cb31f5143092309ce518df902745401202114007a8f7b',
                  image: 'gcr.io/google_containers/etcd:2.2.1'
                }
              },
              itemIds: ['docker://c6e6b42965f4dc08b19cb31f5143092309ce518df902745401202114007a8f7b']
            },
            name: 'etcd-server-ip-172-20-118-192.ec2.internal',
            namespace: 'kube-system',
            uid: '81e7d4e8-985d-11e7-bdb8-06a0ce04c50c',
            labels: {
              'k8s-app': 'etcd-server'
            }
          },
          'kube-system:etcd-server-ip-172-20-46-234.ec2.internal': {
            hostIp: '172.20.46.234',
            podIp: '172.20.46.234',
            phase: 'Running',
            containers: {
              data: {
                'docker://e932aff364440e72081e5938b109f710fecf21ba48d3f108a90c20ede52ca57a': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'etcd-container',
                  uid: 'docker://e932aff364440e72081e5938b109f710fecf21ba48d3f108a90c20ede52ca57a',
                  id: 'docker://e932aff364440e72081e5938b109f710fecf21ba48d3f108a90c20ede52ca57a',
                  image: 'gcr.io/google_containers/etcd:2.2.1'
                }
              },
              itemIds: ['docker://e932aff364440e72081e5938b109f710fecf21ba48d3f108a90c20ede52ca57a']
            },
            name: 'etcd-server-ip-172-20-46-234.ec2.internal',
            namespace: 'kube-system',
            uid: '7aed0d8f-985d-11e7-b88c-0efdf82c16e6',
            labels: {
              'k8s-app': 'etcd-server'
            }
          },
          'kube-system:etcd-server-ip-172-20-74-127.ec2.internal': {
            hostIp: '172.20.74.127',
            podIp: '172.20.74.127',
            phase: 'Running',
            containers: {
              data: {
                'docker://859849966f8fc55bc1ee3928d4d74f23e490ec9dc5f7536080de57aeae232013': {
                  state: 'running',
                  restartCount: 1,
                  namespace: 'etcd-container',
                  uid: 'docker://859849966f8fc55bc1ee3928d4d74f23e490ec9dc5f7536080de57aeae232013',
                  id: 'docker://859849966f8fc55bc1ee3928d4d74f23e490ec9dc5f7536080de57aeae232013',
                  image: 'gcr.io/google_containers/etcd:2.2.1'
                }
              },
              itemIds: ['docker://859849966f8fc55bc1ee3928d4d74f23e490ec9dc5f7536080de57aeae232013']
            },
            name: 'etcd-server-ip-172-20-74-127.ec2.internal',
            namespace: 'kube-system',
            uid: '66b51ccf-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-app': 'etcd-server'
            }
          },
          'kube-system:kube-apiserver-ip-172-20-118-192.ec2.internal': {
            hostIp: '172.20.118.192',
            podIp: '172.20.118.192',
            phase: 'Running',
            containers: {
              data: {
                'docker://1835c325c777d126536bec1da1a0cc3a32d4c29530a5bc37eb0a6f66ffdc1852': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kube-apiserver',
                  uid: 'docker://1835c325c777d126536bec1da1a0cc3a32d4c29530a5bc37eb0a6f66ffdc1852',
                  id: 'docker://1835c325c777d126536bec1da1a0cc3a32d4c29530a5bc37eb0a6f66ffdc1852',
                  image: 'gcr.io/google_containers/kube-apiserver:v1.7.2'
                }
              },
              itemIds: ['docker://1835c325c777d126536bec1da1a0cc3a32d4c29530a5bc37eb0a6f66ffdc1852']
            },
            name: 'kube-apiserver-ip-172-20-118-192.ec2.internal',
            namespace: 'kube-system',
            uid: '7d242835-985d-11e7-bdb8-06a0ce04c50c',
            labels: {
              'k8s-app': 'kube-apiserver'
            }
          },
          'kube-system:kube-apiserver-ip-172-20-46-234.ec2.internal': {
            hostIp: '172.20.46.234',
            podIp: '172.20.46.234',
            phase: 'Running',
            containers: {
              data: {
                'docker://95b8a1be34356775aa6653b489012e4a9bbe05a62ebcc81e75ee46cb6994e069': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kube-apiserver',
                  uid: 'docker://95b8a1be34356775aa6653b489012e4a9bbe05a62ebcc81e75ee46cb6994e069',
                  id: 'docker://95b8a1be34356775aa6653b489012e4a9bbe05a62ebcc81e75ee46cb6994e069',
                  image: 'gcr.io/google_containers/kube-apiserver:v1.7.2'
                }
              },
              itemIds: ['docker://95b8a1be34356775aa6653b489012e4a9bbe05a62ebcc81e75ee46cb6994e069']
            },
            name: 'kube-apiserver-ip-172-20-46-234.ec2.internal',
            namespace: 'kube-system',
            uid: '79bbe507-985d-11e7-b88c-0efdf82c16e6',
            labels: {
              'k8s-app': 'kube-apiserver'
            }
          },
          'kube-system:kube-apiserver-ip-172-20-74-127.ec2.internal': {
            hostIp: '172.20.74.127',
            podIp: '172.20.74.127',
            phase: 'Running',
            containers: {
              data: {
                'docker://1c0114cf930ede6cbdded2616327de74210b9eac26c4c3429d82bbe9598b2751': {
                  state: 'running',
                  restartCount: 3,
                  namespace: 'kube-apiserver',
                  uid: 'docker://1c0114cf930ede6cbdded2616327de74210b9eac26c4c3429d82bbe9598b2751',
                  id: 'docker://1c0114cf930ede6cbdded2616327de74210b9eac26c4c3429d82bbe9598b2751',
                  image: 'gcr.io/google_containers/kube-apiserver:v1.7.2'
                }
              },
              itemIds: ['docker://1c0114cf930ede6cbdded2616327de74210b9eac26c4c3429d82bbe9598b2751']
            },
            name: 'kube-apiserver-ip-172-20-74-127.ec2.internal',
            namespace: 'kube-system',
            uid: '7b9195d1-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-app': 'kube-apiserver'
            }
          },
          'kube-system:kube-controller-manager-ip-172-20-118-192.ec2.internal': {
            hostIp: '172.20.118.192',
            podIp: '172.20.118.192',
            phase: 'Running',
            containers: {
              data: {
                'docker://6211221ee9ac5070fc0883eee04d2f4cb5775f799bef8e772059521a532a4536': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kube-controller-manager',
                  uid: 'docker://6211221ee9ac5070fc0883eee04d2f4cb5775f799bef8e772059521a532a4536',
                  id: 'docker://6211221ee9ac5070fc0883eee04d2f4cb5775f799bef8e772059521a532a4536',
                  image: 'gcr.io/google_containers/kube-controller-manager:v1.7.2'
                }
              },
              itemIds: ['docker://6211221ee9ac5070fc0883eee04d2f4cb5775f799bef8e772059521a532a4536']
            },
            name: 'kube-controller-manager-ip-172-20-118-192.ec2.internal',
            namespace: 'kube-system',
            uid: '62504a80-985d-11e7-bdb8-06a0ce04c50c',
            labels: {
              'k8s-app': 'kube-controller-manager'
            }
          },
          'kube-system:kube-controller-manager-ip-172-20-46-234.ec2.internal': {
            hostIp: '172.20.46.234',
            podIp: '172.20.46.234',
            phase: 'Running',
            containers: {
              data: {
                'docker://bb9be28795afd23b7337fda2376b624631852ecc5043c833748478753cd03a3d': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kube-controller-manager',
                  uid: 'docker://bb9be28795afd23b7337fda2376b624631852ecc5043c833748478753cd03a3d',
                  id: 'docker://bb9be28795afd23b7337fda2376b624631852ecc5043c833748478753cd03a3d',
                  image: 'gcr.io/google_containers/kube-controller-manager:v1.7.2'
                }
              },
              itemIds: ['docker://bb9be28795afd23b7337fda2376b624631852ecc5043c833748478753cd03a3d']
            },
            name: 'kube-controller-manager-ip-172-20-46-234.ec2.internal',
            namespace: 'kube-system',
            uid: '6e6a4b0d-985d-11e7-b88c-0efdf82c16e6',
            labels: {
              'k8s-app': 'kube-controller-manager'
            }
          },
          'kube-system:kube-controller-manager-ip-172-20-74-127.ec2.internal': {
            hostIp: '172.20.74.127',
            podIp: '172.20.74.127',
            phase: 'Running',
            containers: {
              data: {
                'docker://5739ea7148c7012704afa28e2ae8454854367ebfc4092f395d6c2352f6bde242': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kube-controller-manager',
                  uid: 'docker://5739ea7148c7012704afa28e2ae8454854367ebfc4092f395d6c2352f6bde242',
                  id: 'docker://5739ea7148c7012704afa28e2ae8454854367ebfc4092f395d6c2352f6bde242',
                  image: 'gcr.io/google_containers/kube-controller-manager:v1.7.2'
                }
              },
              itemIds: ['docker://5739ea7148c7012704afa28e2ae8454854367ebfc4092f395d6c2352f6bde242']
            },
            name: 'kube-controller-manager-ip-172-20-74-127.ec2.internal',
            namespace: 'kube-system',
            uid: '792fa10c-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-app': 'kube-controller-manager'
            }
          },
          'kube-system:kube-dns-479524115-dt76v': {
            hostIp: '172.20.33.90',
            podIp: '100.96.4.3',
            phase: 'Running',
            containers: {
              data: {
                'docker://2bccd5203da4a1199cc8a686ae45e469be9df5390e549b07633bb96465da7719': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'dnsmasq',
                  uid: 'docker://2bccd5203da4a1199cc8a686ae45e469be9df5390e549b07633bb96465da7719',
                  id: 'docker://2bccd5203da4a1199cc8a686ae45e469be9df5390e549b07633bb96465da7719',
                  image: 'gcr.io/google_containers/k8s-dns-dnsmasq-nanny-amd64:1.14.4'
                },
                'docker://ff47d0bcde1a1f75deb45b25c4ba2d0ff163d921d82b1a5142d11d83f56a0511': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kubedns',
                  uid: 'docker://ff47d0bcde1a1f75deb45b25c4ba2d0ff163d921d82b1a5142d11d83f56a0511',
                  id: 'docker://ff47d0bcde1a1f75deb45b25c4ba2d0ff163d921d82b1a5142d11d83f56a0511',
                  image: 'gcr.io/google_containers/k8s-dns-kube-dns-amd64:1.14.4'
                },
                'docker://48666abe95784862bef6ed1335f6541888e784b2fac9d972b11e58db26d1e853': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'sidecar',
                  uid: 'docker://48666abe95784862bef6ed1335f6541888e784b2fac9d972b11e58db26d1e853',
                  id: 'docker://48666abe95784862bef6ed1335f6541888e784b2fac9d972b11e58db26d1e853',
                  image: 'gcr.io/google_containers/k8s-dns-sidecar-amd64:1.14.4'
                }
              },
              itemIds: [
                'docker://ff47d0bcde1a1f75deb45b25c4ba2d0ff163d921d82b1a5142d11d83f56a0511',
                'docker://2bccd5203da4a1199cc8a686ae45e469be9df5390e549b07633bb96465da7719',
                'docker://48666abe95784862bef6ed1335f6541888e784b2fac9d972b11e58db26d1e853'
              ]
            },
            name: 'kube-dns-479524115-dt76v',
            namespace: 'kube-system',
            uid: 'a5535508-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-app': 'kube-dns',
              'pod-template-hash': '479524115'
            },
            owners: {
              ReplicaSet: '5a69fa1b-985d-11e7-acc5-027253a6576e'
            }
          },
          'kube-system:kube-dns-479524115-s4021': {
            hostIp: '172.20.91.235',
            podIp: '100.96.3.2',
            phase: 'Running',
            containers: {
              data: {
                'docker://c90702e3b480e302bc52db9f7c0f301ecafe785912dbe20bd37e44b92a656228': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'dnsmasq',
                  uid: 'docker://c90702e3b480e302bc52db9f7c0f301ecafe785912dbe20bd37e44b92a656228',
                  id: 'docker://c90702e3b480e302bc52db9f7c0f301ecafe785912dbe20bd37e44b92a656228',
                  image: 'gcr.io/google_containers/k8s-dns-dnsmasq-nanny-amd64:1.14.4'
                },
                'docker://2ee0075b4f56137b47d057ca059d731c43ff3e400ca91168174b0bb111601b01': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kubedns',
                  uid: 'docker://2ee0075b4f56137b47d057ca059d731c43ff3e400ca91168174b0bb111601b01',
                  id: 'docker://2ee0075b4f56137b47d057ca059d731c43ff3e400ca91168174b0bb111601b01',
                  image: 'gcr.io/google_containers/k8s-dns-kube-dns-amd64:1.14.4'
                },
                'docker://07e243a12673672cfa281adf9f05cb78b722689c30a57244173f22bd832ddc72': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'sidecar',
                  uid: 'docker://07e243a12673672cfa281adf9f05cb78b722689c30a57244173f22bd832ddc72',
                  id: 'docker://07e243a12673672cfa281adf9f05cb78b722689c30a57244173f22bd832ddc72',
                  image: 'gcr.io/google_containers/k8s-dns-sidecar-amd64:1.14.4'
                }
              },
              itemIds: [
                'docker://2ee0075b4f56137b47d057ca059d731c43ff3e400ca91168174b0bb111601b01',
                'docker://07e243a12673672cfa281adf9f05cb78b722689c30a57244173f22bd832ddc72',
                'docker://c90702e3b480e302bc52db9f7c0f301ecafe785912dbe20bd37e44b92a656228'
              ]
            },
            name: 'kube-dns-479524115-s4021',
            namespace: 'kube-system',
            uid: '5a6e6d76-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-app': 'kube-dns',
              'pod-template-hash': '479524115'
            },
            owners: {
              ReplicaSet: '5a69fa1b-985d-11e7-acc5-027253a6576e'
            }
          },
          'kube-system:kube-dns-autoscaler-1818915203-1jjk8': {
            hostIp: '172.20.33.90',
            podIp: '100.96.4.2',
            phase: 'Running',
            containers: {
              data: {
                'docker://5d5b35da21157665faa032938cc7c03b7fc39457a45e40265301c096e1807673': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'autoscaler',
                  uid: 'docker://5d5b35da21157665faa032938cc7c03b7fc39457a45e40265301c096e1807673',
                  id: 'docker://5d5b35da21157665faa032938cc7c03b7fc39457a45e40265301c096e1807673',
                  image: 'gcr.io/google_containers/cluster-proportional-autoscaler-amd64:1.1.2-r2'
                }
              },
              itemIds: ['docker://5d5b35da21157665faa032938cc7c03b7fc39457a45e40265301c096e1807673']
            },
            name: 'kube-dns-autoscaler-1818915203-1jjk8',
            namespace: 'kube-system',
            uid: '5a6e4bd6-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-app': 'kube-dns-autoscaler',
              'pod-template-hash': '1818915203'
            },
            owners: {
              ReplicaSet: '5a69b6b9-985d-11e7-acc5-027253a6576e'
            }
          },
          'kube-system:kube-proxy-ip-172-20-118-192.ec2.internal': {
            hostIp: '172.20.118.192',
            podIp: '172.20.118.192',
            phase: 'Running',
            containers: {
              data: {
                'docker://5262b06a18b660232c937119716e6e5d94fd6b05bc9dd40ee18cec3e82735f3b': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kube-proxy',
                  uid: 'docker://5262b06a18b660232c937119716e6e5d94fd6b05bc9dd40ee18cec3e82735f3b',
                  id: 'docker://5262b06a18b660232c937119716e6e5d94fd6b05bc9dd40ee18cec3e82735f3b',
                  image: 'gcr.io/google_containers/kube-proxy:v1.7.2'
                }
              },
              itemIds: ['docker://5262b06a18b660232c937119716e6e5d94fd6b05bc9dd40ee18cec3e82735f3b']
            },
            name: 'kube-proxy-ip-172-20-118-192.ec2.internal',
            namespace: 'kube-system',
            uid: '73995630-985d-11e7-bdb8-06a0ce04c50c',
            labels: {
              'k8s-app': 'kube-proxy',
              tier: 'node'
            }
          },
          'kube-system:kube-proxy-ip-172-20-33-90.ec2.internal': {
            hostIp: '172.20.33.90',
            podIp: '172.20.33.90',
            phase: 'Running',
            containers: {
              data: {
                'docker://1c0dae9b88889a3fff2426ea54f8e92be7b410ab31ca8801b875537ade8ea128': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kube-proxy',
                  uid: 'docker://1c0dae9b88889a3fff2426ea54f8e92be7b410ab31ca8801b875537ade8ea128',
                  id: 'docker://1c0dae9b88889a3fff2426ea54f8e92be7b410ab31ca8801b875537ade8ea128',
                  image: 'gcr.io/google_containers/kube-proxy:v1.7.2'
                }
              },
              itemIds: ['docker://1c0dae9b88889a3fff2426ea54f8e92be7b410ab31ca8801b875537ade8ea128']
            },
            name: 'kube-proxy-ip-172-20-33-90.ec2.internal',
            namespace: 'kube-system',
            uid: 'aa4120dd-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-app': 'kube-proxy',
              tier: 'node'
            }
          },
          'kube-system:kube-proxy-ip-172-20-46-234.ec2.internal': {
            hostIp: '172.20.46.234',
            podIp: '172.20.46.234',
            phase: 'Running',
            containers: {
              data: {
                'docker://2b1a4d24c2ff3467ecdf6f475d6ed56fdcbd9e75c17cb103fa3e7fabb0c25e78': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kube-proxy',
                  uid: 'docker://2b1a4d24c2ff3467ecdf6f475d6ed56fdcbd9e75c17cb103fa3e7fabb0c25e78',
                  id: 'docker://2b1a4d24c2ff3467ecdf6f475d6ed56fdcbd9e75c17cb103fa3e7fabb0c25e78',
                  image: 'gcr.io/google_containers/kube-proxy:v1.7.2'
                }
              },
              itemIds: ['docker://2b1a4d24c2ff3467ecdf6f475d6ed56fdcbd9e75c17cb103fa3e7fabb0c25e78']
            },
            name: 'kube-proxy-ip-172-20-46-234.ec2.internal',
            namespace: 'kube-system',
            uid: '880a58fe-985d-11e7-b88c-0efdf82c16e6',
            labels: {
              'k8s-app': 'kube-proxy',
              tier: 'node'
            }
          },
          'kube-system:kube-proxy-ip-172-20-74-127.ec2.internal': {
            hostIp: '172.20.74.127',
            podIp: '172.20.74.127',
            phase: 'Running',
            containers: {
              data: {
                'docker://9d8040308da4ad4210b89969d3c6917e04b6f9d4a574ab01fd197d9098834a3f': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kube-proxy',
                  uid: 'docker://9d8040308da4ad4210b89969d3c6917e04b6f9d4a574ab01fd197d9098834a3f',
                  id: 'docker://9d8040308da4ad4210b89969d3c6917e04b6f9d4a574ab01fd197d9098834a3f',
                  image: 'gcr.io/google_containers/kube-proxy:v1.7.2'
                }
              },
              itemIds: ['docker://9d8040308da4ad4210b89969d3c6917e04b6f9d4a574ab01fd197d9098834a3f']
            },
            name: 'kube-proxy-ip-172-20-74-127.ec2.internal',
            namespace: 'kube-system',
            uid: '66b5216f-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-app': 'kube-proxy',
              tier: 'node'
            }
          },
          'kube-system:kube-proxy-ip-172-20-91-235.ec2.internal': {
            hostIp: '172.20.91.235',
            podIp: '172.20.91.235',
            phase: 'Running',
            containers: {
              data: {
                'docker://8d90b5420f57e7561ba9c7f87c5e903f3d4ce2ab140d0931dd83137be754883e': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kube-proxy',
                  uid: 'docker://8d90b5420f57e7561ba9c7f87c5e903f3d4ce2ab140d0931dd83137be754883e',
                  id: 'docker://8d90b5420f57e7561ba9c7f87c5e903f3d4ce2ab140d0931dd83137be754883e',
                  image: 'gcr.io/google_containers/kube-proxy:v1.7.2'
                }
              },
              itemIds: ['docker://8d90b5420f57e7561ba9c7f87c5e903f3d4ce2ab140d0931dd83137be754883e']
            },
            name: 'kube-proxy-ip-172-20-91-235.ec2.internal',
            namespace: 'kube-system',
            uid: 'b217d7d5-985d-11e7-b88c-0efdf82c16e6',
            labels: {
              'k8s-app': 'kube-proxy',
              tier: 'node'
            }
          },
          'kube-system:kube-scheduler-ip-172-20-118-192.ec2.internal': {
            hostIp: '172.20.118.192',
            podIp: '172.20.118.192',
            phase: 'Running',
            containers: {
              data: {
                'docker://65c4182646672b51176dfbf57ef7903402a8b217e4f44f563fd2b49ec581d459': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kube-scheduler',
                  uid: 'docker://65c4182646672b51176dfbf57ef7903402a8b217e4f44f563fd2b49ec581d459',
                  id: 'docker://65c4182646672b51176dfbf57ef7903402a8b217e4f44f563fd2b49ec581d459',
                  image: 'gcr.io/google_containers/kube-scheduler:v1.7.2'
                }
              },
              itemIds: ['docker://65c4182646672b51176dfbf57ef7903402a8b217e4f44f563fd2b49ec581d459']
            },
            name: 'kube-scheduler-ip-172-20-118-192.ec2.internal',
            namespace: 'kube-system',
            uid: '6976f647-985d-11e7-bdb8-06a0ce04c50c',
            labels: {
              'k8s-app': 'kube-scheduler'
            }
          },
          'kube-system:kube-scheduler-ip-172-20-46-234.ec2.internal': {
            hostIp: '172.20.46.234',
            podIp: '172.20.46.234',
            phase: 'Running',
            containers: {
              data: {
                'docker://55db764a20e1c12dd85fdd546c589343d5fb758437fc0f4da2beb30c6f9d2e36': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kube-scheduler',
                  uid: 'docker://55db764a20e1c12dd85fdd546c589343d5fb758437fc0f4da2beb30c6f9d2e36',
                  id: 'docker://55db764a20e1c12dd85fdd546c589343d5fb758437fc0f4da2beb30c6f9d2e36',
                  image: 'gcr.io/google_containers/kube-scheduler:v1.7.2'
                }
              },
              itemIds: ['docker://55db764a20e1c12dd85fdd546c589343d5fb758437fc0f4da2beb30c6f9d2e36']
            },
            name: 'kube-scheduler-ip-172-20-46-234.ec2.internal',
            namespace: 'kube-system',
            uid: '6f01465c-985d-11e7-b88c-0efdf82c16e6',
            labels: {
              'k8s-app': 'kube-scheduler'
            }
          },
          'kube-system:kube-scheduler-ip-172-20-74-127.ec2.internal': {
            hostIp: '172.20.74.127',
            podIp: '172.20.74.127',
            phase: 'Running',
            containers: {
              data: {
                'docker://e280a3ff2294d177bbf9d7b4e24a732635ab45e9bda35514de128cb799ad0c3b': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kube-scheduler',
                  uid: 'docker://e280a3ff2294d177bbf9d7b4e24a732635ab45e9bda35514de128cb799ad0c3b',
                  id: 'docker://e280a3ff2294d177bbf9d7b4e24a732635ab45e9bda35514de128cb799ad0c3b',
                  image: 'gcr.io/google_containers/kube-scheduler:v1.7.2'
                }
              },
              itemIds: ['docker://e280a3ff2294d177bbf9d7b4e24a732635ab45e9bda35514de128cb799ad0c3b']
            },
            name: 'kube-scheduler-ip-172-20-74-127.ec2.internal',
            namespace: 'kube-system',
            uid: '79c7bcb7-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-app': 'kube-scheduler'
            }
          },
          'kube-system:kubernetes-dashboard-3313488171-1xmsq': {
            hostIp: '172.20.91.235',
            podIp: '100.96.3.3',
            phase: 'Running',
            containers: {
              data: {
                'docker://d96d6a4b063828384217049f75dc8b2a2cc5ee730fde6718418d5e79d53a7d1f': {
                  state: 'running',
                  restartCount: 0,
                  namespace: 'kubernetes-dashboard',
                  uid: 'docker://d96d6a4b063828384217049f75dc8b2a2cc5ee730fde6718418d5e79d53a7d1f',
                  id: 'docker://d96d6a4b063828384217049f75dc8b2a2cc5ee730fde6718418d5e79d53a7d1f',
                  image: 'gcr.io/google_containers/kubernetes-dashboard-amd64:v1.6.3'
                }
              },
              itemIds: ['docker://d96d6a4b063828384217049f75dc8b2a2cc5ee730fde6718418d5e79d53a7d1f']
            },
            name: 'kubernetes-dashboard-3313488171-1xmsq',
            namespace: 'kube-system',
            uid: '0eab4d71-9860-11e7-acc5-027253a6576e',
            labels: {
              'k8s-app': 'kubernetes-dashboard',
              'pod-template-hash': '3313488171'
            },
            owners: {
              ReplicaSet: '0ea9a807-9860-11e7-acc5-027253a6576e'
            }
          }
        },
        itemIds: [
          'kube-system:kube-proxy-ip-172-20-33-90.ec2.internal',
          'kube-system:kube-proxy-ip-172-20-91-235.ec2.internal',
          'kube-system:etcd-server-events-ip-172-20-46-234.ec2.internal',
          'kube-system:kube-controller-manager-ip-172-20-46-234.ec2.internal',
          'kube-system:etcd-server-ip-172-20-118-192.ec2.internal',
          'instana-agent:instana-agent-xlpm9',
          'kube-system:etcd-server-events-ip-172-20-118-192.ec2.internal',
          'kube-system:dns-controller-1163813304-8m9w0',
          'instana-agent:instana-agent-nfds0',
          'kube-system:kube-scheduler-ip-172-20-74-127.ec2.internal',
          'kube-system:kube-apiserver-ip-172-20-74-127.ec2.internal',
          'kube-system:kube-scheduler-ip-172-20-46-234.ec2.internal',
          'kube-system:kube-proxy-ip-172-20-118-192.ec2.internal',
          'kube-system:kube-apiserver-ip-172-20-118-192.ec2.internal',
          'kube-system:kube-scheduler-ip-172-20-118-192.ec2.internal',
          'instana-agent:instana-agent-szhl8',
          'kube-system:kube-controller-manager-ip-172-20-118-192.ec2.internal',
          'kube-system:kube-dns-479524115-s4021',
          'kube-system:kube-dns-479524115-dt76v',
          'instana-agent:instana-agent-kf8wl',
          'kube-system:etcd-server-ip-172-20-74-127.ec2.internal',
          'instana-agent:instana-agent-cghx1',
          'kube-system:kube-proxy-ip-172-20-46-234.ec2.internal',
          'kube-system:etcd-server-events-ip-172-20-74-127.ec2.internal',
          'kube-system:kubernetes-dashboard-3313488171-1xmsq',
          'kube-system:etcd-server-ip-172-20-46-234.ec2.internal',
          'kube-system:kube-controller-manager-ip-172-20-74-127.ec2.internal',
          'kube-system:kube-apiserver-ip-172-20-46-234.ec2.internal',
          'kube-system:kube-dns-autoscaler-1818915203-1jjk8',
          'kube-system:kube-proxy-ip-172-20-74-127.ec2.internal'
        ]
      },
      replicaSets: {
        data: {
          'kube-system:dns-controller-1163813304': {
            replicas: 1,
            availableReplicas: 1,
            readyReplicas: 1,
            name: 'dns-controller-1163813304',
            namespace: 'kube-system',
            uid: '5a698814-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-addon': 'dns-controller.addons.k8s.io',
              'k8s-app': 'dns-controller',
              'pod-template-hash': '1163813304',
              version: 'v1.7.1'
            },
            owners: {
              Deployment: '53c27c6d-985d-11e7-acc5-027253a6576e'
            }
          },
          'kube-system:kube-dns-479524115': {
            replicas: 2,
            availableReplicas: 2,
            readyReplicas: 2,
            name: 'kube-dns-479524115',
            namespace: 'kube-system',
            uid: '5a69fa1b-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-app': 'kube-dns',
              'pod-template-hash': '479524115'
            },
            owners: {
              Deployment: '546a61e0-985d-11e7-acc5-027253a6576e'
            }
          },
          'kube-system:kube-dns-autoscaler-1818915203': {
            replicas: 1,
            availableReplicas: 1,
            readyReplicas: 1,
            name: 'kube-dns-autoscaler-1818915203',
            namespace: 'kube-system',
            uid: '5a69b6b9-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-app': 'kube-dns-autoscaler',
              'pod-template-hash': '1818915203'
            },
            owners: {
              Deployment: '546330a3-985d-11e7-acc5-027253a6576e'
            }
          },
          'kube-system:kubernetes-dashboard-3313488171': {
            replicas: 1,
            availableReplicas: 1,
            readyReplicas: 1,
            name: 'kubernetes-dashboard-3313488171',
            namespace: 'kube-system',
            uid: '0ea9a807-9860-11e7-acc5-027253a6576e',
            labels: {
              'k8s-app': 'kubernetes-dashboard',
              'pod-template-hash': '3313488171'
            },
            owners: {
              Deployment: '0ea85bf4-9860-11e7-bdb8-06a0ce04c50c'
            }
          }
        },
        itemIds: [
          'kube-system:kube-dns-479524115',
          'kube-system:kubernetes-dashboard-3313488171',
          'kube-system:dns-controller-1163813304',
          'kube-system:kube-dns-autoscaler-1818915203'
        ]
      },
      deployments: {
        data: {
          'kube-system:dns-controller': {
            replicas: 1,
            availableReplicas: 1,
            name: 'dns-controller',
            namespace: 'kube-system',
            uid: '53c27c6d-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-addon': 'dns-controller.addons.k8s.io',
              'k8s-app': 'dns-controller',
              version: 'v1.7.1'
            }
          },
          'kube-system:kube-dns': {
            replicas: 2,
            availableReplicas: 2,
            name: 'kube-dns',
            namespace: 'kube-system',
            uid: '546a61e0-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-addon': 'kube-dns.addons.k8s.io',
              'k8s-app': 'kube-dns',
              'kubernetes.io/cluster-service': 'true'
            }
          },
          'kube-system:kube-dns-autoscaler': {
            replicas: 1,
            availableReplicas: 1,
            name: 'kube-dns-autoscaler',
            namespace: 'kube-system',
            uid: '546330a3-985d-11e7-acc5-027253a6576e',
            labels: {
              'k8s-addon': 'kube-dns.addons.k8s.io',
              'k8s-app': 'kube-dns-autoscaler',
              'kubernetes.io/cluster-service': 'true'
            }
          },
          'kube-system:kubernetes-dashboard': {
            replicas: 1,
            availableReplicas: 1,
            name: 'kubernetes-dashboard',
            namespace: 'kube-system',
            uid: '0ea85bf4-9860-11e7-bdb8-06a0ce04c50c',
            labels: {
              'k8s-app': 'kubernetes-dashboard'
            }
          }
        },
        itemIds: [
          'kube-system:kube-dns',
          'kube-system:dns-controller',
          'kube-system:kubernetes-dashboard',
          'kube-system:kube-dns-autoscaler'
        ]
      },
      componentStatuses: {
        data: {
          scheduler: {
            Healthy: 'True',
            message: 'ok',
            name: 'scheduler'
          },
          'controller-manager': {
            Healthy: 'True',
            message: 'ok',
            name: 'controller-manager'
          },
          'etcd-1': {
            Healthy: 'True',
            message: "{'health': 'true'}",
            name: 'etcd-1'
          },
          'etcd-0': {
            Healthy: 'True',
            message: "{'health': 'true'}",
            name: 'etcd-0'
          }
        },
        itemIds: ['scheduler', 'controller-manager', 'etcd-0', 'etcd-1']
      }
    }
  });
}
