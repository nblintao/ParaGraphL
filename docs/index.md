---
title: ParaGraphL
---
## Why we should be a finalist?

We implemented a JavaScript framework for calculating the layout for large-scale graphs in the web platform. We use the GLSL on WebGL to do general purpose computation for the graph layout algorithm.

This is a significant feature for data scientists, artists, journalists who would to visualize and analysis large-scale graph efficiently in an interactive manner. They want to access it across all platforms by just opening a webpage, instead of installing a software like [Gephi](https://gephi.org/).

### Major Technical Challenges
- WebGL is not designed for general computing. We need to ha
- GLSL in WebGL has an old version than OpenGL. It does not support features like atomic add.
- Computing resources like texture size (used as a shared memory) is limited.
- GPGPU libraries we proposed like [turbo.js](https://turbo.github.io/) doesn't work well. We finally had to deal with complicated WebGL APIs by ourselves.

### Preliminary Result
We have achieved significant speedup, compared to an implementation without WebGL on [Fruchterman Reingold graph layout algorithm](https://github.com/gephi/gephi/wiki/Fruchterman-Reingold). To our knowledge, we are the first one who implements graph layout algorithms with WebGL.

### Plan for Friday

## Contibutors
- Tao Lin (<tlin2@andrew.cmu.edu>)
- Bowei Chen (<boweic@andrew.cmu.edu>)

## [Proposal](https://nblintao.github.io/ParaGraphL/proposal)

## [Checkpoint](https://nblintao.github.io/ParaGraphL/checkpoint)
