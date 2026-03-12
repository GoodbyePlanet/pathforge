# Model Context Protocols (MCPs)

Model Context Protocols are standardized schemas for structuring the information passed to a language model — system instructions, retrieved documents, tool results, and conversation history.

## Purpose

Without a shared protocol, every application invents its own way to assemble context. MCPs provide a common contract so that tools, agents, and models can interoperate.

## Relationship to Context Window

MCPs are designed with the [[context-window]] in mind. A well-designed protocol prioritizes the most relevant content and trims low-signal data to stay within token limits.

## Relationship to RAG

In [[rag]] pipelines, MCPs define how retrieved documents are labeled, ranked, and injected into the prompt — ensuring the model can distinguish retrieved context from the original query.