# Todo Web App

A modern **Todo List Web Application** built using **Next.js (SSR)** and **Supabase**. This project implements user authentication, todo CRUD operations, and a server-side rendered dashboard with a clean UI using **shadcn UI components**.  

Live :- [https://todo-app-with-nextjs-swart.vercel.app/](https://todo-app-with-nextjs-swart.vercel.app/)
---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Setup & Installation](#setup--installation)  
- [Usage](#usage)  
- [Folder Structure](#folder-structure)  
- [Future Improvements](#future-improvements)  
- [Demo](#demo)  

---

#Screenshots

1. HomePage <img width="1920" height="1080" alt="Screenshot 2025-12-09 215420" src="https://github.com/user-attachments/assets/62753602-aafc-4a5b-8837-b41454491fb3" />
2. Login/Signup - <img width="1920" height="1080" alt="Screenshot 2025-12-09 215732" src="https://github.com/user-attachments/assets/44b37ec2-bef4-443e-969a-5f1dda3a90c7" />
3. Dashboard - <img width="1920" height="1080" alt="Screenshot 2025-12-09 215630" src="https://github.com/user-attachments/assets/a31efef7-5427-417a-86e2-acec0701e5a4" />

## Features

### Authentication
- Login and Signup functionality using **Supabase Auth**
- 
### Todo Features (CRUD)
- Create new todos.  
- Update existing todos.  
- Delete todos.  
- Mark todos as **completed** or **uncompleted**.  

### Dashboard (SSR)
- Server-side rendered dashboard for faster loading and SEO benefits.  
- Dashboard has three tabs:
  - **Today’s Todos**  
  - **Completed Todos**  
  - **Pending Todos**  

### UI/UX
- Clean and modern UI built with **shadcn UI components**.  
- Dark/Light mode toggle optional.  
- Responsive design for mobile and desktop.  

### Database
- **Supabase tables** store todos and user data.  
- RLS (Row-Level Security) policies implemented for security.  

---

## Tech Stack
- **Next.js (13+)** – Server-side rendering  
- **React** – Frontend framework  
- **Supabase** – Backend, authentication, and database  
- **shadcn UI** – UI components  
- **Tailwind CSS** – Styling  

---

## Setup & Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```
2. Install dependencies

npm install
# or
yarn install

Setup environment variables

Create a .env.local file in the root directory:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

Run the development server

npm run dev
# or
yarn dev
