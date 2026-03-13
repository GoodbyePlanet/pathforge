# Planning

Planning is the process of decomposing a high-level goal into a sequence of concrete, executable steps. For AI agents, planning is what separates single-turn responses from multi-step autonomous work.

## Why Planning Is Hard

Language models generate text token by token without lookahead. They can produce a plan, but executing that plan over many steps requires maintaining state, handling failures, and revising when the environment changes — challenges the model wasn't explicitly trained for.

## Planning Approaches

**ReAct (Reason + Act)** — interleave reasoning traces with tool calls. The model thinks about what to do, does it, observes the result, and repeats. Simple and effective for shallow task graphs.

**Plan-and-Execute** — generate a full plan upfront, then execute each step. Works well for predictable tasks; brittle when early steps fail.

**Tree of Thoughts** — explore multiple possible next steps, evaluate their promise, and backtrack when a path fails. More robust but computationally expensive.

**Hierarchical planning** — break goals into sub-goals recursively. A high-level planner coordinates specialized sub-agents.

## Key Challenges

**Error recovery** — what does the agent do when a step fails? Naive agents get stuck in loops; good planners detect failure and revise.

**Context management** — long plans accumulate results that fill the context window. Memory systems offload information to keep the context focused.

**Evaluation** — measuring plan quality is hard. End-to-end success rate is the clearest signal, but intermediate step quality matters too.