---
title: ParaGraphL Checkpoint
---

# ParaGraphL Checkpoint
## Contibutors
- Tao Lin (<tlin2@andrew.cmu.edu>)
- Bowei Chen (<boweic@andrew.cmu.edu>)

## Detailed Schedule

Make sure your project schedule on your main project page is up to date with work completed so far, and well as with a revised plan of work for the coming weeks. As by this time you should have a good understanding of what is required to complete your project, I want to see a very detailed schedule for the coming weeks. I suggest breaking time down into half-week increments. Each increment should have at least one task, and for each task put a person's name on it.

## Work Completed
One to two paragraphs, summarize the work that you have completed so far. (This should be easy if you have been maintaining this information on your project page.)

## Goals

Describe how you are doing with respect to the goals and deliverables stated in your proposal. Do you still believe you will be able to produce all your deliverables? If not, why? What about the "nice to haves"? In your checkpoint writeup we want a new list of goals that you plan to hit for the Parallelism competition.

## Deliverables
What do you plan to show at the parallelism competition? Will it be a demo? Will it be a graph?

## Preliminary Results

We test the execution time of the baseline implementation on a Macbook with a 1.3GHz dual-core Intel Core m7 processor. We run 100, 200, 300, 400 and 500 iterations of the baseline algorithm on three graphs, each with 5242 vertices and 7000, 15000, 28980 edges. The result is shown in the following figure:

As shown in the figure, the execution time increases linearly with the number of iterations. But the algorithm runs much slower on a dense graph than a relatively sparse graph. We conclude that this is because we need to iterate through each edge to compute the attraction force of the vertices and this is the most time consuming part in the computation. We also find that this part can be parallelized, so we believe that our GPU implementation will have decent speedup.

## Issues
List the issues that concern you the most. Are there any remaining unknowns (things you simply don't know how to solve, or resource you don't know how to get) or is it just a matter of coding and doing the work? If you do not wish to put this information on a public web site you are welcome to email the staff directly.
