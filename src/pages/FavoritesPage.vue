<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <!-- Page Header -->
        <div class="text-center mb-4">
          <h1 class="display-4 text-primary">
            <i class="bi bi-heart-fill"></i> המתכונים המועדפים שלי
          </h1>
          <p class="lead text-muted">שמור וצפה במתכונים האהובים עליך</p>
        </div>

        <!-- Filters and Actions -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-6">
                <div class="d-flex align-items-center">
                  <span class="me-3">מיון:</span>
                  <select v-model="sortBy" class="form-select w-auto" @change="sortFavorites">
                    <option value="date">תאריך הוספה</option>
                    <option value="name">שם מתכון</option>
                    <option value="time">זמן הכנה</option>
                    <option value="popularity">פופולריות</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6 text-end">
                <button @click="clearAllFavorites" class="btn btn-outline-danger" :disabled="favorites.length === 0">
                  <i class="bi bi-trash me-2"></i>נקה הכל
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">טוען...</span>
          </div>
          <p class="text-muted">טוען מתכונים מועדפים...</p>
        </div>

        <!-- Favorites List -->
        <div v-else-if="favorites.length > 0" class="row">
          <div 
            v-for="recipe in sortedFavorites" 
            :key="recipe.id" 
            class="col-md-6 col-lg-4 mb-4"
          >
            <div class="card h-100 shadow-sm recipe-card">
              <div class="position-relative">
                <img :src="recipe.image" :alt="recipe.title" class="card-img-top recipe-image" />
                <button 
                  @click="removeFromFavorites(recipe.id)" 
                  class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                  title="הסר ממועדפים"
                >
                  <i class="bi bi-heart-fill"></i>
                </button>
              </div>
              <div class="card-body">
                <h5 class="card-title recipe-title">{{ recipe.title }}</h5>
                <div class="recipe-meta mb-2">
                  <span class="badge bg-primary me-2">
                    <i class="bi bi-clock"></i> {{ recipe.readyInMinutes }} דקות
                  </span>
                  <span class="badge bg-success">
                    <i class="bi bi-star"></i> {{ recipe.aggregateLikes }} לייקים
                  </span>
                </div>
                <p class="card-text recipe-description">{{ recipe.instructions }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">
                    <i class="bi bi-calendar"></i> נוסף {{ recipe.addedDate }}
                  </small>
                  <button @click="viewRecipe(recipe.id)" class="btn btn-outline-primary btn-sm">
                    <i class="bi bi-eye me-1"></i>צפה
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5">
          <div class="card shadow-sm">
            <div class="card-body py-5">
              <i class="bi bi-heart display-1 text-muted mb-3"></i>
              <h3 class="text-muted mb-3">אין לך עדיין מתכונים מועדפים</h3>
              <p class="text-muted mb-4">
                התחל לחפש מתכונים והוסף אותם למועדפים כדי לראות אותם כאן
              </p>
              <router-link to="/search" class="btn btn-primary btn-lg">
                <i class="bi bi-search me-2"></i>חפש מתכונים
              </router-link>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="favorites.length > 0 && totalPages > 1" class="d-flex justify-content-center mt-4">
          <nav aria-label="ניווט מתכונים מועדפים">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button @click="changePage(currentPage - 1)" class="page-link">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
              <li 
                v-for="page in visiblePages" 
                :key="page" 
                class="page-item"
                :class="{ active: page === currentPage }"
              >
                <button @click="changePage(page)" class="page-link">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button @click="changePage(currentPage + 1)" class="page-link">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FavoritesPage',
  data() {
    return {
      loading: false,
      favorites: [],
      sortBy: 'date',
      currentPage: 1,
      itemsPerPage: 9
    }
  },
  computed: {
    sortedFavorites() {
      const sorted = [...this.favorites];
      
      switch (this.sortBy) {
        case 'name':
          return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'time':
          return sorted.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
        case 'popularity':
          return sorted.sort((a, b) => b.aggregateLikes - a.aggregateLikes);
        case 'date':
        default:
          return sorted.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
      }
    },
    
    totalPages() {
      return Math.ceil(this.favorites.length / this.itemsPerPage);
    },
    
    visiblePages() {
      const pages = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, this.currentPage + 2);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  },
  mounted() {
    this.loadFavorites();
  },
  methods: {
    async loadFavorites() {
      this.loading = true;
      
      try {
        // Simulate API call - replace with actual API
        await this.simulateApiCall();
        this.favorites = this.generateMockFavorites();
      } catch (error) {
        console.error('Error loading favorites:', error);
        this.toast('שגיאה', 'שגיאה בטעינת מתכונים מועדפים', 'danger');
      } finally {
        this.loading = false;
      }
    },
    
    simulateApiCall() {
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    },
    
    generateMockFavorites() {
      return [
        {
          id: 1,
          title: 'פסטה קרבונרה',
          image: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Pasta+Carbonara',
          readyInMinutes: 25,
          aggregateLikes: 150,
          instructions: 'מתכון פסטה קרבונרה קלאסי עם ביצים, גבינת פרמזן ופנצ\'טה.',
          addedDate: '2024-01-15'
        },
        {
          id: 2,
          title: 'סלמון אפוי',
          image: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Salmon',
          readyInMinutes: 35,
          aggregateLikes: 89,
          instructions: 'סלמון אפוי בתנור עם עשבי תיבול ולימון.',
          addedDate: '2024-01-10'
        },
        {
          id: 3,
          title: 'סלט יווני',
          image: 'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Greek+Salad',
          readyInMinutes: 15,
          aggregateLikes: 67,
          instructions: 'סלט יווני מסורתי עם גבינת פטה, זיתים ועגבניות.',
          addedDate: '2024-01-08'
        }
      ];
    },
    
    sortFavorites() {
      // Sorting is handled by computed property
      console.log('Sorting by:', this.sortBy);
    },
    
    removeFromFavorites(recipeId) {
      if (confirm('האם אתה בטוח שברצונך להסיר מתכון זה מהמועדפים?')) {
        this.favorites = this.favorites.filter(recipe => recipe.id !== recipeId);
        this.toast('הצלחה', 'המתכון הוסר מהמועדפים', 'success');
      }
    },
    
    clearAllFavorites() {
      if (confirm('האם אתה בטוח שברצונך לנקות את כל המועדפים?')) {
        this.favorites = [];
        this.toast('הצלחה', 'כל המועדפים נוקו', 'success');
      }
    },
    
    viewRecipe(recipeId) {
      this.$router.push(`/recipe/${recipeId}`);
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        window.scrollTo(0, 0);
      }
    }
  }
}
</script>

<style scoped>
.recipe-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  border-radius: 15px;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.recipe-image {
  height: 200px;
  object-fit: cover;
  border-radius: 15px 15px 0 0;
}

.recipe-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.recipe-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.recipe-description {
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.9rem;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
}

.btn:hover {
  transform: translateY(-1px);
}

.pagination .page-link {
  border-radius: 6px;
  margin: 0 2px;
}

.pagination .page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style> 