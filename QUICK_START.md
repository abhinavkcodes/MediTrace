# Quick Start Guide

## Generic Medicine Transparency System

### ⚡ 5-Minute Setup

#### Prerequisites
- Node.js installed
- MySQL running
- Terminal access

#### Steps:

1. **Create database** (in MySQL):
   ```sql
   -- Run the schema.sql contents
   CREATE DATABASE IF NOT EXISTS medicine_db;
   USE medicine_db;
   CREATE TABLE medicines (...);
   INSERT INTO medicines (...);
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Create .env with: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT
   npm start
   ```
   ✓ Backend running on http://localhost:5000

3. **Setup Frontend:**
   ```bash
   cd frontend
   python -m http.server 8000
   # OR: npx http-server
   ```
   ✓ Frontend running on http://localhost:8000

4. **Open Browser:**
   - Go to http://localhost:8000
   - You're done! 🎉

---

## 🧪 Quick Test

### Test Backend APIs:

```bash
# Get all medicines
curl http://localhost:5000/api/medicines

# Search
curl "http://localhost:5000/api/search?q=aspirin"

# Get categories
curl http://localhost:5000/api/categories
```

### Test Frontend:

- [ ] Sidebar navigation works
- [ ] Overview shows stats
- [ ] All Medicines displays 20 items
- [ ] Search filters results
- [ ] Category filter works
- [ ] View Details modal opens
- [ ] Sort by price works

---

## 📋 Environment Variables (.env)

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<your_mysql_password>
DB_NAME=medicine_db
PORT=5000
NODE_ENV=development
```

---

## 🔗 API Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/medicines` | GET | All medicines |
| `/api/search?q=term` | GET | Search medicines |
| `/api/categories` | GET | All categories |
| `/api/medicines/:id` | GET | Single medicine |

---

## 🎯 Dashboard Features

1. **Overview** - Statistics and charts
2. **All Medicines** - Browse with filters
3. **Search** - Real-time search
4. **Categories** - Browse by category

---

## 📱 Sample Data

- 20 medicines pre-loaded
- 15+ categories
- Prices from ₹30 to ₹180
- Real pharmaceutical data

---

## ✅ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to database" | Check MySQL running, verify .env |
| "Port 5000 in use" | Change PORT in .env |
| "Frontend can't fetch data" | Ensure backend running on port 5000 |
| "Blank dashboard" | Check browser console for errors |

---

## 📚 Full Documentation

See `INSTALLATION_GUIDE.md` for complete setup instructions.
See `PROJECT_SETUP.md` for architecture details.

---

**Ready to go? Start with Step 1 above! 🚀**
