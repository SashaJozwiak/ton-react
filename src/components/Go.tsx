import React from 'react'
import { OAuth2Client } from 'google-auth-library';

export const Go = () => {

    const client = new OAuth2Client({
        clientId: '645228011309-5k6c1t23q8ibk25d2l5sqbimpmtsgiq4.apps.googleusercontent.com',
        clientSecret: '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',
        redirectUri: 'http://localhost:5173/ton-react/'
    });

    async function handleLogin() {
        try {
            const url = client.generateAuthUrl({
                access_type: 'offline',
                scope: 'https://www.googleapis.com/auth/fitness.activity.read'
            });

            window.location.href = url;
        } catch (error) {
            console.log(error);
        }

    }

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            client.getToken(code)
                .then((response) => {
                    console.log('Token:', response);
                })
                .catch((error) => console.error('Error:', error));

        } else if (urlParams.has('error')) {
            console.error('Authorization error:', urlParams.get('error'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div>Go</div>
            <button onClick={handleLogin}>Login with Google</button>

        </>
    )
}
