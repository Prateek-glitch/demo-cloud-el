# 📝 NoteNest - Cloud Notes for the Creative Chaos

<div align="center">

[![Built with ❤️](https://img.shields.io/badge/Built%20with-❤️%20by%20Prateek-red)](https://github.com/Prateek-glitch)
[![Powered by AWS](https://img.shields.io/badge/Powered%20by-AWS-orange)](https://aws.amazon.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)
[![Deployed on](https://img.shields.io/badge/Deployed%20on-S3-green)](https://aws.amazon.com/s3/)
[![Backend](https://img.shields.io/badge/Backend-Lambda%20%2B%20DynamoDB-yellow)](https://aws.amazon.com/lambda/)

*"Because basic notes are boring. You deserve better."* ✨

<img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExejUwajY1YXZndThqbjJpNWlyaTg4MjBmemUyMHl3NzRiaGt2dXUzZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/4KEMBV2Mj1HX3J64Az/giphy.gif" width="300" alt="Note-taking gif" />

</div>

---

## 🌱 The Idea

**NoteNest** is a cloud-based, feature-packed note-taking app that doesn’t just let you jot things down — it lets you:

- 🎨 Sketch your ideas
- 🎙️ Record audio notes
- 🖼️ Attach images
- 🧠 Make lists
- ⏰ Set reminders
- ☁️ Store everything securely in the cloud (thanks, AWS!)

No more scattered Post-its or losing your genius thoughts — it’s all in one cozy nest!

---

## ✨ Features

- 🌈 Support for 5 note types: Text, List, Image, Audio, Drawing
- 🎨 Drawing canvas powered by `<canvas>` and Framer Motion
- 🧠 List mode for bullet journaling and to-dos
- 🎙️ Record audio or upload `.mp3/.webm`
- 🖼️ Image preview before upload
- 📅 Date and Time reminder inputs
- 📦 Notes saved in AWS DynamoDB
- 🌍 Hosted frontend on AWS S3
- ⚡ Built using AWS Lambda + API Gateway
- 🌘 Dark-themed, mobile-first UI using TailwindCSS

---

## 🔧 Tech Stack

<div align="center">

### 🚀 Frontend
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://reactjs.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&style=for-the-badge)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev)

### ☁️ Backend
[![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?logo=awslambda&logoColor=white&style=for-the-badge)](https://aws.amazon.com/lambda/)
[![DynamoDB](https://img.shields.io/badge/AWS_DynamoDB-4053D6?logo=amazon-dynamodb&logoColor=white&style=for-the-badge)](https://aws.amazon.com/dynamodb/)
[![API Gateway](https://img.shields.io/badge/API_Gateway-FF4F00?logo=amazon-api-gateway&logoColor=white&style=for-the-badge)](https://aws.amazon.com/api-gateway/)
[![S3](https://img.shields.io/badge/S3_Hosting-FF9900?logo=amazons3&logoColor=white&style=for-the-badge)](https://aws.amazon.com/s3/)

</div>

---

## 🧑‍🏫 AWS Services Used

| Service        | Purpose                                     |
|----------------|---------------------------------------------|
| **S3**         | Host the static React frontend              |
| **Lambda**     | Handles backend logic for saving notes      |
| **API Gateway**| Exposes HTTPS endpoint to trigger Lambda    |
| **DynamoDB**   | Stores structured note data securely        |
| **IAM**        | Role-based access for Lambda and S3         |

---

## 🚀 Getting Started

### 🔨 Prerequisites

- Node.js v18+
- AWS CLI configured (`aws configure`)
- An AWS account with IAM permissions

---

### 🛠️ Local Setup

```bash
# Clone this feathered beast
git clone https://github.com/your-username/notenest.git
cd notenest

# Install dependencies
npm install

# Run locally
npm run dev
