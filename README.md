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

#### User Experience
- 🎯 **Smart Onboarding**: Interactive 3-step tutorial for first-time users
- � **Dark/Light Theme**: Beautiful pastel themes with automatic switching
- 🌍 **Bilingual Support**: Full Turkish and English with reactive language switching
- 🎨 **Modern UI**: Clean, rounded cards with 60fps smooth animations
- 🕒 **Time-Based Suggestions**: Smart recommendations based on time of day
- 📊 **Smart Filtering**: Filter tasks by energy level or completion status
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
- **Expo Vector Icons** for beautiful icons
- **ESLint & Prettier** for code quality

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/kaenlabs/tasknest-energy.git
cd tasknest-energy

# Install dependencies
npm install

# Start the app
npx expo start
```

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
│   │   ├── DevTools.tsx               # Draggable dev menu
│   │   └── ...
│   ├── screens/         # Screen components
│   │   ├── HomeScreen.tsx             # Main task list
│   │   ├── StatsScreen.tsx            # Statistics & achievements
│   │   └── OnboardingScreen.tsx       # First-time user flow
│   ├── context/         # React Context providers
│   │   ├── ThemeContext.tsx           # Theme management
│   │   ├── LocaleContext.tsx          # Language management
│   │   ├── TaskContext.tsx            # Task state & persistence
│   │   └── AchievementContext.tsx     # Achievement & streak logic
│   ├── navigation/      # React Navigation setup
│   ├── types/           # TypeScript type definitions
│   │   ├── task.types.ts              # Task, Category, Priority types
│   │   └── achievement.types.ts       # Achievement & Streak types
│   ├── locales/         # i18n translation files (TR/EN)
│   │   ├── tr.ts                      # Turkish translations
│   │   ├── en.ts                      # English translations
│   │   └── i18n.ts                    # i18n configuration
│   └── utils/           # Utility functions
│       └── achievementData.ts         # Achievement definitions
├── App.tsx              # Main application component
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

#### Kullanıcı Deneyimi
- 🎯 **Akıllı Karşılama**: İlk kullanıcılar için 3 adımlı interaktif öğretici
-  **Koyu/Açık Tema**: Otomatik geçişli güzel pastel temalar
- 🌍 **İki Dilli Destek**: Reaktif dil değişimi ile tam Türkçe ve İngilizce
- 🎨 **Modern Arayüz**: 60fps akıcı animasyonlarla temiz, yuvarlak kartlar
- 🕒 **Zamana Dayalı Öneriler**: Günün saatine göre akıllı öneriler
- 📊 **Akıllı Filtreleme**: Görevleri enerji seviyesi veya tamamlanma durumuna göre filtreleyin
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
- LinkedIn: [LinkedIn linkinizi ekleyin]

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
- [ ] Haftalık özet raporu
- [ ] Haptic feedback (titreşim)
- [ ] Bildirim desteği
- [ ] Görev tekrarlama
- [ ] Veri yedekleme/geri yükleme
- [ ] Görev arama özelliği
- [ ] Widget desteği

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
