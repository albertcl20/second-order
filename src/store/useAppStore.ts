import { create } from 'zustand';
import { InterestFocus, RoleFocus } from '@/src/types/story';
import { getPersistedItem, setPersistedItem } from '@/src/lib/storage';

type AppState = {
  hydrated: boolean;
  unlocked: boolean;
  savedStoryIds: string[];
  watchTokens: string[];
  roleFocus: RoleFocus[];
  interestFocus: InterestFocus[];
  hydrate: () => Promise<void>;
  unlock: (password: string) => boolean;
  toggleSaved: (storyId: string) => void;
  toggleWatchToken: (token: string) => void;
  toggleRole: (role: RoleFocus) => void;
  toggleInterest: (interest: InterestFocus) => void;
};

const STORAGE_KEY = 'second-order-app-state';
const APP_PASSWORD = process.env.EXPO_PUBLIC_APP_PASSWORD ?? 'zxcQWE123';

const defaultState = {
  hydrated: false,
  unlocked: false,
  savedStoryIds: [] as string[],
  watchTokens: ['Microsoft', 'EU AI Act', 'OpenAI'] as string[],
  roleFocus: ['Product', 'Founder'] as RoleFocus[],
  interestFocus: ['AI', 'Policy', 'Distribution'] as InterestFocus[],
};

type PersistedState = Omit<AppState, 'hydrate' | 'unlock' | 'toggleSaved' | 'toggleWatchToken' | 'toggleRole' | 'toggleInterest' | 'hydrated'>;

export const useAppStore = create<AppState>((set, get) => ({
  ...defaultState,
  hydrate: async () => {
    const raw = await getPersistedItem(STORAGE_KEY);

    if (!raw) {
      set({ hydrated: true });
      return;
    }

    try {
      const parsed = JSON.parse(raw) as PersistedState;
      set({ ...parsed, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
  unlock: (password) => {
    const next = password === APP_PASSWORD;
    if (next) {
      void persistState({ ...get(), unlocked: true });
      set({ unlocked: true });
    }
    return next;
  },
  toggleSaved: (storyId) => {
    const savedStoryIds = get().savedStoryIds.includes(storyId)
      ? get().savedStoryIds.filter((item) => item !== storyId)
      : [...get().savedStoryIds, storyId];

    set({ savedStoryIds });
    void persistState({ ...get(), savedStoryIds });
  },
  toggleWatchToken: (token) => {
    const watchTokens = get().watchTokens.includes(token)
      ? get().watchTokens.filter((item) => item !== token)
      : [...get().watchTokens, token];

    set({ watchTokens });
    void persistState({ ...get(), watchTokens });
  },
  toggleRole: (role) => {
    const current = get().roleFocus;
    const roleFocus = current.includes(role) ? current.filter((item) => item !== role) : [...current, role];
    set({ roleFocus: roleFocus.length ? roleFocus : [role] });
    void persistState({ ...get(), roleFocus: roleFocus.length ? roleFocus : [role] });
  },
  toggleInterest: (interest) => {
    const current = get().interestFocus;
    const interestFocus = current.includes(interest)
      ? current.filter((item) => item !== interest)
      : [...current, interest];

    set({ interestFocus: interestFocus.length ? interestFocus : [interest] });
    void persistState({ ...get(), interestFocus: interestFocus.length ? interestFocus : [interest] });
  },
}));

async function persistState(state: AppState | PersistedState) {
  const persisted: PersistedState = {
    unlocked: state.unlocked,
    savedStoryIds: state.savedStoryIds,
    watchTokens: state.watchTokens,
    roleFocus: state.roleFocus,
    interestFocus: state.interestFocus,
  };

  await setPersistedItem(STORAGE_KEY, JSON.stringify(persisted));
}
