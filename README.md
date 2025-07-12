# DOC Place - Medical Accessories Website

A complete e-commerce website for medical accessories and apparel with an integrated review system.

## 🚀 Features

### Frontend
- **Responsive Design**: Works on all devices
- **Product Catalog**: Browse and search medical accessories
- **Review System**: Customer reviews with photo uploads
- **Admin Dashboard**: Complete management interface
- **Dark Mode**: Toggle between light and dark themes

### Backend
- **Node.js + Express**: Fast and scalable server
- **MongoDB**: Flexible NoSQL database
- **File Upload**: Image handling with validation
- **Review Management**: Approve/reject system
- **Security**: Rate limiting, validation, CORS

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doc-place
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp config.env .env
   # Edit .env with your configuration
   ```

4. **Create upload directories**
   ```bash
   mkdir -p uploads/reviews
   mkdir -p uploads/products
   ```

5. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

6. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API Documentation**: http://localhost:3000/api

## 📁 Project Structure

```
doc-place/
├── public/                 # Frontend files
│   ├── index.html         # Main website
│   ├── admin-dashboard.html # Admin panel
│   └── assets/            # CSS, JS, images
├── models/                # Database models
│   └── Review.js         # Review schema
├── routes/                # API routes
│   ├── reviews.js        # Review endpoints
│   ├── admin.js          # Admin endpoints
│   └── products.js       # Product endpoints
├── uploads/               # File uploads
│   ├── reviews/          # Review photos
│   └── products/         # Product images
├── server.js             # Main server file
├── package.json          # Dependencies
└── config.env            # Environment variables
```

## 🔧 API Endpoints

### Reviews
- `POST /api/reviews` - Submit new review
- `GET /api/reviews/approved` - Get approved reviews
- `GET /api/reviews/stats` - Get review statistics

### Admin
- `GET /api/admin/reviews` - Get all reviews
- `PUT /api/admin/reviews/:id/approve` - Approve review
- `PUT /api/admin/reviews/:id/reject` - Reject review
- `DELETE /api/admin/reviews/:id` - Delete review

## 🎯 Review System Workflow

1. **Customer submits review** → Stored as "pending"
2. **Admin reviews** → Approves or rejects
3. **Approved reviews** → Displayed on website
4. **Statistics updated** → Real-time dashboard

## 🔒 Security Features

- **Rate Limiting**: Prevent spam
- **File Validation**: Image uploads only
- **Input Validation**: Sanitized data
- **CORS Protection**: Cross-origin security
- **Admin Authentication**: Token-based access

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables
```bash
# Required
MONGODB_URI=mongodb://localhost:27017/doc-place
ADMIN_TOKEN=your-secret-token

# Optional
PORT=3000
NODE_ENV=production
```

## 📊 Database Schema

### Review Model
```javascript
{
  name: String,           // Reviewer name
  city: String,           // Reviewer city
  rating: Number,         // 1-5 stars
  review: String,         // Review text
  photo: String,          // Photo path (optional)
  status: String,         // pending/approved/rejected
  approvedAt: Date,       // Approval timestamp
  approvedBy: String,     // Admin who approved
  createdAt: Date,        // Submission timestamp
  ipAddress: String,      // Anti-spam protection
  userAgent: String       // Browser info
}
```

## 🎨 Customization

### Styling
- Edit `public/assets/css/style.css`
- Modify color scheme in CSS variables
- Update branding elements

### Functionality
- Add new product categories
- Extend review fields
- Implement email notifications
- Add payment integration

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`

2. **File Upload Issues**
   - Ensure upload directories exist
   - Check file permissions
   - Verify file size limits

3. **Admin Access Issues**
   - Set correct `ADMIN_TOKEN` in `.env`
   - Include token in request headers

## 📞 Support

For technical support or questions:
- Email: support@docplace.com
- Phone: +20 114 090 5700

## 📄 License

This project is licensed under the MIT License.

---

**DOC Place** - Quality Medical Accessories 🏥 