const apiKey = "Mjja2qYQe8mRc6tZEL5sS6t1ATllFAs8";

export const fetchSymbols = (): Promise<object> => {
    const myHeaders = new Headers();
    myHeaders.append("apikey", apiKey);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders
    };

    return fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
        .then(response => response.json())
        .then(result => result)
        .catch(error => error);
}

export const fetchRates = (base: string): Promise<object> => {
    const myHeaders = new Headers();
    myHeaders.append("apikey", apiKey);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders
    };

    return fetch(`https://api.apilayer.com/exchangerates_data/latest?base=${base}`, requestOptions)
        .then(response => response.json())
        .then(result => result)
        .catch(error => error);
}