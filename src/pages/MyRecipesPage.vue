<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <!-- Page Header -->
        <div class="text-center mb-4">
          <h1 class="display-4 text-primary">
            <i class="bi bi-journal-text"></i> המתכונים שלי
          </h1>
          <p class="lead text-muted">המתכונים שיצרת ופיתחת</p>
        </div>

        <!-- Create Recipe Button -->
        <div class="text-center mb-4">
          <button @click="showCreateModal = true" class="btn btn-primary btn-lg">
            <i class="bi bi-plus-circle me-2"></i>צור מתכון חדש
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">טוען...</span>
          </div>
          <p class="text-muted">טוען מתכונים...</p>
        </div>

        <!-- Recipes List -->
        <div v-else-if="myRecipes.length > 0" class="row">
          <div 
            v-for="recipe in myRecipes" 
            :key="recipe.id" 
            class="col-md-6 col-lg-4 mb-4"
          >
            <RecipePreview 
              :recipe="recipe" 
              @favorite-toggled="handleFavoriteToggle"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5">
          <div class="card shadow-sm">
            <div class="card-body py-5">
              <i class="bi bi-journal-text display-1 text-muted mb-3"></i>
              <h3 class="text-muted mb-3">אין לך עדיין מתכונים</h3>
              <p class="text-muted mb-4">
                התחל ליצור מתכונים משלך ולשתף אותם עם הקהילה
              </p>
              <button @click="showCreateModal = true" class="btn btn-primary btn-lg">
                <i class="bi bi-plus-circle me-2"></i>צור מתכון ראשון
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Recipe Modal -->
    <div 
      v-if="showCreateModal" 
      class="modal fade show d-block" 
      tabindex="-1"
      style="background-color: rgba(0,0,0,0.5);"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i>צור מתכון חדש
            </h5>
            <button 
              @click="showCreateModal = false" 
              type="button" 
              class="btn-close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createRecipe">
              <div class="row">
                <!-- Basic Info -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">שם המתכון *</label>
                  <input 
                    v-model="newRecipe.title" 
                    type="text" 
                    class="form-control" 
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">זמן הכנה (דקות) *</label>
                  <input 
                    v-model.number="newRecipe.readyInMinutes" 
                    type="number" 
                    class="form-control" 
                    min="1"
                    required
                  />
                </div>
                
                <!-- Servings -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">מספר מנות *</label>
                  <input 
                    v-model.number="newRecipe.servings" 
                    type="number" 
                    class="form-control" 
                    min="1"
                    required
                  />
                </div>
                
                <!-- Image URL -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">קישור לתמונה</label>
                  <input 
                    v-model="newRecipe.image" 
                    type="url" 
                    class="form-control" 
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <!-- Dietary Options -->
                <div class="col-12 mb-3">
                  <label class="form-label">אפשרויות תזונה</label>
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-check">
                        <input 
                          v-model="newRecipe.vegetarian" 
                          class="form-check-input" 
                          type="checkbox"
                        />
                        <label class="form-check-label">צמחוני</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-check">
                        <input 
                          v-model="newRecipe.vegan" 
                          class="form-check-input" 
                          type="checkbox"
                        />
                        <label class="form-check-label">טבעוני</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-check">
                        <input 
                          v-model="newRecipe.glutenFree" 
                          class="form-check-input" 
                          type="checkbox"
                        />
                        <label class="form-check-label">ללא גלוטן</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Ingredients -->
                <div class="col-12 mb-3">
                  <label class="form-label">מרכיבים *</label>
                  <div v-for="(ingredient, index) in newRecipe.ingredients" :key="index" class="row mb-2">
                    <div class="col-md-6">
                      <input 
                        v-model="ingredient.name" 
                        type="text" 
                        class="form-control" 
                        placeholder="שם המרכיב"
                        required
                      />
                    </div>
                    <div class="col-md-4">
                      <input 
                        v-model="ingredient.amount" 
                        type="text" 
                        class="form-control" 
                        placeholder="כמות"
                        required
                      />
                    </div>
                    <div class="col-md-2">
                      <button 
                        @click="removeIngredient(index)" 
                        type="button" 
                        class="btn btn-outline-danger"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <button 
                    @click="addIngredient" 
                    type="button" 
                    class="btn btn-outline-primary btn-sm"
                  >
                    <i class="bi bi-plus"></i> הוסף מרכיב
                  </button>
                </div>
                
                <!-- Instructions -->
                <div class="col-12 mb-3">
                  <label class="form-label">הוראות הכנה *</label>
                  <textarea 
                    v-model="newRecipe.instructions" 
                    class="form-control" 
                    rows="6"
                    placeholder="תאר את שלבי ההכנה..."
                    required
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button 
              @click="showCreateModal = false" 
              type="button" 
              class="btn btn-secondary"
            >
              ביטול
            </button>
            <button 
              @click="createRecipe" 
              type="button" 
              class="btn btn-primary"
              :disabled="creating"
            >
              <span v-if="creating" class="spinner-border spinner-border-sm me-2"></span>
              צור מתכון
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from '@/components/RecipePreview.vue'

export default {
  name: 'MyRecipesPage',
  components: {
    RecipePreview
  },
  data() {
    return {
      loading: false,
      creating: false,
      showCreateModal: false,
      myRecipes: [],
      newRecipe: {
        title: '',
        readyInMinutes: 30,
        servings: 4,
        image: '',
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        ingredients: [
          { name: '', amount: '' }
        ],
        instructions: ''
      }
    }
  },
  mounted() {
    this.loadMyRecipes();
  },
  methods: {
    async loadMyRecipes() {
      this.loading = true;
      
      try {
        // Simulate API call - replace with actual API
        await this.simulateApiCall();
        this.myRecipes = this.generateMockMyRecipes();
      } catch (error) {
        console.error('Error loading my recipes:', error);
        this.toast('שגיאה', 'שגיאה בטעינת המתכונים שלך', 'danger');
      } finally {
        this.loading = false;
      }
    },
    
    simulateApiCall() {
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    },
    
    generateMockMyRecipes() {
      return [
        {
          id: 'my-1',
          title: 'פאייה ביתית',
          image: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Paella',
          readyInMinutes: 45,
          servings: 6,
          aggregateLikes: 25,
          vegetarian: false,
          vegan: false,
          glutenFree: true,
          instructions: 'מתכון פאייה ביתי עם אורז, פירות ים ועשבי תיבול. מתכון מסורתי שמתאים לאירוח משפחתי.',
          ingredients: [
            { name: 'אורז', amount: '2 כוסות' },
            { name: 'פירות ים', amount: '500 גרם' },
            { name: 'עגבניות', amount: '3 יחידות' }
          ]
        },
        {
          id: 'my-2',
          title: 'סלט קינואה בריא',
          image: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Quinoa',
          readyInMinutes: 20,
          servings: 4,
          aggregateLikes: 18,
          vegetarian: true,
          vegan: true,
          glutenFree: true,
          instructions: 'סלט קינואה בריא עם ירקות טריים ואבוקדו. מתכון מהיר וטעים לארוחת צהריים.',
          ingredients: [
            { name: 'קינואה', amount: '1 כוס' },
            { name: 'אבוקדו', amount: '2 יחידות' },
            { name: 'עגבניות שרי', amount: '200 גרם' }
          ]
        }
      ];
    },
    
    handleFavoriteToggle(data) {
      console.log('Favorite toggled:', data);
    },
    
    addIngredient() {
      this.newRecipe.ingredients.push({ name: '', amount: '' });
    },
    
    removeIngredient(index) {
      if (this.newRecipe.ingredients.length > 1) {
        this.newRecipe.ingredients.splice(index, 1);
      }
    },
    
    async createRecipe() {
      this.creating = true;
      
      try {
        // Validate form
        if (!this.validateRecipe()) {
          return;
        }
        
        // Simulate API call
        await this.simulateApiCall();
        
        // Create new recipe object
        const recipe = {
          id: `my-${Date.now()}`,
          ...this.newRecipe,
          aggregateLikes: 0,
          createdBy: localStorage.getItem('user') || 'משתמש',
          createdAt: new Date().toISOString()
        };
        
        // Add to my recipes
        this.myRecipes.unshift(recipe);
        
        // Reset form
        this.resetForm();
        
        // Close modal
        this.showCreateModal = false;
        
        this.toast('הצלחה', 'המתכון נוצר בהצלחה!', 'success');
      } catch (error) {
        console.error('Error creating recipe:', error);
        this.toast('שגיאה', 'שגיאה ביצירת המתכון', 'danger');
      } finally {
        this.creating = false;
      }
    },
    
    validateRecipe() {
      if (!this.newRecipe.title.trim()) {
        this.toast('שגיאה', 'יש להזין שם למתכון', 'danger');
        return false;
      }
      
      if (!this.newRecipe.instructions.trim()) {
        this.toast('שגיאה', 'יש להזין הוראות הכנה', 'danger');
        return false;
      }
      
      const validIngredients = this.newRecipe.ingredients.filter(ing => 
        ing.name.trim() && ing.amount.trim()
      );
      
      if (validIngredients.length === 0) {
        this.toast('שגיאה', 'יש להוסיף לפחות מרכיב אחד', 'danger');
        return false;
      }
      
      return true;
    },
    
    resetForm() {
      this.newRecipe = {
        title: '',
        readyInMinutes: 30,
        servings: 4,
        image: '',
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        ingredients: [
          { name: '', amount: '' }
        ],
        instructions: ''
      };
    }
  }
}
</script>

<style scoped>
.modal {
  z-index: 1050;
}

.form-check {
  margin-bottom: 0.5rem;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
}

.btn:hover {
  transform: translateY(-1px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-dialog {
    margin: 1rem;
  }
}
</style> 