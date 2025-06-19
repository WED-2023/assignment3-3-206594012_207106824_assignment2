<template>
  <div class="container-fluid py-4">
    <div class="row">
      <!-- Left Column - Random Recipes -->
      <div class="col-lg-6 mb-4">
        <div class="card shadow h-100">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">
              <i class="bi bi-compass"></i> Explore these recipes
            </h4>
          </div>
          <div class="card-body">
            <div v-if="loadingRandom" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">טוען...</span>
              </div>
              <p class="mt-2 text-muted">טוען מתכונים רנדומליים...</p>
            </div>
            
            <div v-else-if="randomRecipes.length > 0" class="recipes-list">
              <div 
                v-for="recipe in randomRecipes" 
                :key="recipe.id" 
                class="recipe-item card mb-3"
                @click="viewRecipe(recipe.id)"
              >
                <div class="row g-0">
                  <div class="col-md-4">
                    <img :src="recipe.image" :alt="recipe.title" class="img-fluid rounded-start h-100" style="object-fit: cover;" />
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">{{ recipe.title }}</h5>
                      <div class="recipe-meta mb-2">
                        <span class="badge bg-primary me-2">
                          <i class="bi bi-clock"></i> {{ recipe.readyInMinutes }} דקות
                        </span>
                        <span class="badge bg-success">
                          <i class="bi bi-star"></i> {{ recipe.aggregateLikes }} לייקים
                        </span>
                      </div>
                      <p class="card-text">{{ recipe.instructions }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-4">
              <i class="bi bi-emoji-frown display-4 text-muted"></i>
              <p class="text-muted mt-2">לא נמצאו מתכונים</p>
            </div>
            
            <div class="text-center mt-3">
              <button 
                @click="loadRandomRecipes" 
                class="btn btn-outline-primary"
                :disabled="loadingRandom"
              >
                <span v-if="loadingRandom" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="bi bi-arrow-clockwise me-2"></i>
                {{ loadingRandom ? 'טוען...' : 'עוד מתכונים' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - User Specific Content -->
      <div class="col-lg-6 mb-4">
        <div class="card shadow h-100">
          <!-- For logged in users: Last watched recipes -->
          <div v-if="isLoggedIn" class="card-header bg-success text-white">
            <h4 class="mb-0">
              <i class="bi bi-clock-history"></i> Last watched recipes
            </h4>
          </div>
          
          <!-- For non-logged in users: Login/Register options -->
          <div v-else class="card-header bg-warning text-dark">
            <h4 class="mb-0">
              <i class="bi bi-person-circle"></i> התחבר לאתר
            </h4>
          </div>
          
          <div class="card-body">
            <!-- Logged in content -->
            <div v-if="isLoggedIn">
              <div v-if="loadingWatched" class="text-center py-4">
                <div class="spinner-border text-success" role="status">
                  <span class="visually-hidden">טוען...</span>
                </div>
                <p class="mt-2 text-muted">טוען מתכונים אחרונים...</p>
              </div>
              
              <div v-else-if="watchedRecipes.length > 0" class="recipes-list">
                <div 
                  v-for="recipe in watchedRecipes" 
                  :key="recipe.id" 
                  class="recipe-item card mb-3"
                  @click="viewRecipe(recipe.id)"
                >
                  <div class="row g-0">
                    <div class="col-md-4">
                      <img :src="recipe.image" :alt="recipe.title" class="img-fluid rounded-start h-100" style="object-fit: cover;" />
                    </div>
                    <div class="col-md-8">
                      <div class="card-body">
                        <h5 class="card-title">{{ recipe.title }}</h5>
                        <div class="recipe-meta mb-2">
                          <span class="badge bg-success me-2">
                            <i class="bi bi-clock"></i> {{ recipe.readyInMinutes }} דקות
                          </span>
                          <span class="badge bg-info">
                            <i class="bi bi-eye"></i> צפית לאחרונה
                          </span>
                        </div>
                        <p class="card-text">{{ recipe.instructions }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center py-4">
                <i class="bi bi-eye-slash display-4 text-muted"></i>
                <p class="text-muted mt-2">עדיין לא צפית במתכונים</p>
                <router-link to="/search" class="btn btn-outline-success">
                  <i class="bi bi-search me-2"></i>חפש מתכונים
                </router-link>
              </div>
            </div>

            <!-- Non-logged in content -->
            <div v-else class="text-center py-5">
              <i class="bi bi-person-plus display-1 text-warning mb-4"></i>
              <h5 class="text-muted mb-3">התחבר כדי לראות מתכונים מותאמים אישית</h5>
              <p class="text-muted mb-4">קבל המלצות מתכונים מותאמות לטעמים שלך ועקוב אחר המתכונים שצפית בהם</p>
              
              <div class="d-grid gap-2 d-md-block">
                <router-link to="/login" class="btn btn-success btn-lg me-md-2">
                  <i class="bi bi-box-arrow-in-right me-2"></i>התחברות
                </router-link>
                <router-link to="/register" class="btn btn-outline-primary btn-lg">
                  <i class="bi bi-person-plus me-2"></i>הרשמה
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      isLoggedIn: false,
      loadingRandom: false,
      loadingWatched: false,
      randomRecipes: [],
      watchedRecipes: []
    }
  },
  mounted() {
    this.checkLoginStatus()
    this.loadRandomRecipes()
    if (this.isLoggedIn) {
      this.loadWatchedRecipes()
    }
  },
  methods: {
    checkLoginStatus() {
      // Check if user is logged in from store or localStorage
      this.isLoggedIn = !!localStorage.getItem('user') || !!this.$store?.state?.user
    },
    
    async loadRandomRecipes() {
      this.loadingRandom = true
      
      try {
        // Simulate API call - replace with actual API
        await this.simulateApiCall()
        this.randomRecipes = this.generateMockRecipes()
      } catch (error) {
        console.error('Error loading random recipes:', error)
        this.toast('שגיאה', 'שגיאה בטעינת מתכונים רנדומליים', 'danger')
      } finally {
        this.loadingRandom = false
      }
    },
    
    async loadWatchedRecipes() {
      this.loadingWatched = true
      
      try {
        // Simulate API call - replace with actual API
        await this.simulateApiCall()
        this.watchedRecipes = this.generateMockRecipes().slice(0, 3)
      } catch (error) {
        console.error('Error loading watched recipes:', error)
        this.toast('שגיאה', 'שגיאה בטעינת מתכונים אחרונים', 'danger')
      } finally {
        this.loadingWatched = false
      }
    },
    
    simulateApiCall() {
      return new Promise((resolve) => {
        setTimeout(resolve, 1000)
      })
    },
    
    generateMockRecipes() {
      return [
        {
          id: 1,
          title: 'פסטה קרבונרה',
          image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Pasta+Carbonara',
          readyInMinutes: 25,
          aggregateLikes: 150,
          instructions: 'מתכון פסטה קרבונרה קלאסי עם ביצים, גבינת פרמזן ופנצ\'טה. מתכון מהיר וטעים שמתאים לארוחת ערב.'
        },
        {
          id: 2,
          title: 'סלמון אפוי',
          image: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Salmon',
          readyInMinutes: 35,
          aggregateLikes: 89,
          instructions: 'סלמון אפוי בתנור עם עשבי תיבול ולימון. מתכון בריא וטעים שמתאים לכל המשפחה.'
        },
        {
          id: 3,
          title: 'סלט יווני',
          image: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Greek+Salad',
          readyInMinutes: 15,
          aggregateLikes: 67,
          instructions: 'סלט יווני מסורתי עם גבינת פטה, זיתים ועגבניות. מתכון קל ומהיר להכנה.'
        }
      ]
    },
    
    viewRecipe(recipeId) {
      this.$router.push(`/recipe/${recipeId}`)
    }
  }
}
</script>

<style scoped>
.recipe-item {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #dee2e6;
}

.recipe-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.recipe-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.card-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.9rem;
  color: #666;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
}

.btn:hover {
  transform: translateY(-1px);
}

.card {
  border: none;
  border-radius: 15px;
}

.card-header {
  border-radius: 15px 15px 0 0 !important;
  border-bottom: none;
}
</style>
