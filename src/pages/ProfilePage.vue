<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <h1 class="display-4 text-primary text-center mb-4">
          <i class="bi bi-person-circle"></i> My Profile
        </h1>
        <div class="card shadow mb-4">
          <div class="card-header bg-success text-white">
            <h4 class="mb-0"><i class="bi bi-heart"></i> My Favorite Recipes</h4>
          </div>
          <div class="card-body">
            <!-- Replace with your favorite recipes list component -->
            <p class="text-muted">Your favorite recipes will appear here.</p>
          </div>
        </div>
        <div class="card shadow mb-4">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0"><i class="bi bi-journal-text"></i> My Recipes</h4>
          </div>
          <div class="card-body">
            <!-- Replace with your personal recipes list component -->
            <p class="text-muted">Your personal recipes will appear here.</p>
          </div>
        </div>
        <div class="card shadow mb-4">
          <div class="card-header bg-info text-white">
            <h4 class="mb-0"><i class="bi bi-people"></i> My Family Recipes</h4>
          </div>
          <div class="card-body">
            <!-- Replace with your family recipes list component -->
            <p class="text-muted">Your family recipes will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage'
}
</script>

<style scoped>
.card {
  border-radius: 15px;
}
.card-header {
  border-radius: 15px 15px 0 0 !important;
  border-bottom: none;
}
</style> 