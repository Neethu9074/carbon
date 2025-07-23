import json
file = open('uiClientDepAll.txt', 'r')
file.seek(0)
map = dict()
mapReverse = dict()
mapPath = dict()
def addNode(value, node):
    if map.get(node) == None:
        map[node] = list()
    map[node].append(value)
    if mapReverse.get(value) == None:
        mapReverse[value] = list()
    mapReverse[value].append(node)
def addPath(path):
    paths = path.split("/")
    cNode = mapPath
    for part in paths:
        if part not in cNode:
            cNode[part] = {}
        cNode = cNode[part]

node = 'root'
for line in file:
    if line.startswith(" "):
        addNode(line.strip(), node)
    elif not line.startswith("Processed"):
        node = line.strip()
        if node:
          addPath(node)
file.close()
with open('uiClientDep.json', 'w') as file:
    json.dump(map, file)
with open('uiClientDepRev.json', 'w') as file:
    json.dump(mapReverse, file)
with open('uiClientPaths.json', 'w') as file:
    json.dump(mapPath, file)
