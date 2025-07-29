export const isEmail = (email) => {
    if(typeof email !== 'string') return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const isEmpty = (string) => {
    if(typeof string !== 'string') return false;
    return string === '';
};

export const minLength = (string, length) => {
    if(typeof string !== 'string') return false;
    return string.length >= length;
};

export const compareString = (str1, str2) => {
    if(typeof str1 !== 'string' || typeof str2 !== 'string') return false;
    return str1 === str2;
};

export const capitalizeFirstLetter = (string) => {
    if(typeof string !== 'string') return false;
    return string[0].toUpperCase() + string.slice(1).toLowerCase(); 
};

export const limitString = (string, limit = 21) => {
    if(typeof string !== 'string') return false;

    if(string.length <= limit) return string;

    const shortedString = string.slice(0, limit) + '...';    
    return shortedString;    
};

export const ENDPOINT = import.meta.env.MODE == 'development' ? 'http://localhost:3000' : '/';
export const ENDPOINT_API = import.meta.env.MODE == 'development' ? 'http://localhost:3000/api' : '/api';