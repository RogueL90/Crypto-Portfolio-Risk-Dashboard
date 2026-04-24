import numpy as np
import httpx

'''
coins:
[
    {
      "symbol": "bitcoin",
      "amt": 2
    }
],
{
    "days": 30
}
}
'''

def getStats(coins: list[dict], days: int):
    toReturn = []
    for coin in coins:
        try:
            dataUrl = f"https://api.coingecko.com/api/v3/coins/{coin['symbol']}/market_chart?vs_currency=usd&days={days}"
            misUrl = f"https://api.coingecko.com/api/v3/coins/{coin['symbol']}"
            res = httpx.get(dataUrl)
            data = res.json()
            misRes = httpx.get(misUrl)
            misData = misRes.json()
            
            prices = np.array(data['prices'])
            market_cap = np.array(data['market_caps'])
            volume = np.array(data['total_volumes'])

            currPrice = round(prices[len(prices)-1][1], 2)
            minPrice = round(np.min(prices[:,1]), 2)
            maxPrice = round(np.max(prices[:,1]), 2)
            avgPrice = round(np.mean(prices[:,1]), 2)
            volatility = round(np.std(prices[:,1]), 2)
            priceTrend = np.polyfit(prices[:,0], prices[:,1], 1)[0]
            change = round(currPrice/prices[0][1] - 1, 2)
            profit = round(float(coin['amt']) * (currPrice - prices[0][1]), 2)

            logo = misData['image']['small']
            symbol = misData['symbol'] # BTC
            name = misData['name'] # Bitcoin
            homepage = misData['links']['homepage'][0]
            
            dataObj = {
                "name" : name,
                "symbol" : symbol,
                "logo" : logo,
                "homepage" : homepage,
                
                "currPrice" : currPrice,
                "minPrice" : minPrice,
                "maxPrice" : maxPrice,
                "avgPrice" : avgPrice,
                "volatility" : volatility,
                "priceTrend" : priceTrend,
                "change" : change,
                "profit" : profit,
                
                "prices" : prices,
                "market_cap" : market_cap,
                "volume" : volume
            }
            toReturn.append(dataObj)

        except:
            print("invalid")
            
        
    return toReturn