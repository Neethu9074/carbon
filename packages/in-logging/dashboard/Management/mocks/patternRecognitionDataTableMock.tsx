/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

export const mockResult = {
  result: {
    data: {
      recognitions: [
        {
          id: 1,
          name: 'Kenneth Morales',
          patternsSample:
            '166.78.254.17 -- [ 03/Apr/2025:22:24:23 +0000 ] "GET /bundle/77cf82d0ed0f4220.js HTTP/1.1" 500 "https://stewart.biz/author.jsp" "Mozilla/5.0 (iPhone; CPU iPhone OS 5_1_1 like Mac OS X) AppleWebKit/534.2 (KHTML, like Gecko) CriOS/41.0.862.0 Mobile/64Q860 Safari/534.2"\n[227880] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=227880\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 47.219.51.127:9092 could not be established. Broker may not be available.\n[4952952] Problem reaching database. Timeout http request GET https://ibm.box.com/s/68464235605da00f\nError occurred while calling aws lambda system- endpoint : https://529fa3db69.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 2,
          name: 'James Andrews',
          patternsSample:
            '125.227.170.163 -- [ 17/Feb/2025:08:23:07 +0000 ] "GET /bundle/4eae9c67fd4037e8.js HTTP/1.1" 403 "https://www.king-schroeder.org/privacy.php" "Opera/8.42.(Windows CE; ln-CD) Presto/2.9.179 Version/10.00"\n[842119] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=842119\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 94.70.199.160:9092 could not be established. Broker may not be available.\n[7048160] Problem reaching database. Timeout http request GET https://ibm.box.com/s/3e919e59cb1c8c5b\nError occurred while calling aws lambda system- endpoint : https://85e9d9e768.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 3,
          name: 'Ashley Bailey',
          patternsSample:
            '38.52.145.7 -- [ 10/Jan/2025:22:04:58 +0000 ] "GET /bundle/b6e7225d3cc10cfb.js HTTP/1.1" 403 "http://www.serrano.com/index.asp" "Opera/9.97.(X11; Linux x86_64; te-IN) Presto/2.9.177 Version/12.00"\n[264633] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=264633\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 105.139.174.155:9092 could not be established. Broker may not be available.\n[1677663] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e01a15bf654a8060\nError occurred while calling aws lambda system- endpoint : https://dbeb5ca1ae.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 4,
          name: 'Travis Hall',
          patternsSample:
            '43.122.48.178 -- [ 25/Mar/2025:04:18:20 +0000 ] "GET /bundle/45a5d3669d014601.js HTTP/1.1" 403 "https://frey.biz/list/about/" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_9 rv:5.0; ss-ZA) AppleWebKit/532.39.3 (KHTML, like Gecko) Version/4.0.4 Safari/532.39.3"\n[894002] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=894002\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 140.130.67.155:9092 could not be established. Broker may not be available.\n[7095946] Problem reaching database. Timeout http request GET https://ibm.box.com/s/9487cad398575c41\nError occurred while calling aws lambda system- endpoint : https://fad9a2b4e9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 5,
          name: 'James Brown',
          patternsSample:
            '17.199.175.65 -- [ 02/Jan/2025:17:14:48 +0000 ] "GET /bundle/67aef2c5c1f519d2.js HTTP/1.1" 504 "http://www.powers.com/posts/wp-content/about.htm" "Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/534.1 (KHTML, like Gecko) CriOS/61.0.837.0 Mobile/86R777 Safari/534.1"\n[860541] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=860541\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 131.34.223.180:9092 could not be established. Broker may not be available.\n[1660417] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0fa9e1c5d32f3cf0\nError occurred while calling aws lambda system- endpoint : https://6b9a282140.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 6,
          name: 'Timothy Powers',
          patternsSample:
            '12.208.135.129 -- [ 09/May/2025:22:12:18 +0000 ] "GET /bundle/bf4b2c532b036dc1.js HTTP/1.1" 403 "http://nelson-schultz.info/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 5.2; Trident/3.0)"\n[829995] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=829995\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 29.0.193.154:9092 could not be established. Broker may not be available.\n[5589355] Problem reaching database. Timeout http request GET https://ibm.box.com/s/19dda28f3ed12871\nError occurred while calling aws lambda system- endpoint : https://8e1804e8a3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 7,
          name: 'Michelle Willis',
          patternsSample:
            '23.185.106.150 -- [ 16/May/2025:19:41:08 +0000 ] "GET /bundle/7041b6843acf1ac4.js HTTP/1.1" 504 "https://www.jackson-hammond.com/categories/search/explore/privacy/" "Opera/8.32.(Windows NT 5.0; fil-PH) Presto/2.9.166 Version/10.00"\n[155977] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=155977\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 109.18.55.107:9092 could not be established. Broker may not be available.\n[2253280] Problem reaching database. Timeout http request GET https://ibm.box.com/s/bc7fe7f4823e2ef4\nError occurred while calling aws lambda system- endpoint : https://f0b91b3e75.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 8,
          name: 'Adam Flowers',
          patternsSample:
            '30.196.173.174 -- [ 27/Jan/2025:04:05:07 +0000 ] "GET /bundle/2ac56d721a10a94e.js HTTP/1.1" 500 "https://www.clark.com/app/list/main.htm" "Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_6 like Mac OS X) AppleWebKit/535.0 (KHTML, like Gecko) FxiOS/17.5i2876.0 Mobile/07T700 Safari/535.0"\n[870770] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=870770\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 60.40.234.173:9092 could not be established. Broker may not be available.\n[2584317] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e329706b1e023e84\nError occurred while calling aws lambda system- endpoint : https://1dbc387ded.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 9,
          name: 'Martha Johnson',
          patternsSample:
            '67.76.62.125 -- [ 31/Jan/2025:20:18:18 +0000 ] "GET /bundle/5895df0f53eb9f57.js HTTP/1.1" 403 "http://www.lopez-moore.org/homepage.html" "Opera/8.73.(X11; Linux x86_64; fr-CA) Presto/2.9.160 Version/12.00"\n[801390] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=801390\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 17.72.195.42:9092 could not be established. Broker may not be available.\n[7621031] Problem reaching database. Timeout http request GET https://ibm.box.com/s/daaedca8aeb60ade\nError occurred while calling aws lambda system- endpoint : https://5f6a0a7424.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 10,
          name: 'Karen Wood',
          patternsSample:
            '69.127.126.146 -- [ 09/Jan/2025:02:10:39 +0000 ] "GET /bundle/158c6a4fa8f943c1.js HTTP/1.1" 504 "https://www.clarke-barrera.com/tags/categories/main/terms/" "Mozilla/5.0 (Android 4.1.2; Mobile; rv:34.0) Gecko/34.0 Firefox/34.0"\n[118094] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=118094\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 65.17.59.2:9092 could not be established. Broker may not be available.\n[5696625] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c3ead98995b28e65\nError occurred while calling aws lambda system- endpoint : https://07d6005e8c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 11,
          name: 'Stephen Johnson',
          patternsSample:
            '110.232.47.46 -- [ 18/Apr/2025:21:28:52 +0000 ] "GET /bundle/e417c5c5edf6c574.js HTTP/1.1" 403 "https://brock.net/" "Mozilla/5.0 (iPhone; CPU iPhone OS 5_1_1 like Mac OS X) AppleWebKit/533.0 (KHTML, like Gecko) CriOS/33.0.893.0 Mobile/65I156 Safari/533.0"\n[339029] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=339029\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 24.60.165.173:9092 could not be established. Broker may not be available.\n[3374803] Problem reaching database. Timeout http request GET https://ibm.box.com/s/11b4faa03d04fe88\nError occurred while calling aws lambda system- endpoint : https://c839af1979.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 12,
          name: 'Jimmy Mahoney',
          patternsSample:
            '190.144.202.250 -- [ 12/May/2025:19:33:23 +0000 ] "GET /bundle/334e3eb70b704939.js HTTP/1.1" 500 "http://www.mcdowell.org/explore/tags/index/" "Opera/9.27.(Windows NT 6.1; te-IN) Presto/2.9.169 Version/12.00"\n[606824] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=606824\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 137.46.98.197:9092 could not be established. Broker may not be available.\n[9373043] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c9db89cca1228e7b\nError occurred while calling aws lambda system- endpoint : https://2c5689e23a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 13,
          name: 'Jose James',
          patternsSample:
            '56.179.233.202 -- [ 30/Jan/2025:23:54:06 +0000 ] "GET /bundle/d354f488c2f66b41.js HTTP/1.1" 504 "http://freeman.com/homepage.html" "Mozilla/5.0 (iPad; CPU iPad OS 7_1_2 like Mac OS X) AppleWebKit/536.1 (KHTML, like Gecko) CriOS/63.0.884.0 Mobile/93D915 Safari/536.1"\n[856393] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=856393\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 219.148.175.231:9092 could not be established. Broker may not be available.\n[9998360] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f49dad6b809177dd\nError occurred while calling aws lambda system- endpoint : https://9bfe29ed39.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 14,
          name: 'Jessica Patton',
          patternsSample:
            '132.173.81.246 -- [ 05/May/2025:02:59:41 +0000 ] "GET /bundle/62ea2c0535bbe893.js HTTP/1.1" 403 "https://www.whitaker.com/main.php" "Mozilla/5.0 (Android 2.3; Mobile; rv:20.0) Gecko/20.0 Firefox/20.0"\n[234913] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=234913\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 99.140.233.114:9092 could not be established. Broker may not be available.\n[8198067] Problem reaching database. Timeout http request GET https://ibm.box.com/s/6df7a92dfef9459b\nError occurred while calling aws lambda system- endpoint : https://ac22e57a46.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 15,
          name: 'Stephanie Vasquez',
          patternsSample:
            '203.204.238.33 -- [ 01/May/2025:04:59:41 +0000 ] "GET /bundle/5fbe5f9193397275.js HTTP/1.1" 500 "https://www.ryan.com/tag/posts/homepage/" "Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 6.2; Trident/5.1)"\n[714887] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=714887\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 175.190.220.0:9092 could not be established. Broker may not be available.\n[5927249] Problem reaching database. Timeout http request GET https://ibm.box.com/s/efda5ce36ab6ef8b\nError occurred while calling aws lambda system- endpoint : https://e082fedb64.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 16,
          name: 'Robin Blake',
          patternsSample:
            '118.129.218.122 -- [ 27/Mar/2025:22:53:05 +0000 ] "GET /bundle/74c3f41a9a95aada.js HTTP/1.1" 200 "https://wilson-moore.com/home.htm" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_9_0) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/51.0.855.0 Safari/533.2"\n[966761] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=966761\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 173.173.18.229:9092 could not be established. Broker may not be available.\n[1503429] Problem reaching database. Timeout http request GET https://ibm.box.com/s/992f0d00d6bb1ba8\nError occurred while calling aws lambda system- endpoint : https://10f78bc2f0.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 17,
          name: 'Devin Robinson',
          patternsSample:
            '192.113.252.101 -- [ 21/Mar/2025:03:12:10 +0000 ] "GET /bundle/9c3555c0f455df41.js HTTP/1.1" 500 "https://james-fuentes.com/register.html" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1 rv:3.0; iu-CA) AppleWebKit/533.42.6 (KHTML, like Gecko) Version/5.0.1 Safari/533.42.6"\n[889770] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=889770\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 100.145.28.149:9092 could not be established. Broker may not be available.\n[7259542] Problem reaching database. Timeout http request GET https://ibm.box.com/s/17229e5872d8c852\nError occurred while calling aws lambda system- endpoint : https://6d9349f52d.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 18,
          name: 'Joshua White',
          patternsSample:
            '120.240.232.189 -- [ 10/Mar/2025:03:54:08 +0000 ] "GET /bundle/588ef594ae054e06.js HTTP/1.1" 200 "http://www.soto-brady.com/main.asp" "Opera/9.56.(X11; Linux x86_64; eo-US) Presto/2.9.167 Version/11.00"\n[804591] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=804591\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 42.64.63.240:9092 could not be established. Broker may not be available.\n[3465069] Problem reaching database. Timeout http request GET https://ibm.box.com/s/407bd68308f9258d\nError occurred while calling aws lambda system- endpoint : https://f8bc1a22a8.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 19,
          name: 'Cynthia Bruce',
          patternsSample:
            '207.177.130.109 -- [ 23/Mar/2025:13:35:11 +0000 ] "GET /bundle/fbef0f16de1049a5.js HTTP/1.1" 500 "https://jackson-salazar.com/blog/home/" "Mozilla/5.0 (iPad; CPU iPad OS 14_2 like Mac OS X) AppleWebKit/533.2 (KHTML, like Gecko) FxiOS/15.1e0837.0 Mobile/48G677 Safari/533.2"\n[683254] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=683254\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 132.194.23.172:9092 could not be established. Broker may not be available.\n[2308335] Problem reaching database. Timeout http request GET https://ibm.box.com/s/197a350155ce881d\nError occurred while calling aws lambda system- endpoint : https://0c626dc9f3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 20,
          name: 'Tracey Alexander',
          patternsSample:
            '77.107.238.140 -- [ 11/Feb/2025:06:09:54 +0000 ] "GET /bundle/ea710fff51ed17d2.js HTTP/1.1" 504 "http://www.diaz.org/posts/homepage/" "Opera/8.94.(Windows NT 6.2; sa-IN) Presto/2.9.166 Version/11.00"\n[224633] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=224633\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 19.69.15.101:9092 could not be established. Broker may not be available.\n[2128806] Problem reaching database. Timeout http request GET https://ibm.box.com/s/38dae384f3b7d6c4\nError occurred while calling aws lambda system- endpoint : https://b97aa4ac63.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 21,
          name: 'Jennifer Baker',
          patternsSample:
            '168.45.60.219 -- [ 14/Apr/2025:12:31:25 +0000 ] "GET /bundle/b218e5ff022ad6e6.js HTTP/1.1" 403 "https://www.mullins-lambert.com/login.html" "Mozilla/5.0 (X11; Linux i686; rv:1.9.7.20) Gecko/2015-05-30 23:00:06 Firefox/3.8"\n[175111] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=175111\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 117.191.100.6:9092 could not be established. Broker may not be available.\n[6065124] Problem reaching database. Timeout http request GET https://ibm.box.com/s/556e49e06053ca28\nError occurred while calling aws lambda system- endpoint : https://16cd054bc5.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 22,
          name: 'Amanda Hart',
          patternsSample:
            '18.84.27.175 -- [ 20/Apr/2025:07:54:10 +0000 ] "GET /bundle/cdc3cd5e0d4a5484.js HTTP/1.1" 200 "http://www.brown-bradley.org/category/tag/explore/terms.html" "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/531.2 (KHTML, like Gecko) CriOS/34.0.864.0 Mobile/91N366 Safari/531.2"\n[801399] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=801399\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 113.114.73.25:9092 could not be established. Broker may not be available.\n[1069022] Problem reaching database. Timeout http request GET https://ibm.box.com/s/49e59935e247dcc3\nError occurred while calling aws lambda system- endpoint : https://606433cb88.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 23,
          name: 'Anne Conley',
          patternsSample:
            '31.214.21.40 -- [ 01/May/2025:09:15:37 +0000 ] "GET /bundle/67244d84cfc504e4.js HTTP/1.1" 403 "https://martinez-coleman.biz/about/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 5.2; Trident/5.1)"\n[995696] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=995696\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 190.201.125.6:9092 could not be established. Broker may not be available.\n[7463761] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c856ea73e29d5c2f\nError occurred while calling aws lambda system- endpoint : https://c39f3e6eef.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 24,
          name: 'Brianna Mitchell',
          patternsSample:
            '68.5.99.83 -- [ 06/Mar/2025:15:33:09 +0000 ] "GET /bundle/44ce009f1708986f.js HTTP/1.1" 403 "http://www.gonzales.net/" "Opera/8.60.(X11; Linux x86_64; mag-IN) Presto/2.9.182 Version/10.00"\n[428234] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=428234\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 204.6.138.124:9092 could not be established. Broker may not be available.\n[5899210] Problem reaching database. Timeout http request GET https://ibm.box.com/s/bb5489cae563e17f\nError occurred while calling aws lambda system- endpoint : https://a1cf5a3616.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 25,
          name: 'Mckenzie Fuller',
          patternsSample:
            '22.45.214.229 -- [ 10/Mar/2025:04:32:13 +0000 ] "GET /bundle/46f1e41bd38802bd.js HTTP/1.1" 200 "http://miller.com/posts/search/explore/about/" "Mozilla/5.0 (iPhone; CPU iPhone OS 4_2_1 like Mac OS X) AppleWebKit/531.1 (KHTML, like Gecko) FxiOS/13.4z6340.0 Mobile/31Y357 Safari/531.1"\n[503678] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=503678\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 87.148.88.28:9092 could not be established. Broker may not be available.\n[4932352] Problem reaching database. Timeout http request GET https://ibm.box.com/s/da15f09e73b0df16\nError occurred while calling aws lambda system- endpoint : https://7610c40910.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 26,
          name: 'Jacob Anderson',
          patternsSample:
            '89.253.17.252 -- [ 03/Mar/2025:04:02:36 +0000 ] "GET /bundle/a53c1a608f0123af.js HTTP/1.1" 500 "https://www.wright.biz/categories/posts/main/home.htm" "Mozilla/5.0 (Windows NT 4.0; km-KH; rv:1.9.1.20) Gecko/2020-01-01 20:53:27 Firefox/3.6.17"\n[135167] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=135167\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 199.220.3.255:9092 could not be established. Broker may not be available.\n[7658686] Problem reaching database. Timeout http request GET https://ibm.box.com/s/647cfebf16a9761d\nError occurred while calling aws lambda system- endpoint : https://478f06f0f8.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 27,
          name: 'Courtney Schneider',
          patternsSample:
            '206.203.35.159 -- [ 08/Mar/2025:08:53:05 +0000 ] "GET /bundle/94ae57f1ced83e1e.js HTTP/1.1" 200 "https://www.rodriguez-clark.com/app/posts/posts/about.html" "Opera/9.56.(X11; Linux i686; or-IN) Presto/2.9.162 Version/10.00"\n[400009] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=400009\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 95.188.19.12:9092 could not be established. Broker may not be available.\n[5694990] Problem reaching database. Timeout http request GET https://ibm.box.com/s/18579b526b25448a\nError occurred while calling aws lambda system- endpoint : https://ffba3e815c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 28,
          name: 'Patrick Ford',
          patternsSample:
            '133.80.169.10 -- [ 10/May/2025:15:49:33 +0000 ] "GET /bundle/49f8eaacfd0eb9f8.js HTTP/1.1" 504 "https://www.moore.com/" "Mozilla/5.0 (Windows NT 6.0; lo-LA; rv:1.9.0.20) Gecko/2010-06-02 04:19:17 Firefox/3.6.17"\n[156467] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=156467\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 215.215.204.104:9092 could not be established. Broker may not be available.\n[7264799] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b9054b7586387d66\nError occurred while calling aws lambda system- endpoint : https://35fa9f9614.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 29,
          name: 'Donna Parker',
          patternsSample:
            '167.159.251.221 -- [ 11/Feb/2025:20:23:23 +0000 ] "GET /bundle/f70957e09b5656fe.js HTTP/1.1" 504 "https://www.wilson.com/main/explore/homepage/" "Mozilla/5.0 (X11; Linux i686) AppleWebKit/536.1 (KHTML, like Gecko) Chrome/41.0.860.0 Safari/536.1"\n[219706] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=219706\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 77.88.210.14:9092 could not be established. Broker may not be available.\n[3981693] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0fa8c0ba02e10f1b\nError occurred while calling aws lambda system- endpoint : https://9b4d148cbb.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 30,
          name: 'Thomas Farmer',
          patternsSample:
            '220.93.130.25 -- [ 31/Mar/2025:17:15:27 +0000 ] "GET /bundle/d61da33cb78cd593.js HTTP/1.1" 504 "https://www.guzman-young.com/terms.htm" "Mozilla/5.0 (compatible; MSIE 5.0; Windows NT 6.2; Trident/4.1)"\n[992088] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=992088\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 185.107.47.244:9092 could not be established. Broker may not be available.\n[8964387] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b38eb4ce2e7b840e\nError occurred while calling aws lambda system- endpoint : https://58756f62cc.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 31,
          name: 'Christine Beasley',
          patternsSample:
            '5.169.208.152 -- [ 21/May/2025:10:11:18 +0000 ] "GET /bundle/235353d8769587b2.js HTTP/1.1" 500 "https://hill.org/" "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_4 like Mac OS X) AppleWebKit/534.1 (KHTML, like Gecko) FxiOS/9.0i9116.0 Mobile/05N260 Safari/534.1"\n[213355] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=213355\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 64.183.176.87:9092 could not be established. Broker may not be available.\n[4395257] Problem reaching database. Timeout http request GET https://ibm.box.com/s/7bee15b4f9e951e4\nError occurred while calling aws lambda system- endpoint : https://3aae5d0dcd.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 32,
          name: 'Erin Reed',
          patternsSample:
            '84.179.141.120 -- [ 26/Apr/2025:21:27:39 +0000 ] "GET /bundle/be929d3d59a1cd7b.js HTTP/1.1" 504 "https://www.sutton.com/post/" "Mozilla/5.0 (compatible; MSIE 5.0; Windows CE; Trident/5.0)"\n[506154] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=506154\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 96.21.226.249:9092 could not be established. Broker may not be available.\n[6747521] Problem reaching database. Timeout http request GET https://ibm.box.com/s/2fc4b835d41c3dab\nError occurred while calling aws lambda system- endpoint : https://8107a19710.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 33,
          name: 'Kimberly Hess',
          patternsSample:
            '63.97.144.186 -- [ 12/Jan/2025:20:59:16 +0000 ] "GET /bundle/78e6f4a8b6980566.js HTTP/1.1" 200 "http://morris-house.com/search/" "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.1)"\n[726945] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=726945\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 138.250.64.188:9092 could not be established. Broker may not be available.\n[1397828] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ceb5fcc45c8c09ac\nError occurred while calling aws lambda system- endpoint : https://7d00b9522a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 34,
          name: 'Justin Torres',
          patternsSample:
            '88.79.246.171 -- [ 10/Feb/2025:07:35:22 +0000 ] "GET /bundle/8d75197674a7b193.js HTTP/1.1" 403 "http://www.harper.org/post/" "Opera/8.26.(Windows NT 5.01; aa-ER) Presto/2.9.178 Version/12.00"\n[407392] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=407392\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 84.214.178.222:9092 could not be established. Broker may not be available.\n[2162090] Problem reaching database. Timeout http request GET https://ibm.box.com/s/91fc8b710f71ce49\nError occurred while calling aws lambda system- endpoint : https://7e25104ca9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 35,
          name: 'Dustin Parker',
          patternsSample:
            '147.241.224.5 -- [ 25/Apr/2025:20:37:37 +0000 ] "GET /bundle/00012d5e84c7e387.js HTTP/1.1" 403 "http://www.franklin.com/blog/category/category.htm" "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/536.0 (KHTML, like Gecko) FxiOS/15.6q2581.0 Mobile/98A167 Safari/536.0"\n[879568] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=879568\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 198.174.62.84:9092 could not be established. Broker may not be available.\n[4143320] Problem reaching database. Timeout http request GET https://ibm.box.com/s/33bcc7d344364868\nError occurred while calling aws lambda system- endpoint : https://19d81131db.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 36,
          name: 'Mark Martin',
          patternsSample:
            '169.167.38.248 -- [ 20/Feb/2025:11:45:01 +0000 ] "GET /bundle/c0c6e86d76076c20.js HTTP/1.1" 500 "http://www.ellis-curtis.com/" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_10_7 rv:4.0; or-IN) AppleWebKit/534.24.3 (KHTML, like Gecko) Version/4.0 Safari/534.24.3"\n[585057] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=585057\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 40.222.141.161:9092 could not be established. Broker may not be available.\n[5532148] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c8f2d014e6f1ad9a\nError occurred while calling aws lambda system- endpoint : https://fd7bac249e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 37,
          name: 'Thomas Young',
          patternsSample:
            '128.17.241.88 -- [ 12/May/2025:12:14:38 +0000 ] "GET /bundle/9c27d9a1878b151b.js HTTP/1.1" 200 "http://www.keller.com/faq.html" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_12_3) AppleWebKit/532.0 (KHTML, like Gecko) Chrome/54.0.850.0 Safari/532.0"\n[586020] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=586020\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 116.198.125.90:9092 could not be established. Broker may not be available.\n[1444480] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ff15736a47c877f5\nError occurred while calling aws lambda system- endpoint : https://e0a500654b.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 38,
          name: 'Charlotte Harris',
          patternsSample:
            '4.31.174.198 -- [ 04/Apr/2025:11:59:17 +0000 ] "GET /bundle/5de57ba6f32307c5.js HTTP/1.1" 200 "http://www.espinoza.net/post/" "Opera/8.66.(X11; Linux x86_64; csb-PL) Presto/2.9.164 Version/11.00"\n[444068] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=444068\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 197.180.197.22:9092 could not be established. Broker may not be available.\n[8807494] Problem reaching database. Timeout http request GET https://ibm.box.com/s/98cb1afda633858e\nError occurred while calling aws lambda system- endpoint : https://791e06c9aa.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 39,
          name: 'James Fox',
          patternsSample:
            '122.127.217.178 -- [ 26/Feb/2025:12:33:40 +0000 ] "GET /bundle/4c050f8b6a79a69a.js HTTP/1.1" 403 "http://ayala-thompson.com/index/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/36.0.848.0 Safari/535.1"\n[140976] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=140976\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 34.9.234.219:9092 could not be established. Broker may not be available.\n[8296475] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c83761e85eb53ff7\nError occurred while calling aws lambda system- endpoint : https://a827a4f60a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 40,
          name: 'Joseph Baldwin',
          patternsSample:
            '107.103.167.182 -- [ 07/Jan/2025:22:57:07 +0000 ] "GET /bundle/4d4eef9551a89190.js HTTP/1.1" 500 "http://bauer.com/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_2 like Mac OS X; ig-NG) AppleWebKit/535.6.4 (KHTML, like Gecko) Version/4.0.5 Mobile/8B111 Safari/6535.6.4"\n[207957] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=207957\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 53.215.63.145:9092 could not be established. Broker may not be available.\n[7725926] Problem reaching database. Timeout http request GET https://ibm.box.com/s/3b19b40344f08e6c\nError occurred while calling aws lambda system- endpoint : https://068885ec6a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 41,
          name: 'Lisa Perez',
          patternsSample:
            '74.40.136.73 -- [ 22/Jan/2025:01:24:25 +0000 ] "GET /bundle/1073c06bc60442fc.js HTTP/1.1" 403 "http://www.solis-russo.info/home/" "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.2; Trident/4.1)"\n[102578] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=102578\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 19.169.157.16:9092 could not be established. Broker may not be available.\n[8082174] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ee79945b6eef6e7d\nError occurred while calling aws lambda system- endpoint : https://1249dfb94b.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 42,
          name: 'Rachael Park',
          patternsSample:
            '96.33.103.94 -- [ 01/Jan/2025:11:21:35 +0000 ] "GET /bundle/686664a561dfd4ec.js HTTP/1.1" 500 "http://bennett-harris.com/category/posts/homepage.htm" "Mozilla/5.0 (Linux; Android 4.1) AppleWebKit/536.2 (KHTML, like Gecko) Chrome/37.0.808.0 Safari/536.2"\n[866016] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=866016\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 84.247.105.15:9092 could not be established. Broker may not be available.\n[7399501] Problem reaching database. Timeout http request GET https://ibm.box.com/s/8c264fbc7f4b0659\nError occurred while calling aws lambda system- endpoint : https://c542adea62.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 43,
          name: 'Tracy Myers',
          patternsSample:
            '6.253.163.48 -- [ 23/Mar/2025:21:57:28 +0000 ] "GET /bundle/a071285b12586fb5.js HTTP/1.1" 200 "https://hartman.net/search/" "Opera/9.10.(Windows NT 5.01; bho-IN) Presto/2.9.160 Version/11.00"\n[797500] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=797500\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 78.120.37.208:9092 could not be established. Broker may not be available.\n[2839216] Problem reaching database. Timeout http request GET https://ibm.box.com/s/395edd6aa8d0faca\nError occurred while calling aws lambda system- endpoint : https://7839641cc9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 44,
          name: 'Henry Rogers',
          patternsSample:
            '185.15.187.187 -- [ 04/Apr/2025:03:53:03 +0000 ] "GET /bundle/20ef714c998ee1c4.js HTTP/1.1" 403 "https://www.hernandez-craig.com/main/wp-content/wp-content/main/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 5.01; Trident/3.0)"\n[326993] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=326993\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 97.78.201.60:9092 could not be established. Broker may not be available.\n[5996176] Problem reaching database. Timeout http request GET https://ibm.box.com/s/84e2b8a8bb132590\nError occurred while calling aws lambda system- endpoint : https://24406a95bd.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 45,
          name: 'David Nichols',
          patternsSample:
            '198.200.119.5 -- [ 12/Apr/2025:00:52:15 +0000 ] "GET /bundle/92ba8f11500f633e.js HTTP/1.1" 403 "https://adams-adkins.org/" "Mozilla/5.0 (X11; Linux i686) AppleWebKit/532.0 (KHTML, like Gecko) Chrome/43.0.881.0 Safari/532.0"\n[950183] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=950183\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 183.142.253.188:9092 could not be established. Broker may not be available.\n[3599920] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d4844aec14c0083b\nError occurred while calling aws lambda system- endpoint : https://a628c7cba8.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 46,
          name: 'Jessica Lynch',
          patternsSample:
            '168.45.146.181 -- [ 27/Feb/2025:19:13:15 +0000 ] "GET /bundle/9b6916d59a4954b9.js HTTP/1.1" 504 "http://www.reynolds.com/tag/categories/post.html" "Mozilla/5.0 (compatible; MSIE 5.0; Windows NT 6.1; Trident/4.0)"\n[819699] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=819699\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 123.176.54.149:9092 could not be established. Broker may not be available.\n[9057126] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d0f41acbc7757dcc\nError occurred while calling aws lambda system- endpoint : https://acc2aec573.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 47,
          name: 'Ebony Jennings',
          patternsSample:
            '62.28.175.165 -- [ 09/May/2025:08:08:27 +0000 ] "GET /bundle/95ac6b6367de14cc.js HTTP/1.1" 500 "https://www.perez.com/" "Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_5 like Mac OS X) AppleWebKit/532.2 (KHTML, like Gecko) FxiOS/12.2b8638.0 Mobile/11Y920 Safari/532.2"\n[384865] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=384865\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 35.150.58.21:9092 could not be established. Broker may not be available.\n[8118764] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4ecbc8f30d4c0c69\nError occurred while calling aws lambda system- endpoint : https://204aa363a7.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 48,
          name: 'Lisa Rowe',
          patternsSample:
            '154.0.14.56 -- [ 01/Mar/2025:09:25:24 +0000 ] "GET /bundle/060d8d21752c8777.js HTTP/1.1" 403 "http://www.carroll-burns.com/terms.html" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3 like Mac OS X; ug-CN) AppleWebKit/532.38.3 (KHTML, like Gecko) Version/3.0.5 Mobile/8B119 Safari/6532.38.3"\n[905371] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=905371\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 79.221.62.201:9092 could not be established. Broker may not be available.\n[8483011] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5739923a7e91ee9d\nError occurred while calling aws lambda system- endpoint : https://05bd0541df.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 49,
          name: 'Tiffany Garcia',
          patternsSample:
            '180.235.178.69 -- [ 12/Jan/2025:18:36:31 +0000 ] "GET /bundle/0bd19e8ace8c3391.js HTTP/1.1" 403 "http://www.gregory-valdez.org/categories/main/tag/category.html" "Mozilla/5.0 (Linux; Android 7.1.2) AppleWebKit/533.0 (KHTML, like Gecko) Chrome/36.0.865.0 Safari/533.0"\n[837637] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=837637\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 126.229.210.121:9092 could not be established. Broker may not be available.\n[3067775] Problem reaching database. Timeout http request GET https://ibm.box.com/s/71e3175b066ade7e\nError occurred while calling aws lambda system- endpoint : https://05bd069e32.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 50,
          name: 'Cassandra Anderson',
          patternsSample:
            '40.237.195.45 -- [ 14/Jan/2025:17:22:19 +0000 ] "GET /bundle/ab6905759734df8a.js HTTP/1.1" 504 "http://hamilton.com/faq.htm" "Mozilla/5.0 (Linux; Android 5.0.1) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/46.0.834.0 Safari/535.1"\n[745425] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=745425\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 33.2.162.168:9092 could not be established. Broker may not be available.\n[5722033] Problem reaching database. Timeout http request GET https://ibm.box.com/s/9c362d324cf61025\nError occurred while calling aws lambda system- endpoint : https://426d30d36f.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 51,
          name: 'Jennifer Sanders',
          patternsSample:
            '55.153.133.235 -- [ 07/Apr/2025:16:58:46 +0000 ] "GET /bundle/808f432c06bed75a.js HTTP/1.1" 403 "http://www.beard.com/tags/wp-content/main/register/" "Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_6 like Mac OS X) AppleWebKit/534.1 (KHTML, like Gecko) FxiOS/14.9d4562.0 Mobile/83C823 Safari/534.1"\n[270746] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=270746\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 3.84.186.253:9092 could not be established. Broker may not be available.\n[1695654] Problem reaching database. Timeout http request GET https://ibm.box.com/s/6e15b71d559ac0f4\nError occurred while calling aws lambda system- endpoint : https://d2ddaa4b54.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 52,
          name: 'Mr. Johnny Berger',
          patternsSample:
            '217.180.201.74 -- [ 15/Apr/2025:17:54:53 +0000 ] "GET /bundle/e4977992f4032de1.js HTTP/1.1" 200 "https://ferguson-gonzalez.net/homepage/" "Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 10.0; Trident/4.0)"\n[116813] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=116813\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 172.38.150.117:9092 could not be established. Broker may not be available.\n[3152145] Problem reaching database. Timeout http request GET https://ibm.box.com/s/aa3222d165db5414\nError occurred while calling aws lambda system- endpoint : https://4d4b66077e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 53,
          name: 'Elizabeth Randolph',
          patternsSample:
            '79.237.96.127 -- [ 19/Mar/2025:11:01:27 +0000 ] "GET /bundle/ce5ffc2696b239fe.js HTTP/1.1" 500 "https://www.kim.com/category/wp-content/faq/" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_6_4) AppleWebKit/536.1 (KHTML, like Gecko) Chrome/33.0.819.0 Safari/536.1"\n[736066] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=736066\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 69.72.209.48:9092 could not be established. Broker may not be available.\n[5151606] Problem reaching database. Timeout http request GET https://ibm.box.com/s/6b2e1cf83df88aa6\nError occurred while calling aws lambda system- endpoint : https://51af153d10.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 54,
          name: 'Jennifer Walter',
          patternsSample:
            '186.206.30.115 -- [ 27/Mar/2025:16:52:36 +0000 ] "GET /bundle/2b1c1c02e4a1c6ea.js HTTP/1.1" 200 "http://woodard-park.com/app/about/" "Mozilla/5.0 (compatible; MSIE 8.0; Windows CE; Trident/4.1)"\n[670290] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=670290\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 132.127.214.11:9092 could not be established. Broker may not be available.\n[7340789] Problem reaching database. Timeout http request GET https://ibm.box.com/s/417e443b3948c932\nError occurred while calling aws lambda system- endpoint : https://ee4760cb1e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 55,
          name: 'Emily Waller',
          patternsSample:
            '50.142.180.204 -- [ 01/Apr/2025:00:00:53 +0000 ] "GET /bundle/2ff11ad514303f1d.js HTTP/1.1" 403 "http://www.smith.org/explore/category/tag/search/" "Opera/8.54.(X11; Linux i686; tcy-IN) Presto/2.9.162 Version/11.00"\n[579004] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=579004\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 187.99.11.99:9092 could not be established. Broker may not be available.\n[8020821] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c85b06167ef97a62\nError occurred while calling aws lambda system- endpoint : https://0b6c749ffc.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 56,
          name: 'Mitchell Davies',
          patternsSample:
            '154.213.171.33 -- [ 05/Apr/2025:13:28:55 +0000 ] "GET /bundle/7505795241d57505.js HTTP/1.1" 504 "https://johnson.com/" "Mozilla/5.0 (Android 2.0.1; Mobile; rv:53.0) Gecko/53.0 Firefox/53.0"\n[212083] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=212083\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 130.212.29.224:9092 could not be established. Broker may not be available.\n[8919034] Problem reaching database. Timeout http request GET https://ibm.box.com/s/fca19d6bd184bb9d\nError occurred while calling aws lambda system- endpoint : https://eff2cd2e29.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 57,
          name: 'Michael Wade',
          patternsSample:
            '41.140.245.231 -- [ 24/Apr/2025:20:41:44 +0000 ] "GET /bundle/6ae03f452b5d46db.js HTTP/1.1" 504 "http://www.martinez.com/explore/tags/register/" "Opera/9.46.(X11; Linux x86_64; sd-IN) Presto/2.9.190 Version/10.00"\n[830635] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=830635\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 69.82.54.46:9092 could not be established. Broker may not be available.\n[9310736] Problem reaching database. Timeout http request GET https://ibm.box.com/s/cf3c5b1d3a024c02\nError occurred while calling aws lambda system- endpoint : https://ec1efdcfc3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 58,
          name: 'Rachel Mills',
          patternsSample:
            '97.159.80.146 -- [ 04/May/2025:06:35:50 +0000 ] "GET /bundle/9a95f50d1877f61c.js HTTP/1.1" 403 "https://roberts.org/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_7 rv:3.0; fil-PH) AppleWebKit/535.7.1 (KHTML, like Gecko) Version/4.0 Safari/535.7.1"\n[906148] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=906148\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 209.97.199.18:9092 could not be established. Broker may not be available.\n[3426597] Problem reaching database. Timeout http request GET https://ibm.box.com/s/15a5acd03987ea71\nError occurred while calling aws lambda system- endpoint : https://371787d19b.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 59,
          name: 'Gregory Chandler',
          patternsSample:
            '10.110.1.227 -- [ 19/May/2025:09:34:36 +0000 ] "GET /bundle/10ceac1629bdc4c3.js HTTP/1.1" 200 "https://www.hill-shepard.com/category/post/" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_9_1; rv:1.9.4.20) Gecko/2023-08-13 02:02:14 Firefox/10.0"\n[861140] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=861140\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 8.203.151.61:9092 could not be established. Broker may not be available.\n[6575385] Problem reaching database. Timeout http request GET https://ibm.box.com/s/00df6c2f6c1e7c0a\nError occurred while calling aws lambda system- endpoint : https://5f2909d723.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 60,
          name: 'Yvonne Nguyen',
          patternsSample:
            '89.231.214.130 -- [ 08/Feb/2025:11:04:01 +0000 ] "GET /bundle/96709e26fd8cd54e.js HTTP/1.1" 403 "https://howell-taylor.com/" "Opera/8.38.(Windows NT 6.0; mhr-RU) Presto/2.9.162 Version/11.00"\n[310076] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=310076\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 163.95.245.33:9092 could not be established. Broker may not be available.\n[6448762] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b0e6f037599b00a4\nError occurred while calling aws lambda system- endpoint : https://b633c1c0da.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 61,
          name: 'Christian Perkins',
          patternsSample:
            '189.248.201.127 -- [ 18/Feb/2025:20:15:13 +0000 ] "GET /bundle/e558fb88f692b9e1.js HTTP/1.1" 200 "http://www.barrera.biz/" "Opera/9.21.(Windows NT 6.1; ks-IN) Presto/2.9.188 Version/11.00"\n[928662] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=928662\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 210.58.163.113:9092 could not be established. Broker may not be available.\n[7806434] Problem reaching database. Timeout http request GET https://ibm.box.com/s/8f6c9627125f7658\nError occurred while calling aws lambda system- endpoint : https://67eb8002b8.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 62,
          name: 'Amanda Dominguez',
          patternsSample:
            '154.55.135.144 -- [ 24/Apr/2025:14:00:02 +0000 ] "GET /bundle/619b88365e7ca973.js HTTP/1.1" 200 "https://www.shepard-jones.net/search.html" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_0) AppleWebKit/532.0 (KHTML, like Gecko) Chrome/52.0.892.0 Safari/532.0"\n[924619] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=924619\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 92.23.158.143:9092 could not be established. Broker may not be available.\n[7224393] Problem reaching database. Timeout http request GET https://ibm.box.com/s/97598a1e4fca483c\nError occurred while calling aws lambda system- endpoint : https://6e2d984019.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 63,
          name: 'Patricia Stevenson',
          patternsSample:
            '48.224.171.235 -- [ 28/Feb/2025:23:47:17 +0000 ] "GET /bundle/227b337b58d2a8f9.js HTTP/1.1" 500 "https://www.barry-kelley.org/faq.jsp" "Mozilla/5.0 (compatible; MSIE 7.0; Windows 95; Trident/4.1)"\n[380303] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=380303\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 186.26.4.48:9092 could not be established. Broker may not be available.\n[8023997] Problem reaching database. Timeout http request GET https://ibm.box.com/s/2913a0db507a2c35\nError occurred while calling aws lambda system- endpoint : https://fad72d64bd.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 64,
          name: 'Christine Garcia',
          patternsSample:
            '15.44.232.165 -- [ 09/Feb/2025:14:53:00 +0000 ] "GET /bundle/68a6f4218b797742.js HTTP/1.1" 504 "http://barker.com/category.html" "Opera/9.66.(X11; Linux i686; ce-RU) Presto/2.9.178 Version/11.00"\n[149149] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=149149\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 184.111.54.104:9092 could not be established. Broker may not be available.\n[3138985] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ded9f7908ac5cf00\nError occurred while calling aws lambda system- endpoint : https://8cc70df368.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 65,
          name: 'Kyle Cowan',
          patternsSample:
            '155.230.246.227 -- [ 15/Jan/2025:17:14:50 +0000 ] "GET /bundle/8993eb2a4dbb59d0.js HTTP/1.1" 403 "http://www.blackburn.com/posts/explore/app/about/" "Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/532.0 (KHTML, like Gecko) CriOS/63.0.873.0 Mobile/64P671 Safari/532.0"\n[552160] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=552160\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 54.193.134.152:9092 could not be established. Broker may not be available.\n[9427903] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b034c83f0b4e93ec\nError occurred while calling aws lambda system- endpoint : https://7da51e5d6a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 66,
          name: 'Paul Fields',
          patternsSample:
            '72.186.100.170 -- [ 04/Feb/2025:21:38:12 +0000 ] "GET /bundle/ec911ad2b539fb85.js HTTP/1.1" 200 "http://lambert.biz/" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_10_9; rv:1.9.5.20) Gecko/2014-04-14 13:05:02 Firefox/3.6.10"\n[650976] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=650976\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 170.187.250.223:9092 could not be established. Broker may not be available.\n[2017557] Problem reaching database. Timeout http request GET https://ibm.box.com/s/74bcdba1acba2d09\nError occurred while calling aws lambda system- endpoint : https://1f4b8b63fb.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 67,
          name: 'William Gonzales',
          patternsSample:
            '206.80.65.207 -- [ 28/Apr/2025:14:53:00 +0000 ] "GET /bundle/24b7345bcc5bb4e5.js HTTP/1.1" 500 "https://cardenas.com/" "Mozilla/5.0 (X11; Linux i686; rv:1.9.7.20) Gecko/2023-03-02 04:17:13 Firefox/3.6.16"\n[888705] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=888705\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 146.205.125.197:9092 could not be established. Broker may not be available.\n[9627597] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ae48053746619e28\nError occurred while calling aws lambda system- endpoint : https://cc335ee179.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 68,
          name: 'Sheri Boyer',
          patternsSample:
            '63.12.58.87 -- [ 20/Mar/2025:16:48:46 +0000 ] "GET /bundle/0677e565aa80ccb9.js HTTP/1.1" 200 "http://wright-banks.info/tags/explore/faq.html" "Opera/8.49.(X11; Linux x86_64; eo-US) Presto/2.9.175 Version/12.00"\n[908216] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=908216\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 129.149.48.66:9092 could not be established. Broker may not be available.\n[1914575] Problem reaching database. Timeout http request GET https://ibm.box.com/s/6e9d272a3092c380\nError occurred while calling aws lambda system- endpoint : https://4d0770eedc.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 69,
          name: 'Christopher Turner',
          patternsSample:
            '175.149.5.69 -- [ 17/Mar/2025:06:58:18 +0000 ] "GET /bundle/4b40ebc2e3eed58c.js HTTP/1.1" 200 "http://www.gonzalez-garcia.com/search/" "Mozilla/5.0 (Linux; Android 9) AppleWebKit/534.1 (KHTML, like Gecko) Chrome/56.0.804.0 Safari/534.1"\n[646262] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=646262\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 56.46.234.232:9092 could not be established. Broker may not be available.\n[2879360] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c05989d71b6ecfcc\nError occurred while calling aws lambda system- endpoint : https://4b0007e2e6.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 70,
          name: 'Kelly Howard',
          patternsSample:
            '62.97.144.179 -- [ 30/Mar/2025:14:34:10 +0000 ] "GET /bundle/c259689f90276f5b.js HTTP/1.1" 200 "https://www.bates.info/home/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows 95; Trident/5.0)"\n[986423] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=986423\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 10.230.245.254:9092 could not be established. Broker may not be available.\n[2545116] Problem reaching database. Timeout http request GET https://ibm.box.com/s/1e9cbefc75687e6e\nError occurred while calling aws lambda system- endpoint : https://c6d8d90bbe.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 71,
          name: 'Albert Torres',
          patternsSample:
            '223.97.218.160 -- [ 28/Mar/2025:09:04:03 +0000 ] "GET /bundle/bb7358bcf3752d99.js HTTP/1.1" 200 "http://www.king.com/posts/category/author.html" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.2; Trident/4.1)"\n[680803] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=680803\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 106.215.9.130:9092 could not be established. Broker may not be available.\n[7855064] Problem reaching database. Timeout http request GET https://ibm.box.com/s/cdb9cb1010f8e05a\nError occurred while calling aws lambda system- endpoint : https://2d901e0e52.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 72,
          name: 'Michael Mitchell',
          patternsSample:
            '52.58.112.2 -- [ 03/Mar/2025:04:21:57 +0000 ] "GET /bundle/68adcad124c3ee4d.js HTTP/1.1" 200 "https://www.kramer-davis.com/category/list/tag/author/" "Opera/8.95.(X11; Linux x86_64; hu-HU) Presto/2.9.167 Version/12.00"\n[844945] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=844945\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 173.121.50.203:9092 could not be established. Broker may not be available.\n[8778874] Problem reaching database. Timeout http request GET https://ibm.box.com/s/43047d0382ca7d2b\nError occurred while calling aws lambda system- endpoint : https://ab8929cdcf.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 73,
          name: 'Michele Estes',
          patternsSample:
            '112.119.212.248 -- [ 10/Mar/2025:10:43:42 +0000 ] "GET /bundle/566e66ea382198ee.js HTTP/1.1" 403 "https://www.nunez.com/" "Mozilla/5.0 (compatible; MSIE 8.0; Windows 98; Win 9x 4.90; Trident/5.0)"\n[940947] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=940947\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 96.95.33.250:9092 could not be established. Broker may not be available.\n[6814676] Problem reaching database. Timeout http request GET https://ibm.box.com/s/9b2f1d4d5560a87c\nError occurred while calling aws lambda system- endpoint : https://7e901a22eb.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 74,
          name: 'Carly Morales',
          patternsSample:
            '123.136.78.133 -- [ 18/Apr/2025:11:19:32 +0000 ] "GET /bundle/9f8930b83943208a.js HTTP/1.1" 403 "https://keith-parks.info/search/" "Opera/9.97.(X11; Linux i686; csb-PL) Presto/2.9.185 Version/10.00"\n[269904] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=269904\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 151.163.143.87:9092 could not be established. Broker may not be available.\n[5576264] Problem reaching database. Timeout http request GET https://ibm.box.com/s/991976458cd5f95c\nError occurred while calling aws lambda system- endpoint : https://cca9023bc1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 75,
          name: 'Charles Chang',
          patternsSample:
            '89.17.219.133 -- [ 22/Feb/2025:16:54:10 +0000 ] "GET /bundle/e1c12105134821d9.js HTTP/1.1" 504 "http://giles.com/search.htm" "Mozilla/5.0 (Windows CE; sv-SE; rv:1.9.1.20) Gecko/2014-05-31 21:52:19 Firefox/3.8"\n[728323] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=728323\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 100.38.180.204:9092 could not be established. Broker may not be available.\n[8474292] Problem reaching database. Timeout http request GET https://ibm.box.com/s/cf46d43162e948d6\nError occurred while calling aws lambda system- endpoint : https://64e6e72ee9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 76,
          name: 'Derrick Richardson',
          patternsSample:
            '207.31.140.196 -- [ 17/Apr/2025:22:58:38 +0000 ] "GET /bundle/f2b98a395ee8ca74.js HTTP/1.1" 403 "https://sanders.com/category/categories/register.jsp" "Opera/8.84.(X11; Linux x86_64; bs-BA) Presto/2.9.175 Version/11.00"\n[652801] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=652801\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 168.200.209.158:9092 could not be established. Broker may not be available.\n[3796538] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4fc5d7ae77e45224\nError occurred while calling aws lambda system- endpoint : https://47c7fb421b.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 77,
          name: 'Lucas Freeman',
          patternsSample:
            '109.134.21.92 -- [ 30/Jan/2025:17:53:00 +0000 ] "GET /bundle/182a63b8197200d5.js HTTP/1.1" 403 "http://barber-carroll.com/explore/list/search/" "Mozilla/5.0 (Windows NT 6.2; sl-SI; rv:1.9.0.20) Gecko/2015-06-29 00:36:41 Firefox/15.0"\n[850946] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=850946\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 111.126.117.71:9092 could not be established. Broker may not be available.\n[6769923] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ae9dc120d4e5227d\nError occurred while calling aws lambda system- endpoint : https://06dac476a1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 78,
          name: 'David Galloway',
          patternsSample:
            '34.254.180.47 -- [ 16/Feb/2025:10:22:49 +0000 ] "GET /bundle/af0c6718a2cda191.js HTTP/1.1" 200 "https://www.garcia.com/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_1 like Mac OS X; lv-LV) AppleWebKit/533.28.6 (KHTML, like Gecko) Version/4.0.5 Mobile/8B113 Safari/6533.28.6"\n[596615] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=596615\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 206.116.161.200:9092 could not be established. Broker may not be available.\n[3345373] Problem reaching database. Timeout http request GET https://ibm.box.com/s/eb79c29c3d071399\nError occurred while calling aws lambda system- endpoint : https://4a8569cc42.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 79,
          name: 'Meghan Jones PhD',
          patternsSample:
            '54.56.45.1 -- [ 15/Apr/2025:19:35:06 +0000 ] "GET /bundle/1bd5c045f8f963d2.js HTTP/1.1" 504 "http://www.scott.com/" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_7_0; rv:1.9.5.20) Gecko/2012-07-18 12:03:16 Firefox/3.8"\n[419499] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=419499\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 169.25.180.199:9092 could not be established. Broker may not be available.\n[3626393] Problem reaching database. Timeout http request GET https://ibm.box.com/s/91ad28fc95a2d508\nError occurred while calling aws lambda system- endpoint : https://5a840fc5d1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 80,
          name: 'Jennifer Navarro',
          patternsSample:
            '130.74.147.129 -- [ 07/Apr/2025:08:35:37 +0000 ] "GET /bundle/f8feed4bcae6175f.js HTTP/1.1" 500 "http://www.norton.com/homepage/" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_9_6; rv:1.9.2.20) Gecko/2017-05-17 04:21:44 Firefox/3.6.14"\n[143283] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=143283\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 78.92.33.209:9092 could not be established. Broker may not be available.\n[7425962] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e09b7c9848a22190\nError occurred while calling aws lambda system- endpoint : https://12aeaa0cd1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 81,
          name: 'Emily Moon',
          patternsSample:
            '138.79.190.51 -- [ 11/Feb/2025:13:54:10 +0000 ] "GET /bundle/bdc49da0725cb621.js HTTP/1.1" 403 "http://ward.net/register/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 5.1; Trident/5.1)"\n[248609] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=248609\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 142.213.101.39:9092 could not be established. Broker may not be available.\n[1274742] Problem reaching database. Timeout http request GET https://ibm.box.com/s/21c56cef754300b3\nError occurred while calling aws lambda system- endpoint : https://dac69d538a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 82,
          name: 'Arthur Kelley',
          patternsSample:
            '41.109.191.80 -- [ 12/Jan/2025:07:08:19 +0000 ] "GET /bundle/bc75ec9d23f795c1.js HTTP/1.1" 504 "https://www.guerrero.com/" "Mozilla/5.0 (Windows; U; Windows NT 6.0) AppleWebKit/535.50.7 (KHTML, like Gecko) Version/4.0.3 Safari/535.50.7"\n[217861] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=217861\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 182.205.218.134:9092 could not be established. Broker may not be available.\n[3973125] Problem reaching database. Timeout http request GET https://ibm.box.com/s/00ca37f7909c84bd\nError occurred while calling aws lambda system- endpoint : https://f0ab1f8916.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 83,
          name: 'Melissa Deleon DVM',
          patternsSample:
            '42.117.22.168 -- [ 16/Mar/2025:06:14:32 +0000 ] "GET /bundle/3c1f1b081d68e95e.js HTTP/1.1" 504 "https://www.mcmahon.com/author/" "Opera/8.90.(X11; Linux x86_64; ps-AF) Presto/2.9.176 Version/11.00"\n[977481] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=977481\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 23.236.11.193:9092 could not be established. Broker may not be available.\n[5307809] Problem reaching database. Timeout http request GET https://ibm.box.com/s/16621f90bc8c956f\nError occurred while calling aws lambda system- endpoint : https://563534b1fc.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 84,
          name: 'Yolanda Proctor DVM',
          patternsSample:
            '205.63.248.194 -- [ 11/Apr/2025:11:55:21 +0000 ] "GET /bundle/44118cb330723334.js HTTP/1.1" 403 "https://thompson-hernandez.biz/blog/blog/author/" "Mozilla/5.0 (iPad; CPU iPad OS 5_1_1 like Mac OS X) AppleWebKit/535.0 (KHTML, like Gecko) CriOS/43.0.898.0 Mobile/99K419 Safari/535.0"\n[546707] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=546707\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 82.17.79.89:9092 could not be established. Broker may not be available.\n[8068191] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0c96b3504497c8a1\nError occurred while calling aws lambda system- endpoint : https://d7d38e99b4.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 85,
          name: 'Mindy Owen',
          patternsSample:
            '60.240.95.22 -- [ 03/Jan/2025:02:43:13 +0000 ] "GET /bundle/c7801dd40945e3d1.js HTTP/1.1" 500 "http://www.smith-berg.com/" "Opera/9.64.(X11; Linux i686; it-IT) Presto/2.9.162 Version/10.00"\n[241330] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=241330\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 51.82.249.121:9092 could not be established. Broker may not be available.\n[7006650] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f773f8508dd41a4a\nError occurred while calling aws lambda system- endpoint : https://a42f5930dc.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 86,
          name: 'Mrs. Lori Martin',
          patternsSample:
            '92.128.77.179 -- [ 30/Jan/2025:00:29:43 +0000 ] "GET /bundle/903d80776e49bdfc.js HTTP/1.1" 500 "https://mitchell.net/home.html" "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 10.0; Trident/4.1)"\n[642659] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=642659\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 140.82.153.116:9092 could not be established. Broker may not be available.\n[1879051] Problem reaching database. Timeout http request GET https://ibm.box.com/s/33c5900677ec4274\nError occurred while calling aws lambda system- endpoint : https://8ffd633eca.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 87,
          name: 'Samuel Hill',
          patternsSample:
            '115.43.94.30 -- [ 25/Mar/2025:09:09:28 +0000 ] "GET /bundle/24581fbd1fac4f34.js HTTP/1.1" 403 "https://baker-rivera.com/search/main/list/homepage.html" "Mozilla/5.0 (Windows; U; Windows NT 10.0) AppleWebKit/534.40.4 (KHTML, like Gecko) Version/4.0.4 Safari/534.40.4"\n[878602] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=878602\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 134.121.66.242:9092 could not be established. Broker may not be available.\n[2433581] Problem reaching database. Timeout http request GET https://ibm.box.com/s/2b456e3328a62aea\nError occurred while calling aws lambda system- endpoint : https://e6f95f8fc6.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 88,
          name: 'Joel Lindsey',
          patternsSample:
            '106.255.242.248 -- [ 16/May/2025:16:53:48 +0000 ] "GET /bundle/3ce7ac1da085af1b.js HTTP/1.1" 504 "http://www.campbell.com/register/" "Opera/9.86.(Windows CE; uz-UZ) Presto/2.9.185 Version/12.00"\n[791284] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=791284\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 138.224.217.104:9092 could not be established. Broker may not be available.\n[4511156] Problem reaching database. Timeout http request GET https://ibm.box.com/s/1aac868b193668ec\nError occurred while calling aws lambda system- endpoint : https://be3e3d540f.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 89,
          name: 'Kevin Scott',
          patternsSample:
            '100.143.24.203 -- [ 25/Mar/2025:09:29:46 +0000 ] "GET /bundle/a1dd60b0f74c1ffe.js HTTP/1.1" 403 "http://garcia.info/category/category/author/" "Mozilla/5.0 (X11; Linux i686; rv:1.9.7.20) Gecko/2024-06-03 12:25:39 Firefox/3.6.2"\n[286593] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=286593\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 27.41.254.197:9092 could not be established. Broker may not be available.\n[3641837] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b65764c450b4992c\nError occurred while calling aws lambda system- endpoint : https://d64b1e6683.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 90,
          name: 'Rachel Jackson',
          patternsSample:
            '81.235.248.150 -- [ 03/Apr/2025:13:19:04 +0000 ] "GET /bundle/bfd174703b5f5027.js HTTP/1.1" 504 "http://clark.net/explore/home/" "Opera/8.78.(X11; Linux x86_64; sa-IN) Presto/2.9.185 Version/11.00"\n[832379] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=832379\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 8.166.182.101:9092 could not be established. Broker may not be available.\n[6498216] Problem reaching database. Timeout http request GET https://ibm.box.com/s/64172f64d0d0c7d7\nError occurred while calling aws lambda system- endpoint : https://8840dad442.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 91,
          name: 'Mariah Carroll',
          patternsSample:
            '83.78.147.187 -- [ 10/Feb/2025:12:11:23 +0000 ] "GET /bundle/ddb89154b40732ad.js HTTP/1.1" 504 "http://west.org/main/" "Mozilla/5.0 (compatible; MSIE 5.0; Windows NT 6.1; Trident/4.0)"\n[107557] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=107557\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 25.180.52.156:9092 could not be established. Broker may not be available.\n[3581114] Problem reaching database. Timeout http request GET https://ibm.box.com/s/260c97177fa2fa99\nError occurred while calling aws lambda system- endpoint : https://3fb32036c9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 92,
          name: 'Nathan Chandler',
          patternsSample:
            '151.237.189.246 -- [ 22/Jan/2025:19:48:18 +0000 ] "GET /bundle/68686c64a4518846.js HTTP/1.1" 200 "https://www.gallagher-black.com/category/categories/tag/author/" "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/535.1 (KHTML, like Gecko) CriOS/58.0.857.0 Mobile/61W948 Safari/535.1"\n[142184] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=142184\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 202.86.139.249:9092 could not be established. Broker may not be available.\n[4557004] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b2d617a53a218947\nError occurred while calling aws lambda system- endpoint : https://44be157f97.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 93,
          name: 'Garrett Smith',
          patternsSample:
            '178.13.251.153 -- [ 29/Jan/2025:13:06:58 +0000 ] "GET /bundle/7743025424602cae.js HTTP/1.1" 200 "http://www.moore-bryan.com/homepage/" "Mozilla/5.0 (Windows NT 4.0; sv-FI; rv:1.9.2.20) Gecko/2020-10-17 21:34:03 Firefox/3.8"\n[117409] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=117409\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 158.57.214.204:9092 could not be established. Broker may not be available.\n[2241433] Problem reaching database. Timeout http request GET https://ibm.box.com/s/7ce0e887b6b85cc7\nError occurred while calling aws lambda system- endpoint : https://7aa8e8e488.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 94,
          name: 'Rebecca Potter',
          patternsSample:
            '217.14.189.187 -- [ 16/May/2025:19:04:42 +0000 ] "GET /bundle/6d1696bff8f4bb05.js HTTP/1.1" 403 "https://klein.org/" "Mozilla/5.0 (Android 3.2.2; Mobile; rv:7.0) Gecko/7.0 Firefox/7.0"\n[994259] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=994259\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 170.72.49.160:9092 could not be established. Broker may not be available.\n[7575100] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ca072db59d46bbc2\nError occurred while calling aws lambda system- endpoint : https://125c6e0d50.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 95,
          name: 'Kayla Berg',
          patternsSample:
            '196.239.55.29 -- [ 21/Apr/2025:18:56:12 +0000 ] "GET /bundle/1770a6a03cc82825.js HTTP/1.1" 403 "http://www.soto.info/app/author.jsp" "Opera/9.19.(Windows 98; Win 9x 4.90; sq-AL) Presto/2.9.169 Version/12.00"\n[425656] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=425656\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 43.52.6.230:9092 could not be established. Broker may not be available.\n[9960893] Problem reaching database. Timeout http request GET https://ibm.box.com/s/6680ec5ede268c42\nError occurred while calling aws lambda system- endpoint : https://3ea64e47ef.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 96,
          name: 'Kelly Johnson',
          patternsSample:
            '169.92.218.34 -- [ 04/May/2025:06:11:43 +0000 ] "GET /bundle/e24e183767e11a60.js HTTP/1.1" 504 "http://smith.com/privacy/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_2 like Mac OS X; vi-VN) AppleWebKit/534.14.2 (KHTML, like Gecko) Version/3.0.5 Mobile/8B113 Safari/6534.14.2"\n[396803] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=396803\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 155.225.168.236:9092 could not be established. Broker may not be available.\n[7089545] Problem reaching database. Timeout http request GET https://ibm.box.com/s/08bf844bb98c1919\nError occurred while calling aws lambda system- endpoint : https://65cfd702ef.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 97,
          name: 'Elizabeth Olson',
          patternsSample:
            '57.23.13.179 -- [ 12/Apr/2025:03:43:01 +0000 ] "GET /bundle/8b389ebb13be3311.js HTTP/1.1" 500 "https://schmidt.com/privacy.html" "Opera/8.11.(Windows NT 10.0; de-LU) Presto/2.9.181 Version/12.00"\n[275576] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=275576\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 43.136.79.108:9092 could not be established. Broker may not be available.\n[2500140] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d109b8219c411ec7\nError occurred while calling aws lambda system- endpoint : https://02954e62a4.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 98,
          name: 'Jacqueline Wilson',
          patternsSample:
            '176.114.116.241 -- [ 04/Feb/2025:17:58:47 +0000 ] "GET /bundle/0bf5a03a249f7b69.js HTTP/1.1" 504 "http://www.burnett.net/faq/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_5_9 rv:6.0; ss-ZA) AppleWebKit/533.20.6 (KHTML, like Gecko) Version/4.0.5 Safari/533.20.6"\n[608514] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=608514\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 142.37.47.221:9092 could not be established. Broker may not be available.\n[6940671] Problem reaching database. Timeout http request GET https://ibm.box.com/s/fddd01392084caf9\nError occurred while calling aws lambda system- endpoint : https://257a5ecd22.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 99,
          name: 'Stephanie Byrd',
          patternsSample:
            '151.173.99.207 -- [ 26/Jan/2025:15:35:28 +0000 ] "GET /bundle/f781b46e6331820d.js HTTP/1.1" 500 "http://summers.info/faq.php" "Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 6.1; Trident/3.1)"\n[267356] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=267356\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 105.202.160.64:9092 could not be established. Broker may not be available.\n[8972443] Problem reaching database. Timeout http request GET https://ibm.box.com/s/697dfa9afe68cf28\nError occurred while calling aws lambda system- endpoint : https://d629e2686a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 100,
          name: 'Erin Davies',
          patternsSample:
            '124.102.46.60 -- [ 21/Apr/2025:16:04:17 +0000 ] "GET /bundle/cc90fa35a8ef36cb.js HTTP/1.1" 403 "http://clark.com/index.htm" "Opera/9.53.(X11; Linux x86_64; aa-DJ) Presto/2.9.161 Version/11.00"\n[320615] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=320615\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 28.153.20.14:9092 could not be established. Broker may not be available.\n[3137784] Problem reaching database. Timeout http request GET https://ibm.box.com/s/438d2acdc98baa55\nError occurred while calling aws lambda system- endpoint : https://3efca3d927.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 101,
          name: 'Maria Miller',
          patternsSample:
            '8.103.91.245 -- [ 10/Apr/2025:21:05:58 +0000 ] "GET /bundle/48dbe4c81ee841d2.js HTTP/1.1" 403 "https://www.kennedy-oconnor.info/login/" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_0 rv:3.0; vi-VN) AppleWebKit/535.36.5 (KHTML, like Gecko) Version/5.1 Safari/535.36.5"\n[401045] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=401045\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 117.193.93.157:9092 could not be established. Broker may not be available.\n[4847117] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ff9bccb5aebea4a6\nError occurred while calling aws lambda system- endpoint : https://012268a001.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 102,
          name: 'Brenda Harrison',
          patternsSample:
            '47.178.56.206 -- [ 22/Jan/2025:13:46:13 +0000 ] "GET /bundle/f829ec55dede295a.js HTTP/1.1" 500 "http://www.sanchez-mitchell.com/about.html" "Mozilla/5.0 (Linux; Android 2.3.4) AppleWebKit/532.0 (KHTML, like Gecko) Chrome/62.0.830.0 Safari/532.0"\n[523184] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=523184\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 49.124.41.96:9092 could not be established. Broker may not be available.\n[2996745] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d217f339b45768e5\nError occurred while calling aws lambda system- endpoint : https://1108e82a12.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 103,
          name: 'Jeremy Vega',
          patternsSample:
            '142.223.125.21 -- [ 11/Jan/2025:17:33:34 +0000 ] "GET /bundle/9cc3817e563460ff.js HTTP/1.1" 500 "http://evans.com/homepage/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows 95; Trident/5.0)"\n[586345] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=586345\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 44.174.149.36:9092 could not be established. Broker may not be available.\n[7968220] Problem reaching database. Timeout http request GET https://ibm.box.com/s/255406d261fd3cfe\nError occurred while calling aws lambda system- endpoint : https://c6be773a8d.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 104,
          name: 'Diana Mcconnell',
          patternsSample:
            '167.156.1.183 -- [ 05/Mar/2025:03:54:07 +0000 ] "GET /bundle/b8a56e791f5457b9.js HTTP/1.1" 500 "http://www.noble.com/blog/tag/privacy/" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_2) AppleWebKit/536.1 (KHTML, like Gecko) Chrome/45.0.871.0 Safari/536.1"\n[909643] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=909643\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 85.221.182.47:9092 could not be established. Broker may not be available.\n[8065848] Problem reaching database. Timeout http request GET https://ibm.box.com/s/2919dcba95939077\nError occurred while calling aws lambda system- endpoint : https://537c6d0f54.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 105,
          name: 'Jessica Tucker',
          patternsSample:
            '21.11.244.165 -- [ 06/Mar/2025:17:50:41 +0000 ] "GET /bundle/20b3f4dea3c387f8.js HTTP/1.1" 504 "https://gregory-martinez.net/post/" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_8_8 rv:3.0; so-KE) AppleWebKit/534.21.2 (KHTML, like Gecko) Version/4.0.3 Safari/534.21.2"\n[732703] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=732703\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 196.35.32.192:9092 could not be established. Broker may not be available.\n[6933234] Problem reaching database. Timeout http request GET https://ibm.box.com/s/571dd925ddd3f545\nError occurred while calling aws lambda system- endpoint : https://6a37ae339e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 106,
          name: 'Jeremy Jones',
          patternsSample:
            '206.174.58.254 -- [ 06/Feb/2025:21:33:15 +0000 ] "GET /bundle/e4332460dab1c75f.js HTTP/1.1" 504 "https://www.norton-thompson.net/privacy/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3 like Mac OS X; en-NZ) AppleWebKit/534.15.5 (KHTML, like Gecko) Version/3.0.5 Mobile/8B118 Safari/6534.15.5"\n[108108] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=108108\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 2.74.227.2:9092 could not be established. Broker may not be available.\n[9669831] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4b428cccd0d87f90\nError occurred while calling aws lambda system- endpoint : https://58b5e7be54.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 107,
          name: 'Antonio Bush',
          patternsSample:
            '27.188.77.17 -- [ 26/Jan/2025:20:11:41 +0000 ] "GET /bundle/90e652e8f2ad473a.js HTTP/1.1" 504 "https://avery.info/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_2 like Mac OS X; ss-ZA) AppleWebKit/531.10.5 (KHTML, like Gecko) Version/4.0.5 Mobile/8B114 Safari/6531.10.5"\n[610345] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=610345\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 135.36.36.209:9092 could not be established. Broker may not be available.\n[3294615] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d1ef64b91971245b\nError occurred while calling aws lambda system- endpoint : https://43b2751291.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 108,
          name: 'Ross Hanna',
          patternsSample:
            '17.59.27.101 -- [ 07/Feb/2025:07:36:31 +0000 ] "GET /bundle/e2faaeb91a9de662.js HTTP/1.1" 200 "http://hicks-lopez.com/about/" "Opera/8.55.(Windows NT 4.0; quz-PE) Presto/2.9.186 Version/10.00"\n[917602] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=917602\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 42.59.222.176:9092 could not be established. Broker may not be available.\n[8590272] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d7d290f38ae7fcb0\nError occurred while calling aws lambda system- endpoint : https://f00483ba51.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 109,
          name: 'Jamie Hammond',
          patternsSample:
            '200.199.140.93 -- [ 16/May/2025:01:38:08 +0000 ] "GET /bundle/c99b802088a0e910.js HTTP/1.1" 403 "https://www.davis-jones.com/homepage/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 5.2; Trident/3.0)"\n[399634] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=399634\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 3.149.184.129:9092 could not be established. Broker may not be available.\n[6168682] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0b23cd0bd9127457\nError occurred while calling aws lambda system- endpoint : https://5032742bc0.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 110,
          name: 'Joshua Bonilla',
          patternsSample:
            '48.250.181.180 -- [ 10/Jan/2025:12:17:14 +0000 ] "GET /bundle/8309a7790c5584f5.js HTTP/1.1" 504 "https://mathews-miller.com/category/" "Opera/8.18.(X11; Linux i686; am-ET) Presto/2.9.188 Version/10.00"\n[643544] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=643544\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 124.125.3.57:9092 could not be established. Broker may not be available.\n[9613709] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f44ab350d636a9bb\nError occurred while calling aws lambda system- endpoint : https://98599bcaf0.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 111,
          name: 'David Castaneda',
          patternsSample:
            '107.93.87.119 -- [ 06/Jan/2025:04:31:12 +0000 ] "GET /bundle/4605300c4d3897d2.js HTTP/1.1" 500 "http://herrera.com/" "Mozilla/5.0 (Windows 98; Win 9x 4.90; iw-IL; rv:1.9.0.20) Gecko/2016-11-22 00:33:37 Firefox/3.8"\n[410033] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=410033\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 134.18.210.80:9092 could not be established. Broker may not be available.\n[7537896] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e5da43b3e28d68b7\nError occurred while calling aws lambda system- endpoint : https://c515d91f79.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 112,
          name: 'Bobby Hernandez',
          patternsSample:
            '135.56.179.230 -- [ 14/Mar/2025:06:25:22 +0000 ] "GET /bundle/6c88888570de8f89.js HTTP/1.1" 403 "https://bishop-english.net/posts/post/" "Mozilla/5.0 (Windows NT 4.0; ro-RO; rv:1.9.2.20) Gecko/2023-02-13 12:57:15 Firefox/3.8"\n[160988] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=160988\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 180.97.238.202:9092 could not be established. Broker may not be available.\n[4498519] Problem reaching database. Timeout http request GET https://ibm.box.com/s/8cf64253c98d7825\nError occurred while calling aws lambda system- endpoint : https://6936466bd9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 113,
          name: 'Randy Moore',
          patternsSample:
            '206.26.204.250 -- [ 17/Apr/2025:06:37:29 +0000 ] "GET /bundle/56ce7c51a016e050.js HTTP/1.1" 403 "http://cunningham.info/blog/login/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_1 like Mac OS X; fur-IT) AppleWebKit/533.26.3 (KHTML, like Gecko) Version/3.0.5 Mobile/8B116 Safari/6533.26.3"\n[411007] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=411007\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 191.40.208.159:9092 could not be established. Broker may not be available.\n[3299851] Problem reaching database. Timeout http request GET https://ibm.box.com/s/2648f487a19ea6b7\nError occurred while calling aws lambda system- endpoint : https://78921839c4.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 114,
          name: 'Roy Swanson',
          patternsSample:
            '119.189.99.68 -- [ 17/Jan/2025:01:18:44 +0000 ] "GET /bundle/f05c77a3cbedbece.js HTTP/1.1" 403 "https://torres.net/" "Mozilla/5.0 (X11; Linux x86_64; rv:1.9.5.20) Gecko/2024-06-01 06:55:02 Firefox/11.0"\n[972573] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=972573\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 217.49.53.88:9092 could not be established. Broker may not be available.\n[5630849] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0bb7eed918eafcd4\nError occurred while calling aws lambda system- endpoint : https://c6fae76f24.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 115,
          name: 'Douglas Jackson',
          patternsSample:
            '12.252.142.147 -- [ 17/Feb/2025:18:35:14 +0000 ] "GET /bundle/3c2a58b8dec214b5.js HTTP/1.1" 500 "http://wiley.biz/terms.html" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; Trident/5.1)"\n[608479] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=608479\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 115.160.180.66:9092 could not be established. Broker may not be available.\n[4912875] Problem reaching database. Timeout http request GET https://ibm.box.com/s/65c4ac4fa8214be6\nError occurred while calling aws lambda system- endpoint : https://95981c6483.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 116,
          name: 'Thomas Chandler',
          patternsSample:
            '193.159.146.63 -- [ 02/Apr/2025:15:49:56 +0000 ] "GET /bundle/f0bc1d6fd11812bf.js HTTP/1.1" 200 "http://www.pierce.com/" "Mozilla/5.0 (X11; Linux i686; rv:1.9.5.20) Gecko/2017-11-23 06:18:03 Firefox/3.8"\n[218561] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=218561\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 83.215.133.227:9092 could not be established. Broker may not be available.\n[4339570] Problem reaching database. Timeout http request GET https://ibm.box.com/s/3ccde337b991cd9c\nError occurred while calling aws lambda system- endpoint : https://8639abc8aa.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 117,
          name: 'John Martin',
          patternsSample:
            '47.39.147.170 -- [ 14/Feb/2025:12:00:00 +0000 ] "GET /bundle/7aee975c0f437d59.js HTTP/1.1" 403 "https://www.mcintosh.net/login/" "Opera/9.90.(Windows 98; Win 9x 4.90; sat-IN) Presto/2.9.178 Version/11.00"\n[684728] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=684728\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 180.182.40.73:9092 could not be established. Broker may not be available.\n[3278195] Problem reaching database. Timeout http request GET https://ibm.box.com/s/cfd06a4445b905ec\nError occurred while calling aws lambda system- endpoint : https://c7a344313c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 118,
          name: 'Rebecca Booker',
          patternsSample:
            '154.147.206.84 -- [ 07/Apr/2025:14:40:04 +0000 ] "GET /bundle/3b90436a06f1af43.js HTTP/1.1" 500 "https://sullivan-wells.net/list/tags/author.html" "Mozilla/5.0 (Linux; Android 4.0.2) AppleWebKit/534.2 (KHTML, like Gecko) Chrome/32.0.813.0 Safari/534.2"\n[226930] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=226930\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 46.155.165.80:9092 could not be established. Broker may not be available.\n[1047230] Problem reaching database. Timeout http request GET https://ibm.box.com/s/bbd7a80d6681b5ac\nError occurred while calling aws lambda system- endpoint : https://a7eda9dd45.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 119,
          name: 'David Goodwin',
          patternsSample:
            '154.16.34.205 -- [ 01/Apr/2025:22:48:21 +0000 ] "GET /bundle/18371987462ed232.js HTTP/1.1" 504 "https://www.doyle.net/search.php" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_0 like Mac OS X; ru-UA) AppleWebKit/532.36.3 (KHTML, like Gecko) Version/4.0.5 Mobile/8B114 Safari/6532.36.3"\n[839496] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=839496\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 29.153.60.206:9092 could not be established. Broker may not be available.\n[6350643] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f760061e7dd2cad0\nError occurred while calling aws lambda system- endpoint : https://e41c77c190.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 120,
          name: 'William Peterson',
          patternsSample:
            '92.83.218.183 -- [ 19/Mar/2025:14:00:49 +0000 ] "GET /bundle/676cb0b6007a333c.js HTTP/1.1" 403 "https://gonzales.com/" "Mozilla/5.0 (X11; Linux x86_64; rv:1.9.6.20) Gecko/2012-07-28 10:11:20 Firefox/11.0"\n[264230] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=264230\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 52.5.164.93:9092 could not be established. Broker may not be available.\n[7279181] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d6422e66b8576ba3\nError occurred while calling aws lambda system- endpoint : https://3baeead788.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 121,
          name: 'Sheila Walker',
          patternsSample:
            '13.227.94.131 -- [ 10/Feb/2025:08:20:04 +0000 ] "GET /bundle/255e5767f78a5364.js HTTP/1.1" 500 "https://www.lewis.com/blog/about/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_9; rv:1.9.5.20) Gecko/2010-10-31 15:51:35 Firefox/3.8"\n[956928] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=956928\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 20.14.9.149:9092 could not be established. Broker may not be available.\n[4196212] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0216ec10247fc062\nError occurred while calling aws lambda system- endpoint : https://e4bdbb0204.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 122,
          name: 'Shaun Harris',
          patternsSample:
            '222.24.153.43 -- [ 05/Feb/2025:06:29:45 +0000 ] "GET /bundle/2c99344dd7984631.js HTTP/1.1" 504 "https://smith-martinez.com/" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_7_5; rv:1.9.2.20) Gecko/2025-01-01 19:19:37 Firefox/3.8"\n[718113] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=718113\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 126.165.11.35:9092 could not be established. Broker may not be available.\n[4569177] Problem reaching database. Timeout http request GET https://ibm.box.com/s/848590d5059a9434\nError occurred while calling aws lambda system- endpoint : https://458e549084.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 123,
          name: 'Christina Joseph',
          patternsSample:
            '74.117.217.165 -- [ 17/Mar/2025:03:03:28 +0000 ] "GET /bundle/dd5e3b69cf2c6502.js HTTP/1.1" 403 "http://hart.com/author/" "Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 5.2; Trident/4.1)"\n[707904] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=707904\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 204.29.227.182:9092 could not be established. Broker may not be available.\n[7793031] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c23a7a0be0466c8b\nError occurred while calling aws lambda system- endpoint : https://02e962bbf2.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 124,
          name: 'Eric Jones',
          patternsSample:
            '223.107.180.63 -- [ 05/Jan/2025:14:41:04 +0000 ] "GET /bundle/9281dda283ee7d7e.js HTTP/1.1" 403 "https://www.sanchez-grant.com/explore/posts/register.jsp" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_11_7 rv:3.0; rw-RW) AppleWebKit/532.1.1 (KHTML, like Gecko) Version/4.0.1 Safari/532.1.1"\n[136320] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=136320\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 178.231.224.38:9092 could not be established. Broker may not be available.\n[5405101] Problem reaching database. Timeout http request GET https://ibm.box.com/s/080685fc35f99ba5\nError occurred while calling aws lambda system- endpoint : https://ddf4470620.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 125,
          name: 'Steven Lawrence',
          patternsSample:
            '91.114.25.63 -- [ 19/Mar/2025:18:01:14 +0000 ] "GET /bundle/254c986c4e9881ab.js HTTP/1.1" 500 "https://miles.biz/tag/register.asp" "Opera/8.92.(X11; Linux x86_64; apn-IN) Presto/2.9.182 Version/12.00"\n[266444] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=266444\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 28.101.245.21:9092 could not be established. Broker may not be available.\n[7076896] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5969c187e2d1b006\nError occurred while calling aws lambda system- endpoint : https://6b6fa0e39e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 126,
          name: 'Catherine Ellis',
          patternsSample:
            '101.214.100.133 -- [ 06/May/2025:00:32:29 +0000 ] "GET /bundle/1d988cf332d4343f.js HTTP/1.1" 403 "http://barker.com/search/category/category/main.asp" "Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 5.01; Trident/5.1)"\n[413270] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=413270\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 212.137.5.251:9092 could not be established. Broker may not be available.\n[4188047] Problem reaching database. Timeout http request GET https://ibm.box.com/s/70c916c0bf5b767f\nError occurred while calling aws lambda system- endpoint : https://b65f4b32f1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 127,
          name: 'Monica Holden',
          patternsSample:
            '5.204.225.163 -- [ 21/May/2025:16:08:32 +0000 ] "GET /bundle/d0721c38311f2f84.js HTTP/1.1" 500 "https://jones-miller.biz/post.html" "Mozilla/5.0 (compatible; MSIE 9.0; Windows 95; Trident/3.0)"\n[859324] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=859324\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 194.154.208.92:9092 could not be established. Broker may not be available.\n[3925659] Problem reaching database. Timeout http request GET https://ibm.box.com/s/3175f204bb96ce5c\nError occurred while calling aws lambda system- endpoint : https://179e1287d6.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 128,
          name: 'John Martin',
          patternsSample:
            '30.20.52.215 -- [ 13/Mar/2025:15:43:35 +0000 ] "GET /bundle/379bacd6aa1591e2.js HTTP/1.1" 500 "https://cole.com/" "Opera/9.30.(Windows NT 6.2; ar-JO) Presto/2.9.187 Version/11.00"\n[323516] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=323516\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 118.75.53.82:9092 could not be established. Broker may not be available.\n[4337359] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ddc0c92ee76f9fe8\nError occurred while calling aws lambda system- endpoint : https://9bd50ab6c2.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 129,
          name: 'Michael Ali',
          patternsSample:
            '29.113.130.17 -- [ 04/Mar/2025:00:13:31 +0000 ] "GET /bundle/4c5e9c0008e91eaf.js HTTP/1.1" 200 "https://randolph.biz/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_2 like Mac OS X; lo-LA) AppleWebKit/535.43.5 (KHTML, like Gecko) Version/4.0.5 Mobile/8B119 Safari/6535.43.5"\n[778175] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=778175\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 4.0.166.110:9092 could not be established. Broker may not be available.\n[7287554] Problem reaching database. Timeout http request GET https://ibm.box.com/s/7edb8c6748c2c22c\nError occurred while calling aws lambda system- endpoint : https://8f2e4a30fe.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 130,
          name: 'Jacob Nelson',
          patternsSample:
            '7.32.171.75 -- [ 27/Feb/2025:15:59:18 +0000 ] "GET /bundle/b308ea63689b9880.js HTTP/1.1" 500 "http://www.williams.net/main/" "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_4 like Mac OS X) AppleWebKit/532.0 (KHTML, like Gecko) CriOS/57.0.861.0 Mobile/46Y785 Safari/532.0"\n[864032] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=864032\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 220.219.14.186:9092 could not be established. Broker may not be available.\n[1461214] Problem reaching database. Timeout http request GET https://ibm.box.com/s/389d5f6e2fd24ae6\nError occurred while calling aws lambda system- endpoint : https://78cd0acaf7.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 131,
          name: 'Ashley Wheeler',
          patternsSample:
            '36.36.235.44 -- [ 07/Jan/2025:02:17:40 +0000 ] "GET /bundle/1ecf53cbcde33194.js HTTP/1.1" 403 "https://chaney-obrien.com/" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_5_7 rv:4.0; gu-IN) AppleWebKit/532.22.6 (KHTML, like Gecko) Version/4.0.2 Safari/532.22.6"\n[422804] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=422804\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 49.128.158.44:9092 could not be established. Broker may not be available.\n[1213712] Problem reaching database. Timeout http request GET https://ibm.box.com/s/380f3f80a74cc3c8\nError occurred while calling aws lambda system- endpoint : https://89fb4f18a3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 132,
          name: 'Kristina Nicholson',
          patternsSample:
            '149.130.235.88 -- [ 01/Jan/2025:19:11:01 +0000 ] "GET /bundle/bab501a473683fc1.js HTTP/1.1" 504 "https://www.soto.com/category/privacy/" "Mozilla/5.0 (iPhone; CPU iPhone OS 5_1_1 like Mac OS X) AppleWebKit/534.2 (KHTML, like Gecko) CriOS/46.0.881.0 Mobile/70A482 Safari/534.2"\n[292840] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=292840\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 59.54.32.31:9092 could not be established. Broker may not be available.\n[3884947] Problem reaching database. Timeout http request GET https://ibm.box.com/s/87153248883e7d31\nError occurred while calling aws lambda system- endpoint : https://6e15f30b04.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 133,
          name: 'Maria Rodriguez',
          patternsSample:
            '58.34.106.215 -- [ 18/Apr/2025:10:54:46 +0000 ] "GET /bundle/b78127ecf27e21da.js HTTP/1.1" 200 "http://www.kelly.com/about/" "Mozilla/5.0 (iPad; CPU iPad OS 6_1_6 like Mac OS X) AppleWebKit/532.0 (KHTML, like Gecko) CriOS/31.0.836.0 Mobile/86B363 Safari/532.0"\n[624114] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=624114\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 185.216.185.214:9092 could not be established. Broker may not be available.\n[1518683] Problem reaching database. Timeout http request GET https://ibm.box.com/s/a04247fd12dcb382\nError occurred while calling aws lambda system- endpoint : https://4cafa68737.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 134,
          name: 'Gregory Gonzales',
          patternsSample:
            '57.198.32.10 -- [ 18/Apr/2025:00:12:44 +0000 ] "GET /bundle/82d48b26d6c051b7.js HTTP/1.1" 504 "http://martinez.org/list/index.php" "Mozilla/5.0 (Windows; U; Windows 98; Win 9x 4.90) AppleWebKit/531.50.2 (KHTML, like Gecko) Version/4.1 Safari/531.50.2"\n[812313] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=812313\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 94.47.96.201:9092 could not be established. Broker may not be available.\n[3401383] Problem reaching database. Timeout http request GET https://ibm.box.com/s/10e536104b74ae68\nError occurred while calling aws lambda system- endpoint : https://5624c5936c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 135,
          name: 'Desiree Macdonald',
          patternsSample:
            '136.151.219.203 -- [ 10/Mar/2025:16:42:26 +0000 ] "GET /bundle/19d3e9689d2b5fda.js HTTP/1.1" 403 "https://www.kennedy.net/wp-content/app/category.html" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_5_9 rv:3.0; ne-NP) AppleWebKit/533.8.2 (KHTML, like Gecko) Version/4.0.5 Safari/533.8.2"\n[445768] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=445768\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 131.182.99.109:9092 could not be established. Broker may not be available.\n[8314079] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e6f92e2b6373c83f\nError occurred while calling aws lambda system- endpoint : https://f45f892660.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 136,
          name: 'Cody Richardson',
          patternsSample:
            '177.250.56.113 -- [ 15/Jan/2025:17:22:10 +0000 ] "GET /bundle/2d38ef362bd2aca5.js HTTP/1.1" 403 "http://khan-strickland.com/app/posts/home.jsp" "Mozilla/5.0 (compatible; MSIE 5.0; Windows 98; Win 9x 4.90; Trident/5.0)"\n[760424] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=760424\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 51.142.104.137:9092 could not be established. Broker may not be available.\n[1208872] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5077f6df85892061\nError occurred while calling aws lambda system- endpoint : https://4b80b42127.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 137,
          name: 'Paul Thompson',
          patternsSample:
            '193.42.157.239 -- [ 21/Mar/2025:18:14:13 +0000 ] "GET /bundle/71f7786acef376ff.js HTTP/1.1" 403 "https://gomez.com/explore/categories/main/about/" "Opera/9.89.(X11; Linux x86_64; ln-CD) Presto/2.9.180 Version/10.00"\n[394939] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=394939\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 76.101.198.133:9092 could not be established. Broker may not be available.\n[1277400] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e7fcd8f51fa21ebd\nError occurred while calling aws lambda system- endpoint : https://cc50e26ad1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 138,
          name: 'Maria Watts',
          patternsSample:
            '103.74.33.15 -- [ 14/May/2025:11:32:39 +0000 ] "GET /bundle/d578a8e453ed5704.js HTTP/1.1" 200 "https://robbins.com/categories/search/register.jsp" "Opera/9.85.(Windows CE; is-IS) Presto/2.9.181 Version/11.00"\n[162087] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=162087\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 202.184.190.33:9092 could not be established. Broker may not be available.\n[2335474] Problem reaching database. Timeout http request GET https://ibm.box.com/s/3f577c642ceca86b\nError occurred while calling aws lambda system- endpoint : https://e56a7ad218.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 139,
          name: 'Nicole Wall',
          patternsSample:
            '55.80.34.87 -- [ 01/Mar/2025:07:21:31 +0000 ] "GET /bundle/ee1cab92bcdcc982.js HTTP/1.1" 500 "http://perez.com/" "Opera/8.90.(Windows 98; zh-CN) Presto/2.9.178 Version/12.00"\n[197935] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=197935\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 76.83.140.62:9092 could not be established. Broker may not be available.\n[2526719] Problem reaching database. Timeout http request GET https://ibm.box.com/s/306ff9db17a44a2b\nError occurred while calling aws lambda system- endpoint : https://0ab038b034.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 140,
          name: 'Amanda Villa',
          patternsSample:
            '197.254.15.25 -- [ 05/Jan/2025:19:40:40 +0000 ] "GET /bundle/5b921f38dd445651.js HTTP/1.1" 403 "http://peck-waters.com/" "Mozilla/5.0 (compatible; MSIE 5.0; Windows NT 5.1; Trident/5.0)"\n[992771] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=992771\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 7.57.250.238:9092 could not be established. Broker may not be available.\n[8553354] Problem reaching database. Timeout http request GET https://ibm.box.com/s/07252222a24668ae\nError occurred while calling aws lambda system- endpoint : https://3a0d896516.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 141,
          name: 'Jennifer Singh',
          patternsSample:
            '202.52.169.245 -- [ 18/Feb/2025:21:09:36 +0000 ] "GET /bundle/a582665a40e5e96a.js HTTP/1.1" 500 "http://myers.info/" "Mozilla/5.0 (X11; Linux i686) AppleWebKit/531.1 (KHTML, like Gecko) Chrome/59.0.863.0 Safari/531.1"\n[239743] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=239743\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 216.250.223.74:9092 could not be established. Broker may not be available.\n[5570929] Problem reaching database. Timeout http request GET https://ibm.box.com/s/99a6a14fbf812609\nError occurred while calling aws lambda system- endpoint : https://578d345f78.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 142,
          name: 'Todd Quinn',
          patternsSample:
            '79.206.191.21 -- [ 27/Mar/2025:01:01:47 +0000 ] "GET /bundle/999df486ecd471fb.js HTTP/1.1" 500 "http://kelly.com/" "Mozilla/5.0 (Windows NT 5.0; ku-TR; rv:1.9.0.20) Gecko/2021-04-19 08:52:03 Firefox/9.0"\n[486278] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=486278\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 83.6.2.30:9092 could not be established. Broker may not be available.\n[2971561] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e822ea1f8ad2e990\nError occurred while calling aws lambda system- endpoint : https://a904866397.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 143,
          name: 'Maurice Smith',
          patternsSample:
            '143.247.189.151 -- [ 28/Jan/2025:03:28:56 +0000 ] "GET /bundle/bcb41e4a8cb3bb89.js HTTP/1.1" 504 "http://alexander.com/posts/app/register.htm" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5; rv:1.9.2.20) Gecko/2013-05-19 10:24:54 Firefox/3.8"\n[160989] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=160989\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 139.203.168.151:9092 could not be established. Broker may not be available.\n[2939134] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4eddd13f7ad9a5c6\nError occurred while calling aws lambda system- endpoint : https://06b0123698.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 144,
          name: 'Robert Watson',
          patternsSample:
            '122.123.253.6 -- [ 19/Feb/2025:11:56:03 +0000 ] "GET /bundle/6f595b59353fb0b4.js HTTP/1.1" 504 "http://wilkins-kaiser.org/" "Mozilla/5.0 (X11; Linux i686; rv:1.9.5.20) Gecko/2016-12-26 03:37:46 Firefox/14.0"\n[306373] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=306373\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 210.34.13.68:9092 could not be established. Broker may not be available.\n[7361382] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b3826be674615c38\nError occurred while calling aws lambda system- endpoint : https://b8fe107e52.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 145,
          name: 'John Ortega',
          patternsSample:
            '200.117.139.140 -- [ 06/Jan/2025:00:20:36 +0000 ] "GET /bundle/19d46d598777e514.js HTTP/1.1" 504 "http://steele.info/blog/category/explore/privacy/" "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/536.1 (KHTML, like Gecko) FxiOS/11.6p8251.0 Mobile/97H205 Safari/536.1"\n[519100] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=519100\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 27.146.252.183:9092 could not be established. Broker may not be available.\n[7044256] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b8717f0adf14f7f7\nError occurred while calling aws lambda system- endpoint : https://381bb01c88.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 146,
          name: 'Stephen Strickland',
          patternsSample:
            '33.47.194.238 -- [ 15/Jan/2025:09:54:38 +0000 ] "GET /bundle/d7bd52970d42b1ff.js HTTP/1.1" 200 "https://www.walters-patton.com/explore/privacy/" "Opera/9.63.(Windows 95; lg-UG) Presto/2.9.178 Version/10.00"\n[664189] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=664189\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 88.89.168.176:9092 could not be established. Broker may not be available.\n[6116603] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5c6c4d9efdd73c3b\nError occurred while calling aws lambda system- endpoint : https://104ff7f4a7.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 147,
          name: 'Becky Palmer',
          patternsSample:
            '68.192.229.147 -- [ 16/May/2025:11:10:33 +0000 ] "GET /bundle/3769b71702f3a269.js HTTP/1.1" 500 "http://roman.biz/" "Opera/8.80.(Windows NT 4.0; ln-CD) Presto/2.9.184 Version/12.00"\n[228654] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=228654\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 166.115.21.145:9092 could not be established. Broker may not be available.\n[3939759] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5deb935f7d3c3bc9\nError occurred while calling aws lambda system- endpoint : https://403c0d308d.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 148,
          name: 'Sergio Rose',
          patternsSample:
            '52.238.120.58 -- [ 10/Jan/2025:11:53:05 +0000 ] "GET /bundle/4b1b1eb2ac61f415.js HTTP/1.1" 500 "http://silva.biz/post/" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_10_2 rv:5.0; cmn-TW) AppleWebKit/532.23.4 (KHTML, like Gecko) Version/4.1 Safari/532.23.4"\n[308804] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=308804\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 125.0.182.228:9092 could not be established. Broker may not be available.\n[7473502] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ba773feb32f168a5\nError occurred while calling aws lambda system- endpoint : https://e9cc1a8ef3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 149,
          name: 'Ellen Hamilton',
          patternsSample:
            '131.92.136.220 -- [ 18/Mar/2025:16:11:27 +0000 ] "GET /bundle/d26ebec50813a886.js HTTP/1.1" 500 "http://www.fernandez.org/categories/privacy.jsp" "Mozilla/5.0 (compatible; MSIE 7.0; Windows 98; Trident/4.0)"\n[231735] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=231735\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 197.222.123.114:9092 could not be established. Broker may not be available.\n[3834861] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ff65515d76db2ffd\nError occurred while calling aws lambda system- endpoint : https://286d3d3bbf.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 150,
          name: 'Robert Byrd',
          patternsSample:
            '37.59.212.145 -- [ 07/Apr/2025:13:28:24 +0000 ] "GET /bundle/b4046315ecfd2970.js HTTP/1.1" 403 "https://www.vance.biz/list/app/author/" "Opera/8.58.(X11; Linux x86_64; xh-ZA) Presto/2.9.180 Version/11.00"\n[490239] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=490239\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 170.12.85.144:9092 could not be established. Broker may not be available.\n[9719382] Problem reaching database. Timeout http request GET https://ibm.box.com/s/897b6967b4dac25c\nError occurred while calling aws lambda system- endpoint : https://6720edf70b.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 151,
          name: 'Kayla Frost',
          patternsSample:
            '29.221.44.141 -- [ 04/Jan/2025:13:27:46 +0000 ] "GET /bundle/5282cd9ea8646986.js HTTP/1.1" 200 "https://www.hall-dunlap.com/" "Opera/9.95.(X11; Linux i686; lzh-TW) Presto/2.9.173 Version/11.00"\n[477216] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=477216\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 44.13.89.177:9092 could not be established. Broker may not be available.\n[6346578] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e13ebce51e5bc7be\nError occurred while calling aws lambda system- endpoint : https://46a5037e31.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 152,
          name: 'Steve Clark',
          patternsSample:
            '57.97.155.96 -- [ 05/Feb/2025:19:36:11 +0000 ] "GET /bundle/334cf1172dc201e5.js HTTP/1.1" 200 "https://barton.com/explore/list/search/homepage.jsp" "Opera/9.94.(Windows 95; is-IS) Presto/2.9.175 Version/11.00"\n[514732] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=514732\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 2.220.54.115:9092 could not be established. Broker may not be available.\n[2941690] Problem reaching database. Timeout http request GET https://ibm.box.com/s/172bb43d264ed0c2\nError occurred while calling aws lambda system- endpoint : https://2d060882fe.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 153,
          name: 'Kimberly Henry',
          patternsSample:
            '112.17.182.205 -- [ 04/May/2025:17:18:08 +0000 ] "GET /bundle/d908ebad2809ead7.js HTTP/1.1" 504 "https://baker.org/main.php" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_11_0 rv:6.0; fur-IT) AppleWebKit/531.48.4 (KHTML, like Gecko) Version/5.0 Safari/531.48.4"\n[764394] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=764394\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 89.235.152.121:9092 could not be established. Broker may not be available.\n[3287554] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b33490c6484f3bd4\nError occurred while calling aws lambda system- endpoint : https://eb30c96f8e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 154,
          name: 'Joanna Tate',
          patternsSample:
            '170.105.61.13 -- [ 08/May/2025:07:20:22 +0000 ] "GET /bundle/99b04f531816370f.js HTTP/1.1" 504 "http://www.foster.com/wp-content/terms/" "Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 5.01; Trident/5.1)"\n[902604] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=902604\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 152.187.151.14:9092 could not be established. Broker may not be available.\n[4877906] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f33bd421f49469b8\nError occurred while calling aws lambda system- endpoint : https://f0f060270e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 155,
          name: 'John Clark',
          patternsSample:
            '97.210.131.221 -- [ 16/Feb/2025:14:50:25 +0000 ] "GET /bundle/e13ebc1183d39ba7.js HTTP/1.1" 200 "https://www.mitchell.net/" "Opera/9.91.(Windows 98; gv-GB) Presto/2.9.175 Version/10.00"\n[723699] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=723699\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 170.9.156.26:9092 could not be established. Broker may not be available.\n[9475843] Problem reaching database. Timeout http request GET https://ibm.box.com/s/6fd332bd2dfae75f\nError occurred while calling aws lambda system- endpoint : https://b083ddd0dc.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 156,
          name: 'Kristen Perkins',
          patternsSample:
            '38.206.155.102 -- [ 01/Apr/2025:19:09:14 +0000 ] "GET /bundle/40778352b99bb81c.js HTTP/1.1" 504 "http://knapp-brewer.com/categories/search.html" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/23.0.805.0 Safari/533.2"\n[748150] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=748150\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 85.207.89.191:9092 could not be established. Broker may not be available.\n[2908778] Problem reaching database. Timeout http request GET https://ibm.box.com/s/207183fb08159479\nError occurred while calling aws lambda system- endpoint : https://f668c10558.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 157,
          name: 'Gregory Baxter',
          patternsSample:
            '207.80.200.95 -- [ 16/Apr/2025:21:07:57 +0000 ] "GET /bundle/5d8486fa7087069b.js HTTP/1.1" 500 "https://vasquez-walker.org/blog/explore/search/search/" "Mozilla/5.0 (Windows 98) AppleWebKit/534.2 (KHTML, like Gecko) Chrome/41.0.806.0 Safari/534.2"\n[360293] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=360293\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 168.51.125.36:9092 could not be established. Broker may not be available.\n[6792098] Problem reaching database. Timeout http request GET https://ibm.box.com/s/7876b9e6e4cb6da5\nError occurred while calling aws lambda system- endpoint : https://05125d192c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 158,
          name: 'Danielle Blackwell',
          patternsSample:
            '17.115.215.47 -- [ 03/May/2025:05:51:51 +0000 ] "GET /bundle/6d5fb598bc2d1007.js HTTP/1.1" 500 "http://www.parks-hooper.com/blog/homepage.htm" "Mozilla/5.0 (X11; Linux i686; rv:1.9.7.20) Gecko/2016-09-11 20:51:15 Firefox/3.6.20"\n[521804] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=521804\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 188.192.69.22:9092 could not be established. Broker may not be available.\n[5848789] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5a6845bb6ab89ce6\nError occurred while calling aws lambda system- endpoint : https://51bd2f8aa4.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 159,
          name: 'Mary Miller',
          patternsSample:
            '197.129.195.35 -- [ 27/Apr/2025:19:50:55 +0000 ] "GET /bundle/e2b63f9055cfd1ec.js HTTP/1.1" 500 "http://www.davis.biz/tag/app/privacy.php" "Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.1 (KHTML, like Gecko) Chrome/54.0.852.0 Safari/534.1"\n[429838] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=429838\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 125.102.228.134:9092 could not be established. Broker may not be available.\n[5908381] Problem reaching database. Timeout http request GET https://ibm.box.com/s/550bd16f29c19f24\nError occurred while calling aws lambda system- endpoint : https://b6009841bd.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 160,
          name: 'Jennifer Foley',
          patternsSample:
            '160.154.21.13 -- [ 22/Apr/2025:05:08:13 +0000 ] "GET /bundle/8bd2b205f2950daa.js HTTP/1.1" 403 "http://www.durham.com/index.html" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 5.1; Trident/4.1)"\n[954997] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=954997\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 51.217.220.180:9092 could not be established. Broker may not be available.\n[5595592] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5d54dae3a2005ce1\nError occurred while calling aws lambda system- endpoint : https://67630922b3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 161,
          name: 'Christopher Carter',
          patternsSample:
            '20.73.88.218 -- [ 16/May/2025:03:26:55 +0000 ] "GET /bundle/0b8a995652fdb0bc.js HTTP/1.1" 403 "http://barker.com/post.html" "Mozilla/5.0 (iPhone; CPU iPhone OS 4_2_1 like Mac OS X) AppleWebKit/536.0 (KHTML, like Gecko) FxiOS/13.8w8150.0 Mobile/75L456 Safari/536.0"\n[478375] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=478375\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 80.126.215.91:9092 could not be established. Broker may not be available.\n[8841059] Problem reaching database. Timeout http request GET https://ibm.box.com/s/47b0626f4139d8d4\nError occurred while calling aws lambda system- endpoint : https://e0e630af15.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 162,
          name: 'David Decker',
          patternsSample:
            '207.210.206.249 -- [ 10/Jan/2025:03:24:05 +0000 ] "GET /bundle/61b6cf67e2830b5b.js HTTP/1.1" 200 "http://larsen.com/index.html" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_1 like Mac OS X; csb-PL) AppleWebKit/531.26.6 (KHTML, like Gecko) Version/4.0.5 Mobile/8B111 Safari/6531.26.6"\n[490728] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=490728\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 94.202.55.240:9092 could not be established. Broker may not be available.\n[7223890] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f8879a5c13a33dff\nError occurred while calling aws lambda system- endpoint : https://63a5f179d3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 163,
          name: 'Jennifer Mccormick',
          patternsSample:
            '200.178.232.57 -- [ 11/May/2025:19:28:01 +0000 ] "GET /bundle/23c9d8bfeb9eb40a.js HTTP/1.1" 504 "https://www.garcia-garza.info/category/home.asp" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/532.0 (KHTML, like Gecko) Chrome/47.0.843.0 Safari/532.0"\n[464015] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=464015\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 63.195.72.130:9092 could not be established. Broker may not be available.\n[4459327] Problem reaching database. Timeout http request GET https://ibm.box.com/s/eba48546b71129d1\nError occurred while calling aws lambda system- endpoint : https://df7334cd0b.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 164,
          name: 'Jessica Andrade',
          patternsSample:
            '167.57.253.212 -- [ 26/Mar/2025:19:05:38 +0000 ] "GET /bundle/9fcbf134ad0638ef.js HTTP/1.1" 200 "https://www.harris.com/homepage.php" "Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 6.2; Trident/5.1)"\n[886424] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=886424\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 5.163.139.229:9092 could not be established. Broker may not be available.\n[4238698] Problem reaching database. Timeout http request GET https://ibm.box.com/s/540c9806ede48a55\nError occurred while calling aws lambda system- endpoint : https://b6cf7e692c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 165,
          name: 'Catherine Kent',
          patternsSample:
            '181.1.210.85 -- [ 11/May/2025:23:01:26 +0000 ] "GET /bundle/cc22fa84feceea35.js HTTP/1.1" 504 "http://ortega.org/terms/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3 like Mac OS X; pt-BR) AppleWebKit/533.18.6 (KHTML, like Gecko) Version/3.0.5 Mobile/8B119 Safari/6533.18.6"\n[743060] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=743060\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 60.198.68.128:9092 could not be established. Broker may not be available.\n[3749124] Problem reaching database. Timeout http request GET https://ibm.box.com/s/382d8728efa32812\nError occurred while calling aws lambda system- endpoint : https://2f931db5da.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 166,
          name: 'Mr. Donald Wilson MD',
          patternsSample:
            '124.108.147.165 -- [ 04/Feb/2025:14:23:45 +0000 ] "GET /bundle/640f655fcc2db38d.js HTTP/1.1" 200 "http://www.chapman-robinson.info/author.asp" "Mozilla/5.0 (iPhone; CPU iPhone OS 5_1_1 like Mac OS X) AppleWebKit/535.1 (KHTML, like Gecko) FxiOS/13.8g0923.0 Mobile/83O916 Safari/535.1"\n[815726] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=815726\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 190.26.62.246:9092 could not be established. Broker may not be available.\n[5097350] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d5abb0123055d5db\nError occurred while calling aws lambda system- endpoint : https://5a82f219a6.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 167,
          name: 'Troy Gross',
          patternsSample:
            '1.133.149.223 -- [ 08/May/2025:02:54:21 +0000 ] "GET /bundle/81333bd53bae1029.js HTTP/1.1" 504 "http://www.smith-vaughan.biz/" "Mozilla/5.0 (Linux; Android 2.2.3) AppleWebKit/534.1 (KHTML, like Gecko) Chrome/35.0.868.0 Safari/534.1"\n[605383] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=605383\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 68.68.91.202:9092 could not be established. Broker may not be available.\n[2531697] Problem reaching database. Timeout http request GET https://ibm.box.com/s/08c14dfc69a80dad\nError occurred while calling aws lambda system- endpoint : https://e14f16c40e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 168,
          name: 'Michael Smith',
          patternsSample:
            '136.239.82.9 -- [ 11/Apr/2025:00:04:22 +0000 ] "GET /bundle/aedde420ada23e1b.js HTTP/1.1" 403 "https://www.herring.com/search/search/privacy/" "Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/535.43.1 (KHTML, like Gecko) Version/4.1 Safari/535.43.1"\n[198845] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=198845\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 85.138.24.246:9092 could not be established. Broker may not be available.\n[4028271] Problem reaching database. Timeout http request GET https://ibm.box.com/s/48287313f63c97cf\nError occurred while calling aws lambda system- endpoint : https://1055828242.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 169,
          name: 'Elizabeth Clark',
          patternsSample:
            '77.17.60.107 -- [ 08/Apr/2025:23:47:19 +0000 ] "GET /bundle/432295cecf0d4422.js HTTP/1.1" 403 "https://www.boone-tanner.com/" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_7_3 rv:2.0; ha-NG) AppleWebKit/532.11.4 (KHTML, like Gecko) Version/4.0 Safari/532.11.4"\n[469877] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=469877\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 185.103.108.12:9092 could not be established. Broker may not be available.\n[7303637] Problem reaching database. Timeout http request GET https://ibm.box.com/s/1685044f75ff9f39\nError occurred while calling aws lambda system- endpoint : https://03a476f330.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 170,
          name: 'Nicole Fisher',
          patternsSample:
            '117.62.100.107 -- [ 03/Mar/2025:07:08:35 +0000 ] "GET /bundle/797794dd7c6b1fc2.js HTTP/1.1" 200 "https://hudson-hart.net/" "Mozilla/5.0 (Android 4.1; Mobile; rv:13.0) Gecko/13.0 Firefox/13.0"\n[740139] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=740139\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 171.47.159.167:9092 could not be established. Broker may not be available.\n[7691174] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5fa7ec403dbf089e\nError occurred while calling aws lambda system- endpoint : https://5f0ebeaa86.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 171,
          name: 'Tyler Allen',
          patternsSample:
            '73.219.170.70 -- [ 14/Apr/2025:21:54:36 +0000 ] "GET /bundle/ba6e05e93b9c18aa.js HTTP/1.1" 403 "https://kennedy-webster.com/tag/wp-content/post.html" "Mozilla/5.0 (X11; Linux i686) AppleWebKit/536.1 (KHTML, like Gecko) Chrome/24.0.832.0 Safari/536.1"\n[292476] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=292476\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 73.173.173.120:9092 could not be established. Broker may not be available.\n[7366002] Problem reaching database. Timeout http request GET https://ibm.box.com/s/515117efc13274b3\nError occurred while calling aws lambda system- endpoint : https://837f3ff2c8.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 172,
          name: 'Rebecca Buck',
          patternsSample:
            '196.91.240.83 -- [ 21/Mar/2025:18:53:27 +0000 ] "GET /bundle/64b135c3a1349508.js HTTP/1.1" 403 "http://wright.info/blog/posts/blog/about.htm" "Mozilla/5.0 (iPhone; CPU iPhone OS 3_1_3 like Mac OS X) AppleWebKit/536.2 (KHTML, like Gecko) CriOS/35.0.824.0 Mobile/82O492 Safari/536.2"\n[484012] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=484012\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 32.10.135.6:9092 could not be established. Broker may not be available.\n[2060445] Problem reaching database. Timeout http request GET https://ibm.box.com/s/cb00709c0c4ba5f7\nError occurred while calling aws lambda system- endpoint : https://a237e85cf6.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 173,
          name: 'Michelle Burch',
          patternsSample:
            '143.213.255.42 -- [ 03/Jan/2025:04:42:53 +0000 ] "GET /bundle/96413e0571045848.js HTTP/1.1" 500 "https://www.ramirez.biz/about/" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_5_2; rv:1.9.5.20) Gecko/2019-12-11 22:12:24 Firefox/3.6.16"\n[597075] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=597075\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 200.253.237.22:9092 could not be established. Broker may not be available.\n[8630444] Problem reaching database. Timeout http request GET https://ibm.box.com/s/bc2a289b17c1d0ae\nError occurred while calling aws lambda system- endpoint : https://d8a3dda088.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 174,
          name: 'Brittany Miller',
          patternsSample:
            '132.131.4.37 -- [ 05/Jan/2025:02:57:23 +0000 ] "GET /bundle/2f195977d5e4c915.js HTTP/1.1" 403 "https://young-king.com/list/privacy.php" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_6_8; rv:1.9.5.20) Gecko/2022-11-02 06:18:49 Firefox/12.0"\n[630762] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=630762\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 130.164.245.164:9092 could not be established. Broker may not be available.\n[3247668] Problem reaching database. Timeout http request GET https://ibm.box.com/s/609a2164798505d2\nError occurred while calling aws lambda system- endpoint : https://961ea8e677.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 175,
          name: 'Ashley Norman',
          patternsSample:
            '38.148.156.27 -- [ 16/May/2025:20:27:58 +0000 ] "GET /bundle/dd49be8b6bacd0bf.js HTTP/1.1" 500 "http://page-watts.biz/search/tags/tags/search.jsp" "Mozilla/5.0 (Android 5.0.2; Mobile; rv:9.0) Gecko/9.0 Firefox/9.0"\n[909748] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=909748\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 121.139.127.172:9092 could not be established. Broker may not be available.\n[2726033] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c66048fa771186b2\nError occurred while calling aws lambda system- endpoint : https://afed9005f5.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 176,
          name: 'Colleen Compton',
          patternsSample:
            '27.94.151.142 -- [ 05/May/2025:23:28:38 +0000 ] "GET /bundle/6d60f3b9226eaf62.js HTTP/1.1" 403 "https://stone-smith.com/tags/blog/tag/faq.jsp" "Mozilla/5.0 (iPad; CPU iPad OS 10_3_3 like Mac OS X) AppleWebKit/531.0 (KHTML, like Gecko) CriOS/61.0.818.0 Mobile/68F417 Safari/531.0"\n[389192] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=389192\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 20.88.178.18:9092 could not be established. Broker may not be available.\n[5049418] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d18451716127798b\nError occurred while calling aws lambda system- endpoint : https://3c36b22e48.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 177,
          name: 'Joseph Buchanan',
          patternsSample:
            '24.245.152.241 -- [ 20/Feb/2025:04:01:50 +0000 ] "GET /bundle/31eba849b347b641.js HTTP/1.1" 200 "https://larson.com/categories/homepage/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2 rv:5.0; tt-RU) AppleWebKit/531.19.1 (KHTML, like Gecko) Version/5.1 Safari/531.19.1"\n[121161] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=121161\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 9.96.93.159:9092 could not be established. Broker may not be available.\n[1023075] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ca5bc08b4550b66f\nError occurred while calling aws lambda system- endpoint : https://f5f411a4c8.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 178,
          name: 'Jonathan Thomas',
          patternsSample:
            '6.130.175.18 -- [ 22/Apr/2025:03:50:27 +0000 ] "GET /bundle/29bf1e87f623e944.js HTTP/1.1" 500 "http://pham.com/home/" "Mozilla/5.0 (compatible; MSIE 7.0; Windows CE; Trident/5.1)"\n[236678] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=236678\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 130.199.240.243:9092 could not be established. Broker may not be available.\n[6649166] Problem reaching database. Timeout http request GET https://ibm.box.com/s/9aa1fd71efb549d9\nError occurred while calling aws lambda system- endpoint : https://153980e9aa.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 179,
          name: 'Alexander Foster',
          patternsSample:
            '65.12.42.27 -- [ 30/Apr/2025:07:42:30 +0000 ] "GET /bundle/36443e101b7fd9a2.js HTTP/1.1" 403 "https://www.shaw-peterson.com/post/" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_9_8 rv:2.0; tr-TR) AppleWebKit/535.39.5 (KHTML, like Gecko) Version/4.1 Safari/535.39.5"\n[937877] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=937877\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 46.58.147.104:9092 could not be established. Broker may not be available.\n[3637996] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b02969c0bf1d0d63\nError occurred while calling aws lambda system- endpoint : https://3b95cc6a02.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 180,
          name: 'Andrew Mooney',
          patternsSample:
            '191.93.108.102 -- [ 05/Jan/2025:06:34:26 +0000 ] "GET /bundle/8462440f6b581dfa.js HTTP/1.1" 504 "http://www.mitchell.info/tags/blog/main/post/" "Mozilla/5.0 (Windows CE) AppleWebKit/534.1 (KHTML, like Gecko) Chrome/35.0.883.0 Safari/534.1"\n[763570] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=763570\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 123.189.88.180:9092 could not be established. Broker may not be available.\n[9751959] Problem reaching database. Timeout http request GET https://ibm.box.com/s/a0e2a3611b2094b3\nError occurred while calling aws lambda system- endpoint : https://30daa30bcc.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 181,
          name: 'Christopher Fisher',
          patternsSample:
            '69.135.21.189 -- [ 31/Mar/2025:15:44:48 +0000 ] "GET /bundle/ca09d1013da84daf.js HTTP/1.1" 403 "https://martinez-le.com/posts/about.htm" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_9_2) AppleWebKit/536.1 (KHTML, like Gecko) Chrome/43.0.820.0 Safari/536.1"\n[122108] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=122108\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 159.112.205.178:9092 could not be established. Broker may not be available.\n[6397828] Problem reaching database. Timeout http request GET https://ibm.box.com/s/20080a7c80598beb\nError occurred while calling aws lambda system- endpoint : https://ae9e3b3993.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 182,
          name: 'Christopher Patel',
          patternsSample:
            '209.63.142.130 -- [ 07/Apr/2025:19:20:50 +0000 ] "GET /bundle/92e3efb43080ed85.js HTTP/1.1" 200 "http://abbott.com/register.html" "Opera/9.88.(Windows NT 6.1; hr-HR) Presto/2.9.164 Version/11.00"\n[890459] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=890459\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 159.235.88.60:9092 could not be established. Broker may not be available.\n[6411045] Problem reaching database. Timeout http request GET https://ibm.box.com/s/cc64700ea895c713\nError occurred while calling aws lambda system- endpoint : https://e638ff8b5a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 183,
          name: 'Jessica Gomez',
          patternsSample:
            '133.15.253.54 -- [ 08/Mar/2025:09:49:15 +0000 ] "GET /bundle/bcb16b46deeaca9d.js HTTP/1.1" 200 "http://www.allison.com/app/faq/" "Mozilla/5.0 (Windows NT 4.0) AppleWebKit/534.2 (KHTML, like Gecko) Chrome/55.0.866.0 Safari/534.2"\n[614944] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=614944\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 210.67.3.137:9092 could not be established. Broker may not be available.\n[8448601] Problem reaching database. Timeout http request GET https://ibm.box.com/s/28c4cfe8e086832e\nError occurred while calling aws lambda system- endpoint : https://6d87c86a16.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 184,
          name: 'Steven Booth',
          patternsSample:
            '40.198.183.40 -- [ 27/Jan/2025:11:44:56 +0000 ] "GET /bundle/d80fa016122fba19.js HTTP/1.1" 200 "http://phillips-armstrong.com/search.htm" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_11_8; rv:1.9.4.20) Gecko/2019-08-04 23:39:04 Firefox/3.6.6"\n[486316] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=486316\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 154.20.193.26:9092 could not be established. Broker may not be available.\n[8329354] Problem reaching database. Timeout http request GET https://ibm.box.com/s/a30d7f2f3ce3933a\nError occurred while calling aws lambda system- endpoint : https://0d3e529872.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 185,
          name: 'John Grant',
          patternsSample:
            '175.14.251.55 -- [ 12/Apr/2025:08:45:24 +0000 ] "GET /bundle/828d96df0f26d735.js HTTP/1.1" 500 "http://conway-payne.com/index.php" "Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 5.1; Trident/4.0)"\n[862606] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=862606\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 4.39.47.111:9092 could not be established. Broker may not be available.\n[6058210] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f181a03ac47c556d\nError occurred while calling aws lambda system- endpoint : https://1cf0a0f904.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 186,
          name: 'Julia Khan MD',
          patternsSample:
            '211.13.186.203 -- [ 17/Mar/2025:17:44:23 +0000 ] "GET /bundle/a57b3734b73b10d9.js HTTP/1.1" 200 "https://www.macias.org/app/login/" "Mozilla/5.0 (X11; Linux i686; rv:1.9.5.20) Gecko/2019-04-19 12:09:50 Firefox/7.0"\n[439519] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=439519\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 26.115.8.151:9092 could not be established. Broker may not be available.\n[9885116] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d12c9d1c374674df\nError occurred while calling aws lambda system- endpoint : https://51d5e319a5.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 187,
          name: 'Sara Beasley',
          patternsSample:
            '130.35.121.110 -- [ 07/May/2025:00:46:58 +0000 ] "GET /bundle/bc2200aa48b3e9ed.js HTTP/1.1" 500 "https://www.bennett-solis.com/posts/categories/category.jsp" "Mozilla/5.0 (iPhone; CPU iPhone OS 4_2_1 like Mac OS X) AppleWebKit/533.2 (KHTML, like Gecko) CriOS/13.0.894.0 Mobile/66L885 Safari/533.2"\n[726608] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=726608\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 217.114.133.39:9092 could not be established. Broker may not be available.\n[9069942] Problem reaching database. Timeout http request GET https://ibm.box.com/s/9f0a4d7a492c1bd4\nError occurred while calling aws lambda system- endpoint : https://bd28fa19b5.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 188,
          name: 'Nicholas Parker',
          patternsSample:
            '208.234.210.86 -- [ 07/Apr/2025:11:58:37 +0000 ] "GET /bundle/7474c286c9a34aff.js HTTP/1.1" 403 "http://white.com/post/" "Mozilla/5.0 (compatible; MSIE 8.0; Windows 98; Trident/4.0)"\n[888982] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=888982\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 119.225.22.188:9092 could not be established. Broker may not be available.\n[3436452] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f954bd81d14a4c79\nError occurred while calling aws lambda system- endpoint : https://7c9f0d7c6a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 189,
          name: 'Elizabeth Barker',
          patternsSample:
            '40.191.51.42 -- [ 19/Feb/2025:21:51:54 +0000 ] "GET /bundle/ec321bc3648dceda.js HTTP/1.1" 500 "http://www.santiago-gardner.com/categories/posts/explore/faq.html" "Opera/8.47.(X11; Linux i686; ce-RU) Presto/2.9.174 Version/10.00"\n[249474] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=249474\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 4.232.1.203:9092 could not be established. Broker may not be available.\n[3543168] Problem reaching database. Timeout http request GET https://ibm.box.com/s/659dd598c9c6f592\nError occurred while calling aws lambda system- endpoint : https://6692ac6ab4.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 190,
          name: 'Anthony Davis',
          patternsSample:
            '34.94.125.26 -- [ 28/Jan/2025:16:01:35 +0000 ] "GET /bundle/3eb297281de88db7.js HTTP/1.1" 200 "https://figueroa-lewis.info/search/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_3 like Mac OS X; br-FR) AppleWebKit/532.40.2 (KHTML, like Gecko) Version/4.0.5 Mobile/8B113 Safari/6532.40.2"\n[653153] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=653153\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 103.104.62.114:9092 could not be established. Broker may not be available.\n[4775062] Problem reaching database. Timeout http request GET https://ibm.box.com/s/935affbe695ee1fd\nError occurred while calling aws lambda system- endpoint : https://6c49718cf0.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 191,
          name: 'David Alexander',
          patternsSample:
            '156.160.229.110 -- [ 20/Mar/2025:22:35:24 +0000 ] "GET /bundle/e07a0c8523e0c570.js HTTP/1.1" 200 "http://brady.net/app/main/about.asp" "Mozilla/5.0 (iPad; CPU iPad OS 9_3_5 like Mac OS X) AppleWebKit/533.0 (KHTML, like Gecko) CriOS/49.0.830.0 Mobile/54S092 Safari/533.0"\n[668122] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=668122\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 92.46.204.118:9092 could not be established. Broker may not be available.\n[4764473] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d7142edbfca22383\nError occurred while calling aws lambda system- endpoint : https://6367be4360.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 192,
          name: 'John Young MD',
          patternsSample:
            '120.6.78.138 -- [ 03/May/2025:10:54:00 +0000 ] "GET /bundle/1b1915682b88bade.js HTTP/1.1" 403 "http://smith.com/author/" "Opera/9.20.(X11; Linux x86_64; sa-IN) Presto/2.9.176 Version/12.00"\n[844044] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=844044\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 68.58.27.50:9092 could not be established. Broker may not be available.\n[2381757] Problem reaching database. Timeout http request GET https://ibm.box.com/s/a250ca7ddeab0f4b\nError occurred while calling aws lambda system- endpoint : https://0e4c09a076.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 193,
          name: 'Janet Harrington',
          patternsSample:
            '175.108.10.8 -- [ 27/Apr/2025:12:58:46 +0000 ] "GET /bundle/ddaa6f2bcefcbbe5.js HTTP/1.1" 500 "https://tucker-oneal.info/" "Opera/9.69.(X11; Linux i686; cmn-TW) Presto/2.9.179 Version/10.00"\n[933578] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=933578\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 80.65.198.207:9092 could not be established. Broker may not be available.\n[6809594] Problem reaching database. Timeout http request GET https://ibm.box.com/s/dd751f65e2de1312\nError occurred while calling aws lambda system- endpoint : https://3c87001417.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 194,
          name: 'Paul Byrd',
          patternsSample:
            '67.177.180.105 -- [ 19/Mar/2025:07:04:02 +0000 ] "GET /bundle/219fdeeb1ede18ab.js HTTP/1.1" 200 "http://www.sloan-caldwell.com/search/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_0 like Mac OS X; en-NG) AppleWebKit/535.30.4 (KHTML, like Gecko) Version/4.0.5 Mobile/8B115 Safari/6535.30.4"\n[682518] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=682518\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 133.209.235.68:9092 could not be established. Broker may not be available.\n[4856270] Problem reaching database. Timeout http request GET https://ibm.box.com/s/7cc15a0399bd700f\nError occurred while calling aws lambda system- endpoint : https://7330c4d191.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 195,
          name: 'Monica Hill',
          patternsSample:
            '144.83.255.206 -- [ 13/May/2025:05:16:01 +0000 ] "GET /bundle/d90b9b03baaa7960.js HTTP/1.1" 504 "http://kim.org/posts/list/home/" "Opera/8.50.(Windows NT 6.1; nds-NL) Presto/2.9.174 Version/12.00"\n[864095] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=864095\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 42.12.153.207:9092 could not be established. Broker may not be available.\n[6400467] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b7eb926f1f96f0c0\nError occurred while calling aws lambda system- endpoint : https://f96a5dd851.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 196,
          name: 'Stephanie Poole',
          patternsSample:
            '104.255.57.122 -- [ 23/Mar/2025:03:13:28 +0000 ] "GET /bundle/85e5a30ea31f8eb4.js HTTP/1.1" 403 "https://www.jones.net/category/" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_12_2) AppleWebKit/536.1 (KHTML, like Gecko) Chrome/39.0.823.0 Safari/536.1"\n[730311] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=730311\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 195.106.235.13:9092 could not be established. Broker may not be available.\n[6514551] Problem reaching database. Timeout http request GET https://ibm.box.com/s/876217def7514b24\nError occurred while calling aws lambda system- endpoint : https://e7deb09d98.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 197,
          name: 'Nicole Harper',
          patternsSample:
            '215.25.37.91 -- [ 21/Apr/2025:15:21:51 +0000 ] "GET /bundle/c77ed96c846be1ac.js HTTP/1.1" 403 "https://vincent-harris.biz/list/homepage/" "Mozilla/5.0 (Windows NT 5.01; ky-KG; rv:1.9.2.20) Gecko/2010-04-06 17:33:58 Firefox/3.6.16"\n[142861] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=142861\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 70.219.221.27:9092 could not be established. Broker may not be available.\n[5422831] Problem reaching database. Timeout http request GET https://ibm.box.com/s/14475370bf266efa\nError occurred while calling aws lambda system- endpoint : https://9f9e9385c3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 198,
          name: 'Jim Lambert',
          patternsSample:
            '2.248.246.43 -- [ 29/Apr/2025:17:15:24 +0000 ] "GET /bundle/14a5b509571559ef.js HTTP/1.1" 500 "http://www.turner.info/tags/privacy/" "Opera/8.64.(Windows NT 5.0; am-ET) Presto/2.9.173 Version/12.00"\n[556821] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=556821\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 15.5.130.22:9092 could not be established. Broker may not be available.\n[3294290] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b2889e0c24706bec\nError occurred while calling aws lambda system- endpoint : https://d107f562e2.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 199,
          name: 'Dr. Eric Bennett',
          patternsSample:
            '154.207.12.59 -- [ 19/Mar/2025:06:25:07 +0000 ] "GET /bundle/de7f81ef0a31ee93.js HTTP/1.1" 403 "https://www.banks.biz/post/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_9; rv:1.9.4.20) Gecko/2024-02-26 01:18:21 Firefox/3.8"\n[817760] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=817760\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 207.18.220.245:9092 could not be established. Broker may not be available.\n[6890973] Problem reaching database. Timeout http request GET https://ibm.box.com/s/10c3ccc4e63d959c\nError occurred while calling aws lambda system- endpoint : https://cc2658104f.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 200,
          name: 'Timothy Bennett',
          patternsSample:
            '13.208.239.50 -- [ 24/Feb/2025:05:37:23 +0000 ] "GET /bundle/89fda8d5a3b27409.js HTTP/1.1" 200 "https://allen-lowe.net/home.php" "Mozilla/5.0 (Windows NT 4.0; bhb-IN; rv:1.9.1.20) Gecko/2011-08-22 16:36:18 Firefox/3.8"\n[529314] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=529314\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 152.98.218.172:9092 could not be established. Broker may not be available.\n[5740971] Problem reaching database. Timeout http request GET https://ibm.box.com/s/fa2365003d55c158\nError occurred while calling aws lambda system- endpoint : https://8469ca43f7.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 201,
          name: 'Lorraine Morrow',
          patternsSample:
            '45.205.213.195 -- [ 06/Mar/2025:07:12:35 +0000 ] "GET /bundle/638e6efc3f2b8a01.js HTTP/1.1" 504 "http://johnson-mccarthy.com/app/register.htm" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_1 like Mac OS X; quz-PE) AppleWebKit/534.5.7 (KHTML, like Gecko) Version/3.0.5 Mobile/8B111 Safari/6534.5.7"\n[857827] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=857827\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 93.210.81.73:9092 could not be established. Broker may not be available.\n[2199970] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f2d84cb517313a15\nError occurred while calling aws lambda system- endpoint : https://5e79ae2549.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 202,
          name: 'James Miles',
          patternsSample:
            '105.32.252.183 -- [ 26/May/2025:09:24:33 +0000 ] "GET /bundle/a080a7fd1734a1ac.js HTTP/1.1" 504 "http://cook.info/privacy.htm" "Opera/8.94.(X11; Linux x86_64; kl-GL) Presto/2.9.186 Version/10.00"\n[615889] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=615889\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 186.184.163.174:9092 could not be established. Broker may not be available.\n[1500077] Problem reaching database. Timeout http request GET https://ibm.box.com/s/8da11df8ce632490\nError occurred while calling aws lambda system- endpoint : https://a1860c237d.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 203,
          name: 'Karen Thomas',
          patternsSample:
            '90.140.2.252 -- [ 05/May/2025:16:34:17 +0000 ] "GET /bundle/0402370a4637c88b.js HTTP/1.1" 200 "http://www.walker-dawson.com/" "Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.1)"\n[263629] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=263629\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 79.221.7.92:9092 could not be established. Broker may not be available.\n[5378552] Problem reaching database. Timeout http request GET https://ibm.box.com/s/bd967a7bdc296b8c\nError occurred while calling aws lambda system- endpoint : https://ca61a6ea2c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 204,
          name: 'Ann Mendoza',
          patternsSample:
            '99.123.225.66 -- [ 19/Mar/2025:21:30:43 +0000 ] "GET /bundle/5b31382acdc7cf50.js HTTP/1.1" 500 "http://tran.org/category/main/blog/post/" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_10_3 rv:3.0; iu-CA) AppleWebKit/535.30.6 (KHTML, like Gecko) Version/5.0.4 Safari/535.30.6"\n[932514] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=932514\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 184.59.45.27:9092 could not be established. Broker may not be available.\n[1272879] Problem reaching database. Timeout http request GET https://ibm.box.com/s/7fb5fec4f08542a9\nError occurred while calling aws lambda system- endpoint : https://5f0e1f3848.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 205,
          name: 'Bobby Thompson',
          patternsSample:
            '27.46.108.235 -- [ 27/Apr/2025:03:40:59 +0000 ] "GET /bundle/39c68d9ab41a91d4.js HTTP/1.1" 500 "http://perez.com/list/wp-content/login.php" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_10_5 rv:2.0; bg-BG) AppleWebKit/535.22.5 (KHTML, like Gecko) Version/4.0.1 Safari/535.22.5"\n[117423] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=117423\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 95.144.40.50:9092 could not be established. Broker may not be available.\n[3302729] Problem reaching database. Timeout http request GET https://ibm.box.com/s/56f7c88a55bb35e3\nError occurred while calling aws lambda system- endpoint : https://def8bcf02b.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 206,
          name: 'Elaine Simpson',
          patternsSample:
            '162.132.194.193 -- [ 24/Jan/2025:13:34:14 +0000 ] "GET /bundle/d1dffe78f9bda2aa.js HTTP/1.1" 504 "http://martinez.org/" "Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 5.2; Trident/3.1)"\n[317387] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=317387\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 76.57.93.56:9092 could not be established. Broker may not be available.\n[4104993] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5b7e34dddc5c605e\nError occurred while calling aws lambda system- endpoint : https://d9406d26b7.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 207,
          name: 'Joseph Carroll',
          patternsSample:
            '69.201.200.161 -- [ 24/May/2025:14:50:02 +0000 ] "GET /bundle/cc98dd8865926bea.js HTTP/1.1" 500 "https://phillips.com/homepage.php" "Opera/9.18.(X11; Linux x86_64; pa-PK) Presto/2.9.172 Version/10.00"\n[538232] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=538232\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 126.97.63.32:9092 could not be established. Broker may not be available.\n[7852249] Problem reaching database. Timeout http request GET https://ibm.box.com/s/bcf0825b6d51b043\nError occurred while calling aws lambda system- endpoint : https://bc2acf5469.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 208,
          name: 'Laura Oliver',
          patternsSample:
            '30.3.46.170 -- [ 18/Mar/2025:09:19:56 +0000 ] "GET /bundle/1ff48065b79ef720.js HTTP/1.1" 504 "https://www.ross.com/faq.asp" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_9_7 rv:6.0; mhr-RU) AppleWebKit/534.31.5 (KHTML, like Gecko) Version/4.0 Safari/534.31.5"\n[744519] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=744519\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 175.44.241.191:9092 could not be established. Broker may not be available.\n[5783836] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b894f34fbf5d5e58\nError occurred while calling aws lambda system- endpoint : https://f2671f5027.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 209,
          name: 'William Anderson',
          patternsSample:
            '111.182.153.7 -- [ 10/May/2025:19:56:44 +0000 ] "GET /bundle/bc20342cb48b789c.js HTTP/1.1" 200 "https://www.miller.org/privacy/" "Opera/9.21.(Windows NT 10.0; is-IS) Presto/2.9.176 Version/11.00"\n[702791] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=702791\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 152.23.116.105:9092 could not be established. Broker may not be available.\n[1963931] Problem reaching database. Timeout http request GET https://ibm.box.com/s/9097aa9c2e4998a8\nError occurred while calling aws lambda system- endpoint : https://bde041187a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 210,
          name: 'Robert Thomas',
          patternsSample:
            '211.224.174.65 -- [ 05/May/2025:10:14:49 +0000 ] "GET /bundle/9abca53d7951ecfc.js HTTP/1.1" 200 "https://www.wiggins.org/list/list/search/index/" "Mozilla/5.0 (iPad; CPU iPad OS 10_3_4 like Mac OS X) AppleWebKit/534.1 (KHTML, like Gecko) FxiOS/17.9h7180.0 Mobile/39Q156 Safari/534.1"\n[147269] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=147269\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 54.85.147.113:9092 could not be established. Broker may not be available.\n[9138476] Problem reaching database. Timeout http request GET https://ibm.box.com/s/27da8074915b8fc9\nError occurred while calling aws lambda system- endpoint : https://b41534c64a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 211,
          name: 'Jason Rodriguez',
          patternsSample:
            '111.9.254.188 -- [ 17/Jan/2025:01:13:15 +0000 ] "GET /bundle/6b244c26a55737d2.js HTTP/1.1" 403 "https://harding.net/search/tags/homepage.php" "Opera/8.74.(X11; Linux x86_64; pa-PK) Presto/2.9.174 Version/12.00"\n[240776] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=240776\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 177.19.39.188:9092 could not be established. Broker may not be available.\n[4202245] Problem reaching database. Timeout http request GET https://ibm.box.com/s/faf1975654368793\nError occurred while calling aws lambda system- endpoint : https://41984bc1ae.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 212,
          name: 'Katelyn Ballard',
          patternsSample:
            '161.42.168.143 -- [ 06/May/2025:01:46:49 +0000 ] "GET /bundle/86d5c69c83739e09.js HTTP/1.1" 504 "https://ortiz.net/app/category/search/register.html" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_6 rv:6.0; ln-CD) AppleWebKit/533.28.3 (KHTML, like Gecko) Version/5.0.3 Safari/533.28.3"\n[790739] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=790739\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 107.196.193.8:9092 could not be established. Broker may not be available.\n[4688202] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f2733d5c9d2ae82a\nError occurred while calling aws lambda system- endpoint : https://c8bc7bda57.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 213,
          name: 'Manuel Vaughan',
          patternsSample:
            '80.14.146.142 -- [ 14/Apr/2025:22:27:58 +0000 ] "GET /bundle/bd4bbe171ed5efae.js HTTP/1.1" 403 "https://gonzales.com/about.php" "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/3.0)"\n[101547] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=101547\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 160.78.56.147:9092 could not be established. Broker may not be available.\n[6969957] Problem reaching database. Timeout http request GET https://ibm.box.com/s/49838541bb0ca784\nError occurred while calling aws lambda system- endpoint : https://3099cf8226.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 214,
          name: 'Tamara Ray',
          patternsSample:
            '143.205.138.67 -- [ 29/Apr/2025:03:08:09 +0000 ] "GET /bundle/5cd521d15795728a.js HTTP/1.1" 504 "https://www.ramirez.biz/" "Mozilla/5.0 (iPad; CPU iPad OS 14_2 like Mac OS X) AppleWebKit/534.0 (KHTML, like Gecko) CriOS/56.0.889.0 Mobile/24B319 Safari/534.0"\n[963126] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=963126\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 11.5.250.124:9092 could not be established. Broker may not be available.\n[3366405] Problem reaching database. Timeout http request GET https://ibm.box.com/s/67ca59014615529c\nError occurred while calling aws lambda system- endpoint : https://df199f4bcf.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 215,
          name: 'Danielle Swanson',
          patternsSample:
            '190.243.195.129 -- [ 14/Feb/2025:21:07:12 +0000 ] "GET /bundle/86e861ae030e721e.js HTTP/1.1" 504 "https://price-brown.com/category.php" "Mozilla/5.0 (Windows; U; Windows NT 6.0) AppleWebKit/531.4.2 (KHTML, like Gecko) Version/5.0 Safari/531.4.2"\n[236605] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=236605\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 60.196.18.219:9092 could not be established. Broker may not be available.\n[9008777] Problem reaching database. Timeout http request GET https://ibm.box.com/s/7d8f273697e24ff7\nError occurred while calling aws lambda system- endpoint : https://09101ff152.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 216,
          name: 'Jason Ward',
          patternsSample:
            '14.222.55.73 -- [ 24/Feb/2025:01:23:59 +0000 ] "GET /bundle/de79bebab517c9f0.js HTTP/1.1" 403 "http://murray.org/" "Mozilla/5.0 (X11; Linux i686; rv:1.9.6.20) Gecko/2024-10-18 19:02:24 Firefox/3.6.20"\n[745894] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=745894\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 123.13.233.85:9092 could not be established. Broker may not be available.\n[9278669] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d2581045dfbf6616\nError occurred while calling aws lambda system- endpoint : https://606963200e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 217,
          name: 'Caleb Brown',
          patternsSample:
            '182.87.87.0 -- [ 06/Jan/2025:14:34:21 +0000 ] "GET /bundle/7914a099eb0c72f7.js HTTP/1.1" 500 "http://kane-ellis.net/" "Opera/9.86.(Windows 98; ve-ZA) Presto/2.9.171 Version/12.00"\n[914310] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=914310\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 180.195.105.205:9092 could not be established. Broker may not be available.\n[4427211] Problem reaching database. Timeout http request GET https://ibm.box.com/s/3120a58bb7cf644f\nError occurred while calling aws lambda system- endpoint : https://b84ec05db0.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 218,
          name: 'Brian Perez',
          patternsSample:
            '144.204.57.141 -- [ 10/Mar/2025:16:55:18 +0000 ] "GET /bundle/a038184628563c3c.js HTTP/1.1" 504 "https://pearson.com/search/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/536.1 (KHTML, like Gecko) Chrome/36.0.812.0 Safari/536.1"\n[276554] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=276554\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 23.218.229.103:9092 could not be established. Broker may not be available.\n[4649085] Problem reaching database. Timeout http request GET https://ibm.box.com/s/80f53e5488c085fc\nError occurred while calling aws lambda system- endpoint : https://06d11b3329.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 219,
          name: 'George Hanson',
          patternsSample:
            '223.219.117.71 -- [ 30/Jan/2025:14:26:05 +0000 ] "GET /bundle/fc493588d59fab5f.js HTTP/1.1" 500 "https://www.hill-kaiser.com/" "Opera/9.62.(X11; Linux x86_64; mai-IN) Presto/2.9.163 Version/10.00"\n[499056] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=499056\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 141.203.70.31:9092 could not be established. Broker may not be available.\n[4922930] Problem reaching database. Timeout http request GET https://ibm.box.com/s/835d8e65f1837199\nError occurred while calling aws lambda system- endpoint : https://d182a8559c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 220,
          name: 'Molly Nicholson',
          patternsSample:
            '91.119.58.168 -- [ 07/Apr/2025:06:35:58 +0000 ] "GET /bundle/cca7ac708cf12332.js HTTP/1.1" 504 "https://www.graham-phillips.com/" "Mozilla/5.0 (Linux; Android 2.3) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/16.0.869.0 Safari/535.1"\n[965378] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=965378\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 34.10.76.224:9092 could not be established. Broker may not be available.\n[7697117] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0ce3d14481fe8b18\nError occurred while calling aws lambda system- endpoint : https://4681235360.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 221,
          name: 'Lori Moss',
          patternsSample:
            '184.241.52.204 -- [ 03/Feb/2025:17:24:52 +0000 ] "GET /bundle/9a9a1f0663ae970b.js HTTP/1.1" 200 "http://www.smith.biz/register/" "Mozilla/5.0 (compatible; MSIE 7.0; Windows 98; Win 9x 4.90; Trident/3.0)"\n[714949] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=714949\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 63.57.152.58:9092 could not be established. Broker may not be available.\n[6897831] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b64ceaa79b7b39c6\nError occurred while calling aws lambda system- endpoint : https://99f2a0243f.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 222,
          name: 'Melissa Moore',
          patternsSample:
            '109.137.59.233 -- [ 03/Mar/2025:18:03:24 +0000 ] "GET /bundle/d1d29e8630ae15ab.js HTTP/1.1" 200 "https://www.gonzales.org/login/" "Opera/8.27.(Windows NT 5.2; uz-UZ) Presto/2.9.188 Version/10.00"\n[928149] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=928149\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 93.37.225.150:9092 could not be established. Broker may not be available.\n[4119681] Problem reaching database. Timeout http request GET https://ibm.box.com/s/40afbfa174b89353\nError occurred while calling aws lambda system- endpoint : https://b47555805e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 223,
          name: 'Christopher Murphy',
          patternsSample:
            '72.91.38.110 -- [ 23/Apr/2025:16:19:46 +0000 ] "GET /bundle/e41a3252ac9da841.js HTTP/1.1" 500 "https://underwood.net/post.html" "Opera/9.50.(X11; Linux i686; dz-BT) Presto/2.9.174 Version/10.00"\n[233081] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=233081\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 193.159.200.196:9092 could not be established. Broker may not be available.\n[6482199] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b34bf32e3f6bf7bc\nError occurred while calling aws lambda system- endpoint : https://b2e04e80c7.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 224,
          name: 'Yvonne Obrien',
          patternsSample:
            '71.53.210.91 -- [ 07/Mar/2025:05:11:53 +0000 ] "GET /bundle/f9618e85c76d4ab1.js HTTP/1.1" 500 "https://www.douglas.com/login.html" "Opera/9.75.(Windows NT 5.0; mk-MK) Presto/2.9.174 Version/12.00"\n[302325] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=302325\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 209.44.123.91:9092 could not be established. Broker may not be available.\n[6281275] Problem reaching database. Timeout http request GET https://ibm.box.com/s/498fda052d6a01fe\nError occurred while calling aws lambda system- endpoint : https://f4a28fec65.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 225,
          name: 'Raymond Reyes',
          patternsSample:
            '18.169.144.60 -- [ 06/Apr/2025:06:41:57 +0000 ] "GET /bundle/ade4051a03786a11.js HTTP/1.1" 200 "https://www.curtis-gonzales.biz/" "Mozilla/5.0 (Linux; Android 4.2.1) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/31.0.841.0 Safari/535.1"\n[304921] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=304921\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 213.43.170.10:9092 could not be established. Broker may not be available.\n[6974232] Problem reaching database. Timeout http request GET https://ibm.box.com/s/577ae80a109922fb\nError occurred while calling aws lambda system- endpoint : https://e10d8df083.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 226,
          name: 'Mr. Timothy Burgess',
          patternsSample:
            '119.242.13.101 -- [ 18/Mar/2025:09:23:47 +0000 ] "GET /bundle/a9ee1766560d249b.js HTTP/1.1" 200 "https://www.richardson-carter.com/homepage.html" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_2 like Mac OS X; ss-ZA) AppleWebKit/533.9.3 (KHTML, like Gecko) Version/4.0.5 Mobile/8B118 Safari/6533.9.3"\n[315992] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=315992\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 36.102.143.208:9092 could not be established. Broker may not be available.\n[4137301] Problem reaching database. Timeout http request GET https://ibm.box.com/s/636451e2ab4975f5\nError occurred while calling aws lambda system- endpoint : https://8a92c2137d.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 227,
          name: 'Daniel Ford',
          patternsSample:
            '97.45.160.99 -- [ 10/Feb/2025:02:02:11 +0000 ] "GET /bundle/6f855fa88078bc15.js HTTP/1.1" 200 "http://www.casey.com/terms/" "Opera/8.11.(Windows 98; sr-RS) Presto/2.9.178 Version/12.00"\n[757263] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=757263\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 38.21.29.87:9092 could not be established. Broker may not be available.\n[7417243] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b8b67cc89221283b\nError occurred while calling aws lambda system- endpoint : https://e728cd78f4.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 228,
          name: 'Scott Reid',
          patternsSample:
            '152.88.155.231 -- [ 15/Apr/2025:17:01:59 +0000 ] "GET /bundle/3a866943cbb0d377.js HTTP/1.1" 403 "http://castro-weeks.net/author.asp" "Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 6.0; Trident/4.0)"\n[605434] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=605434\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 11.130.114.46:9092 could not be established. Broker may not be available.\n[7962667] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b7da21610d69eaf7\nError occurred while calling aws lambda system- endpoint : https://9615c298fd.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 229,
          name: 'Jennifer Porter',
          patternsSample:
            '32.167.174.128 -- [ 28/Jan/2025:20:14:44 +0000 ] "GET /bundle/9a27b9eab59b1e5c.js HTTP/1.1" 500 "https://www.garza.net/homepage.php" "Opera/8.58.(Windows NT 5.0; ka-GE) Presto/2.9.188 Version/10.00"\n[339258] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=339258\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 154.66.53.107:9092 could not be established. Broker may not be available.\n[4632761] Problem reaching database. Timeout http request GET https://ibm.box.com/s/80461ce7e07b8010\nError occurred while calling aws lambda system- endpoint : https://913f19280f.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 230,
          name: 'Dorothy Mahoney',
          patternsSample:
            '47.93.204.95 -- [ 13/Mar/2025:19:54:24 +0000 ] "GET /bundle/35060a92d1e01e4c.js HTTP/1.1" 504 "https://jacobson-lamb.org/category/category/app/main.jsp" "Mozilla/5.0 (compatible; MSIE 5.0; Windows 95; Trident/3.0)"\n[669380] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=669380\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 215.15.1.5:9092 could not be established. Broker may not be available.\n[1080469] Problem reaching database. Timeout http request GET https://ibm.box.com/s/2a7a4622b67a122a\nError occurred while calling aws lambda system- endpoint : https://c3cd770810.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 231,
          name: 'Thomas Woodard',
          patternsSample:
            '5.77.118.228 -- [ 23/Jan/2025:07:18:33 +0000 ] "GET /bundle/8fe88c7db80a6109.js HTTP/1.1" 500 "https://www.george.com/explore/tags/faq.html" "Mozilla/5.0 (compatible; MSIE 5.0; Windows NT 5.2; Trident/4.1)"\n[400158] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=400158\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 51.145.103.186:9092 could not be established. Broker may not be available.\n[8898488] Problem reaching database. Timeout http request GET https://ibm.box.com/s/468d0e8c834dbcc7\nError occurred while calling aws lambda system- endpoint : https://3481269c8f.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 232,
          name: 'Tina Hernandez MD',
          patternsSample:
            '46.80.171.12 -- [ 14/Feb/2025:13:00:50 +0000 ] "GET /bundle/705f93945b02cfc9.js HTTP/1.1" 403 "https://www.marsh.biz/homepage/" "Opera/9.41.(Windows NT 6.2; wae-CH) Presto/2.9.169 Version/10.00"\n[720162] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=720162\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 53.148.30.210:9092 could not be established. Broker may not be available.\n[7776959] Problem reaching database. Timeout http request GET https://ibm.box.com/s/aa7fd49f3b358fa3\nError occurred while calling aws lambda system- endpoint : https://dbe28b65be.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 233,
          name: 'Tyler Ayers',
          patternsSample:
            '46.242.29.45 -- [ 11/May/2025:01:20:03 +0000 ] "GET /bundle/fd0e538a86382edc.js HTTP/1.1" 500 "http://www.lowery.com/" "Opera/8.43.(X11; Linux i686; da-DK) Presto/2.9.173 Version/11.00"\n[373238] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=373238\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 149.88.198.241:9092 could not be established. Broker may not be available.\n[9363209] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d0c026073372ae41\nError occurred while calling aws lambda system- endpoint : https://af88915d54.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 234,
          name: 'Matthew Wright',
          patternsSample:
            '55.39.104.200 -- [ 20/May/2025:00:26:04 +0000 ] "GET /bundle/292a820bb74c6416.js HTTP/1.1" 200 "http://reed.com/category.html" "Mozilla/5.0 (X11; Linux i686; rv:1.9.7.20) Gecko/2012-02-13 19:00:38 Firefox/3.6.9"\n[803087] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=803087\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 220.185.83.225:9092 could not be established. Broker may not be available.\n[5263131] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0a0e09fe06d947ee\nError occurred while calling aws lambda system- endpoint : https://5db7fd0522.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 235,
          name: 'Tara Nolan',
          patternsSample:
            '134.0.52.235 -- [ 21/Mar/2025:23:33:58 +0000 ] "GET /bundle/bb6b83f6d6834d73.js HTTP/1.1" 500 "http://www.simpson-cochran.com/author.html" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_9_5; rv:1.9.4.20) Gecko/2025-05-15 08:34:39 Firefox/3.6.10"\n[302552] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=302552\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 94.30.217.208:9092 could not be established. Broker may not be available.\n[5218690] Problem reaching database. Timeout http request GET https://ibm.box.com/s/67760c20cdd4d544\nError occurred while calling aws lambda system- endpoint : https://7f21e59820.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 236,
          name: 'William Moore',
          patternsSample:
            '95.115.116.47 -- [ 27/Apr/2025:12:38:54 +0000 ] "GET /bundle/a3bdc90101d6942f.js HTTP/1.1" 200 "http://mcbride-smith.org/post.htm" "Opera/9.88.(X11; Linux x86_64; ky-KG) Presto/2.9.171 Version/12.00"\n[726145] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=726145\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 215.178.51.69:9092 could not be established. Broker may not be available.\n[3601489] Problem reaching database. Timeout http request GET https://ibm.box.com/s/6c8e21b808ae99a0\nError occurred while calling aws lambda system- endpoint : https://25839a5543.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 237,
          name: 'Madison Burgess',
          patternsSample:
            '123.134.255.62 -- [ 09/Apr/2025:23:39:29 +0000 ] "GET /bundle/922c7c84ec7e398d.js HTTP/1.1" 504 "http://taylor.com/privacy/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_2 like Mac OS X; wae-CH) AppleWebKit/534.10.5 (KHTML, like Gecko) Version/4.0.5 Mobile/8B119 Safari/6534.10.5"\n[720782] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=720782\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 202.31.13.155:9092 could not be established. Broker may not be available.\n[6215980] Problem reaching database. Timeout http request GET https://ibm.box.com/s/33106f71f86cfb02\nError occurred while calling aws lambda system- endpoint : https://72650bfffc.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 238,
          name: 'Nicole Mckay',
          patternsSample:
            '93.178.48.108 -- [ 05/Jan/2025:13:59:53 +0000 ] "GET /bundle/bc00cfb75529b5ac.js HTTP/1.1" 500 "http://www.martinez.biz/privacy.html" "Mozilla/5.0 (Android 3.2.5; Mobile; rv:16.0) Gecko/16.0 Firefox/16.0"\n[658311] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=658311\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 131.173.12.153:9092 could not be established. Broker may not be available.\n[2210935] Problem reaching database. Timeout http request GET https://ibm.box.com/s/17238e6fee2f50ff\nError occurred while calling aws lambda system- endpoint : https://601c529945.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 239,
          name: 'Mary Landry',
          patternsSample:
            '104.133.112.56 -- [ 05/Feb/2025:19:43:52 +0000 ] "GET /bundle/160451c0ea3baa1f.js HTTP/1.1" 500 "https://kennedy.net/main/app/main.htm" "Mozilla/5.0 (iPad; CPU iPad OS 10_3_3 like Mac OS X) AppleWebKit/534.1 (KHTML, like Gecko) CriOS/29.0.815.0 Mobile/87Q458 Safari/534.1"\n[703544] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=703544\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 171.72.53.202:9092 could not be established. Broker may not be available.\n[1971575] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4424aca371406e12\nError occurred while calling aws lambda system- endpoint : https://1db57f5c4c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 240,
          name: 'Monica Ramirez',
          patternsSample:
            '47.241.240.135 -- [ 17/May/2025:21:24:05 +0000 ] "GET /bundle/725198bde607ee5e.js HTTP/1.1" 200 "https://boyle.com/wp-content/register/" "Opera/9.75.(Windows NT 10.0; vi-VN) Presto/2.9.177 Version/12.00"\n[420465] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=420465\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 222.255.40.145:9092 could not be established. Broker may not be available.\n[2519994] Problem reaching database. Timeout http request GET https://ibm.box.com/s/96d7802e1b2eb328\nError occurred while calling aws lambda system- endpoint : https://d0d90c6cdf.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 241,
          name: 'Katie Johnson',
          patternsSample:
            '110.179.252.48 -- [ 16/Jan/2025:17:56:42 +0000 ] "GET /bundle/6dbae8f008c77c80.js HTTP/1.1" 504 "http://hurst-herrera.info/tag/wp-content/categories/author.php" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/531.1 (KHTML, like Gecko) Chrome/58.0.809.0 Safari/531.1"\n[766622] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=766622\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 198.27.171.119:9092 could not be established. Broker may not be available.\n[8964632] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d3584ddd7ff607db\nError occurred while calling aws lambda system- endpoint : https://9b7c97ab81.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 242,
          name: 'Daniel Lozano',
          patternsSample:
            '103.40.120.131 -- [ 25/May/2025:04:12:40 +0000 ] "GET /bundle/d23f1ef9f70980e5.js HTTP/1.1" 200 "http://www.hall-harvey.biz/categories/posts/homepage/" "Opera/8.29.(X11; Linux i686; ku-TR) Presto/2.9.187 Version/11.00"\n[455075] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=455075\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 170.184.115.196:9092 could not be established. Broker may not be available.\n[7346503] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ceaec7a7ac0c8c85\nError occurred while calling aws lambda system- endpoint : https://1893bc28d3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 243,
          name: 'Kevin Hernandez',
          patternsSample:
            '19.163.183.90 -- [ 06/May/2025:01:00:45 +0000 ] "GET /bundle/e65253aa7369817e.js HTTP/1.1" 200 "http://heath.com/explore/tags/main/search.php" "Mozilla/5.0 (compatible; MSIE 7.0; Windows 98; Trident/3.0)"\n[974499] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=974499\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 155.138.233.31:9092 could not be established. Broker may not be available.\n[2760622] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d48fbb4e32f277d7\nError occurred while calling aws lambda system- endpoint : https://9732394d96.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 244,
          name: 'Natasha Robertson',
          patternsSample:
            '81.4.130.9 -- [ 17/Apr/2025:12:17:36 +0000 ] "GET /bundle/09a72bc0e0e8ac2d.js HTTP/1.1" 504 "http://stark-scott.com/main/index.asp" "Opera/9.96.(Windows 98; Win 9x 4.90; om-ET) Presto/2.9.172 Version/11.00"\n[767402] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=767402\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 138.188.250.235:9092 could not be established. Broker may not be available.\n[1441506] Problem reaching database. Timeout http request GET https://ibm.box.com/s/390874daa9d78386\nError occurred while calling aws lambda system- endpoint : https://8135ac2a3d.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 245,
          name: 'Angelica Rivera',
          patternsSample:
            '152.209.171.123 -- [ 15/Feb/2025:21:14:04 +0000 ] "GET /bundle/45f5ff20b186c48f.js HTTP/1.1" 500 "https://www.walters.info/author.html" "Opera/9.15.(Windows NT 5.2; hu-HU) Presto/2.9.171 Version/11.00"\n[381904] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=381904\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 183.57.47.162:9092 could not be established. Broker may not be available.\n[9441982] Problem reaching database. Timeout http request GET https://ibm.box.com/s/43d1ee887988ee57\nError occurred while calling aws lambda system- endpoint : https://803b805f10.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 246,
          name: 'Amy Owens',
          patternsSample:
            '190.193.56.26 -- [ 23/Jan/2025:20:49:02 +0000 ] "GET /bundle/98d57883ab5b77e4.js HTTP/1.1" 403 "http://burton.com/app/about/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/3.1)"\n[768591] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=768591\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 179.158.27.125:9092 could not be established. Broker may not be available.\n[2802463] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d797c40adcebc697\nError occurred while calling aws lambda system- endpoint : https://9a1d641989.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 247,
          name: 'Joshua Brown',
          patternsSample:
            '108.41.17.4 -- [ 23/Feb/2025:22:53:11 +0000 ] "GET /bundle/40961cfe90959f60.js HTTP/1.1" 500 "https://www.medina-huffman.biz/search/blog/posts/register.php" "Opera/8.87.(Windows NT 5.0; ts-ZA) Presto/2.9.161 Version/12.00"\n[212306] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=212306\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 14.204.81.244:9092 could not be established. Broker may not be available.\n[6099855] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5f704bf68919e02f\nError occurred while calling aws lambda system- endpoint : https://b955325a35.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 248,
          name: 'Brandon Parker',
          patternsSample:
            '2.109.34.151 -- [ 19/Feb/2025:10:02:22 +0000 ] "GET /bundle/72baed71f88acae9.js HTTP/1.1" 500 "https://www.lopez-berry.com/home/" "Opera/8.88.(Windows CE; as-IN) Presto/2.9.180 Version/10.00"\n[222908] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=222908\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 175.247.237.96:9092 could not be established. Broker may not be available.\n[9457600] Problem reaching database. Timeout http request GET https://ibm.box.com/s/fad1e926ebc31a06\nError occurred while calling aws lambda system- endpoint : https://e9a84ebdd2.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 249,
          name: 'Emily Burton',
          patternsSample:
            '3.46.241.227 -- [ 19/May/2025:01:57:17 +0000 ] "GET /bundle/8da7cca881bbcc81.js HTTP/1.1" 200 "https://jenkins.info/search/" "Mozilla/5.0 (iPad; CPU iPad OS 14_2_1 like Mac OS X) AppleWebKit/532.0 (KHTML, like Gecko) FxiOS/15.8u0943.0 Mobile/31J792 Safari/532.0"\n[748765] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=748765\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 153.69.52.41:9092 could not be established. Broker may not be available.\n[3999334] Problem reaching database. Timeout http request GET https://ibm.box.com/s/cc0b9e4ab14db21d\nError occurred while calling aws lambda system- endpoint : https://d2263ea095.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 250,
          name: 'Carla Willis',
          patternsSample:
            '145.86.197.62 -- [ 21/May/2025:06:04:56 +0000 ] "GET /bundle/35c2c34a018dbbba.js HTTP/1.1" 403 "http://drake.biz/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_2 like Mac OS X; szl-PL) AppleWebKit/533.14.6 (KHTML, like Gecko) Version/4.0.5 Mobile/8B117 Safari/6533.14.6"\n[995390] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=995390\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 175.139.146.245:9092 could not be established. Broker may not be available.\n[3202235] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c44e07203406bea1\nError occurred while calling aws lambda system- endpoint : https://5c4ab9d102.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 251,
          name: 'David Callahan',
          patternsSample:
            '53.246.240.18 -- [ 01/May/2025:17:41:36 +0000 ] "GET /bundle/3d2ea0acfa0c65f9.js HTTP/1.1" 504 "https://www.mitchell.com/" "Mozilla/5.0 (iPad; CPU iPad OS 5_1_1 like Mac OS X) AppleWebKit/532.2 (KHTML, like Gecko) CriOS/61.0.805.0 Mobile/94X344 Safari/532.2"\n[712495] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=712495\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 116.75.41.248:9092 could not be established. Broker may not be available.\n[7445780] Problem reaching database. Timeout http request GET https://ibm.box.com/s/3927e2867a80f9a1\nError occurred while calling aws lambda system- endpoint : https://338b30fc87.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 252,
          name: 'Lindsay Harper',
          patternsSample:
            '114.209.5.80 -- [ 03/Jan/2025:07:52:44 +0000 ] "GET /bundle/58ec787652394008.js HTTP/1.1" 403 "https://williams-atkinson.com/category/" "Opera/9.98.(X11; Linux x86_64; ce-RU) Presto/2.9.187 Version/12.00"\n[117192] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=117192\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 69.86.227.236:9092 could not be established. Broker may not be available.\n[7029302] Problem reaching database. Timeout http request GET https://ibm.box.com/s/2d52263e85a7bc43\nError occurred while calling aws lambda system- endpoint : https://0fe33903f0.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 253,
          name: 'Mary Alvarez',
          patternsSample:
            '216.254.84.53 -- [ 15/Feb/2025:22:14:45 +0000 ] "GET /bundle/5cb20349a247f6f0.js HTTP/1.1" 504 "https://benson.info/post/" "Mozilla/5.0 (Windows NT 5.0) AppleWebKit/536.0 (KHTML, like Gecko) Chrome/24.0.876.0 Safari/536.0"\n[392839] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=392839\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 216.40.242.209:9092 could not be established. Broker may not be available.\n[2971055] Problem reaching database. Timeout http request GET https://ibm.box.com/s/a74ba72d80e9080f\nError occurred while calling aws lambda system- endpoint : https://6ee299538a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 254,
          name: 'David Scott',
          patternsSample:
            '89.249.58.4 -- [ 09/Apr/2025:00:20:15 +0000 ] "GET /bundle/f3d55f85115da265.js HTTP/1.1" 500 "http://www.rogers.biz/" "Opera/8.41.(X11; Linux x86_64; lt-LT) Presto/2.9.167 Version/12.00"\n[996673] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=996673\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 95.130.213.144:9092 could not be established. Broker may not be available.\n[2538279] Problem reaching database. Timeout http request GET https://ibm.box.com/s/beb2df7732332ae4\nError occurred while calling aws lambda system- endpoint : https://edd00e50b1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 255,
          name: 'Holly Stephenson',
          patternsSample:
            '219.201.25.216 -- [ 14/Feb/2025:07:25:31 +0000 ] "GET /bundle/dfd6ebffe7b70933.js HTTP/1.1" 500 "https://www.jones-diaz.com/tags/list/about/" "Opera/8.83.(X11; Linux x86_64; sa-IN) Presto/2.9.179 Version/10.00"\n[619066] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=619066\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 81.43.164.7:9092 could not be established. Broker may not be available.\n[2441716] Problem reaching database. Timeout http request GET https://ibm.box.com/s/889009845635bc81\nError occurred while calling aws lambda system- endpoint : https://9e9c770f0f.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 256,
          name: 'Robert Taylor',
          patternsSample:
            '40.242.102.247 -- [ 29/Mar/2025:04:20:27 +0000 ] "GET /bundle/9c24e81fa150f790.js HTTP/1.1" 403 "https://www.gomez-tucker.com/app/categories/register/" "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/534.0 (KHTML, like Gecko) Chrome/42.0.850.0 Safari/534.0"\n[926575] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=926575\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 166.83.128.96:9092 could not be established. Broker may not be available.\n[2061594] Problem reaching database. Timeout http request GET https://ibm.box.com/s/78957a0efb8ce42f\nError occurred while calling aws lambda system- endpoint : https://4536e2aedd.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 257,
          name: 'Linda Jackson',
          patternsSample:
            '79.147.22.140 -- [ 11/Jan/2025:18:06:03 +0000 ] "GET /bundle/e763bcbe75697080.js HTTP/1.1" 500 "https://phillips-hoover.com/login/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_0 rv:6.0; mn-MN) AppleWebKit/531.47.4 (KHTML, like Gecko) Version/4.1 Safari/531.47.4"\n[990880] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=990880\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 100.9.31.66:9092 could not be established. Broker may not be available.\n[4301882] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e91e26be254122d3\nError occurred while calling aws lambda system- endpoint : https://d1833230dd.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 258,
          name: 'Tanya Contreras',
          patternsSample:
            '67.161.7.54 -- [ 16/Mar/2025:09:02:49 +0000 ] "GET /bundle/48e0af556946c6ea.js HTTP/1.1" 500 "http://martin.com/wp-content/list/faq.html" "Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 6.2; Trident/3.0)"\n[993394] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=993394\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 133.59.5.154:9092 could not be established. Broker may not be available.\n[9660212] Problem reaching database. Timeout http request GET https://ibm.box.com/s/3319b5336a97c002\nError occurred while calling aws lambda system- endpoint : https://2aaf9b5ea1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 259,
          name: 'Katie Jackson',
          patternsSample:
            '119.20.229.184 -- [ 12/Jan/2025:16:51:49 +0000 ] "GET /bundle/e947a69e8f17a9b4.js HTTP/1.1" 403 "https://www.cooper-lewis.biz/categories/posts/list/search/" "Mozilla/5.0 (compatible; MSIE 6.0; Windows 95; Trident/4.0)"\n[315893] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=315893\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 73.244.55.143:9092 could not be established. Broker may not be available.\n[5157293] Problem reaching database. Timeout http request GET https://ibm.box.com/s/065d8223f829e75a\nError occurred while calling aws lambda system- endpoint : https://39ed8bbe12.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 260,
          name: 'Stephanie Rogers',
          patternsSample:
            '58.168.118.241 -- [ 15/Apr/2025:13:42:56 +0000 ] "GET /bundle/63575b438dc172ec.js HTTP/1.1" 500 "http://www.mckee.info/author/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_7 rv:3.0; bs-BA) AppleWebKit/535.24.1 (KHTML, like Gecko) Version/5.0.5 Safari/535.24.1"\n[531552] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=531552\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 200.248.109.50:9092 could not be established. Broker may not be available.\n[1906265] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d58a53e28f4cfc0e\nError occurred while calling aws lambda system- endpoint : https://6e7f66e0e3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 261,
          name: 'Amanda Morris DVM',
          patternsSample:
            '124.207.93.192 -- [ 21/Feb/2025:12:07:07 +0000 ] "GET /bundle/83c5376080818960.js HTTP/1.1" 500 "http://www.gray.com/main/author.asp" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_6_3; rv:1.9.4.20) Gecko/2023-11-17 01:28:13 Firefox/10.0"\n[943988] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=943988\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 5.246.241.107:9092 could not be established. Broker may not be available.\n[5866754] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0321f44cd4645f7b\nError occurred while calling aws lambda system- endpoint : https://c135eb9f72.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 262,
          name: 'Patricia Cooper',
          patternsSample:
            '92.23.130.49 -- [ 06/Feb/2025:15:06:48 +0000 ] "GET /bundle/d552d1e2590f29f6.js HTTP/1.1" 403 "http://www.moore-lewis.org/blog/app/post/" "Mozilla/5.0 (iPad; CPU iPad OS 5_1_1 like Mac OS X) AppleWebKit/532.0 (KHTML, like Gecko) CriOS/50.0.808.0 Mobile/80M949 Safari/532.0"\n[334177] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=334177\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 161.91.99.222:9092 could not be established. Broker may not be available.\n[6729484] Problem reaching database. Timeout http request GET https://ibm.box.com/s/8e02e7ab87fcd7fe\nError occurred while calling aws lambda system- endpoint : https://06fc3d005a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 263,
          name: 'Lauren Johnson',
          patternsSample:
            '111.58.46.252 -- [ 14/May/2025:21:08:20 +0000 ] "GET /bundle/29c174d023607c20.js HTTP/1.1" 500 "https://www.freeman.info/privacy/" "Mozilla/5.0 (Android 7.0; Mobile; rv:42.0) Gecko/42.0 Firefox/42.0"\n[219796] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=219796\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 63.20.22.189:9092 could not be established. Broker may not be available.\n[8960358] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d172cfd4e1dc74ec\nError occurred while calling aws lambda system- endpoint : https://366661aa3c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 264,
          name: 'Christopher Vaughn',
          patternsSample:
            '56.229.57.34 -- [ 19/Feb/2025:07:49:07 +0000 ] "GET /bundle/62bf8a88b4c50806.js HTTP/1.1" 504 "http://www.kent-hays.biz/main/app/category/" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_12_5 rv:3.0; fil-PH) AppleWebKit/534.3.5 (KHTML, like Gecko) Version/4.0.2 Safari/534.3.5"\n[129126] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=129126\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 163.95.2.22:9092 could not be established. Broker may not be available.\n[7853604] Problem reaching database. Timeout http request GET https://ibm.box.com/s/38349212c809bec3\nError occurred while calling aws lambda system- endpoint : https://31ab7098e9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 265,
          name: 'Marie Gibbs',
          patternsSample:
            '176.68.40.73 -- [ 13/May/2025:09:37:27 +0000 ] "GET /bundle/326c574433642aec.js HTTP/1.1" 403 "https://arroyo-murphy.biz/register/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_2 like Mac OS X; se-NO) AppleWebKit/533.34.2 (KHTML, like Gecko) Version/3.0.5 Mobile/8B119 Safari/6533.34.2"\n[937037] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=937037\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 221.249.126.127:9092 could not be established. Broker may not be available.\n[6588028] Problem reaching database. Timeout http request GET https://ibm.box.com/s/bd9347f991486c3d\nError occurred while calling aws lambda system- endpoint : https://33616f45e2.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 266,
          name: 'Melissa Thomas',
          patternsSample:
            '215.112.250.239 -- [ 03/Jan/2025:13:41:22 +0000 ] "GET /bundle/b5f30456c65a67d1.js HTTP/1.1" 403 "https://bradley.org/main/categories/privacy/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows 98; Win 9x 4.90; Trident/4.0)"\n[834283] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=834283\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 17.165.249.209:9092 could not be established. Broker may not be available.\n[2997580] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b715d3fa2f11c11f\nError occurred while calling aws lambda system- endpoint : https://44c4389840.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 267,
          name: 'Amy Taylor',
          patternsSample:
            '196.189.65.178 -- [ 18/Jan/2025:03:41:29 +0000 ] "GET /bundle/1ab690c87f570754.js HTTP/1.1" 200 "https://adams-blankenship.com/" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_9_6) AppleWebKit/536.0 (KHTML, like Gecko) Chrome/57.0.872.0 Safari/536.0"\n[284366] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=284366\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 1.173.237.200:9092 could not be established. Broker may not be available.\n[6640651] Problem reaching database. Timeout http request GET https://ibm.box.com/s/31ce7b92bc9310cd\nError occurred while calling aws lambda system- endpoint : https://89eb33b0bd.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 268,
          name: 'Erica Murphy',
          patternsSample:
            '33.105.88.68 -- [ 17/Feb/2025:03:57:10 +0000 ] "GET /bundle/41b699270c0e4fcc.js HTTP/1.1" 500 "https://mckinney-robinson.com/blog/homepage.html" "Mozilla/5.0 (Windows; U; Windows NT 5.1) AppleWebKit/531.19.7 (KHTML, like Gecko) Version/4.0.5 Safari/531.19.7"\n[331693] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=331693\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 125.227.74.239:9092 could not be established. Broker may not be available.\n[8744163] Problem reaching database. Timeout http request GET https://ibm.box.com/s/222a51ec5fd6d1ad\nError occurred while calling aws lambda system- endpoint : https://a26e1469a0.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 269,
          name: 'Lindsey Hopkins',
          patternsSample:
            '25.21.168.175 -- [ 15/May/2025:22:51:46 +0000 ] "GET /bundle/f8eba53e6f3152c7.js HTTP/1.1" 500 "http://www.randall.com/posts/category/" "Mozilla/5.0 (Windows 98; wa-BE; rv:1.9.1.20) Gecko/2018-04-26 16:02:48 Firefox/14.0"\n[817457] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=817457\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 73.63.119.43:9092 could not be established. Broker may not be available.\n[6587398] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5097ba3373d30e19\nError occurred while calling aws lambda system- endpoint : https://ce2a364211.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 270,
          name: 'Brittney Jones',
          patternsSample:
            '43.131.26.176 -- [ 20/May/2025:20:56:25 +0000 ] "GET /bundle/49c291339c0fbd8a.js HTTP/1.1" 403 "http://www.chase-hart.com/explore/index/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.2; Trident/5.0)"\n[176698] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=176698\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 26.148.215.164:9092 could not be established. Broker may not be available.\n[2583987] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ae27ac76f157b094\nError occurred while calling aws lambda system- endpoint : https://154a1d0593.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 271,
          name: 'Robin Fields MD',
          patternsSample:
            '20.8.162.245 -- [ 24/Jan/2025:10:49:45 +0000 ] "GET /bundle/6b8e7f9a83d85f04.js HTTP/1.1" 403 "https://www.fitzgerald-burns.com/posts/homepage.html" "Opera/9.65.(X11; Linux i686; crh-UA) Presto/2.9.177 Version/10.00"\n[209619] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=209619\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 207.199.199.217:9092 could not be established. Broker may not be available.\n[3508586] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0d17b7e3bf256278\nError occurred while calling aws lambda system- endpoint : https://fbb1a5be14.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 272,
          name: 'Erika Reid',
          patternsSample:
            '109.39.35.117 -- [ 23/Feb/2025:03:37:48 +0000 ] "GET /bundle/0431e260fe4bc374.js HTTP/1.1" 200 "https://www.harper.com/explore/post.asp" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_3 like Mac OS X; pl-PL) AppleWebKit/533.41.2 (KHTML, like Gecko) Version/3.0.5 Mobile/8B119 Safari/6533.41.2"\n[309971] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=309971\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 57.187.162.88:9092 could not be established. Broker may not be available.\n[2657634] Problem reaching database. Timeout http request GET https://ibm.box.com/s/42487ac496159dc7\nError occurred while calling aws lambda system- endpoint : https://e1e87b1b34.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 273,
          name: 'Deborah Williams',
          patternsSample:
            '13.35.150.188 -- [ 20/Feb/2025:22:21:39 +0000 ] "GET /bundle/5f26e05cf85f8251.js HTTP/1.1" 403 "http://www.taylor-swanson.org/posts/wp-content/search/terms.php" "Opera/9.33.(Windows 95; mi-NZ) Presto/2.9.177 Version/10.00"\n[694101] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=694101\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 109.98.64.149:9092 could not be established. Broker may not be available.\n[5065974] Problem reaching database. Timeout http request GET https://ibm.box.com/s/38bc43687d9cfed8\nError occurred while calling aws lambda system- endpoint : https://4f8cc17415.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 274,
          name: 'Robert Lopez',
          patternsSample:
            '202.93.153.27 -- [ 28/Mar/2025:00:53:58 +0000 ] "GET /bundle/63afe88e6389d214.js HTTP/1.1" 200 "https://www.ortega.com/" "Mozilla/5.0 (compatible; MSIE 5.0; Windows NT 5.1; Trident/3.0)"\n[799212] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=799212\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 81.94.251.208:9092 could not be established. Broker may not be available.\n[5996494] Problem reaching database. Timeout http request GET https://ibm.box.com/s/900d0cbd8ef50b24\nError occurred while calling aws lambda system- endpoint : https://f45cad874c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 275,
          name: 'Jason Potter',
          patternsSample:
            '6.127.223.126 -- [ 17/Jan/2025:22:06:30 +0000 ] "GET /bundle/920eebfecd8bbadb.js HTTP/1.1" 200 "http://www.johnson.info/faq.asp" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_1 like Mac OS X; gez-ER) AppleWebKit/534.26.1 (KHTML, like Gecko) Version/3.0.5 Mobile/8B116 Safari/6534.26.1"\n[123447] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=123447\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 79.210.137.209:9092 could not be established. Broker may not be available.\n[7128751] Problem reaching database. Timeout http request GET https://ibm.box.com/s/409fce4e0383c1a5\nError occurred while calling aws lambda system- endpoint : https://178ddf3001.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 276,
          name: 'Elizabeth Taylor',
          patternsSample:
            '117.195.137.84 -- [ 08/Feb/2025:06:47:39 +0000 ] "GET /bundle/4ad6a73557e7ca38.js HTTP/1.1" 504 "http://www.flynn.org/post/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_1 like Mac OS X; li-BE) AppleWebKit/532.38.4 (KHTML, like Gecko) Version/3.0.5 Mobile/8B117 Safari/6532.38.4"\n[418560] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=418560\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 178.101.181.181:9092 could not be established. Broker may not be available.\n[2624683] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e90a8c6d08ed5322\nError occurred while calling aws lambda system- endpoint : https://1b894dec05.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 277,
          name: 'David Shaw',
          patternsSample:
            '211.247.39.128 -- [ 19/Mar/2025:19:49:28 +0000 ] "GET /bundle/8cbbccfc6c3acec8.js HTTP/1.1" 500 "http://www.adams.biz/main/app/login/" "Opera/9.79.(X11; Linux i686; id-ID) Presto/2.9.182 Version/10.00"\n[390879] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=390879\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 223.222.94.102:9092 could not be established. Broker may not be available.\n[9167002] Problem reaching database. Timeout http request GET https://ibm.box.com/s/8a68fcbef4520974\nError occurred while calling aws lambda system- endpoint : https://9bd27cd108.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 278,
          name: 'Lisa Hoffman',
          patternsSample:
            '85.72.31.18 -- [ 10/Feb/2025:06:07:37 +0000 ] "GET /bundle/29e75d61530172db.js HTTP/1.1" 504 "http://www.gonzalez-wilcox.com/" "Opera/8.54.(Windows NT 5.0; ky-KG) Presto/2.9.178 Version/11.00"\n[741699] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=741699\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 91.171.73.35:9092 could not be established. Broker may not be available.\n[3173861] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f6ed4101547d21d9\nError occurred while calling aws lambda system- endpoint : https://63228c8290.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 279,
          name: 'Maureen Luna',
          patternsSample:
            '152.108.129.26 -- [ 14/Feb/2025:12:10:26 +0000 ] "GET /bundle/f09418a4b08ee676.js HTTP/1.1" 504 "https://hernandez.com/categories/terms.html" "Opera/9.25.(X11; Linux i686; ar-MA) Presto/2.9.178 Version/10.00"\n[255316] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=255316\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 33.57.156.194:9092 could not be established. Broker may not be available.\n[8778425] Problem reaching database. Timeout http request GET https://ibm.box.com/s/9cc28a712ab10846\nError occurred while calling aws lambda system- endpoint : https://6fa55165aa.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 280,
          name: 'Holly Rich',
          patternsSample:
            '198.183.16.197 -- [ 15/Feb/2025:11:49:15 +0000 ] "GET /bundle/7bb9ad8fd209982b.js HTTP/1.1" 403 "https://chambers.org/category/" "Opera/9.27.(Windows NT 5.0; aa-ET) Presto/2.9.185 Version/12.00"\n[302248] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=302248\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 8.121.183.162:9092 could not be established. Broker may not be available.\n[5725919] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e1f30426e6c97abc\nError occurred while calling aws lambda system- endpoint : https://070d7344d3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 281,
          name: 'Gary Curtis',
          patternsSample:
            '198.164.183.251 -- [ 10/Jan/2025:12:50:28 +0000 ] "GET /bundle/d2b8200bbc37dcbe.js HTTP/1.1" 200 "http://parks.info/wp-content/explore/category.html" "Mozilla/5.0 (Windows; U; Windows NT 6.0) AppleWebKit/533.2.5 (KHTML, like Gecko) Version/4.0.2 Safari/533.2.5"\n[353524] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=353524\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 179.75.148.15:9092 could not be established. Broker may not be available.\n[9593755] Problem reaching database. Timeout http request GET https://ibm.box.com/s/9a08fd06847b70a7\nError occurred while calling aws lambda system- endpoint : https://7cb62c6284.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 282,
          name: 'Johnny Rose',
          patternsSample:
            '1.120.144.188 -- [ 13/Apr/2025:19:56:15 +0000 ] "GET /bundle/c53bb57a91995316.js HTTP/1.1" 504 "http://www.patterson-taylor.info/register.html" "Opera/9.91.(X11; Linux x86_64; am-ET) Presto/2.9.163 Version/11.00"\n[291750] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=291750\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 112.128.195.7:9092 could not be established. Broker may not be available.\n[7604366] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f2462315d8b892ae\nError occurred while calling aws lambda system- endpoint : https://063ffdba31.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 283,
          name: 'Vanessa Lewis',
          patternsSample:
            '35.102.197.76 -- [ 28/Jan/2025:13:26:30 +0000 ] "GET /bundle/2ad19ad4ad654e79.js HTTP/1.1" 200 "https://allen.info/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/532.1 (KHTML, like Gecko) Chrome/43.0.817.0 Safari/532.1"\n[299738] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=299738\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 223.154.120.57:9092 could not be established. Broker may not be available.\n[4509546] Problem reaching database. Timeout http request GET https://ibm.box.com/s/69d7e1107ffcbcc2\nError occurred while calling aws lambda system- endpoint : https://72ce5d04d1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 284,
          name: 'Sean Bowman',
          patternsSample:
            '124.137.134.129 -- [ 26/Apr/2025:02:49:22 +0000 ] "GET /bundle/99437fda840feeb8.js HTTP/1.1" 504 "https://wilson.com/" "Mozilla/5.0 (Windows CE; sa-IN; rv:1.9.0.20) Gecko/2022-03-13 05:01:19 Firefox/15.0"\n[571245] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=571245\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 65.237.81.239:9092 could not be established. Broker may not be available.\n[1128648] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0ebf9c79c7758f97\nError occurred while calling aws lambda system- endpoint : https://7f6d425e28.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 285,
          name: 'Dana Schmidt',
          patternsSample:
            '135.148.195.69 -- [ 29/Apr/2025:14:36:37 +0000 ] "GET /bundle/4c37abb12b1d5ad2.js HTTP/1.1" 500 "http://brewer-fowler.com/" "Opera/8.56.(X11; Linux i686; dz-BT) Presto/2.9.178 Version/11.00"\n[813869] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=813869\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 112.129.160.202:9092 could not be established. Broker may not be available.\n[4408365] Problem reaching database. Timeout http request GET https://ibm.box.com/s/994afce1e323da9a\nError occurred while calling aws lambda system- endpoint : https://e826b1b4cb.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 286,
          name: 'Michael Martinez',
          patternsSample:
            '53.133.159.121 -- [ 21/Feb/2025:18:06:24 +0000 ] "GET /bundle/a4801fce2660ad5d.js HTTP/1.1" 403 "https://porter.com/author.php" "Opera/8.36.(X11; Linux x86_64; bs-BA) Presto/2.9.168 Version/11.00"\n[377545] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=377545\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 219.212.67.246:9092 could not be established. Broker may not be available.\n[7743938] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e79ba58ce31690b7\nError occurred while calling aws lambda system- endpoint : https://895424a45c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 287,
          name: 'Jerry Allen',
          patternsSample:
            '117.34.54.186 -- [ 14/Apr/2025:22:48:53 +0000 ] "GET /bundle/9ce4414a57cecb60.js HTTP/1.1" 200 "http://king.biz/search/tag/login.html" "Opera/9.96.(Windows NT 6.2; el-CY) Presto/2.9.163 Version/12.00"\n[970295] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=970295\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 188.72.10.176:9092 could not be established. Broker may not be available.\n[1004558] Problem reaching database. Timeout http request GET https://ibm.box.com/s/539d4913c93d8cbf\nError occurred while calling aws lambda system- endpoint : https://dc24a12f7f.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 288,
          name: 'Matthew Meza',
          patternsSample:
            '21.135.226.232 -- [ 26/Jan/2025:02:34:26 +0000 ] "GET /bundle/d764add40876dff7.js HTTP/1.1" 403 "https://gonzalez.net/wp-content/index/" "Mozilla/5.0 (Linux; Android 1.1) AppleWebKit/532.1 (KHTML, like Gecko) Chrome/57.0.866.0 Safari/532.1"\n[673788] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=673788\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 122.202.216.194:9092 could not be established. Broker may not be available.\n[9572106] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c07afd68323cdfa8\nError occurred while calling aws lambda system- endpoint : https://128859ce34.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 289,
          name: 'Russell Gray',
          patternsSample:
            '4.139.177.78 -- [ 29/Jan/2025:04:28:15 +0000 ] "GET /bundle/f382686c12c7016a.js HTTP/1.1" 500 "https://young.org/register.jsp" "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/534.0 (KHTML, like Gecko) Chrome/37.0.832.0 Safari/534.0"\n[536592] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=536592\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 209.69.244.230:9092 could not be established. Broker may not be available.\n[9758944] Problem reaching database. Timeout http request GET https://ibm.box.com/s/89537ed78430aafb\nError occurred while calling aws lambda system- endpoint : https://3d4856a84a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 290,
          name: 'Kaitlin Johnson',
          patternsSample:
            '61.62.106.34 -- [ 18/Jan/2025:14:31:24 +0000 ] "GET /bundle/5568297e113e0331.js HTTP/1.1" 504 "https://www.williams.org/category/login.htm" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_8; rv:1.9.2.20) Gecko/2010-01-15 18:55:50 Firefox/3.6.3"\n[992405] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=992405\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 51.33.135.36:9092 could not be established. Broker may not be available.\n[9335521] Problem reaching database. Timeout http request GET https://ibm.box.com/s/fc20925a1627c9df\nError occurred while calling aws lambda system- endpoint : https://8f347cf1c9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 291,
          name: 'Marie George DVM',
          patternsSample:
            '89.205.24.252 -- [ 13/May/2025:07:29:26 +0000 ] "GET /bundle/0bb5f81a83f60769.js HTTP/1.1" 403 "http://www.jensen-garrison.net/app/wp-content/posts/author.html" "Mozilla/5.0 (Windows NT 6.0) AppleWebKit/531.1 (KHTML, like Gecko) Chrome/35.0.849.0 Safari/531.1"\n[108083] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=108083\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 166.139.231.17:9092 could not be established. Broker may not be available.\n[1815706] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b11eac24818ac019\nError occurred while calling aws lambda system- endpoint : https://ce43bea09c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 292,
          name: 'Suzanne Ochoa',
          patternsSample:
            '65.146.220.92 -- [ 13/Mar/2025:07:04:55 +0000 ] "GET /bundle/ec9c443400483adb.js HTTP/1.1" 403 "http://www.lindsey-reese.biz/" "Opera/9.30.(Windows NT 6.2; br-FR) Presto/2.9.190 Version/11.00"\n[558369] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=558369\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 132.73.6.137:9092 could not be established. Broker may not be available.\n[3391154] Problem reaching database. Timeout http request GET https://ibm.box.com/s/fe5f1e47f6be835e\nError occurred while calling aws lambda system- endpoint : https://2745787e84.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 293,
          name: 'James Foster',
          patternsSample:
            '37.13.200.129 -- [ 27/Mar/2025:16:58:32 +0000 ] "GET /bundle/08cbed1e9d2c9e03.js HTTP/1.1" 500 "http://young-mccarty.com/app/tag/wp-content/home.jsp" "Mozilla/5.0 (iPad; CPU iPad OS 5_1_1 like Mac OS X) AppleWebKit/531.2 (KHTML, like Gecko) CriOS/32.0.887.0 Mobile/02D442 Safari/531.2"\n[758863] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=758863\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 204.152.34.108:9092 could not be established. Broker may not be available.\n[9568432] Problem reaching database. Timeout http request GET https://ibm.box.com/s/769f6070486a69b1\nError occurred while calling aws lambda system- endpoint : https://959d0d54fe.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 294,
          name: 'Benjamin Boyd',
          patternsSample:
            '26.111.153.6 -- [ 19/Jan/2025:13:03:01 +0000 ] "GET /bundle/4eaa5e92465f3c4e.js HTTP/1.1" 200 "http://www.davis.com/main/index.php" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_0 like Mac OS X; cs-CZ) AppleWebKit/533.26.5 (KHTML, like Gecko) Version/4.0.5 Mobile/8B115 Safari/6533.26.5"\n[883664] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=883664\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 44.180.94.204:9092 could not be established. Broker may not be available.\n[4358641] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f743f143384125bd\nError occurred while calling aws lambda system- endpoint : https://e37185e69e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 295,
          name: 'Dr. Sandra Wright MD',
          patternsSample:
            '179.135.182.1 -- [ 09/Mar/2025:14:50:13 +0000 ] "GET /bundle/eba2b0c2333c27ed.js HTTP/1.1" 403 "https://miller.com/app/posts/main/homepage.php" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_2 like Mac OS X; id-ID) AppleWebKit/531.19.1 (KHTML, like Gecko) Version/4.0.5 Mobile/8B118 Safari/6531.19.1"\n[183491] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=183491\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 47.75.191.123:9092 could not be established. Broker may not be available.\n[5433678] Problem reaching database. Timeout http request GET https://ibm.box.com/s/92f2f1885d071846\nError occurred while calling aws lambda system- endpoint : https://78c01960d5.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 296,
          name: 'Deborah Mclaughlin',
          patternsSample:
            '187.49.178.239 -- [ 16/Jan/2025:03:21:23 +0000 ] "GET /bundle/8b567dd9e9dd5d2d.js HTTP/1.1" 403 "https://lewis-hubbard.com/privacy/" "Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 4.0; Trident/3.0)"\n[433723] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=433723\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 209.186.102.43:9092 could not be established. Broker may not be available.\n[6093678] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5e2612fa4f5a02f2\nError occurred while calling aws lambda system- endpoint : https://bcbcedfcd5.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 297,
          name: 'James Brooks',
          patternsSample:
            '11.57.56.232 -- [ 13/Feb/2025:03:35:27 +0000 ] "GET /bundle/737e051ee6a26afc.js HTTP/1.1" 200 "https://www.martin.biz/category/" "Opera/9.72.(X11; Linux x86_64; sr-ME) Presto/2.9.177 Version/12.00"\n[469701] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=469701\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 91.227.245.67:9092 could not be established. Broker may not be available.\n[8913168] Problem reaching database. Timeout http request GET https://ibm.box.com/s/af88e270ce6cd898\nError occurred while calling aws lambda system- endpoint : https://ad6530e763.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 298,
          name: 'Christopher Jackson',
          patternsSample:
            '185.106.65.158 -- [ 04/May/2025:03:46:14 +0000 ] "GET /bundle/471b4e89dcb9fecc.js HTTP/1.1" 504 "https://lee.com/wp-content/app/category/index.php" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_0 like Mac OS X; ve-ZA) AppleWebKit/531.15.6 (KHTML, like Gecko) Version/3.0.5 Mobile/8B115 Safari/6531.15.6"\n[907171] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=907171\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 220.43.177.75:9092 could not be established. Broker may not be available.\n[7683812] Problem reaching database. Timeout http request GET https://ibm.box.com/s/de52da525969b289\nError occurred while calling aws lambda system- endpoint : https://8ce1b69352.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 299,
          name: 'Sharon Bennett',
          patternsSample:
            '93.219.100.41 -- [ 12/Feb/2025:09:33:45 +0000 ] "GET /bundle/6a72d21ae0246bdf.js HTTP/1.1" 403 "http://smith-cox.com/home.html" "Opera/8.30.(Windows NT 5.2; et-EE) Presto/2.9.174 Version/11.00"\n[219744] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=219744\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 79.61.226.173:9092 could not be established. Broker may not be available.\n[2288511] Problem reaching database. Timeout http request GET https://ibm.box.com/s/71216eef19a72803\nError occurred while calling aws lambda system- endpoint : https://10f135d174.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 300,
          name: 'Larry Andersen',
          patternsSample:
            '190.208.148.242 -- [ 11/Feb/2025:01:07:51 +0000 ] "GET /bundle/bf931c1abe8c6bc0.js HTTP/1.1" 500 "http://conrad.com/explore/categories/faq.html" "Mozilla/5.0 (Windows; U; Windows NT 5.0) AppleWebKit/531.22.7 (KHTML, like Gecko) Version/4.0.5 Safari/531.22.7"\n[734927] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=734927\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 62.36.69.146:9092 could not be established. Broker may not be available.\n[4951592] Problem reaching database. Timeout http request GET https://ibm.box.com/s/865ef826fdd5544d\nError occurred while calling aws lambda system- endpoint : https://b3fcd53010.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 301,
          name: 'Renee Robinson',
          patternsSample:
            '7.0.22.4 -- [ 14/Jan/2025:19:35:24 +0000 ] "GET /bundle/b9f749906287be48.js HTTP/1.1" 200 "https://www.mckenzie-fischer.com/posts/posts/author.jsp" "Opera/8.20.(Windows 98; Win 9x 4.90; id-ID) Presto/2.9.161 Version/10.00"\n[892076] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=892076\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 17.246.32.180:9092 could not be established. Broker may not be available.\n[9777613] Problem reaching database. Timeout http request GET https://ibm.box.com/s/61754a8776364dc3\nError occurred while calling aws lambda system- endpoint : https://0c0471c344.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 302,
          name: 'Leah Chen',
          patternsSample:
            '104.123.17.11 -- [ 29/Apr/2025:16:31:03 +0000 ] "GET /bundle/94141b692c3ed98c.js HTTP/1.1" 504 "http://www.coleman.com/blog/author/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_1 like Mac OS X; sk-SK) AppleWebKit/531.8.3 (KHTML, like Gecko) Version/4.0.5 Mobile/8B116 Safari/6531.8.3"\n[729639] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=729639\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 216.11.69.82:9092 could not be established. Broker may not be available.\n[9429916] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e279bef4e538d5d9\nError occurred while calling aws lambda system- endpoint : https://fadc9e1400.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 303,
          name: 'Megan Myers',
          patternsSample:
            '7.168.37.240 -- [ 19/Apr/2025:22:20:18 +0000 ] "GET /bundle/3ed2ab8d864f8905.js HTTP/1.1" 500 "http://scott.net/blog/register.html" "Mozilla/5.0 (X11; Linux i686; rv:1.9.7.20) Gecko/2024-10-09 13:15:05 Firefox/5.0"\n[623579] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=623579\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 100.226.73.185:9092 could not be established. Broker may not be available.\n[1337458] Problem reaching database. Timeout http request GET https://ibm.box.com/s/41c81957240da6a9\nError occurred while calling aws lambda system- endpoint : https://2d3498c260.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 304,
          name: 'Dale Collins',
          patternsSample:
            '8.71.148.91 -- [ 21/Jan/2025:17:34:37 +0000 ] "GET /bundle/936e550624ecb275.js HTTP/1.1" 200 "http://www.moore.net/home.html" "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.01; Trident/5.0)"\n[657202] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=657202\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 106.18.199.57:9092 could not be established. Broker may not be available.\n[8629455] Problem reaching database. Timeout http request GET https://ibm.box.com/s/fee27a4107d7bd62\nError occurred while calling aws lambda system- endpoint : https://80938ed7bd.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 305,
          name: 'Linda Erickson',
          patternsSample:
            '12.174.248.91 -- [ 04/Jan/2025:13:50:36 +0000 ] "GET /bundle/ffa14950ea246bcd.js HTTP/1.1" 500 "https://valdez.com/" "Mozilla/5.0 (Windows NT 6.2; hu-HU; rv:1.9.2.20) Gecko/2016-10-31 11:26:50 Firefox/15.0"\n[249330] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=249330\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 194.10.36.101:9092 could not be established. Broker may not be available.\n[2183904] Problem reaching database. Timeout http request GET https://ibm.box.com/s/edf06dbcce72adba\nError occurred while calling aws lambda system- endpoint : https://18ae3fdfb1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 306,
          name: 'Jeffrey Stevens',
          patternsSample:
            '16.193.13.85 -- [ 25/Apr/2025:11:38:01 +0000 ] "GET /bundle/7b4731856fd3da9b.js HTTP/1.1" 403 "http://andrews.org/faq/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 5.2; Trident/3.1)"\n[864356] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=864356\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 89.160.255.136:9092 could not be established. Broker may not be available.\n[3136357] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f7bd95d43053a815\nError occurred while calling aws lambda system- endpoint : https://66af391d8f.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 307,
          name: 'Melissa Snow',
          patternsSample:
            '146.39.181.186 -- [ 08/Apr/2025:10:20:34 +0000 ] "GET /bundle/c133b01398c36ddf.js HTTP/1.1" 403 "http://munoz-fox.info/explore/posts/privacy.html" "Mozilla/5.0 (X11; Linux i686; rv:1.9.7.20) Gecko/2024-12-20 02:39:24 Firefox/5.0"\n[339360] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=339360\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 32.42.51.56:9092 could not be established. Broker may not be available.\n[2537878] Problem reaching database. Timeout http request GET https://ibm.box.com/s/964025434baaeb67\nError occurred while calling aws lambda system- endpoint : https://485522e9e2.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 308,
          name: 'Dwayne Gregory',
          patternsSample:
            '155.197.184.27 -- [ 14/Jan/2025:23:40:32 +0000 ] "GET /bundle/336ed822f369d71f.js HTTP/1.1" 504 "http://roth.org/categories/wp-content/category/about.html" "Mozilla/5.0 (X11; Linux x86_64; rv:1.9.6.20) Gecko/2014-04-07 00:50:09 Firefox/3.6.6"\n[328513] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=328513\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 178.224.172.109:9092 could not be established. Broker may not be available.\n[6429526] Problem reaching database. Timeout http request GET https://ibm.box.com/s/79b97b4858ff9b2b\nError occurred while calling aws lambda system- endpoint : https://29ea180a5a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 309,
          name: 'Jason English',
          patternsSample:
            '145.214.152.137 -- [ 27/Apr/2025:05:39:42 +0000 ] "GET /bundle/55b0b90eb3c927aa.js HTTP/1.1" 500 "https://www.kelly.com/terms/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows 98; Win 9x 4.90; Trident/3.1)"\n[401112] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=401112\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 36.147.92.81:9092 could not be established. Broker may not be available.\n[6897082] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4d030dcb7b41408d\nError occurred while calling aws lambda system- endpoint : https://1efe9fc5e1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 310,
          name: 'Vanessa Ponce',
          patternsSample:
            '192.126.87.238 -- [ 11/Apr/2025:07:08:46 +0000 ] "GET /bundle/20dcaf860a005bbf.js HTTP/1.1" 200 "https://lindsey.biz/home/" "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.01; Trident/4.1)"\n[351553] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=351553\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 178.240.79.175:9092 could not be established. Broker may not be available.\n[1918937] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4ced5f6b506a531b\nError occurred while calling aws lambda system- endpoint : https://84fbf4f4b9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 311,
          name: 'Katrina Mccann',
          patternsSample:
            '154.242.93.85 -- [ 21/Apr/2025:21:10:43 +0000 ] "GET /bundle/818c817a3b15b6dc.js HTTP/1.1" 500 "https://daniels.com/home.asp" "Opera/8.74.(X11; Linux i686; el-CY) Presto/2.9.177 Version/10.00"\n[741015] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=741015\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 144.105.182.151:9092 could not be established. Broker may not be available.\n[6266280] Problem reaching database. Timeout http request GET https://ibm.box.com/s/7331c95ba284adfe\nError occurred while calling aws lambda system- endpoint : https://958dd9cd8c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 312,
          name: 'Michael Dennis',
          patternsSample:
            '12.168.138.141 -- [ 03/Apr/2025:17:44:32 +0000 ] "GET /bundle/eabc528efc0b611c.js HTTP/1.1" 504 "https://www.kelley.org/explore/tag/index.html" "Mozilla/5.0 (Linux; Android 7.1) AppleWebKit/535.0 (KHTML, like Gecko) Chrome/37.0.803.0 Safari/535.0"\n[172015] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=172015\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 155.52.204.54:9092 could not be established. Broker may not be available.\n[5257282] Problem reaching database. Timeout http request GET https://ibm.box.com/s/581b8df3e227090e\nError occurred while calling aws lambda system- endpoint : https://76729222b9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 313,
          name: 'Cody Griffith',
          patternsSample:
            '4.78.255.71 -- [ 22/Apr/2025:22:18:07 +0000 ] "GET /bundle/b0b4a97da816fe42.js HTTP/1.1" 200 "http://www.evans.com/category/explore/app/terms/" "Opera/8.18.(Windows NT 5.0; sd-IN) Presto/2.9.173 Version/10.00"\n[111360] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=111360\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 53.130.68.90:9092 could not be established. Broker may not be available.\n[4355917] Problem reaching database. Timeout http request GET https://ibm.box.com/s/cebac041f9fd80ea\nError occurred while calling aws lambda system- endpoint : https://6246fd35a7.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 314,
          name: 'Brandon Roberts',
          patternsSample:
            '157.161.251.126 -- [ 22/Mar/2025:09:38:40 +0000 ] "GET /bundle/66a5f3357f8a63cf.js HTTP/1.1" 500 "http://www.brady.com/" "Opera/8.97.(X11; Linux i686; dz-BT) Presto/2.9.171 Version/10.00"\n[284926] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=284926\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 137.125.189.102:9092 could not be established. Broker may not be available.\n[8761513] Problem reaching database. Timeout http request GET https://ibm.box.com/s/92454f95101812f7\nError occurred while calling aws lambda system- endpoint : https://4148ced519.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 315,
          name: 'David Green',
          patternsSample:
            '207.89.14.6 -- [ 09/Jan/2025:13:54:53 +0000 ] "GET /bundle/5257c7b418193987.js HTTP/1.1" 504 "http://moses.com/tag/register/" "Mozilla/5.0 (Linux; Android 4.0.1) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/30.0.891.0 Safari/533.2"\n[416135] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=416135\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 19.121.57.152:9092 could not be established. Broker may not be available.\n[5245059] Problem reaching database. Timeout http request GET https://ibm.box.com/s/462cb804887518d7\nError occurred while calling aws lambda system- endpoint : https://390bbf25dd.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 316,
          name: 'Matthew Gilbert',
          patternsSample:
            '141.25.235.206 -- [ 29/Mar/2025:06:44:22 +0000 ] "GET /bundle/d4d4be8e630dc25f.js HTTP/1.1" 500 "http://www.jones.biz/category/terms.htm" "Mozilla/5.0 (Linux; Android 3.1) AppleWebKit/532.1 (KHTML, like Gecko) Chrome/36.0.889.0 Safari/532.1"\n[483462] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=483462\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 60.67.74.33:9092 could not be established. Broker may not be available.\n[8108991] Problem reaching database. Timeout http request GET https://ibm.box.com/s/888b60b9103cfdaf\nError occurred while calling aws lambda system- endpoint : https://e370096dcc.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 317,
          name: 'Julie Harrison',
          patternsSample:
            '104.28.5.161 -- [ 26/Feb/2025:03:18:03 +0000 ] "GET /bundle/91ef6ead297a9fc6.js HTTP/1.1" 403 "https://morris-fisher.net/app/app/list/terms.html" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3 like Mac OS X; tg-TJ) AppleWebKit/533.13.3 (KHTML, like Gecko) Version/4.0.5 Mobile/8B119 Safari/6533.13.3"\n[672168] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=672168\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 77.241.203.155:9092 could not be established. Broker may not be available.\n[6551689] Problem reaching database. Timeout http request GET https://ibm.box.com/s/90c3d597b0723c7b\nError occurred while calling aws lambda system- endpoint : https://9783bdc8e9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 318,
          name: 'Alan Green',
          patternsSample:
            '28.238.49.28 -- [ 10/Mar/2025:16:30:16 +0000 ] "GET /bundle/dd6382eaee544eaa.js HTTP/1.1" 200 "http://www.bean.biz/author/" "Mozilla/5.0 (Windows; U; Windows NT 5.01) AppleWebKit/532.10.1 (KHTML, like Gecko) Version/4.1 Safari/532.10.1"\n[283888] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=283888\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 175.145.105.79:9092 could not be established. Broker may not be available.\n[3683348] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f465571188db1873\nError occurred while calling aws lambda system- endpoint : https://89a9d9c427.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 319,
          name: 'Mrs. Angela Clay PhD',
          patternsSample:
            '17.14.170.167 -- [ 10/May/2025:21:30:01 +0000 ] "GET /bundle/f117e52f96a822d9.js HTTP/1.1" 504 "http://www.duncan.com/home/" "Mozilla/5.0 (iPad; CPU iPad OS 9_3_5 like Mac OS X) AppleWebKit/536.2 (KHTML, like Gecko) CriOS/19.0.872.0 Mobile/36D391 Safari/536.2"\n[919564] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=919564\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 3.244.12.235:9092 could not be established. Broker may not be available.\n[8470240] Problem reaching database. Timeout http request GET https://ibm.box.com/s/8f8d4a9d562907eb\nError occurred while calling aws lambda system- endpoint : https://9c054f80bf.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 320,
          name: 'Jose Montoya',
          patternsSample:
            '85.237.11.89 -- [ 16/Apr/2025:22:55:07 +0000 ] "GET /bundle/747eea628816c2e4.js HTTP/1.1" 200 "https://www.reed-thomas.com/list/faq/" "Opera/9.15.(Windows CE; eu-FR) Presto/2.9.167 Version/11.00"\n[963068] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=963068\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 206.76.167.67:9092 could not be established. Broker may not be available.\n[2211572] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c56fc15fab48abba\nError occurred while calling aws lambda system- endpoint : https://b1beb4e457.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 321,
          name: 'Ashley Morris',
          patternsSample:
            '84.45.158.209 -- [ 18/Feb/2025:06:36:34 +0000 ] "GET /bundle/d2af6f1d72c6e722.js HTTP/1.1" 500 "https://www.chang.biz/explore/index/" "Mozilla/5.0 (Android 4.0.4; Mobile; rv:61.0) Gecko/61.0 Firefox/61.0"\n[395242] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=395242\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 95.77.73.101:9092 could not be established. Broker may not be available.\n[7754433] Problem reaching database. Timeout http request GET https://ibm.box.com/s/79bee19d3ed6f800\nError occurred while calling aws lambda system- endpoint : https://d105524d84.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 322,
          name: 'Jessica Chen',
          patternsSample:
            '71.79.240.109 -- [ 17/May/2025:04:25:49 +0000 ] "GET /bundle/a317d7deddebb7cb.js HTTP/1.1" 504 "https://smith.org/explore/list/app/category.jsp" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_1 like Mac OS X; tk-TM) AppleWebKit/534.30.4 (KHTML, like Gecko) Version/3.0.5 Mobile/8B113 Safari/6534.30.4"\n[451967] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=451967\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 205.86.210.10:9092 could not be established. Broker may not be available.\n[1586286] Problem reaching database. Timeout http request GET https://ibm.box.com/s/1c495cb802fb10ae\nError occurred while calling aws lambda system- endpoint : https://399a7a0751.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 323,
          name: 'Dana Roy',
          patternsSample:
            '171.129.46.60 -- [ 12/Mar/2025:14:16:54 +0000 ] "GET /bundle/5faef8afba443691.js HTTP/1.1" 200 "https://www.george.com/" "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/535.0 (KHTML, like Gecko) FxiOS/11.0q1753.0 Mobile/91S881 Safari/535.0"\n[853211] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=853211\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 124.178.182.177:9092 could not be established. Broker may not be available.\n[7785354] Problem reaching database. Timeout http request GET https://ibm.box.com/s/1382300bda3dd189\nError occurred while calling aws lambda system- endpoint : https://50333ecf8c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 324,
          name: 'Cynthia Bailey',
          patternsSample:
            '168.134.253.80 -- [ 30/Apr/2025:07:39:00 +0000 ] "GET /bundle/33d7053afe5c702e.js HTTP/1.1" 403 "http://www.avila-smith.com/category/" "Mozilla/5.0 (X11; Linux i686) AppleWebKit/531.1 (KHTML, like Gecko) Chrome/23.0.864.0 Safari/531.1"\n[367492] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=367492\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 7.108.235.149:9092 could not be established. Broker may not be available.\n[8066613] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4aa814ebb002a9cc\nError occurred while calling aws lambda system- endpoint : https://ddd807c857.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 325,
          name: 'Matthew Abbott',
          patternsSample:
            '104.43.123.94 -- [ 10/Jan/2025:13:59:18 +0000 ] "GET /bundle/676f65a1a8d68fda.js HTTP/1.1" 504 "http://davis.biz/posts/home.html" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_6_7 rv:4.0; hak-TW) AppleWebKit/532.20.4 (KHTML, like Gecko) Version/5.0.4 Safari/532.20.4"\n[462070] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=462070\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 175.5.57.225:9092 could not be established. Broker may not be available.\n[3550154] Problem reaching database. Timeout http request GET https://ibm.box.com/s/8424f5bea7122d8e\nError occurred while calling aws lambda system- endpoint : https://e3ea1064f7.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 326,
          name: 'Matthew Clay',
          patternsSample:
            '222.108.135.99 -- [ 28/Mar/2025:14:51:18 +0000 ] "GET /bundle/adb214238a4aac12.js HTTP/1.1" 200 "http://novak-cunningham.com/list/tags/explore/home/" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_10_0) AppleWebKit/532.2 (KHTML, like Gecko) Chrome/63.0.804.0 Safari/532.2"\n[778729] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=778729\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 101.119.190.7:9092 could not be established. Broker may not be available.\n[5988123] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e592950a6ab3e374\nError occurred while calling aws lambda system- endpoint : https://8b466bb8c3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 327,
          name: 'Jack Garcia',
          patternsSample:
            '214.228.14.231 -- [ 25/Mar/2025:00:07:56 +0000 ] "GET /bundle/efff8cd867230b54.js HTTP/1.1" 500 "http://www.harris.info/login.asp" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_9 rv:3.0; fi-FI) AppleWebKit/533.33.7 (KHTML, like Gecko) Version/5.0.5 Safari/533.33.7"\n[115757] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=115757\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 175.57.63.79:9092 could not be established. Broker may not be available.\n[7600984] Problem reaching database. Timeout http request GET https://ibm.box.com/s/835d705f085e00b5\nError occurred while calling aws lambda system- endpoint : https://6a424908e3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 328,
          name: 'Troy Harper',
          patternsSample:
            '45.74.207.121 -- [ 13/Feb/2025:10:20:34 +0000 ] "GET /bundle/ce95bb54818a9997.js HTTP/1.1" 504 "http://www.moran.info/register/" "Mozilla/5.0 (compatible; MSIE 5.0; Windows NT 6.2; Trident/5.1)"\n[173894] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=173894\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 57.148.53.130:9092 could not be established. Broker may not be available.\n[3939896] Problem reaching database. Timeout http request GET https://ibm.box.com/s/6f26003ee929b105\nError occurred while calling aws lambda system- endpoint : https://ffe522c5e1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 329,
          name: 'Bonnie Barrett',
          patternsSample:
            '105.104.216.19 -- [ 30/Mar/2025:05:28:40 +0000 ] "GET /bundle/36c0a1f666e0bf8a.js HTTP/1.1" 200 "https://fleming.com/" "Opera/8.65.(X11; Linux x86_64; quz-PE) Presto/2.9.174 Version/11.00"\n[642940] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=642940\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 134.159.75.73:9092 could not be established. Broker may not be available.\n[1159864] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4d8618a735913d5c\nError occurred while calling aws lambda system- endpoint : https://5b85165fde.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 330,
          name: 'Michael Sanford',
          patternsSample:
            '199.227.153.49 -- [ 23/Apr/2025:00:25:36 +0000 ] "GET /bundle/13a71c95c7df1a0a.js HTTP/1.1" 504 "http://www.peterson-freeman.info/" "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_4 like Mac OS X) AppleWebKit/533.2 (KHTML, like Gecko) CriOS/30.0.863.0 Mobile/56Z429 Safari/533.2"\n[986360] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=986360\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 106.248.135.23:9092 could not be established. Broker may not be available.\n[7248483] Problem reaching database. Timeout http request GET https://ibm.box.com/s/974fd969ccd0b6a7\nError occurred while calling aws lambda system- endpoint : https://0732306eab.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 331,
          name: 'Cheryl Harris',
          patternsSample:
            '198.40.80.205 -- [ 21/May/2025:16:14:33 +0000 ] "GET /bundle/c7225fceb622ff51.js HTTP/1.1" 403 "https://phillips.com/homepage/" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_8_8 rv:3.0; ta-LK) AppleWebKit/533.14.7 (KHTML, like Gecko) Version/5.0 Safari/533.14.7"\n[489427] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=489427\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 178.203.175.204:9092 could not be established. Broker may not be available.\n[4634945] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5a4a56c1d30ea4eb\nError occurred while calling aws lambda system- endpoint : https://9da85a33d2.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 332,
          name: 'Matthew Lee',
          patternsSample:
            '79.39.164.234 -- [ 11/Feb/2025:20:08:49 +0000 ] "GET /bundle/a5e2d6faa81d135b.js HTTP/1.1" 500 "http://www.robinson-waters.com/" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_10_6) AppleWebKit/534.2 (KHTML, like Gecko) Chrome/28.0.847.0 Safari/534.2"\n[519626] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=519626\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 202.117.182.124:9092 could not be established. Broker may not be available.\n[1380161] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b967ff42ed014d9c\nError occurred while calling aws lambda system- endpoint : https://87c04ab870.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 333,
          name: 'Scott Swanson',
          patternsSample:
            '132.28.107.33 -- [ 01/Apr/2025:05:13:11 +0000 ] "GET /bundle/d2de10a82871840d.js HTTP/1.1" 500 "https://www.lucas.info/about/" "Mozilla/5.0 (iPad; CPU iPad OS 14_2 like Mac OS X) AppleWebKit/535.0 (KHTML, like Gecko) FxiOS/14.6q3698.0 Mobile/25Y209 Safari/535.0"\n[340500] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=340500\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 33.18.10.10:9092 could not be established. Broker may not be available.\n[2468995] Problem reaching database. Timeout http request GET https://ibm.box.com/s/a1d2fb65c1e7b0cb\nError occurred while calling aws lambda system- endpoint : https://94317c91e3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 334,
          name: 'Nicole Kelly',
          patternsSample:
            '131.212.211.30 -- [ 10/Feb/2025:11:49:59 +0000 ] "GET /bundle/d3c41092014cd470.js HTTP/1.1" 500 "http://ashley.net/category/explore/login/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows 95; Trident/5.1)"\n[602083] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=602083\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 53.16.202.15:9092 could not be established. Broker may not be available.\n[1237460] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ac9c11a2895cc125\nError occurred while calling aws lambda system- endpoint : https://60b035531e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 335,
          name: 'Craig Barton',
          patternsSample:
            '5.173.167.104 -- [ 02/Apr/2025:10:45:33 +0000 ] "GET /bundle/0b8d1a0e958a09c1.js HTTP/1.1" 403 "http://www.carpenter.net/tag/explore/list/index.html" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 5.01; Trident/5.1)"\n[743013] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=743013\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 111.24.12.139:9092 could not be established. Broker may not be available.\n[3229382] Problem reaching database. Timeout http request GET https://ibm.box.com/s/03daeb89d9b84386\nError occurred while calling aws lambda system- endpoint : https://2b19144833.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 336,
          name: 'Jackson Williams',
          patternsSample:
            '68.226.249.17 -- [ 07/May/2025:05:58:47 +0000 ] "GET /bundle/4342bd3a938b98cf.js HTTP/1.1" 504 "http://butler.com/" "Mozilla/5.0 (iPhone; CPU iPhone OS 4_2_1 like Mac OS X) AppleWebKit/532.1 (KHTML, like Gecko) FxiOS/12.9e1832.0 Mobile/96X117 Safari/532.1"\n[154701] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=154701\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 186.90.166.191:9092 could not be established. Broker may not be available.\n[6930574] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ba3b9a738d7ed30b\nError occurred while calling aws lambda system- endpoint : https://e37bea5231.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 337,
          name: 'Diane Craig',
          patternsSample:
            '141.101.103.239 -- [ 11/Mar/2025:11:18:58 +0000 ] "GET /bundle/e5037a808adc6ca9.js HTTP/1.1" 200 "http://richards.com/terms.htm" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_5_2 rv:3.0; hne-IN) AppleWebKit/531.44.1 (KHTML, like Gecko) Version/5.0 Safari/531.44.1"\n[971551] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=971551\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 63.194.49.91:9092 could not be established. Broker may not be available.\n[4752806] Problem reaching database. Timeout http request GET https://ibm.box.com/s/a4e9fb3a97712002\nError occurred while calling aws lambda system- endpoint : https://19f975828a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 338,
          name: 'Monica Strickland',
          patternsSample:
            '149.147.32.58 -- [ 04/Feb/2025:18:37:54 +0000 ] "GET /bundle/238115ad09bf8098.js HTTP/1.1" 403 "https://chandler-holland.info/" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_7_7 rv:2.0; ce-RU) AppleWebKit/533.25.6 (KHTML, like Gecko) Version/4.1 Safari/533.25.6"\n[267893] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=267893\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 100.138.62.149:9092 could not be established. Broker may not be available.\n[8496874] Problem reaching database. Timeout http request GET https://ibm.box.com/s/71dd2c12be2feadb\nError occurred while calling aws lambda system- endpoint : https://89a0bcf30e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 339,
          name: 'Judith Mejia',
          patternsSample:
            '8.104.228.39 -- [ 13/Jan/2025:13:32:46 +0000 ] "GET /bundle/ce04635f37c65bf8.js HTTP/1.1" 504 "https://murray.com/search/about.jsp" "Mozilla/5.0 (Windows; U; Windows NT 10.0) AppleWebKit/531.2.7 (KHTML, like Gecko) Version/5.1 Safari/531.2.7"\n[862475] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=862475\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 40.224.179.243:9092 could not be established. Broker may not be available.\n[4257435] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b2bbdb9c1f803e87\nError occurred while calling aws lambda system- endpoint : https://f64d0b2cf7.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 340,
          name: 'James Watkins',
          patternsSample:
            '34.38.91.240 -- [ 15/Feb/2025:05:59:23 +0000 ] "GET /bundle/3619b5dc92150f6c.js HTTP/1.1" 500 "http://www.hernandez.com/homepage/" "Mozilla/5.0 (compatible; MSIE 7.0; Windows CE; Trident/3.0)"\n[874438] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=874438\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 133.60.137.170:9092 could not be established. Broker may not be available.\n[2977093] Problem reaching database. Timeout http request GET https://ibm.box.com/s/32f13b2f052a322a\nError occurred while calling aws lambda system- endpoint : https://c24c9c70c4.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 341,
          name: 'Anthony Thomas',
          patternsSample:
            '101.179.4.216 -- [ 04/Jan/2025:17:13:49 +0000 ] "GET /bundle/84c68e7a423810de.js HTTP/1.1" 403 "https://goodwin.com/terms/" "Mozilla/5.0 (Windows; U; Windows CE) AppleWebKit/533.19.6 (KHTML, like Gecko) Version/4.0.5 Safari/533.19.6"\n[920351] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=920351\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 175.8.2.31:9092 could not be established. Broker may not be available.\n[9190320] Problem reaching database. Timeout http request GET https://ibm.box.com/s/46bea44d4b0a8b16\nError occurred while calling aws lambda system- endpoint : https://fa0b49c0c9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 342,
          name: 'Laura Burton',
          patternsSample:
            '78.173.221.167 -- [ 02/Apr/2025:08:24:31 +0000 ] "GET /bundle/52fa2686d8f942fc.js HTTP/1.1" 200 "https://www.santos.net/index/" "Mozilla/5.0 (Windows; U; Windows CE) AppleWebKit/531.38.3 (KHTML, like Gecko) Version/4.0 Safari/531.38.3"\n[740061] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=740061\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 108.83.136.65:9092 could not be established. Broker may not be available.\n[4814070] Problem reaching database. Timeout http request GET https://ibm.box.com/s/8448495492ccee41\nError occurred while calling aws lambda system- endpoint : https://8889dc536a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 343,
          name: 'Michael Fischer',
          patternsSample:
            '105.14.89.151 -- [ 04/Feb/2025:16:55:15 +0000 ] "GET /bundle/8335a26d13a938fd.js HTTP/1.1" 504 "https://nguyen-white.com/" "Opera/8.98.(X11; Linux i686; lo-LA) Presto/2.9.181 Version/12.00"\n[485232] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=485232\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 158.155.45.62:9092 could not be established. Broker may not be available.\n[5652959] Problem reaching database. Timeout http request GET https://ibm.box.com/s/39acc8e7adf654e6\nError occurred while calling aws lambda system- endpoint : https://7ecd69952e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 344,
          name: 'Anne Brown',
          patternsSample:
            '167.83.87.216 -- [ 26/Feb/2025:09:02:30 +0000 ] "GET /bundle/68bfc947e542c987.js HTTP/1.1" 200 "https://www.estrada.com/login/" "Mozilla/5.0 (compatible; MSIE 7.0; Windows 95; Trident/3.1)"\n[106656] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=106656\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 147.141.92.170:9092 could not be established. Broker may not be available.\n[4723760] Problem reaching database. Timeout http request GET https://ibm.box.com/s/a99cf4b331c57722\nError occurred while calling aws lambda system- endpoint : https://6687f0f7eb.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 345,
          name: 'Nicole Gutierrez',
          patternsSample:
            '47.193.114.32 -- [ 27/Mar/2025:04:52:38 +0000 ] "GET /bundle/11d3d50f519c8978.js HTTP/1.1" 403 "https://glover.biz/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3 like Mac OS X; ln-CD) AppleWebKit/533.23.3 (KHTML, like Gecko) Version/3.0.5 Mobile/8B111 Safari/6533.23.3"\n[506567] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=506567\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 124.134.223.57:9092 could not be established. Broker may not be available.\n[6589850] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d2f179890fdb3a65\nError occurred while calling aws lambda system- endpoint : https://0b0776d477.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 346,
          name: 'Megan Wood',
          patternsSample:
            '160.31.235.217 -- [ 16/Feb/2025:01:53:56 +0000 ] "GET /bundle/486ef4f0a774de4a.js HTTP/1.1" 200 "https://www.arnold.com/main/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; Trident/3.1)"\n[651281] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=651281\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 193.143.5.7:9092 could not be established. Broker may not be available.\n[7399225] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0cbe8bb3c71189c1\nError occurred while calling aws lambda system- endpoint : https://88fa31da5a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 347,
          name: 'Zachary Carey',
          patternsSample:
            '57.221.185.179 -- [ 22/May/2025:09:33:24 +0000 ] "GET /bundle/6e089a85d74edd2a.js HTTP/1.1" 504 "https://www.green.com/" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_11_6 rv:4.0; bg-BG) AppleWebKit/532.5.7 (KHTML, like Gecko) Version/5.0 Safari/532.5.7"\n[696151] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=696151\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 180.245.96.97:9092 could not be established. Broker may not be available.\n[8425843] Problem reaching database. Timeout http request GET https://ibm.box.com/s/bd1d481f3c8d8c13\nError occurred while calling aws lambda system- endpoint : https://601d284ed9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 348,
          name: 'Linda Walker',
          patternsSample:
            '29.130.10.220 -- [ 08/May/2025:05:40:04 +0000 ] "GET /bundle/a725a3b0d9aed91c.js HTTP/1.1" 504 "https://marshall-robinson.com/post.html" "Opera/9.84.(X11; Linux x86_64; unm-US) Presto/2.9.164 Version/12.00"\n[653346] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=653346\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 92.122.168.62:9092 could not be established. Broker may not be available.\n[3962734] Problem reaching database. Timeout http request GET https://ibm.box.com/s/aab2d8076a0e4d1f\nError occurred while calling aws lambda system- endpoint : https://8e0e096e15.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 349,
          name: 'Carly West',
          patternsSample:
            '43.217.121.9 -- [ 04/May/2025:12:42:14 +0000 ] "GET /bundle/1c9093b73ee8bce1.js HTTP/1.1" 403 "http://smith-morgan.biz/index/" "Opera/9.17.(X11; Linux x86_64; mt-MT) Presto/2.9.188 Version/12.00"\n[713321] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=713321\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 121.54.238.118:9092 could not be established. Broker may not be available.\n[9446457] Problem reaching database. Timeout http request GET https://ibm.box.com/s/6b2f2e7f2746cb23\nError occurred while calling aws lambda system- endpoint : https://bae67419fe.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 350,
          name: 'William Rodriguez',
          patternsSample:
            '186.49.221.156 -- [ 18/May/2025:18:18:23 +0000 ] "GET /bundle/7e6ccc1d56ffa1cf.js HTTP/1.1" 500 "https://www.wade.com/posts/faq/" "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_4 like Mac OS X) AppleWebKit/531.0 (KHTML, like Gecko) FxiOS/11.2u6944.0 Mobile/61M964 Safari/531.0"\n[221305] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=221305\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 111.246.153.75:9092 could not be established. Broker may not be available.\n[5374630] Problem reaching database. Timeout http request GET https://ibm.box.com/s/bf76874ed74f0753\nError occurred while calling aws lambda system- endpoint : https://9e2bcb56c0.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 351,
          name: 'Ashley Blanchard',
          patternsSample:
            '123.62.110.46 -- [ 31/Mar/2025:10:24:35 +0000 ] "GET /bundle/e62c9ba21e52341e.js HTTP/1.1" 403 "http://www.robinson.info/register/" "Mozilla/5.0 (Windows; U; Windows NT 6.1) AppleWebKit/531.33.5 (KHTML, like Gecko) Version/4.0 Safari/531.33.5"\n[770865] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=770865\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 101.193.127.182:9092 could not be established. Broker may not be available.\n[3050767] Problem reaching database. Timeout http request GET https://ibm.box.com/s/7e1ca379b7320737\nError occurred while calling aws lambda system- endpoint : https://509f19dd02.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 352,
          name: 'Cassie Pace',
          patternsSample:
            '4.44.76.167 -- [ 03/Feb/2025:16:03:49 +0000 ] "GET /bundle/d4082103305dd889.js HTTP/1.1" 403 "https://www.decker.com/tag/tag/explore/category/" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_12_7; rv:1.9.6.20) Gecko/2016-04-29 22:42:16 Firefox/3.6.19"\n[648890] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=648890\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 84.101.127.136:9092 could not be established. Broker may not be available.\n[9613632] Problem reaching database. Timeout http request GET https://ibm.box.com/s/1aad5564893b571d\nError occurred while calling aws lambda system- endpoint : https://0ee1a43867.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 353,
          name: 'Eric Glover',
          patternsSample:
            '55.10.149.198 -- [ 21/Feb/2025:19:03:37 +0000 ] "GET /bundle/4ea81261a5b2201f.js HTTP/1.1" 504 "https://www.cunningham.com/main/home.html" "Opera/8.51.(Windows 98; ce-RU) Presto/2.9.176 Version/10.00"\n[699532] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=699532\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 118.142.183.143:9092 could not be established. Broker may not be available.\n[4271978] Problem reaching database. Timeout http request GET https://ibm.box.com/s/363811ca45a6ce19\nError occurred while calling aws lambda system- endpoint : https://e21e1bff17.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 354,
          name: 'Austin Kelly',
          patternsSample:
            '165.253.46.142 -- [ 26/Feb/2025:03:28:16 +0000 ] "GET /bundle/a76fc02ce07f239d.js HTTP/1.1" 500 "http://garcia-cook.net/app/category/post.php" "Mozilla/5.0 (iPad; CPU iPad OS 5_1_1 like Mac OS X) AppleWebKit/535.2 (KHTML, like Gecko) CriOS/58.0.818.0 Mobile/46A117 Safari/535.2"\n[671825] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=671825\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 185.141.66.64:9092 could not be established. Broker may not be available.\n[1689071] Problem reaching database. Timeout http request GET https://ibm.box.com/s/a27a10625525e330\nError occurred while calling aws lambda system- endpoint : https://6ae19b92cd.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 355,
          name: 'John Proctor',
          patternsSample:
            '181.171.64.249 -- [ 20/Jan/2025:01:03:12 +0000 ] "GET /bundle/74b1cfb1d210c61c.js HTTP/1.1" 403 "http://www.harper-key.com/search/index.html" "Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 5.1; Trident/5.0)"\n[531823] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=531823\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 39.255.223.196:9092 could not be established. Broker may not be available.\n[9425406] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5b647d389a583071\nError occurred while calling aws lambda system- endpoint : https://d1e9f1bd7e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 356,
          name: 'Kevin Stevens',
          patternsSample:
            '3.242.95.131 -- [ 09/Mar/2025:19:42:02 +0000 ] "GET /bundle/59555143239bf156.js HTTP/1.1" 504 "http://williams.biz/main.asp" "Opera/8.77.(Windows NT 10.0; zu-ZA) Presto/2.9.164 Version/12.00"\n[416527] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=416527\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 94.193.197.196:9092 could not be established. Broker may not be available.\n[9470582] Problem reaching database. Timeout http request GET https://ibm.box.com/s/82e833dbbab8c7f9\nError occurred while calling aws lambda system- endpoint : https://cce68a8709.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 357,
          name: 'Valerie Terry',
          patternsSample:
            '28.24.75.191 -- [ 07/Apr/2025:06:21:50 +0000 ] "GET /bundle/7fe336f888561fd2.js HTTP/1.1" 504 "http://www.hughes-mayo.org/posts/faq.php" "Mozilla/5.0 (iPhone; CPU iPhone OS 3_1_3 like Mac OS X) AppleWebKit/536.0 (KHTML, like Gecko) CriOS/20.0.835.0 Mobile/30H069 Safari/536.0"\n[321141] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=321141\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 6.148.131.6:9092 could not be established. Broker may not be available.\n[2018238] Problem reaching database. Timeout http request GET https://ibm.box.com/s/214bd9ccf21d77b4\nError occurred while calling aws lambda system- endpoint : https://4bb744944d.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 358,
          name: 'David Scott',
          patternsSample:
            '203.128.179.18 -- [ 12/Mar/2025:01:41:05 +0000 ] "GET /bundle/4a9e805429fb07db.js HTTP/1.1" 500 "http://www.greene.com/homepage.php" "Mozilla/5.0 (iPad; CPU iPad OS 6_1_6 like Mac OS X) AppleWebKit/536.0 (KHTML, like Gecko) CriOS/56.0.853.0 Mobile/10O816 Safari/536.0"\n[787769] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=787769\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 168.59.5.167:9092 could not be established. Broker may not be available.\n[6030211] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0e8cadd9712ff45a\nError occurred while calling aws lambda system- endpoint : https://cf0f75fb6d.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 359,
          name: 'Jennifer Perez',
          patternsSample:
            '144.193.248.124 -- [ 13/Apr/2025:02:10:34 +0000 ] "GET /bundle/c3b5fcf42e192de9.js HTTP/1.1" 504 "http://ward.com/category.htm" "Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 10.0; Trident/4.1)"\n[366610] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=366610\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 7.49.200.158:9092 could not be established. Broker may not be available.\n[9431474] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d164760c53bf3a5c\nError occurred while calling aws lambda system- endpoint : https://c5f67c984d.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 360,
          name: 'Steven Evans',
          patternsSample:
            '108.8.6.180 -- [ 17/May/2025:06:18:14 +0000 ] "GET /bundle/5ca5948d776c0a5a.js HTTP/1.1" 403 "https://www.gardner-mclean.org/category/search/" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_7_8) AppleWebKit/536.2 (KHTML, like Gecko) Chrome/22.0.864.0 Safari/536.2"\n[909652] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=909652\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 24.0.42.58:9092 could not be established. Broker may not be available.\n[4696657] Problem reaching database. Timeout http request GET https://ibm.box.com/s/6b473ada32238bb1\nError occurred while calling aws lambda system- endpoint : https://61633323ee.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 361,
          name: 'Jordan Roman',
          patternsSample:
            '48.69.223.113 -- [ 15/Mar/2025:00:53:10 +0000 ] "GET /bundle/5e5ef19628c37e02.js HTTP/1.1" 504 "https://lyons.biz/login/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/531.0 (KHTML, like Gecko) Chrome/25.0.812.0 Safari/531.0"\n[242119] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=242119\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 203.5.128.19:9092 could not be established. Broker may not be available.\n[3341712] Problem reaching database. Timeout http request GET https://ibm.box.com/s/7246d897e132494f\nError occurred while calling aws lambda system- endpoint : https://bda6c4c245.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 362,
          name: 'Crystal Austin',
          patternsSample:
            '129.58.49.119 -- [ 19/Mar/2025:15:42:30 +0000 ] "GET /bundle/ec3a72f74088e7a6.js HTTP/1.1" 200 "https://garcia.com/terms.jsp" "Opera/9.98.(X11; Linux i686; ur-PK) Presto/2.9.184 Version/12.00"\n[908806] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=908806\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 6.207.195.144:9092 could not be established. Broker may not be available.\n[5110570] Problem reaching database. Timeout http request GET https://ibm.box.com/s/2c980ba160bbdca5\nError occurred while calling aws lambda system- endpoint : https://5adcd28eea.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 363,
          name: 'Matthew Elliott',
          patternsSample:
            '178.138.84.89 -- [ 08/Jan/2025:18:38:47 +0000 ] "GET /bundle/c7e7c9bca553da44.js HTTP/1.1" 500 "https://mueller.biz/tag/index/" "Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_6 like Mac OS X) AppleWebKit/534.0 (KHTML, like Gecko) FxiOS/18.2h0489.0 Mobile/82R943 Safari/534.0"\n[901918] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=901918\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 191.125.48.178:9092 could not be established. Broker may not be available.\n[6485101] Problem reaching database. Timeout http request GET https://ibm.box.com/s/1733d414ebac43f1\nError occurred while calling aws lambda system- endpoint : https://e2ebb11eb6.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 364,
          name: 'William Mitchell',
          patternsSample:
            '177.156.87.54 -- [ 24/Feb/2025:13:21:12 +0000 ] "GET /bundle/d1659bfb7de52b15.js HTTP/1.1" 504 "https://webb-garcia.com/faq.php" "Mozilla/5.0 (Windows; U; Windows NT 5.01) AppleWebKit/534.48.7 (KHTML, like Gecko) Version/5.0.2 Safari/534.48.7"\n[265834] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=265834\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 115.114.180.129:9092 could not be established. Broker may not be available.\n[6514892] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c5c556637db644ce\nError occurred while calling aws lambda system- endpoint : https://fb4f700f85.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 365,
          name: 'Todd Parrish',
          patternsSample:
            '58.232.147.193 -- [ 16/May/2025:19:48:39 +0000 ] "GET /bundle/a5ac633219968a87.js HTTP/1.1" 504 "http://bennett.com/posts/blog/homepage/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3 like Mac OS X; os-RU) AppleWebKit/532.15.1 (KHTML, like Gecko) Version/4.0.5 Mobile/8B112 Safari/6532.15.1"\n[758567] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=758567\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 186.129.198.220:9092 could not be established. Broker may not be available.\n[9525128] Problem reaching database. Timeout http request GET https://ibm.box.com/s/641b534277428d09\nError occurred while calling aws lambda system- endpoint : https://34d2f931fb.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 366,
          name: 'Samantha Lam',
          patternsSample:
            '73.179.27.11 -- [ 09/Jan/2025:06:18:17 +0000 ] "GET /bundle/0f1b8d7de815a4c5.js HTTP/1.1" 504 "http://rivers-myers.com/tags/list/login/" "Opera/8.72.(Windows NT 4.0; hsb-DE) Presto/2.9.167 Version/10.00"\n[926552] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=926552\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 146.134.216.164:9092 could not be established. Broker may not be available.\n[1247795] Problem reaching database. Timeout http request GET https://ibm.box.com/s/51f32a4a5707c2bb\nError occurred while calling aws lambda system- endpoint : https://5692acb184.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 367,
          name: 'Rebecca Gonzalez',
          patternsSample:
            '22.146.8.9 -- [ 14/Apr/2025:08:09:51 +0000 ] "GET /bundle/6bca19333950010f.js HTTP/1.1" 504 "https://duffy.org/blog/tag/blog/faq.jsp" "Opera/9.69.(X11; Linux x86_64; gez-ET) Presto/2.9.185 Version/11.00"\n[717380] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=717380\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 150.20.204.57:9092 could not be established. Broker may not be available.\n[1898489] Problem reaching database. Timeout http request GET https://ibm.box.com/s/67aed546c3198964\nError occurred while calling aws lambda system- endpoint : https://93590faac8.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 368,
          name: 'Jessica Shaw',
          patternsSample:
            '156.144.186.211 -- [ 23/Apr/2025:12:37:37 +0000 ] "GET /bundle/89d7da518c09fe38.js HTTP/1.1" 504 "https://smith.net/list/posts/privacy.html" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0; rv:1.9.5.20) Gecko/2021-03-14 01:12:54 Firefox/3.6.18"\n[500054] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=500054\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 22.185.15.209:9092 could not be established. Broker may not be available.\n[3385695] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d65dff33617aec10\nError occurred while calling aws lambda system- endpoint : https://a5f87c9259.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 369,
          name: 'Michael Burch',
          patternsSample:
            '195.175.135.86 -- [ 04/May/2025:19:49:13 +0000 ] "GET /bundle/20f29db338c4aad2.js HTTP/1.1" 504 "https://chambers-bray.info/register.html" "Opera/9.86.(Windows NT 4.0; zu-ZA) Presto/2.9.178 Version/10.00"\n[887171] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=887171\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 71.77.231.78:9092 could not be established. Broker may not be available.\n[3727231] Problem reaching database. Timeout http request GET https://ibm.box.com/s/664e63af79678be9\nError occurred while calling aws lambda system- endpoint : https://111d4dfcef.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 370,
          name: 'Jeremiah Lewis',
          patternsSample:
            '146.109.33.250 -- [ 03/Apr/2025:23:59:37 +0000 ] "GET /bundle/ebe75f1b27fff3a7.js HTTP/1.1" 504 "http://www.hernandez-martin.com/categories/author.htm" "Mozilla/5.0 (Windows 98; Win 9x 4.90) AppleWebKit/531.0 (KHTML, like Gecko) Chrome/31.0.803.0 Safari/531.0"\n[195425] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=195425\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 84.158.77.87:9092 could not be established. Broker may not be available.\n[3809684] Problem reaching database. Timeout http request GET https://ibm.box.com/s/751f6007483510cd\nError occurred while calling aws lambda system- endpoint : https://628e372ab6.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 371,
          name: 'Diane Williams',
          patternsSample:
            '3.44.125.101 -- [ 30/Mar/2025:17:47:56 +0000 ] "GET /bundle/19ec90f47537a22a.js HTTP/1.1" 200 "https://www.anderson.net/posts/tag/login.asp" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 5.1; Trident/3.1)"\n[138866] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=138866\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 36.155.37.227:9092 could not be established. Broker may not be available.\n[8533645] Problem reaching database. Timeout http request GET https://ibm.box.com/s/8ea13fffa72b78c4\nError occurred while calling aws lambda system- endpoint : https://212b383d36.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 372,
          name: 'William Garcia',
          patternsSample:
            '144.210.99.66 -- [ 21/Mar/2025:02:58:55 +0000 ] "GET /bundle/9c90a89c8d7d044a.js HTTP/1.1" 200 "http://jones.com/main/explore/post/" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_11_1 rv:3.0; as-IN) AppleWebKit/535.50.1 (KHTML, like Gecko) Version/5.0 Safari/535.50.1"\n[486923] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=486923\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 4.78.206.63:9092 could not be established. Broker may not be available.\n[3787166] Problem reaching database. Timeout http request GET https://ibm.box.com/s/9fd968f8ed7bd11d\nError occurred while calling aws lambda system- endpoint : https://cb3785bc12.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 373,
          name: 'Glenda Bean',
          patternsSample:
            '160.65.144.90 -- [ 05/May/2025:03:19:07 +0000 ] "GET /bundle/30a384edd06b7ef6.js HTTP/1.1" 500 "https://galvan.com/faq/" "Mozilla/5.0 (Windows 98; Win 9x 4.90) AppleWebKit/536.0 (KHTML, like Gecko) Chrome/32.0.829.0 Safari/536.0"\n[322007] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=322007\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 148.223.190.169:9092 could not be established. Broker may not be available.\n[5882306] Problem reaching database. Timeout http request GET https://ibm.box.com/s/fa640cdd40558421\nError occurred while calling aws lambda system- endpoint : https://85be9c1425.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 374,
          name: 'Joanna Lawrence',
          patternsSample:
            '130.235.111.212 -- [ 26/May/2025:11:37:40 +0000 ] "GET /bundle/c958af21ee55d07f.js HTTP/1.1" 504 "https://www.gill.com/" "Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 6.1; Trident/5.0)"\n[698279] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=698279\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 84.246.108.176:9092 could not be established. Broker may not be available.\n[1774538] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f48d260793150bcf\nError occurred while calling aws lambda system- endpoint : https://e639b43503.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 375,
          name: 'Benjamin Palmer',
          patternsSample:
            '62.21.197.68 -- [ 08/May/2025:23:00:05 +0000 ] "GET /bundle/ed5daaee643c669b.js HTTP/1.1" 200 "http://weaver-jackson.com/privacy/" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_12_9) AppleWebKit/532.0 (KHTML, like Gecko) Chrome/30.0.878.0 Safari/532.0"\n[657190] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=657190\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 25.222.200.76:9092 could not be established. Broker may not be available.\n[2862472] Problem reaching database. Timeout http request GET https://ibm.box.com/s/1f468b1d8c4eefca\nError occurred while calling aws lambda system- endpoint : https://e894a62bb3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 376,
          name: 'Dean Russell',
          patternsSample:
            '139.145.121.94 -- [ 06/May/2025:10:57:44 +0000 ] "GET /bundle/3a70c23d06232b57.js HTTP/1.1" 200 "http://owen.com/wp-content/privacy/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_1 like Mac OS X; am-ET) AppleWebKit/535.42.7 (KHTML, like Gecko) Version/4.0.5 Mobile/8B116 Safari/6535.42.7"\n[283300] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=283300\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 153.244.134.243:9092 could not be established. Broker may not be available.\n[2366133] Problem reaching database. Timeout http request GET https://ibm.box.com/s/1466ca00119e69e5\nError occurred while calling aws lambda system- endpoint : https://346c50b08b.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 377,
          name: 'Jennifer Hall',
          patternsSample:
            '40.59.95.82 -- [ 09/Apr/2025:21:08:51 +0000 ] "GET /bundle/72a86764c49ad2a8.js HTTP/1.1" 403 "http://johnson.info/blog/app/app/home.html" "Mozilla/5.0 (compatible; MSIE 8.0; Windows 95; Trident/5.1)"\n[148116] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=148116\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 97.102.19.207:9092 could not be established. Broker may not be available.\n[4775809] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e43369d3b5ac83d1\nError occurred while calling aws lambda system- endpoint : https://34b957b38d.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 378,
          name: 'Derek Cooper',
          patternsSample:
            '111.72.223.53 -- [ 24/Mar/2025:01:44:09 +0000 ] "GET /bundle/a6a623bc551c48f4.js HTTP/1.1" 403 "http://villarreal.com/about/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_3 like Mac OS X; kn-IN) AppleWebKit/534.25.3 (KHTML, like Gecko) Version/3.0.5 Mobile/8B111 Safari/6534.25.3"\n[598583] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=598583\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 42.44.16.100:9092 could not be established. Broker may not be available.\n[9704990] Problem reaching database. Timeout http request GET https://ibm.box.com/s/bafc93f27d4f287a\nError occurred while calling aws lambda system- endpoint : https://a20f32d35e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 379,
          name: 'Kathy Steele',
          patternsSample:
            '152.157.232.39 -- [ 24/Feb/2025:03:18:54 +0000 ] "GET /bundle/ef8e53bbd3f0eb4d.js HTTP/1.1" 500 "http://www.perry-delgado.com/home/" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_10_5 rv:3.0; ik-CA) AppleWebKit/535.44.2 (KHTML, like Gecko) Version/4.0.5 Safari/535.44.2"\n[239303] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=239303\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 36.32.120.209:9092 could not be established. Broker may not be available.\n[2341596] Problem reaching database. Timeout http request GET https://ibm.box.com/s/a5970734f1f5a2cc\nError occurred while calling aws lambda system- endpoint : https://5e7b3cc0df.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 380,
          name: 'Paige Perry',
          patternsSample:
            '13.17.104.136 -- [ 12/Feb/2025:11:19:35 +0000 ] "GET /bundle/fa1897b820e5a35b.js HTTP/1.1" 403 "http://holmes.net/list/about/" "Opera/9.89.(Windows NT 5.1; pt-BR) Presto/2.9.168 Version/11.00"\n[674923] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=674923\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 21.55.171.119:9092 could not be established. Broker may not be available.\n[1271543] Problem reaching database. Timeout http request GET https://ibm.box.com/s/3cd5d4c6b07e2ae1\nError occurred while calling aws lambda system- endpoint : https://303aa13a34.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 381,
          name: 'Fernando Campbell',
          patternsSample:
            '13.71.187.20 -- [ 02/Mar/2025:19:11:57 +0000 ] "GET /bundle/631d87af574c03b9.js HTTP/1.1" 500 "http://www.white-hill.com/author/" "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/535.2 (KHTML, like Gecko) FxiOS/12.7k3615.0 Mobile/76L737 Safari/535.2"\n[145937] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=145937\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 130.3.125.92:9092 could not be established. Broker may not be available.\n[7774178] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4ab37be560b724ae\nError occurred while calling aws lambda system- endpoint : https://ec335d1d9d.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 382,
          name: 'Nicole Farley',
          patternsSample:
            '185.95.125.201 -- [ 03/May/2025:15:31:57 +0000 ] "GET /bundle/efbf43f8a3eab7d1.js HTTP/1.1" 504 "http://www.collins.biz/main/categories/index.htm" "Opera/9.30.(Windows NT 6.0; ce-RU) Presto/2.9.168 Version/11.00"\n[642697] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=642697\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 162.90.248.86:9092 could not be established. Broker may not be available.\n[9582017] Problem reaching database. Timeout http request GET https://ibm.box.com/s/95c980eb2bd0a25e\nError occurred while calling aws lambda system- endpoint : https://6fa766dbad.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 383,
          name: 'Teresa Owens',
          patternsSample:
            '170.92.27.54 -- [ 22/Jan/2025:02:45:16 +0000 ] "GET /bundle/7c86fd383ef83eeb.js HTTP/1.1" 504 "https://www.walsh-arnold.com/search/category/about/" "Mozilla/5.0 (Windows 95) AppleWebKit/532.0 (KHTML, like Gecko) Chrome/15.0.898.0 Safari/532.0"\n[741436] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=741436\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 34.242.16.153:9092 could not be established. Broker may not be available.\n[3825365] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0b0893a46d3b675b\nError occurred while calling aws lambda system- endpoint : https://2b795ac584.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 384,
          name: 'Tiffany Hart',
          patternsSample:
            '171.152.245.135 -- [ 26/Apr/2025:12:36:47 +0000 ] "GET /bundle/b47dc9bf85a0cde9.js HTTP/1.1" 403 "http://mccoy.com/posts/main/explore/author/" "Opera/9.69.(X11; Linux x86_64; fo-FO) Presto/2.9.188 Version/10.00"\n[626896] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=626896\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 10.252.127.112:9092 could not be established. Broker may not be available.\n[9554662] Problem reaching database. Timeout http request GET https://ibm.box.com/s/a44a15bbddf92a62\nError occurred while calling aws lambda system- endpoint : https://be36cdc6c1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 385,
          name: 'Kristin Garner',
          patternsSample:
            '211.188.156.19 -- [ 21/Jan/2025:08:30:04 +0000 ] "GET /bundle/443338b646bd1c4c.js HTTP/1.1" 500 "http://www.moses-stevens.com/index.htm" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_7 rv:6.0; mag-IN) AppleWebKit/535.40.1 (KHTML, like Gecko) Version/5.0.3 Safari/535.40.1"\n[144905] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=144905\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 45.128.173.70:9092 could not be established. Broker may not be available.\n[9303548] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4d7f0ceb187254e2\nError occurred while calling aws lambda system- endpoint : https://620721a02f.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 386,
          name: 'Joshua Reed',
          patternsSample:
            '100.243.115.103 -- [ 28/Feb/2025:00:13:26 +0000 ] "GET /bundle/d83a84a0758516c5.js HTTP/1.1" 504 "https://www.francis.com/explore/category/category/login.htm" "Mozilla/5.0 (iPhone; CPU iPhone OS 3_1_3 like Mac OS X) AppleWebKit/534.1 (KHTML, like Gecko) FxiOS/14.5a3261.0 Mobile/57M570 Safari/534.1"\n[423378] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=423378\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 74.106.157.183:9092 could not be established. Broker may not be available.\n[2290981] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0f015112de25e99a\nError occurred while calling aws lambda system- endpoint : https://0f4590fbf1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 387,
          name: 'Eric Larson',
          patternsSample:
            '199.28.116.7 -- [ 15/Mar/2025:02:37:55 +0000 ] "GET /bundle/fc12744a31e78868.js HTTP/1.1" 403 "http://walker.net/faq/" "Mozilla/5.0 (iPhone; CPU iPhone OS 3_1_3 like Mac OS X) AppleWebKit/532.0 (KHTML, like Gecko) CriOS/13.0.870.0 Mobile/33R109 Safari/532.0"\n[584252] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=584252\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 26.168.134.61:9092 could not be established. Broker may not be available.\n[3715378] Problem reaching database. Timeout http request GET https://ibm.box.com/s/46e6c3d6146b4dce\nError occurred while calling aws lambda system- endpoint : https://7de884bace.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 388,
          name: 'Angela Bauer',
          patternsSample:
            '170.20.57.12 -- [ 11/May/2025:19:41:10 +0000 ] "GET /bundle/c8893f85fb254f17.js HTTP/1.1" 500 "https://pearson.org/app/tag/wp-content/homepage/" "Mozilla/5.0 (Windows; U; Windows NT 6.1) AppleWebKit/532.31.2 (KHTML, like Gecko) Version/5.1 Safari/532.31.2"\n[823186] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=823186\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 186.40.166.107:9092 could not be established. Broker may not be available.\n[7686662] Problem reaching database. Timeout http request GET https://ibm.box.com/s/36329617a223c26d\nError occurred while calling aws lambda system- endpoint : https://dbfb079060.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 389,
          name: 'William Taylor',
          patternsSample:
            '40.239.31.234 -- [ 20/Feb/2025:22:30:38 +0000 ] "GET /bundle/596bb636afaf4184.js HTTP/1.1" 504 "http://www.boyd.info/homepage/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0 rv:3.0; da-DK) AppleWebKit/534.19.2 (KHTML, like Gecko) Version/5.0.4 Safari/534.19.2"\n[856375] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=856375\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 75.60.252.235:9092 could not be established. Broker may not be available.\n[8473101] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4e5bdcf37bdcc60c\nError occurred while calling aws lambda system- endpoint : https://ae4917d9cc.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 390,
          name: 'Christina Rodriguez',
          patternsSample:
            '116.92.110.233 -- [ 29/Mar/2025:23:50:49 +0000 ] "GET /bundle/2daedac10b49d7c3.js HTTP/1.1" 200 "http://www.wilson.org/author/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3 like Mac OS X; sid-ET) AppleWebKit/533.8.5 (KHTML, like Gecko) Version/4.0.5 Mobile/8B113 Safari/6533.8.5"\n[383005] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=383005\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 2.138.28.144:9092 could not be established. Broker may not be available.\n[6891620] Problem reaching database. Timeout http request GET https://ibm.box.com/s/69b8f9084efdf6b7\nError occurred while calling aws lambda system- endpoint : https://00858460b3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 391,
          name: 'Erin Hurley',
          patternsSample:
            '203.104.158.113 -- [ 20/Apr/2025:22:07:18 +0000 ] "GET /bundle/cdec1c8899e3de8b.js HTTP/1.1" 504 "http://garcia.com/terms/" "Opera/8.95.(Windows 98; uz-UZ) Presto/2.9.180 Version/10.00"\n[198285] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=198285\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 27.81.246.223:9092 could not be established. Broker may not be available.\n[7698558] Problem reaching database. Timeout http request GET https://ibm.box.com/s/7adfc4ad4df2a4a8\nError occurred while calling aws lambda system- endpoint : https://a97501fa5a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 392,
          name: 'Malik Beck',
          patternsSample:
            '7.205.225.103 -- [ 20/May/2025:20:51:33 +0000 ] "GET /bundle/05fa2742f229ec2a.js HTTP/1.1" 504 "http://www.palmer.biz/blog/tag/category/home/" "Opera/8.75.(Windows NT 6.0; bn-IN) Presto/2.9.187 Version/11.00"\n[588133] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=588133\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 213.29.167.30:9092 could not be established. Broker may not be available.\n[2879995] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5a6f36b75d8732e5\nError occurred while calling aws lambda system- endpoint : https://3ee8bbc33a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 393,
          name: 'Lauren Hood',
          patternsSample:
            '20.213.50.24 -- [ 14/Jan/2025:10:25:11 +0000 ] "GET /bundle/ad0a93b2523485b8.js HTTP/1.1" 500 "https://www.dorsey.com/category/app/category/faq.html" "Mozilla/5.0 (compatible; MSIE 5.0; Windows 98; Win 9x 4.90; Trident/4.0)"\n[573791] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=573791\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 199.87.13.197:9092 could not be established. Broker may not be available.\n[7745000] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4abf8c2fcd864b16\nError occurred while calling aws lambda system- endpoint : https://938991b1eb.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 394,
          name: 'Jessica Hubbard',
          patternsSample:
            '66.234.174.16 -- [ 17/Mar/2025:03:02:35 +0000 ] "GET /bundle/3ceb3caec862a359.js HTTP/1.1" 500 "http://www.willis.com/" "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 4.0; Trident/4.0)"\n[645644] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=645644\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 196.151.81.204:9092 could not be established. Broker may not be available.\n[2730696] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b769563a6cd3ddca\nError occurred while calling aws lambda system- endpoint : https://6cb0ae1fc5.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 395,
          name: 'James Patterson',
          patternsSample:
            '32.116.111.180 -- [ 05/Jan/2025:05:09:09 +0000 ] "GET /bundle/f02faf7caf4dff2a.js HTTP/1.1" 200 "http://ellis.info/main.htm" "Opera/9.95.(Windows NT 5.0; lo-LA) Presto/2.9.160 Version/10.00"\n[594715] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=594715\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 4.192.92.251:9092 could not be established. Broker may not be available.\n[1888333] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d278e52e65fe613e\nError occurred while calling aws lambda system- endpoint : https://e84e596a4b.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 396,
          name: 'Teresa Figueroa',
          patternsSample:
            '200.231.144.239 -- [ 14/Apr/2025:06:32:24 +0000 ] "GET /bundle/70fc3e6d15709401.js HTTP/1.1" 403 "https://george.org/explore/explore/search.htm" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_6_4) AppleWebKit/531.1 (KHTML, like Gecko) Chrome/19.0.820.0 Safari/531.1"\n[497355] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=497355\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 160.169.164.251:9092 could not be established. Broker may not be available.\n[1728060] Problem reaching database. Timeout http request GET https://ibm.box.com/s/726eeae25b96c7de\nError occurred while calling aws lambda system- endpoint : https://60eefdbdf2.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 397,
          name: 'Mrs. Michelle Walton PhD',
          patternsSample:
            '87.120.160.118 -- [ 06/May/2025:04:18:45 +0000 ] "GET /bundle/897671441cdec701.js HTTP/1.1" 500 "http://ortiz-diaz.com/privacy.htm" "Opera/8.37.(X11; Linux i686; sid-ET) Presto/2.9.174 Version/12.00"\n[226987] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=226987\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 203.37.230.178:9092 could not be established. Broker may not be available.\n[1925272] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e5e60c5c4ffb4267\nError occurred while calling aws lambda system- endpoint : https://ba168c37da.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 398,
          name: 'Brandon Walls',
          patternsSample:
            '169.140.125.112 -- [ 03/Jan/2025:21:31:31 +0000 ] "GET /bundle/71646a6017f28ca8.js HTTP/1.1" 504 "https://www.cruz.com/terms/" "Mozilla/5.0 (iPad; CPU iPad OS 12_4_8 like Mac OS X) AppleWebKit/533.0 (KHTML, like Gecko) CriOS/36.0.813.0 Mobile/90D729 Safari/533.0"\n[658298] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=658298\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 223.234.122.19:9092 could not be established. Broker may not be available.\n[9865178] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e32594d52e916244\nError occurred while calling aws lambda system- endpoint : https://f61a9e69b0.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 399,
          name: 'Jeffrey Garcia',
          patternsSample:
            '166.253.139.27 -- [ 17/Jan/2025:09:09:21 +0000 ] "GET /bundle/90a8f6e8fb3622d4.js HTTP/1.1" 504 "http://ramirez.com/" "Opera/8.30.(Windows NT 5.01; sat-IN) Presto/2.9.176 Version/11.00"\n[957484] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=957484\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 155.34.70.4:9092 could not be established. Broker may not be available.\n[1499677] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d055d315108bb725\nError occurred while calling aws lambda system- endpoint : https://b67ab92041.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 400,
          name: 'Wesley Rojas',
          patternsSample:
            '219.156.252.120 -- [ 25/Apr/2025:01:56:30 +0000 ] "GET /bundle/d84db76978965b51.js HTTP/1.1" 200 "https://www.gonzalez.net/homepage.html" "Mozilla/5.0 (Android 6.0; Mobile; rv:42.0) Gecko/42.0 Firefox/42.0"\n[232053] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=232053\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 38.116.159.20:9092 could not be established. Broker may not be available.\n[9390018] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f3bae0c4a7e93d9f\nError occurred while calling aws lambda system- endpoint : https://b7e32d1a29.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 401,
          name: 'Aaron Collins',
          patternsSample:
            '14.94.101.111 -- [ 18/Feb/2025:09:25:07 +0000 ] "GET /bundle/f1f84f822bbb8d67.js HTTP/1.1" 500 "https://www.rodriguez-delgado.net/search/" "Mozilla/5.0 (Windows; U; Windows NT 6.1) AppleWebKit/533.23.7 (KHTML, like Gecko) Version/5.0.1 Safari/533.23.7"\n[569516] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=569516\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 131.89.69.227:9092 could not be established. Broker may not be available.\n[7854095] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4d06012032fac0ca\nError occurred while calling aws lambda system- endpoint : https://1fd833c51b.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 402,
          name: 'Carolyn Norman',
          patternsSample:
            '85.140.159.119 -- [ 09/Jan/2025:01:06:02 +0000 ] "GET /bundle/673e114a5440a1d6.js HTTP/1.1" 200 "https://www.ross.com/wp-content/post.asp" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_2 like Mac OS X; hne-IN) AppleWebKit/533.23.4 (KHTML, like Gecko) Version/3.0.5 Mobile/8B119 Safari/6533.23.4"\n[950578] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=950578\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 162.201.117.212:9092 could not be established. Broker may not be available.\n[9189223] Problem reaching database. Timeout http request GET https://ibm.box.com/s/fdf13baa09cb1c45\nError occurred while calling aws lambda system- endpoint : https://767c5e72ce.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 403,
          name: 'Rebecca Gonzales',
          patternsSample:
            '206.106.43.113 -- [ 14/May/2025:09:43:35 +0000 ] "GET /bundle/536868bcc9d0af40.js HTTP/1.1" 500 "https://www.thompson-thompson.info/explore/tag/main.jsp" "Mozilla/5.0 (Android 3.2.3; Mobile; rv:35.0) Gecko/35.0 Firefox/35.0"\n[436699] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=436699\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 78.207.223.186:9092 could not be established. Broker may not be available.\n[9877469] Problem reaching database. Timeout http request GET https://ibm.box.com/s/9f9254b3a276473a\nError occurred while calling aws lambda system- endpoint : https://6018d160d4.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 404,
          name: 'Alicia Robbins',
          patternsSample:
            '204.102.120.14 -- [ 11/Apr/2025:12:59:52 +0000 ] "GET /bundle/c80d6e0303b4a65e.js HTTP/1.1" 200 "http://www.tapia.biz/search/index/" "Mozilla/5.0 (compatible; MSIE 6.0; Windows 98; Trident/4.0)"\n[736869] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=736869\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 42.8.82.240:9092 could not be established. Broker may not be available.\n[7123007] Problem reaching database. Timeout http request GET https://ibm.box.com/s/da9bb584a0086d73\nError occurred while calling aws lambda system- endpoint : https://4028ec8842.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 405,
          name: 'Karen Smith',
          patternsSample:
            '124.157.53.2 -- [ 04/Mar/2025:11:21:24 +0000 ] "GET /bundle/3e32e6fee74d2b1d.js HTTP/1.1" 504 "http://flores.com/terms.html" "Mozilla/5.0 (X11; Linux x86_64; rv:1.9.6.20) Gecko/2010-05-15 12:58:19 Firefox/3.6.3"\n[826266] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=826266\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 139.199.202.65:9092 could not be established. Broker may not be available.\n[9121242] Problem reaching database. Timeout http request GET https://ibm.box.com/s/91c5455cb23b4268\nError occurred while calling aws lambda system- endpoint : https://c4f281e8f9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 406,
          name: 'Kerry Nunez',
          patternsSample:
            '76.3.164.44 -- [ 01/Jan/2025:12:37:45 +0000 ] "GET /bundle/4a0cd9a1cbb3d07f.js HTTP/1.1" 200 "http://www.everett.biz/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_2 like Mac OS X; ber-MA) AppleWebKit/532.50.2 (KHTML, like Gecko) Version/3.0.5 Mobile/8B118 Safari/6532.50.2"\n[581000] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=581000\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 165.212.31.227:9092 could not be established. Broker may not be available.\n[1426557] Problem reaching database. Timeout http request GET https://ibm.box.com/s/9093d832d5458d56\nError occurred while calling aws lambda system- endpoint : https://b9256dea87.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 407,
          name: 'Pamela Gonzalez',
          patternsSample:
            '169.232.98.24 -- [ 14/Mar/2025:01:43:43 +0000 ] "GET /bundle/53ac2488c94095c1.js HTTP/1.1" 504 "http://www.sanchez-crosby.biz/login/" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_9_7; rv:1.9.6.20) Gecko/2019-03-19 06:10:44 Firefox/3.6.9"\n[829172] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=829172\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 6.153.195.142:9092 could not be established. Broker may not be available.\n[4840223] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d1c7425f80690d68\nError occurred while calling aws lambda system- endpoint : https://b2a6629006.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 408,
          name: 'Jeffrey Smith',
          patternsSample:
            '122.43.59.70 -- [ 22/Mar/2025:04:12:35 +0000 ] "GET /bundle/7036d7e8fd723168.js HTTP/1.1" 504 "https://www.hays-villarreal.info/tags/search/terms/" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_11_2 rv:5.0; tn-ZA) AppleWebKit/531.19.2 (KHTML, like Gecko) Version/5.0.3 Safari/531.19.2"\n[343911] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=343911\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 31.79.212.25:9092 could not be established. Broker may not be available.\n[2883585] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ca63eaa2746d763d\nError occurred while calling aws lambda system- endpoint : https://df2ed50042.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 409,
          name: 'Samuel Richards',
          patternsSample:
            '205.248.174.225 -- [ 14/Apr/2025:15:04:37 +0000 ] "GET /bundle/28abb54b3207c1bb.js HTTP/1.1" 200 "https://www.smith.com/explore/tag/category/about.php" "Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 5.01; Trident/3.1)"\n[382770] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=382770\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 92.91.188.66:9092 could not be established. Broker may not be available.\n[5548291] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4cfe252dfefead24\nError occurred while calling aws lambda system- endpoint : https://8da4fadbab.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 410,
          name: 'James Freeman',
          patternsSample:
            '214.206.34.140 -- [ 11/Feb/2025:02:50:07 +0000 ] "GET /bundle/7b7b43059f91ace0.js HTTP/1.1" 500 "http://hopkins-neal.com/post/" "Mozilla/5.0 (Android 8.1.0; Mobile; rv:16.0) Gecko/16.0 Firefox/16.0"\n[886705] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=886705\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 111.14.52.231:9092 could not be established. Broker may not be available.\n[2062546] Problem reaching database. Timeout http request GET https://ibm.box.com/s/dba93a6c7ca43f1f\nError occurred while calling aws lambda system- endpoint : https://4bd7936216.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 411,
          name: 'Amanda Barr',
          patternsSample:
            '163.30.93.108 -- [ 30/Apr/2025:22:29:40 +0000 ] "GET /bundle/0481d5ea04d666e2.js HTTP/1.1" 504 "http://www.scott-henderson.com/" "Opera/8.33.(X11; Linux x86_64; sw-TZ) Presto/2.9.175 Version/12.00"\n[540361] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=540361\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 182.191.248.119:9092 could not be established. Broker may not be available.\n[4711780] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e0cf87fb4d6e51d2\nError occurred while calling aws lambda system- endpoint : https://730a17c11a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 412,
          name: 'Michael Aguirre',
          patternsSample:
            '129.232.39.34 -- [ 20/Mar/2025:22:24:40 +0000 ] "GET /bundle/67078a5a50d95cb9.js HTTP/1.1" 500 "http://cook-taylor.com/blog/terms/" "Opera/8.84.(X11; Linux x86_64; tt-RU) Presto/2.9.189 Version/10.00"\n[296461] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=296461\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 159.242.139.66:9092 could not be established. Broker may not be available.\n[4596840] Problem reaching database. Timeout http request GET https://ibm.box.com/s/bf094c8bdc829ae1\nError occurred while calling aws lambda system- endpoint : https://a755b23a71.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 413,
          name: 'Sarah Rhodes',
          patternsSample:
            '9.147.93.210 -- [ 03/Mar/2025:18:24:13 +0000 ] "GET /bundle/f70537ef4f68c0a4.js HTTP/1.1" 504 "http://houston.com/wp-content/login.jsp" "Opera/9.63.(X11; Linux i686; dz-BT) Presto/2.9.189 Version/11.00"\n[606730] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=606730\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 122.2.135.182:9092 could not be established. Broker may not be available.\n[9264329] Problem reaching database. Timeout http request GET https://ibm.box.com/s/cd15925ae560b344\nError occurred while calling aws lambda system- endpoint : https://78cbda27e8.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 414,
          name: 'Danielle Butler',
          patternsSample:
            '159.193.56.206 -- [ 02/Mar/2025:02:15:56 +0000 ] "GET /bundle/e554eeda763cdce4.js HTTP/1.1" 504 "https://www.chandler.com/list/tags/post/" "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.2; Trident/4.1)"\n[915685] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=915685\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 165.98.211.26:9092 could not be established. Broker may not be available.\n[6269837] Problem reaching database. Timeout http request GET https://ibm.box.com/s/3c852e0b2ed3645b\nError occurred while calling aws lambda system- endpoint : https://900bfc0262.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 415,
          name: 'David Walker',
          patternsSample:
            '77.228.85.221 -- [ 16/Apr/2025:16:28:07 +0000 ] "GET /bundle/4c9df8f94a6e42a2.js HTTP/1.1" 504 "https://roberts.com/terms.php" "Opera/8.56.(X11; Linux i686; aa-DJ) Presto/2.9.184 Version/10.00"\n[726539] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=726539\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 15.10.89.141:9092 could not be established. Broker may not be available.\n[1919320] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5dc071888db9c9c5\nError occurred while calling aws lambda system- endpoint : https://c195a7aa7e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 416,
          name: 'Reginald Thompson',
          patternsSample:
            '128.228.154.67 -- [ 16/Mar/2025:04:02:57 +0000 ] "GET /bundle/22b21495ff73229d.js HTTP/1.1" 200 "http://briggs.info/" "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/532.2 (KHTML, like Gecko) Chrome/59.0.880.0 Safari/532.2"\n[349197] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=349197\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 56.190.2.231:9092 could not be established. Broker may not be available.\n[1422989] Problem reaching database. Timeout http request GET https://ibm.box.com/s/6d4a393724c15896\nError occurred while calling aws lambda system- endpoint : https://e3b52b3cf2.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 417,
          name: 'Diane Stout',
          patternsSample:
            '190.177.144.12 -- [ 14/Jan/2025:13:19:23 +0000 ] "GET /bundle/9be84c3c152aee21.js HTTP/1.1" 500 "https://www.bryant.com/" "Mozilla/5.0 (iPhone; CPU iPhone OS 4_2_1 like Mac OS X) AppleWebKit/533.2 (KHTML, like Gecko) FxiOS/14.3r0248.0 Mobile/04D789 Safari/533.2"\n[752504] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=752504\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 170.208.196.42:9092 could not be established. Broker may not be available.\n[8257699] Problem reaching database. Timeout http request GET https://ibm.box.com/s/9553c06bcf9a666f\nError occurred while calling aws lambda system- endpoint : https://270060bb6b.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 418,
          name: 'Crystal Soto',
          patternsSample:
            '124.196.190.112 -- [ 23/Feb/2025:03:17:29 +0000 ] "GET /bundle/b4ea762dcd428af5.js HTTP/1.1" 504 "https://www.jackson.com/category/" "Mozilla/5.0 (X11; Linux x86_64; rv:1.9.5.20) Gecko/2024-11-18 13:31:43 Firefox/13.0"\n[530205] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=530205\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 113.162.118.7:9092 could not be established. Broker may not be available.\n[3546275] Problem reaching database. Timeout http request GET https://ibm.box.com/s/09f126b43c40ea53\nError occurred while calling aws lambda system- endpoint : https://76918de9e5.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 419,
          name: 'Wayne Fischer',
          patternsSample:
            '120.24.141.140 -- [ 10/Apr/2025:15:51:29 +0000 ] "GET /bundle/aebf981416cf6f24.js HTTP/1.1" 504 "https://kennedy.biz/wp-content/tag/category/terms/" "Mozilla/5.0 (compatible; MSIE 5.0; Windows CE; Trident/4.1)"\n[128248] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=128248\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 43.230.167.100:9092 could not be established. Broker may not be available.\n[1337776] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f36f313b4d466181\nError occurred while calling aws lambda system- endpoint : https://874ffcb49b.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 420,
          name: 'Rebecca Pittman',
          patternsSample:
            '198.14.202.23 -- [ 23/Apr/2025:00:35:08 +0000 ] "GET /bundle/0a39004e66762332.js HTTP/1.1" 200 "https://www.cain.com/main/" "Mozilla/5.0 (Windows CE) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/17.0.832.0 Safari/535.2"\n[731283] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=731283\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 114.145.60.137:9092 could not be established. Broker may not be available.\n[3344160] Problem reaching database. Timeout http request GET https://ibm.box.com/s/fba91c32e9a8a4aa\nError occurred while calling aws lambda system- endpoint : https://6a980f0c51.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 421,
          name: 'Michael Brooks',
          patternsSample:
            '164.235.53.72 -- [ 23/Apr/2025:15:12:16 +0000 ] "GET /bundle/9f7706cc455ab75e.js HTTP/1.1" 500 "http://www.jackson.com/categories/register.php" "Opera/8.83.(X11; Linux x86_64; mt-MT) Presto/2.9.180 Version/10.00"\n[481288] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=481288\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 81.144.243.236:9092 could not be established. Broker may not be available.\n[3922672] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ed7587d4ca72d16f\nError occurred while calling aws lambda system- endpoint : https://68a26e8c74.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 422,
          name: 'David Collins',
          patternsSample:
            '164.198.59.223 -- [ 20/May/2025:18:28:04 +0000 ] "GET /bundle/630d80761a62cc7b.js HTTP/1.1" 403 "https://www.richardson-reese.com/index.html" "Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 6.2; Trident/3.1)"\n[384961] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=384961\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 218.139.41.70:9092 could not be established. Broker may not be available.\n[9689699] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c48d6390fb22b7f9\nError occurred while calling aws lambda system- endpoint : https://0762d2a1bd.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 423,
          name: 'Andrea Martin',
          patternsSample:
            '115.235.82.87 -- [ 21/Mar/2025:06:25:29 +0000 ] "GET /bundle/edbb0f8523305d68.js HTTP/1.1" 200 "https://www.bryant.info/homepage.html" "Mozilla/5.0 (compatible; MSIE 9.0; Windows CE; Trident/4.1)"\n[263416] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=263416\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 202.6.54.18:9092 could not be established. Broker may not be available.\n[8287895] Problem reaching database. Timeout http request GET https://ibm.box.com/s/84b47c2aac55e4b1\nError occurred while calling aws lambda system- endpoint : https://aaf9e9d7b1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 424,
          name: 'Amanda Johnson',
          patternsSample:
            '8.254.126.242 -- [ 03/May/2025:09:51:22 +0000 ] "GET /bundle/e126bd91bb9557b6.js HTTP/1.1" 200 "https://macdonald.com/" "Mozilla/5.0 (Windows; U; Windows 98; Win 9x 4.90) AppleWebKit/533.12.2 (KHTML, like Gecko) Version/4.0.2 Safari/533.12.2"\n[519720] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=519720\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 9.206.48.92:9092 could not be established. Broker may not be available.\n[4202857] Problem reaching database. Timeout http request GET https://ibm.box.com/s/232ed5dd02fd41f1\nError occurred while calling aws lambda system- endpoint : https://fb79942faf.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 425,
          name: 'Christopher Cox',
          patternsSample:
            '133.253.63.142 -- [ 06/Mar/2025:01:52:40 +0000 ] "GET /bundle/fc0105a4ce09c48a.js HTTP/1.1" 504 "https://houston-mcdonald.com/privacy/" "Opera/9.61.(X11; Linux i686; ky-KG) Presto/2.9.161 Version/10.00"\n[452388] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=452388\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 144.26.90.32:9092 could not be established. Broker may not be available.\n[7121468] Problem reaching database. Timeout http request GET https://ibm.box.com/s/3d2f6cc08208f374\nError occurred while calling aws lambda system- endpoint : https://737f95f18e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 426,
          name: 'Julie Woods',
          patternsSample:
            '161.153.177.62 -- [ 26/Feb/2025:05:34:44 +0000 ] "GET /bundle/ad7cf6d0b1389afc.js HTTP/1.1" 200 "https://www.thompson.com/author.asp" "Opera/8.62.(X11; Linux x86_64; az-AZ) Presto/2.9.174 Version/10.00"\n[501198] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=501198\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 64.224.211.49:9092 could not be established. Broker may not be available.\n[7593189] Problem reaching database. Timeout http request GET https://ibm.box.com/s/7ae283386e66c595\nError occurred while calling aws lambda system- endpoint : https://c5f769c65e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 427,
          name: 'Maria Shaw',
          patternsSample:
            '175.215.184.63 -- [ 27/Jan/2025:06:33:13 +0000 ] "GET /bundle/00b87c65bbd7d303.js HTTP/1.1" 403 "http://howe.com/wp-content/terms.asp" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 4.0; Trident/4.0)"\n[453897] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=453897\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 1.38.146.216:9092 could not be established. Broker may not be available.\n[6807063] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b8349ac6090a9ef4\nError occurred while calling aws lambda system- endpoint : https://906c3d537c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 428,
          name: 'Brittany Rojas',
          patternsSample:
            '69.78.139.123 -- [ 21/Feb/2025:22:03:45 +0000 ] "GET /bundle/4a95a57dc223295a.js HTTP/1.1" 504 "https://mason.com/main/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_3 like Mac OS X; uz-UZ) AppleWebKit/533.50.7 (KHTML, like Gecko) Version/3.0.5 Mobile/8B113 Safari/6533.50.7"\n[450879] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=450879\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 145.187.24.161:9092 could not be established. Broker may not be available.\n[4805721] Problem reaching database. Timeout http request GET https://ibm.box.com/s/19ea844e782562e5\nError occurred while calling aws lambda system- endpoint : https://6249ef3f0c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 429,
          name: 'Sandra Pugh',
          patternsSample:
            '67.162.32.72 -- [ 22/May/2025:05:17:30 +0000 ] "GET /bundle/e4e02aaf599744b2.js HTTP/1.1" 500 "http://benton.com/privacy.html" "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/3.0)"\n[823253] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=823253\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 33.214.54.97:9092 could not be established. Broker may not be available.\n[5847162] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c14c2f41cb24d593\nError occurred while calling aws lambda system- endpoint : https://53d752e732.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 430,
          name: 'Amy Carr',
          patternsSample:
            '220.53.79.26 -- [ 13/Apr/2025:07:10:11 +0000 ] "GET /bundle/dd0e91fadd34e633.js HTTP/1.1" 403 "http://acevedo.info/index.asp" "Mozilla/5.0 (compatible; MSIE 7.0; Windows 98; Trident/3.0)"\n[994865] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=994865\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 206.215.107.155:9092 could not be established. Broker may not be available.\n[5331364] Problem reaching database. Timeout http request GET https://ibm.box.com/s/435ddc16847dd8b7\nError occurred while calling aws lambda system- endpoint : https://bc4e503881.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 431,
          name: 'Edward Parker',
          patternsSample:
            '1.216.102.115 -- [ 03/Jan/2025:23:23:45 +0000 ] "GET /bundle/24e60df1d040cec5.js HTTP/1.1" 504 "http://www.smith-lynch.biz/explore/tags/app/faq/" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_9) AppleWebKit/534.0 (KHTML, like Gecko) Chrome/33.0.882.0 Safari/534.0"\n[881101] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=881101\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 154.205.244.63:9092 could not be established. Broker may not be available.\n[4296589] Problem reaching database. Timeout http request GET https://ibm.box.com/s/1430ea5f2069f28e\nError occurred while calling aws lambda system- endpoint : https://d9441d175e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 432,
          name: 'Shaun Tanner',
          patternsSample:
            '156.104.155.240 -- [ 08/Apr/2025:01:36:35 +0000 ] "GET /bundle/5d16eb9fe6671dc5.js HTTP/1.1" 403 "https://www.walker-snyder.org/privacy/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_0 like Mac OS X; tk-TM) AppleWebKit/531.34.3 (KHTML, like Gecko) Version/4.0.5 Mobile/8B112 Safari/6531.34.3"\n[884785] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=884785\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 95.20.136.0:9092 could not be established. Broker may not be available.\n[6941214] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5c949ab8b67cce74\nError occurred while calling aws lambda system- endpoint : https://5466267879.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 433,
          name: 'John Abbott',
          patternsSample:
            '51.187.76.199 -- [ 11/Apr/2025:02:04:48 +0000 ] "GET /bundle/cb713270e074d853.js HTTP/1.1" 403 "http://www.peterson-carroll.biz/wp-content/faq/" "Opera/8.63.(Windows NT 6.1; te-IN) Presto/2.9.172 Version/10.00"\n[379277] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=379277\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 159.19.91.140:9092 could not be established. Broker may not be available.\n[7160879] Problem reaching database. Timeout http request GET https://ibm.box.com/s/dc435d1106ebf810\nError occurred while calling aws lambda system- endpoint : https://b265375d26.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 434,
          name: 'Nathan Wilson',
          patternsSample:
            '208.218.176.155 -- [ 27/Feb/2025:07:44:50 +0000 ] "GET /bundle/017a108bd7b6caf9.js HTTP/1.1" 200 "https://washington.com/home/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_1 like Mac OS X; ca-AD) AppleWebKit/535.41.6 (KHTML, like Gecko) Version/4.0.5 Mobile/8B118 Safari/6535.41.6"\n[197092] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=197092\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 201.80.217.188:9092 could not be established. Broker may not be available.\n[3739914] Problem reaching database. Timeout http request GET https://ibm.box.com/s/cd431ed7f00b55dd\nError occurred while calling aws lambda system- endpoint : https://682f6a4209.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 435,
          name: 'Kayla Bryant',
          patternsSample:
            '27.136.118.24 -- [ 31/Jan/2025:12:58:44 +0000 ] "GET /bundle/3e70382433461a87.js HTTP/1.1" 403 "https://www.brown.com/list/wp-content/register.htm" "Mozilla/5.0 (compatible; MSIE 9.0; Windows 95; Trident/5.0)"\n[533539] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=533539\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 8.46.168.171:9092 could not be established. Broker may not be available.\n[7158425] Problem reaching database. Timeout http request GET https://ibm.box.com/s/34122cead1fd9a2a\nError occurred while calling aws lambda system- endpoint : https://695cde7287.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 436,
          name: 'Mandy Rice',
          patternsSample:
            '2.196.69.145 -- [ 04/Mar/2025:01:44:31 +0000 ] "GET /bundle/3d38d1ba5a747369.js HTTP/1.1" 500 "https://edwards.com/explore/tags/category/faq/" "Opera/9.67.(X11; Linux i686; sq-AL) Presto/2.9.160 Version/11.00"\n[388679] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=388679\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 172.167.218.240:9092 could not be established. Broker may not be available.\n[8824997] Problem reaching database. Timeout http request GET https://ibm.box.com/s/6c8a889be7773853\nError occurred while calling aws lambda system- endpoint : https://8b80cee27c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 437,
          name: 'Stephanie Meza',
          patternsSample:
            '22.12.246.64 -- [ 13/Feb/2025:05:40:03 +0000 ] "GET /bundle/fea2d3cb89350856.js HTTP/1.1" 403 "https://house-grimes.org/posts/posts/app/register.html" "Opera/8.72.(X11; Linux x86_64; eu-ES) Presto/2.9.161 Version/11.00"\n[837416] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=837416\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 65.58.143.151:9092 could not be established. Broker may not be available.\n[1917008] Problem reaching database. Timeout http request GET https://ibm.box.com/s/8f36d007f3b8f2fd\nError occurred while calling aws lambda system- endpoint : https://e43aaa54de.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 438,
          name: 'Sarah Hill',
          patternsSample:
            '7.248.98.143 -- [ 17/Jan/2025:07:42:46 +0000 ] "GET /bundle/47df8c1070082f7f.js HTTP/1.1" 200 "http://jones.com/about/" "Mozilla/5.0 (Android 4.4.3; Mobile; rv:46.0) Gecko/46.0 Firefox/46.0"\n[374069] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=374069\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 201.2.138.242:9092 could not be established. Broker may not be available.\n[6190793] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d9c9ce5a88bf0880\nError occurred while calling aws lambda system- endpoint : https://44c5ddfbc2.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 439,
          name: 'Mrs. Amanda Perez MD',
          patternsSample:
            '74.63.154.157 -- [ 04/Feb/2025:01:57:40 +0000 ] "GET /bundle/4856588626b30825.js HTTP/1.1" 500 "http://logan.biz/" "Mozilla/5.0 (compatible; MSIE 5.0; Windows NT 5.0; Trident/3.1)"\n[699357] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=699357\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 26.126.251.69:9092 could not be established. Broker may not be available.\n[2704579] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f669a23b556deac3\nError occurred while calling aws lambda system- endpoint : https://260a09ac56.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 440,
          name: 'Adam Bailey',
          patternsSample:
            '200.116.192.239 -- [ 09/Jan/2025:05:42:06 +0000 ] "GET /bundle/5afd421875355d47.js HTTP/1.1" 200 "http://www.silva.com/" "Mozilla/5.0 (Windows; U; Windows 95) AppleWebKit/534.10.5 (KHTML, like Gecko) Version/5.0.2 Safari/534.10.5"\n[938157] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=938157\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 145.83.148.159:9092 could not be established. Broker may not be available.\n[8669860] Problem reaching database. Timeout http request GET https://ibm.box.com/s/110ec18d7f554501\nError occurred while calling aws lambda system- endpoint : https://a30194ac10.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 441,
          name: 'John Valenzuela',
          patternsSample:
            '29.220.16.98 -- [ 15/May/2025:08:15:24 +0000 ] "GET /bundle/7e32a383ecb741c9.js HTTP/1.1" 200 "https://www.walker.org/login.php" "Mozilla/5.0 (compatible; MSIE 7.0; Windows 95; Trident/3.1)"\n[782962] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=782962\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 215.8.243.204:9092 could not be established. Broker may not be available.\n[7577398] Problem reaching database. Timeout http request GET https://ibm.box.com/s/3b641505e1da705f\nError occurred while calling aws lambda system- endpoint : https://933c38c432.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 442,
          name: 'Tiffany Tapia DVM',
          patternsSample:
            '16.176.121.71 -- [ 09/Apr/2025:04:23:55 +0000 ] "GET /bundle/55015a4fd4a864cf.js HTTP/1.1" 403 "http://www.estrada.org/about/" "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/531.1 (KHTML, like Gecko) FxiOS/17.7s8504.0 Mobile/03N327 Safari/531.1"\n[746783] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=746783\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 46.96.167.74:9092 could not be established. Broker may not be available.\n[2320162] Problem reaching database. Timeout http request GET https://ibm.box.com/s/47b4976474a7d7c7\nError occurred while calling aws lambda system- endpoint : https://da466d8c21.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 443,
          name: 'Brianna Sanders',
          patternsSample:
            '1.161.63.244 -- [ 30/Jan/2025:08:14:21 +0000 ] "GET /bundle/d57360cc1e6d39f5.js HTTP/1.1" 403 "https://www.lewis.info/tags/list/privacy.php" "Mozilla/5.0 (Android 4.4.1; Mobile; rv:39.0) Gecko/39.0 Firefox/39.0"\n[635395] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=635395\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 85.16.91.219:9092 could not be established. Broker may not be available.\n[5590178] Problem reaching database. Timeout http request GET https://ibm.box.com/s/67e6ff174c0db3f8\nError occurred while calling aws lambda system- endpoint : https://160faf1311.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 444,
          name: 'Mr. Travis Diaz PhD',
          patternsSample:
            '41.153.236.68 -- [ 13/Apr/2025:02:00:02 +0000 ] "GET /bundle/c6af7cc948a4ed1e.js HTTP/1.1" 403 "http://porter.biz/author.asp" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_0 rv:4.0; om-ET) AppleWebKit/531.6.2 (KHTML, like Gecko) Version/5.0.3 Safari/531.6.2"\n[533077] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=533077\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 148.23.12.227:9092 could not be established. Broker may not be available.\n[2500581] Problem reaching database. Timeout http request GET https://ibm.box.com/s/63b231c146f33afd\nError occurred while calling aws lambda system- endpoint : https://be5a223458.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 445,
          name: 'Angela Howard',
          patternsSample:
            '61.81.27.241 -- [ 05/Apr/2025:13:16:30 +0000 ] "GET /bundle/a73648fa65cccfee.js HTTP/1.1" 200 "http://www.silva.com/about.htm" "Mozilla/5.0 (iPad; CPU iPad OS 4_2_1 like Mac OS X) AppleWebKit/531.2 (KHTML, like Gecko) FxiOS/18.0b0280.0 Mobile/65F845 Safari/531.2"\n[123326] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=123326\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 173.204.27.54:9092 could not be established. Broker may not be available.\n[3233738] Problem reaching database. Timeout http request GET https://ibm.box.com/s/95c34c203cba7cfd\nError occurred while calling aws lambda system- endpoint : https://a65c468bb5.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 446,
          name: 'Lisa Delacruz',
          patternsSample:
            '149.160.37.120 -- [ 05/Jan/2025:15:58:10 +0000 ] "GET /bundle/f2abe8d3d2f2e7d6.js HTTP/1.1" 504 "http://simpson.org/" "Mozilla/5.0 (Windows; U; Windows NT 6.0) AppleWebKit/533.14.2 (KHTML, like Gecko) Version/4.0.4 Safari/533.14.2"\n[654327] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=654327\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 139.123.86.116:9092 could not be established. Broker may not be available.\n[8976162] Problem reaching database. Timeout http request GET https://ibm.box.com/s/45ad8d719d632724\nError occurred while calling aws lambda system- endpoint : https://c1a49956b5.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 447,
          name: 'Rebecca Bautista',
          patternsSample:
            '196.146.56.116 -- [ 01/Feb/2025:06:10:39 +0000 ] "GET /bundle/a476ed84b5bb2f03.js HTTP/1.1" 200 "http://burgess-holmes.com/category/explore/homepage/" "Mozilla/5.0 (Windows; U; Windows CE) AppleWebKit/535.25.7 (KHTML, like Gecko) Version/5.0.5 Safari/535.25.7"\n[437404] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=437404\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 185.8.2.156:9092 could not be established. Broker may not be available.\n[7319533] Problem reaching database. Timeout http request GET https://ibm.box.com/s/95298671ad5005bd\nError occurred while calling aws lambda system- endpoint : https://6fe23b75e6.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 448,
          name: 'Jessica Hopkins',
          patternsSample:
            '69.77.211.1 -- [ 19/Feb/2025:22:18:31 +0000 ] "GET /bundle/9327e089a8cbb67e.js HTTP/1.1" 500 "https://smith.com/author.htm" "Mozilla/5.0 (Windows 95; lo-LA; rv:1.9.1.20) Gecko/2020-10-10 18:44:08 Firefox/3.6.14"\n[194824] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=194824\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 50.102.35.26:9092 could not be established. Broker may not be available.\n[9698001] Problem reaching database. Timeout http request GET https://ibm.box.com/s/8ef2edf9c454f862\nError occurred while calling aws lambda system- endpoint : https://99b5104829.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 449,
          name: 'Jesse Smith',
          patternsSample:
            '173.122.139.254 -- [ 06/Apr/2025:21:16:42 +0000 ] "GET /bundle/189bdc23368fff49.js HTTP/1.1" 200 "https://rice.com/login.jsp" "Mozilla/5.0 (Linux; Android 4.4) AppleWebKit/535.0 (KHTML, like Gecko) Chrome/52.0.844.0 Safari/535.0"\n[761987] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=761987\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 218.61.1.197:9092 could not be established. Broker may not be available.\n[6285233] Problem reaching database. Timeout http request GET https://ibm.box.com/s/1204d88965f671fc\nError occurred while calling aws lambda system- endpoint : https://244ceac798.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 450,
          name: 'Patrick Montes',
          patternsSample:
            '139.74.194.82 -- [ 21/May/2025:16:33:48 +0000 ] "GET /bundle/0a3bf5478241e097.js HTTP/1.1" 500 "http://hernandez-williams.com/homepage/" "Opera/8.21.(X11; Linux i686; si-LK) Presto/2.9.189 Version/10.00"\n[321624] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=321624\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 121.74.193.166:9092 could not be established. Broker may not be available.\n[1129753] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5eaf10f054b2b825\nError occurred while calling aws lambda system- endpoint : https://cd55ae0759.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 451,
          name: 'Scott Rivers',
          patternsSample:
            '103.210.141.30 -- [ 18/May/2025:14:29:09 +0000 ] "GET /bundle/aad26b1898cf9084.js HTTP/1.1" 200 "https://welch.org/list/privacy.htm" "Opera/8.15.(X11; Linux x86_64; mhr-RU) Presto/2.9.173 Version/12.00"\n[986341] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=986341\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 128.196.173.165:9092 could not be established. Broker may not be available.\n[8558405] Problem reaching database. Timeout http request GET https://ibm.box.com/s/6ba5489aa391dace\nError occurred while calling aws lambda system- endpoint : https://78c9ebaee8.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 452,
          name: 'Darin Reed',
          patternsSample:
            '33.49.40.246 -- [ 20/May/2025:01:10:27 +0000 ] "GET /bundle/9bc03f132ab87720.js HTTP/1.1" 500 "http://www.benitez.com/tag/homepage.html" "Mozilla/5.0 (Windows; U; Windows NT 6.1) AppleWebKit/535.3.3 (KHTML, like Gecko) Version/4.0.1 Safari/535.3.3"\n[714103] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=714103\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 216.254.110.30:9092 could not be established. Broker may not be available.\n[4577902] Problem reaching database. Timeout http request GET https://ibm.box.com/s/679613257ad00711\nError occurred while calling aws lambda system- endpoint : https://7baba0c39c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 453,
          name: 'Jeremy Meyer',
          patternsSample:
            '123.140.123.234 -- [ 17/Mar/2025:10:27:29 +0000 ] "GET /bundle/729936d7442d5255.js HTTP/1.1" 500 "http://www.quinn.org/app/explore/explore/post.html" "Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 6.1; Trident/4.1)"\n[774243] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=774243\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 54.212.229.59:9092 could not be established. Broker may not be available.\n[5410707] Problem reaching database. Timeout http request GET https://ibm.box.com/s/8f56eefe88d4319a\nError occurred while calling aws lambda system- endpoint : https://12a8e368d0.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 454,
          name: 'Dale Johnson',
          patternsSample:
            '79.84.208.148 -- [ 04/May/2025:02:35:17 +0000 ] "GET /bundle/c77e6af4a7f84467.js HTTP/1.1" 500 "http://www.johnson.net/register/" "Mozilla/5.0 (X11; Linux x86_64; rv:1.9.6.20) Gecko/2014-04-26 11:17:24 Firefox/12.0"\n[665175] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=665175\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 63.1.158.207:9092 could not be established. Broker may not be available.\n[3397396] Problem reaching database. Timeout http request GET https://ibm.box.com/s/f4315e959b049265\nError occurred while calling aws lambda system- endpoint : https://82c05d1f60.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 455,
          name: 'Jason Craig',
          patternsSample:
            '30.183.185.236 -- [ 23/May/2025:14:36:25 +0000 ] "GET /bundle/3babdc2820dc295c.js HTTP/1.1" 504 "http://www.perez.com/terms/" "Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 6.2; Trident/4.0)"\n[352333] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=352333\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 12.57.205.89:9092 could not be established. Broker may not be available.\n[7679269] Problem reaching database. Timeout http request GET https://ibm.box.com/s/bfca3564bec6842f\nError occurred while calling aws lambda system- endpoint : https://196d3e738f.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 456,
          name: 'Katelyn Fitzpatrick',
          patternsSample:
            '70.202.194.189 -- [ 15/Feb/2025:08:30:14 +0000 ] "GET /bundle/88deffa251520a5f.js HTTP/1.1" 500 "https://miller.com/" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_12_0 rv:4.0; iw-IL) AppleWebKit/532.28.1 (KHTML, like Gecko) Version/4.0 Safari/532.28.1"\n[128042] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=128042\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 7.253.91.236:9092 could not be established. Broker may not be available.\n[3568560] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0c61a66ae3c064f9\nError occurred while calling aws lambda system- endpoint : https://2c81f14de1.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 457,
          name: 'Jose Phillips',
          patternsSample:
            '208.192.224.254 -- [ 20/Mar/2025:14:05:04 +0000 ] "GET /bundle/213cf3d8bdd665da.js HTTP/1.1" 403 "http://bauer-morales.com/blog/register/" "Opera/8.94.(Windows NT 5.0; mk-MK) Presto/2.9.175 Version/12.00"\n[246912] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=246912\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 32.237.112.78:9092 could not be established. Broker may not be available.\n[4300202] Problem reaching database. Timeout http request GET https://ibm.box.com/s/602f1013c7178f2f\nError occurred while calling aws lambda system- endpoint : https://d31fb80fea.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 458,
          name: 'Deborah Johnson',
          patternsSample:
            '175.42.165.179 -- [ 11/Jan/2025:19:58:06 +0000 ] "GET /bundle/7ee1df4649fb5313.js HTTP/1.1" 200 "https://miller-morales.com/tag/blog/homepage.html" "Mozilla/5.0 (Windows; U; Windows NT 5.1) AppleWebKit/532.47.2 (KHTML, like Gecko) Version/4.0.1 Safari/532.47.2"\n[883925] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=883925\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 80.233.10.149:9092 could not be established. Broker may not be available.\n[1508833] Problem reaching database. Timeout http request GET https://ibm.box.com/s/660a0fa3702ed141\nError occurred while calling aws lambda system- endpoint : https://274b997f9e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 459,
          name: 'Margaret Brooks',
          patternsSample:
            '107.141.211.1 -- [ 29/Jan/2025:05:52:36 +0000 ] "GET /bundle/54e54882f09753db.js HTTP/1.1" 504 "https://burton-vargas.com/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/532.1 (KHTML, like Gecko) Chrome/15.0.805.0 Safari/532.1"\n[269100] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=269100\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 40.227.198.64:9092 could not be established. Broker may not be available.\n[1861126] Problem reaching database. Timeout http request GET https://ibm.box.com/s/45566d725e6e4ff3\nError occurred while calling aws lambda system- endpoint : https://6025a19895.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 460,
          name: 'Nathaniel Lewis',
          patternsSample:
            '67.4.77.184 -- [ 06/Jan/2025:11:09:42 +0000 ] "GET /bundle/b8a736b7d8a80446.js HTTP/1.1" 200 "http://wright.com/" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_5) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/15.0.868.0 Safari/533.2"\n[833286] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=833286\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 201.170.127.68:9092 could not be established. Broker may not be available.\n[9367536] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c665dac54195e7dc\nError occurred while calling aws lambda system- endpoint : https://b478e65c1f.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 461,
          name: 'Erin Williams',
          patternsSample:
            '206.235.178.51 -- [ 30/Jan/2025:20:38:23 +0000 ] "GET /bundle/9b9de4565102b309.js HTTP/1.1" 403 "http://www.bowen.com/author.asp" "Mozilla/5.0 (iPhone; CPU iPhone OS 3_1_3 like Mac OS X) AppleWebKit/532.1 (KHTML, like Gecko) FxiOS/12.7b7437.0 Mobile/79L465 Safari/532.1"\n[486853] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=486853\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 11.245.135.212:9092 could not be established. Broker may not be available.\n[2538762] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0a4d9ff1d856aee9\nError occurred while calling aws lambda system- endpoint : https://e8f3ca5cbf.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 462,
          name: 'Amber Reyes',
          patternsSample:
            '222.188.3.154 -- [ 06/May/2025:12:10:47 +0000 ] "GET /bundle/3156c228300a05a2.js HTTP/1.1" 504 "http://www.evans.com/author.php" "Opera/8.71.(Windows NT 5.01; af-ZA) Presto/2.9.164 Version/12.00"\n[446530] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=446530\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 54.142.24.146:9092 could not be established. Broker may not be available.\n[4179640] Problem reaching database. Timeout http request GET https://ibm.box.com/s/8f817537069248fd\nError occurred while calling aws lambda system- endpoint : https://e199fa503a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 463,
          name: 'Melissa Garcia',
          patternsSample:
            '117.207.31.93 -- [ 18/Apr/2025:08:29:35 +0000 ] "GET /bundle/2366cc6c375a5558.js HTTP/1.1" 200 "http://www.sanchez-hernandez.net/home.html" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_12_4 rv:2.0; niu-NU) AppleWebKit/533.42.2 (KHTML, like Gecko) Version/4.0.5 Safari/533.42.2"\n[517223] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=517223\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 160.51.41.39:9092 could not be established. Broker may not be available.\n[6403384] Problem reaching database. Timeout http request GET https://ibm.box.com/s/71db7879bde749a7\nError occurred while calling aws lambda system- endpoint : https://a998752188.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 464,
          name: 'Jon Patterson',
          patternsSample:
            '216.37.134.220 -- [ 05/May/2025:12:22:03 +0000 ] "GET /bundle/84b5ef7997015bc9.js HTTP/1.1" 504 "https://www.houston.biz/index.html" "Opera/8.33.(X11; Linux x86_64; uk-UA) Presto/2.9.171 Version/10.00"\n[200904] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=200904\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 76.220.93.25:9092 could not be established. Broker may not be available.\n[2841278] Problem reaching database. Timeout http request GET https://ibm.box.com/s/125f9ed0a04b8f52\nError occurred while calling aws lambda system- endpoint : https://cdf47ee747.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 465,
          name: 'Brittany Nunez',
          patternsSample:
            '86.136.96.122 -- [ 31/Mar/2025:03:06:39 +0000 ] "GET /bundle/27b2c29c6f84d49a.js HTTP/1.1" 500 "http://www.nunez.com/index/" "Opera/9.30.(X11; Linux x86_64; lt-LT) Presto/2.9.163 Version/12.00"\n[479093] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=479093\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 32.98.184.31:9092 could not be established. Broker may not be available.\n[8066150] Problem reaching database. Timeout http request GET https://ibm.box.com/s/adaf194444089a47\nError occurred while calling aws lambda system- endpoint : https://fbdb3dffbc.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 466,
          name: 'David George PhD',
          patternsSample:
            '128.126.76.19 -- [ 11/Apr/2025:06:54:15 +0000 ] "GET /bundle/aeca04a7f917a23d.js HTTP/1.1" 504 "http://houston-johnson.com/author/" "Mozilla/5.0 (compatible; MSIE 8.0; Windows 95; Trident/5.0)"\n[519349] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=519349\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 20.213.97.103:9092 could not be established. Broker may not be available.\n[2257745] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5bfe3188dbf3b9d2\nError occurred while calling aws lambda system- endpoint : https://c07bc580b5.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 467,
          name: 'Amy Cole',
          patternsSample:
            '27.159.17.143 -- [ 25/May/2025:16:48:28 +0000 ] "GET /bundle/a3b3e5505f798eb2.js HTTP/1.1" 200 "https://butler.biz/list/category.htm" "Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 6.2; Trident/5.1)"\n[245343] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=245343\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 88.65.65.78:9092 could not be established. Broker may not be available.\n[6715074] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e1febe66f61f666d\nError occurred while calling aws lambda system- endpoint : https://894e4784f9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 468,
          name: 'Bridget Martin',
          patternsSample:
            '190.167.58.79 -- [ 28/Mar/2025:05:43:34 +0000 ] "GET /bundle/0f780056efc5316c.js HTTP/1.1" 403 "http://www.larsen-moses.net/" "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.2; Trident/3.1)"\n[966028] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=966028\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 188.134.152.9:9092 could not be established. Broker may not be available.\n[3228648] Problem reaching database. Timeout http request GET https://ibm.box.com/s/139f724b61a437e4\nError occurred while calling aws lambda system- endpoint : https://cd9f3dcf61.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 469,
          name: 'Erica Fisher',
          patternsSample:
            '217.64.109.37 -- [ 28/Mar/2025:12:14:14 +0000 ] "GET /bundle/1890685ff099d7b2.js HTTP/1.1" 200 "https://www.vaughn.com/posts/list/homepage.php" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; Trident/3.0)"\n[661585] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=661585\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 153.208.117.162:9092 could not be established. Broker may not be available.\n[3009363] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0dd4a90a5c5eb6c2\nError occurred while calling aws lambda system- endpoint : https://dd47f99926.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 470,
          name: 'Kenneth Carroll',
          patternsSample:
            '190.183.251.174 -- [ 25/Mar/2025:12:12:19 +0000 ] "GET /bundle/d49b05de92695ca7.js HTTP/1.1" 200 "https://wilson.com/search/index.htm" "Opera/8.41.(X11; Linux i686; uz-UZ) Presto/2.9.167 Version/12.00"\n[173229] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=173229\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 135.67.234.25:9092 could not be established. Broker may not be available.\n[7720414] Problem reaching database. Timeout http request GET https://ibm.box.com/s/ef40ed0619bc53ef\nError occurred while calling aws lambda system- endpoint : https://e66d1cbe02.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 471,
          name: 'Robert Swanson',
          patternsSample:
            '47.105.224.114 -- [ 22/Feb/2025:12:11:44 +0000 ] "GET /bundle/c1919191f2fc8f20.js HTTP/1.1" 504 "https://www.harvey.org/tag/privacy/" "Mozilla/5.0 (iPad; CPU iPad OS 5_1_1 like Mac OS X) AppleWebKit/534.1 (KHTML, like Gecko) FxiOS/9.6f6496.0 Mobile/42X713 Safari/534.1"\n[722480] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=722480\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 178.97.214.165:9092 could not be established. Broker may not be available.\n[5995490] Problem reaching database. Timeout http request GET https://ibm.box.com/s/97c9241a505db190\nError occurred while calling aws lambda system- endpoint : https://93f35b1481.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 472,
          name: 'Ryan Holloway',
          patternsSample:
            '53.96.198.101 -- [ 24/Apr/2025:01:41:05 +0000 ] "GET /bundle/ca54f20b7549159b.js HTTP/1.1" 504 "http://castro.biz/homepage.asp" "Mozilla/5.0 (Windows; U; Windows NT 5.0) AppleWebKit/533.7.4 (KHTML, like Gecko) Version/5.0.3 Safari/533.7.4"\n[990233] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=990233\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 64.81.23.217:9092 could not be established. Broker may not be available.\n[9980971] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e6ba35a9b5c68d70\nError occurred while calling aws lambda system- endpoint : https://eb7fb41dec.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 473,
          name: 'David Vega',
          patternsSample:
            '163.49.15.125 -- [ 21/Jan/2025:02:12:46 +0000 ] "GET /bundle/68d815df8fdddc73.js HTTP/1.1" 200 "http://johnston.com/" "Mozilla/5.0 (Windows NT 5.2) AppleWebKit/536.1 (KHTML, like Gecko) Chrome/62.0.817.0 Safari/536.1"\n[152518] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=152518\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 212.156.95.38:9092 could not be established. Broker may not be available.\n[3318752] Problem reaching database. Timeout http request GET https://ibm.box.com/s/7a1682c036ad1def\nError occurred while calling aws lambda system- endpoint : https://fd7af81e8c.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 474,
          name: 'Matthew Gonzalez',
          patternsSample:
            '116.50.5.53 -- [ 03/Apr/2025:19:01:46 +0000 ] "GET /bundle/d60090df633bf1a6.js HTTP/1.1" 403 "https://mays.com/categories/app/app/about.php" "Mozilla/5.0 (Android 2.3.6; Mobile; rv:43.0) Gecko/43.0 Firefox/43.0"\n[614679] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=614679\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 71.186.247.205:9092 could not be established. Broker may not be available.\n[9861239] Problem reaching database. Timeout http request GET https://ibm.box.com/s/2a81c2f051b68835\nError occurred while calling aws lambda system- endpoint : https://ad0d96d150.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 475,
          name: 'Maria Hogan',
          patternsSample:
            '221.100.80.147 -- [ 18/Jan/2025:07:45:24 +0000 ] "GET /bundle/4e2ffe91f15b3c72.js HTTP/1.1" 500 "http://www.blake-norris.com/search/" "Opera/8.89.(Windows 98; ru-UA) Presto/2.9.183 Version/12.00"\n[763207] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=763207\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 50.107.13.139:9092 could not be established. Broker may not be available.\n[3822794] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0b56ba4d14377b32\nError occurred while calling aws lambda system- endpoint : https://56151c1e79.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 476,
          name: 'Tara Miller',
          patternsSample:
            '77.179.224.66 -- [ 06/Feb/2025:13:53:00 +0000 ] "GET /bundle/6bf98ee6c1f1bdf8.js HTTP/1.1" 504 "http://lee.biz/blog/terms.asp" "Opera/9.61.(Windows NT 6.2; cv-RU) Presto/2.9.162 Version/12.00"\n[551372] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=551372\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 46.94.121.98:9092 could not be established. Broker may not be available.\n[6153540] Problem reaching database. Timeout http request GET https://ibm.box.com/s/5c1b28f01371a573\nError occurred while calling aws lambda system- endpoint : https://01009a6bb3.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 477,
          name: 'Richard Collins',
          patternsSample:
            '35.215.234.186 -- [ 01/Apr/2025:07:39:37 +0000 ] "GET /bundle/6be0d83a930a8995.js HTTP/1.1" 200 "http://webster.com/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 5.1; Trident/3.0)"\n[991614] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=991614\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 42.81.140.90:9092 could not be established. Broker may not be available.\n[3147846] Problem reaching database. Timeout http request GET https://ibm.box.com/s/1e0b677736398c5b\nError occurred while calling aws lambda system- endpoint : https://633d33ed73.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 478,
          name: 'Adam Petersen',
          patternsSample:
            '44.142.240.161 -- [ 13/Apr/2025:00:20:29 +0000 ] "GET /bundle/7e84bde5974441df.js HTTP/1.1" 500 "https://douglas.com/app/app/posts/category/" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_10_8 rv:4.0; ur-PK) AppleWebKit/532.28.1 (KHTML, like Gecko) Version/4.1 Safari/532.28.1"\n[726985] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=726985\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 146.130.7.166:9092 could not be established. Broker may not be available.\n[8198220] Problem reaching database. Timeout http request GET https://ibm.box.com/s/29fd040fdd84c405\nError occurred while calling aws lambda system- endpoint : https://00e38cb389.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 479,
          name: 'Stephanie Munoz',
          patternsSample:
            '159.116.5.238 -- [ 26/Feb/2025:12:47:56 +0000 ] "GET /bundle/6f1817a1978ca5b1.js HTTP/1.1" 500 "https://www.owen.com/faq/" "Mozilla/5.0 (Windows NT 5.01; nan-TW; rv:1.9.0.20) Gecko/2011-02-03 23:34:39 Firefox/3.6.2"\n[946782] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=946782\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 130.84.12.19:9092 could not be established. Broker may not be available.\n[9066989] Problem reaching database. Timeout http request GET https://ibm.box.com/s/52e7c87fa433d20a\nError occurred while calling aws lambda system- endpoint : https://65750e84e4.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 480,
          name: 'Dr. Billy Rivera',
          patternsSample:
            '99.73.172.89 -- [ 01/Jan/2025:19:47:54 +0000 ] "GET /bundle/b56532d0194fd2fa.js HTTP/1.1" 504 "http://chapman-wright.biz/blog/wp-content/main/register.asp" "Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/532.17.5 (KHTML, like Gecko) Version/4.0.2 Safari/532.17.5"\n[578810] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=578810\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 110.44.218.109:9092 could not be established. Broker may not be available.\n[6086549] Problem reaching database. Timeout http request GET https://ibm.box.com/s/9f7cefa8d42e2eeb\nError occurred while calling aws lambda system- endpoint : https://0e971fe654.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 481,
          name: 'David Webster',
          patternsSample:
            '173.147.248.255 -- [ 02/Apr/2025:07:11:15 +0000 ] "GET /bundle/6ac300e3e196ab88.js HTTP/1.1" 200 "https://cunningham.com/privacy/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_2 like Mac OS X; zu-ZA) AppleWebKit/531.1.2 (KHTML, like Gecko) Version/3.0.5 Mobile/8B119 Safari/6531.1.2"\n[270332] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=270332\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 75.227.64.110:9092 could not be established. Broker may not be available.\n[2496089] Problem reaching database. Timeout http request GET https://ibm.box.com/s/877ccdf91f35e4e6\nError occurred while calling aws lambda system- endpoint : https://94ab94055a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 482,
          name: 'Danny Allen',
          patternsSample:
            '80.31.209.170 -- [ 10/Apr/2025:13:04:12 +0000 ] "GET /bundle/948ba30f67c6db06.js HTTP/1.1" 504 "http://wilkerson-jones.com/" "Opera/9.74.(Windows 98; kw-GB) Presto/2.9.162 Version/11.00"\n[227493] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=227493\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 36.133.157.102:9092 could not be established. Broker may not be available.\n[6096749] Problem reaching database. Timeout http request GET https://ibm.box.com/s/92448eb94103bbc8\nError occurred while calling aws lambda system- endpoint : https://91fcb5b8e9.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 483,
          name: 'Randy Blake',
          patternsSample:
            '199.117.207.50 -- [ 16/Feb/2025:14:47:03 +0000 ] "GET /bundle/15352927ae0f7dd5.js HTTP/1.1" 403 "https://quinn-park.com/categories/list/index/" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_0 like Mac OS X; az-IN) AppleWebKit/534.21.7 (KHTML, like Gecko) Version/4.0.5 Mobile/8B119 Safari/6534.21.7"\n[530200] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=530200\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 93.164.189.32:9092 could not be established. Broker may not be available.\n[3142018] Problem reaching database. Timeout http request GET https://ibm.box.com/s/9fa974a1153881cd\nError occurred while calling aws lambda system- endpoint : https://a000573b70.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 484,
          name: 'John Martinez',
          patternsSample:
            '111.205.212.9 -- [ 12/Mar/2025:19:30:54 +0000 ] "GET /bundle/99caa4295c2ef64a.js HTTP/1.1" 504 "http://www.kelley-mccullough.com/explore/tag/homepage/" "Mozilla/5.0 (compatible; MSIE 7.0; Windows 98; Trident/5.1)"\n[689261] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=689261\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 92.36.139.4:9092 could not be established. Broker may not be available.\n[6124574] Problem reaching database. Timeout http request GET https://ibm.box.com/s/069b6898ff25d781\nError occurred while calling aws lambda system- endpoint : https://c1b624c3a6.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 485,
          name: 'Ryan Brown',
          patternsSample:
            '29.18.68.178 -- [ 07/Jan/2025:15:11:47 +0000 ] "GET /bundle/697ea6e40899171d.js HTTP/1.1" 500 "http://hines.net/author.htm" "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.0; Trident/4.0)"\n[434490] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=434490\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 31.181.86.21:9092 could not be established. Broker may not be available.\n[7213520] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c66905bce6778541\nError occurred while calling aws lambda system- endpoint : https://3918f44963.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 486,
          name: 'Lee Lang',
          patternsSample:
            '133.209.145.137 -- [ 17/Jan/2025:02:59:35 +0000 ] "GET /bundle/accd1a44cf34e2fe.js HTTP/1.1" 504 "http://www.chan.biz/main/author.htm" "Mozilla/5.0 (Android 2.3.7; Mobile; rv:39.0) Gecko/39.0 Firefox/39.0"\n[887982] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=887982\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 57.5.34.36:9092 could not be established. Broker may not be available.\n[5179296] Problem reaching database. Timeout http request GET https://ibm.box.com/s/17217d68b68d7755\nError occurred while calling aws lambda system- endpoint : https://ccbaf2d95b.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 487,
          name: 'Bryan Smith',
          patternsSample:
            '158.170.222.2 -- [ 09/Jan/2025:14:33:22 +0000 ] "GET /bundle/b3200724f6da3fce.js HTTP/1.1" 403 "https://www.miller-davis.com/posts/blog/main/search/" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_10_5 rv:5.0; dz-BT) AppleWebKit/533.19.1 (KHTML, like Gecko) Version/5.0.4 Safari/533.19.1"\n[494640] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=494640\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 51.235.149.121:9092 could not be established. Broker may not be available.\n[2952862] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c74c34b94e0ef885\nError occurred while calling aws lambda system- endpoint : https://262800ba41.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 488,
          name: 'Kim Collins',
          patternsSample:
            '176.250.47.67 -- [ 19/Apr/2025:22:16:36 +0000 ] "GET /bundle/5a9566e93cd351b7.js HTTP/1.1" 200 "http://robinson.com/" "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_7_3 rv:4.0; fr-FR) AppleWebKit/533.22.6 (KHTML, like Gecko) Version/5.0.2 Safari/533.22.6"\n[693994] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=693994\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 203.42.232.202:9092 could not be established. Broker may not be available.\n[6243783] Problem reaching database. Timeout http request GET https://ibm.box.com/s/c06a6019c2e4446d\nError occurred while calling aws lambda system- endpoint : https://5a130a7250.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 489,
          name: 'Eric Huynh',
          patternsSample:
            '60.253.11.134 -- [ 02/Feb/2025:14:17:37 +0000 ] "GET /bundle/6ed6df005735b24d.js HTTP/1.1" 403 "http://johnston-smith.com/faq.html" "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_9_6 rv:3.0; hu-HU) AppleWebKit/532.5.2 (KHTML, like Gecko) Version/5.1 Safari/532.5.2"\n[352239] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=352239\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 84.215.114.200:9092 could not be established. Broker may not be available.\n[7368708] Problem reaching database. Timeout http request GET https://ibm.box.com/s/4dc6edf0d25d59b2\nError occurred while calling aws lambda system- endpoint : https://ae5f1b0d7e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 490,
          name: 'Steven Schwartz',
          patternsSample:
            '43.128.5.72 -- [ 07/Apr/2025:05:44:01 +0000 ] "GET /bundle/d37dd96fb01293b3.js HTTP/1.1" 403 "http://mccoy.info/search/explore/posts/author/" "Opera/8.62.(Windows CE; te-IN) Presto/2.9.189 Version/10.00"\n[526166] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=526166\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 123.157.223.125:9092 could not be established. Broker may not be available.\n[6213434] Problem reaching database. Timeout http request GET https://ibm.box.com/s/0425ad9297bda948\nError occurred while calling aws lambda system- endpoint : https://d0d6777d7a.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 491,
          name: 'John Cross',
          patternsSample:
            '157.140.194.209 -- [ 09/Feb/2025:07:34:38 +0000 ] "GET /bundle/99c8f1006b0a39cb.js HTTP/1.1" 504 "http://craig.biz/" "Mozilla/5.0 (Windows 98; Win 9x 4.90; fa-IR; rv:1.9.2.20) Gecko/2017-04-24 18:29:21 Firefox/3.8"\n[942554] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=942554\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 64.247.137.161:9092 could not be established. Broker may not be available.\n[6091896] Problem reaching database. Timeout http request GET https://ibm.box.com/s/11a285f4138d3caf\nError occurred while calling aws lambda system- endpoint : https://8779d07941.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 492,
          name: 'Mackenzie Patterson',
          patternsSample:
            '20.160.92.197 -- [ 30/Mar/2025:03:26:28 +0000 ] "GET /bundle/98639330d46917b8.js HTTP/1.1" 200 "http://www.curry-frost.info/" "Opera/8.95.(X11; Linux x86_64; lo-LA) Presto/2.9.182 Version/12.00"\n[930892] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=930892\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 178.231.108.89:9092 could not be established. Broker may not be available.\n[3498982] Problem reaching database. Timeout http request GET https://ibm.box.com/s/e4bbbe21c15062ef\nError occurred while calling aws lambda system- endpoint : https://db3e69083e.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 493,
          name: 'David Cunningham',
          patternsSample:
            '3.162.21.160 -- [ 11/Feb/2025:02:37:25 +0000 ] "GET /bundle/6104bdb525f36152.js HTTP/1.1" 500 "http://thompson.com/" "Mozilla/5.0 (X11; Linux i686) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/23.0.816.0 Safari/533.2"\n[298785] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=298785\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 38.23.157.74:9092 could not be established. Broker may not be available.\n[2555935] Problem reaching database. Timeout http request GET https://ibm.box.com/s/d538942fba5dc036\nError occurred while calling aws lambda system- endpoint : https://44f410c04d.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 494,
          name: 'Amy Brown',
          patternsSample:
            '111.6.203.39 -- [ 24/May/2025:21:46:01 +0000 ] "GET /bundle/085af517bc1bfd92.js HTTP/1.1" 200 "http://donaldson-fox.biz/tags/posts/tag/login/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0; rv:1.9.4.20) Gecko/2011-07-11 06:35:51 Firefox/7.0"\n[426957] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=426957\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 97.137.132.12:9092 could not be established. Broker may not be available.\n[6928755] Problem reaching database. Timeout http request GET https://ibm.box.com/s/3c9bbefff5a29aff\nError occurred while calling aws lambda system- endpoint : https://acbb27d1da.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 495,
          name: 'William Green',
          patternsSample:
            '184.99.116.159 -- [ 09/Feb/2025:21:06:03 +0000 ] "GET /bundle/cc0d1a3617c9e7b6.js HTTP/1.1" 504 "https://www.sanchez.biz/blog/blog/author/" "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_4 like Mac OS X) AppleWebKit/535.2 (KHTML, like Gecko) FxiOS/16.8j1980.0 Mobile/42H974 Safari/535.2"\n[894739] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=894739\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 122.113.166.217:9092 could not be established. Broker may not be available.\n[5236634] Problem reaching database. Timeout http request GET https://ibm.box.com/s/3b724155a02c33ee\nError occurred while calling aws lambda system- endpoint : https://dc4f445342.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 496,
          name: 'James Lewis',
          patternsSample:
            '136.116.209.12 -- [ 20/Jan/2025:00:57:21 +0000 ] "GET /bundle/4cb0e450fd4ba032.js HTTP/1.1" 500 "https://www.williams.biz/" "Opera/8.61.(X11; Linux i686; csb-PL) Presto/2.9.185 Version/11.00"\n[616441] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=616441\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 36.31.47.182:9092 could not be established. Broker may not be available.\n[7015937] Problem reaching database. Timeout http request GET https://ibm.box.com/s/b4ee27ef0b2ecfc5\nError occurred while calling aws lambda system- endpoint : https://f3171e0bad.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 497,
          name: 'Jerry Gonzalez DDS',
          patternsSample:
            '80.201.30.245 -- [ 02/May/2025:13:18:28 +0000 ] "GET /bundle/4c84eedef9a4144a.js HTTP/1.1" 500 "http://www.alvarado.biz/posts/app/explore/category.asp" "Mozilla/5.0 (Windows; U; Windows CE) AppleWebKit/531.6.6 (KHTML, like Gecko) Version/5.1 Safari/531.6.6"\n[799252] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=799252\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 169.109.193.192:9092 could not be established. Broker may not be available.\n[4859819] Problem reaching database. Timeout http request GET https://ibm.box.com/s/9ba7014baba801fd\nError occurred while calling aws lambda system- endpoint : https://a233d2eb26.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 498,
          name: 'Amanda Peterson',
          patternsSample:
            '95.61.51.193 -- [ 27/Jan/2025:10:17:46 +0000 ] "GET /bundle/1043633eea336c4c.js HTTP/1.1" 200 "http://www.moore.org/category.html" "Opera/9.57.(X11; Linux i686; bg-BG) Presto/2.9.181 Version/11.00"\n[879000] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=879000\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 73.68.196.20:9092 could not be established. Broker may not be available.\n[8228625] Problem reaching database. Timeout http request GET https://ibm.box.com/s/99a915e6bb5258e0\nError occurred while calling aws lambda system- endpoint : https://c1d4bb8eac.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        },
        {
          id: 499,
          name: 'Sarah Green',
          patternsSample:
            '105.32.63.148 -- [ 21/Mar/2025:11:02:26 +0000 ] "GET /bundle/2ede0e80a734365a.js HTTP/1.1" 403 "https://fernandez.com/" "Mozilla/5.0 (Windows NT 5.01; the-NP; rv:1.9.1.20) Gecko/2013-06-24 06:55:08 Firefox/10.0"\n[792837] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=792837\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 85.95.2.120:9092 could not be established. Broker may not be available.\n[9382248] Problem reaching database. Timeout http request GET https://ibm.box.com/s/62819888f2d94d9e\nError occurred while calling aws lambda system- endpoint : https://0513c8805b.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: false
        },
        {
          id: 500,
          name: 'Steven Montoya',
          patternsSample:
            '105.134.48.50 -- [ 07/Jan/2025:15:44:16 +0000 ] "GET /bundle/81b745c4fed7aa40.js HTTP/1.1" 403 "https://www.bryant.com/tag/search/search/author/" "Mozilla/5.0 (Linux; Android 3.2.1) AppleWebKit/536.2 (KHTML, like Gecko) Chrome/52.0.806.0 Safari/536.2"\n[293466] Problem building pdf. Timeout http request GET http://qotd-pdf.qotd-monitoring.svc.cluster.local:3005/pdf/373?requestToken=293466\n[Producer clientId=saas__serverless_acceptor-spans] Connection to node 1 (k8s-node.example) 176.11.93.212:9092 could not be established. Broker may not be available.\n[4656021] Problem reaching database. Timeout http request GET https://ibm.box.com/s/cb6e150b6d8ba7fb\nError occurred while calling aws lambda system- endpoint : https://f0a3b66953.lambda-url.us-west-1.on.aws/ message : 403 Forbidden: "{Message:null}"',
          status: true
        }
      ]
    },
    time: 0,
    adjustedWindowSize: null,
    resultPrecisionDetails: {
      resultPrecision: 'PRECISION_UNKNOWN'
    },
    errors: [],
    progress: {
      percentage: null,
      loading: false,
      note: null
    },
    backendTraceId: '99f035dadfed8731'
  }
};
