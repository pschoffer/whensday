import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';



function SignUpPage() {
    // Store Phone number
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');

    // Function that handle input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
    };

    const isValidPhoneNumber = (phone: string) => {
        const phoneRegex = /^\+\d{1,3}\d{10}$/;
        return phoneRegex.test(phone);
    };
    // Function to submit phone number
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (isValidPhoneNumber(phoneNumber)) {
            alert(`Phone number submitted: ${phoneNumber}`);
            setPhoneNumber(''); // Clear input field after submission
            setError('');
        } else {
            setError('Invalid phone number. Format: +[Country Code][10-digit number]');
        } // Clear input field after submission
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

                    <Button type="submit">Submit</Button>

                </form>

            </header>
        </div>
    );
}

export default SignUpPage;









