import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // 'en', 'hi', 'tel'

    const translate = (key) => {
        // Simple mock translation for UI elements (not project content)
        const dictionary = {
            'en': { 'budget': 'Budget', 'class': 'Class Level', 'subject': 'Subject', 'search': 'Search' },
            'hi': { 'budget': 'बजट', 'class': 'कक्षा स्तर', 'subject': 'विषय', 'search': 'खोज' },
            'tel': { 'budget': 'బడ్జెట్', 'class': 'తరగతి', 'subject': 'విషయం', 'search': 'శోధన' }
        };
        return dictionary[language]?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, translate }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
