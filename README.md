# 🎬 CineVerse: Your Personal Movie Explorer

## ✨ Welcome to CineVerse!

Imagine having your own smart movie assistant that knows just what you love. CineVerse is a modern, easy-to-use movie app that helps you discover, explore, and keep track of your favorite films. Built with the latest web tech, it's designed to be smooth and fun on any device!

---

## 🚀 What Makes CineVerse Awesome?

Here's a quick look at what you can do:

* **Smart Recommendations:** Get movie ideas that truly match your taste, powered by advanced AI. 🧠
* **Easy Search & Browse:** Find any movie instantly or explore by genre. 🔍
* **Your Favorite List:** Keep all your beloved films organized in one place. ❤️
* **Works Everywhere:** Looks great on your phone, tablet, or computer. 📱

---

## 💡 About the Project

CineVerse is more than just a movie list; it's a smart discovery platform. It uses **Astra DB's super-fast vector search** (like a super-powered brain!) to understand movies and recommend others that are truly "similar" to what you're looking for, even if they don't share the exact same words.

You can dive into any movie's details, then see a whole list of personalized suggestions based on that film. Plus, you have full control over your private list of favorite movies, stored right in your browser – easily add or remove films as your tastes change!

---

## 🌟 Key Features

* **Intelligent Movie Search:** Find movies by typing keywords, getting smart suggestions based on what you search.
* **Dynamic Genre Filtering:** Easily browse films by popular genres like Action, Drama, Comedy, and more.
* **Detailed Movie Pages:** See everything about a film: plot, cast, director, ratings, duration, and awards.
* **Personalized Recommendations:** On any movie's page, get instant suggestions for similar films to watch next.
* **Local Favorites List:** Save your favorite movies directly in your browser and manage your personal collection.
* **Seamless Pagination:** Easily navigate through large lists of movies.
* **Fully Responsive Design:** A beautiful and functional experience on all screen sizes (mobile, tablet, desktop).
* **Optimized Performance:** Fast loading and smooth interactions.

---

## 🧠 Struggles & Learnings

Building CineVerse was a journey of solving real-world challenges. Here are some of the key struggles and what I learned:

* **API & Framework Compatibility:** A recurring challenge was adapting to subtle API differences in the `@datastax/astra-db-ts` library and Next.js's updated `Link` component. This taught me the importance of closely following library documentation and understanding a framework's version-specific best practices.
* **Data Consistency:** I encountered a persistent issue where vector data was present in the database but not correctly retrieved by the application. Debugging this revealed a critical lesson about ensuring data is consistently structured and that the ingestion process is robust.
* **Client-Side State:** Making the Favorites list update instantly without a full page reload required a strategic use of client-side state management and callbacks. This was a valuable exercise in building a seamless user experience.
* **Deployment & Security:** Overcoming GitHub's push protection and Vercel's build failures highlighted the importance of handling environment variables and secrets securely and correctly in production environments.

---

## 📋 Trello Board

You can follow the project's development, tasks, and progress on our Trello board:

[**View the Trello Board**](**https://trello.com/invite/b/6884c8a7816e308aa522a6da/ATTIa5a22c504cfc462c10850ca979fe335b842DFF7A/movie-recommendation**)


---

## 🛠️ Tech Under the Hood

CineVerse is built with a powerful and modern stack:

| Feature       | Tech Used                               |
| :------------ | :--------------------------------------- |
| **Framework** | Next.js 15 (Pages Router) + React 19     |
| **Language**  | TypeScript                               |
| **Styling**   | Tailwind CSS                             |
| **Database**  | Astra DB (with Vector Search capabilities) |
| **AI Embeddings** | NVIDIA (for vector search)             |
| **Data Access** | REST API, `@datastax/astra-db-ts` library |
| **Local Data** | Browser Local Storage (for favorites)     |
| **Deployment**| (Link heare)       |

---

## 🎬 How to Get Started (For Developers)

Want to run CineVerse on your machine? Follow these simple steps:

### Prerequisites

* Node.js (LTS version recommended) & npm or Yarn
* Astra DB Account: Create a free database at [Astra DB](https://www.datastax.com/products/astra-db)
* OpenAI API Key: Get one from [OpenAI Platform](https://platform.openai.com/) (needed for vector generation)

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone [https://https://github.com/banidzakaria101/alx-project-nexus.git]
    cd alx-project-nexus
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set Up Environment Variables:**
    Create a file named `.env.local` in the root of your project and add your Astra DB and OpenAI API keys:
    ```dotenv
    ASTRA_DB_APPLICATION_TOKEN="AstraCS:..."
    ASTRA_DB_API_ENDPOINT="https://..."
    ASTRA_DB_KEYSPACE="mouvie_keyspace" # Ensure this matches your keyspace
    OPENAI_API_KEY="sk-proj-..."
    ```
    *(**Important:** Never commit this file to public repositories! It's already in `.gitignore`.)*

4.  **Prepare Movie Data with Vectors:**
    Your `cleaned_movies.csv` needs vector embeddings.
    ```bash
    # Run this Python script from your project root (ensure Python and pip are installed)
    python generate_movie_vectors.py
    ```
    This will create `movies_with_vectors.csv`.

5.  **Ingest Data into Astra DB:**
    * **Ensure your `mouvie_collection` exists** in your `mouvie_keyspace` on Astra DB. Make sure it's **Vector-enabled** with the correct dimension (e.g., 1536) and similarity metric (e.g., `cosine`).
    * Use the Node.js ingestion script (or direct CSV upload via Astra UI if supported for your setup) to populate your collection:
        ```bash
        # Example using the Node.js ingestion script (assuming you have one, or use the provided example)
        # npm install csv-parse # If not already installed
        node ingest_data.js
        ```
        *(This step is critical to ensure movies have their `$vector` field in Astra DB.)*

6.  **Run the Application:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open your browser and visit `http://localhost:3000`.

---
