import React, { useState, useEffect } from 'react';
import './styles/index.css';
import Money from './Components/Money.jsx';

function App() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [rates, setRates] = useState(null);
    const [usd, setUSD] = useState(0);

    useEffect(() => {
        fetch("https://open.exchangerate-api.com/v6/latest")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setRates(result.rates);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    const convert = (amount, baseCode, targetCode) => {
        if (rates[baseCode] === undefined) {
            throw new Error(`Unknown base code ${baseCode}`)
        }
        if (rates[targetCode] === undefined) {
            throw new Error(`Unknown target code ${targetCode}`)
        }
        return (amount / rates[baseCode]) * rates[targetCode]
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else if (!rates) {
        return <div>Loading...</div>;
    } else {
        console.log("rates: ", rates);
        const cadToUsd = convert(1000, 'CAD', 'USD');
        const usdToCad = convert(1000, 'USD', 'CAD');

        console.log('$1000 CAD to USD: ', cadToUsd);
        console.log(`$${cadToUsd} USD to CAD (back again!): `, convert(cadToUsd, 'USD', 'CAD'));
        console.log('$1000 USD to CAD: ', usdToCad);
        console.log(`$${usdToCad} CAD to USD (back again!): `, convert(usdToCad, 'CAD', 'USD'));

        return (
            <main className="box">
                <div className="box title">
                    <Money />
                    <h2>Welcome to the X-Converter!</h2>
                </div>
                <div className="box rates-today">
                    <h3>Rates today:</h3>
                    <p className="" >USD: {rates && rates["USD"]}, CAD: {rates && rates["CAD"]}, AUD: {rates && rates["AUD"]}, GBP: {rates && rates["GBP"]}, EUR: {rates && rates["EUR"]}</p>
                </div>
                <div className="box convert">
                    <h3>Convert:</h3>
                    <div className="rate-usd">
                        USD: $<input type="number" id="usd" className="" placeholder="0" value={usd} onChange={e => setUSD(e.target.value)} />
                    </div>
                    <div className="rates ">
                        <div className="rates-column">
                            <div className="rate">
                                CAD: ${convert(usd, 'USD', 'CAD').toFixed(2)}
                            </div>
                            <div className="rate">
                                AUD: ${convert(usd, 'USD', 'AUD').toFixed(2)}
                            </div>
                        </div>
                        <div className="rates-column">
                            <div className="rate">
                                GBP: ${convert(usd, 'USD', 'GBP').toFixed(2)}
                            </div>
                            <div className="rate">
                                EUR: ${convert(usd, 'USD', 'EUR').toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}


export default App;