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
                    <meta property="og:image" itemProp="image" content="https://lh3.googleusercontent.com/Ev6Q2_uH9N6FzE7TgZyUrbppS_8XM7XvMzOSEWPA2lzEWE3ZzrFtOnDyNIEKRzDGAVfCrw0lMbGrUqqIzqWTJk8LsUV37NRrCJgb6-NUQEJ6WkxEM-ue1dimXSkfgI2i0neFyjFQs_7jkqVdKN5KcJ7h5xR68eavJlz8s1D6r0G8KJFAtvsBHEDNWoFIuT9-zmzwH52IyEGBiiTL7fZh26sMAw01leYgIKUnPiLxN30f-WrIpKwjvfIL31xn6OsvMkF-K3nQBCZGOfoeZ0_tqc3-jiuI5BOhJDkTkxbEpjXqdRPh0KrxRR12bnl8QmKS3xd2UT7O1wabz9BqyG1k4ReQl110k_pZfPMvcWi9khFcLP3CjbYh4zs7KeCoIitwstfuWOZBcmta3GeAo8_1lMPZ9B_N3VEFSVr39-_ElnuqT3G6dcwLGPxFjGxwKi0-Mj2lYSdcafyNsR7xMR2Xhkl25Hf9yAWlqCo4vi6O0dL0UUVjth_yAmXfpxNfSaqtaKp0oPG661lR5S23v3iE7uBjx4uIg7QJ-6MAumRaydrX9wIRzDBPohnRlVXCC7-eX9GmezW888QT__U9vXjKjSGSVZfK_Xh9McgUfX3695KaxReBFPW6rZ419VA11xpB-Yd6IJs4IDGOCe86d3ORdEd2K__Z3K-YMReUTS5x26yBMc-T7AZivVNBJ_WAQ0IsBn4maO2Us6pf5Me22atoh6nJNk3kBGSxiXQb2lksLxjzd03gyXEopHv9_m4dme_3XtH5F8HOTAQACpwnSqWkXWliG-C67Z1QVJKBsKzIE0bViFWNuudlkNs1HARy6WdAbcJjLvQ96NtxmuMfniq7gRA9SfNtS4HgoAoUTCCQJ9Y=w733-h362-no?authuser=0" />
                    {/* <meta property="og:image:type" content="image/png"/> */}
                    <meta property="og:description" content="Pinaclebet | Best Sports App in East Africa"/>
                    <meta property="og:url" content="https://www.pinaclebet.com"/>
                    <meta property="og:image:width" content="733"/>
                    <meta property="og:image:height" content="362"/>
                    <meta property="og:type" content="website"/>
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
<link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300&display=swap" rel="stylesheet"/>
 
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