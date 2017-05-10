---
title: ParaGraphL
---
# Why we should be a finalist?

We implemented a JavaScript framework for calculating the layout for large-scale graphs in the web platform. We use the GLSL on WebGL to do general purpose computation for the graph layout algorithm.

This is a significant feature for data scientists, artists, and journalists, who would love to visualize and analysis large-scale graph efficiently in an interactive manner. They want to access it across all platforms by just opening a web page, instead of installing a software like [Gephi](https://gephi.org/).

## Major Technical Challenges
- WebGL is not designed for general computing. Especially, it does not support fine-grained scheduling assignment like CUDA. We hacked to transform our problem to a graphics problem.
- GLSL in WebGL is in an older version than OpenGL. It does not support features like atomic add, compare and swap.
- Computing resources like texture size (used as a shared memory) is limited by software and/or hardware.
- GPGPU libraries we proposed before (like [turbo.js](https://turbo.github.io/)) doesn't work well. We finally had to deal with complicated WebGL APIs by ourselves.

## Preliminary Result
We have achieved significant speedup, compared to an implementation without WebGL on [Fruchterman Reingold graph layout algorithm](https://github.com/gephi/gephi/wiki/Fruchterman-Reingold). To our knowledge, we are the first one who implements graph layout algorithms with WebGL.

We test the program multiple times on a graph with 100, 500, 1000 edges and get the average runtime. The error is within 3%. We could achieve about 32x speedup for the layout of a graph with 500 edges in 10000 iterations on New MacBook. More detailed speed graph is coming soon.


![](https://docs.google.com/spreadsheets/d/1_oFw0mLP40VYmBR3hsil_GXz2kpFIqRnAGwQcRqrzoE/pubchart?oid=1497158958&format=image)

## Plan for Friday
- A cool live demo for visualizing a large-scale graph on a web page (It could be more exciting to show this by providing a short URL and let everyone present view on their laptops)
- A speedup benchmark graph like the one shows above. It would be an even better speedup since we will apply more optimizations before Friday.

# Contributors
- Tao Lin (<tlin2@andrew.cmu.edu>)
- Bowei Chen (<boweic@andrew.cmu.edu>)

# [Proposal](https://nblintao.github.io/ParaGraphL/proposal)

# [Checkpoint](https://nblintao.github.io/ParaGraphL/checkpoint)
