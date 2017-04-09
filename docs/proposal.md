# ParaGraphL Proposal
## Contibutors
- Tao Lin (<tao.lin@cs.cmu.edu>)
- Bowei Chen (<boweic@andrew.cmu.edu>)

## Summary

We are going to utilize GPU to accelerate several large graph layout algorithms using GLSL, and finally produce a javascript library.

## Background

It is a common desire of data scientists and some artists to visualize, interact, and analyze large-scale graphs on a web platform. Honestly, running on browsers with JavaScript is not the most efficient platform to calculate the layout of large graphs, considering some great graph visualization software like [Gephi](https://gephi.org/). But browsers is a popular visualization platform because of the cost of deployment and maintenance and other reasons ([Why in the browser?](http://slides.com/nicolasjoseph/largescalevis#/5)). It would be fascinating if an end user could visualize and interactive with large-scale graphs by simply opening a web page without any installment or configuration.


## The Challenge
Describe why the problem is challenging. What aspects of the problem might make it difficult to parallelize? In other words, what to you hope to learn by doing the project?

- Describe the workload: what are the dependencies, what are its memory access characteristics? (is there locality? is there a high communication to computation ratio?), is there divergent execution?
- Describe constraints: What are the properties of the system that make mapping the workload to it challenging?

## Resouces

We are going to develop this project on our own laptops. We will start from scratch. There are several papers we are going to use as reference when implementing these graph layout algorithms. Since this library is aimed at accelerating for mainstream PC/Mac, we don't need special machines.

## Goals and Deliverables

PLAN TO ACHIVE : finish GPU implementations of different graph layout algorithms, compare the performance with current CPU librarys.

HOPE TO ACHIVE :

THE DEMO : We will show the webpage that utilize our library to generate layouts for large graphs, and we will also show the speedup graph of our library comparing with other CPU libraries.

## Platform Choice

We will code in GSLS, since it is suitable for developing a library for graphics related work.

# Schedule
Produce a schedule for your project. Your schedule should have at least one item to do per week. List what you plan to get done each week from now until the parallelism competition in order to meet your project goals. Keep in mind that due to other classes, you'll have more time to work some weeks than others (work that into the schedule). You will need to re-evaluate your progress at the end of each week and update this schedule accordingly. Note the intermediate checkpoint deadline is April 16th. In your schedule we encourage you to be precise as precise as possible. It's often helpful to work backward in time from your deliverables and goals, writing down all the little things you'll need to do (establish the dependencies!).
