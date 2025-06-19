<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <!-- Page Header -->
        <div class="text-center mb-4">
          <h1 class="display-4 text-primary">
            <i class="bi bi-person-circle"></i> הפרופיל שלי
          </h1>
          <p class="lead text-muted">נהל את המידע האישי שלך</p>
        </div>

        <div class="row">
          <!-- Profile Info -->
          <div class="col-md-6 mb-4">
            <div class="card shadow">
              <div class="card-header bg-primary text-white">
                <h4 class="mb-0">
                  <i class="bi bi-person"></i> מידע אישי
                </h4>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <label class="form-label fw-bold">שם משתמש:</label>
                  <p class="form-control-plaintext">{{ username }}</p>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold">אימייל:</label>
                  <p class="form-control-plaintext">{{ email || 'לא הוזן' }}</p>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold">תאריך הצטרפות:</label>
                  <p class="form-control-plaintext">{{ joinDate }}</p>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold">סטטוס:</label>
                  <span class="badge bg-success">פעיל</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="col-md-6 mb-4">
            <div class="card shadow">
              <div class="card-header bg-success text-white">
                <h4 class="mb-0">
                  <i class="bi bi-graph-up"></i> סטטיסטיקות
                </h4>
              </div>
              <div class="card-body">
                <div class="row text-center">
                  <div class="col-6 mb-3">
                    <div class="border-end">
                      <h3 class="text-primary">{{ stats.viewedRecipes }}</h3>
                      <p class="text-muted mb-0">מתכונים שצפית</p>
                    </div>
                  </div>
                  <div class="col-6 mb-3">
                    <h3 class="text-success">{{ stats.favoriteRecipes }}</h3>
                    <p class="text-muted mb-0">מתכונים מועדפים</p>
                  </div>
                  <div class="col-6">
                    <div class="border-end">
                      <h3 class="text-info">{{ stats.searches }}</h3>
                      <p class="text-muted mb-0">חיפושים שביצעת</p>
                    </div>
                  </div>
                  <div class="col-6">
                    <h3 class="text-warning">{{ stats.daysActive }}</h3>
                    <p class="text-muted mb-0">ימים פעילים</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div class="col-md-6 mb-4">
            <div class="card shadow">
              <div class="card-header bg-info text-white">
                <h4 class="mb-0">
                  <i class="bi bi-gear"></i> העדפות
                </h4>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <label class="form-label">סוג מטבח מועדף:</label>
                  <select class="form-select" v-model="preferences.favoriteCuisine">
                    <option value="">בחר סוג מטבח</option>
                    <option value="italian">איטלקי</option>
                    <option value="mediterranean">ים תיכוני</option>
                    <option value="asian">אסייתי</option>
                    <option value="mexican">מקסיקני</option>
                    <option value="indian">הודי</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">דיאטה:</label>
                  <select class="form-select" v-model="preferences.diet">
                    <option value="">ללא הגבלה</option>
                    <option value="vegetarian">צמחוני</option>
                    <option value="vegan">טבעוני</option>
                    <option value="gluten-free">ללא גלוטן</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">רמת קושי מועדפת:</label>
                  <select class="form-select" v-model="preferences.difficulty">
                    <option value="easy">קל</option>
                    <option value="medium">בינוני</option>
                    <option value="hard">קשה</option>
                  </select>
                </div>
                <button @click="savePreferences" class="btn btn-primary w-100">
                  <i class="bi bi-check-circle me-2"></i>שמור העדפות
                </button>
              </div>
            </div>
          </div>

          <!-- Account Actions -->
          <div class="col-md-6 mb-4">
            <div class="card shadow">
              <div class="card-header bg-warning text-dark">
                <h4 class="mb-0">
                  <i class="bi bi-shield"></i> פעולות חשבון
                </h4>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <button @click="changePassword" class="btn btn-outline-primary">
                    <i class="bi bi-key me-2"></i>שנה סיסמה
                  </button>
                  <button @click="exportData" class="btn btn-outline-success">
                    <i class="bi bi-download me-2"></i>ייצא נתונים
                  </button>
                  <button @click="deleteAccount" class="btn btn-outline-danger">
                    <i class="bi bi-trash me-2"></i>מחק חשבון
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card shadow">
          <div class="card-header bg-secondary text-white">
            <h4 class="mb-0">
              <i class="bi bi-clock-history"></i> פעילות אחרונה
            </h4>
          </div>
          <div class="card-body">
            <div v-if="recentActivity.length > 0">
              <div v-for="activity in recentActivity" :key="activity.id" class="d-flex align-items-center mb-3">
                <div class="flex-shrink-0">
                  <i :class="activity.icon" class="text-primary fs-4"></i>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="mb-0">{{ activity.title }}</h6>
                  <small class="text-muted">{{ activity.time }}</small>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-muted py-4">
              <i class="bi bi-inbox display-4"></i>
              <p class="mt-2">אין פעילות להצגה</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
  data() {
    return {
      username: '',
      email: '',
      joinDate: '',
      stats: {
        viewedRecipes: 0,
        favoriteRecipes: 0,
        searches: 0,
        daysActive: 0
      },
      preferences: {
        favoriteCuisine: '',
        diet: '',
        difficulty: 'medium'
      },
      recentActivity: []
    }
  },
  mounted() {
    this.loadProfileData()
  },
  methods: {
    loadProfileData() {
      // Load user data from store/localStorage
      this.username = this.$store?.state?.user || localStorage.getItem('user') || 'משתמש'
      this.email = localStorage.getItem('userEmail') || 'user@example.com'
      this.joinDate = new Date().toLocaleDateString('he-IL')
      
      // Mock data - replace with actual API calls
      this.stats = {
        viewedRecipes: 15,
        favoriteRecipes: 8,
        searches: 23,
        daysActive: 7
      }
      
      this.recentActivity = [
        {
          id: 1,
          title: 'צפית במתכון "פסטה קרבונרה"',
          time: 'לפני שעה',
          icon: 'bi bi-eye'
        },
        {
          id: 2,
          title: 'הוספת מתכון למועדפים',
          time: 'לפני 3 שעות',
          icon: 'bi bi-heart-fill'
        },
        {
          id: 3,
          title: 'חיפשת מתכוני עוף',
          time: 'אתמול',
          icon: 'bi bi-search'
        }
      ]
    },
    
    savePreferences() {
      // Save preferences to localStorage/API
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences))
      this.toast('הצלחה', 'ההעדפות נשמרו בהצלחה', 'success')
    },
    
    changePassword() {
      this.toast('מידע', 'פונקציונליות זו תהיה זמינה בקרוב', 'info')
    },
    
    exportData() {
      this.toast('מידע', 'ייצוא נתונים יבוצע בקרוב', 'info')
    },
    
    deleteAccount() {
      if (confirm('האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו אינה הפיכה.')) {
        this.toast('מידע', 'מחיקת חשבון תבוצע בקרוב', 'warning')
      }
    }
  }
}
</script>

<style scoped>
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

.form-control-plaintext {
  color: #6c757d;
  font-weight: 500;
}
</style> 