# dsynths-app

## How to start
1. Install dependencies `npm install`.
2. Alter the key values in `.example.env` and rename the file to `.env`. Here's how to retrieve the *free* keys:
+ REACT_APP_INFURA_KEY: https://infura.io/dashboard/ethereum (or equivalent)
+ REACT_APP_FINNHUB_API_KEY: https://finnhub.io/dashboard (this is *optional*, it however disables stock market data feeds)

3. In order to make use of TradingView's charting tools you need a local copy of the charting lib. This is *optional*, however without the lib the charting components will render an empty card. If you want access please contact our developers. To make use of the library follow the following instructions:
+ Copy the `charting_library` folder to `/public`, and create a new folder within `/src` called `/static` and past the folder there as well.
+ Copy the `datafeeds` folder to `/public`.

## Run the App
Run `npm run start`.
