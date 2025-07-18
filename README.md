[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/b8J_V0Lj)

**שמות המגישות: שני זילברברג- 207106824, אדוה חלמיש- 206594012, לי חמו- 314743485
**
# Vue Recipes - מערכת חיפוש מתכונים

מערכת חיפוש מתכונים מתקדמת המפותחת ב-Vue.js עם Bootstrap, המציעה חוויית משתמש מודרנית ואינטואיטיבית.

## 🌟 תכונות עיקריות

### 🔍 חיפוש מתכונים מתקדם
- **חיפוש טקסטואלי** - חיפוש לפי שם המתכון או המאכל
- **סינון מתקדם** - סינון לפי:
  - מטבח (Cuisine)
  - דיאטה (Diet)
  - אי-סבילות (Intolerances)
- **מיון תוצאות** - מיון לפי זמן הכנה או פופולריות
- **בחירת כמות תוצאות** - 5, 10, או 15 מתכונים
- **חיפוש אחרון** - שמירה וטעינה של החיפוש האחרון

### 👤 מערכת משתמשים
- **הרשמה** - עם ולידציה מתקדמת:
  - שם משתמש (3-8 תווים, אותיות בלבד)
  - סיסמה (5-10 תווים, מספר ותו מיוחד)
  - אימות סיסמה
  - בחירת מדינה מ-API חיצוני
- **התחברות** - עם:
  - "זכור אותי" - שמירה ב-localStorage
  - ניווט אוטומטי לפרופיל
- **פרופיל משתמש** - מידע אישי, סטטיסטיקות והגדרות

### 🏠 דף הבית
- **מתכונים רנדומליים** - 3 מתכונים עם כפתור רענון
- **מתכונים אחרונים** - למשתמשים מחוברים
- **התחברות/הרשמה** - למשתמשים לא מחוברים

### 📱 ניווט דינמי
- **סרגל ניווט מתקדם** - משתנה לפי סטטוס התחברות
- **Dropdown menu** - למשתמשים מחוברים עם:
  - הפרופיל שלי
  - מועדפים
  - המתכונים שלי
  - המתכונים המשפחתיים שלי
- **כפתור יצירת מתכון** - גישה מהירה ליצירת מתכון חדש

### 🍳 עמוד מתכון מלא
- **תצוגה מקדימה משופרת** - עם:
  - אינדיקטורים תזונתיים (טבעוני, צמחוני, ללא גלוטן)
  - סימון מתכונים צפויים
  - כפתור מועדפים
  - אפקט hover על תמונות
- **פרטי מתכון מלאים**:
  - רשימת מרכיבים עם כמויות
  - הוראות הכנה מפורטות
  - הכפלת מנות
  - מידע נוסף (טמפרטורה, עלות, קלוריות)
- **כפתור הכנת מתכון** - לניווט לעמוד הכנה

### ⭐ מועדפים
- **ניהול מועדפים** - הוספה והסרה
- **מיון וסינון** - לפי תאריך, שם, זמן הכנה
- **עיצוב מודרני** - עם Bootstrap Cards

### 👨‍🍳 המתכונים שלי
- **יצירת מתכונים** - טופס מקיף עם:
  - פרטי מתכון בסיסיים
  - אפשרויות תזונה
  - רשימת מרכיבים דינמית
  - הוראות הכנה
- **ניהול מתכונים** - צפייה ועריכה
- **Modal יצירה** - חוויית משתמש חלקה

### 👨‍👩‍👧‍👦 המתכונים המשפחתיים שלי
- **מתכונים משפחתיים** - 3 מתכונים עם סיפורים
- **מידע משפחתי** - מי המכין, מתי מוכן
- **סיפורי משפחה** - חיבור רגשי למסורת
- **Modal פרטים** - צפייה מלאה במתכון

### 🔒 הגנת נתיבים
- **Route Guards** - הגנה על עמודים פרטיים
- **הפניה אוטומטית** - משתמשים לא מחוברים מופנים להתחברות
- **הגנה על עמודי אורחים** - משתמשים מחוברים מופנים מהרשמה/התחברות

## 🛠️ טכנולוגיות

- **Frontend**: Vue.js 3 (Composition API)
- **Styling**: Bootstrap 5 + Bootstrap Icons
- **Routing**: Vue Router 4
- **State Management**: Vue 3 Reactive Store
- **Validation**: Vuelidate
- **Build Tool**: Vue CLI

## 📁 מבנה הפרויקט

```
src/
├── components/          # רכיבים לשימוש חוזר
│   ├── RecipePreview.vue      # תצוגה מקדימה של מתכון
│   ├── RecipePreviewList.vue  # רשימת מתכונים
│   ├── SearchForm.vue         # טופס חיפוש
│   └── SearchResults.vue      # תוצאות חיפוש
├── pages/              # עמודים ראשיים
│   ├── HomePage.vue           # דף הבית
│   ├── SearchPage.vue         # עמוד חיפוש
│   ├── LoginPage.vue          # עמוד התחברות
│   ├── RegisterPage.vue       # עמוד הרשמה
│   ├── ProfilePage.vue        # עמוד פרופיל
│   ├── FavoritesPage.vue      # עמוד מועדפים
│   ├── MyRecipesPage.vue      # המתכונים שלי
│   ├── FamilyRecipesPage.vue  # המתכונים המשפחתיים
│   ├── RecipeViewPage.vue     # עמוד מתכון מלא
│   ├── AboutPage.vue          # עמוד אודות
│   └── NotFoundPage.vue       # עמוד 404
├── router/             # הגדרות ניתוב
│   └── index.js
├── scss/               # סגנונות מותאמים
│   └── form-style.scss
├── App.vue             # רכיב ראשי
├── main.js             # נקודת כניסה
└── store.js            # ניהול מצב
```

## 🚀 התקנה והרצה

### דרישות מקדימות
- Node.js (גרסה 14 ומעלה)
- npm או yarn

### התקנה
```bash
# התקנת תלויות
npm install

# הרצת שרת פיתוח
npm run serve

# בנייה לייצור
npm run build
```

### גישה לאפליקציה
האפליקציה תהיה זמינה בכתובת: `http://localhost:8080`

## 🎨 עיצוב ו-UX

### עקרונות עיצוב
- **עיצוב רספונסיבי** - מותאם לכל הגדלי מסך
- **חוויית משתמש מודרנית** - אנימציות חלקות ואפקטים
- **נגישות** - תמיכה בקורא מסך וניווט מקלדת
- **עיצוב עברי** - תמיכה מלאה בעברית מימין לשמאל

### רכיבי Bootstrap
- **Cards** - לתצוגת מתכונים
- **Modals** - לטופסי יצירה ועריכה
- **Forms** - עם ולידציה מתקדמת
- **Navigation** - סרגל ניווט דינמי
- **Badges** - לאינדיקטורים תזונתיים
- **Spinners** - למצבי טעינה

## 📊 תכונות מתקדמות

### ניהול מצב
- **Vue 3 Composition API** - ניהול מצב מודרני
- **Reactive Store** - ניהול מצב מרכזי
- **LocalStorage** - שמירת העדפות משתמש

### ביצועים
- **Lazy Loading** - טעינה דינמית של עמודים
- **Component Caching** - שמירת רכיבים בזיכרון
- **Optimized Images** - תמונות מותאמות

### אבטחה
- **Route Guards** - הגנה על נתיבים
- **Input Validation** - ולידציה בצד לקוח
- **XSS Protection** - הגנה מפני התקפות

## 🔮 תכונות עתידיות (בונוס)

### עמוד הכנת מתכון
- **מעקב שלבים** - סימון שלבים שהושלמו
- **הכפלת כמויות** - התאמה למספר מנות
- **שמירת התקדמות** - למשתמשים מחוברים

### תכנון ארוחה
- **הוספת מתכונים לארוחה** - ניהול רשימת מתכונים
- **סדר הכנה** - שינוי סדר המתכונים
- **פס התקדמות** - מעקב התקדמות הכנה

## 👥 צוות פיתוח

- **מפתח ראשי**: Vue.js & Frontend Architecture
- **מעצב UX/UI**: Bootstrap & Responsive Design
- **מפתח Backend Integration**: API Integration & State Management

## 📝 רישיון

פרויקט זה פותח עבור מטרות לימודיות במסגרת קורס פיתוח סביבות.

---

**הערה**: האפליקציה מוכנה לשילוב עם Backend API ומכילה נתונים מדומים לצורך הדגמה.
