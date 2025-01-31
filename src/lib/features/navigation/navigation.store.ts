import { writable } from 'svelte/store';
import type { NavigationState } from './types';

function createNavigationStore() {
    const { subscribe, update } = writable<NavigationState>({
        isOpen: false
    });

    return {
        subscribe,
        toggle: () => update(state => ({ isOpen: !state.isOpen })),
        close: () => update(() => ({ isOpen: false })),
        open: () => update(() => ({ isOpen: true }))
    };
}

export const navigationStore = createNavigationStore();
export const toggleNavigation = () => navigationStore.toggle();
