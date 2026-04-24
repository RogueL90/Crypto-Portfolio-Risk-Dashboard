const Display = (props) => {
    const coin = props.coin
    console.log(coin)
    let percentChange = coin.change
    let sign = '+'
    if(percentChange < 0){
        sign = '-'
        percentChange = Math.abs(percentChange)
    }
return (
    <article className="coin-card">
    <div className="coin-header">
    <img className="coin-logo" src={coin.logo} />
     <h1 className="coin-name"><a className="coin-link" href={coin.homepage} target="_blank">{coin.name}</a></h1>
    <h2 className="coin-symbol">({coin.symbol})</h2>
    </div>
    <div className="coin-metrics">
        <p>Current Price: ${coin.currPrice.toLocaleString()} USD</p>
        <p>Min/Max: ${coin.minPrice.toLocaleString()} / ${coin.maxPrice.toLocaleString()} USD</p>
        <p>Average: ${coin.avgPrice.toLocaleString()} USD</p>
        <p>Volatility: {coin.volatility.toLocaleString()}%</p>
        <p>Trend: {coin.priceTrend}</p>
        <p>Profit: ${coin.profit.toLocaleString()} ( {sign}{(coin.change * 100).toLocaleString()}% )</p>
    </div>
    </article>
)
}

export default Display