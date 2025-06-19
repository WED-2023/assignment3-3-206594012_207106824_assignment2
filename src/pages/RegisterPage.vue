<template>
  <div class="container-fluid py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-header bg-primary text-white text-center">
            <h3 class="mb-0">
              <i class="bi bi-person-plus"></i> הרשמה לאתר
            </h3>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="register" novalidate>
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
                  <div v-if="v$.username.minLength.$invalid">שם משתמש חייב להכיל לפחות 3 תווים</div>
                  <div v-if="v$.username.alphaNum.$invalid">שם משתמש יכול להכיל רק אותיות ומספרים</div>
                </div>
              </div>

              <!-- Email Field -->
              <div class="mb-3">
                <label for="email" class="form-label">
                  <i class="bi bi-envelope"></i> כתובת אימייל
                </label>
                <input 
                  id="email"
                  v-model="state.email" 
                  type="email" 
                  class="form-control"
                  :class="{ 'is-invalid': v$.email.$error, 'is-valid': !v$.email.$error && state.email }"
                  placeholder="הכנס כתובת אימייל"
                  @blur="v$.email.$touch()"
                />
                <div v-if="v$.email.$error" class="invalid-feedback">
                  <div v-if="v$.email.required.$invalid">כתובת אימייל היא שדה חובה</div>
                  <div v-if="v$.email.email.$invalid">כתובת אימייל לא תקינה</div>
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
                  <div v-if="v$.password.minLength.$invalid">סיסמה חייבת להכיל לפחות 8 תווים</div>
                  <div v-if="v$.password.hasUpperCase.$invalid">סיסמה חייבת להכיל לפחות אות גדולה אחת</div>
                  <div v-if="v$.password.hasNumber.$invalid">סיסמה חייבת להכיל לפחות מספר אחד</div>
                </div>
                <div class="form-text">
                  <small>הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה ומספר</small>
                </div>
              </div>

              <!-- Confirm Password Field -->
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">
                  <i class="bi bi-lock-fill"></i> אישור סיסמה
                </label>
                <div class="input-group">
                  <input 
                    id="confirmPassword"
                    v-model="state.confirmPassword" 
                    :type="showConfirmPassword ? 'text' : 'password'" 
                    class="form-control"
                    :class="{ 'is-invalid': v$.confirmPassword.$error, 'is-valid': !v$.confirmPassword.$error && state.confirmPassword }"
                    placeholder="הכנס סיסמה שוב"
                    @blur="v$.confirmPassword.$touch()"
                  />
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="v$.confirmPassword.$error" class="invalid-feedback">
                  <div v-if="v$.confirmPassword.required.$invalid">אישור סיסמה הוא שדה חובה</div>
                  <div v-if="v$.confirmPassword.sameAsPassword.$invalid">הסיסמאות אינן תואמות</div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="bi bi-person-plus me-2"></i>
                  {{ loading ? 'מבצע הרשמה...' : 'הרשמה' }}
                </button>
              </div>
            </form>

            <!-- Login Link -->
            <div class="text-center mt-3">
              <p class="mb-0">
                כבר יש לך חשבון? 
                <router-link to="/login" class="text-decoration-none">
                  <i class="bi bi-box-arrow-in-right"></i> התחבר כאן
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
import { required, minLength, email, sameAs, helpers } from '@vuelidate/validators';
import { useRouter } from 'vue-router';

export default {
  name: "RegisterPage",
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);

    const state = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    // Custom validators
    const alphaNum = helpers.regex(/^[a-zA-Z0-9]+$/);
    const hasUpperCase = helpers.regex(/[A-Z]/);
    const hasNumber = helpers.regex(/[0-9]/);

    const rules = {
      username: { 
        required, 
        minLength: minLength(3),
        alphaNum
      },
      email: { 
        required, 
        email 
      },
      password: { 
        required, 
        minLength: minLength(8),
        hasUpperCase,
        hasNumber
      },
      confirmPassword: { 
        required, 
        sameAsPassword: sameAs(() => state.password) 
      }
    };

    const v$ = useVuelidate(rules, state);

    const register = async () => {
      const isValid = await v$.value.$validate();
      
      if (!isValid) {
        window.toast('שגיאה', 'אנא תקן את השגיאות בטופס', 'danger');
        return;
      }

      loading.value = true;

      try {
        await window.axios.post('/register', {
          username: state.username,
          email: state.email,
          password: state.password
        });
        
        window.toast("הרשמה מוצלחת", "החשבון נוצר בהצלחה! כעת תוכל להתחבר", "success");
        router.push('/login');
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'אירעה שגיאה בהרשמה';
        window.toast("שגיאה בהרשמה", errorMessage, "danger");
      } finally {
        loading.value = false;
      }
    };

    return { 
      state, 
      v$, 
      register, 
      loading, 
      showPassword, 
      showConfirmPassword 
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
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
  border-radius: 8px;
  font-weight: 600;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
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

.form-text {
  font-size: 0.8rem;
  color: #6c757d;
}

a {
  color: #0d6efd;
}

a:hover {
  color: #0a58ca;
}
</style>
