//context/LanguageContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type Lang = "en" | "ta";

const translations = {
  en: {
    goodMorning: "Good morning,",
    todaysBeat: "Today's Beat",
    storesAssigned: "Stores Assigned",
    startBeat: "Start Today's Beat",
    online: "Online",
    readyToWork: "Ready to work",
    login: "Log In",
    signup: "Sign Up",
    phone: "Phone Number",
    password: "Password",
    noAccount: "New here?",
    createAccount: "Create an account",
    haveAccount: "Already have an account?",
    name: "Full Name",
    beat: "Beat",
    stores: "Stores",
    day: "Day",
    welcomeTagline: "Makes life easier",
  exclusiveTitle: "EXCLUSIVELY FOR DELIVERY PERSONNEL",
  exclusiveDesc: "Specifically for our delivery partners",
  },
  ta: {
    goodMorning: "காலை வணக்கம்,",
    todaysBeat: "இன்றைய பயணம்",
    storesAssigned: "ஒதுக்கப்பட்ட கடைகள்",
    startBeat: "இன்றைய பயணத்தைத் தொடங்கு",
    online: "ஆன்லைன்",
    readyToWork: "பணிக்குத் தயார்",
    login: "உள்நுழை",
    signup: "பதிவு செய்",
    phone: "தொலைபேசி எண்",
    password: "கடவுச்சொல்",
    noAccount: "புதியவரா?",
    createAccount: "கணக்கை உருவாக்கு",
    haveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    name: "முழு பெயர்",
    beat: "பயணம்",
    stores: "கடைகள்",
    day: "நாள்",
    welcomeTagline: "வாழ்க்கையை எளிதாக்குகிறது",
  exclusiveTitle: "டெலிவரி பணியாளர்களுக்கு மட்டும்",
  exclusiveDesc: "எங்கள் டெலிவரி பார்ட்னர்களுக்காக மட்டுமே",
  },
};

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof translations["en"]) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    AsyncStorage.getItem("beatsync_lang").then((saved) => {
      if (saved === "en" || saved === "ta") setLangState(saved);
    });
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    AsyncStorage.setItem("beatsync_lang", l);
  };

  const t = (key: keyof typeof translations["en"]) => translations[lang][key];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}