---
title: ParaGraphL Checkpoint
---

# ParaGraphL Checkpoint
## Contibutors
- Tao Lin (<tlin2@andrew.cmu.edu>)
- Bowei Chen (<boweic@andrew.cmu.edu>)

## Detailed Schedule

### 04/24 - 04/27
Benchmark on the efficiency of Fruchterman-Reingold layout algorithm. Familiar with the implementation of this algorithm.
### 04/28 - 04/30
Implement parallelized Fruchterman-Reingold layout algorithms with GLSL, and then test and compare with the one without being parallelized.
### 05/01 - 05/04
Hack more aggressive optimizations to exploit the parallel ability of GPUs. Or try to design and implement other graph layout algorithms suitable for the features of WebGL and GLSL.
### 05/05 - 05/07
Optimize for other parts of the framework other than layout. One important thing is to speed up the rendering because this can be a bottleneck after speeding up layout calculations.
### 05/08 - 05/11
Improve the user interfaces and documents of our framework.

## Work Completed
Implemented a graph generator which samples from a large real word graph. Build pages to visualize the layout of the graph. Implemented the timing logic to measure the performance of different algorithms and implementations.

Integreted three force-directed layout algorithms for reference:
- [Velocity Verlet integration layout with d3.js framework](https://github.com/d3/d3-force)
- [ForceAtlas2 layout with sigma.js framework](https://github.com/jacomyal/sigma.js/tree/master/plugins/sigma.layout.forceAtlas2)
- [Fruchterman-Reingold layout with sigma.js framework](https://github.com/Linkurious/linkurious.js/tree/master/plugins/sigma.layouts.fruchtermanReingold)

## Goals
We still believe we will be able to produce all our deliverables. For the "nice to haves" goals, we still believe we can hack more aggressive optimizations to exploit the parallel ability of GPUs. But it is less likely to create a new GPGPU libraries for WebGL computations because our design is not that general, and we would like to put our effort into making a specific task (i.e. layout) better.

### Plan to Achieve

At the beginning, we will implement a test harness and baseline reference. The baseline reference can be visualizing large graphs with [D3](https://d3js.org/), a popular JavaScript library for visualization.

Then, we will design and/or implement several graph layout algorithms with GLSL, and then test and optimize them using the harness above. Some great graph layout algorithms are have never been implemented in parallel before, while others may be designed for parallel computing but have different tradeoff from our platform, which meaning there is a large design space and need to be well tuned.

We will also optimize for other parts of the framework other than layout. One important thing is to speed up the rendering because this can be a bottleneck after speeding up layout calculations. We also need to improve the user interfaces and documents of our framework.

### Hope to Achieve
Current GPGPU libraries for WebGL have every simple abstractions and interface and thus may not produce enough performance as raw WebGL.

We will try to hack more aggressive optimizations to exploit the parallel ability of GPUs if the efficiency of current libraries cannot meet our requirement. This may speed up our layout algorithms further more.

## Deliverables
In the demo, we will show a webpage that visualizes large-scale graphs with our library (several different layout algorithms can be chosen), and then compare it with popular visualization libraries which do not utilize GPUs. We will also show a speedup graph of our library compared to other popular libraries.

## Preliminary Results

We test the execution time of the baseline implementation on a MacBook with a 1.3GHz dual-core Intel Core m7 processor. We run 100, 200, 300, 400 and 500 iterations of the baseline algorithm on three synthetic graphs, the smallest graph has 2534 vertices and 7000 edges, the medium size graph has 4164 vertices and 15000 edges and the largest graph with 5254 vertices and  28980 edges. The result is shown in the following figure:
![](https://raw.githubusercontent.com/nblintao/ParaGraphL/master/docs/baseline_benchmark.png "Baseline Benchmark")

As shown in the figure, the execution time increases linearly with the number of iterations. But the algorithm runs much slower as the size of the graph grows. We conclude that this is because when computing repulsion force, we need to iterate over each pair of the vertices, resulting in a quadratic time algorithm.

We believe that our GPU implementation will get decent speedup for two reasons. Firstly, computing the forces between vertices and updating the speed can be parallelized. Moreover, we can optimize the algorithm by applying a Quad-Tree to get even better performance.

Fruchterman-Reingold Layout with sigma.js:
![](https://raw.githubusercontent.com/nblintao/ParaGraphL/master/docs/graph_layout.png "Graph Layout")

## Issues
It can be tricky to control the workload. If we are going to design and optimize for another more complex layout algorithm, the workload might be too large to finish elegantly. If not, the workload may be not large enough to get us into selected presentations.
