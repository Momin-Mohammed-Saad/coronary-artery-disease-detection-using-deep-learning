# Coronary Artery Disease Detection Using Deep Learning

## Overview

This project is a full-stack web application for detecting Coronary Artery Disease (CAD) from coronary angiography images(CCTA) using a Deep Learning model based on DenseNet121.

The application allows users to upload angiography images(CCTA), perform CAD prediction, generate reports, and manage prediction history through a secure web interface.

---

## Features

* User Registration and Login
* JWT-based Authentication
* Coronary Artery Disease Prediction
* DenseNet121 Deep Learning Model
* Prediction History Management
* PDF Report Generation
* Admin Panel
* Password Reset Functionality
* MongoDB Database Integration
* Responsive React Frontend

---

## Tech Stack

### Frontend

* React.js
* JavaScript
* CSS
* Axios

### Backend

* Flask
* Flask-JWT-Extended
* Flask-CORS

### Machine Learning

* TensorFlow
* Keras
* DenseNet121

### Database

* MongoDB

### Utilities

* Pillow
* ReportLab
* Bcrypt

---

## Project Structure

```text
cad_project/
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── model/
│   │   └── CAD_DenseNet121_Final.keras
│   ├── routes/
│   ├── database/
│   ├── models/
│   └── utils/
│
├── README.md
└── .gitignore
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Momin-Mohammed-Saad/coronary-artery-disease-detection-using-deep-learning.git

cd coronary-artery-disease-detection-using-deep-leaning
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run on:

```text
http://localhost:3000
```

---

## Backend Setup

Create a virtual environment:

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the Flask server:

```bash
python app.py
```

---

## Model Information

* Architecture: DenseNet121
* Framework: TensorFlow / Keras
* Model File: `CAD_DenseNet121_Final.keras`
* Purpose: Coronary Artery Disease Classification from Angiography Images

---

## Future Improvements

* Model Explainability (Grad-CAM)
* Cloud Deployment
* Real-Time Prediction Monitoring
* Multi-Class CAD Classification
* Enhanced Report Analytics

---

## Author
Momin Mohammed Saad

```
