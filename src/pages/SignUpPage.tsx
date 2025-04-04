import React, { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import config from '../lib/config';



function SignUpPage() {
    // Store Phone number
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    // Function that handle input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
    };

    const isValidPhoneNumber = (phone: string) => {
        const phoneRegex = /^\+\d{1,3}\d{10}$/;
        return phoneRegex.test(phone);
    };
    // Function to submit phone number
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);
        if (isValidPhoneNumber(phoneNumber)) {
            try {

                await fetch(config.functions.registerNewNumber, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ number: phoneNumber }),
                })

                setPhoneNumber('');
                setError('');
                setProcessing(false);
                alert(`Phone number submitted: ${phoneNumber}`);
            } catch (error) {
                console.error('Error submitting phone number:', error);
                setError('Failed to submit phone number. Please try again later.');
            }
        } else {
            setError('Invalid phone number. Format: +[Country Code][10-digit number]');
        }
        setProcessing(false);
    };

    return (
        <div className="App">
            <header className="App-header">

                <h1>Enter Your Phone Number</h1>
                <form onSubmit={handleSubmit}>
                    <Form.Control isInvalid={!!error}
                        type="tel"
                        placeholder="+123456789012"
                        value={phoneNumber}
                        onChange={handleInputChange}
                        required
                    />
                    {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}

                    <Button type="submit">
                        {processing && <Spinner className='me-2' size='sm' />}
                        Submit
                    </Button>

                </form>

            </header>
        </div>
    );
}

export default SignUpPage;









