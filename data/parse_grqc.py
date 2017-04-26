import json
with file('ca-GrQc.txt', 'r') as text:
    all_lines = text.readlines()
    all_lines = all_lines[5:]
    n_all_edge = len(all_lines)
    print('All edges: %d' % n_all_edge)
    n_edge = input('Sample edges: ')
    if n_edge == 0: n_edge = n_all_edge
    graph = {'nodes':[], 'links':[]}
    nodes = set()
    for i in range(0, n_edge):
        line = all_lines[i]
        src, tar = line.strip().split()
        link = {'source': src, 'target': tar, 'value': 1}
        graph['links'].append(link)
        nodes.add(src)
        nodes.add(tar)
    for node in nodes:
        node_info = {'id': node, 'group':1}
        graph['nodes'].append(node_info)
    output = 'var graph = ' + json.dumps(graph)
    with file('grqc_auto.js', 'w') as out:
        out.write(output)

    print len(nodes)

