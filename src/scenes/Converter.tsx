import React, {useEffect, useRef, useState} from 'react';
import {
    Row,
    Col,
    Form,
    Placeholder,
    Button,
    Alert
} from 'react-bootstrap';

import {getCurrencies, getRates} from '../store/ratesSlice'
import {useAppDispatch, useAppSelector} from "../hooks";
import withHeader from '../components/HOC/withHeader';

type ValueType = {
    value: string,
    set: boolean,
}

type DataType = {
    value: number,
    baseCurrency: string,
    resultCurrency: string
}

const Converter: React.FC = () => {
    const [requestValue, setRequestValue] = useState<ValueType>({
        value: '',
        set: false
    });
    const [result, setResult] = useState<string>('');

    const temp = useRef<DataType | null>(null)

    const currencies = useAppSelector((state) => state.rates.currencies);
    const status = useAppSelector((state) => state.rates.status);
    const rates = useAppSelector((state) => state.rates.rates);


    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!currencies) {
            dispatch(getCurrencies());
        }
    },[]);

    useEffect(() => {
        calculate()
    },[rates]);

    if (status.error) return <h2>Something went wrong, please try again later</h2>

    const _onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        let string = event.target.value;
        string = string.replace(/-/g, "");
        let regex = /^([0-9]+) ([a-zA-Z]{3}) in ([a-zA-Z]{3})$/;
        let match = regex.exec(string);

        setRequestValue({
            value: string,
            set: !!match
        });
    }

    const convert = (): void => {
        let [value, baseCurrency, , resultCurrency] = requestValue.value.split(' ');

        baseCurrency = baseCurrency.toUpperCase();
        resultCurrency = resultCurrency.toUpperCase();
        const numberValue = parseFloat(value);

        if (currencies && !currencies[baseCurrency]) {
            setResult('Provided base currency is not supported')

            return
        }

        if (currencies &&!currencies[resultCurrency]) {
            setResult('Provided target currency is not supported')

            return
        }

        if (rates[baseCurrency]) {
            temp.current = {
                value: numberValue,
                baseCurrency,
                resultCurrency: resultCurrency.toUpperCase()
            };
            calculate();
        } else {
            dispatch(getRates(baseCurrency));
        }
    }

    const calculate = (): void => {
        if (!temp.current) return;

        const {value, baseCurrency, resultCurrency} = temp.current;

        setResult(`${value} ${baseCurrency} = ${value * rates[baseCurrency][resultCurrency]} ${resultCurrency}`)
    }

    if(status.error) {
        return (
            <Alert variant="danger">
                Something went wrong, please try again later
            </Alert>
        )
    }

    return (
        <section className="converter">
            <div className="container">
                <h2>Currency Converter</h2>
                {
                    currencies ? (
                        <div className="row">
                            <div className="col-6">
                                <Form noValidate validated={requestValue.set}>
                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Control type="text" onChange={_onInputChange} required disabled={status.loading} value={requestValue.value} isInvalid={!!(requestValue.value && !requestValue.set)}/>
                                                <Form.Control.Feedback type="invalid">
                                                    Please use valid format.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Button variant="primary" type="button" onClick={convert} disabled={!requestValue.set}>
                                                Convert
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>

                            </div>
                            <div className="col-6">
                                {
                                    status.loading
                                        ? (
                                            <Placeholder as="p" animation="glow">
                                                <Placeholder xs={12} />
                                            </Placeholder>
                                        )
                                        : (
                                            result ? <p>{result}</p> : <p>Type you request in format: <i>15 usd in uah</i></p>
                                        )
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

export default withHeader(Converter);
