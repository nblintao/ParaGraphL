---
title: Final Write-up
---
# Final Write-up

## Summary

We implemented a JavaScript framework for calculating the layout for large-scale graphs in the web platform. We use the GLSL on WebGL to do general purpose computation for the graph layout algorithm.

This is a significant feature for data scientists, artists, and journalists, who would love to visualize and analysis large-scale graph efficiently in an interactive manner. They want to access it across all platforms by just opening a web page, instead of installing a software like [Gephi](https://gephi.org/).

## Usage

**configure**

Change the configuration of the layout

```js
var listener = sigma.layouts.fruchtermanReingoldGL.configure(sigInst, config);
```

**start**

Start the layout algorithm

```js
var listener = sigma.layouts.fruchtermanReingoldGL.start(sigInst, config);
```

**isRunning**

Return true if the algorithm is running

```js
sigma.layouts.fruchtermanReingoldGL.isRunning(sigInst);
```

**progress**

Return the percentage of the iterations done 0% - 100%

```js
sigma.layouts.fruchtermanReingoldGL.progress(sigInst);
```

## Background

Graph layout algorithms take a series of nodes' coordinates and edges as input, iteratively update the position of each node. These algorithms execute for some iterations or until convergence.

We are utilizing Fruchterman Reingold layout algorithm. In one iteration, each node will compute a repulsive force by accessing the positions of all other nodes, and an attractive force by accessing the positions of connected nodes, and then add gravity and speed to get a new position.

Since the computation between nodes is independent in each iteration and a large portion of the memory read can be sequential if we optimize the memory layout, the algorithm is extremely suitable for SPMD program that runs on GPU.

## Approach

We utilize the interface of WebGL library to do general purpose computations for the layout, the renderer library is sigma.js, which is also based on WebGL.

WebGL is not designed for general purpose computation, it's a renderer library. It works as follow: in each iteration, a shader program takes an array of input pixels, performs computation and writes to an output pixel. To perform the computation of the layout algorithm, we need to design proper data structures and workflows under this computation framework.

![](https://raw.githubusercontent.com/nblintao/ParaGraphL/master/docs/WebGLFlow.png "WebGLFlow")

Layout algorithms are iterative, in each iteration, we need to update the X & Y coordination for each node. We're utilizing WebGL by generating a shader program for each node that takes the output of previous iteration's computation as input and updates the X & Y coordination to the output pixel.

[// TODO image]

Another issue is that the memory is limited for the GPU in our laptops. We aim at generating graph layouts for graphs containing tens of thousands of nodes, so in order for the nodes and edges of the graph to fit into the memory of the GPU, we need to optimize the memory layout of the graph. Our optimized memory layout will be shown in several paragraphs.

We currently utilize Fruchterman Reingold algorithm. In each iteration, each node applies three types of forces, repulsive force, attractive force and gravity, then update the X & Y coordination respectively. The repulsive force is applied to each pair of nodes to keep them from getting too close, the attractive force is applied to each edge to pull the source node and destination node towards each other and the gravity pull each node towards the origin, which prevents clusters from getting too far from each other. This computation is memory bound because the most time-consuming computation is when applying the repulsive force for each node which performs 10 float-point arithmetic operations on four 32-bit reads.

![](https://raw.githubusercontent.com/nblintao/ParaGraphL/master/docs/Algorithm.png "Algorithm")

The memory layout is shown in the picture below. Each box in the array is a pixel that contains four 32-bit float which stands for r, g, b, and a. We pack the data structure for nodes together and store them at the beginning of the input array, each pixel stores a node's data. Edges are following the nodes in the array. The edges for each node are stored together and placed in the array in the same order as the corresponding nodes. Each pixel for a node store the X & Y coordinations, the offset of the edges of the node in the array and the number of edges. Each edge only needs to store the destination node id, which is a 32-bit value.

![](https://raw.githubusercontent.com/nblintao/ParaGraphL/master/docs/Layout.png "Layout")

This memory layout gives us several benefits. First, most of the memory access are sequential reads, and there's little divergent execution. Because when we compute the repulsive force for different nodes, we access all other node's data structure in the same sequential order. When we compute the attractive force for a node, the edge array for adjacent nodes are stored together in the array, we perform sequential read here for most of the time. We do random read-only when we need to access neighbor's coordinates, but that's infrequent compared to the sequential reads. Since the computation is memory bound, the design exploits data locality and thus provides us decent speedup.

// TODO the workflow. Sry, not enough time.

## Results
// TODO
We have achieved significant speedup, compared to an implementation without WebGL on [Fruchterman Reingold graph layout algorithm](https://github.com/gephi/gephi/wiki/Fruchterman-Reingold). To our knowledge, we are the first one who implements graph layout algorithms with WebGL.

We test the program multiple times on a graph with 100, 500, 1000 edges and get the average runtime. The error is within 3%. We could achieve about 32x speedup for the layout of a graph with 500 edges in 10000 iterations on New MacBook. Furthermore, we get 75x speedup for a graph with 1000 edges in 10000 iterations.

![](https://nblintao.github.io/ParaGraphL/figure/edge.svg)

![](https://nblintao.github.io/ParaGraphL/figure/edge_layout.svg)

![](https://nblintao.github.io/ParaGraphL/figure/iteration.svg)

![](https://nblintao.github.io/ParaGraphL/figure/layout.svg)


The original data of two figures above could be viewed at [Google Sheets](https://docs.google.com/spreadsheets/d/1t5Egy3CGMco7_EZiTyODTtaexcrO11UQ0YUMZgRgo30/edit?usp=sharing).

# References

# Contributors
- Tao Lin (<tlin2@andrew.cmu.edu>)
- Bowei Chen (<boweic@andrew.cmu.edu>)

# [Proposal](https://nblintao.github.io/ParaGraphL/proposal)

# [Checkpoint](https://nblintao.github.io/ParaGraphL/checkpoint)
