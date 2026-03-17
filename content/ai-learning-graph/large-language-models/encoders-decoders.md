---
title: "Encoders, Decoders, Encoder-decoder models"
assignee: Nemanja Vasic
status: done
---

# Encoders, Decoders, Encoder-decoder models

## Problem

Understand the difference between encoders and decoders, encoder-decoder models.
Why it is important to know about them.
Which are used for which tasks (e.g. text classification, summarization, text generation, etc.)?

### Encoders

Encoder models are designed for taking the input text and understanding and extracting relevant information from the
input. The result or output of the encoder is a contextual vector representation of the input text (embeddings).
These models are best suited for tasks where understanding of the full sentence is required, such as text classification.

### Decoders

Decoder models are designed for text generation tasks. They are trained on a large corpus of text and are able to generate
new text by predicting one token at a time.

### Encoder-decoder models

Encoder-decoder models combine both components—the encoder processes the input into a contextual representation,
and the decoder uses that representation to generate new output text. This makes them ideal for tasks like translation
and summarization, where the model needs to fully understand the input before producing a different output.

## Benefits

Understanding these can help as choosing the right architecture for a given task.

Encoders:
- Text classification
- Sentiment analysis
- Named entity recognition
- Question answering (extractive)—extracting answer to a question from the given context.

Decoders:
- Text generation (creative writing)
- Question answering (generative)

Encoder-decoder models:
- Summarization
- Translation