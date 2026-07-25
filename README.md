# Riddhi-Siddhi-Modak-Farsan
### 2. Backend Setup (Flask)
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt

```
Create a .env file in the backend folder and add:
```env
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secure_secret_key

```
Run the backend server:
```bash
flask run

```
### 3. Frontend Setup (React)
Open a new terminal window:
```bash
cd frontend
npm install
npm start

```
The application will be live at http://localhost:3000.
## 📁 Project Structure
```text
riddhi_siddhi_ecommerce/
├── backend/                  # Flask REST API
│   ├── app.py                # Main application entry
│   ├── models/               # MongoDB Database Schemas
│   └── routes/               # API Endpoints (Products, Orders)
└── frontend/                 # React Application
    ├── public/
    └── src/
        ├── components/       # Reusable UI (Navbar, Cart, Product Cards)
        └── pages/            # Home, Checkout, Menu Categories

```

I have created a comprehensive `README.md` file tailored specifically for your full-stack project. It includes the correct architecture we discussed (React frontend and Flask backend), your specific feature set like the interactive menu and distance-based delivery calculation, and instructions for running the app locally. It is formatted professionally so you can drop it straight into your GitHub repository.

```
