## React Components

- Prefer **functional components**.
- Always type component props with **TypeScript types**.
- Use **named exports** unless the file represents a Next.js page or layout.
- Keep components **small and focused** (ideally under 150 lines).
- Destructure props in the function signature.
- Avoid anonymous default exports for reusable components.

Example:

```tsx
type UserCardProps = {
  name: string
  email: string
}

export function UserCard({ name, email }: UserCardProps) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  )
}
```

## Types

- Prefer **`type` over `interface`** for most cases.
- Use **`interface` only when extending or implementing object shapes**.
- Avoid using **`any`**. Use `unknown` when the type is not known.
- Keep types **small, composable, and reusable**.
- Export shared types from a **central location** such as `types/` or `lib/types.ts`.
- Name types using **PascalCase**.
- Use **union types** and **utility types** (`Partial`, `Pick`, `Omit`) when appropriate.
- Prefer **explicit types for public APIs** (props, function returns, exported values).
- Avoid overly complex nested types.

### Example

```ts
export type User = {
  id: string
  email: string
  createdAt: Date
}
```

## Code Quality

- Prefer **small, focused functions and components**.
- Each file should have **a single clear responsibility**.
- Favor **readability and simplicity** over clever or complex code.
- Avoid deeply nested logic. Extract logic into helper functions when needed.
- Use **descriptive variable and function names**.
- Keep functions **pure when possible** (avoid side effects).
- Extract reusable logic into **custom hooks, utilities, or components**.
- Remove unused code, imports, and variables.
- Avoid duplication. Reuse existing utilities or components when possible.

### Component Guidelines

- Keep components **under ~150 lines when possible**.
- Move complex logic into **custom hooks**.
- Move reusable UI into **separate components**.

### Function Guidelines

- Functions should ideally do **one thing only**.
- Prefer **early returns** instead of deeply nested conditionals.

Example:

```ts
function getUserName(user: User | null) {
  if (!user) {
    return 'Anonymous'
  }

  return user.name
}
```

### Reusability

- If logic appears more than once, extract it into:
  - a utility function (lib/)
  - a custom hook (hooks/)
  - a shared component (components/)

### Error Handling

- Handle errors explicitly.
- Avoid silent failures.
- Use clear error messages.

