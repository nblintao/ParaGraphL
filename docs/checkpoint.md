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
One to two paragraphs, summarize the work that you have completed so far. (This should be easy if you have been maintaining this information on your project page.)

## Goals

Describe how you are doing with respect to the goals and deliverables stated in your proposal. Do you still believe you will be able to produce all your deliverables? If not, why? What about the "nice to haves"? In your checkpoint writeup we want a new list of goals that you plan to hit for the Parallelism competition.

## Deliverables
What do you plan to show at the parallelism competition? Will it be a demo? Will it be a graph?

## Preliminary Results

We test the execution time of the baseline implementation on a Macbook with a 1.3GHz dual-core Intel Core m7 processor. We run 100, 200, 300, 400 and 500 iterations of the baseline algorithm on three synthetic graphs, the smallest graph has 2534 vertices and 7000 edges, the medium size graph has 4164 vertices and 15000 edges and the largest graph with 5254 vertices and  28980 edges. The result is shown in the following figure:

As shown in the figure, the execution time increases linearly with the number of iterations. But the algorithm runs much slower as the size of the graph grows. We conclude that this is because when computing repulsion force, we need to iterate over each pair of the vertices, resulting in a quadratic time algorithm.

We believe that our GPU implementation will get decent speedup for two reasons. Firstly, computing the forces between vertices and updating the speed can be parallelized. Moreover, we can optimize the algorithm by applying a Quad-Tree to get even better performance.

## Issues
List the issues that concern you the most. Are there any remaining unknowns (things you simply don't know how to solve, or resource you don't know how to get) or is it just a matter of coding and doing the work? If you do not wish to put this information on a public web site you are welcome to email the staff directly.
