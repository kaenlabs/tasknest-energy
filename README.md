# 🪺 TaskNest - Energy-Based Task Manager

[English](#english) | [Türkçe](#turkish)

---

## <a name="english"></a>English

### 📱 About

**TaskNest** is a modern, energy-aware task management application built with React Native and Expo. It helps you organize your tasks based on your energy levels throughout the day, suggesting high-energy tasks in the morning and low-energy tasks in the evening.

### ✨ Features

#### Core Features
- ✅ **Task Management**: Add, complete, and delete tasks with ease
- ⚡ **Energy-Based Organization**: Categorize tasks by energy level (High ⚡ / Low 💤)
- �️ **Categories & Priorities**: Organize tasks with 5 categories (Work, Personal, Health, Shopping, Other) and 3 priority levels
- 📊 **Statistics Dashboard**: Track your productivity with charts, completion rates, and category/priority breakdowns
- 🗂️ **Tab Navigation**: Swipeable Material Top Tabs for easy switching between screens
- 💾 **Persistent Storage**: All data saved locally with AsyncStorage

#### 🎮 Gamification & Motivation System
- 🏆 **12 Unique Achievements**: Unlock achievements with progress tracking
  - 🎯 First Task, ⭐ Task Master (10/50/100), 🔥 Streak Master (3/7/30 days)
  - 👑 Week Warrior, 💎 Category Master, 🚀 Priority Pro
  - 🌅 Early Bird & 🦉 Night Owl (time-based achievements)
- 🔥 **Streak Counter**: Track daily completion streaks with animated fire emoji
- 🎊 **Achievement Notifications**: Game-style notification cards with confetti celebrations
- 📊 **Progress Tracking**: Visual progress bars for all achievements
- ⚡ **Queue System**: Multiple achievements shown sequentially with smooth transitions
- ✨ **Celebration Effects**: Pulse, glow, and confetti animations on unlock

#### ⭐ Points & Level System (New!)
- 🎯 **Point System**: Earn points for completing tasks
  - ⚡ **+15 points** for early completion (before scheduled time)
  - ✅ **+10 points** for normal completion
  - ⏭️ **-5 points** for skipping tasks
  - ❌ **-10 points** for marking as failed
  - ⚠️ **-15 points** for auto-failed tasks (24h overdue)
- 🏅 **Level System**: Progress through levels (100 points per level, max 50)
- 📈 **Live Progress Bar**: Visual progress indicator with gold accents
- 🏆 **Stats Display**: Total points, current level, and progress percentage
- 📊 **Points History**: Track all point changes with action types

#### 🚨 Overdue Task Management (New!)
- ⏰ **Automatic Overdue Detection**: Tasks automatically become overdue after scheduled time
- 🔴 **Visual Indicators**: Red border (6px) and alert badge on overdue tasks
- ⚡ **Quick Actions**: Three action buttons for overdue tasks:
  - ✅ **Complete** (+10 points): Mark task as done
  - ⏭️ **Skip** (-5 points): Skip task with confirmation
  - ❌ **Fail** (-10 points): Mark as failed with streak warning
- ⏱️ **Time Tracking**: Shows how long the task has been overdue (days/hours/minutes)
- 🔄 **Auto-Fail System**: Tasks automatically fail after 24 hours (-15 points)
- 🔔 **Real-time Updates**: Checks for overdue tasks every 60 seconds
- 🎯 **Haptic Feedback**: Tactile responses for all overdue actions
- 📱 **Confirmation Alerts**: Safety confirmations for skip/fail actions
- 🔥 **Streak Protection**: Warns before actions that might break your streak

#### 🤖 AI-Powered Features (New!)
- ✨ **Smart Task Suggestions**: Google Gemini AI analyzes your task titles and suggests:
  - 📁 Best category (Work, Personal, Health, Shopping, Other)
  - 🎯 Priority level (High, Medium, Low)
  - ⚡ Energy requirement (High/Low)
  - ⏱️ Estimated duration (15 mins, 30 mins, 1 hour, 2+ hours)
  - 💡 Helpful tips to complete the task efficiently
  - 📅 **Smart Date Suggestions**: AI recommends optimal day (Today, Tomorrow, Weekend, Next Week)
  - ⏰ **Smart Time Suggestions**: AI suggests best time based on task type
    - Exercise → Morning (07:00-09:00)
    - Work meetings → Focus time (09:00-11:00)
    - Shopping → Evening (17:00-19:00)
    - Reading → Evening calm (20:00-22:00)
  - 💬 **Schedule Reasoning**: Explains why the suggested time is optimal
- 🌐 **Multilingual AI**: Prompts adapt to your selected language (TR/EN)
- 🎯 **One-Click Apply**: Apply all AI suggestions instantly with haptic feedback
- 💡 **Auto-Notes**: AI tips automatically added to task notes with lightbulb emoji

#### 📅 Scheduling & Calendar (V2)
- 📆 **Monthly Calendar View**: Beautiful grid calendar with task visualization
- 🗓️ **Day Selection**: Tap any day to view all scheduled tasks
- 📍 **Task Indicators**: Color-coded dots showing priority levels
  - 🔴 Red: High priority
  - 🟡 Yellow: Medium priority
  - 🔵 Blue: Low priority
  - ✅ Green: Completed tasks
- 🎯 **Today Highlight**: Current day highlighted with primary color
- 📊 **Task Count**: Badge showing number of tasks per day
- ⬅️➡️ **Month Navigation**: Smooth transitions between months
- 🎯 **Quick Jump**: "Today" button to quickly return to current month
- 📱 **Date & Time Pickers**: Native iOS/Android date/time selection
- 🔄 **Achievement Integration**: Completing tasks from calendar counts for streaks and achievements
- 🌐 **Weekday Localization**: Weekday names adapt to selected language

#### 🔔 Smart Notifications & Reminders (New!)
- ⏰ **Task Reminders**: Automatic notifications 5 minutes before scheduled tasks
- 📅 **Daily Reminders**: Customizable morning reminder with task summary
  - Shows today's task count and next upcoming task
  - Customizable time with native time picker
  - Smart messages based on your schedule
- 🔥 **Streak Reminders**: Evening reminder (8 PM) if you haven't completed tasks today
- 🏆 **Achievement Notifications**: Instant notifications when you unlock new achievements
- ⚙️ **Granular Controls**: Toggle each notification type independently
- 🔕 **Smart Scheduling**: Won't schedule notifications for tasks less than 5 minutes away
- 🐛 **Debug Tools**: Built-in notification debugger to view all scheduled notifications
- 📱 **Native Integration**: Uses iOS/Android native notification systems
- 🌐 **Localized Messages**: All notifications respect your language selection

#### User Experience
- 🎯 **Smart Onboarding**: Interactive 4-step tutorial with smooth animations
  - 🎨 **Splash Screen**: KΛEN Labs logo with fade/scale animations
  - ✨ **Animated Transitions**: Smooth slide & fade between splash → onboarding → app
  - 🎬 **Exit Animations**: Zoom out & fade effects on completion
- 🌙 **Dark/Light Theme**: Beautiful pastel themes with automatic switching
- 🌍 **Bilingual Support**: Full Turkish and English with reactive language switching
- 🎨 **Modern UI**: Clean, rounded cards with 60fps smooth animations
- 🕒 **Time-Based Suggestions**: Smart recommendations based on time of day
- 📊 **Smart Filtering**: Filter tasks by energy level or completion status
- 👆 **Haptic Feedback**: Tactile responses for all interactions (iOS)
- 📋 **Task Management**: Tap any task to view full details, edit with pre-filled data, or delete
- ✏️ **Smart Edit Mode**: Edit button opens modal with all task data pre-loaded
- 🛠️ **Dev Tools**: Draggable floating button with quick reset options (dev mode only)

### 🛠 Technologies

- **React Native** with **Expo SDK 54**
- **TypeScript** for type safety
- **React Context API** for state management
- **React Navigation** (Material Top Tabs) for swipeable tab navigation
- **AsyncStorage** for local data persistence (tasks, achievements, streaks)
- **i18n-js** for internationalization with reactive updates
- **React Native Reanimated v4** for 60fps smooth animations
- **React Native Confetti Cannon** for celebration effects
- **Expo Notifications** for local notifications and reminders
- **React Native Community DateTimePicker** for native date/time selection
- **Expo Vector Icons** for beautiful icons
- **ESLint & Prettier** for code quality

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/kaenlabs/tasknest-energy.git
cd tasknest-energy

# Install dependencies
npm install

# Setup environment variables (optional, for AI features)
cp .env.example .env
# Add your Gemini API key to .env file

# Start the app
npx expo start
```

### 🤖 AI Features Setup (Optional)

To enable AI-powered task suggestions:

1. Get a **free** Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env` file in the project root
3. Add your API key:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```
4. Restart the development server

**Note:** AI features work without the API key, but suggestions won't be available.

### 🚀 Running the App

```bash
# Start Expo development server
npx expo start

# Run on iOS (requires macOS)
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### 📱 Using Expo Go

1. Install **Expo Go** on your iOS or Android device
2. Run `npx expo start` in the terminal
3. Scan the QR code with your camera (iOS) or Expo Go app (Android)

### 📂 Project Structure

```
TaskNest/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── AchievementCard.tsx        # Achievement display card
│   │   ├── AchievementNotification.tsx # Game-style unlock notification
│   │   ├── AchievementQueue.tsx       # Sequential achievement display
│   │   ├── ConfettiCelebration.tsx    # Confetti animation wrapper
│   │   ├── StreakCard.tsx             # Streak counter with animations
│   │   ├── AddTaskModal.tsx           # Task creation/edit with AI
│   │   ├── TaskDetailModal.tsx        # Full task view
│   │   ├── OverdueActionCard.tsx      # Overdue task action buttons
│   │   ├── SplashScreen.tsx           # Animated KΛEN Labs logo
│   │   ├── DevTools.tsx               # Draggable dev menu
│   │   └── ...
│   ├── screens/         # Screen components
│   │   ├── HomeScreen.tsx             # Main task list
│   │   ├── CalendarScreen.tsx         # V2 Monthly calendar view
│   │   ├── ScheduledScreen.tsx        # V1 Scheduled tasks list
│   │   ├── StatsScreen.tsx            # Statistics & achievements
│   │   ├── NotificationSettingsScreen.tsx # Notification preferences
│   │   └── OnboardingScreen.tsx       # First-time user flow
│   ├── context/         # React Context providers
│   │   ├── ThemeContext.tsx           # Theme management
│   │   ├── LocaleContext.tsx          # Language management
│   │   ├── TaskContext.tsx            # Task state & persistence & overdue detection
│   │   ├── PointsContext.tsx          # Points & level system
│   │   └── AchievementContext.tsx     # Achievement & streak logic
│   ├── services/        # External services
│   │   ├── aiService.ts               # Google Gemini AI integration
│   │   └── notificationService.ts     # Notification scheduling & management
│   ├── navigation/      # React Navigation setup
│   │   └── MainNavigator.tsx          # Material Top Tabs
│   ├── types/           # TypeScript type definitions
│   │   ├── task.types.ts              # Task, Category, Priority, TaskStatus types
│   │   └── achievement.types.ts       # Achievement & Streak types
│   ├── locales/         # i18n translation files (TR/EN)
│   │   ├── tr.ts                      # Turkish translations
│   │   ├── en.ts                      # English translations
│   │   └── i18n.ts                    # i18n configuration
│   └── utils/           # Utility functions
│       ├── achievementData.ts         # Achievement definitions
│       └── haptics.ts                 # Haptic feedback utilities
├── App.tsx              # Main application component
├── .env.example         # Environment variables template
└── package.json
```

### 👨‍💻 Developer

**KΛEN Labs**  
Developed by: Kaan Çelik

- GitHub: [@kaenlabs](https://github.com/kaenlabs)

### 📝 License

This project is open source and available under the MIT License.

---

## <a name="turkish"></a>Türkçe

### 📱 Hakkında

**TaskNest**, React Native ve Expo ile geliştirilmiş modern, enerji bazlı bir görev yönetim uygulamasıdır. Görevlerinizi gün içindeki enerji seviyenize göre organize etmenize yardımcı olur, sabahları yüksek enerjili görevleri, akşamları düşük enerjili görevleri önerir.

### ✨ Özellikler

#### Temel Özellikler
- ✅ **Görev Yönetimi**: Kolayca görev ekleyin, tamamlayın ve silin
- ⚡ **Enerji Bazlı Organizasyon**: Görevleri enerji seviyesine göre kategorize edin (Yüksek ⚡ / Düşük 💤)
- �️ **Kategori ve Öncelik Sistemi**: 5 kategori (İş, Kişisel, Sağlık, Alışveriş, Diğer) ve 3 öncelik seviyesi ile görevlerinizi düzenleyin
- 📊 **İstatistik Paneli**: Grafikler, tamamlanma oranları ve kategori/öncelik dağılımları ile verimliliğinizi takip edin
- 🗂️ **Sekme Navigasyonu**: Kaydırılabilir Material Top Tabs ile kolay ekran geçişi
- 💾 **Kalıcı Depolama**: AsyncStorage ile tüm veriler yerel olarak saklanır

#### 🎮 Oyunlaştırma & Motivasyon Sistemi
- 🏆 **12 Benzersiz Başarı**: İlerleme takipli başarılar kilidi açın
  - 🎯 İlk Görev, ⭐ Görev Ustası (10/50/100), 🔥 Seri Ustası (3/7/30 gün)
  - 👑 Hafta Savaşçısı, 💎 Kategori Ustası, 🚀 Öncelik Profesyoneli
  - 🌅 Erken Kuş & 🦉 Gece Kuşu (zamana dayalı başarılar)
- 🔥 **Seri Sayacı**: Animasyonlu ateş emojisi ile günlük tamamlama serilerini takip edin
- 🎊 **Başarı Bildirimleri**: Konfeti kutlamalı oyun tarzı bildirim kartları
- 📊 **İlerleme Takibi**: Tüm başarılar için görsel ilerleme çubukları
- ⚡ **Sıralı Sistem**: Birden fazla başarı pürüzsüz geçişlerle sırayla gösterilir
- ✨ **Kutlama Efektleri**: Kilidi açıldığında pulse, glow ve konfeti animasyonları

#### ⭐ Puan & Seviye Sistemi (Yeni!)
- 🎯 **Puan Sistemi**: Görev tamamlayarak puan kazanın
  - ⚡ **+15 puan** erken tamamlama için (zamanlanan saatten önce)
  - ✅ **+10 puan** normal tamamlama için
  - ⏭️ **-5 puan** görev atlama için
  - ❌ **-10 puan** başarısız işaretleme için
  - ⚠️ **-15 puan** otomatik başarısız görevler için (24 saat gecikme)
- 🏅 **Seviye Sistemi**: Seviyelerde ilerleyin (seviye başına 100 puan, maks 50)
- 📈 **Canlı İlerleme Çubuğu**: Altın vurgulu görsel ilerleme göstergesi
- 🏆 **İstatistik Ekranı**: Toplam puan, mevcut seviye ve ilerleme yüzdesi
- 📊 **Puan Geçmişi**: Tüm puan değişikliklerini aksiyon tipleriyle takip edin

#### 🚨 Gecikmiş Görev Yönetimi (Yeni!)
- ⏰ **Otomatik Gecikme Algılama**: Görevler zamanlanan saatten sonra otomatik gecikir
- 🔴 **Görsel İşaretler**: Gecikmiş görevlerde kırmızı kenarlık (6px) ve uyarı rozeti
- ⚡ **Hızlı Aksiyonlar**: Gecikmiş görevler için üç aksiyon butonu:
  - ✅ **Tamamla** (+10 puan): Görevi bitti olarak işaretle
  - ⏭️ **Atla** (-5 puan): Onaylama ile görevi atla
  - ❌ **Başarısız** (-10 puan): Seri uyarısıyla başarısız işaretle
- ⏱️ **Zaman Takibi**: Görevin ne kadar süredir geciktiğini gösterir (gün/saat/dakika)
- 🔄 **Otomatik Başarısız Sistemi**: Görevler 24 saat sonra otomatik başarısız olur (-15 puan)
- 🔔 **Gerçek Zamanlı Güncelleme**: Her 60 saniyede gecikmiş görevleri kontrol eder
- 🎯 **Haptik Geri Bildirim**: Tüm gecikme aksiyonları için dokunsal tepki
- 📱 **Onay Uyarıları**: Atla/başarısız aksiyonları için güvenlik onayları
- 🔥 **Seri Koruması**: Seriyi kırabilecek aksiyonlar öncesi uyarır

#### 🤖 Yapay Zeka Destekli Özellikler (Yeni!)
- ✨ **Akıllı Görev Önerileri**: Google Gemini AI görev başlığınızı analiz eder ve önerir:
  - 📁 En uygun kategori (İş, Kişisel, Sağlık, Alışveriş, Diğer)
  - 🎯 Öncelik seviyesi (Yüksek, Orta, Düşük)
  - ⚡ Enerji gereksinimi (Yüksek/Düşük)
  - ⏱️ Tahmini süre (15 dk, 30 dk, 1 saat, 2+ saat)
  - 💡 Görevi verimli tamamlamak için ipuçları
  - 📅 **Akıllı Tarih Önerileri**: AI en uygun günü önerir (Bugün, Yarın, Hafta Sonu, Gelecek Hafta)
  - ⏰ **Akıllı Saat Önerileri**: Görev tipine göre ideal saati belirler
    - Egzersiz → Sabah (07:00-09:00)
    - İş toplantıları → Odaklanma zamanı (09:00-11:00)
    - Alışveriş → Akşam (17:00-19:00)
    - Okuma → Akşam sakinliği (20:00-22:00)
  - 💬 **Zamanlama Açıklaması**: Önerilen zamanın neden uygun olduğunu açıklar
- 🌐 **Çok Dilli AI**: Yapay zeka seçtiğiniz dile göre uyum sağlar (TR/EN)
- 🎯 **Tek Tıkla Uygula**: Tüm AI önerilerini haptik feedback ile anında uygula
- 💡 **Otomatik Notlar**: AI ipuçları ampul emojisiyle otomatik olarak görev notlarına eklenir

#### 📅 Zamanlama & Takvim (V2)
- 📆 **Aylık Takvim Görünümü**: Görev görselleştirmeli güzel grid takvim
- 🗓️ **Gün Seçimi**: Herhangi bir güne dokunarak o günün tüm görevlerini görüntüle
- 📍 **Görev İndikatörleri**: Öncelik seviyelerini gösteren renkli noktalar
  - 🔴 Kırmızı: Yüksek öncelik
  - 🟡 Sarı: Orta öncelik
  - 🔵 Mavi: Düşük öncelik
  - ✅ Yeşil: Tamamlanan görevler
- 🎯 **Bugün Vurgusu**: Güncel gün birincil renkle vurgulanır
- 📊 **Görev Sayısı**: Günlük görev sayısını gösteren rozet
- ⬅️➡️ **Ay Navigasyonu**: Aylar arası akıcı geçişler
- 🎯 **Hızlı Atlama**: Mevcut aya hızlıca dönmek için "Bugün" butonu
- 📱 **Tarih & Saat Seçiciler**: Native iOS/Android tarih/saat seçimi
- 🔄 **Başarım Entegrasyonu**: Takvimden görev tamamlama serileri ve başarımları sayar
- 🌐 **Gün Yerelleştirme**: Gün isimleri seçilen dile uyum sağlar

#### 🔔 Akıllı Bildirimler & Hatırlatıcılar (Yeni!)
- ⏰ **Görev Hatırlatıcıları**: Zamanlanmış görevlerden 5 dakika önce otomatik bildirimler
- 📅 **Günlük Hatırlatıcılar**: Görev özeti ile özelleştirilebilir sabah hatırlatıcısı
  - Bugünkü görev sayısını ve en yakın görevi gösterir
  - Native saat seçici ile özelleştirilebilir zaman
  - Programınıza göre akıllı mesajlar
- 🔥 **Seri Hatırlatıcıları**: Bugün görev tamamlamadıysanız akşam (20:00) hatırlatma
- 🏆 **Başarım Bildirimleri**: Yeni başarım kilidini açtığınızda anlık bildirimler
- ⚙️ **Detaylı Kontroller**: Her bildirim türünü bağımsız olarak açıp kapatın
- 🔕 **Akıllı Zamanlama**: 5 dakikadan az kalan görevler için bildirim zamanlamaz
- 🐛 **Hata Ayıklama Araçları**: Tüm zamanlanmış bildirimleri görüntülemek için yerleşik hata ayıklayıcı
- 📱 **Native Entegrasyon**: iOS/Android native bildirim sistemlerini kullanır
- 🌐 **Yerelleştirilmiş Mesajlar**: Tüm bildirimler dil seçiminize uyar

#### Kullanıcı Deneyimi
- 🎯 **Akıllı Karşılama**: Yumuşak animasyonlarla 4 adımlı interaktif öğretici
  - 🎨 **Açılış Ekranı**: Fade/scale animasyonlu KΛEN Labs logosu
  - ✨ **Animasyonlu Geçişler**: Açılış → karşılama → uygulama arası yumuşak kayma & solma
  - 🎬 **Çıkış Animasyonları**: Tamamlamada yakınlaştırma & solma efektleri
- 🌙 **Koyu/Açık Tema**: Otomatik geçişli güzel pastel temalar
- 🌍 **İki Dilli Destek**: Reaktif dil değişimi ile tam Türkçe ve İngilizce
- 🎨 **Modern Arayüz**: 60fps akıcı animasyonlarla temiz, yuvarlak kartlar
- 🕒 **Zamana Dayalı Öneriler**: Günün saatine göre akıllı öneriler
- 📊 **Akıllı Filtreleme**: Görevleri enerji seviyesi veya tamamlanma durumuna göre filtreleyin
- 👆 **Haptik Geri Bildirim**: Tüm etkileşimlerde dokunsal tepki (iOS)
- 📋 **Görev Yönetimi**: Herhangi bir göreve dokunarak tam detayları görüntüle, önceden doldurulmuş verilerle düzenle veya sil
- ✏️ **Akıllı Düzenleme**: Düzenle butonu tüm görev verileri yüklü şekilde modalı açar
- 🛠️ **Geliştirici Araçları**: Hızlı sıfırlama seçenekleri ile sürüklenebilir buton (geliştirme modu)

### 🛠 Teknolojiler

- **React Native** ve **Expo SDK 54**
- Tip güvenliği için **TypeScript**
- Durum yönetimi için **React Context API**
- Kaydırılabilir sekme navigasyonu için **React Navigation** (Material Top Tabs)
- Yerel veri kalıcılığı için **AsyncStorage** (görevler, başarılar, seriler)
- Reaktif çok dilli destek için **i18n-js**
- 60fps akıcı animasyonlar için **React Native Reanimated v4**
- Kutlama efektleri için **React Native Confetti Cannon**
- Yerel bildirimler ve hatırlatıcılar için **Expo Notifications**
- Native tarih/saat seçimi için **React Native Community DateTimePicker**
- Güzel ikonlar için **Expo Vector Icons**
- Kod kalitesi için **ESLint & Prettier**

### 📦 Kurulum

```bash
# Depoyu klonlayın
git clone https://github.com/kaenlabs/tasknest-energy.git
cd tasknest-energy

# Bağımlılıkları yükleyin
npm install

# Uygulamayı başlatın
npx expo start
```

### 🚀 Uygulamayı Çalıştırma

```bash
# Expo geliştirme sunucusunu başlat
npx expo start

# iOS'ta çalıştır (macOS gerektirir)
npm run ios

# Android'de çalıştır
npm run android

# Web'de çalıştır
npm run web
```

### 📱 Expo Go Kullanımı

1. iOS veya Android cihazınıza **Expo Go** uygulamasını yükleyin
2. Terminalde `npx expo start` komutunu çalıştırın
3. QR kodu kameranız (iOS) veya Expo Go uygulaması (Android) ile tarayın

### 📂 Proje Yapısı

```
TaskNest/
├── src/
│   ├── components/      # Yeniden kullanılabilir UI bileşenleri
│   ├── screens/         # Ekran bileşenleri (Ana Sayfa, İstatistikler, Karşılama)
│   ├── context/         # React Context sağlayıcıları (Tema, Dil, Görev)
│   ├── navigation/      # React Navigation yapılandırması
│   ├── types/           # TypeScript tip tanımlamaları
│   ├── locales/         # i18n çeviri dosyaları (TR/EN)
│   └── utils/           # Yardımcı fonksiyonlar
├── App.tsx              # Ana uygulama bileşeni
└── package.json
```

### 👨‍💻 Geliştirici

**KΛEN Labs**  
Geliştiren: Kaan Çelik

- GitHub: [@kaenlabs](https://github.com/kaenlabs)


### 📝 Lisans

Bu proje açık kaynaklıdır ve MIT Lisansı altında mevcuttur.

---

### 📸 Ekran Görüntüleri

_Ekran görüntüleri eklenecek_

### 🔮 Gelecek Özellikler

- [x] ~~Görev önceliklendirme~~
- [x] ~~Kategori sistemi~~
- [x] ~~Haftalık istatistikler~~
- [x] ~~Achievement/Badge sistemi~~
- [x] ~~Streak takibi~~
- [x] ~~Konfeti animasyonları~~
- [x] ~~Haptic feedback (titreşim)~~
- [x] ~~AI-powered task suggestions (Google Gemini)~~
- [x] ~~Task detail view~~
- [x] ~~Estimated duration field~~
- [x] ~~Görev düzenleme (edit mode)~~
- [x] ~~AI saat ve tarih önerileri~~
- [x] ~~V1 Scheduled Tasks (liste görünümü)~~
- [x] ~~V2 Calendar View (aylık takvim)~~
- [x] ~~Bildirim desteği (zamanlanan görevler için)~~
- [x] ~~Günlük hatırlatıcılar~~
- [x] ~~Seri hatırlatıcıları~~
- [x] ~~Başarım bildirimleri~~
- [x] ~~Puan & seviye sistemi~~
- [x] ~~Gecikmiş görev yönetimi~~
- [x] ~~Açılış animasyonları (splash & onboarding)~~
- [ ] Haftalık özet raporu
- [ ] Görev tekrarlama (recurring tasks)
- [ ] Veri yedekleme/geri yükleme
- [ ] Görev arama özelliği
- [ ] Widget desteği
- [ ] Pomodoro timer entegrasyonu
- [ ] Drag & drop ile görev taşıma (takvimde)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
