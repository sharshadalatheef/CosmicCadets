# CosmicCadets

An exciting, responsive, zero-emoji space training web game designed for cadets aged 7–12. Complete 6 daily training missions, collect stars, level up ranks, and climb the cadet leaderboard!

---

## Included Training Minigames

1. **Laser Shoot Training** (`blaster`) — Tap or click flying target drones before time runs out.
2. **Space Trash Training** (`collector`) — Clean floating orbital space junk into the disposal bin and pull the release chute!
3. **Asteroid Dodge Training** (`dodge`) — Steer your rocket ship left and right through dangerous meteor belts.
4. **Ring Align Training** (`gyro`) — Rotate the docking rings to align navigation guides with the station corridor.
5. **Rocket Boost Training** (`gforce`) — Hold the ignition thrusters to keep ship engine heat balanced in the optimal launch zone.
6. **Code Match Training** (`memory`) — Repeat the sequence of reactor color codes to unlock emergency shields.

---

## How to Host on Vercel (100% FREE)

Deploy CosmicCadets in under 3 minutes with zero costs.

### Step 1: Push to GitHub
Make sure your project repository is on GitHub:
- [https://github.com/sharshadalatheef/CosmicCadets](https://github.com/sharshadalatheef/CosmicCadets)

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account (Free Hobby Plan).
2. Click **"Add New..."** > **"Project"**.
3. Select your **`CosmicCadets`** repository and click **"Import"**.
4. Keep the default settings:
   - **Framework Preset**: *Other*
   - **Root Directory**: `./`
5. Click **"Deploy"**.
6. Within 30 seconds, your game is live with an active `*.vercel.app` URL and free SSL certificate!

---

## Free Database Setup (Upstash Redis / Vercel KV)

CosmicCadets includes ready-to-run serverless APIs (`/api/leaderboard` and `/api/auth`). It works out of the box with offline local storage, or you can connect a 100% free cloud database so all players share the same live leaderboard and player profiles.

### Step-by-Step Upstash Redis Setup (Zero Cost, No Credit Card Required)

1. Go to [upstash.com](https://upstash.com) and sign up for a free account.
2. Click **"Create Database"**:
   - **Name**: `cosmiccadets-db`
   - **Type**: Regional (select the region closest to you)
   - **Plan**: Free (includes 10,000 commands/day for free forever)
3. Once created, scroll down to the **"REST API"** section on your database dashboard.
4. Copy these two values:
   - `UPSTASH_REDIS_REST_URL` (starts with `https://...`)
   - `UPSTASH_REDIS_REST_TOKEN` (long token string)

### Connect to Vercel
1. In your Vercel project dashboard, go to **Settings** > **Environment Variables**.
2. Add the two environment variables:
   - Key: `UPSTASH_REDIS_REST_URL` | Value: *(Paste your REST URL)*
   - Key: `UPSTASH_REDIS_REST_TOKEN` | Value: *(Paste your REST Token)*
3. Go to **Deployments** > click the `...` menu on your latest deployment > **Redeploy**.

> **Note**: If you don't connect a database, CosmicCadets automatically enables **Local Fallback Mode** so single-player profiles and rival cadets work smoothly on each device.

---

## Running Locally

### Option A: One-Click Launcher (Windows)
Double-click `start-game.bat` in the project folder. It will launch the local Node server and open your browser automatically.

### Option B: Terminal Command
```bash
# Start local server
node server.js
```
Then visit:
```text
http://localhost:3000
```

---

## Mobile & PWA Installation

CosmicCadets is an installable Progressive Web App (PWA):
- **iOS (iPhone/iPad)**: Open in Safari, tap the **Share** button, and select **"Add to Home Screen"**.
- **Android**: Open in Chrome, tap the **Menu (three dots)**, and select **"Install app"** or **"Add to Home screen"**.
- **Desktop (Chrome/Edge)**: Click the **Install** icon in the address bar to play full-screen offline.

---

## Child-Safe Design Principles
- **Zero Emojis**: All graphics, star counters, and indicators are crisp SVG vector icons.
- **Child-Friendly Language**: Clear, simple instructions tailored for ages 7–12 with zero confusing jargon.
- **Touch-Optimized**: Pointer-capture controls prevent accidental tap drops on mobile and tablet screens.
