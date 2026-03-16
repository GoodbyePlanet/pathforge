# Content Template

Guidelines for writing markdown files in the `content/` directory.

---

## File Structure

Every markdown file must follow this structure:

### 1. Frontmatter (YAML header)

```yaml
---
title: "Your Topic Title"
assignee: First name Last name
status: todo | in-progress | done
---
```

| Field      | Required | Description                                 |
|------------|----------|---------------------------------------------|
| `title`    | Yes      | Display name of the topic                   |
| `assignee` | Yes      | Person responsible for writing this content |
| `status`   | Yes      | One of: `todo`, `in-progress`, or `done`    |

### 2. Main heading

Use a single `#` heading that matches the frontmatter `title`.

```md
# Your Topic Title
```

### 3. Required sections

Every file should include the following sections in order:

#### `## The Problem`

Describe the problem, gap, or limitation that this topic addresses.
Keep it concise — 1 to 3 paragraphs.

```md
## The Problem

LLMs have knowledge cutoff dates that prevent them from accessing
information or events occurring after their training period ended.
```

#### `## <Topic Name>`

Explain what the topic is. Use the same name as the title or a natural
variation. This is the main body of the content — include definitions,
diagrams, code examples, and links to subtopics as needed.

```md
## RAG (Retrieval-Augmented Generation)

RAG is a technique that addresses the limitation of LLMs not having
domain-specific or up-to-date knowledge by augmenting the model's
responses with relevant information retrieved from an external data source.
```

#### `## Benefits`

List the key benefits or advantages of the topic.

```md
## Benefits

- Provides up-to-date information beyond the LLM training cutoff
- Reduces hallucinations by grounding responses in retrieved data
- Allows domain-specific knowledge without fine-tuning
```

---

## Linking

Use `[[wiki-links]]` to reference other files within the same folder:

```md
- **[[memory-systems]]** — storing and retrieving information across steps
- **[[human-in-the-loop]]** — keeping humans involved in agent decision-making
```

Use standard markdown links for external resources:

```md
[OpenAI API docs](https://platform.openai.com/docs)
```

---

## Example

```md
---
title: "What Is RAG"
assignee: Nemanja Vasic
status: done
---

# What Is RAG

## The Problem

LLMs have knowledge cutoff dates that prevent them from accessing
information or events occurring after their training period ended.

## RAG (Retrieval-Augmented Generation)

RAG is a technique that addresses the limitation of LLMs not having
domain-specific or up-to-date knowledge by augmenting the model's
responses with relevant information retrieved from an external data source.

## Benefits

- Provides up-to-date information beyond the LLM training cutoff
- Reduces hallucinations by grounding responses in retrieved data
- Allows domain-specific knowledge without fine-tuning
```