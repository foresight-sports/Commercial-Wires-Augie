# Git Repository Setup Instructions

## Prerequisites
You need Git installed on your system. If Git is not installed:
1. Download Git from: https://git-scm.com/download/win
2. Install it with default settings
3. Restart your terminal/PowerShell

## Quick Setup

### Option 1: Use the batch script (Windows)
```bash
setup-git.bat
```

### Option 2: Manual setup

1. **Initialize Git repository** (if not already initialized):
   ```bash
   git init
   ```

2. **Add the remote repository**:
   ```bash
   git remote add origin https://github.com/foresight-sports/commercial-wires-augie.git
   ```

3. **Create a new feature branch** (recommended for development):
   ```bash
   git checkout -b feature/development
   ```
   
   Or create a branch with a specific name:
   ```bash
   git checkout -b feature/your-branch-name
   ```

4. **Add all files**:
   ```bash
   git add .
   ```

5. **Create initial commit**:
   ```bash
   git commit -m "Initial commit: Commercial wires application setup"
   ```

6. **Push your feature branch**:
   ```bash
   git push -u origin feature/development
   ```

## If you need to set up main branch

If you want to push to main instead:

```bash
git checkout -b main
git add .
git commit -m "Initial commit: Commercial wires application setup"
git push -u origin main
```

## Current Configuration

- **Port**: 5176 (configured in `vite.config.ts`)
- **Dev Server**: Run `npm run dev` to start
- **Remote**: https://github.com/foresight-sports/commercial-wires-augie.git


