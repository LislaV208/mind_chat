# Changelog

Wszystkie istotne zmiany w projekcie będą dokumentowane w tym pliku.

Format bazuje na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
a projekt przestrzega [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-31

### Added
- Nowa architektura chatu z podziałem na warstwy (API, serwis, store, UI)
- Streaming odpowiedzi z API w czasie rzeczywistym
- Auto-scroll podczas streamowania wiadomości
- Obsługa błędów na każdej warstwie aplikacji
- Sanityzacja HTML w wiadomościach markdown

### Changed
- Refaktoryzacja komponentu ChatMessages (usunięcie zbędnych propsów)
- Refaktoryzacja komponentu ChatInput (przeniesienie logiki do store)
- Przeniesienie stanu wiadomości do store
- Uproszczenie głównego komponentu +page.svelte

### Fixed
- Poprawione wyświetlanie wiadomości podczas streamowania
- Naprawione błędy związane z niekompletnymi znacznikami markdown
