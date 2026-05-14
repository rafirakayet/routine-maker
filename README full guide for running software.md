# 📅 Routine Maker — Setup Guide

A full-stack web app built with **React** (frontend) + **PHP + MySQL** (backend via XAMPP).  
Follow the steps below carefully and you'll be up and running in under 10 minutes.

---

## 📦 What You Need to Install

| Tool | Purpose | Download Link |
|------|---------|---------------|
| **Node.js** (v18 or later) | Runs the React frontend | [nodejs.org/en/download](https://nodejs.org/en/download) |
| **XAMPP** | Runs PHP backend + MySQL database | [apachefriends.org](https://www.apachefriends.org/download.html) |

> ✅ You do **not** need Visual Studio Code. Any terminal / command prompt works.

---

## 🗂️ Folder Structure

After extracting the project, it should look like this:

```
routine-maker/
├── api/              ← PHP backend files (auth, save, load, logout)
├── config/           ← database.php (DB connection)
├── public/           ← React public folder
├── src/              ← React source code
├── package.json      ← Node dependencies list
└── README.md         ← This file
```

---

## 🚀 Step-by-Step Setup

### Step 1 — Install Node.js

1. Go to 👉 [https://nodejs.org/en/download](https://nodejs.org/en/download)
2. Download the **LTS** version (recommended)
3. Run the installer and follow the prompts
4. Verify it installed correctly — open a terminal and run:
   ```
   node -v
   npm -v
   ```
   Both should print a version number.

---

### Step 2 — Install XAMPP

1. Go to 👉 [https://www.apachefriends.org/download.html](https://www.apachefriends.org/download.html)
2. Download XAMPP for your operating system
3. Install it (default install path is fine: `C:\xampp` on Windows)
4. Open the **XAMPP Control Panel**
5. Click **Start** next to both **Apache** and **MySQL**

> ⚠️ Both Apache and MySQL must show green/running before continuing.

---

### Step 3 — Place the Project in XAMPP's Web Folder

Copy the entire `routine-maker` folder into XAMPP's web root:

- **Windows:** `C:\xampp\htdocs\routine-maker`
- **macOS/Linux:** `/opt/lampp/htdocs/routine-maker`

Your folder should be at:
```
C:\xampp\htdocs\routine-maker\   (Windows)
/opt/lampp/htdocs/routine-maker/ (macOS/Linux)
```

---

### Step 4 — Create the Database

1. Open your browser and go to 👉 [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
2. Click **New** in the left sidebar
3. Enter database name: `routine_maker_db` and click **Create**
4. Click on `routine_maker_db` in the sidebar, then click the **SQL** tab
5. Paste and run the following SQL:

```sql
-- Users table
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User data storage (JSON format for flexibility)
CREATE TABLE `user_data` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `data_key` VARCHAR(50) NOT NULL,
    `data_value` LONGTEXT NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_user_key` (`user_id`, `data_key`)
);

-- User sessions
CREATE TABLE `user_sessions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `session_token` VARCHAR(255) UNIQUE NOT NULL,
    `expires_at` DATETIME NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

6. Click **Go** to execute.

---

### Step 5 — Install React Dependencies

Open a terminal / command prompt, navigate to the project folder, and run:

```bash
cd C:\xampp\htdocs\routine-maker
npm install
```

> This may take 1–2 minutes. It downloads all required packages into a `node_modules` folder.

---

### Step 6 — Start the App

In the same terminal, run:

```bash
npm start
```

You should see:

```
Local:            http://localhost:3000
On Your Network:  http://YOUR-IP:3000
```

- Open **http://localhost:3000** in your browser on **this computer**
- Share **http://YOUR-IP:3000** with others on the **same Wi-Fi network**

---

## 🌐 Using on a Local Network (Multiple Devices)

Anyone on the same Wi-Fi can access the app using the **Network** URL shown in the terminal (e.g., `http://172.17.8.208:3000`).

No extra setup needed — just make sure:
- XAMPP (Apache + MySQL) is running
- `npm start` is running in the terminal
- All devices are on the same Wi-Fi network

---

## 🛑 How to Stop the App

- In the terminal, press `Ctrl + C` to stop the React server
- Open XAMPP Control Panel and click **Stop** for Apache and MySQL

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|---------|
| `npm: command not found` | Node.js not installed — go back to Step 1 |
| Page loads but login fails | Make sure Apache & MySQL are running in XAMPP |
| Database error on login | Re-check Step 4 — the database must be named `routine_maker_db` |
| Network URL doesn't load on other devices | Check that your firewall isn't blocking port 3000 and 80 |
| `npm install` fails | Try running the terminal as Administrator (Windows) |

---

## 📋 Quick Start Checklist

- [ ] Node.js installed and `npm -v` works in terminal
- [ ] XAMPP installed and Apache + MySQL are running
- [ ] Project folder placed in `htdocs/routine-maker`
- [ ] Database `routine_maker_db` created with 3 tables
- [ ] `npm install` completed successfully
- [ ] `npm start` running — browser opens at `localhost:3000`

---

*Made with React, PHP, and MySQL. Runs entirely on your local machine — no internet required after setup.*
