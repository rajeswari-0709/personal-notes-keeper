# Personal Notes Keeper 📝

A full-stack web application that allows users to create, edit, delete, and search personal notes securely. Each user has their own private notes stored safely using session-based authentication.

---

## 🚀 Features

- User Registration & Login
- Secure Authentication using Express Sessions
- Create, Edit, Delete Notes
- Search Notes by keywords
- User-specific note storage (data isolation)
- Responsive and simple UI

---

## 🛠️ Tech Stack

- Frontend: HTML, CSS, JavaScript  
- Backend: Node.js, Express.js  
- Database: MongoDB  
- Authentication: Express Sessions  

---

## 📂 Project Structure
/Personal_Notes_Keeper
│
├── /public # Frontend files (HTML, CSS, JS)
├── /routes # Express routes
├── /models # MongoDB schemas
├── /views # Frontend pages (if any)
├── server.js # Main backend entry point
├── package.json
└── .env # Environment variables


---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/personal-notes-keeper.git

### 2. Move into project folder
cd personal-notes-keeper

### 3. Install dependencies
npm install

### 4. Create .env file
MONGO_URL=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
PORT=3000

### 5. Run the application
node server.js

OR (if nodemon is installed)
npx nodemon server.js

###🌐 Future Improvements
Add rich text editor for notes
Implement password hashing (bcrypt)
Add tags/categories for notes
Improve UI/UX design
Deploy on cloud (Render / Railway / Vercel)

