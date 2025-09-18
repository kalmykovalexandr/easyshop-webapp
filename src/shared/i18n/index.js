import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import ru from './locales/ru.json'

const resources = {
  en: { translation: en },
  ru: { translation: ru }
}

const language = localStorage.getItem('easyshop:lang') ?? 'ru'

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: language,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export function changeLanguage(lng) {
  i18n.changeLanguage(lng)
  localStorage.setItem('easyshop:lang', lng)
}

export default i18n
