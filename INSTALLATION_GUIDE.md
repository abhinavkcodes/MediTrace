# Complete Installation & Setup Guide

## Generic Medicine Transparency System - Full Stack Application

### 📋 Prerequisites
- **Node.js** v14+ (download from https://nodejs.org)
- **MySQL Server** v5.7+ (download from https://www.mysql.com/downloads/)
- **npm** (comes with Node.js)
- A terminal/command prompt
- A modern web browser

---

## 🚀 Step-by-Step Setup

### Step 1: Create Project Folders

Create the following directory structure:

```
medicine-transparency-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── database/
    └── schema.sql
```

### Step 2: Set Up Database

1. **Open MySQL Command Line or MySQL Workbench**

2. **Run the database schema:**
   ```sql
   -- Copy all contents from schema.sql and paste into MySQL
   -- This will:
   -- - Create the medicine_db database
   -- - Create the medicines table
   -- - Insert 20 sample medicines
   ```

3. **Verify the database:**
   ```sql
   USE medicine_db;
   SELECT COUNT(*) FROM medicines;
   -- Should show: 20
   ```

### Step 3: Set Up Backend

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This installs:
   - `express` - Web framework
   - `mysql2` - MySQL driver
   - `cors` - Cross-origin support
   - `dotenv` - Environment variables

3. **Create `.env` file** in the `backend/` folder with:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=medicine_db
   PORT=5000
   NODE_ENV=development
   ```
   
   **Note:** Replace `your_mysql_password` with your actual MySQL password

4. **Copy the following files into the `backend/` folder:**
   - `server.js` → backend/server.js
   - `database.js` → backend/config/database.js
   - `Medicine.js` → backend/models/Medicine.js
   - `medicineController.js` → backend/controllers/medicineController.js
   - `medicines.js` → backend/routes/medicines.js

5. **Start the backend server:**
   ```bash
   npm start
   ```
   
   You should see:
   ```
   ✓ MySQL Database connected successfully
   🚀 Server is running on http://localhost:5000
   📊 API Health: http://localhost:5000/health
   ```

### Step 4: Set Up Frontend

1. **Navigate to frontend folder:**
   ```bash
   cd ../frontend
   ```

2. **Copy the following files into the `frontend/` folder:**
   - `index.html` → frontend/index.html
   - `styles.css` → frontend/styles.css
   - `script.js` → frontend/script.js

3. **Start a local web server** (choose one method):

   **Method A: Using Python (most systems have it)**
   ```bash
   python -m http.server 8000
   ```
   Then open: http://localhost:8000

   **Method B: Using Node.js (if Python not available)**
   ```bash
   npx http-server
   ```
   Then open the URL shown in terminal (usually http://localhost:8080)

   **Method C: Using VS Code Live Server**
   - Install "Live Server" extension in VS Code
   - Right-click index.html → "Open with Live Server"

---

## ✅ Verification Checklist

### 1. Backend is Running
```bash
curl http://localhost:5000/health
# Should return: {"message":"Server is running"}
```

### 2. Database Connection Works
Check the backend terminal for:
```
✓ MySQL Database connected successfully
```

### 3. API Endpoints Work
```bash
# Test get all medicines
curl http://localhost:5000/api/medicines

# Test search
curl "http://localhost:5000/api/search?q=aspirin"

# Test categories
curl http://localhost:5000/api/categories
```

### 4. Frontend Loads
- Open http://localhost:8000 (or your frontend server URL)
- You should see the "MediTrack" dashboard
- The overview page should show:
  - Total Medicines: 20
  - Categories: Loaded
  - Manufacturers: Loaded
  - Average Price: Calculated

---

## 🎯 Testing the Application

### Test 1: View All Medicines
1. Click "All Medicines" in the sidebar
2. You should see 20 medicine cards displayed

### Test 2: Search
1. Click "Search" in the sidebar
2. Type "aspirin" in the search box
3. You should see filtered results

### Test 3: Filter by Category
1. Click "All Medicines"
2. Select a category from the dropdown
3. Medicines should filter

### Test 4: Sort by Price
1. Go to "All Medicines"
2. Click "Sort by Price" button
3. Medicine cards should reorder

### Test 5: View Details
1. Click any medicine card's "View Details" button
2. A modal should open with full information

### Test 6: Browse Categories
1. Click "Categories" in sidebar
2. You should see all medicine categories with icons
3. Click any category to view its medicines

---

## 📊 API Endpoints Reference

All endpoints are at `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/medicines` | Get all medicines |
| GET | `/search?q=query` | Search medicines |
| GET | `/medicines/:id` | Get specific medicine |
| GET | `/categories` | Get all categories |
| GET | `/medicines/category/:category` | Get medicines by category |

### Example API Calls:
```bash
# Get all medicines
curl http://localhost:5000/api/medicines

# Search for aspirin
curl "http://localhost:5000/api/search?q=aspirin"

# Get all categories
curl http://localhost:5000/api/categories

# Get medicine with ID 1
curl http://localhost:5000/api/medicines/1
```

---

## 🔧 Troubleshooting

### Issue: "Cannot find module 'mysql2'"
**Solution:** Run `npm install` in the backend folder

### Issue: "ECONNREFUSED - Connection refused"
**Solutions:**
- Make sure MySQL is running
- Check DB credentials in `.env`
- Verify database exists: `SHOW DATABASES;`

### Issue: Frontend can't connect to API
**Solutions:**
- Check backend is running on port 5000
- Check API_BASE_URL in script.js matches your backend URL
- Check browser console for CORS errors
- Make sure `.env` has correct database credentials

### Issue: "Port 5000 already in use"
**Solution:**
- Change PORT in `.env` to another number (e.g., 5001)
- Or kill the process using port 5000

### Issue: Frontend shows "Loading medicines..." forever
**Solutions:**
- Check backend server is running
- Check browser console (F12) for errors
- Verify MySQL is running and database exists
- Check API_BASE_URL in script.js

---

## 📁 File Structure Summary

```
backend/
├── config/
│   └── database.js          (MySQL connection pool)
├── controllers/
│   └── medicineController.js (Business logic)
├── models/
│   └── Medicine.js          (Database queries)
├── routes/
│   └── medicines.js         (API routes)
├── server.js                (Express app entry)
├── package.json             (Dependencies)
└── .env                     (Database credentials)

frontend/
├── index.html               (HTML structure)
├── styles.css              (Styling & animations)
└── script.js               (API calls & interactivity)

database/
└── schema.sql              (Database structure & sample data)
```

---

## 🎨 Features Implemented

✅ **Backend:**
- Express.js REST API
- MySQL connection pool
- Error handling
- CORS support
- Search functionality
- Category filtering
- MVC architecture

✅ **Frontend:**
- Modern dashboard UI
- Real-time search with debouncing
- Category filtering
- Sorting by price
- Statistics and analytics
- Modal details view
- Toast notifications
- Responsive design
- Dark theme
- Smooth animations

✅ **Database:**
- 20 sample medicines
- Proper indexing
- Timestamps
- 4 major medicine categories

---

## 🚀 Next Steps (Optional Enhancements)

1. **Add Authentication:** User login system
2. **Add Pagination:** Large dataset handling
3. **Add Favorites:** Save favorite medicines
4. **Add Reviews:** User ratings and reviews
5. **Export to PDF:** Generate medicine reports
6. **Mobile App:** React Native version
7. **Admin Dashboard:** Add/edit/delete medicines
8. **Price History:** Track price changes over time

---

## 💡 Tips

1. **Development Mode:** Keep terminal open to see server logs
2. **Database Reset:** Delete records and re-run schema.sql
3. **Add More Medicines:** Modify schema.sql INSERT statements
4. **Customize Colors:** Edit CSS color variables in styles.css
5. **API Testing:** Use curl, Postman, or insomnia for testing

---

## 📞 Support

If you encounter issues:
1. Check the console logs (F12 in browser, terminal for backend)
2. Verify all prerequisites are installed
3. Ensure MySQL is running
4. Double-check `.env` file credentials
5. Try restarting both frontend and backend servers

---

**Happy coding! 🎉**
