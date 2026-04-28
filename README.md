# Stayora
Stayora is a full-stack web application inspired by Airbnb that allows users to explore, create, and manage property listings. It features user authentication, image uploads, interactive maps, and a review system, providing a seamless booking-style experience.
# 🌍 Stayora

Stayora is a full-stack web application inspired by Airbnb that allows users to discover, create, and manage unique stay listings across the world.

🔗 **Live Demo:** https://stayora-mef0.onrender.com

---

## 🚀 Features

* 🔐 User Authentication (Signup/Login/Logout)
* 🏠 Create, Edit & Delete Listings
* 🖼️ Image Upload using Cloudinary
* 🗺️ Interactive Maps with Geolocation
* ⭐ Review & Rating System
* 🔍 Search & Category Filtering
* 🧾 Flash Messages & Validation
* 🔒 Authorization (only owner can edit/delete)

---

## 🛠️ Tech Stack

**Frontend**

* EJS
* Bootstrap
* CSS

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB Atlas
* Mongoose

**Other Tools**

* Passport.js (Authentication)
* Cloudinary (Image Storage)
* Multer (File Upload)
* Axios (Geocoding API)
* Render (Deployment)

---

## 📂 Project Structure

```
Stayora/
│── controllers/
│── models/
│── routes/
│── views/
│── public/
│── init/ (seed & update scripts)
│── utils/
│── middleware.js
│── app.js
```

---

## ⚙️ Installation & Setup

1. Clone the repository

```
git clone https://github.com/TiyaJain28/Stayora.git
cd Stayora
```

2. Install dependencies

```
npm install
```

3. Create `.env` file

```
ATLASDB_URL=your_mongodb_url
SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
POSITIONSTACK_API_KEY=your_api_key
```

4. Run the app

```
node app.js
```

---

## 🌱 Seed Data (Optional)

```
node init/index.js
node init/updateCategory.js
node init/updateGeometry.js
```

---

##  Screenshots
<img width="1913" height="943" alt="image" src="https://github.com/user-attachments/assets/970c8d21-596e-4245-a66d-06cd2073991e" />
<img width="1875" height="927" alt="image" src="https://github.com/user-attachments/assets/e844f54a-b12c-4bc2-997a-a570bc2c09a5" /><img width="1789" height="712" alt="image" src="https://github.com/user-attachments/assets/64459615-041d-4ec4-b5df-5feee831e58b" />



---

## 🚀 Deployment

This project is deployed on **Render**.

---

## 📌 Future Improvements

* ❤️ Wishlist feature
* 📅 Booking system
* 💳 Payment integration
* 📱 Responsive UI improvements

---

## 👩‍💻 Author

**Tiya Jain**

---


