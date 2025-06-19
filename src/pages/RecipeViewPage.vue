<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">טוען...</span>
          </div>
          <p class="text-muted">טוען פרטי המתכון...</p>
        </div>

        <!-- Recipe Details -->
        <div v-else-if="recipe" class="recipe-detail-container">
          <!-- Recipe Header -->
          <div class="row mb-4">
            <div class="col-md-6">
              <img 
                :src="recipe.image" 
                :alt="recipe.title"
                class="img-fluid rounded recipe-main-image"
              />
            </div>
            <div class="col-md-6">
              <h1 class="display-5 text-primary mb-3">{{ recipe.title }}</h1>
              
              <!-- Recipe Meta -->
              <div class="recipe-meta mb-3">
                <span class="badge bg-primary me-2">
                  <i class="bi bi-clock"></i> {{ recipe.readyInMinutes }} דקות
                </span>
                <span class="badge bg-success me-2">
                  <i class="bi bi-star"></i> {{ recipe.aggregateLikes }} לייקים
                </span>
                <span class="badge bg-info">
                  <i class="bi bi-people"></i> {{ recipe.servings }} מנות
                </span>
              </div>
              
              <!-- Dietary Indicators -->
              <div class="dietary-indicators mb-3">
                <span v-if="recipe.vegan" class="badge bg-success me-2">
                  <i class="bi bi-leaf"></i> טבעוני
                </span>
                <span v-else-if="recipe.vegetarian" class="badge bg-info me-2">
                  <i class="bi bi-flower1"></i> צמחוני
                </span>
                <span v-if="recipe.glutenFree" class="badge bg-warning">
                  <i class="bi bi-shield-check"></i> ללא גלוטן
                </span>
              </div>
              
              <!-- Action Buttons -->
              <div class="action-buttons mb-3">
                <button 
                  @click="toggleFavorite" 
                  class="btn me-2"
                  :class="isFavorite ? 'btn-danger' : 'btn-outline-danger'"
                >
                  <i class="bi" :class="isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
                  {{ isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים' }}
                </button>
                <button @click="startCooking" class="btn btn-primary">
                  <i class="bi bi-play-circle me-2"></i>התחל הכנה
                </button>
              </div>
              
              <!-- Recipe Description -->
              <div class="recipe-description">
                <p class="text-muted">{{ recipe.instructions }}</p>
              </div>
            </div>
          </div>

          <!-- Recipe Content -->
          <div class="row">
            <!-- Ingredients -->
            <div class="col-md-4 mb-4">
              <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-list-ul me-2"></i>מרכיבים
                  </h5>
                </div>
                <div class="card-body">
                  <ul class="list-group list-group-flush">
                    <li 
                      v-for="ingredient in recipe.ingredients" 
                      :key="ingredient.name"
                      class="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>{{ ingredient.name }}</span>
                      <span class="badge bg-light text-dark">{{ ingredient.amount }}</span>
                </li>
              </ul>
                  
                  <!-- Servings Multiplier -->
                  <div class="mt-3">
                    <label class="form-label">הכפל מנות:</label>
                    <div class="input-group">
                      <button 
                        @click="decreaseServings" 
                        class="btn btn-outline-secondary"
                        :disabled="servingsMultiplier <= 1"
                      >
                        <i class="bi bi-dash"></i>
                      </button>
                      <input 
                        v-model.number="servingsMultiplier" 
                        type="number" 
                        class="form-control text-center"
                        min="1"
                        max="10"
                      />
                      <button 
                        @click="increaseServings" 
                        class="btn btn-outline-secondary"
                        :disabled="servingsMultiplier >= 10"
                      >
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                    <small class="text-muted">סה"כ מנות: {{ recipe.servings * servingsMultiplier }}</small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Instructions -->
            <div class="col-md-8 mb-4">
              <div class="card shadow-sm">
                <div class="card-header bg-success text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-list-ol me-2"></i>הוראות הכנה
                  </h5>
                </div>
                <div class="card-body">
                  <div class="cooking-steps">
                    <div 
                      v-for="(step, index) in recipe.cookingSteps" 
                      :key="index"
                      class="cooking-step mb-3"
                    >
                      <div class="step-header d-flex align-items-center">
                        <span class="step-number">{{ index + 1 }}</span>
                        <h6 class="mb-0 ms-3">{{ step.title }}</h6>
                        <span class="badge bg-secondary ms-auto">{{ step.duration }} דקות</span>
                      </div>
                      <p class="step-description mt-2">{{ step.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="row">
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="card-header bg-info text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-info-circle me-2"></i>מידע נוסף
                  </h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-3 text-center">
                      <i class="bi bi-thermometer-half display-4 text-warning"></i>
                      <h6>טמפרטורה</h6>
                      <p class="text-muted">{{ recipe.temperature || '180°C' }}</p>
                    </div>
                    <div class="col-md-3 text-center">
                      <i class="bi bi-clock-history display-4 text-info"></i>
                      <h6>זמן הכנה כולל</h6>
                      <p class="text-muted">{{ recipe.readyInMinutes }} דקות</p>
                    </div>
                    <div class="col-md-3 text-center">
                      <i class="bi bi-currency-dollar display-4 text-success"></i>
                      <h6>עלות</h6>
                      <p class="text-muted">{{ recipe.pricePerServing ? `$${(recipe.pricePerServing / 100).toFixed(2)}` : 'לא זמין' }}</p>
                    </div>
                    <div class="col-md-3 text-center">
                      <i class="bi bi-heart-pulse display-4 text-danger"></i>
                      <h6>קלוריות</h6>
                      <p class="text-muted">{{ recipe.calories || 'לא זמין' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recipe Not Found -->
        <div v-else class="text-center py-5">
          <div class="card shadow-sm">
            <div class="card-body py-5">
              <i class="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
              <h3 class="text-muted mb-3">המתכון לא נמצא</h3>
              <p class="text-muted mb-4">
                המתכון שחיפשת לא קיים או הוסר מהמערכת
              </p>
              <router-link to="/search" class="btn btn-primary btn-lg">
                <i class="bi bi-search me-2"></i>חפש מתכונים אחרים
              </router-link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
  name: 'RecipeViewPage',
    data() {
      return {
      loading: true,
      recipe: null,
      servingsMultiplier: 1
    }
  },
  computed: {
    isFavorite() {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      return favorites.some(fav => fav.id === this.recipe?.id);
    }
  },
  mounted() {
    this.loadRecipe();
  },
  methods: {
    async loadRecipe() {
      this.loading = true;
      
      try {
        const recipeId = this.$route.params.recipeId;
        
        // Simulate API call - replace with actual API
        await this.simulateApiCall();
        this.recipe = this.generateMockRecipe(recipeId);
        
        // Mark as viewed
        this.markAsViewed();
      } catch (error) {
        console.error('Error loading recipe:', error);
        this.toast('שגיאה', 'שגיאה בטעינת המתכון', 'danger');
      } finally {
        this.loading = false;
      }
    },
    
    simulateApiCall() {
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    },
    
    generateMockRecipe(recipeId) {
      const recipes = {
        '1': {
          id: 1,
          title: 'פסטה קרבונרה',
          image: 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Pasta+Carbonara',
          readyInMinutes: 25,
          aggregateLikes: 150,
          servings: 4,
          vegetarian: false,
          vegan: false,
          glutenFree: false,
          instructions: 'מתכון פסטה קרבונרה קלאסי עם ביצים, גבינת פרמזן ופנצ\'טה. מתכון מהיר וטעים שמתאים לארוחת ערב.',
          ingredients: [
            { name: 'פסטה', amount: '400 גרם' },
            { name: 'ביצים', amount: '4 יחידות' },
            { name: 'גבינת פרמזן', amount: '100 גרם' },
            { name: 'פנצ\'טה', amount: '100 גרם' },
            { name: 'פלפל שחור', amount: 'לפי הטעם' },
            { name: 'מלח', amount: 'לפי הטעם' }
          ],
          cookingSteps: [
            {
              title: 'הכנת הפסטה',
              description: 'מבשלים את הפסטה במים רותחים עם מלח עד לאלנטה',
              duration: 10
            },
            {
              title: 'הכנת הרוטב',
              description: 'מערבבים ביצים עם גבינת פרמזן מגוררת',
              duration: 5
            },
            {
              title: 'ערבוב הסופי',
              description: 'מערבבים את הפסטה עם הרוטב ומוסיפים פנצ\'טה',
              duration: 5
            }
          ],
          temperature: 'לא נדרש',
          pricePerServing: 250,
          calories: '450 קלוריות למנה'
        }
      };
      
      return recipes[recipeId] || null;
    },
    
    markAsViewed() {
      if (!this.recipe) return;
      
      let viewedRecipes = JSON.parse(localStorage.getItem('viewedRecipes') || '[]');
      
      // Remove if already exists
      viewedRecipes = viewedRecipes.filter(viewed => viewed.id !== this.recipe.id);
      
      // Add to beginning
      viewedRecipes.unshift({
        id: this.recipe.id,
        title: this.recipe.title,
        image: this.recipe.image,
        viewedAt: new Date().toISOString()
      });
      
      // Keep only last 10 viewed recipes
      viewedRecipes = viewedRecipes.slice(0, 10);
      
      localStorage.setItem('viewedRecipes', JSON.stringify(viewedRecipes));
    },
    
    toggleFavorite() {
      let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      if (this.isFavorite) {
        // Remove from favorites
        favorites = favorites.filter(fav => fav.id !== this.recipe.id);
        this.toast('הסרה ממועדפים', 'המתכון הוסר מהמועדפים', 'info');
      } else {
        // Add to favorites
        favorites.push({
          id: this.recipe.id,
          title: this.recipe.title,
          image: this.recipe.image,
          addedDate: new Date().toISOString().split('T')[0]
        });
        this.toast('הוספה למועדפים', 'המתכון נוסף למועדפים', 'success');
      }
      
      localStorage.setItem('favorites', JSON.stringify(favorites));
    },
    
    startCooking() {
      // Navigate to cooking page (bonus feature)
      this.toast('מידע', 'פונקציונליות הכנת מתכון תהיה זמינה בקרוב', 'info');
    },
    
    increaseServings() {
      if (this.servingsMultiplier < 10) {
        this.servingsMultiplier++;
      }
    },
    
    decreaseServings() {
      if (this.servingsMultiplier > 1) {
        this.servingsMultiplier--;
      }
    }
  }
}
  </script>
  
  <style scoped>
.recipe-detail-container {
  max-width: 1200px;
  margin: 0 auto;
}

.recipe-main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 15px;
}

.recipe-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.dietary-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cooking-step {
  border-left: 4px solid #28a745;
  padding-left: 1rem;
  background-color: #f8f9fa;
  border-radius: 0 8px 8px 0;
}

.step-number {
  background-color: #28a745;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
    display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.step-description {
  color: #666;
  margin-bottom: 0;
}

.card {
  border: none;
  border-radius: 15px;
}

.card-header {
  border-radius: 15px 15px 0 0 !important;
  border-bottom: none;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
}

.btn:hover {
  transform: translateY(-1px);
}

.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .recipe-main-image {
    height: 250px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .btn {
    width: 100%;
  }
}
  </style>
  