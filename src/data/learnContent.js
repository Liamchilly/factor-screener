export const LESSONS = [
  {
    id: 'getting-started',
    title: 'Getting Started with Investing',
    readTime: '6 min read',
    next: 'etfs',
    content: `Investing is the act of putting your money to work so it can grow over time. Instead of letting cash sit in a savings account earning minimal interest, you deploy it into assets — like stocks, bonds, or funds — that have the potential to increase in value or generate income.

Why bother investing? The core reason is that inflation gradually erodes the purchasing power of money. A dollar today will buy less in ten years. If your money isn't growing at least as fast as inflation, you're effectively losing ground. Historically, the stock market has returned roughly 7–10% annually over long periods, far outpacing inflation.

Risk and reward are inseparable in investing. Higher potential returns almost always come with higher potential losses. A speculative small-cap stock might double or fall 80%. A US Treasury bond might return 4–5% with very little chance of total loss. Understanding your own comfort with risk — your risk tolerance — is one of the first things to figure out before you invest a single dollar.

You don't need to be wealthy to start. Many platforms let you invest with $1 through fractional shares. The single most powerful advantage you have as a young or early investor is time. Compound growth — earning returns on your returns — works exponentially. Someone who invests $200 a month starting at 25 will typically have far more at 65 than someone who starts at 35 and contributes twice as much monthly.

Thinking long-term changes how you react to market swings. A 20% market drop feels catastrophic if you need the money next month, but it's just a temporary dip if you're investing for retirement in 30 years. Long-term investors use downturns as opportunities to buy more at lower prices.

Common beginner mistakes include trying to time the market (buying at the perfect low and selling at the perfect high — almost no one does this consistently), checking your portfolio obsessively, selling during downturns out of fear, chasing last year's hot investment, and putting all money in a single stock. Diversification — owning a range of investments — protects you from any single company's failure devastating your portfolio.

The best time to start is now, even with a small amount. The second best time is tomorrow. Don't wait until you've "figured everything out" — you learn more by doing than by reading, and time in the market beats timing the market almost every time.`,
  },
  {
    id: 'etfs',
    title: 'Understanding ETFs',
    readTime: '5 min read',
    next: 'reading-charts',
    content: `An ETF, or Exchange-Traded Fund, is a basket of investments — typically stocks or bonds — that trades on a stock exchange just like an individual share. When you buy one share of SPY, for example, you're instantly owning a tiny slice of all 500 companies in the S&P 500.

How is an ETF different from a regular stock? A stock gives you ownership of one company. If that company fails, your investment could go to zero. An ETF holds dozens, hundreds, or even thousands of companies at once. No single company's failure can destroy your investment.

Why should beginners consider ETFs? Three reasons stand out. First, instant diversification. With one purchase, you're spread across an entire market or sector. Second, low cost. Most index ETFs charge expense ratios of 0.03–0.20% annually — meaning you pay just $3 per year on a $10,000 investment. Third, simplicity. You don't need to research individual companies or worry about whether one CEO made a bad decision.

The expense ratio is the annual fee a fund charges, expressed as a percentage of your investment. It's deducted automatically and doesn't show as a separate charge — but it compounds over decades. An ETF charging 0.03% vs. one charging 1.0% might seem trivial, but on $100,000 over 30 years, the difference in fees can amount to tens of thousands of dollars.

Some of the most popular ETFs include SPY (tracks the S&P 500), QQQ (tracks the Nasdaq-100, heavy in tech), VTI (tracks the entire US stock market), and BND (a bond market ETF for stability). For most long-term investors, a simple combination of VTI and BND provides broad, low-cost exposure to both stocks and bonds.

To evaluate an ETF, look at: expense ratio (lower is better), the index it tracks (understand what you're owning), assets under management (higher means more liquidity), and how closely it tracks its benchmark. Avoid ETFs with complex strategies or leverage unless you understand them deeply — these are not beginner tools.

ETFs can be bought and sold throughout the trading day at market prices, unlike traditional mutual funds which price once at the end of the day. This flexibility, combined with low costs and diversification, makes them one of the most powerful tools for everyday investors.`,
  },
  {
    id: 'reading-charts',
    title: 'Reading Stock Charts',
    readTime: '7 min read',
    next: 'understanding-risk',
    content: `A stock price chart is a visual record of how a stock's price has moved over time. At its most basic, it's a line showing price on the vertical axis and time on the horizontal axis. But most serious investors use candlestick charts, which pack more information into each time period.

A candlestick shows four prices for each period: the open (where the price started), the close (where it ended), the high (the highest it reached), and the low (the lowest it went). The "body" of the candle is the range between open and close. If the close is higher than the open, the candle is typically green (bullish). If the close is lower, it's typically red (bearish). The thin lines extending above and below the body are called "wicks" or "shadows" — they show the high and low for the period.

Volume — the number of shares traded during a period — appears as bars along the bottom of most charts. Volume is context for price moves. A stock rising on high volume suggests strong conviction from buyers. The same price move on low volume may be less meaningful. When a major move happens on unusually high volume, it's worth paying attention.

Support and resistance are two of the most useful concepts in chart reading. Support is a price level where buyers have historically stepped in to prevent further decline — think of it as a floor. Resistance is where sellers have historically emerged to cap advances — a ceiling. When a stock breaks through resistance on high volume, that level often becomes the new support. These aren't magic lines, but they reflect the aggregate behavior of many market participants.

Timeframes matter enormously. A 1-minute chart shows you noise — random fluctuations that mean almost nothing. A weekly or monthly chart reveals the true trend. As a beginner or long-term investor, focus on longer timeframes. The daily chart is usually sufficient; weekly charts provide useful perspective on bigger trends.

What should a beginner look for? The overall direction of prices (is it trending up, down, or sideways?), whether recent moves are supported by volume, and whether a stock is near a meaningful support or resistance level. These simple observations can inform better entry and exit decisions.

What NOT to over-read: single-day spikes without follow-through, complex pattern names you've just read about (head and shoulders, double tops), short-term indicators on long-term investments. The chart reflects what has happened — it cannot tell you with certainty what will happen next. Use it as one input among many, not as a crystal ball.`,
  },
  {
    id: 'understanding-risk',
    title: 'Understanding Investment Risk',
    readTime: '6 min read',
    next: 'diversification',
    content: `Every investment carries risk. Understanding the types of risk and how to manage them is one of the most valuable skills an investor can develop. Risk is not something to be eliminated — that's impossible — but it can be understood, measured, and managed.

Market risk is the broadest category: the risk that the overall stock market declines, dragging your investments down with it. No stock is immune to a broad market sell-off. Even the highest-quality company's stock typically falls during a market crash, even if its underlying business is fine. This is why time horizon matters — market downturns are temporary, historically speaking. A broad market decline of 30% is devastating if you need the money in six months; it's a buying opportunity if your timeline is 20 years.

Company-specific risk (also called idiosyncratic risk) is the chance that a particular company fails or severely underperforms. A CEO scandal, product recall, accounting fraud, or disruption from a competitor can devastate a single stock regardless of what the broader market does. This is the risk that diversification directly reduces.

Inflation risk is subtle but real: if your investments grow at 4% but inflation runs at 5%, your purchasing power is shrinking despite nominally positive returns. This is why cash under a mattress and very low-yield savings accounts are also forms of risk.

Volatility is the statistical measure of how much a price fluctuates over time. A stock that swings 5% daily is more volatile than one that moves 0.5% daily. Beta is a related concept: a beta of 1.0 means the stock moves in line with the market. Beta above 1.0 means it's more volatile (amplifies market moves). Beta below 1.0 means it's less sensitive to market swings — sometimes called defensive.

Risk tolerance is deeply personal. It depends on your time horizon (longer = more risk capacity), your financial situation (emergency fund, steady income = more risk capacity), and your emotional makeup (can you watch your portfolio drop 30% without panic-selling?). Be honest with yourself about this last one — people systematically overestimate their tolerance until they experience a real loss.

Diversification is the primary practical tool for managing risk. By owning many uncorrelated investments, you ensure that no single bad outcome ruins your portfolio. A portfolio of 20-30 stocks across different sectors captures most of the available diversification benefit within equities. Adding bonds reduces volatility further, since bonds and stocks often move in opposite directions.`,
  },
  {
    id: 'diversification',
    title: 'The Power of Diversification',
    readTime: '5 min read',
    next: 'how-markets-work',
    content: `Diversification is sometimes called "the only free lunch in investing." By spreading your money across a variety of assets, you can reduce risk without necessarily sacrificing return. It's the foundational principle behind modern portfolio construction.

The core idea is simple: don't put all your eggs in one basket. If you own only one stock and that company goes bankrupt, you lose everything. If you own 30 stocks across different industries, even the complete failure of one company reduces your portfolio by only about 3%. The other 29 positions keep you standing.

How many stocks do you need? Research shows that the risk-reduction benefits of diversification diminish sharply beyond 20-30 stocks. The first stock adds the most risk; each additional stock adds less marginal benefit. Beyond about 30 stocks in different sectors, you're essentially tracking the broad market — at which point an index fund might serve you better.

Sector diversification means owning companies in different industries: technology, healthcare, financials, consumer goods, energy, utilities, and so on. Different sectors respond differently to economic conditions. Technology stocks may thrive in growth environments but suffer when interest rates rise sharply. Utilities and consumer staples tend to be more stable during economic downturns. Energy can boom when oil prices rise. Having exposure to several sectors smooths out these cycles.

Geographic diversification extends this logic internationally. US stocks represent roughly 60% of global market cap, but companies in Europe, Asia, and emerging markets can perform differently based on their local economic conditions, currencies, and growth rates. International index funds or ETFs make it easy to add this layer of diversification without researching individual foreign companies.

ETFs make diversification trivially easy. Buying a single share of VTI instantly spreads your money across over 4,000 US companies. QQQ gives you the top 100 Nasdaq companies. VXUS provides global exposure outside the US. For most investors, especially beginners, a core portfolio of two or three ETFs provides more diversification than owning dozens of individual stocks.

One caution: over-diversification can dilute your returns. If you own 200 stocks, your best performers barely move the needle. There's a balance between spreading risk and concentrating enough to benefit from good research. Most financial advisors suggest 15-30 individual stocks if you're building a stock portfolio, or just a few broad ETFs if you prefer simplicity.`,
  },
  {
    id: 'how-markets-work',
    title: 'How Stock Markets Work',
    readTime: '6 min read',
    next: 'index-funds',
    content: `A stock market is a marketplace — a system where buyers and sellers come together to trade ownership stakes in companies. Unlike a physical market, most modern trading happens electronically in milliseconds. Understanding how this machinery works helps you be a more informed participant.

Companies raise capital by issuing stock through an Initial Public Offering (IPO). In an IPO, the company sells shares to the public for the first time. After that, those shares trade on exchanges like the New York Stock Exchange (NYSE) or Nasdaq between investors — the company itself is no longer directly involved in these secondary transactions.

US stock markets are open Monday through Friday, 9:30 AM to 4:00 PM Eastern Time (except major holidays). Before and after those hours, there is pre-market trading (starting as early as 4 AM) and after-hours trading (ending at 8 PM). These extended sessions have lower volume and wider bid-ask spreads, so prices can move more erratically. Major news that breaks outside regular hours often moves stock prices significantly in these sessions.

For every transaction, there's a buyer and a seller. When you place a market order to buy 10 shares of Apple, you're matched with someone who wants to sell at the current market price. The stock doesn't come from the company — it comes from another investor who was already holding it.

Market makers are specialized firms that provide liquidity by always being willing to quote both a buy price (bid) and a sell price (ask). The difference between these two prices is the bid-ask spread. Market makers profit from this spread, and in return they ensure there's always a counterparty for your trade. For liquid stocks like Apple or Microsoft, the spread might be just a penny. For small, thinly traded stocks, it could be much larger.

What actually moves stock prices? At its core, supply and demand. When more investors want to buy than sell at a given price, the price rises until it reaches an equilibrium. Several factors influence this balance: earnings reports (if a company earns more than expected, buyers rush in), economic data (strong GDP growth often lifts stocks), interest rate changes (higher rates can reduce the present value of future earnings), news events, and the collective sentiment and expectations of millions of market participants.

It's important to understand that stock prices reflect expectations about the future, not just current reality. A company can be reporting record profits and its stock can still fall if those profits came in below what analysts had expected. The market is always pricing what it thinks will happen next.`,
  },
  {
    id: 'index-funds',
    title: 'Index Funds: The Investor\'s Best Friend',
    readTime: '6 min read',
    next: null,
    content: `An index is a list of securities that represents a particular segment of the market. The S&P 500, for example, is an index of approximately 500 of the largest publicly traded US companies, selected by a committee at S&P Dow Jones Indices. It's designed to represent the performance of large-cap US equities.

An index fund is a fund — either a mutual fund or an ETF — designed to replicate the performance of an index. Rather than a manager picking stocks to beat the market, an index fund simply buys everything in the index in the same proportions. Because there's no active management, the fees are dramatically lower.

Why do index funds beat most active managers? Several reasons compound over time. First, fees: the average actively managed fund charges 0.5–1.5% annually. A Vanguard or Fidelity index fund might charge 0.03–0.10%. Over 30 years, that difference in fees can amount to a staggering amount of money. Second, consistent performance: study after study shows that roughly 80-90% of active managers underperform their benchmark index over periods of 10-15+ years. It's not that fund managers are incompetent — it's that markets are efficient enough that consistently finding mispriced securities is extraordinarily difficult after fees. Third, taxes: index funds trade less frequently, generating fewer taxable events.

A few of the most popular index fund providers are Vanguard, Fidelity, and Schwab. Vanguard essentially pioneered the modern index fund with John Bogle's philosophy that most investors are better served by low-cost, broad market exposure. All three now offer funds tracking the S&P 500 and broader markets with expense ratios as low as 0.00–0.03%.

Dollar cost averaging (DCA) is the strategy of investing a fixed amount at regular intervals — say, $500 on the first of every month — regardless of whether the market is up or down. When prices are high, your $500 buys fewer shares. When prices are low, it buys more. Over time, this averages out your purchase price and removes the temptation to time the market. It's one of the simplest, most psychologically sustainable investing strategies available.

The combination of low-cost index funds and consistent dollar cost averaging has built more wealth for ordinary investors than almost any other approach. You don't need to be smarter than Wall Street. You don't need to pick winning stocks. You just need to consistently invest in broad markets over a long period and let compound growth do its work. For most people, that's enough.`,
  },
];

export const LESSON_ORDER = LESSONS.map(l => l.id);
