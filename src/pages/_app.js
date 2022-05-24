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
import Script from "next/script";

if(typeof document !== 'undefined') {
    if(!window.sayHello) {
        console.log('Contact Developer: jkemboe@gmail.com')
        window.sayHello = true
    }
}

const GlobalStyles = createGlobalStyle`
 html, body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto Serif', serif;
    font-size: 14px;
    box-sizing: border-box;
    overflow-x: hidden;
 }
 ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.h5Color};
  }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 8px;
  }
 
 @media screen and (max-width: 570px) {
    body {
        font-size: 12px;
    }
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
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2" crossorigin="anonymous"/>
        <GlobalStyles/>
        <NavWrapper>
            <Component {...pageProps}/>
        </NavWrapper>
        </ThemeProvider>
    )
}