# Contributing

Thank you for contributing!

Summary of enforced project rules
- Language: TypeScript (see tsconfig.json)
- Framework: Next.js (if applicable) — prefer Next.js 13/16 depending on repo; this config is framework-agnostic
- Strict types: `compilerOptions.strict` is enabled; prefer explicit types for public APIs.
- Linting & Formatting: Biome. Run `pnpm run lint` and `pnpm run format` before PR.
- Tests: Add tests for new logic. We use Vitest + Testing Library for UI.
- CI: Pull requests must pass `lint`, `type-check`, and `test` workflows.

How to set up locally
1. Install node version specified in `.nvmrc` (if present).
2. Run `pnpm install`.
3. Run `pnpm run dev` (for Next.js) or your project's dev command.
4. Use the provided VS Code devcontainer or recommended settings for consistent behavior.

PR checklist (also enforced in PR template)
- [ ] Type-check passes: `pnpm run type-check`
- [ ] Lint passes: `pnpm run lint`
- [ ] Formatting applied: `pnpm run format`
- [ ] Tests added/updated and passing
- [ ] CI green

If you're an automated agent (Copilot, bots, etc.)
- Prefer existing patterns in `examples/` or `src/`.
- Ensure code passes `pnpm run type-check` and `pnpm run lint` before opening a PR.
- Respect `tsconfig.json` and Biome rules — failing CI will block merges.
