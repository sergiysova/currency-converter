import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import Placeholder from 'react-bootstrap/Placeholder';

import {getCurrencies, getRates} from '../store/ratesSlice'
import {useAppDispatch, useAppSelector} from "../hooks";
import withHeader from '../components/HOC/withHeader';
import {Alert} from "react-bootstrap";

const currenciesToShowRates: Array<string> = [
    'UAH',
    'USD',
    'EUR'
]

const Rates: React.FC = () => {
    const [baseCurrency, setBaseCurrency] = useState<string>('UAH');

    const currencies = useAppSelector((state) => state.rates.currencies);
    const status = useAppSelector((state) => state.rates.status);
    const rates = useAppSelector((state) => state.rates.rates);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!currencies) {
           dispatch(getCurrencies());
        }

        if(!rates[baseCurrency]) {
            dispatch(getRates(baseCurrency));
        }
    },[baseCurrency]);

    const printRates = (): React.ReactNode => (
        <ul className="rates">
            {
                currenciesToShowRates.map(currency => {
                    if(!rates[baseCurrency] || !rates[baseCurrency][currency] || baseCurrency === currency) return null;

                    return <li key={currency}><strong>{currency}</strong> - {(1 / rates[baseCurrency][currency]).toFixed(2)} {baseCurrency}</li>
                })
            }
        </ul>
    );

    const handleBaseValueChange: React.ChangeEventHandler<HTMLSelectElement> = e => setBaseCurrency(e.target.value);

    if (status.error) {
        return (
            <Alert variant="danger">
                Something went wrong, please try again later
            </Alert>
        )
    }

    return (
        <section className="converter">
            <div className="container">
                <h2>Current Rates</h2>
                {
                    currencies ? (
                        <div className="row">
                            <div className="col-6">
                                <Form.Group className="mb-3">
                                    <Form.Select value={baseCurrency} onChange={handleBaseValueChange} disabled={status.loading}>
                                        {
                                            Object.entries(currencies).map(([key, value]) => (
                                                <option key={key} value={key}>{value}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>

                            </div>
                            <div className="col-6">
                                {
                                    status.loading ? (
                                        <Placeholder as="p" animation="glow">
                                            <Placeholder xs={12} />
                                        </Placeholder>
                                    ) : printRates()
                                }
                            </div>
                        </div>
                    ) : (
                        <Placeholder as="p" animation="glow">
                            <Placeholder xs={12} />
                        </Placeholder>
                    )
                }
            </div>
        </section>
    );
}


export default withHeader(Rates);
