<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <!-- Page Header -->
        <div class="text-center mb-4">
          <h1 class="display-4 text-primary">
            <i class="bi bi-people"></i> המתכונים המשפחתיים שלי
          </h1>
          <p class="lead text-muted">מתכונים שעוברים מדור לדור - מסורת משפחתית</p>
        </div>

        <!-- Family Recipes Grid -->
        <div class="row">
          <div 
            v-for="recipe in familyRecipes" 
            :key="recipe.id" 
            class="col-md-6 col-lg-4 mb-4"
          >
            <div class="card h-100 family-recipe-card">
              <div class="recipe-image-container position-relative">
                <img 
                  :src="recipe.image" 
                  :alt="recipe.title"
                  class="card-img-top recipe-image"
                  @click="viewRecipe(recipe)"
                />
                
                <!-- Family Member Badge -->
                <div class="position-absolute top-0 start-0 m-2">
                  <span class="badge bg-warning text-dark">
                    <i class="bi bi-person-heart"></i> {{ recipe.familyMember }}
                  </span>
                </div>
                
                <!-- Occasion Badge -->
                <div class="position-absolute top-0 end-0 m-2">
                  <span class="badge bg-info">
                    <i class="bi bi-calendar-event"></i> {{ recipe.occasion }}
                  </span>
                </div>
              </div>
              
              <div class="card-body">
                <h5 class="card-title">{{ recipe.title }}</h5>
                
                <!-- Recipe Meta -->
                <div class="recipe-meta mb-2">
                  <span class="badge bg-primary me-1">
                    <i class="bi bi-clock"></i> {{ recipe.readyInMinutes }} דקות
                  </span>
                  <span class="badge bg-success">
                    <i class="bi bi-people"></i> {{ recipe.servings }} מנות
                  </span>
                </div>
                
                <!-- Family Story -->
                <div class="family-story mb-3">
                  <small class="text-muted">
                    <i class="bi bi-chat-quote"></i>
                    <strong>{{ recipe.familyMember }}</strong>: {{ recipe.story }}
                  </small>
                </div>
                
                <!-- Dietary Info -->
                <div class="dietary-info mb-3">
                  <span v-if="recipe.vegetarian" class="badge bg-info me-1">
                    <i class="bi bi-flower1"></i> צמחוני
                  </span>
                  <span v-if="recipe.glutenFree" class="badge bg-warning">
                    <i class="bi bi-shield-check"></i> ללא גלוטן
                  </span>
                </div>
                
                <!-- View Recipe Button -->
                <button @click="viewRecipe(recipe)" class="btn btn-outline-primary w-100">
                  <i class="bi bi-eye me-2"></i>צפה במתכון
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Family Story Section -->
        <div class="card shadow-sm mt-5">
          <div class="card-body">
            <h3 class="card-title text-center mb-4">
              <i class="bi bi-book-heart"></i> סיפורי המשפחה
            </h3>
            <div class="row">
              <div class="col-md-6 mb-3">
                <div class="family-member-story">
                  <h5 class="text-primary">
                    <i class="bi bi-person-circle"></i> סבתא רחל
                  </h5>
                  <p class="text-muted">
                    "המתכונים האלה עברו במשפחה שלנו כבר 3 דורות. 
                    כל מתכון מספר סיפור על אירוע מיוחד או על בן משפחה אהוב. 
                    אני זוכרת איך סבתא שלי הייתה מכינה את הפאייה הזו בכל יום שישי..."
                  </p>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="family-member-story">
                  <h5 class="text-success">
                    <i class="bi bi-person-circle"></i> דוד משה
                  </h5>
                  <p class="text-muted">
                    "המתכונים האלה הם חלק מהמורשת שלנו. 
                    כל מתכון הוא לא רק אוכל, אלא זיכרון, רגש וחיבור למשפחה. 
                    חשוב לנו לשמר אותם ולהעביר אותם לדורות הבאים."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recipe Detail Modal -->
    <div 
      v-if="selectedRecipe" 
      class="modal fade show d-block" 
      tabindex="-1"
      style="background-color: rgba(0,0,0,0.5);"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-people me-2"></i>{{ selectedRecipe.title }}
            </h5>
            <button 
              @click="selectedRecipe = null" 
              type="button" 
              class="btn-close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <img 
                  :src="selectedRecipe.image" 
                  :alt="selectedRecipe.title"
                  class="img-fluid rounded"
                />
              </div>
              <div class="col-md-6">
                <h6 class="text-primary">מאת: {{ selectedRecipe.familyMember }}</h6>
                <h6 class="text-info">מוכן ב: {{ selectedRecipe.occasion }}</h6>
                <p class="text-muted">{{ selectedRecipe.story }}</p>
              </div>
            </div>
            
            <hr>
            
            <!-- Ingredients -->
            <div class="mb-3">
              <h6>מרכיבים:</h6>
              <ul class="list-group list-group-flush">
                <li 
                  v-for="ingredient in selectedRecipe.ingredients" 
                  :key="ingredient.name"
                  class="list-group-item d-flex justify-content-between"
                >
                  <span>{{ ingredient.name }}</span>
                  <span class="text-muted">{{ ingredient.amount }}</span>
                </li>
              </ul>
            </div>
            
            <!-- Instructions -->
            <div>
              <h6>הוראות הכנה:</h6>
              <ol>
                <li 
                  v-for="(instruction, index) in selectedRecipe.instructions" 
                  :key="index"
                  class="mb-2"
                >
                  {{ instruction }}
                </li>
              </ol>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              @click="selectedRecipe = null" 
              type="button" 
              class="btn btn-secondary"
            >
              סגור
            </button>
            <button 
              @click="addToFavorites(selectedRecipe)" 
              type="button" 
              class="btn btn-primary"
            >
              <i class="bi bi-heart me-2"></i>הוסף למועדפים
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FamilyRecipesPage',
  data() {
    return {
      selectedRecipe: null,
      familyRecipes: [
        {
          id: 'family-1',
          title: 'פאייה משפחתית',
          image: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Family+Paella',
          familyMember: 'סבתא רחל',
          occasion: 'יום שישי',
          story: 'המתכון הזה עבר במשפחה שלנו כבר 3 דורות. סבתא שלי הייתה מכינה אותו בכל יום שישי לארוחת ערב משפחתית.',
          readyInMinutes: 60,
          servings: 8,
          vegetarian: false,
          glutenFree: true,
          ingredients: [
            { name: 'אורז', amount: '3 כוסות' },
            { name: 'פירות ים', amount: '1 קילו' },
            { name: 'עגבניות', amount: '4 יחידות' },
            { name: 'בצל', amount: '2 יחידות' },
            { name: 'שום', amount: '4 שיניים' },
            { name: 'עשבי תיבול', amount: 'לפי הטעם' }
          ],
          instructions: [
            'מחממים שמן זית בסיר גדול',
            'מטגנים בצל ושום עד הזהבה',
            'מוסיפים עגבניות ומבשלים 5 דקות',
            'מוסיפים אורז ומערבבים',
            'מוסיפים מים רותחים ומבשלים 20 דקות',
            'מוסיפים פירות ים ומבשלים עוד 10 דקות',
            'מגישים חם עם עשבי תיבול'
          ]
        },
        {
          id: 'family-2',
          title: 'עוגת גבינה מסורתית',
          image: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Cheesecake',
          familyMember: 'דוד משה',
          occasion: 'חגים',
          story: 'העוגה הזו היא המתכון הסודי של דוד משה. הוא מכין אותה בכל חג ומשפחה שלמה מחכה לטעום אותה.',
          readyInMinutes: 90,
          servings: 12,
          vegetarian: true,
          glutenFree: false,
          ingredients: [
            { name: 'גבינת קוטג\'', amount: '500 גרם' },
            { name: 'ביצים', amount: '4 יחידות' },
            { name: 'סוכר', amount: '1 כוס' },
            { name: 'קמח', amount: '2 כפות' },
            { name: 'וניל', amount: '1 כפית' }
          ],
          instructions: [
            'מחממים תנור ל-180 מעלות',
            'מערבבים גבינת קוטג\' עם סוכר',
            'מוסיפים ביצים אחת אחת',
            'מוסיפים קמח ווניל',
            'יוצקים לתבנית משומנת',
            'אופים 45 דקות עד הזהבה',
            'מצננים ומגישים'
          ]
        },
        {
          id: 'family-3',
          title: 'סלט יווני משפחתי',
          image: 'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Greek+Salad',
          familyMember: 'אמא שרה',
          occasion: 'ארוחות משפחתיות',
          story: 'הסלט הזה הוא חלק בלתי נפרד מכל ארוחה משפחתית שלנו. אמא שלי מכינה אותו בדיוק כמו שסבתא שלה לימדה אותה.',
          readyInMinutes: 15,
          servings: 6,
          vegetarian: true,
          glutenFree: true,
          ingredients: [
            { name: 'עגבניות', amount: '4 יחידות' },
            { name: 'מלפפון', amount: '2 יחידות' },
            { name: 'בצל אדום', amount: '1 יחידה' },
            { name: 'גבינת פטה', amount: '200 גרם' },
            { name: 'זיתים', amount: '1/2 כוס' },
            { name: 'שמן זית', amount: '3 כפות' }
          ],
          instructions: [
            'חותכים עגבניות לקוביות',
            'חותכים מלפפון לקוביות',
            'חותכים בצל לטבעות דקות',
            'מוסיפים גבינת פטה וזיתים',
            'מתבלים בשמן זית ומלח',
            'מערבבים בעדינות ומגישים'
          ]
        }
      ]
    }
  },
  methods: {
    viewRecipe(recipe) {
      this.selectedRecipe = recipe;
    },
    
    addToFavorites(recipe) {
      let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      // Check if already in favorites
      const exists = favorites.some(fav => fav.id === recipe.id);
      
      if (!exists) {
        favorites.push({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          addedDate: new Date().toISOString().split('T')[0],
          isFamilyRecipe: true
        });
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        this.toast('הצלחה', 'המתכון המשפחתי נוסף למועדפים!', 'success');
      } else {
        this.toast('מידע', 'המתכון כבר במועדפים שלך', 'info');
      }
    }
  }
}
</script>

<style scoped>
.family-recipe-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  border-radius: 15px;
  overflow: hidden;
}

.family-recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.recipe-image-container {
  position: relative;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.family-recipe-card:hover .recipe-image {
  transform: scale(1.05);
}

.family-story {
  background-color: #f8f9fa;
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.family-member-story {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

.modal {
  z-index: 1050;
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
  .modal-dialog {
    margin: 1rem;
  }
  
  .recipe-image {
    height: 150px;
  }
}
</style> 