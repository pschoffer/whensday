const config = {
    useEmulators: !!process.env.REACT_APP_EMULATORS,
    functions: {
        registerNewNumber: 'https://europe-west1-whensday-ca2ea.cloudfunctions.net/registerNewNumber',
    }
}

if (config.useEmulators) {
    config.functions = {
        registerNewNumber: 'http://127.0.0.1:5001/whensday-ca2ea/europe-west1/registerNewNumber',
    }
}

export default config;