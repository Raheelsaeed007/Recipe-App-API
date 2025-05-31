import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; 
import { Link } from "react-router-dom";
import {  FaGithub } from 'react-icons/fa';


const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

 const [showLanding, setShowLanding] = useState(() => {
  return sessionStorage.getItem("showLanding") !== "false";
});





  const [error, setError] = useState("");

  const categories = ["All", "Breakfast", "Main Course", "Dessert", "Snack"];

const categoryMap = {
  All: "",
  Breakfast: "breakfast",
  "Main Course": "main course",
  Dessert: "dessert",
  Snack: "snack",
};

  useEffect(() => {
  const fetchRecipes = async () => {
    setLoading(true);
    setError("");

    const type = categoryMap[category] || "";

    try {
     
      const localRes = await axios.get(
        `/api/recipes${category !== "All" ? `?category=${category}` : ""}`
      );

      const customRecipes = localRes.data.map((recipe) => ({
        ...recipe,
        source: "local",
      }));

      let spoonacularRecipes = [];

      try {
       
        const spoonacularRes = await axios.get(
          `https://api.spoonacular.com/recipes/complexSearch`,
          {
            params: {
              number: 30,
              addRecipeInformation: true,
              type,
              apiKey: "ebd626f197f5448abbe7d05a8d5f613e",
            },
          }
        );

        spoonacularRecipes = spoonacularRes.data.results
          .filter((recipe) => {
            if (category === "All") return true;
            const dishTypes = recipe.dishTypes?.map((t) => t.toLowerCase()) || [];
            return dishTypes.includes(categoryMap[category]);
          })
          .map((recipe) => ({
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            readyInMinutes: recipe.readyInMinutes,
            category: recipe.dishTypes?.[0] || "Unknown",
            source: "spoonacular",
            url: `https://spoonacular.com/recipes/${recipe.title
              .toLowerCase()
              .replace(/ /g, "-")}-${recipe.id}`,
          }));
      } catch (spoonErr) {
        console.warn("Spoonacular API failed:", spoonErr.message);
      }

      
      setRecipes([...customRecipes, ...spoonacularRecipes]);
    } catch (err) {
      console.error("Local fetch failed:", err.message);
      setError("Failed to load local recipes.");
    } finally {
      setLoading(false);
    }
  };

  fetchRecipes();
}, [category]);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSurpriseMe = () => {
  if (filteredRecipes.length === 0) return;

  const randomRecipe =
    filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];

  if (randomRecipe.source === "local") {
    window.location.href = `/recipe/${randomRecipe._id}`;
  } else {
    window.open(randomRecipe.url, "_blank");
  }
};


if (showLanding) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 to-yellow-50 px-6 text-center"
    >
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-5xl font-extrabold text-red-600 mb-4"
      >
        🍽️ Smart Meal Planner
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-lg text-gray-700 max-w-xl mb-4"
      >
        Discover and manage healthy recipes with ease.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-md text-gray-600 mb-8"
      >
        Want to add your own recipe?{" "}
        <span className="font-semibold text-red-600">Log in or register</span>.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          sessionStorage.setItem("showLanding", "false");
          setShowLanding(false);
        }}
        className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition duration-200 shadow"
      >
        Get Started
      </motion.button>
    </motion.div>
  );
}




  return (
    <div className="min-h-screen flex flex-col justify-between">
    
      <div className="bg-red-500 text-white py-4 text-center text-2xl font-bold shadow-md">
        🍽️ Smart Meal Planner – Find & Manage Recipes
      </div>

      
      <main className="max-w-7xl mx-auto px-4 py-6 flex-grow">
        
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                category === cat
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6 text-center">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-red-300"
          />
        </div>

        <div className="mb-6 text-center">
  <button
    onClick={handleSurpriseMe}
    className="bg-yellow-400 text-white font-semibold px-5 py-2 rounded-full shadow hover:bg-yellow-500 transition"
  >
    🎲 Surprise Me!
  </button>
</div>


       
        {loading ? (
          <p className="text-center text-gray-500">Loading recipes...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredRecipes.length === 0 ? (
          <p className="text-center text-gray-500">No recipes found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) =>
              recipe.source === "local" ? (
                <a
                  key={recipe._id}
                  href={`/recipe/${recipe._id}`}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden"
                >
                  {recipe.photoUrl && (
                    <img
                      src={recipe.photoUrl}
                      alt={recipe.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-gray-800 capitalize">
                      {recipe.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {recipe.category} • {recipe.cookingTime} min
                    </p>
                  </div>
                </a>
              ) : (
                <a
                  key={recipe.id}
                  href={recipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-gray-800 capitalize">
                      {recipe.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {recipe.category} • {recipe.readyInMinutes} min
                    </p>
                  </div>
                </a>
              )
            )}
          </div>
        )}
      </main>
       <motion.footer
  className="bg-gradient-to-r from-red-400 via-pink-500 to-orange-400 shadow-md text-white py-10 px-6 mt-10 rounded-t-2xl"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
   
    <div>
      <h2 className="text-2xl font-bold mb-3">Cook Nest</h2>
      <p className="text-sm">
        Stay fit and eat smart.
      </p>
    </div>

   
    <div>
      <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
      <ul className="space-y-2 text-sm">
        <li><a href="/" className="hover:underline font-medium">Home</a></li>
        <li><a href="/add-recipe" className="hover:underline font-medium">Add Recipe</a></li>
        <li><a href="/login" className="hover:underline font-medium">Login</a></li>
      </ul>
    </div>

   
    <div>
      <h3 className="text-xl font-semibold mb-3">Contact</h3>
      <ul className="text-sm space-y-1 font-medium">
        <li>Email: <a href="mailto:raheelrahman1972@gmail.com" className="hover:underline">raheelrahman1972@gmail.com</a></li>
        <li>Support: <a href="tel:+971528134240" className="hover:underline">+971 52 8134240</a></li>
      </ul>
    </div>

   
    <div>
      <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
      <div className="flex gap-4 text-lg">
        <a href="https://github.com/Raheelsaeed007"><FaGithub className="hover:scale-110 transition-transform" /></a>
        
      </div>
    </div>
  </div>

  <div className="mt-10 text-center text-xs text-white/80">
    © {new Date().getFullYear()} SmartMeal. All rights reserved.
  </div>
</motion.footer>

  
 </div>
  );
};


export default Home;
