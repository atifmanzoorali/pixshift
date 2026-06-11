# Lessons — PixShift

This file is the project's error memory.
The agent reads this at the start of every session alongside CLAUDE.md.
Every bug fixed outside of existing tests gets logged here.
Repeated mistakes get promoted to permanent rules in CLAUDE.md.

---

## LESSON-001 | 2026-06-11 | Next.js config file format

**What broke:** `npm run dev` crashed immediately with "Configuring Next.js via 'next.config.ts' is not supported."
**Root cause:** TypeScript config files (`next.config.ts`) are only supported in Next.js 15+. This project uses Next.js 14.2.5. The config file must be `next.config.mjs` or `next.config.js`.
**Fix applied:** Created `next.config.mjs` with plain JavaScript. The `.ts` file is ignored by Next.js 14.
**Test added:** No — this is a startup crash, not a test-coverable error.
**Promoted to CLAUDE.md rule:** No — logged here as a version-specific reminder.

---

## LESSON-002 | 2026-06-11 | npm install race condition on Windows

**What broke:** `npm install` produced EPERM and ENOTEMPTY errors, corrupting node_modules and requiring a full delete and reinstall.
**Root cause:** Ran `npm install` as a background command, then ran it again as a foreground command before the first finished. Both processes wrote to the same `node_modules` directory simultaneously. Windows file locking caused conflicts — the second process tried to delete folders the first still had open.
**Fix applied:** Deleted node_modules with PowerShell `Remove-Item -Recurse -Force`, then ran a single foreground `npm install`.
**Test added:** No.
**Promoted to CLAUDE.md rule:** No — operational discipline, not a code rule.
