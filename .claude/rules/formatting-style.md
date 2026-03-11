# Formatting Rules (Next.js + TypeScript)

## General
- Use **TypeScript for all files** (`.ts` / `.tsx`). Avoid plain JavaScript.
- Use **2 spaces** for indentation.
- Use **single quotes `'`** for strings.
- Always include **trailing commas** where valid.
- Use **semicolons** at the end of statements.
- Keep lines under **100 characters** when possible.

---

## Imports
Order imports in this order:

1. React / Next.js
2. Third-party libraries
3. Internal modules (`@/`)
4. Relative imports (`./`)

Example:

```ts
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import clsx from 'clsx'

import { Button } from '@/components/ui/button'

import styles from './styles.module.css'