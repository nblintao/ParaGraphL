# ParaGraphL Proposal
## Contibutors
- Tao Lin (<tao.lin@cs.cmu.edu>)
- Bowei Chen (<boweic@andrew.cmu.edu>)

## Summary

We are going to utilize GPU to accelerate several large graph layout algorithms using GLSL, and finally produce a javascript library.

## Background

It is a common desire of data scientists and some artists to visualize, interact, and analyze large-scale graphs on a web platform. Honestly, running on browsers with JavaScript is not the most efficient platform to calculate the layout of large graphs, considering some great graph visualization software like [Gephi](https://gephi.org/). But browsers is a popular visualization platform because of the cost of deployment and maintenance and other business and engineering reasons ([Why in the browser?](http://slides.com/nicolasjoseph/largescalevis#/5)). It would be fascinating if an end user could visualize and interactive with large-scale graphs by simply opening a web page without any installment or configuration.


## The Challenge
Describe why the problem is challenging. What aspects of the problem might make it difficult to parallelize? In other words, what to you hope to learn by doing the project?

- Describe the workload: what are the dependencies, what are its memory access characteristics? (is there locality? is there a high communication to computation ratio?), is there divergent execution?
- Describe constraints: What are the properties of the system that make mapping the workload to it challenging?

## Resouces

We are going to develop this project on our own laptops. We will start from scratch. There are several papers we are going to use as reference when implementing these graph layout algorithms. Since this library is aimed at accelerating for mainstream PC/Mac, we don't need special machines.

## Goals and Deliverables

### Plan to Achive
Finish GPU implementations of different graph layout algorithms, compare the performance with current CPU librarys.

### Hope to Achive

### Demo
We will show the webpage that utilize our library to generate layouts for large graphs, and we will also show the speedup graph of our library comparing with other CPU libraries.

## Platform Choice

We will code in GSLS, since it is suitable for developing a library for graphics related work.

## Schedule

### Week 1 (04/10 - 04/16)
Implement a test harness and baseline reference. The baseline reference can be visualizing large graphs with [D3](https://d3js.org/), a popular JavaScript library for visualization. Also, the framework for invoking GLSL with WebGL will be implemented.
### Week 2 (04/17 - 04/23)
Implement one or two graph layout algorithms with GLSL, and then test and optimize them using the harness above.
### Week 3 (04/24 - 04/30)
Hack more aggressive optimizations to exploit the parallel ability of GPUs. Or try to design and implement other graph layout algorithms suitable for the features of WebGL and GLSL.
### Week 4 (05/01 - 05/07)
Optimize for other parts of the framework other than layout. One important thing is to speed up the rendering because this can be a bottleneck after speeding up layout calculations. We also need to improve the user interfaces and documents of our framework.
