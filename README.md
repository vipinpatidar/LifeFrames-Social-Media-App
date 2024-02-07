# Lifeframes - Social Media App

Lifeframes is a social media application built using Vite React as the frontend framework and MySQL as the database. Users can share their stories, posts, or images, interact with posts by liking or disliking, explore other profiles, follow other users, and update their own profile information.

## Features

- Story Sharing: Users can post their stories to share with others.
- Post and Image Sharing: Share posts or images with the community.
- Interaction: Interact with posts by liking or disliking them.
- Profile Exploration: Explore other user profiles.
- Following: Follow other users to stay updated with their posts.
- Profile Management: Users can update their own profile information.

## installation

### Prerequisites

- Node.js and npm installed globally.
- MySQL server installed and running.

1. Clone the repository:
   git clone https://github.com/yourusername/lifeframes.git
2. Navigate to the project directory:
   cd lifeframes

## Backend Setup:

- Set up your MySQL database by creating tables for users, posts, likes, relationships, stories, and comments. Here's an example SQL script to create the necessary tables:

1. CREATE TABLE users (
   id INT AUTO_INCREMENT PRIMARY KEY,
   username VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL,
   password VARCHAR(255) NOT NULL,
   profile_picture VARCHAR(255)
   );

2. CREATE TABLE posts (
   id INT AUTO_INCREMENT PRIMARY KEY,
   user_id INT,
   content TEXT,
   image_url VARCHAR(255),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES users(id)
   );

3. CREATE TABLE likes (
   id INT AUTO_INCREMENT PRIMARY KEY,
   user_id INT,
   post_id INT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES users(id),
   FOREIGN KEY (post_id) REFERENCES posts(id)
   );

4. CREATE TABLE relationships (
   id INT AUTO_INCREMENT PRIMARY KEY,
   follower_id INT,
   followed_id INT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (follower_id) REFERENCES users(id),
   FOREIGN KEY (followed_id) REFERENCES users(id)
   );

5. CREATE TABLE stories (
   id INT AUTO_INCREMENT PRIMARY KEY,
   user_id INT,
   content TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES users(id)
   );

6. CREATE TABLE comments (
   id INT AUTO_INCREMENT PRIMARY KEY,
   user_id INT,
   post_id INT,
   content TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES users(id),
   FOREIGN KEY (post_id) REFERENCES posts(id)
   );

## Frontend Setup:

1. Navigate to the frontend directory: cd frontend
2. Install dependencies: npm install
3. Create a .env file in the frontend directory and add the following variable:
   VITE_API_URL=http://localhost:your_backend_port
   Replace your_backend_port with the port number where your backend server is running.

4. Start the frontend development server: npm run dev

Open your browser and navigate to http://localhost:your_frontend_port to start using Lifeframes.

## Usage

- Sign up for an account or log in if you already have one.

- Explore the platform by viewing posts, stories, and user profiles.

- Share your own stories, posts, or images to engage with the community.

- Interact with posts by liking or disliking them.

- Follow other users to stay updated with their posts.

- Update your profile information to keep it current.

Enjoy connecting with others on Lifeframes!
