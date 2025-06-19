<template>
  <div class="card h-100 recipe-preview-card" @click="viewRecipe">
    <div class="recipe-image-container position-relative">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        class="card-img-top recipe-image"
        :alt="recipe.title"
        @mouseenter="showHoverEffect = true"
        @mouseleave="showHoverEffect = false"
      />
      
      <!-- Hover Overlay -->
      <div 
        v-if="showHoverEffect" 
        class="recipe-hover-overlay d-flex align-items-center justify-content-center"
      >
        <div class="text-center text-white">
          <i class="bi bi-eye display-6"></i>
          <p class="mb-0 mt-2">לחץ לצפייה במתכון</p>
        </div>
      </div>
      
      <!-- Favorite Button -->
      <button 
        @click.stop="toggleFavorite"
        class="btn btn-sm position-absolute top-0 end-0 m-2"
        :class="isFavorite ? 'btn-danger' : 'btn-outline-danger'"
        :title="isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'"
      >
        <i class="bi" :class="isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
      </button>
      
      <!-- Viewed Indicator -->
      <div v-if="isViewed" class="position-absolute top-0 start-0 m-2">
        <span class="badge bg-success">
          <i class="bi bi-eye"></i> צפית
        </span>
      </div>
    </div>
    
    <div class="card-body">
      <h5 class="card-title recipe-title">{{ recipe.title }}</h5>
      
      <!-- Recipe Meta Info -->
      <div class="recipe-meta mb-2">
        <span class="badge bg-primary me-1">
          <i class="bi bi-clock"></i> {{ recipe.readyInMinutes }} דקות
        </span>
        <span class="badge bg-warning">
          <i class="bi bi-star"></i> {{ recipe.aggregateLikes }} לייקים
        </span>
      </div>
      
      <!-- Dietary Indicators -->
      <div class="dietary-indicators mb-2">
        <span v-if="recipe.vegan" class="badge bg-success me-1">
          <i class="bi bi-leaf"></i> טבעוני
        </span>
        <span v-else-if="recipe.vegetarian" class="badge bg-info me-1">
          <i class="bi bi-flower1"></i> צמחוני
        </span>
        <span v-if="recipe.glutenFree" class="badge bg-warning">
          <i class="bi bi-shield-check"></i> ללא גלוטן
        </span>
      </div>
      
      <!-- Recipe Description -->
      <p v-if="recipe.instructions" class="card-text recipe-description">
        {{ truncateText(recipe.instructions, 100) }}
      </p>
      
      <!-- Servings -->
      <div v-if="recipe.servings" class="text-muted small">
        <i class="bi bi-people"></i> {{ recipe.servings }} מנות
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showHoverEffect: false
    }
  },
  computed: {
    isFavorite() {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      return favorites.some(fav => fav.id === this.recipe.id);
    },
    isViewed() {
      const viewedRecipes = JSON.parse(localStorage.getItem('viewedRecipes') || '[]');
      return viewedRecipes.some(viewed => viewed.id === this.recipe.id);
    }
  },
  methods: {
    viewRecipe() {
      // Mark as viewed
      this.markAsViewed();
      
      // Navigate to recipe page
      this.$router.push(`/recipe/${this.recipe.id}`);
    },
    
    toggleFavorite(event) {
      event.stopPropagation();
      
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
      
      // Emit event to parent
      this.$emit('favorite-toggled', {
        recipeId: this.recipe.id,
        isFavorite: !this.isFavorite
      });
    },
    
    markAsViewed() {
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
    
    truncateText(text, maxLength) {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    }
  }
}
</script>

<style scoped>
.recipe-preview-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  border-radius: 15px;
  overflow: hidden;
}

.recipe-preview-card:hover {
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
}

.recipe-preview-card:hover .recipe-image {
  transform: scale(1.05);
}

.recipe-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.recipe-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.dietary-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.recipe-description {
  color: #666;
  line-height: 1.5;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: scale(1.1);
}

.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .recipe-image {
    height: 150px;
  }
  
  .recipe-title {
    font-size: 1rem;
  }
}
</style>
