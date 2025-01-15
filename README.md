# InvestSim - Portal Inwestycyjny

## Cel projektu
Stworzenie interaktywnego portalu inwestycyjnego, który pozwala na:
- Symulowanie inwestycji w różne aktywa (akcje, kryptowaluty itp.) z wykorzystaniem fikcyjnych pieniędzy.
- Tworzenie wirtualnych portfeli inwestycyjnych.
- Analizę danych finansowych i wizualizację wyników.

## Technologie
- **Backend:** Python (FastAPI/Flask) do zarządzania logiką biznesową i integracji z bazą danych MongoDB.
- **Frontend:** React.js do stworzenia nowoczesnego i interaktywnego interfejsu użytkownika.
- **Baza danych:** MongoDB do przechowywania danych użytkowników, transakcji i portfeli.
- **Java:** Do obsługi modułów zaawansowanej analizy finansowej i symulacji rynkowych.
- **Konteneryzacja:** Docker do izolacji aplikacji, Kubernetes (opcjonalnie) do skalowalności.
- **Hosting:** AWS lub DigitalOcean do wdrożenia aplikacji.
- **API rynkowe:** CoinMarketCap (darmowe API do pobierania danych kryptowalutowych).

## Plan działania

### Faza 1: Podstawowe funkcjonalności
1. Stworzenie struktury projektu (backend, frontend).
2. Implementacja rejestracji i logowania użytkowników.
3. Konfiguracja bazy danych MongoDB:
   - Kolekcje dla użytkowników, portfeli i transakcji.
4. Stworzenie mechanizmu obsługi portfeli inwestycyjnych:
   - Tworzenie portfeli.
   - Dodawanie fikcyjnych środków.
5. Stworzenie API dla frontend:
   - Rejestracja i logowanie.
   - Zarządzanie portfelami.

### Faza 2: Integracja danych rynkowych i transakcji
1. Integracja z CoinMarketCap:
   - Pobieranie kursów kryptowalut w czasie rzeczywistym.
   - Zapisywanie danych w MongoDB (cache).
2. Implementacja funkcji kupna i sprzedaży aktywów:
   - Weryfikacja salda portfela.
   - Aktualizacja stanu portfela i historii transakcji.
3. Dodanie mechanizmu przeliczania walut.

### Faza 3: Wizualizacje i analizy
1. Implementacja wykresów dla aktywów:
   - Historia cen (React.js + biblioteka Chart.js).
2. Analizy finansowe:
   - Obliczanie ROI, średniej zmienności, itp.
   - Moduł w Javie do zaawansowanych symulacji finansowych.
3. Ranking użytkowników na podstawie wyników portfeli.

### Faza 4: Edukacja i rozszerzenia
1. Dodanie sekcji edukacyjnej:
   - Porady inwestycyjne.
   - Materiały o strategiach inwestycyjnych.
2. Wirtualna giełda:
   - Handel aktywami między użytkownikami.
3. Integracja notyfikacji:
   - Powiadomienia o zmianach kursów.

## Podział zadań
- **Backend (Python):** FastAPI/Flask, integracja z MongoDB, API dla danych kryptowalut.
- **Frontend (React.js):** Interfejs użytkownika, wykresy, integracja z backendem.
- **Java:** Moduły analizy finansowej i symulacji rynkowej.
- **DevOps:** Docker, Kubernetes, wdrożenie na serwer.

## Koszty i zasoby
- **Hosting i infrastruktura:**
  - Serwer w chmurze: $10–20/miesiąc (AWS/DigitalOcean).
  - MongoDB Atlas: darmowy plan.
- **Domena i SSL:**
  - Domena: $10–20/rok.
  - Let's Encrypt: darmowy certyfikat SSL.
- **API rynkowe:**
  - CoinMarketCap: darmowy plan (wymaga klucza API).

## Wdrożenie krok po kroku
1. Stworzenie repozytorium na GitHubie.
2. Ustalenie podstawowej struktury projektu (foldery, zależności).
3. Praca nad backendem:
   - Rejestracja, logowanie, zarządzanie portfelami.
4. Praca nad frontendem:
   - Podstawowy interfejs dla portfeli.
5. Integracja z API i testy funkcjonalności.
6. Konteneryzacja aplikacji (Docker).
7. Wdrożenie na serwer i testy end-to-end.

## Dalszy rozwój
- Optymalizacja wydajności.
- Rozbudowa o nowe funkcje (np. wykresy, ranking).
- Zbieranie opinii użytkowników i wdrażanie ulepszeń.
