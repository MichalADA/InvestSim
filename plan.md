# Opis działania aplikacji - InvestSim

## Główne funkcjonalności

### 1. Rejestracja i logowanie
- Użytkownicy mogą założyć konto, podając swoje dane (np. e-mail, hasło).
- Mechanizm uwierzytelniania pozwala użytkownikom na bezpieczne logowanie.
- Po zalogowaniu użytkownik ma dostęp do swojego panelu inwestycyjnego.

### 2. Wirtualne portfele inwestycyjne
- Użytkownik może stworzyć jeden lub więcej portfeli inwestycyjnych.
- Każdy portfel:
  - Zawiera listę aktywów (np. kryptowaluty, akcje).
  - Pokazuje aktualny bilans i historię transakcji.
- Dodawanie fikcyjnych środków jest dostępne na start (np. 10,000 jednostek wirtualnej waluty).

### 3. Symulacje inwestycyjne
- Użytkownicy mogą:
  - Kupować i sprzedawać aktywa, takie jak kryptowaluty, przy użyciu fikcyjnych pieniędzy.
  - Symulować zmiany wartości portfela w czasie rzeczywistym.
- System automatycznie aktualizuje stan portfela i generuje raporty.

### 4. Dane rynkowe
- Dane dotyczące kursów aktywów są pobierane w czasie rzeczywistym za pomocą API CoinMarketCap.
- Dane są przechowywane w MongoDB i odświeżane co określony czas (np. co 10 minut).
- Możliwość wyświetlania historycznych danych rynkowych dla danego aktywa.

### 5. Wizualizacje i analizy
- Użytkownik może zobaczyć wykresy cen aktywów:
  - Wzrost/spadek w określonym przedziale czasu.
  - Porównanie różnych aktywów w portfelu.
- Analizy finansowe obejmują:
  - Obliczanie ROI (zwrotu z inwestycji).
  - Średnią zmienność aktywów w portfelu.
- Ranking użytkowników na podstawie ich wyników inwestycyjnych.

### 6. Edukacja inwestycyjna
- Sekcja edukacyjna zawiera:
  - Poradniki dla początkujących inwestorów.
  - Przykładowe strategie inwestycyjne.
- Quizy i testy pozwalają użytkownikom sprawdzić swoją wiedzę.

---

## Szczegóły działania

### Backend
- Backend obsługuje:
  - Zarządzanie użytkownikami (rejestracja, logowanie, sesje).
  - API do obsługi portfeli, transakcji i pobierania danych rynkowych.
  - Logikę biznesową, w tym obliczenia finansowe i integracje z MongoDB.

### Frontend
- Interfejs użytkownika został zaprojektowany w React.js, aby zapewnić:
  - Szybkie i interaktywne działanie aplikacji.
  - Responsywność na urządzeniach mobilnych i komputerach.

### Dane rynkowe
- API CoinMarketCap:
  - Pobieranie danych o kursach kryptowalut w czasie rzeczywistym.
  - Dane są przechowywane w bazie MongoDB i aktualizowane okresowo.
- Dane historyczne pozwalają na analizę trendów rynkowych.

### Moduły analityczne w Javie
- Java obsługuje bardziej zaawansowane funkcjonalności, takie jak:
  - Symulacje rynkowe.
  - Obliczenia związane z ryzykiem i zmiennością portfela.

---

## Przykładowy scenariusz użytkowania

1. Użytkownik rejestruje konto i loguje się do aplikacji.
2. Tworzy nowy portfel inwestycyjny i otrzymuje 10,000 jednostek wirtualnej waluty.
3. Przegląda listę kryptowalut, ich aktualne kursy i decyduje się na zakup BTC.
4. System odlicza odpowiednią ilość środków z portfela i zapisuje transakcję.
5. Użytkownik śledzi zmiany wartości swojego portfela na wykresach w czasie rzeczywistym.
6. Po pewnym czasie sprzedaje BTC i sprawdza, czy jego inwestycja była opłacalna (obliczenie ROI).
7. Korzysta z sekcji edukacyjnej, aby nauczyć się nowych strategii inwestycyjnych.

---

## Funkcje do przyszłego wdrożenia
- Handel między użytkownikami (np. wymiana kryptowalut).
- Notyfikacje o zmianach kursów (e-mail/SMS).
- Zaawansowane strategie inwestycyjne, takie jak stop-loss czy automatyczny zakup.
- Wersja mobilna aplikacji.

---

## Wymagania systemowe
- Python 3.9+ (backend).
- Java 11+ (moduły analityczne).
- Node.js 16+ (frontend).
- Docker do konteneryzacji aplikacji.
- MongoDB Atlas lub lokalna instancja bazy danych.
