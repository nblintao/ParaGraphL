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

Describe how you are doing with respect to the goals and deliverables stated in your proposal. Do you still believe you will be able to produce all your deliverables? If not, why? What about the "nice to haves"? In your checkpoint writeup we want a new list of goals that you plan to hit for the Parallelism competition.

## Deliverables
What do you plan to show at the parallelism competition? Will it be a demo? Will it be a graph?

## Preliminary Results

We test the execution time of the baseline implementation on a MacBook with a 1.3GHz dual-core Intel Core m7 processor. We run 100, 200, 300, 400 and 500 iterations of the baseline algorithm on three graphs, each with 5242 vertices and 7000, 15000, 28980 edges. The result is shown in the following figure:

As shown in the figure, the execution time increases linearly with the number of iterations. But the algorithm runs much slower on a dense graph than a relatively sparse graph. We conclude that this is because we need to iterate through each edge to compute the attraction force of the vertices and this is the most time-consuming part of the computation. We also find that this part can be parallelized, so we believe that our GPU implementation will have a decent speedup.

## Issues
It can be tricky to control the workload. If we are going to design and optimize for another more complex layout algorithm, the workload might be too large to finish elegantly. If not, the workload may be not large enough to get us into selected presentations.