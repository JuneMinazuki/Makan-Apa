# 🍜 Makan Apa?

Ever spent 20 minutes in a group chat going *"I don't know, what do you want to eat?"*, only to end up at the exact same spot as last week?

**Makan Apa?** is a lightweight web application built to solve food indecision. It maps out local eateries, tracks whether they’re actually open right now, and includes a **"Surprise Me!"** button to pick a spot for you when your brain refuses to make choices.

## 💡 What it does

* **Interactive Map:** Uses Leaflet + CartoDB to pin local spots, group clustered locations, and find where you are on the map.
* **Live Opening Hours:** Reads structured schedule data so you don't accidentally drive to a closed shop.
* **Filter by Craving:** Toggle categories on and off to narrow down what you're in the mood for (Kopitiams, Mamaks, Western, Cafes, etc.).
* **Surprise Me! Button:** Picks a random spot that's currently open within your vicinity when you just can't decide.
* **Community Submissions:** Includes an intuitive map-picker screen to add new places, set schedules, and send them in for approval.

## 🛠️ Built with
* **Frontend:** React, React Router
* **Maps:** Leaflet, React Leaflet, React Leaflet Cluster
* **Database:** Neon (Serverless PostgreSQL)
* **Styling & Icons:** CSS, Font Awesome 6

## 🍕 Place Categories
Here are the available spot categories you can explore:

* 🍚 Kopitiam
* 🧇 Mamak
* 🍴 Restaurant
* 🐟 Japanese / Korean
* 🍕 Western
* ☕ Cafe
* 🍔 Fast Food
* 🏪 Convenience Store  

## 🚀 Running Locally
1. **Clone the repository**
```bash
git clone https://github.com/JuneMinazuki/Makan-Apa.git
cd Makan-Apa
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory and add your Neon Database link:
```env
DATABASE_URL=your_neon_postgres_connection_string
```

4. **Start the dev server**
```bash
npm run dev
```

## 🤝 Contributing
Got a favorite local spot missing from the map or an idea to make the app better? Pull requests and feedback are always welcome!
