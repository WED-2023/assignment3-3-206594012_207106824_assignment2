import HomePage from "../pages/HomePage.vue";
import NotFound from "../pages/NotFoundPage.vue";
import store from "../store";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: {
      title: "דף הבית - Vue Recipes",
      requiresAuth: false
    }
  },
  {
    path: "/home",
    name: "home-alias",
    component: HomePage,
    meta: {
      title: "דף הבית - Vue Recipes",
      requiresAuth: false
    }
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/RegisterPage.vue"),
    meta: {
      title: "הרשמה - Vue Recipes",
      requiresAuth: false,
      guestOnly: true // רק למשתמשים לא מחוברים
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/LoginPage.vue"),
    meta: {
      title: "התחברות - Vue Recipes",
      requiresAuth: false,
      guestOnly: true // רק למשתמשים לא מחוברים
    }
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../pages/SearchPage.vue"),
    meta: {
      title: "חיפוש מתכונים - Vue Recipes",
      requiresAuth: false
    }
  },
  {
    path: "/recipe/:recipeId",
    name: "recipe",
    component: () => import("../pages/RecipeViewPage.vue"),
    meta: {
      title: "מתכון - Vue Recipes",
      requiresAuth: false
    }
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../pages/AboutPage.vue"),
    meta: {
      title: "אודות - Vue Recipes",
      requiresAuth: false
    }
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../pages/ProfilePage.vue"),
    meta: {
      title: "פרופיל - Vue Recipes",
      requiresAuth: true // רק למשתמשים מחוברים
    }
  },
  {
    path: "/favorites",
    name: "favorites",
    component: () => import("../pages/FavoritesPage.vue"),
    meta: {
      title: "מועדפים - Vue Recipes",
      requiresAuth: true // רק למשתמשים מחוברים
    }
  },
  {
    path: "/my-recipes",
    name: "myRecipes",
    component: () => import("../pages/MyRecipesPage.vue"),
    meta: {
      title: "המתכונים שלי - Vue Recipes",
      requiresAuth: true // רק למשתמשים מחוברים
    }
  },
  {
    path: "/family-recipes",
    name: "familyRecipes",
    component: () => import("../pages/FamilyRecipesPage.vue"),
    meta: {
      title: "המתכונים המשפחתיים שלי - Vue Recipes",
      requiresAuth: true // רק למשתמשים מחוברים
    }
  },
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFound,
    meta: {
      title: "404 - עמוד לא נמצא",
      requiresAuth: false
    }
  }
];

// Route Guards
const router = {
  routes,
  
  // Global before each guard
  beforeEach(to, from, next) {
    // Update page title
    if (to.meta && to.meta.title) {
      document.title = to.meta.title;
    }

    // Check if user is authenticated
    const isAuthenticated = store.username || localStorage.getItem('user');

    // Handle guest-only routes (login, register)
    if (to.meta.guestOnly && isAuthenticated) {
      next({ name: 'home' });
      return;
    }

    // Handle protected routes
    if (to.meta.requiresAuth && !isAuthenticated) {
      // Save the intended destination
      localStorage.setItem('redirectAfterLogin', to.fullPath);
      
      // Show toast notification
      if (window.toast) {
        window.toast('גישה מוגבלת', 'עליך להתחבר כדי לגשת לעמוד זה', 'warning');
      }
      
      next({ name: 'login' });
      return;
    }

    // Continue to the route
    next();
  },

  // Global after each guard
  afterEach(to) {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Track page view (for analytics)
    if (to.name !== 'notFound') {
      console.log(`Navigated to: ${to.name}`);
    }
  }
};

export default router;
