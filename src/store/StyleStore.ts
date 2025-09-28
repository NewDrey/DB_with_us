
const dark = {
    gridColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(40, 44, 52, 1)',
    tableHeaderColor: 'rgba(97, 218, 251, 0.7)',
    leftBarBackground: 'rgba(40, 44, 52, 1)',
} as const;

const light = {
    gridColor: 'rgba(97, 218, 251, 0.6)',
    backgroundColor: 'rgba(255, 250, 250,1)',
    tableHeaderColor: 'rgba(97, 218, 251, 1)',
    leftBarBackground: 'rgba(255, 250, 250,1)',
} as const;

const themes = {
    dark, light
}

type Listener = () => void

type ThemeName = 'dark' | 'light';
type ThemeProperty = keyof typeof dark; // автоматически будет 'gridColor'

const StyleStore = {
    state: {
        theme: 'dark' as ThemeName,
        isLoading: false,
        error: null,
    },
    listeners: new Set<Listener>(),

    // Методы на верхнем уровне
    setTheme(theme: ThemeName) {
        this.state.theme = theme;
        this.notifyListeners();
    },

    subscribe(listener: Listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    },

    notifyListeners() {
        this.listeners.forEach(listener => listener());
    },

    getters: {
        getTheme(name: ThemeProperty) {
            return themes[StyleStore.state.theme][name];
        }
    }
}
export default StyleStore