<template>
  <div class="container py-4">
    <h1 class="text-center mb-4 text-primary">Prepare: {{ recipeTitle }}</h1>

    <div class="mb-4 text-center">
      <label class="form-label">Adjust servings:</label>
      <div class="input-group justify-content-center w-50 mx-auto">
        <button class="btn btn-outline-secondary" @click="decreaseServings" :disabled="servingsMultiplier <= 1">-</button>
        <input type="number" class="form-control text-center" v-model.number="servingsMultiplier" min="1" max="10" />
        <button class="btn btn-outline-secondary" @click="increaseServings" :disabled="servingsMultiplier >= 10">+</button>
      </div>
      <small class="text-muted">Total servings: {{ baseServings * servingsMultiplier }}</small>
    </div>

    <!-- Ingredients -->
    <div class="card mb-4 shadow-sm">
      <div class="card-header bg-primary text-white"><h5>Ingredients</h5></div>
      <ul class="list-group list-group-flush">
        <li v-for="ingredient in scaledIngredients" :key="ingredient.name" class="list-group-item d-flex justify-content-between">
          <span>{{ ingredient.name }}</span>
          <span>{{ ingredient.amount }} {{ ingredient.unit }}</span>
        </li>
      </ul>
    </div>

    <!-- Instructions -->
    <div class="card shadow-sm">
      <div class="card-header bg-success text-white"><h5>Preparation Steps</h5></div>
      <div class="card-body">
        <div v-for="step in instructions" :key="step.stepNumber" class="d-flex align-items-center mb-3">
          <input type="checkbox" class="form-check-input me-2"
            :checked="progress.completedSteps.includes(step.stepNumber)"
            @change="toggleStep(step.stepNumber)" />
          <span>{{ step.stepNumber }}. {{ step.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/store';

export default {
  name: 'PrepareRecipePage',
  data() {
    return {
      recipeId: null,
      recipeType: null,
      recipeTitle: '',
      baseServings: 1,
      servingsMultiplier: 1,
      ingredients: [],
      instructions: [],
      progress: { completedSteps: [] }
    };
  },

  created() {
    this.determineRecipeType();
    this.loadPrepareData();
  },

  methods: {
    determineRecipeType() {
      const path = this.$route.path;
      if (path.startsWith('user/family-recipes/')) {
        this.recipeType = 'family';
        this.recipeId = this.$route.params.recipeId;
      } else if (path.startsWith('user/my-recipes/')) {
        this.recipeType = 'personal';
        this.recipeId = this.$route.params.recipeId;
      } else if (path.startsWith('/recipes/')) {
        this.recipeType = 'spoonacular';
        this.recipeId = this.$route.params.recipeId;
      }
    },

    async loadPrepareData() {
      try {
        let url;
        if (this.recipeType === 'personal') {
          url = `${store.server_domain}/user/my-recipes/${this.recipeId}/prepare`;
        } else if (this.recipeType === 'family') {
          url = `${store.server_domain}/user/family-recipes/${this.recipeId}/prepare`;
        } else if (this.recipeType === 'spoonacular') {
          url = `${store.server_domain}/recipes/${this.recipeId}/prepare`;
        }

        const response = await axios.get(url, { withCredentials: true });
        const data = response.data;

        this.instructions = data.instructions;
        this.progress = data.progress;
        this.ingredients = data.ingredients;
        this.baseServings = data.servings;
        this.recipeTitle = data.title || 'Recipe';
      } catch (error) {
        console.error('Error loading preparation data:', error);
      }
    },

    // Scale the ingredients based on multiplier
    scaledAmount(amount) {
      return (amount * this.servingsMultiplier).toFixed(2);
    },

    toggleStep(stepNumber) {
      const isCompleted = this.progress.completedSteps.includes(stepNumber);
      if (isCompleted) {
        this.progress.completedSteps = this.progress.completedSteps.filter(num => num !== stepNumber);
      } else {
        this.progress.completedSteps.push(stepNumber);
      }
      this.saveProgress(stepNumber);
    },

    async saveProgress(stepNumber) {
        try {
            const url = `${store.server_domain}/user/recipes/${this.recipeId}/prepare/step`;
            await axios.post(url, { stepIndex: stepNumber }, { withCredentials: true });
        } catch (error) {
            console.error('Failed to save preparation progress:', error);
        }
    },

    increaseServings() {
      if (this.servingsMultiplier < 10) this.servingsMultiplier++;
    },

    decreaseServings() {
      if (this.servingsMultiplier > 1) this.servingsMultiplier--;
    }
  },

  computed: {
    scaledIngredients() {
      return this.ingredients.map(ing => ({
        name: ing.name,
        amount: this.scaledAmount(parseFloat(ing.amount)),
        unit: ing.unit || ''
      }));
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 15px;
}
.card-header {
  border-radius: 15px 15px 0 0;
}
.form-check-input {
  transform: scale(1.5);
}
</style>
