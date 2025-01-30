import { writable } from 'svelte/store';

export const navigationStore = writable({
    isOpen: false
});

export const toggleNavigation = () => {
    navigationStore.update((state) => ({
        ...state,
        isOpen: !state.isOpen
    }));
};
