
# 📲 Smart Udhaar & Billing Tracker

A modern, offline-first mobile app built with **React Native** to help small businesses and shopkeepers track **udhaar (credit)**, bills, and customer payments easily.

---

## ✨ Features

- 👥 Add, view, and manage customers
- 🧾 Create bills with amount, items, and due date
- 📝 Add notes for shops or individual customers (with date/time)
- 📋 View customer details and billing history
- 🔐 User authentication (Supabase: Email/Password)
- 💾 Offline-first using WatermelonDB
- ☁️ Cloud sync with Supabase (planned)
- 📱 Fully responsive UI for Android & iOS
- 🧼 Logout with one click

---

## 🛠️ Tech Stack

| Layer        | Tech                        |
|--------------|-----------------------------|
| Framework    | React Native (Expo Bare)    |
| Backend      | Supabase                    |
| Auth         | Supabase Auth               |
| Local DB     | AsyncStorage (offline sync) |
| UI Styling   | Tailwind CSS via NativeWind |
| Icons/Assets | Lottie (optional), Images   |

---

## 📂 Project Structure

```

src/
├── context/               # Auth context (Supabase)
├── hooks/                 # Reusable hooks
├── navigation/            # Stack & Tab navigation
├── screens/               # All screens (Login, SignUp, Home, Customers, MakeBill, etc.)
├── services/              # Business logic (e.g., Supabase calls)
├── storage/               # WatermelonDB setup (planned)

````

---

## 📸 Screenshots (Coming Soon)

- Home screen with customer list
- Make Bill screen
- Add Notes in Profile
- Auth (Login/Signup)

---

## 📦 Installation

```bash
git clone https://github.com/your-username/udhaar-tracker.git
cd udhaar-tracker
npm install
npx expo install
````

---

## ▶️ Run the App

```bash
npx expo start
```

---

## 📌 Todos / Roadmap

* [x] Add customers
* [x] Make and view bills
* [x] Add notes with date/time
* [x] Login/Signup with Supabase
* [ ] Offline-first WatermelonDB setup
* [ ] Supabase sync for bills & notes
* [ ] Export data (PDF or Excel)
* [ ] Due payment reminders

---

## 🙌 Contributing

Pull requests are welcome. For major changes, please open an issue first.


---

**Built with ❤️ by Talha Siddique**

```
