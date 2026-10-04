# RIZO X ZAINU hosting bot - 24/7 Android Local Bot Host

Yeh Android Native application ka complete production codebase hai jo user ke Android Phone ki **RAM** aur **Storage** ko utilize karke Telegram bot ko **24/7 background mein run karta hai**.

---

### 👑 Developer & Admin Contact
- **Telegram ID:** [@rizohacker](https://t.me/rizohacker)
- **App Name:** RIZO X ZAINU hosting bot
- **Core Engine:** Android Foreground Service + Chaquopy Embedded Python 3.11

---

### 🚀 Key Technical Features
1. **Android Foreground Service with PARTIAL_WAKE_LOCK:**
   - Phone lock ho ya app minimize ho, background mein CPU sleep nahi hota aur Telegram bot 24/7 zinda rehta hai.
2. **3 Core Tabs:**
   - **Tab 1: Host New Bot** - Local storage se `bot.py`, `requirements.txt`, aur `.env` upload aur config karein.
   - **Tab 2: My Bots & Live Files** - Active bots ki list, Start/Stop/Restart, aur files view & edit karein.
   - **Tab 3: Resource Monitor** - Real-time phone RAM (Total, Used, Bot Allocated), CPU %, aur Battery status.
3. **Live Terminal / Logs Console:**
   - Real-time stdout/stderr stream, pip install outputs, aur error logs.
4. **Battery Optimization Bypass:**
   - Automatic `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` prompt.

---

### 🛠️ How to Build APK in Android Studio

1. **Prerequisites:**
   - Android Studio Iguana / Jellyfish / Ladybug (2024+)
   - JDK 17+ installed
   - Android SDK API 34

2. **Open Project:**
   - Android Studio open karein -> **Open** -> Is project folder ko select karein.
   - Gradle sync automatically start ho jayega.

3. **Chaquopy Python License:**
   - Chaquopy open-source aur non-commercial use ke liye free hai!

4. **Build APK:**
   - Top menu se: **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**
   - Build hone ke baad `app/build/outputs/apk/debug/app-debug.apk` aapko mil jayega!
   - Ise apne phone mein install karein aur permissions grant karein.

---

### 🌐 How to Push to GitHub (Fully Free & Clean)

Apne computer ya phone (Termux) terminal mein yeh commands run karein:

```bash
# 1. Initialize Git Repository
git init

# 2. Add all project files
git add .

# 3. Create initial commit
git commit -m "Initial commit - RIZO X ZAINU hosting bot Android App"

# 4. Set default branch to main
git branch -M main

# 5. Link your GitHub repository (Replace with your actual GitHub URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/rizo-zainu-hosting-bot.git

# 6. Push to GitHub
git push -u origin main
```

---

### 📱 24/7 Phone Settings Guide (Keep Alive)
MIUI / HyperOS, OneUI (Samsung), ColorOS, Vivo phones mein:
1. App Info -> **Battery Saver** -> Select **"No Restrictions"**.
2. App Info -> **Auto-start** -> **Enable**.
3. Recent Apps -> App card ko **Lock (Pin)** icon par click karein.
