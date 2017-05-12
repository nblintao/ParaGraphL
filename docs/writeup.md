---
title: ParaGraphL
---
# Summary

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

Since the computation between nodes are independent in each iteration and a large portion of the memory read can be sequential if we optimize the memory layout, the algorithm is extremely suitable for SPMD program that runs on GPU. 

##Approach 

The
If we put the coordinates for nodes together then followed by edges for each nodes in the global memory, we perform sequential read when computing the repulsive force and when scannig through edge arrays for each node. Thus the program exploits data locality.

## Results
// TODO
We have achieved significant speedup, compared to an implementation without WebGL on [Fruchterman Reingold graph layout algorithm](https://github.com/gephi/gephi/wiki/Fruchterman-Reingold). To our knowledge, we are the first one who implements graph layout algorithms with WebGL.

We test the program multiple times on a graph with 100, 500, 1000 edges and get the average runtime. The error is within 3%. We could achieve about 32x speedup for the layout of a graph with 500 edges in 10000 iterations on New MacBook. Furthermore, we get 75x speedup for a graph with 1000 edges in 10000 iterations.


![](https://docs.google.com/spreadsheets/d/1_oFw0mLP40VYmBR3hsil_GXz2kpFIqRnAGwQcRqrzoE/pubchart?oid=1497158958&format=image)

# References

# Contributors
- Tao Lin (<tlin2@andrew.cmu.edu>)
- Bowei Chen (<boweic@andrew.cmu.edu>)

# [Proposal](https://nblintao.github.io/ParaGraphL/proposal)

# [Checkpoint](https://nblintao.github.io/ParaGraphL/checkpoint)
