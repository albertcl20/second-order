import { create } from 'zustand';
import { InterestFocus, RoleFocus } from '@/src/types/story';
import { getPersistedItem, setPersistedItem } from '@/src/lib/storage';
import { previewEnabled } from '@/src/lib/runtime-config';

export type NotificationMode = 'Morning brief' | 'Breaking only' | 'Muted';
export type ReadingMode = 'Concise' | 'Standard' | 'Deep dive';
export type SubscriptionTier = 'Free' | 'Premium preview';

type AppState = {
  hydrated: boolean;
  unlocked: boolean;
  hiddenAccessGranted: boolean;
  accessEmail: string | null;
  onboardingCompleted: boolean;
  savedStoryIds: string[];
  savedThemeLabels: string[];
  watchTokens: string[];
  roleFocus: RoleFocus[];
  interestFocus: InterestFocus[];
  notificationMode: NotificationMode;
  readingMode: ReadingMode;
  subscriptionTier: SubscriptionTier;
  hydrate: () => Promise<void>;
  unlock: () => boolean;
  grantHiddenAccess: (email?: string) => void;
  completeOnboarding: () => void;
  toggleSaved: (storyId: string) => void;
  toggleSavedTheme: (themeLabel: string) => void;
  toggleWatchToken: (token: string) => void;
  toggleRole: (role: RoleFocus) => void;
  toggleInterest: (interest: InterestFocus) => void;
  setNotificationMode: (mode: NotificationMode) => void;
  setReadingMode: (mode: ReadingMode) => void;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
};

const STORAGE_KEY = 'second-order-app-state';

const defaultState = {
  hydrated: false,
  unlocked: previewEnabled,
  hiddenAccessGranted: false,
  accessEmail: null as string | null,
  onboardingCompleted: false,
  savedStoryIds: [] as string[],
  savedThemeLabels: [] as string[],
  watchTokens: ['Microsoft', 'EU AI Act', 'OpenAI'] as string[],
  roleFocus: ['Product', 'Founder'] as RoleFocus[],
  interestFocus: ['AI', 'Policy', 'Distribution'] as InterestFocus[],
  notificationMode: 'Morning brief' as NotificationMode,
  readingMode: 'Standard' as ReadingMode,
  subscriptionTier: 'Free' as SubscriptionTier,
};

type PersistedState = Omit<
  AppState,
  | 'hydrate'
  | 'unlock'
  | 'grantHiddenAccess'
  | 'completeOnboarding'
  | 'toggleSaved'
  | 'toggleSavedTheme'
  | 'toggleWatchToken'
  | 'toggleRole'
  | 'toggleInterest'
  | 'setNotificationMode'
  | 'setReadingMode'
  | 'setSubscriptionTier'
  | 'hydrated'
>;

export const useAppStore = create<AppState>((set, get) => ({
  ...defaultState,
  hydrate: async () => {
    const raw = await getPersistedItem(STORAGE_KEY);

    if (!raw) {
      set({ hydrated: true, unlocked: previewEnabled });
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      const hiddenAccessGranted = parsed.hiddenAccessGranted ?? false;
      set({
        ...defaultState,
        ...parsed,
        hiddenAccessGranted,
        accessEmail: parsed.accessEmail ?? null,
        unlocked: previewEnabled || hiddenAccessGranted || parsed.unlocked || false,
        onboardingCompleted: parsed.onboardingCompleted ?? false,
        savedThemeLabels: parsed.savedThemeLabels ?? defaultState.savedThemeLabels,
        notificationMode: parsed.notificationMode ?? defaultState.notificationMode,
        readingMode: parsed.readingMode ?? defaultState.readingMode,
        subscriptionTier: parsed.subscriptionTier ?? defaultState.subscriptionTier,
        hydrated: true,
      });
    } catch {
      set({ hydrated: true, unlocked: previewEnabled });
    }
  },
  unlock: () => {
    if (!previewEnabled) return false;
    void persistState({ ...get(), unlocked: true });
    set({ unlocked: true });
    return true;
  },
  grantHiddenAccess: (email) => {
    const normalizedEmail = email?.trim().toLowerCase() || null;
    const nextState = {
      ...get(),
      unlocked: true,
      hiddenAccessGranted: true,
      accessEmail: normalizedEmail,
    };

    set({
      unlocked: true,
      hiddenAccessGranted: true,
      accessEmail: normalizedEmail,
    });
    void persistState(nextState);
  },
  completeOnboarding: () => {
    set({ onboardingCompleted: true });
    void persistState({ ...get(), onboardingCompleted: true });
  },
  toggleSaved: (storyId) => {
    const savedStoryIds = get().savedStoryIds.includes(storyId)
      ? get().savedStoryIds.filter((item) => item !== storyId)
      : [...get().savedStoryIds, storyId];

    set({ savedStoryIds });
    void persistState({ ...get(), savedStoryIds });
  },
  toggleSavedTheme: (themeLabel) => {
    const savedThemeLabels = get().savedThemeLabels.includes(themeLabel)
      ? get().savedThemeLabels.filter((item) => item !== themeLabel)
      : [...get().savedThemeLabels, themeLabel];

    set({ savedThemeLabels });
    void persistState({ ...get(), savedThemeLabels });
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
  setNotificationMode: (notificationMode) => {
    set({ notificationMode });
    void persistState({ ...get(), notificationMode });
  },
  setReadingMode: (readingMode) => {
    set({ readingMode });
    void persistState({ ...get(), readingMode });
  },
  setSubscriptionTier: (subscriptionTier) => {
    set({ subscriptionTier });
    void persistState({ ...get(), subscriptionTier });
  },
}));

async function persistState(state: AppState | PersistedState) {
  const persisted: PersistedState = {
    unlocked: state.unlocked,
    hiddenAccessGranted: state.hiddenAccessGranted,
    accessEmail: state.accessEmail,
    onboardingCompleted: state.onboardingCompleted,
    savedStoryIds: state.savedStoryIds,
    savedThemeLabels: state.savedThemeLabels,
    watchTokens: state.watchTokens,
    roleFocus: state.roleFocus,
    interestFocus: state.interestFocus,
    notificationMode: state.notificationMode,
    readingMode: state.readingMode,
    subscriptionTier: state.subscriptionTier,
  };

  await setPersistedItem(STORAGE_KEY, JSON.stringify(persisted));
}
