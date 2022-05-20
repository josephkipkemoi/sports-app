import React from "react";
// import { tw } from 'twin.macro';
// import Script from "next/script";
 
import {
    createGlobalStyle,
    ThemeProvider as StyledThemeProvider
} from 'styled-components';
import reset from 'styled-reset';

import 'swagger-ui-react/swagger-ui.css';

import Theme, { ThemeContext } from '../utils/Theme';
import Head from "../components/Head";
import NavWrapper from '../components/NavWrapper';

if(typeof document !== 'undefined') {
    if(!window.sayHello) {
        console.log('Contact Developer: jkemboe@gmail.com')
        window.sayHello = true
    }
}

const GlobalStyles = createGlobalStyle`
 html, body {
    font-family: 'Roboto Slab';
    font-size: 14px;
 }
`

function ThemeProvider({ children }) {
    return (
        <ThemeContext.Provider value={Theme}>
            <StyledThemeProvider theme={Theme}>{children}</StyledThemeProvider>
        </ThemeContext.Provider>
    )
}

export default function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider>
            <Head title="Best Sports App in E. Africa">
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            {/* Add Google Tag Manager
                <Script
                dangerouslySetInnerHTML={{
                __html: `
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.defer=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','GTM-PPH2PX');
                        `,
                }}
            /> */}

{/* Twitter API 
<Script src="https://platform.twitter.com/widgets.js" async defer /> */}

        <GlobalStyles/>
        <NavWrapper>
            <Component {...pageProps}/>
        </NavWrapper>
        </ThemeProvider>
    )
}