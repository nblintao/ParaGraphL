# ParaGraphL Proposal
## Contibutors
- Tao Lin (<tao.lin@cs.cmu.edu>)
- Bowei Chen (<boweic@andrew.cmu.edu>)

## Summary

We are going to impelement a JavaScript framwork for calculating the layout for large-scale graphs in the web platform. This framework will utize GPUs as the main computation resources by impelementing graph layout alogrithms in WebGL and GLSL.

## Background
Visualization can help make better sense of the underlying information for graph data like social networks. Layout is an essential part of visulization. A good layout algorithm will project the nodes in the graph into a 2-D plane, and the distance between two nodes in that plane should indicate the connection strength between them. [Force-directed graph](https://en.wikipedia.org/wiki/Force-directed_graph_drawing) is a popular class of graph layout algorithms. This is a visualization of links between pages on a wiki using a force-directed layout (from WikiPedia):

![](https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Visualization_of_wiki_structure_using_prefuse_visualization_package.png/600px-Visualization_of_wiki_structure_using_prefuse_visualization_package.png)

## The Challenge
The graph layout algorithm could be considered as an iterative graph algorithm which needs a lot of communications between nodes, for which CUDA or GraphLab could be used to optimize parallelization and synchronization. The greatest challenge is that there is no standard general purpose parallel programming model (like CUDA) in web platforms.

[WebGL](https://en.wikipedia.org/wiki/WebGL) is a JavaScript API for rendering 3D graphics with GPUs in modern browsers, but it only supports the interfaces for computer graphics. We will try to use WebGL as a general purpose computing engine, with the help of libraries like [turbo.js](https://turbo.github.io/) and [gpgpu.js](https://github.com/amoffat/gpgpu.js). The basic idea of these libraries is to map a thread to a pixel, and then use [GLSL](https://en.wikipedia.org/wiki/OpenGL_Shading_Language) (OpenGL Shading Language) to describe the operations for each thread. These libraries have every simple abstractions and interface and thus may not get enough performance as raw WebGL.

Another challenge is that the pattern of the workload is different from common graph algorithms. The graph layout algorithms need a lot of iterations before converge. In each iteration, each node will need to get the position and strength of other nodes. Different from a lot of graph algorithms, a node in graph layout algorithms not only needs the data of the adjacent nodes but also need the data of other nodes in the graph. This makes the communication to computation ration higher and makes the optimization more tricky. However, the execution pattern can be less divergent than common graph algorithms.

Another challenge is the huge design space of graph layout algorithms. Instead of optimizing for determining algorithms in the previous assignments (like BFS and Page Rank), there is a huge set of graph layout algorithms. A recent survey paper summarized different behaviors of 19 kinds of two-dimensional graph layout techniques considering performance, graph drawing principles, and size. We need to choose several most suitable algorithms for our platform before parallelizing them.

## Resouces

### Devices
We are going to develop this project on our own laptops. Since this library is aimed at accelerating for mainstream PC/Mac, we don't need special machines.

### Papers and Articles
- Gibson, Helen, Joe Faith, and Paul Vickers. "A survey of two-dimensional graph layout techniques for information visualisation." Information visualization 12.3-4 (2013): 324-357.
- Godiyal, Apeksha, et al. "Rapid multipole graph drawing on the GPU." International Symposium on Graph Drawing. Springer Berlin Heidelberg, 2008.
- [Large-scale Graph Visualisations in the Browser](http://slides.com/nicolasjoseph/largescalevis#/)
- [Unleash Your Inner Supercomputer: Your Guide to GPGPU with WebGL](http://www.vizitsolutions.com/portfolio/webgl/gpgpu/)

### Code Base
We will start from scratch, can we will mainly focus on implementing the core part (layouting large graph in parallel with WebGL). But the following libraries may be considered as comparisons or helpers.

### Libraries
#### Visualization
- [d3.js](https://d3js.org/)
- [echarts.js](http://echarts.baidu.com/)
- [sigma.js](http://sigmajs.org/)

#### WebGL as GPGPU
- [turbo.js](https://turbo.github.io/)
- [gpgpu.js](https://github.com/amoffat/gpgpu.js)

## Goals and Deliverables

### Plan to Achive

At the beginning, we will implement a test harness and baseline reference. The baseline reference can be visualizing large graphs with [D3](https://d3js.org/), a popular JavaScript library for visualization.

Then, we will design and/or implement several graph layout algorithms with GLSL, and then test and optimize them using the harness above. Some great graph layout algorithms are have never been implemented in parallel before, while others may be designed for parallel computing but have different tradeoff from our platform, which meaning there is a large design space and need to be well tuned.

We cannot give a clear target how much speedup we will get, but we will try our best to ultize the knowledege and experience we got in this course, and get the performance as good as possible.

We will also optimize for other parts of the framework other than layout. One important thing is to speed up the rendering because this can be a bottleneck after speeding up layout calculations. We also need to improve the user interfaces and documents of our framework.

In the demo, we will show a web page that visualize large-scale graphs with our library (several different layout algorithms can be chosen), and then compare it with popular vsiaulzation libraries which do not utilize GPUs. We will also show a speedup graph of our library compared to other popular libraries.

### Hope to Achive
Current GPGPU libraries for WebGL have every simple abstractions and interfaces and thus may not produce enough performance as raw WebGL.
We will try to hack more aggressive optimizations to exploit the parallel ability of GPUs, if the efficiency of current libraries cannot meet our requirement. This may speedup our layout algorithms further more.

If we have learned some generalizable ideas during hacking WebGL, we may also create a better general purpose computing framework on WebGL and open source it.


### Demo


## Platform Choice

It is a common desire of data scientists and some artists to visualize, interact, and analyze large-scale graphs on a web platform. Honestly, running on browsers with JavaScript is not the most efficient platform to calculate the layout of large graphs, considering some great graph visualization software like [Gephi](https://gephi.org/). But browsers is a popular visualization platform because of the cost of deployment and maintenance and other business and engineering reasons ([Why in the browser?](http://slides.com/nicolasjoseph/largescalevis#/5)). It would be fascinating if an end user could visualize and interactive with large-scale graphs by simply opening a web page without any installment or configuration.

The core part of our code is going to be writtern in GSLS, which could be integrated with WebGL to better utilze GPUs.

## Schedule

### Week 1 (04/10 - 04/16)
Implement a test harness and baseline reference. The baseline reference can be visualizing large graphs with [D3](https://d3js.org/), a popular JavaScript library for visualization. Also, the framework for invoking GLSL with WebGL will be implemented.
### Week 2 (04/17 - 04/23)
Implement one or two graph layout algorithms with GLSL, and then test and optimize them using the harness above.
### Week 3 (04/24 - 04/30)
Hack more aggressive optimizations to exploit the parallel ability of GPUs. Or try to design and implement other graph layout algorithms suitable for the features of WebGL and GLSL.
### Week 4 (05/01 - 05/07)
Optimize for other parts of the framework other than layout. One important thing is to speed up the rendering because this can be a bottleneck after speeding up layout calculations. We also need to improve the user interfaces and documents of our framework.
