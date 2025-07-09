<template>
  <div class="search-results-container">
    <!-- Results Header -->
    <div class="results-header card mb-3">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div class="results-info">
              <span v-if="loading" class="text-muted">
                <i class="bi bi-hourglass-split"></i> Searching...
              </span>
              <span v-else-if="results.length > 0" class="text-success">
                <i class="bi bi-check-circle"></i> {{ results.length }} results found
              </span>
              <span v-else class="text-warning">
                <i class="bi bi-exclamation-triangle"></i> No results found
              </span>
            </div>
          </div>

          <div class="col-md-6 text-end">
            <div class="sort-options" v-if="results.length > 0">
              <label class="form-label me-2">Sort by:</label>
              <select v-model="sortBy" class="form-select d-inline-block w-auto" @change="handleSort">
                <option value="popularity">Popularity</option>
                <option value="time">Preparation Time</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div class="loading-state text-center py-5" v-if="loading">
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted">Searching for recipes...</p>
    </div>

    <!-- Results List -->
    <div class="results-list" v-else-if="results.length > 0">
      <div class="row">
        <div
          v-for="recipe in sortedResults"
          :key="recipe.recipeID"
          class="col-md-6 col-lg-4 mb-4"
        >
          <RecipePreview
            :recipe="recipe"
            :route="`/recipes/fullview/${recipe.recipeID}`"
          />
        </div>
      </div>
    </div>

    <!-- No Results Message -->
    <div class="no-results text-center py-5" v-else-if="hasSearched">
      <div class="no-results-content">
        <i class="bi bi-search display-1 text-muted mb-3"></i>
        <h3 class="text-muted">No results found</h3>
        <p class="text-muted">Try changing your search terms or filters</p>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from '@/components/RecipePreview.vue';

export default {
  name: 'SearchResults',
  components: {
    RecipePreview
  },
  props: {
    results: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    hasSearched: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sortBy: 'popularity'
    }
  },
  mounted() {
    console.log("Search Results:", this.results);
  },
  computed: {
    sortedResults() {
      if (this.sortBy === 'time') {
        return [...this.results].sort((a, b) => a.readyInMinutes - b.readyInMinutes)
      } else {
        return [...this.results].sort((a, b) => b.aggregateLikes - a.aggregateLikes)
      }
    }
  },
  methods: {
    handleSort() {
      this.$emit('sort-changed', this.sortBy)
    }
  }
}
</script>

<style scoped>
.search-results-container {
  margin-top: 2rem;
}

.no-results-content {
  max-width: 400px;
  margin: 0 auto;
}

.sort-options {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .sort-options {
    justify-content: flex-start;
    margin-top: 1rem;
  }

  .results-header .card-body .row {
    text-align: center;
  }
}
</style>
