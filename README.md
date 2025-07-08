# Singularity Labs — AI Scheduling Concierge (Frontend)

![Frontend: React (TypeScript)](https://img.shields.io/badge/Frontend-React%20%28TypeScript%29-red)
![Backend: FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)
![Deployment: Netlify](https://img.shields.io/badge/Deployed-Netlify-blue)

An AI-powered conversational scheduling assistant for a fictional company — **Singularity Labs** — enabling natural-language booking, conflict resolution, and seamless Google Calendar integration.

---

## 🚀 Live Demo

👉 **Try it here:** [singularitylabs.netlify.app](https://singularitylabs.netlify.app)  
**Note:** The backend is hosted on a free-tier service; the first request may take up to 30 seconds to wake the server.

---

## ✨ Key Features

✅ **Modern React (TypeScript) Frontend** — responsive, real-time chat UI.  
✅ **JWT Auth & Profile Management** — register, log in, update profile.  
✅ **Natural Language Booking Flow** — find, confirm, or reschedule slots.  
✅ **Timezone Awareness** — auto-detects user timezone, displays local times.  
✅ **Google Calendar Integration** — bookings sync live with a shared team calendar.  
✅ **Secure API Communication** — talks to a robust FastAPI backend with concurrency handling.

---

## 🖼️ Screenshots

A glimpse of the end-to-end user journey:

### 👤 Login
![Login](public/assets/demo/login_page.png)

### 📝 Register
![Register](public/assets/demo/register_page.png)

### 👋 Welcome Screen
![Welcome](public/assets/demo/welcome_screen.png)

### 🔍 Find Available Slots
![Slot Searching](public/assets/demo/slot_searching.png)

### ✅ Confirm Booking
![Confirm](public/assets/demo/confirm.png)

### 📆 Booking Confirmed
![Booked](public/assets/demo/booked.png)

### ⚙️ Update Profile
![Update Profile](public/assets/demo/update_profile.png)

### 📅 Synced Google Calendar
![Calendar](public/assets/demo/calendar.png) 

👉 **Public calendar link:** [View live bookings](https://calendar.google.com/calendar/embed?src=7743582e37793f0f1622907a74a0cd7a233930a9496faef57e9642c2dbc78857%40group.calendar.google.com&ctz=Asia%2FKolkata).

---

## 🗂️ Tech Stack

| **Tech**     | **Purpose**                                   |
|--------------|-----------------------------------------------|
| React + TypeScript | Modern frontend framework & static typing  |
| Vite         | Fast dev server and build tooling             |
| Tailwind CSS (optional) | Styling (mention if you used it)     |
| Axios/Fetch  | API calls to FastAPI backend                  |
| JWT Storage  | Secure auth state handling                    |
| Netlify      | Hosting and CI/CD for frontend                |

---

## ⚙️ Running Locally

### Prerequisites

- Node.js (v18+ recommended)
- Backend API running locally or hosted

### 1️⃣ Clone the repo

```bash
git clone https://github.com/purushothdl/singularity-labs-react.git
cd singularity-labs-react
