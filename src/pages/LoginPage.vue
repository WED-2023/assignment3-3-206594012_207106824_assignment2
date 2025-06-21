<template>
  <div class="container-fluid py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-header bg-success text-white text-center">
            <h3 class="mb-0">
              <i class="bi bi-box-arrow-in-right"></i> התחברות לאתר
            </h3>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="login" novalidate>
              <!-- Username Field -->
              <div class="mb-3">
                <label for="username" class="form-label">
                  <i class="bi bi-person"></i> שם משתמש
                </label>
                <input 
                  id="username"
                  v-model="state.username" 
                  type="text" 
                  class="form-control"
                  :class="{ 'is-invalid': v$.username.$error, 'is-valid': !v$.username.$error && state.username }"
                  placeholder="הכנס שם משתמש"
                  @blur="v$.username.$touch()"
                />
                <div v-if="v$.username.$error" class="invalid-feedback">
                  <div v-if="v$.username.required.$invalid">שם משתמש הוא שדה חובה</div>
                </div>
              </div>

              <!-- Password Field -->
              <div class="mb-3">
                <label for="password" class="form-label">
                  <i class="bi bi-lock"></i> סיסמה
                </label>
                <div class="input-group">
                  <input 
                    id="password"
                    v-model="state.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-control"
                    :class="{ 'is-invalid': v$.password.$error, 'is-valid': !v$.password.$error && state.password }"
                    placeholder="הכנס סיסמה"
                    @blur="v$.password.$touch()"
                  />
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="v$.password.$error" class="invalid-feedback">
                  <div v-if="v$.password.required.$invalid">סיסמה היא שדה חובה</div>
                </div>
              </div>

              <!-- Remember Me Checkbox -->
              <div class="mb-3 form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  id="rememberMe"
                  v-model="rememberMe"
                />
                <label class="form-check-label" for="rememberMe">
                  זכור אותי
                </label>
              </div>

              <!-- Submit Button -->
              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-success btn-lg"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                  {{ loading ? 'מתחבר...' : 'התחברות' }}
                </button>
              </div>
            </form>

            <!-- Register Link -->
            <div class="text-center mt-3">
              <p class="mb-0">
                אין לך חשבון? 
                <router-link to="/register" class="text-decoration-none">
                  <i class="bi bi-person-plus"></i> הירשם כאן
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useRouter } from 'vue-router';

export default {
  name: "LoginPage",
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const showPassword = ref(false);
    const rememberMe = ref(false);

    const state = reactive({
      username: '',
      password: '',
    });

    const rules = {
      username: { required },
      password: { required }
    };

    const v$ = useVuelidate(rules, state);

    const login = async () => {
      const isValid = await v$.value.$validate();
      
      if (!isValid) {
        window.toast('שגיאה', 'אנא תקן את השגיאות בטופס', 'danger');
        return;
      }

      loading.value = true;

      try {
        await window.axios.post('/login', {
          username: state.username,
          password: state.password
        });
        
        // Save user data to store
        window.store.login(state.username);
        
        // Save remember me preference
        if (rememberMe.value) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('username', state.username);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('username');
        }
        
        window.toast("התחברות מוצלחת", `ברוך הבא ${state.username}!`, "success");
        
        // Redirect to home page or previous page
        // router.push('/main');
        router.push('/');
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'אירעה שגיאה';
        window.toast("שגיאה", errorMessage, "danger");
      } finally {
        loading.value = false;
      }
    };

    // Load remembered username if exists
    const loadRememberedUser = () => {
      if (localStorage.getItem('rememberMe') === 'true') {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
          state.username = savedUsername;
          rememberMe.value = true;
        }
      }
    };

    // Load remembered user on mount
    loadRememberedUser();

    return { 
      state, 
      v$, 
      login, 
      loading, 
      showPassword, 
      rememberMe 
    };
  }
};
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

.form-control:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}

.btn-success {
  border-radius: 8px;
  font-weight: 600;
}

.btn-success:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 135, 84, 0.3);
}

.input-group .btn {
  border-left: none;
}

.input-group .form-control {
  border-right: none;
}

.input-group .form-control:focus {
  border-right: none;
  box-shadow: none;
}

.input-group .btn:focus {
  box-shadow: none;
}

.form-check-input:checked {
  background-color: #198754;
  border-color: #198754;
}

.form-check-input:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}

a {
  color: #198754;
}

a:hover {
  color: #146c43;
}
</style>
