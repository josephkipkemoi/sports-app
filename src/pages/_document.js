import React from "react";
import Document, {Html, Head, Main, NextScript} from "next/document";
import { ServerStyleSheet } from "styled-components";
export default class MyDocument extends Document {

    render() {
        return (
            <Html>
                <Head>
                <meta property="og:site_name" content="Pinaclebet"/>
                    <meta property="og:title" content="Best Sports App in East Africa"/>
                    <meta name="msapplication-TileImage" content="https://ibb.co/5vFwY3K"/> 
                    <meta property="og:image" itemProp="image" content="https://i.postimg.cc/yNKjQHH1/logo.png" />
                    {/* <meta property="og:image:type" content="image/png"/> */}
                    <meta property="og:description" content="Pinaclebet | Best Sports App in East Africa"/>
                    <meta property="og:url" content="https://www.pinaclebet.com"/>
                    <meta property="og:image:width" content="733"/>
                    <meta property="og:image:height" content="362"/>
                    <meta property="og:type" content="website"/>
                
                <link rel="manifest" href="/manifest.json" />
                <link 
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" 
                    rel="stylesheet" 
                    integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" 
                    crossOrigin="anonymous"
                 />
                
                <link 
                    rel="stylesheet" 
                    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css"
                />

                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
                <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap" rel="stylesheet"/>                
                
                <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/> 

                </Head>

                <body>
                    <Main/>
                    <NextScript/>
                </body>
            </Html>
        )
    }
}

MyDocument.getInitialProps = async (ctx) => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render
  
    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collectStyles( <App {...props} />),
      });
  
    const initialProps = await Document.getInitialProps(ctx);
  
    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
  };