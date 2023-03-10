import yfinance as yf
import pandas as pd
import shutil

shutil.copytree('src/stock-data/new', 'src/stock-data/old', dirs_exist_ok = True)

for ticker in ['AAPL', 'MSFT', 'AMZN', 'NVDA', 'TSLA', 'GOOGL', 'GOOG', 'BRK-B', 'UNH', 'JNJ', 'XOM', 'JPM', 'META', 'V', 'PG', 'MA', 'HD', 'CVX', 'ABBV', 'MRK']:
    daily_df = pd.DataFrame(yf.Ticker(ticker).history(period="5y", interval="1d"))
    daily_df.to_csv('src/stock-data/new/daily/' + ticker + '.csv')

    # hourly_df = pd.DataFrame(yf.Ticker(ticker).history(period="1y", interval="1h"))
    # hourly_df.to_csv('src/stock-data/new/hourly/' + ticker + '.csv')
