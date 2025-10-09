import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import ru from './locales/ru.json'

const resources = {
  en: { translation: en },
  ru: { translation: ru }
}

function setLocaleCookie(lng) {
  if (typeof document === 'undefined') {
    return
  }
  const maxAge = 60 * 60 * 24 * 365
  document.cookie = `easyshop-lang=${lng}; Max-Age=${maxAge}; Path=/; SameSite=Lax`
}

const language = localStorage.getItem('easyshop:lang') ?? 'ru'
setLocaleCookie(language)

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
  setLocaleCookie(lng)
}

export default i18n