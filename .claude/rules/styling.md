## Styling

- Prefer **Tailwind CSS classes directly in JSX**.
- Use **utility-first styling** instead of custom CSS when possible.
- Use `clsx` or `cn()` for **conditional class names**.
- Avoid large inline `style` objects.
- Extract repeated UI patterns into **reusable components** instead of duplicating class strings.
- Keep class lists **readable and logically grouped** (layout → spacing → color → typography).
- Use **Tailwind responsive utilities** (`sm:`, `md:`, `lg:`) instead of custom media queries.
- Avoid global CSS unless necessary.

### Basic Example

```tsx
<button className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
  Click
</button>
```

