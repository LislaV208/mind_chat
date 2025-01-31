# Architektura Mind Map Chat

## Struktura Projektu

```
src/
  ├── features/            # Główne funkcjonalności
  │   └── [feature]/      # Każdy feature w osobnym katalogu
  │       ├── ui/         # 1. Warstwa UI
  │       ├── store/      # 2. Stan UI
  │       ├── domain/     # 3. Logika biznesowa
  │       └── api/        # 4. Komunikacja z zewnętrznymi serwisami
  │
  └── shared/             # Współdzielone zasoby
      ├── ui/            # Współdzielone komponenty UI
      ├── services/      # Współdzielone serwisy
      └── utils/         # Helpery, utility functions
```

## Warstwy Aplikacji

### 1. Warstwa UI (`ui/`)
- Komponenty Svelte odpowiedzialne za prezentację
- Minimalna logika biznesowa
- Komunikacja tylko ze store'ami
- Przykład: `ChatInput.svelte`, `ChatMessages.svelte`

### 2. Stan UI (`store/`)
- Zarządzanie stanem UI za pomocą Svelte stores
- Obsługa interakcji użytkownika
- Delegowanie logiki biznesowej do serwisów domenowych
- Przykład: `chat.store.ts`

### 3. Logika Biznesowa (`domain/`)
- Zawiera całą logikę biznesową
- Niezależna od UI i infrastruktury
- Definiuje modele i interfejsy domenowe
- Struktura:
  - `services/` - serwisy zawierające logikę biznesową
  - `models/` - modele domenowe

### 4. Warstwa API (`api/`)
- Komunikacja z zewnętrznymi serwisami
- Mapowanie danych między API a modelami domenowymi
- Obsługa błędów sieciowych
- Przykład: `chat.api.ts`

## Przepływ Danych

```
UI -> Store -> Domain Service -> API
```

1. Komponent UI wywołuje akcję w store
2. Store deleguje logikę do serwisu domenowego
3. Serwis domenowy używa API do komunikacji z zewnętrznymi serwisami
4. Dane płyną z powrotem tą samą ścieżką

## Zasady i Konwencje

### Nazewnictwo
- Komponenty UI: PascalCase z sufiksem `.svelte`
- Store'y: camelCase z sufiksem `.store.ts`
- Serwisy: camelCase z sufiksem `.service.ts`
- API: camelCase z sufiksem `.api.ts`
- Modele: PascalCase z sufiksem `.model.ts`

### Odpowiedzialności
1. **Komponenty UI**
   - Renderowanie interfejsu
   - Obsługa zdarzeń użytkownika
   - Subskrypcja store'ów

2. **Store'y**
   - Przechowywanie stanu UI
   - Podstawowa walidacja danych
   - Koordynacja między komponentami

3. **Serwisy Domenowe**
   - Implementacja logiki biznesowej
   - Walidacja biznesowa
   - Transformacja danych

4. **API**
   - Komunikacja HTTP
   - Obsługa błędów sieciowych
   - Serializacja/deserializacja danych

### Dobre Praktyki
1. Komponenty UI nie powinny znać szczegółów implementacji logiki biznesowej
2. Store'y nie powinny zawierać skomplikowanej logiki biznesowej
3. Serwisy domenowe powinny być niezależne od frameworka UI
4. Warstwa API powinna być łatwo wymienialna

## Workflow Developera

### 1. Dodawanie Nowej Funkcjonalności
1. Zacznij od zrozumienia wymagań biznesowych
2. Zidentyfikuj, czy to nowy feature czy rozszerzenie istniejącego
3. Stwórz branch z prefixem odpowiadającym typowi zmian:
   - `feature/` - nowa funkcjonalność
   - `fix/` - poprawka błędu
   - `refactor/` - refaktoryzacja kodu
   - `docs/` - zmiany w dokumentacji

### 2. Struktura Zmian
1. Zacznij od modeli domenowych (`domain/models/`)
2. Zaimplementuj logikę biznesową w serwisach (`domain/services/`)
3. Dodaj warstwę API jeśli potrzebna (`api/`)
4. Stwórz lub zaktualizuj store (`store/`)
5. Na końcu dodaj komponenty UI (`ui/`)

### 3. Zasady Pracy
1. **Małe commity**
   - Każdy commit powinien zawierać jedną logiczną zmianę
   - Używaj konwencji conventional commits

2. **Czysty kod**
   - Stosuj TypeScript wszędzie gdzie to możliwe
   - Pilnuj typów - unikaj `any`
   - Używaj ESLint i Prettier przed każdym commitem

3. **Testowanie**
   - Pisz testy podczas implementacji, nie po
   - Testuj każdą warstwę osobno
   - Upewnij się, że testy przechodzą przed PR

### 4. Code Review
1. **Przygotowanie PR**
   - Opisz zmiany w PR
   - Dodaj screenshoty UI jeśli aplikowalne
   - Oznacz sekcje wymagające szczególnej uwagi

2. **Podczas Review**
   - Odpowiadaj na komentarze
   - Rób małe fixupy zamiast dużych zmian
   - Aktualizuj dokumentację jeśli potrzebna

### 5. Dobre Praktyki
1. **Komponenty UI**
   - Trzymaj logikę biznesową poza komponentami
   - Używaj TypeScript dla props
   - Dokumentuj nieintuicyjne rozwiązania

2. **Store**
   - Jeden store per feature
   - Unikaj cross-store dependencies
   - Używaj akcji do modyfikacji stanu

3. **Serwisy**
   - Serwisy powinny być testowalne
   - Unikaj side effects
   - Dokumentuj publiczne API

4. **API**
   - Obsługuj błędy na poziomie API
   - Waliduj dane wejściowe/wyjściowe
   - Używaj typów dla requestów/responsów

### 6. Debugowanie
1. Używaj narzędzi Svelte DevTools
2. Loguj błędy w odpowiednich warstwach
3. Używaj TypeScript do złapania błędów na etapie kompilacji

### 7. Performance
1. Unikaj niepotrzebnych re-renderów
2. Lazy loading dla dużych komponentów
3. Monitoruj wielkość paczki

### 8. Dokumentacja
1. Aktualizuj ARCHITECTURE.md przy większych zmianach
2. Dokumentuj ważne decyzje architektoniczne
3. Utrzymuj README.md w aktualnym stanie

## Przykład Implementacji

### Feature: Chat

```typescript
// ui/ChatInput.svelte
<script>
  import { chatStore } from '../store/chat.store';
  
  function handleSubmit() {
    chatStore.sendMessage(message);
  }
</script>

// store/chat.store.ts
export const chatStore = {
  async sendMessage(content: string) {
    const result = await chatService.processMessage(content);
    // Aktualizacja UI
  }
};

// domain/services/chat.service.ts
export class ChatService {
  async processMessage(content: string) {
    // Logika biznesowa
    return await chatApi.sendMessage(content);
  }
}

// api/chat.api.ts
export const chatApi = {
  async sendMessage(content: string) {
    // Komunikacja z API
  }
};
```

## Rozwój Aplikacji

Przy dodawaniu nowych funkcjonalności:
1. Utwórz nowy katalog w `features/`
2. Zachowaj strukturę warstw
3. Wykorzystaj współdzielone zasoby z `shared/`
4. Trzymaj się ustalonych konwencji i zasad

## Testowanie

1. **Komponenty UI**
   - Testy komponentów
   - Testy integracyjne z store'ami

2. **Store'y**
   - Testy jednostkowe akcji
   - Testy integracyjne z serwisami

3. **Serwisy Domenowe**
   - Testy jednostkowe logiki biznesowej
   - Mocki dla API

4. **API**
   - Testy integracyjne
   - Mocki dla zewnętrznych serwisów
