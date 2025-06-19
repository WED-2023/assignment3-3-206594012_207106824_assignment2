<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <!-- Page Header -->
        <div class="text-center mb-4">
          <h1 class="display-4 text-primary">
            <i class="bi bi-search"></i> חיפוש מתכונים
          </h1>
          <p class="lead text-muted">גלה מתכונים חדשים ומרתקים</p>
        </div>

        <!-- Search Form Component -->
        <SearchForm
          v-model:searchQuery="searchQuery"
          v-model:resultsCount="resultsCount"
          v-model:selectedCuisine="selectedCuisine"
          v-model:selectedDiet="selectedDiet"
          v-model:selectedIntolerance="selectedIntolerance"
          @search="performSearch"
          @validation-error="showError"
        />

        <!-- Last Search Display -->
        <div class="alert alert-info" v-if="lastSearch && !hasSearched">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h5 class="alert-heading">
                <i class="bi bi-clock-history"></i> החיפוש האחרון שלך:
              </h5>
              <p class="mb-0">"{{ lastSearch.query }}" - {{ lastSearch.resultsCount }} תוצאות</p>
            </div>
            <button @click="loadLastSearch" class="btn btn-outline-primary">
              <i class="bi bi-arrow-clockwise"></i> טען חיפוש אחרון
            </button>
          </div>
        </div>

        <!-- Search Results Component -->
        <SearchResults
          :results="searchResults"
          :loading="loading"
          :has-searched="hasSearched"
          @recipe-clicked="viewRecipe"
          @sort-changed="handleSortChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm.vue'
import SearchResults from '@/components/SearchResults.vue'

export default {
  name: 'SearchPage',
  components: {
    SearchForm,
    SearchResults
  },
  data() {
    return {
      searchQuery: '',
      resultsCount: 5,
      selectedCuisine: '',
      selectedDiet: '',
      selectedIntolerance: '',
      searchResults: [],
      loading: false,
      hasSearched: false,
      lastSearch: null
    }
  },
  mounted() {
    this.loadLastSearchFromStorage()
  },
  methods: {
    async performSearch(searchParams) {
      this.loading = true
      this.hasSearched = true
      
      try {
        // Simulate API call - replace with actual API call
        await this.simulateApiCall(searchParams)
        this.saveLastSearch(searchParams)
        this.showSuccess(`נמצאו ${this.searchResults.length} מתכונים!`)
      } catch (error) {
        this.showError('אירעה שגיאה בחיפוש. נסה שוב.')
        console.error('Search error:', error)
      } finally {
        this.loading = false
      }
    },
    
    simulateApiCall(searchParams) {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.searchResults = this.generateMockResults(searchParams.resultsCount)
          resolve()
        }, 1500)
      })
    },
    
    generateMockResults(count) {
      const mockRecipes = [
        {
          id: 1,
          title: 'פסטה קרבונרה',
          image: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Pasta+Carbonara',
          readyInMinutes: 25,
          aggregateLikes: 150,
          instructions: 'מתכון פסטה קרבונרה קלאסי עם ביצים, גבינת פרמזן ופנצ\'טה. מתכון מהיר וטעים שמתאים לארוחת ערב.'
        },
        {
          id: 2,
          title: 'סלמון אפוי',
          image: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Salmon',
          readyInMinutes: 35,
          aggregateLikes: 89,
          instructions: 'סלמון אפוי בתנור עם עשבי תיבול ולימון. מתכון בריא וטעים שמתאים לכל המשפחה.'
        },
        {
          id: 3,
          title: 'סלט יווני',
          image: 'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Greek+Salad',
          readyInMinutes: 15,
          aggregateLikes: 67,
          instructions: 'סלט יווני מסורתי עם גבינת פטה, זיתים ועגבניות. מתכון קל ומהיר להכנה.'
        },
        {
          id: 4,
          title: 'פאייה ספרדית',
          image: 'https://via.placeholder.com/400x300/96CEB4/FFFFFF?text=Paella',
          readyInMinutes: 45,
          aggregateLikes: 120,
          instructions: 'פאייה ספרדית מסורתית עם אורז, פירות ים ועשבי תיבול. מתכון מרשים לאירוח.'
        },
        {
          id: 5,
          title: 'פאייה ספרדית',
          image: 'https://via.placeholder.com/400x300/FFEAA7/FFFFFF?text=Tiramisu',
          readyInMinutes: 30,
          aggregateLikes: 95,
          instructions: 'טירמיסו איטלקי קלאסי עם קפה ומסקרפונה. קינוח מושלם לסיום ארוחה.'
        }
      ]
      
      return mockRecipes.slice(0, count)
    },
    
    handleSortChange(sortBy) {
      // Sort is handled in the SearchResults component
      console.log('Sort changed to:', sortBy)
    },
    
    viewRecipe(recipeId) {
      this.$router.push(`/recipe/${recipeId}`)
    },
    
    saveLastSearch(searchParams) {
      const lastSearch = {
        query: searchParams.query,
        resultsCount: this.searchResults.length,
        timestamp: Date.now()
      }
      localStorage.setItem('lastSearch', JSON.stringify(lastSearch))
    },
    
    loadLastSearchFromStorage() {
      const saved = localStorage.getItem('lastSearch')
      if (saved) {
        this.lastSearch = JSON.parse(saved)
      }
    },
    
    loadLastSearch() {
      if (this.lastSearch) {
        this.searchQuery = this.lastSearch.query
        this.performSearch({
          query: this.lastSearch.query,
          resultsCount: this.resultsCount,
          cuisine: this.selectedCuisine,
          diet: this.selectedDiet,
          intolerance: this.selectedIntolerance
        })
      }
    },
    
    showSuccess(message) {
      this.toast('הצלחה', message, 'success')
    },
    
    showError(message) {
      this.toast('שגיאה', message, 'danger')
    },
    
    toast(title, content, variant = null) {
      if (window.toast) {
        window.toast(title, content, variant)
      }
    }
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
  