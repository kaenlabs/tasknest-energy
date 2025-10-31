# 🪺 TaskNest - Energy-Based Task Manager

[English](#english) | [Türkçe](#turkish)

---

## <a name="english"></a>English

### 📱 About

**TaskNest** is a modern, energy-aware task management application built with React Native and Expo. It helps you organize your tasks based on your energy levels throughout the day, suggesting high-energy tasks in the morning and low-energy tasks in the evening.

### ✨ Features

- ✅ **Task Management**: Add, complete, and delete tasks with ease
- ⚡ **Energy-Based Organization**: Categorize tasks by energy level (High ⚡ / Low 💤)
- �️ **Categories & Priorities**: Organize tasks with 5 categories (Work, Personal, Health, Shopping, Other) and 3 priority levels
- 📊 **Statistics Dashboard**: Track your productivity with charts, completion rates, and category/priority breakdowns
- 🗂️ **Tab Navigation**: Easy switching between Tasks and Statistics screens
- 🎯 **Smart Onboarding**: Interactive tutorial for first-time users
- �🌓 **Dark/Light Theme**: Beautiful pastel themes with automatic switching
- 🌍 **Bilingual Support**: Full Turkish and English language support
- 💾 **Persistent Storage**: Tasks are saved locally with AsyncStorage
- 🎨 **Modern UI**: Clean, rounded cards with smooth animations
- 🕒 **Time-Based Suggestions**: Smart recommendations based on time of day
- 📊 **Smart Filtering**: Filter tasks by energy level or completion status

### 🛠 Technologies

- **React Native** with **Expo SDK 54**
- **TypeScript** for type safety
- **React Context API** for state management
- **React Navigation** for tab navigation
- **AsyncStorage** for local data persistence
- **i18n-js** for internationalization
- **React Native Reanimated** for smooth animations
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
│   ├── screens/         # Screen components (Home, Stats, Onboarding)
│   ├── context/         # React Context providers (Theme, Locale, Task)
│   ├── navigation/      # React Navigation setup
│   ├── types/           # TypeScript type definitions
│   ├── locales/         # i18n translation files (TR/EN)
│   └── utils/           # Utility functions (helpers)
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

- ✅ **Görev Yönetimi**: Kolayca görev ekleyin, tamamlayın ve silin
- ⚡ **Enerji Bazlı Organizasyon**: Görevleri enerji seviyesine göre kategorize edin (Yüksek ⚡ / Düşük 💤)
- �️ **Kategori ve Öncelik Sistemi**: 5 kategori (İş, Kişisel, Sağlık, Alışveriş, Diğer) ve 3 öncelik seviyesi ile görevlerinizi düzenleyin
- 📊 **İstatistik Paneli**: Grafikler, tamamlanma oranları ve kategori/öncelik dağılımları ile verimliliğinizi takip edin
- 🗂️ **Sekme Navigasyonu**: Görevler ve İstatistikler ekranları arasında kolay geçiş
- 🎯 **Akıllı Karşılama**: İlk kullanıcılar için interaktif öğretici
- �🌓 **Koyu/Açık Tema**: Otomatik geçişli güzel pastel temalar
- 🌍 **İki Dilli Destek**: Tam Türkçe ve İngilizce dil desteği
- 💾 **Kalıcı Depolama**: Görevler AsyncStorage ile yerel olarak kaydedilir
- 🎨 **Modern Arayüz**: Yumuşak animasyonlarla temiz, yuvarlak kartlar
- 🕒 **Zamana Dayalı Öneriler**: Günün saatine göre akıllı öneriler
- 📊 **Akıllı Filtreleme**: Görevleri enerji seviyesi veya tamamlanma durumuna göre filtreleyin

### 🛠 Teknolojiler

- **React Native** ve **Expo SDK 54**
- Tip güvenliği için **TypeScript**
- Durum yönetimi için **React Context API**
- Sekme navigasyonu için **React Navigation**
- Yerel veri kalıcılığı için **AsyncStorage**
- Çok dilli destek için **i18n-js**
- Akıcı animasyonlar için **React Native Reanimated**
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
- [ ] Bildirim desteği
- [ ] Görev tekrarlama
- [ ] Veri yedekleme/geri yükleme
- [ ] Kategori ve öncelik bazlı filtreleme
- [ ] Görev arama özelliği

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
