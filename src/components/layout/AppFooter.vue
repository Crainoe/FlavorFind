<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>Recipe Explorer</h3>
        <p>Discover and save your favorite recipes from around the world.</p>
      </div>

      <div class="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/search">Search Recipes</router-link></li>
          <li><router-link to="/favorites">My Favorites</router-link></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Built With</h4>
        <ul>
          <li>Vue.js 3</li>
          <li>Vue Router</li>
          <li>Vuex</li>
          <li>Vite</li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>
        &copy; {{ currentYear }} Recipe Explorer. Built for portfolio showcase.
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
.app-footer {
  background-color: #2d3748;
  color: white;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.footer-section h3 {
  color: #667eea;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.footer-section h4 {
  color: #a0aec0;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.footer-section p {
  color: #cbd5e0;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section ul li a {
  color: #cbd5e0;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: #667eea;
}

.footer-bottom {
  border-top: 1px solid #4a5568;
  padding: 20px;
  text-align: center;
  color: #a0aec0;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 30px 20px 15px;
  }
}
</style>
