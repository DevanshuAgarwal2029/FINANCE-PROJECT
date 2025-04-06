"""
Enhanced market data for the IndiStockPredictor platform.
Provides realistic market indices and sector performance data.
"""

import random
from datetime import datetime, timedelta

# Major Indian Market Indices
MARKET_INDICES = [
    {
        "symbol": "NIFTY 50",
        "name": "NIFTY 50",
        "description": "Benchmark index representing the top 50 companies listed on NSE by market capitalization"
    },
    {
        "symbol": "SENSEX",
        "name": "S&P BSE SENSEX",
        "description": "Benchmark index representing the top 30 companies listed on BSE by market capitalization"
    },
    {
        "symbol": "NIFTY BANK",
        "name": "NIFTY Bank",
        "description": "Index representing the 12 most liquid and large capitalized stocks from the banking sector"
    },
    {
        "symbol": "NIFTY IT",
        "name": "NIFTY IT",
        "description": "Index representing the top 10 companies from the IT sector"
    },
    {
        "symbol": "NIFTY AUTO",
        "name": "NIFTY Auto",
        "description": "Index representing the automotive sector including automobile and auto ancillary companies"
    },
    {
        "symbol": "NIFTY FMCG",
        "name": "NIFTY FMCG",
        "description": "Index representing companies from the Fast Moving Consumer Goods sector"
    },
    {
        "symbol": "NIFTY PHARMA",
        "name": "NIFTY Pharma",
        "description": "Index representing the pharmaceutical sector companies"
    },
    {
        "symbol": "NIFTY METAL",
        "name": "NIFTY Metal",
        "description": "Index representing companies belonging to the metal sector"
    },
    {
        "symbol": "NIFTY REALTY",
        "name": "NIFTY Realty",
        "description": "Index representing the real estate sector companies"
    },
    {
        "symbol": "INDIA VIX",
        "name": "India VIX",
        "description": "Volatility index based on the NIFTY 50 Index Option prices"
    }
]

# Detailed Indian Sectors with subsectors and key metrics
SECTORS = [
    {
        "name": "Information Technology",
        "subsectors": ["IT Services", "Software Development", "IT Consulting", "Technology Hardware"],
        "key_metrics": ["Digital Revenue Growth", "Client Concentration", "Employee Attrition", "Operating Margin"],
        "trends": ["Cloud Adoption", "AI Integration", "Digital Transformation", "Cybersecurity Spending"]
    },
    {
        "name": "Banking & Financial Services",
        "subsectors": ["Private Banks", "Public Banks", "NBFCs", "Insurance", "Asset Management"],
        "key_metrics": ["Net Interest Margin", "CASA Ratio", "Gross NPA", "Credit Growth"],
        "trends": ["Digital Banking", "UPI Transactions", "Retail Credit Growth", "Asset Quality"]
    },
    {
        "name": "Pharmaceuticals",
        "subsectors": ["Generics", "API Manufacturing", "R&D", "Contract Research", "Hospitals"],
        "key_metrics": ["R&D Spending", "USFDA Approvals", "Domestic Market Share", "API Dependency"],
        "trends": ["API Self-Reliance", "Specialty Pharma", "Healthcare Accessibility", "Biosimilars"]
    },
    {
        "name": "Automotive",
        "subsectors": ["Passenger Vehicles", "Commercial Vehicles", "Two-Wheelers", "Auto Ancillaries"],
        "key_metrics": ["Volume Growth", "Average Selling Price", "EBITDA Margin", "Inventory Levels"],
        "trends": ["Electric Vehicles", "SUV Preference", "Emission Norms", "PLI Scheme Impact"]
    },
    {
        "name": "Consumer Goods",
        "subsectors": ["FMCG", "Consumer Durables", "Apparel", "Food & Beverages"],
        "key_metrics": ["Rural Growth", "Urban Growth", "Input Cost Inflation", "Distribution Reach"],
        "trends": ["Premiumization", "Direct-to-Consumer", "Health & Wellness", "Rural Penetration"]
    },
    {
        "name": "Energy & Power",
        "subsectors": ["Oil & Gas", "Power Generation", "Power Distribution", "Renewable Energy"],
        "key_metrics": ["Crude Prices", "Plant Load Factor", "Transmission Loss", "Renewable Capacity"],
        "trends": ["Green Energy Transition", "Natural Gas Usage", "EV Infrastructure", "Hydrogen Economy"]
    },
    {
        "name": "Metal & Mining",
        "subsectors": ["Steel", "Aluminum", "Copper", "Mining"],
        "key_metrics": ["Commodity Prices", "Capacity Utilization", "Export Volume", "Import Dependency"],
        "trends": ["Infrastructure Push", "China Demand", "Global Supply Chain", "Green Steel"]
    },
    {
        "name": "Real Estate & Construction",
        "subsectors": ["Residential", "Commercial", "Infrastructure", "Cement"],
        "key_metrics": ["New Launches", "Unsold Inventory", "Cement Demand", "Urban Housing Demand"],
        "trends": ["Affordable Housing", "Office Space Demand", "REIT Growth", "Smart Cities"]
    },
    {
        "name": "Telecommunications",
        "subsectors": ["Wireless Services", "Fixed Line", "Tower Companies", "Broadband"],
        "key_metrics": ["ARPU", "Data Usage", "Subscriber Growth", "Infrastructure Investment"],
        "trends": ["5G Rollout", "Tariff Stability", "Enterprise Solutions", "Digital Infrastructure"]
    },
    {
        "name": "Retail",
        "subsectors": ["E-commerce", "Organized Retail", "Grocery", "Fashion"],
        "key_metrics": ["Same-Store Growth", "Online Penetration", "Customer Acquisition Cost", "Inventory Turnover"],
        "trends": ["Omnichannel Presence", "Quick Commerce", "Private Labels", "Rural Retail"]
    }
]

def generate_realistic_index_values():
    """Generate realistic values for market indices with proper correlations"""
    # Base values and sentiment
    nifty_50_value = round(random.uniform(19500, 20500), 2)
    market_sentiment = random.uniform(-1.5, 1.5)  # Overall market sentiment
    
    # First generate Nifty and Sensex with high correlation
    nifty_change_percent = market_sentiment + random.uniform(-0.5, 0.5)
    sensex_change_percent = nifty_change_percent * random.uniform(0.95, 1.05)  # High correlation with small variation
    
    # VIX typically moves opposite to the market, especially on big moves
    vix_base = 15 + abs(market_sentiment) * 3
    vix_change = -1 * nifty_change_percent * random.uniform(1.5, 2.5) if abs(nifty_change_percent) > 1 else random.uniform(-3, 3)
    
    index_values = []
    
    # Generate values for all indices with appropriate correlations
    for index in MARKET_INDICES:
        symbol = index["symbol"]
        
        if symbol == "NIFTY 50":
            value = nifty_50_value
            change_percent = nifty_change_percent
            volume = random.randint(150000, 250000)
        elif symbol == "SENSEX":
            value = nifty_50_value * 3.3  # Sensex is roughly 3.3x Nifty 50
            change_percent = sensex_change_percent
            volume = random.randint(120000, 220000)
        elif symbol == "INDIA VIX":
            value = vix_base
            change_percent = vix_change
            volume = random.randint(50000, 100000)
        else:
            # Sector indices have some correlation to main indices but with more variation
            # Different sectors respond differently to market conditions
            if symbol == "NIFTY BANK":
                sector_sensitivity = 1.2  # Banks tend to be high beta
                sector_specific = random.uniform(-0.8, 0.8)
                base_value = 46000
            elif symbol == "NIFTY IT":
                sector_sensitivity = 0.9
                sector_specific = random.uniform(-1.0, 1.0)
                base_value = 32000
            elif symbol == "NIFTY AUTO":
                sector_sensitivity = 1.0
                sector_specific = random.uniform(-0.9, 0.9)
                base_value = 18500
            elif symbol == "NIFTY FMCG":
                sector_sensitivity = 0.7  # Defensive sector
                sector_specific = random.uniform(-0.6, 0.6)
                base_value = 52000
            elif symbol == "NIFTY PHARMA":
                sector_sensitivity = 0.8  # Another defensive sector
                sector_specific = random.uniform(-0.7, 0.7)
                base_value = 17000
            elif symbol == "NIFTY METAL":
                sector_sensitivity = 1.4  # High beta cyclical sector
                sector_specific = random.uniform(-1.2, 1.2)
                base_value = 8000
            elif symbol == "NIFTY REALTY":
                sector_sensitivity = 1.5  # High beta sector
                sector_specific = random.uniform(-1.1, 1.1)
                base_value = 900
            else:
                sector_sensitivity = 1.0
                sector_specific = random.uniform(-1.0, 1.0)
                base_value = 15000
            
            # Calculate sector index value and change
            value = base_value * (1 + random.uniform(-0.05, 0.05))
            change_percent = (market_sentiment * sector_sensitivity) + sector_specific
            volume = random.randint(40000, 150000)
        
        # Calculate actual change
        change = round(value * change_percent / 100, 2)
        
        # Generate high, low, open values
        prev_close = value - change
        day_high = value * (1 + random.uniform(0, 0.005)) if change > 0 else prev_close * (1 + random.uniform(0, 0.003))
        day_low = prev_close * (1 - random.uniform(0, 0.005)) if change < 0 else value * (1 - random.uniform(0, 0.003))
        day_open = prev_close * (1 + random.uniform(-0.003, 0.003))
        
        # Ensure logical values
        day_high = max(day_high, value, day_open)
        day_low = min(day_low, value, day_open)
        
        index_values.append({
            "symbol": symbol,
            "name": index["name"],
            "price": round(value, 2),
            "change": round(change, 2),
            "changePercent": round(change_percent, 2),
            "open": round(day_open, 2),
            "high": round(day_high, 2),
            "low": round(day_low, 2),
            "previousClose": round(prev_close, 2),
            "volume": volume
        })
    
    return index_values

def generate_detailed_sector_performance():
    """Generate detailed sector performance with insights and trends"""
    sector_data = []
    
    # Base market trend affects all sectors to some degree
    market_trend = random.uniform(-2, 3)
    
    for sector in SECTORS:
        # Sector-specific variation
        sector_specific = random.uniform(-2.5, 2.5)
        
        # Calculate sector performance
        change_percent = market_trend + sector_specific
        
        # Pick random trends and insights
        active_trends = random.sample(sector["trends"], min(2, len(sector["trends"])))
        key_metrics_insights = []
        
        for metric in random.sample(sector["key_metrics"], min(2, len(sector["key_metrics"]))):
            trend = random.choice(["improving", "stable", "declining"])
            key_metrics_insights.append(f"{metric}: {trend}")
        
        # Select active subsectors with their own performance
        active_subsectors = []
        for subsector in sector["subsectors"]:
            subsector_change = change_percent + random.uniform(-1.5, 1.5)
            active_subsectors.append({
                "name": subsector,
                "changePercent": round(subsector_change, 2)
            })
        
        # Add sector data
        sector_data.append({
            "name": sector["name"],
            "changePercent": round(change_percent, 2),
            "subsectors": active_subsectors,
            "trends": active_trends,
            "insights": key_metrics_insights,
            "volume": random.randint(5000000, 50000000),
            "marketCap": round(random.uniform(100000, 5000000), 2)  # in crores
        })
    
    # Sort by performance
    sector_data.sort(key=lambda x: x["changePercent"], reverse=True)
    
    return sector_data

def generate_market_breadth():
    """Generate detailed market breadth data"""
    # Generate advances, declines for different segments
    total_stocks = random.randint(3800, 4200)
    
    # Overall market breadth
    advances = random.randint(int(total_stocks * 0.3), int(total_stocks * 0.7))
    declines = total_stocks - advances - random.randint(50, 150)  # Some unchanged
    unchanged = total_stocks - advances - declines
    
    # Segment-specific breadth
    nse_advances = random.randint(int(advances * 0.4), int(advances * 0.6))
    bse_advances = advances - nse_advances
    
    nse_declines = random.randint(int(declines * 0.4), int(declines * 0.6))
    bse_declines = declines - nse_declines
    
    nse_unchanged = random.randint(int(unchanged * 0.4), int(unchanged * 0.6))
    bse_unchanged = unchanged - nse_unchanged
    
    # Market cap segments
    large_cap_advances = random.randint(int(nse_advances * 0.3), int(nse_advances * 0.4))
    mid_cap_advances = random.randint(int(nse_advances * 0.3), int(nse_advances * 0.4))
    small_cap_advances = nse_advances - large_cap_advances - mid_cap_advances
    
    large_cap_declines = random.randint(int(nse_declines * 0.2), int(nse_declines * 0.3))
    mid_cap_declines = random.randint(int(nse_declines * 0.3), int(nse_declines * 0.4))
    small_cap_declines = nse_declines - large_cap_declines - mid_cap_declines
    
    # Generate 52-week highs and lows
    week_high = random.randint(50, 150)
    week_low = random.randint(30, 120)
    
    # Volume and turnover data
    total_volume = random.randint(15000, 25000)  # in millions
    equity_volume = random.randint(int(total_volume * 0.7), int(total_volume * 0.9))
    derivative_volume = total_volume - equity_volume
    
    total_turnover = random.randint(80000, 150000)  # in crores
    equity_turnover = random.randint(int(total_turnover * 0.6), int(total_turnover * 0.8))
    derivative_turnover = total_turnover - equity_turnover
    
    return {
        "overall": {
            "advances": advances,
            "declines": declines,
            "unchanged": unchanged,
            "advanceDeclineRatio": round(advances / declines, 2) if declines > 0 else "∞",
            "total": total_stocks
        },
        "exchanges": {
            "nse": {
                "advances": nse_advances,
                "declines": nse_declines,
                "unchanged": nse_unchanged,
                "total": nse_advances + nse_declines + nse_unchanged
            },
            "bse": {
                "advances": bse_advances,
                "declines": bse_declines,
                "unchanged": bse_unchanged,
                "total": bse_advances + bse_declines + bse_unchanged
            }
        },
        "marketCap": {
            "largeCap": {
                "advances": large_cap_advances,
                "declines": large_cap_declines,
                "unchanged": random.randint(10, 30)
            },
            "midCap": {
                "advances": mid_cap_advances,
                "declines": mid_cap_declines,
                "unchanged": random.randint(15, 40)
            },
            "smallCap": {
                "advances": small_cap_advances,
                "declines": small_cap_declines,
                "unchanged": random.randint(20, 50)
            }
        },
        "weekStats": {
            "52WeekHigh": week_high,
            "52WeekLow": week_low
        },
        "volume": {
            "totalVolume": total_volume,
            "equityVolume": equity_volume,
            "derivativeVolume": derivative_volume,
            "totalTurnover": total_turnover,
            "equityTurnover": equity_turnover,
            "derivativeTurnover": derivative_turnover,
            "volumeGrowth": round(random.uniform(-10, 15), 2)
        },
        "timestamp": datetime.now().isoformat()
    }

def generate_market_movers(top_count=10):
    """Generate top gainers and losers across the market"""
    # Instead of importing from mock_server, define a sample list locally
    SAMPLE_STOCKS = [
        {"symbol": "RELIANCE", "name": "Reliance Industries Ltd.", "sector": "Energy"},
        {"symbol": "TCS", "name": "Tata Consultancy Services Ltd.", "sector": "IT"},
        {"symbol": "HDFCBANK", "name": "HDFC Bank Ltd.", "sector": "Banking"},
        {"symbol": "INFY", "name": "Infosys Ltd.", "sector": "IT"},
        {"symbol": "HINDUNILVR", "name": "Hindustan Unilever Ltd.", "sector": "FMCG"},
        {"symbol": "ICICIBANK", "name": "ICICI Bank Ltd.", "sector": "Banking"},
        {"symbol": "SBIN", "name": "State Bank of India", "sector": "Banking"},
        {"symbol": "BAJFINANCE", "name": "Bajaj Finance Ltd.", "sector": "Finance"},
        {"symbol": "BHARTIARTL", "name": "Bharti Airtel Ltd.", "sector": "Telecom"},
        {"symbol": "ITC", "name": "ITC Ltd.", "sector": "FMCG"},
        {"symbol": "KOTAKBANK", "name": "Kotak Mahindra Bank Ltd.", "sector": "Banking"},
        {"symbol": "LT", "name": "Larsen & Toubro Ltd.", "sector": "Construction"},
        {"symbol": "ASIANPAINT", "name": "Asian Paints Ltd.", "sector": "Consumer Goods"},
        {"symbol": "MARUTI", "name": "Maruti Suzuki India Ltd.", "sector": "Automobile"},
        {"symbol": "AXISBANK", "name": "Axis Bank Ltd.", "sector": "Banking"},
        {"symbol": "WIPRO", "name": "Wipro Ltd.", "sector": "IT"},
        {"symbol": "HCLTECH", "name": "HCL Technologies Ltd.", "sector": "IT"},
        {"symbol": "SUNPHARMA", "name": "Sun Pharmaceutical Industries Ltd.", "sector": "Pharma"},
        {"symbol": "TATASTEEL", "name": "Tata Steel Ltd.", "sector": "Metal"},
        {"symbol": "ONGC", "name": "Oil & Natural Gas Corporation Ltd.", "sector": "Energy"},
        {"symbol": "TATAMOTORS", "name": "Tata Motors Ltd.", "sector": "Automobile"},
        {"symbol": "NTPC", "name": "NTPC Ltd.", "sector": "Power"},
        {"symbol": "BAJAJFINSV", "name": "Bajaj Finserv Ltd.", "sector": "Finance"},
        {"symbol": "TITAN", "name": "Titan Company Ltd.", "sector": "Consumer Goods"},
        {"symbol": "ADANIENT", "name": "Adani Enterprises Ltd.", "sector": "Diversified"},
        {"symbol": "ADANIPORTS", "name": "Adani Ports and Special Economic Zone Ltd.", "sector": "Infrastructure"},
        {"symbol": "ADANIPOWER", "name": "Adani Power Ltd.", "sector": "Power"},
        {"symbol": "ADANIGREEN", "name": "Adani Green Energy Ltd.", "sector": "Energy"},
        {"symbol": "ULTRACEMCO", "name": "UltraTech Cement Ltd.", "sector": "Cement"},
        {"symbol": "JSWSTEEL", "name": "JSW Steel Ltd.", "sector": "Metal"}
    ]
    
    # Create shuffled copy of stocks for variety
    stocks_copy = SAMPLE_STOCKS.copy()
    random.shuffle(stocks_copy)
    
    # Generate top gainers with strong positive movement
    gainers = []
    for i in range(min(top_count, len(stocks_copy))):
        stock = stocks_copy[i]
        symbol_hash = sum(ord(c) for c in stock["symbol"])
        base_price = 500 + (symbol_hash % 3000)
        change_percent = round(random.uniform(3.5, 15.0), 2)
        change = round(base_price * change_percent / 100, 2)
        
        gainers.append({
            "symbol": stock["symbol"],
            "name": stock["name"],
            "sector": stock["sector"],
            "price": base_price + change,
            "change": change,
            "changePercent": change_percent,
            "volume": random.randint(500000, 5000000)
        })
    
    # Sort gainers by change percent
    gainers.sort(key=lambda x: x["changePercent"], reverse=True)
    
    # Generate top losers with strong negative movement
    losers = []
    for i in range(min(top_count, len(stocks_copy))):
        stock = stocks_copy[i + top_count]  # Use different stocks
        symbol_hash = sum(ord(c) for c in stock["symbol"])
        base_price = 500 + (symbol_hash % 3000)
        change_percent = round(random.uniform(-15.0, -3.5), 2)
        change = round(base_price * change_percent / 100, 2)
        
        losers.append({
            "symbol": stock["symbol"],
            "name": stock["name"],
            "sector": stock["sector"],
            "price": base_price + change,
            "change": change,
            "changePercent": change_percent,
            "volume": random.randint(500000, 5000000)
        })
    
    # Sort losers by change percent
    losers.sort(key=lambda x: x["changePercent"])
    
    # Generate most active stocks by volume
    active_by_volume = []
    for i in range(min(top_count, len(stocks_copy))):
        stock = stocks_copy[i + 2 * top_count]  # Use different stocks again
        symbol_hash = sum(ord(c) for c in stock["symbol"])
        base_price = 500 + (symbol_hash % 3000)
        change_percent = round(random.uniform(-5.0, 5.0), 2)
        change = round(base_price * change_percent / 100, 2)
        volume = random.randint(5000000, 20000000)  # High volume
        
        active_by_volume.append({
            "symbol": stock["symbol"],
            "name": stock["name"],
            "sector": stock["sector"],
            "price": base_price + change,
            "change": change,
            "changePercent": change_percent,
            "volume": volume
        })
    
    # Sort by volume
    active_by_volume.sort(key=lambda x: x["volume"], reverse=True)
    
    return {
        "gainers": gainers,
        "losers": losers,
        "mostActive": active_by_volume
    }

def generate_market_sentiment():
    """Generate overall market sentiment with multiple indicators"""
    # Generate technical indicators for the market as a whole
    # RSI (0-100): Below 30 is oversold, above 70 is overbought
    rsi = random.randint(30, 70)
    
    # Generate other indicators
    macd = random.uniform(-5, 5)
    adx = random.randint(15, 40)  # Above 25 indicates a strong trend
    
    # Overall market direction
    if rsi > 60:
        direction = "Bullish" if macd > 0 else "Moderately Bullish"
        strength = random.randint(60, 90)
    elif rsi < 40:
        direction = "Bearish" if macd < 0 else "Moderately Bearish"
        strength = random.randint(60, 90)
    else:
        direction = "Neutral"
        strength = random.randint(40, 60)
    
    # FII and DII activity data
    fii_net = round(random.uniform(-2000, 2000), 2)  # in crores
    dii_net = round(random.uniform(-2000, 2000), 2)  # in crores
    
    # Generate market commentary based on conditions
    if direction.startswith("Bull"):
        if fii_net > 0 and dii_net > 0:
            commentary = "Strong market momentum with both FII and DII buying interest."
        elif fii_net > 0:
            commentary = "Markets advancing with strong FII inflows despite DII selling."
        else:
            commentary = "Markets supported by domestic institutional buying despite FII outflows."
    elif direction.startswith("Bear"):
        if fii_net < 0 and dii_net < 0:
            commentary = "Markets under pressure with continued selling from both FII and DII."
        elif fii_net < 0:
            commentary = "FII selling putting pressure on markets despite domestic support."
        else:
            commentary = "Domestic institutional selling weighing on market sentiment."
    else:
        commentary = "Markets consolidating with mixed institutional flows in a range-bound session."
    
    return {
        "overall": direction,
        "strength": strength,
        "technicalIndicators": {
            "rsi": rsi,
            "macd": round(macd, 2),
            "adx": adx,
            "trendStrength": "Strong" if adx > 25 else "Weak",
            "trendDirection": "Uptrend" if macd > 0 else "Downtrend" if macd < 0 else "No Clear Trend"
        },
        "institutionalActivity": {
            "fii": {
                "netValue": fii_net,
                "action": "Buying" if fii_net > 0 else "Selling"
            },
            "dii": {
                "netValue": dii_net,
                "action": "Buying" if dii_net > 0 else "Selling"
            }
        },
        "marketCommentary": commentary,
        "globalCues": random.choice([
            "Positive global cues supporting market sentiment",
            "Weak global markets weighing on domestic sentiment",
            "Mixed global cues keeping markets range-bound",
            "US markets providing strong directional cues"
        ])
    }

def generate_enhanced_market_overview():
    """Generate a comprehensive market overview with all data points"""
    # Get data from all sources
    indices = generate_realistic_index_values()
    sectors = generate_detailed_sector_performance()
    breadth = generate_market_breadth()
    movers = generate_market_movers()
    sentiment = generate_market_sentiment()
    
    # Get Nifty and Sensex for the summary
    nifty = next((idx for idx in indices if idx["symbol"] == "NIFTY 50"), None)
    sensex = next((idx for idx in indices if idx["symbol"] == "SENSEX"), None)
    
    # Generate market summary
    if nifty and sensex:
        nifty_move = "gained" if nifty["change"] > 0 else "lost"
        sensex_move = "gained" if sensex["change"] > 0 else "lost"
        
        summary = f"Nifty 50 {nifty_move} {abs(nifty['change'])} points ({abs(nifty['changePercent'])}%) to close at {nifty['price']}, while Sensex {sensex_move} {abs(sensex['change'])} points ({abs(sensex['changePercent'])}%) to end at {sensex['price']}. {sentiment['marketCommentary']} Market breadth was {breadth['overall']['advanceDeclineRatio']} with {breadth['overall']['advances']} advances against {breadth['overall']['declines']} declines."
    else:
        summary = "Market data currently unavailable."
    
    return {
        "summary": summary,
        "lastUpdated": datetime.now().isoformat(),
        "indices": indices,
        "sectors": sectors,
        "breadth": breadth,
        "movers": movers,
        "sentiment": sentiment
    } 