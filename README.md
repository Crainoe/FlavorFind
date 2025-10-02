# FlavorFind

A modern Vue.js application for discovering, searching, and saving amazing recipes. Built with Vue 3, Vue Router, and Vuex for state management.

## 🚀 Features

- **Recipe Browsing**: Explore a curated collection of recipes with beautiful card layouts
- **Advanced Search**: Search by ingredients, cuisine, dietary restrictions, and cooking time
- **Smart Filtering**: Filter recipes by cuisine type, dietary preferences, difficulty, and preparation time
- **Favorites System**: Save your favorite recipes with persistent local storage
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations and transitions

## 🛠 Technology Stack

- **Frontend Framework**: Vue.js 3 (Composition API ready)
- **Routing**: Vue Router 4
- **State Management**: Vuex 4
- **Build Tool**: Vite
- **Styling**: Modern CSS with custom properties and utility classes
- **Icons**: Emoji-based icons for a friendly, universal design

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue      # Main navigation header
│   │   └── AppFooter.vue      # Application footer
│   ├── RecipeCard.vue         # Recipe display component
│   ├── SearchBar.vue          # Search functionality
│   └── FilterPanel.vue        # Advanced filtering
├── views/
│   ├── Home.vue              # Landing page with featured recipes
│   ├── Search.vue            # Recipe search and filtering
│   ├── RecipeDetail.vue      # Individual recipe details
│   └── Favorites.vue         # Saved recipes collection
├── store/
│   ├── modules/
│   │   ├── recipes.js        # Recipe data management
│   │   ├── favorites.js      # Favorites functionality
│   │   └── search.js         # Search and filtering logic
│   └── index.js              # Vuex store configuration
├── router/
│   └── index.js              # Vue Router setup
├── assets/
│   └── styles/
│       └── main.css          # Global styles and utilities
└── main.js                   # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd vue-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Lint and fix code issues

## 🏗 Architecture Highlights

### State Management (Vuex)

The application uses a modular Vuex store structure:

- **Recipes Module**: Manages recipe data, loading states, and API integration points
- **Favorites Module**: Handles saved recipes with localStorage persistence
- **Search Module**: Controls search queries, filters, and result processing

### Component Design

Components follow Vue.js best practices:

- **Single Responsibility**: Each component has a clear, focused purpose
- **Props & Events**: Clean parent-child communication
- **Composition Ready**: Built to easily migrate to Composition API
- **Reusable**: Modular design for maximum reusability

### Responsive Design

The application uses a mobile-first approach with:

- **CSS Grid & Flexbox**: Modern layout techniques
- **CSS Custom Properties**: Consistent theming and easy customization
- **Breakpoint System**: Responsive design for all device sizes
- **Touch-Friendly**: Optimized interactions for mobile devices

## 🎨 Design System

### Color Palette

- **Primary**: Purple gradient (#667eea to #764ba2)
- **Secondary**: Green accent (#48bb78)
- **Neutrals**: Sophisticated gray scale
- **Semantic**: Standard colors for success, warning, and error states

### Typography

- **Font Stack**: System fonts for optimal performance and native feel
- **Scale**: Consistent sizing using CSS custom properties
- **Hierarchy**: Clear visual hierarchy with appropriate font weights

### Components

- **Cards**: Elevated design with hover effects and shadows
- **Buttons**: Multiple variants with smooth transitions
- **Forms**: Clean, accessible input styling
- **Navigation**: Intuitive routing with active states

## 📱 Features Deep Dive

### Recipe Management

- **Sample Data**: Pre-loaded with diverse recipe examples
- **Rich Metadata**: Cooking time, servings, difficulty, cuisine type
- **Dietary Tags**: Vegetarian, vegan, gluten-free classifications
- **Detailed Views**: Complete ingredient lists and step-by-step instructions

### Search & Discovery

- **Real-time Search**: Instant results as you type
- **Multi-criteria Filtering**: Combine multiple filters for precise results
- **Smart Suggestions**: Search through titles, descriptions, and ingredients
- **Result Management**: Clear indication of active filters and result counts

### Favorites System

- **One-click Saving**: Heart icon toggle for easy favoriting
- **Persistent Storage**: Favorites saved in localStorage
- **Statistics**: Track your collection with metrics
- **Bulk Actions**: Clear all favorites with confirmation

## 🔮 Future Enhancements

See `TODO.txt` for a comprehensive list of planned features and improvements, including:

- Real API integration
- Progressive Web App features
- User authentication
- Advanced filtering
- Social features
- Performance optimizations

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome! Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

Built as a portfolio project to demonstrate:

- Vue.js 3 proficiency
- Modern JavaScript development
- Component-based architecture
- State management with Vuex
- Responsive web design
- User experience design
- Modern build tools and workflows

---

_This project showcases modern frontend development practices and serves as a foundation for building scalable Vue.js applications._
