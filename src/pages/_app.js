import React, { useEffect, useState } from "react";
// import { tw } from 'twin.macro';
// import Script from "next/script";
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from "react-redux";
import { store } from "../store/store";
import styled, {
    createGlobalStyle,
    ThemeProvider as StyledThemeProvider
} from 'styled-components';
import reset from 'styled-reset';

import 'swagger-ui-react/swagger-ui.css';

import Theme, { ThemeContext } from '../utils/Theme';
import Head from "../components/Head";
import NavWrapper from '../components/NavWrapper';
import Script from "next/script";
import useAuth from "../hooks/auth";
import Loader from "../components/Loader";
import Image from "next/image";


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
    font-family: 'Readex Pro', sans-serif;
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
const StyleLoader = styled.div`
position: absolute;
margin-left: auto;
margin-right: auto;
margin-top: 40vh;
left: 0;
right: 0;
text-align: center;
`
function ThemeProvider({ children }) {
    return (
        <ThemeContext.Provider value={Theme}>
            <StyledThemeProvider theme={Theme}>{children}</StyledThemeProvider>
        </ThemeContext.Provider>
    )
}

export default function MyApp({ Component, pageProps }) {
    
    const [queryClient] = useState(() => new QueryClient())

    const { login } = useAuth({ middleware: 'guest' });

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
    }, [])
    
    
    return (
            <ThemeProvider>
                <Head title="Best Sports App in E. Africa">
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <meta property="og:image" content="https://i.pinimg.com/originals/cf/46/f9/cf46f940746533138b5e67cd40730e97.jpg" />
                    <meta property="og:description" content="Pinaclebet | Best Sports App in East Africa"/>
                    <meta property="og:url" content="https://www.pinaclebet.com"/>
                    <meta property="og:image:width" content="1200"/>
                    <meta property="og:image:height" content="627"/>
                    <meta property="og:type" content="website"/>
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
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    {loading ? <NavWrapper  login={login}>
                      <Provider store={store}>
                            <Component  {...pageProps}/>
                        </Provider>
                    </NavWrapper>    : 
                      <div className="bg-success" style={{ height: '100vh' }}>
                        <StyleLoader>
                            <Image src="/logo.png" height="46" width="92"/>
                            <h5 className="d-block fw-bold mt-4" style={{ letterSpacing: '2px', color: '#ffffff' }}>
                                www.pinaclebet.com
                            </h5>
                            <Loader/> 
                        </StyleLoader>                        
                    </div>
            
                    }
                    
           
                </Hydrate>
            </QueryClientProvider>       
            </ThemeProvider>
    )
}
 
 