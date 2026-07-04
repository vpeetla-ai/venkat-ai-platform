import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsState = {
  defaultModelNote: string;
  notifySlack: boolean;
  notifyTelegram: boolean;
  notifyWhatsapp: boolean;
  activeThreadId: string | null;
  apiKey: string;
  setDefaultModelNote: (v: string) => void;
  setNotifySlack: (v: boolean) => void;
  setNotifyTelegram: (v: boolean) => void;
  setNotifyWhatsapp: (v: boolean) => void;
  setActiveThreadId: (v: string | null) => void;
  setApiKey: (v: string) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      defaultModelNote: "Router uses OpenRouter when OPENROUTER_API_KEY is set on the backend.",
      notifySlack: false,
      notifyTelegram: false,
      notifyWhatsapp: false,
      activeThreadId: null,
      apiKey: "",
      setDefaultModelNote: (v) => set({ defaultModelNote: v }),
      setNotifySlack: (v) => set({ notifySlack: v }),
      setNotifyTelegram: (v) => set({ notifyTelegram: v }),
      setNotifyWhatsapp: (v) => set({ notifyWhatsapp: v }),
      setActiveThreadId: (v) => set({ activeThreadId: v }),
      setApiKey: (v) => set({ apiKey: v }),
    }),
    { name: "vap-settings" },
  ),
);
