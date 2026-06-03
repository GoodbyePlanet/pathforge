# Exercise: Test-Driven Development with the AI

Red → Green → Refactor, one test at a time. You let the AI build a small
feature **test-first** — and feel how the TDD commands keep it
disciplined: no vibe-coding, no jumping ahead, minimal code per step.

Pick a **small** feature from your own project (a pure function with
clear inputs/outputs works best — a parser, a validation, a calculation,
a tiny state machine).

---

## Mental model — read this before you start

- **Every TDD phase is delegated, never typed freehand.**
  `test-list`, `red`, `green` run as **commands in the shared main
  context** — the AI keeps the test list, last error, and current
  implementation in working memory. Only **`refactor`** runs as an
  **isolated subagent** that judges the code fresh, free of
  implementation bias.
- **The cycle is non-negotiable.** Every test goes through
  `red → green → refactor`. Even when it feels "too small-step" — that
  discipline *is* the exercise, not a detour.
- **Exactly one test is active at a time.** Everything else stays
  `it.todo()`.
- **Green is deliberately minimal.** Hardcoded returns are correct for
  early tests. The right abstraction emerges on the second and third
  test — not the first.

---

## Prerequisites

- **Claude Code** running in your project (`claude --version`)
- A project with a test runner set up (tests must run with **one
  command**)

---

## Setup

Run all commands from your project root.

**1. Create a branch:**
```bash
git checkout -b tdd
```

**2. Copy the commands, rules, and the refactor agent into your project:**
```bash
cp -r .claudeTddCommands/commands/ .claude/commands/
cp -r .claudeTddCommands/rules/    .claude/rules/
cp -r .claudeTddCommands/agents/   .claude/agents/
```

The project rule `tdd.md` enforces the workflow automatically: it forces
the AI to invoke the right command/agent for each phase instead of
writing tests or code directly.

### What you get

- **`/test-list`** (command) — reads the requirement and creates a test
  list of `it.todo()` placeholders, ordered simple → complex
- **`/red`** (command) — activates **one** test, makes **predictions**
  about how it fails (compilation error first, then runtime error),
  verifies the failure
- **`/green`** (command) — writes the **minimal** code that turns the
  test green — nothing more
- **`refactor`** (subagent) — evaluates naming first, applies the Simple
  Design Rules, computes APP mass (code complexity) before/after, keeps
  tests green
- **`tdd.md`, `tdd-execution-mode.md`, `human-in-the-loop.md`** (rules) —
  enforce the cycle and control when the AI stops for your approval

### Adapt the stack (important, ~2 min)

The commands are written for **TypeScript / Vitest / pnpm** by default.
The TDD discipline itself is language-agnostic — only adjust these spots
to match your project:

| | Default (TS) | Your project |
|---|---|---|
| Test command | `pnpm test` | e.g. `pytest`, `mvn test`, `go test ./...` |
| Test placeholder | `it.todo()` | e.g. `@pytest.mark.skip`, `@Disabled("todo")`, `t.Skip()` |
| Test file suffix | `.spec.ts` | your convention |

In `.claude/commands/red.md`, `green.md`, and `.claude/rules/tdd.md`,
find `pnpm test` and replace it with your test command. The code
snippets in the files are illustrative only — leave them as is.

### Choose an autonomy level

`.claude/rules/human-in-the-loop.md` controls when the workflow stops,
via the **`Autonomy Level`** at the top. For this exercise we recommend
the default **`full-hitl`** (stop after Test-List, Red, and Refactor) —
so you see every phase. If you already know the workflow, switch to
`refactor-only`.

---

## Phase 1: Test list (~10 min)

New chat. Describe the feature and name the file paths:

> "/test-list Feature: [short description]. Test file: `src/[feature].spec.ts`,
> implementation: `src/[feature].ts`. Requirements: [rules/examples]."

The AI builds a list of `it.todo()` placeholders, simple → complex.
**Review the list** before moving on: does it cover the feature? Is a
case missing? Is the order sensible? Only then approve.

## Phase 2: The first cycle — Red → Green → Refactor (~15 min)

**Red:**

> "/red Activate the first test."

The AI makes **explicit predictions** about how the test fails and
verifies them. Read the predictions — **are they correct?** A wrong
prediction is a signal: the AI's mental model disagrees with reality.
(On the default level the workflow stops automatically when that
happens.)

**Green:**

> "/green"

Minimal code that turns the test green. **Notice how little** gets
written — hardcoded returns are correct here.

**Refactor:**

> "Launch the refactor agent for the current implementation."

The isolated agent evaluates naming first, checks the Simple Design
Rules, and computes APP mass. Read its reasoning.

## Phase 3: Repeat until done (~15 min)

Back to `/red` for the next test. **Every** test runs the full cycle.
Watch the implementation evolve over several Green phases — from
"hardcoded" to a real abstraction — and how the refactor agent keeps it
clean.

---

## Optional bonus: the same phases as isolated subagents

The repo contains a **second** variant: `.claudeTddSub`. There, **all
four** phases (including `red`/`green`/`test-list`) run as **isolated
subagents** instead of commands in the main context. Each phase agent
starts with no memory of the previous ones — context is rebuilt fresh
per phase.

If you have time, run the same cycle with it and compare:

```bash
cp -r .claudeTddSub/agents/ .claude/agents/
cp    .claudeTddSub/rules/tdd.md .claude/rules/
```
(This variant is Java/JUnit/Maven-flavored — adapt the stack the same
way. It also ships a `/example-mapping` skill for exploring the feature
up front.)

> When comparing, watch how the two behave on **longer** features: does
> the AI hold on to the test list and the thread across many phases — or
> does it lose state across the isolated contexts?

---

## Reflection

- Where did a **prediction** in the Red phase surface a flaw in the AI's
  thinking (or your own) early?
- How did the **minimal** Green code feel — and when did that restraint
  pay off later?
- What code would the AI have left behind without the refactor step?
- For which kind of feature is this effort worth it — and for which not?
- If you did the bonus: where was the tangible difference between
  commands (shared context) and subagents (isolated)?
