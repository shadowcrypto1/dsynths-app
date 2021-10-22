import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charset="utf-8" />
          <meta name="theme-color" content="#191E38" />
          <meta
            name="description"
            content="Trade stocks, commodities and crypto in a decentralized fashion using DEUS Finance its smart contract technology. No KYC - No Signup. Simply connect your wallet and start trading on multiple chains."
          />

          <link rel="shortcut icon" type="image/png" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="192x192" href="/images/192x192_App_Icon.png" />
          <link rel="apple-touch-icon" sizes="512x512" href="/images/512x512_App_Icon.png" />

          {/* manifest.json provides metadata used when your web app is installed on a
          user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/ */}
          <link rel="manifest" href="/manifest.json" />
          <script
            defer
            data-domain="app.dsynths.com"
            src="https://plausible.io/js/plausible.js"
          ></script>
        </Head>
        <body>
          <Main />
          <div id="background"></div>
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
