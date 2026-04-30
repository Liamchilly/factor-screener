export const QUIZZES = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    questions: [
      {
        q: 'What is the primary purpose of investing?',
        options: ['To make your money grow over time', 'To get rich quickly', 'To avoid paying taxes', 'To store cash safely'],
        answer: 0,
        explanation: 'Investing puts money to work so it can grow through returns on stocks, bonds, and other assets over time.',
      },
      {
        q: 'What does "risk vs. reward" mean in investing?',
        options: ['Higher potential returns come with higher potential losses', 'All investments carry the same risk', 'Risk can be completely eliminated', 'Low-risk investments always earn more'],
        answer: 0,
        explanation: 'There is a fundamental trade-off: seeking higher returns requires accepting the possibility of larger losses.',
      },
      {
        q: 'What is the biggest advantage of starting to invest early?',
        options: ['Compound growth multiplies your money exponentially over time', 'Stock prices are always lower when you are young', 'You pay lower taxes on early investments', 'Fewer people are competing in the market'],
        answer: 0,
        explanation: 'Compound growth means earning returns on your returns — starting earlier gives this process dramatically more time to work.',
      },
      {
        q: 'Which of the following is a common beginner investing mistake?',
        options: ['Trying to time the market by predicting highs and lows', 'Investing a fixed amount every month', 'Diversifying across multiple sectors', 'Holding investments for many years'],
        answer: 0,
        explanation: 'Trying to time the market consistently fails for most investors. Regular investing regardless of market conditions tends to outperform.',
      },
      {
        q: 'What does "long-term investing" generally mean?',
        options: ['Holding investments for years or decades', 'Checking your portfolio and trading daily', 'Selling stocks every quarter to lock in profits', 'Only buying stocks when the market is at its lowest'],
        answer: 0,
        explanation: 'Long-term investing means staying invested through market cycles, typically for 5, 10, or more years, to benefit from compound growth.',
      },
    ],
  },
  {
    id: 'etfs',
    label: 'ETFs',
    questions: [
      {
        q: 'What does ETF stand for?',
        options: ['Exchange-Traded Fund', 'Equity Transfer Fund', 'Economic Trading Formula', 'Exchange Transfer Framework'],
        answer: 0,
        explanation: 'ETF stands for Exchange-Traded Fund — a basket of securities that trades on an exchange like a regular stock.',
      },
      {
        q: 'How does an ETF differ from an individual stock?',
        options: ['An ETF holds many assets; a stock represents one company', 'ETFs can only be purchased at market close', 'Stocks always outperform ETFs over time', 'ETFs charge no fees whatsoever'],
        answer: 0,
        explanation: 'An ETF bundles many securities together, providing diversification, whereas a stock gives ownership in a single company.',
      },
      {
        q: 'What is an expense ratio?',
        options: ['The annual fee charged to manage a fund', 'The ratio of buyers to sellers in an ETF', 'The profit margin of the ETF provider', 'A measure of how closely the ETF tracks its index'],
        answer: 0,
        explanation: 'The expense ratio is the annual cost of owning a fund, expressed as a percentage of your investment. It is deducted automatically.',
      },
      {
        q: 'Which ETF is most commonly used to track the S&P 500?',
        options: ['SPY', 'QQQ', 'BND', 'GLD'],
        answer: 0,
        explanation: 'SPY (SPDR S&P 500 ETF Trust) is one of the oldest and most traded ETFs, tracking the S&P 500 index.',
      },
      {
        q: 'Why might a beginner prefer ETFs over individual stocks?',
        options: ['A single ETF purchase provides instant diversification', 'ETFs guarantee a profit each year', 'ETFs are immune to all market risk', 'ETFs are not affected by economic downturns'],
        answer: 0,
        explanation: 'Buying one ETF can instantly spread your investment across dozens to thousands of companies, reducing risk without complex stock picking.',
      },
    ],
  },
  {
    id: 'reading-charts',
    label: 'Reading Charts',
    questions: [
      {
        q: "What does a candlestick's body represent?",
        options: ['The range between the opening and closing price', 'The highest and lowest prices reached', 'The total volume traded', 'The average price for the period'],
        answer: 0,
        explanation: 'The body of a candlestick shows the opening price at one end and the closing price at the other for that time period.',
      },
      {
        q: 'What does high trading volume on a price move suggest?',
        options: ['Strong conviction behind the move', 'The move is likely to immediately reverse', 'The stock is overvalued', 'Market makers are manipulating the price'],
        answer: 0,
        explanation: 'High volume confirms that many market participants are engaged, lending more credibility to the direction of the price move.',
      },
      {
        q: "What is 'support' in technical analysis?",
        options: ['A price level where buying tends to prevent further declines', 'A guaranteed floor below which a stock cannot go', 'The 200-day moving average price', 'A metric set by stock exchanges'],
        answer: 0,
        explanation: 'Support is a historical price level where buyers have consistently emerged, creating a floor that resists further downward movement.',
      },
      {
        q: 'Which timeframe is generally most useful for long-term investors?',
        options: ['Weekly or monthly charts', '1-minute intraday charts', '5-minute charts', 'Tick-by-tick data'],
        answer: 0,
        explanation: 'Longer timeframes filter out short-term noise and reveal the genuine underlying trend that matters to long-term investors.',
      },
      {
        q: 'What is a common mistake beginners make when reading charts?',
        options: ['Over-reading short-term noise as meaningful signals', 'Considering overall price trends', 'Looking at trading volume', 'Using charts alongside fundamental analysis'],
        answer: 0,
        explanation: 'Short-term price fluctuations are largely random. Beginners often mistake normal noise for significant patterns, leading to poor decisions.',
      },
    ],
  },
  {
    id: 'understanding-risk',
    label: 'Understanding Risk',
    questions: [
      {
        q: 'What is market risk?',
        options: ['The risk that the entire market declines, affecting all stocks', 'The risk that one specific company goes bankrupt', 'The risk of buying a stock at the wrong time', 'The risk posed by inflation alone'],
        answer: 0,
        explanation: 'Market risk (also called systematic risk) affects all investments in the market and cannot be diversified away.',
      },
      {
        q: 'What does beta measure?',
        options: ['How much a stock moves relative to the overall market', "A company's gross profit margin", 'The quality of a company earnings', 'A stock dividend yield'],
        answer: 0,
        explanation: 'Beta measures a stock sensitivity to market movements. A beta of 1.5 means the stock tends to move 1.5x as much as the market.',
      },
      {
        q: 'What is inflation risk for investors?',
        options: ['The risk that rising prices reduce the real purchasing power of your returns', 'The risk that interest rates fall unexpectedly', 'The risk of owning too many different stocks', 'The risk of government regulation affecting your portfolio'],
        answer: 0,
        explanation: 'If your investments earn 3% but inflation is 4%, you are losing purchasing power despite a nominally positive return.',
      },
      {
        q: 'Which best describes risk tolerance?',
        options: ['How much potential loss you can handle financially and emotionally', 'How much profit you target each year', 'The maximum dollar amount you are allowed to invest', 'Your level of knowledge about financial markets'],
        answer: 0,
        explanation: 'Risk tolerance reflects both your financial ability and psychological willingness to endure losses without making panic-driven decisions.',
      },
      {
        q: 'How does diversification primarily reduce investment risk?',
        options: ['By spreading investments so one loss does not devastate your entire portfolio', 'By guaranteeing positive returns in all market conditions', 'By eliminating all forms of market risk', 'By reducing exposure across all investment types equally'],
        answer: 0,
        explanation: 'Diversification reduces company-specific risk. When one holding falls, others may hold steady or rise, protecting your overall portfolio.',
      },
    ],
  },
  {
    id: 'diversification',
    label: 'Diversification',
    questions: [
      {
        q: 'What is portfolio diversification?',
        options: ['Spreading investments across different assets to reduce risk', 'Investing all your money in the single safest stock', 'Buying only technology stocks from different companies', 'Holding mostly cash to avoid market risk'],
        answer: 0,
        explanation: 'Diversification means owning a mix of different investments so that the failure of any one holding does not ruin your portfolio.',
      },
      {
        q: 'Approximately how many stocks provide most of the diversification benefit?',
        options: ['20 to 30 stocks across different sectors', '2 to 3 carefully chosen stocks', 'More than 500 stocks', 'Exactly 10 stocks'],
        answer: 0,
        explanation: 'Research shows that most of the risk-reduction benefit from diversification is captured with approximately 20–30 uncorrelated stocks.',
      },
      {
        q: 'What is sector diversification?',
        options: ['Owning stocks in different industries like technology, healthcare, and energy', 'Buying the same stock on different exchanges', 'Investing within one sector that itself contains many companies', 'Only buying broad index funds and nothing else'],
        answer: 0,
        explanation: 'Sector diversification spreads exposure across industries that react differently to economic conditions, reducing cyclical risk.',
      },
      {
        q: 'How do ETFs simplify diversification?',
        options: ['A single ETF purchase can instantly hold hundreds of stocks', 'ETFs eliminate all investment risk entirely', 'ETFs only contain the best-performing stocks at any time', 'ETFs are immune to market-wide downturns'],
        answer: 0,
        explanation: 'A single purchase of a broad ETF like VTI gives you exposure to thousands of companies, achieving diversification instantly and cheaply.',
      },
      {
        q: 'What is geographic diversification?',
        options: ['Investing in companies across different countries and regions', 'Buying properties in multiple cities', 'Owning stocks in companies headquartered in different cities', 'Diversifying only within US domestic markets'],
        answer: 0,
        explanation: 'International diversification reduces exposure to any single country economic or political risk and accesses global growth opportunities.',
      },
    ],
  },
  {
    id: 'how-markets-work',
    label: 'How Markets Work',
    questions: [
      {
        q: 'What is a stock exchange?',
        options: ['A marketplace where investors buy and sell shares', 'A bank that holds your stocks in custody', 'A government agency that sets stock prices', 'A company that issues new shares to the public'],
        answer: 0,
        explanation: 'A stock exchange is an organized marketplace, like the NYSE or Nasdaq, where securities are listed and traded between investors.',
      },
      {
        q: 'What are normal US stock market trading hours?',
        options: ['9:30 AM to 4:00 PM Eastern Time, weekdays', '8:00 AM to 5:00 PM Eastern Time, weekdays', '24 hours a day, 7 days a week', '10:00 AM to 3:00 PM Eastern Time, weekdays'],
        answer: 0,
        explanation: 'The primary US trading session runs from 9:30 AM to 4:00 PM Eastern Time, Monday through Friday, excluding major holidays.',
      },
      {
        q: 'What primarily drives a stock price higher?',
        options: ['More buyers wanting the stock than sellers willing to sell at the current price', 'The company issuing additional shares to increase supply', 'Government regulation requiring higher prices', 'Market makers setting higher official prices'],
        answer: 0,
        explanation: 'Stock prices are driven by supply and demand. When buyers outnumber sellers at the current price, the price rises to find equilibrium.',
      },
      {
        q: 'What is a market maker?',
        options: ['A firm that provides liquidity by always quoting buy and sell prices', 'A government official who decides fair stock prices', 'A large investor who moves prices through big trades', 'The CEO of a stock exchange'],
        answer: 0,
        explanation: 'Market makers stand ready to buy or sell at quoted prices, ensuring there is always liquidity and a counterparty for your trades.',
      },
      {
        q: 'What is after-hours trading?',
        options: ['Trading that occurs outside regular market hours, typically with lower liquidity', 'Illegal trading conducted after the market closes', 'Trading exclusively available to institutional investors', 'A session with higher volume than regular market hours'],
        answer: 0,
        explanation: 'After-hours trading happens between 4 PM and 8 PM Eastern. Volume is lower and spreads are wider, making prices more volatile.',
      },
    ],
  },
  {
    id: 'index-funds',
    label: 'Index Funds',
    questions: [
      {
        q: 'What is a stock market index?',
        options: ['A collection of securities representing a segment of the market', 'A complete list of every stock in existence', 'A measure of one company performance over time', 'A government rating system for stock quality'],
        answer: 0,
        explanation: 'An index is a curated basket of securities designed to represent a particular market, sector, or theme — like the S&P 500 for large US companies.',
      },
      {
        q: 'Approximately what does the S&P 500 represent?',
        options: ['500 of the largest publicly traded US companies by market cap', 'The top 100 technology companies in the US', 'All publicly traded companies in the United States', '500 companies across all global stock exchanges'],
        answer: 0,
        explanation: 'The S&P 500 contains roughly 500 large-cap US companies and is widely used as the benchmark for the US stock market.',
      },
      {
        q: 'Why do index funds historically outperform most active fund managers?',
        options: ['Low fees and broad diversification compound significantly over time', 'Index fund managers make smarter stock picks', 'Index funds take on more risk for higher returns', 'Active managers are contractually required to underperform'],
        answer: 0,
        explanation: 'After fees, over 80% of active managers underperform their index benchmarks over 10+ year periods. Low costs are the primary edge of index funds.',
      },
      {
        q: 'What is dollar cost averaging?',
        options: ['Investing a fixed dollar amount at regular intervals regardless of price', 'Always buying stocks only at their 52-week low price', 'Averaging the prices across multiple brokerages', 'Investing only during market downturns'],
        answer: 0,
        explanation: 'DCA means investing a consistent amount regularly. This automatically buys more shares when prices are low and fewer when prices are high.',
      },
      {
        q: 'What is a key advantage of index funds from Vanguard, Fidelity, and Schwab?',
        options: ['They typically offer extremely low expense ratios near 0%', 'They are guaranteed by the US government', 'They always outperform the market by a fixed percentage', 'They have no exposure to any market risk at all'],
        answer: 0,
        explanation: 'These providers offer index funds with expense ratios as low as 0.00–0.03%, meaning fees have minimal impact on long-term returns.',
      },
    ],
  },
];
