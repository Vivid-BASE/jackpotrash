---
description: Deployment workflow for separating test and production environments
---

# 🚀 Deployment Workflow

To prevent accidental updates to the production site, follow these strict rules:

## 1. Work on `develop` Branch
All development, bug fixes, and feature updates MUST be performed on the `develop` branch.
- Use `git checkout develop` before starting any work.
- Pushing to `develop` will trigger a preview deployment on Cloudflare.

## 2. Test Site Review
Once work is pushed to `develop`, provide the preview URL to the user and request a review.

## 3. Production Release (`main` Merge)
DO NOT merge `develop` into `main` unless the user explicitly gives approval (e.g., "OK", "Merge to production").

## 4. Post-Merge Cleanup
After merging to `main`, ensure the `develop` branch is up to date with `main` if any hotfixes were applied.

---
**CRITICAL**: You have been warned by the user about past mistakes. Do NOT deviate from this workflow.
