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
    font-family: Roboto Condensed,Arial Narrow,sans-serif;
    font-size: 14px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: scroll;
 }
 ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  ::-webkit-scrollbar-track {
    background: #edebeb;
  }
  ::-webkit-scrollbar-thumb {
    background: #191970;
    border-radius: 8px;
  }
  @media screen and (min-width: 920px) {
    #main {
        display: none;
    }
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
        const displayMode = localStorage.getItem('display-mode')

        if(Boolean(displayMode) === false) {
            localStorage.setItem('display-mode', 'light-mode')
        }
     
        if('serviceWorker' in navigator) {
            // Wait for the load event not to block other work
            window.addEventListener('load', async () => {
              // try to register the service worker
              try {
                  const reg = await navigator.serviceWorker.register('https://www.pinaclebet.com/service-worker.js')
                  console.log('Service worker registered', reg)
              } catch (err) {
                console.log('Service worker registration failed!', err)
              }
            })
          }
    }, [])
    
    
    return (
            <ThemeProvider>
                <Head title="Best Sports App in E. Africa">
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                </Head>

            <Script src="https://js.pusher.com/7.2/pusher.min.js"/>
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2" crossorigin="anonymous"/>
           
            <GlobalStyles/>
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    {loading ? <NavWrapper  login={login} >
                      <Provider store={store}>
                            <Component  {...pageProps}/>
                        </Provider>
                    </NavWrapper>    : 
                      <div style={{ height: '100vh', backgroundColor: '#191970' }}>
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
 
