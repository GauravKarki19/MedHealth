# Fix Frontend Dependency Errors

## Problem
Frontend has errors with `@popperjs/core` and `framer-motion` packages.

## Solution Steps

### Step 1: Stop All Running Servers
Make sure the frontend dev server is stopped (press `Ctrl+C` in the terminal running `npm run dev`).

### Step 2: Close All Terminal Windows
Close all PowerShell/terminal windows to release file locks.

### Step 3: Delete node_modules (Manual Method)

**Option A: Using File Explorer**
1. Open File Explorer
2. Navigate to `D:\VeersaHackathon\TelMedSphere\frontend`
3. Delete the `node_modules` folder
4. Delete `package-lock.json` file

**Option B: Using PowerShell (after closing all terminals)**
```powershell
cd D:\VeersaHackathon\TelMedSphere\frontend
# Try to delete - if it fails, use File Explorer instead
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
```

### Step 4: Reinstall Dependencies

```powershell
cd D:\VeersaHackathon\TelMedSphere\frontend
npm install --legacy-peer-deps
```

The `--legacy-peer-deps` flag will help resolve dependency conflicts.

### Step 5: If Still Having Issues

Try installing specific problematic packages:

```powershell
npm install framer-motion@latest --legacy-peer-deps
npm install @popperjs/core@latest --legacy-peer-deps
```

### Step 6: Start Frontend

```powershell
npm run dev
```

## Alternative: Use Yarn (if npm continues to fail)

If npm continues to have issues, try using Yarn:

```powershell
# Install Yarn globally (if not installed)
npm install -g yarn

# Remove node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Install with Yarn
yarn install

# Start dev server
yarn dev
```

## If Problems Persist

If you continue to have issues, you can:

1. **Update Node.js** to the latest LTS version
2. **Clear npm cache**: `npm cache clean --force`
3. **Delete .npm folder** in your user directory: `C:\Users\<YourUsername>\.npm`
4. **Reinstall Node.js** completely

## Quick Fix Command (All in One)

```powershell
cd D:\VeersaHackathon\TelMedSphere\frontend
# Stop any running processes first
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
# Wait a moment
Start-Sleep -Seconds 2
# Delete and reinstall
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
npm install --legacy-peer-deps
```


