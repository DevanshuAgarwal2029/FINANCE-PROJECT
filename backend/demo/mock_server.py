from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import json
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Expanded list of Indian stocks for more comprehensive database
INDIAN_STOCKS = [
    {"symbol": "RELIANCE", "name": "Reliance Industries Ltd.", "sector": "Energy", "exchange": "NSE", "industry": "Oil & Gas", "description": "India's largest private sector company with businesses in energy, petrochemicals, textiles, retail, and telecommunications."},
    {"symbol": "TCS", "name": "Tata Consultancy Services Ltd.", "sector": "IT", "exchange": "NSE", "industry": "Software", "description": "India's largest IT services company offering consulting and business solutions globally."},
    {"symbol": "HDFCBANK", "name": "HDFC Bank Ltd.", "sector": "Banking", "exchange": "NSE", "industry": "Private Banking", "description": "India's largest private sector bank by assets offering a wide range of banking products and financial services."},
    {"symbol": "INFY", "name": "Infosys Ltd.", "sector": "IT", "exchange": "NSE", "industry": "Software", "description": "A global leader in next-generation digital services and consulting, enabling clients to navigate digital transformation."},
    {"symbol": "HINDUNILVR", "name": "Hindustan Unilever Ltd.", "sector": "FMCG", "exchange": "NSE", "industry": "Consumer Goods", "description": "India's largest fast-moving consumer goods company with products in home care, beauty & personal care, and foods & refreshment."},
    {"symbol": "ICICIBANK", "name": "ICICI Bank Ltd.", "sector": "Banking", "exchange": "NSE", "industry": "Private Banking", "description": "Second largest private sector bank in India offering a wide range of banking products and financial services."},
    {"symbol": "SBIN", "name": "State Bank of India", "sector": "Banking", "exchange": "NSE", "industry": "Public Banking", "description": "India's largest public sector bank offering a wide range of banking products and services."},
    {"symbol": "BAJFINANCE", "name": "Bajaj Finance Ltd.", "sector": "Finance", "exchange": "NSE", "industry": "NBFC", "description": "One of India's leading non-banking financial companies (NBFC) with diversified lending products."},
    {"symbol": "BHARTIARTL", "name": "Bharti Airtel Ltd.", "sector": "Telecom", "exchange": "NSE", "industry": "Telecommunications", "description": "One of India's leading telecommunications service providers with operations in 18 countries."},
    {"symbol": "ITC", "name": "ITC Ltd.", "sector": "FMCG", "exchange": "NSE", "industry": "Diversified", "description": "Multi-business conglomerate with diversified presence in FMCG, hotels, paperboards & packaging, agri business & IT."},
    {"symbol": "KOTAKBANK", "name": "Kotak Mahindra Bank Ltd.", "sector": "Banking", "exchange": "NSE", "industry": "Private Banking", "description": "One of India's leading private sector banks offering banking and financial services."},
    {"symbol": "LT", "name": "Larsen & Toubro Ltd.", "sector": "Construction", "exchange": "NSE", "industry": "Engineering & Construction", "description": "India's largest construction company and a leading technology, engineering, construction, manufacturing and financial services conglomerate."},
    {"symbol": "ASIANPAINT", "name": "Asian Paints Ltd.", "sector": "Consumer Goods", "exchange": "NSE", "industry": "Paints", "description": "India's leading paint company and ranked among the top decorative paints companies in the world."},
    {"symbol": "MARUTI", "name": "Maruti Suzuki India Ltd.", "sector": "Automobile", "exchange": "NSE", "industry": "Passenger Vehicles", "description": "India's largest passenger car manufacturer with more than 50% market share in the Indian passenger car market."},
    {"symbol": "AXISBANK", "name": "Axis Bank Ltd.", "sector": "Banking", "exchange": "NSE", "industry": "Private Banking", "description": "Third largest private sector bank in India offering a wide range of banking products and financial services."},
    {"symbol": "WIPRO", "name": "Wipro Ltd.", "sector": "IT", "exchange": "NSE", "industry": "Software", "description": "Global information technology, consulting and business process services company providing solutions to enable clients do business better."},
    {"symbol": "HCLTECH", "name": "HCL Technologies Ltd.", "sector": "IT", "exchange": "NSE", "industry": "Software", "description": "Global technology company that helps enterprises reimagine their businesses for the digital age."},
    {"symbol": "SUNPHARMA", "name": "Sun Pharmaceutical Industries Ltd.", "sector": "Pharma", "exchange": "NSE", "industry": "Pharmaceuticals", "description": "India's largest pharmaceutical company and the fifth largest specialty generic company globally."},
    {"symbol": "TATASTEEL", "name": "Tata Steel Ltd.", "sector": "Metal", "exchange": "NSE", "industry": "Steel", "description": "Among the top global steel companies with an annual crude steel capacity of 34 million tonnes per annum."},
    {"symbol": "ONGC", "name": "Oil & Natural Gas Corporation Ltd.", "sector": "Energy", "exchange": "NSE", "industry": "Oil & Gas", "description": "India's largest government-owned oil and gas corporation contributing 70% to India's domestic production."},
    {"symbol": "TATAMOTORS", "name": "Tata Motors Ltd.", "sector": "Automobile", "exchange": "NSE", "industry": "Automotive", "description": "India's largest automobile company, also owning the Jaguar Land Rover (JLR) brand."},
    {"symbol": "NTPC", "name": "NTPC Ltd.", "sector": "Power", "exchange": "NSE", "industry": "Power Generation", "description": "India's largest power generation company with a power generating capacity of 65,810 MW."},
    {"symbol": "BAJAJFINSV", "name": "Bajaj Finserv Ltd.", "sector": "Finance", "exchange": "NSE", "industry": "Financial Services", "description": "Holding company for Bajaj Finance, Bajaj Allianz General Insurance and Bajaj Allianz Life Insurance."},
    {"symbol": "BAJAJ-AUTO", "name": "Bajaj Auto Ltd.", "sector": "Automobile", "exchange": "NSE", "industry": "Two-wheelers", "description": "World's fourth largest two and three-wheeler manufacturer with presence in over 70 countries."},
    {"symbol": "TITAN", "name": "Titan Company Ltd.", "sector": "Consumer Goods", "exchange": "NSE", "industry": "Watches & Jewelry", "description": "Leading manufacturer of watches, jewelry, and eyewear in India with brands like Tanishq, Titan, Fastrack, etc."},
    {"symbol": "ADANIENT", "name": "Adani Enterprises Ltd.", "sector": "Diversified", "exchange": "NSE", "industry": "Infrastructure", "description": "Flagship company of the Adani Group with interests in resources, logistics, energy and agro."},
    {"symbol": "ADANIPORTS", "name": "Adani Ports and Special Economic Zone Ltd.", "sector": "Infrastructure", "exchange": "NSE", "industry": "Ports", "description": "India's largest private port operator with ports across the eastern and western coasts of India."},
    {"symbol": "ADANIPOWER", "name": "Adani Power Ltd.", "sector": "Power", "exchange": "NSE", "industry": "Power Generation", "description": "India's largest private thermal power producer with capacity of 12,450 MW."},
    {"symbol": "ADANIGREEN", "name": "Adani Green Energy Ltd.", "sector": "Energy", "exchange": "NSE", "industry": "Renewable Energy", "description": "One of the largest renewable energy companies in India with a renewable portfolio of 14,795 MW."},
    {"symbol": "ULTRACEMCO", "name": "UltraTech Cement Ltd.", "sector": "Cement", "exchange": "NSE", "industry": "Cement", "description": "India's largest cement company and the world's third-largest cement company with annual capacity of 116.75 MTPA."},
    {"symbol": "JSWSTEEL", "name": "JSW Steel Ltd.", "sector": "Metal", "exchange": "NSE", "industry": "Steel", "description": "India's leading integrated steel manufacturer with 18 MTPA capacity."},
    {"symbol": "TECHM", "name": "Tech Mahindra Ltd.", "sector": "IT", "exchange": "NSE", "industry": "Software", "description": "Fifth largest IT services company in India offering technology services and solutions."},
    {"symbol": "NESTLEIND", "name": "Nestle India Ltd.", "sector": "FMCG", "exchange": "NSE", "industry": "Food Processing", "description": "Leading food and beverage company in India with popular brands like Maggi, Nescafe, KitKat, etc."},
    {"symbol": "DIVISLAB", "name": "Divi's Laboratories Ltd.", "sector": "Pharma", "exchange": "NSE", "industry": "Pharmaceuticals", "description": "India's leading pharmaceutical company manufacturing active pharmaceutical ingredients."},
    {"symbol": "CIPLA", "name": "Cipla Ltd.", "sector": "Pharma", "exchange": "NSE", "industry": "Pharmaceuticals", "description": "Global pharmaceutical company with a portfolio in respiratory, antiretroviral, urology, cardiology, and anti-infective segments."},
    {"symbol": "DRREDDY", "name": "Dr. Reddy's Laboratories Ltd.", "sector": "Pharma", "exchange": "NSE", "industry": "Pharmaceuticals", "description": "Leading Indian pharmaceutical company with presence in over 20 countries and offering a wide range of medicines."},
    {"symbol": "SHREECEM", "name": "Shree Cement Ltd.", "sector": "Cement", "exchange": "NSE", "industry": "Cement", "description": "One of India's largest cement manufacturers with an installed capacity of 43.40 MTPA."},
    {"symbol": "COALINDIA", "name": "Coal India Ltd.", "sector": "Energy", "exchange": "NSE", "industry": "Mining & Minerals", "description": "World's largest coal producer and contributes to around 83% of India's coal production."},
    {"symbol": "GRASIM", "name": "Grasim Industries Ltd.", "sector": "Diversified", "exchange": "NSE", "industry": "Textiles & Chemicals", "description": "Flagship company of the Aditya Birla Group with businesses in viscose staple fiber, chemicals, and cement."},
    {"symbol": "PIDILITIND", "name": "Pidilite Industries Ltd.", "sector": "Chemicals", "exchange": "NSE", "industry": "Adhesives", "description": "India's leading manufacturer of adhesives, sealants, and construction chemicals with brands like Fevicol, Dr. Fixit, etc."},
    {"symbol": "INDUSINDBK", "name": "IndusInd Bank Ltd.", "sector": "Banking", "exchange": "NSE", "industry": "Private Banking", "description": "New-generation Indian bank serving the retail and corporate banking sectors."},
    {"symbol": "M&M", "name": "Mahindra & Mahindra Ltd.", "sector": "Automobile", "exchange": "NSE", "industry": "Automotive", "description": "Leading manufacturer of utility vehicles, tractors, and information technology services."},
    {"symbol": "BRITANNIA", "name": "Britannia Industries Ltd.", "sector": "FMCG", "exchange": "NSE", "industry": "Food Products", "description": "India's leading food company with popular biscuit brands and a growing presence in dairy and bakery products."},
    {"symbol": "HEROMOTOCO", "name": "Hero MotoCorp Ltd.", "sector": "Automobile", "exchange": "NSE", "industry": "Two-wheelers", "description": "World's largest manufacturer of two-wheelers with more than 50% market share in the Indian two-wheeler market."},
    {"symbol": "ZEEL", "name": "Zee Entertainment Enterprises Ltd.", "sector": "Media", "exchange": "NSE", "industry": "Media & Entertainment", "description": "One of India's largest media and entertainment companies with presence in television, digital content, and live entertainment."},
    {"symbol": "BPCL", "name": "Bharat Petroleum Corporation Ltd.", "sector": "Energy", "exchange": "NSE", "industry": "Oil & Gas", "description": "Second largest downstream oil company in India and one of the Fortune Global 500 companies."},
    {"symbol": "HDFCLIFE", "name": "HDFC Life Insurance Company Ltd.", "sector": "Insurance", "exchange": "NSE", "industry": "Life Insurance", "description": "One of India's leading private life insurance companies offering a range of insurance products."},
    {"symbol": "SBILIFE", "name": "SBI Life Insurance Company Ltd.", "sector": "Insurance", "exchange": "NSE", "industry": "Life Insurance", "description": "Joint venture between State Bank of India and BNP Paribas Cardif offering a range of life insurance products."},
    {"symbol": "DABUR", "name": "Dabur India Ltd.", "sector": "FMCG", "exchange": "NSE", "industry": "Consumer Goods", "description": "Fourth largest FMCG company in India with a portfolio of over 250 herbal/ayurvedic products."}
]

# Custom stock recommendations for major stocks
STOCK_RECOMMENDATIONS = {
    "RELIANCE": {
        "rating": "Strong Buy",
        "reasons": [
            "Strong growth in digital and retail segments",
            "Robust oil-to-chemicals business performance",
            "Continued deleveraging strengthening balance sheet",
            "Expansion in green energy demonstrates forward-thinking"
        ],
        "strength": 85
    },
    "TCS": {
        "rating": "Buy",
        "reasons": [
            "Steady order book growth",
            "Industry-leading margins maintained",
            "Strong cash generation and shareholder returns",
            "Expanding digital services portfolio"
        ],
        "strength": 78
    },
    "HDFCBANK": {
        "rating": "Buy",
        "reasons": [
            "Strong deposit franchise",
            "Industry-leading asset quality",
            "Consistent ROA and ROE metrics",
            "Accelerated digital banking adoption"
        ],
        "strength": 82
    },
    "INFY": {
        "rating": "Buy",
        "reasons": [
            "Robust deal pipeline",
            "Strong digital services growth",
            "Healthy operating margins",
            "Consistent dividend payouts"
        ],
        "strength": 75
    },
    "SBIN": {
        "rating": "Hold",
        "reasons": [
            "Improving asset quality",
            "Concerns over government influence",
            "Recent rally makes valuation stretched",
            "Sector-wide credit growth challenges"
        ],
        "strength": 65
    },
    "TATAMOTORS": {
        "rating": "Buy",
        "reasons": [
            "JLR performance improving",
            "Strong EV transition strategy",
            "Domestic commercial vehicle recovery",
            "New model launches driving growth"
        ],
        "strength": 78
    },
    "MARUTI": {
        "rating": "Hold",
        "reasons": [
            "Market share pressure from competition",
            "Delayed EV strategy implementation",
            "Rising input costs affecting margins",
            "Premium segment underrepresentation"
        ],
        "strength": 60
    },
    "BHARTIARTL": {
        "rating": "Strong Buy",
        "reasons": [
            "ARPU improvement trajectory",
            "Strong 5G spectrum positioning",
            "Robust subscriber additions",
            "Digital services ecosystem expansion"
        ],
        "strength": 88
    }
}

# Generate mock data with enhanced details
def generate_stock_price_history(symbol, days=365):
    # Set base price based on stock symbol for consistency
    symbol_hash = sum(ord(c) for c in symbol)
    base_price = 500 + (symbol_hash % 3000)
    
    today = datetime.now()
    result = []
    
    price = base_price
    volatility = 0.015 + (symbol_hash % 100) / 1000  # Different volatility per stock
    
    for i in range(days):
        date = today - timedelta(days=days-i-1)
        change = random.uniform(-volatility, volatility)
        price = price * (1 + change)
        
        # Add some trends and seasonality
        if i % 30 < 15:  # Create some cyclic patterns
            price *= 1.002
        
        # Add volume with some correlation to price movement
        volume_base = 100000 + (symbol_hash % 1000000)
        volume_change = 1 + abs(change) * 10  # Higher volume on big moves
        
        result.append({
            "date": date.strftime("%Y-%m-%d"),
            "open": round(price * (1 - random.uniform(0, 0.01)), 2),
            "high": round(price * (1 + random.uniform(0, 0.02)), 2),
            "low": round(price * (1 - random.uniform(0, 0.02)), 2),
            "close": round(price, 2),
            "volume": round(volume_base * volume_change),
        })
    
    return result

def generate_prediction(symbol, days=30):
    # Get recent historical data to base prediction on
    historical_data = generate_stock_price_history(symbol, 30)
    base_price = historical_data[-1]["close"]
    
    # Create a symbol-specific trend bias for consistency
    symbol_hash = sum(ord(c) for c in symbol)
    trend_bias = (symbol_hash % 100) / 100 - 0.5  # Range from -0.5 to 0.5
    
    today = datetime.now()
    daily_predictions = []
    
    price = base_price
    trend = "up" if trend_bias > 0 else "down"
    trend_factor = (0.002 + abs(trend_bias) * 0.004) * (1 if trend == "up" else -1)
    
    # Generate AI confidence level - higher for stable stocks
    confidence = 65 + (symbol_hash % 30)
    
    # Technical indicators
    rsi = 50 + (trend_bias * 40)  # 30-70 range
    macd = trend_bias * 2
    
    for i in range(days):
        date = today + timedelta(days=i)
        
        # Add some randomness but maintain overall trend
        daily_volatility = 0.01 - (i * 0.0001)  # Volatility decreases for far future predictions
        change = random.uniform(-daily_volatility, daily_volatility) + trend_factor
        price = price * (1 + change)
        
        # Calculate confidence intervals - widen for distant predictions
        confidence_interval = 0.01 + (i * 0.001)
        
        daily_predictions.append({
            "date": date.strftime("%Y-%m-%d"),
            "price": round(price, 2),
            "lower_bound": round(price * (1 - confidence_interval), 2),
            "upper_bound": round(price * (1 + confidence_interval), 2),
        })
    
    change_percent = round((daily_predictions[-1]["price"] - base_price) / base_price * 100, 2)
    
    # Generate analysis drivers based on trend
    if trend == "up":
        drivers = random.sample([
            "Strong quarterly results expected",
            "Positive sector outlook",
            "Increased institutional buying",
            "Favorable regulatory changes",
            "New product launches",
            "International expansion",
            "Cost-cutting measures",
            "Strategic acquisitions"
        ], 3)
    else:
        drivers = random.sample([
            "Competitive pressures increasing",
            "Margin compression expected",
            "Regulatory headwinds",
            "Sector rotation out of industry",
            "Valuation concerns",
            "Supply chain constraints",
            "Rising input costs",
            "Management uncertainty"
        ], 3)
    
    # Generate technical signals
    if trend == "up":
        recommendation = "Buy" if change_percent > 5 else "Hold"
        signals = random.sample([
            "Bullish MACD crossover",
            "RSI showing upward momentum",
            "Golden cross on 50/200 day MA",
            "Cup and handle pattern forming",
            "Increased trading volume on up days"
        ], 2)
    else:
        recommendation = "Sell" if change_percent < -5 else "Hold"
        signals = random.sample([
            "Bearish MACD divergence",
            "RSI indicating overbought conditions",
            "Death cross on 50/200 day MA",
            "Head and shoulders pattern forming",
            "Decreased trading volume on up days"
        ], 2)
    
    # Calculate scores for recommendation components
    technical_score = 50 + int(rsi * 0.5)
    fundamental_score = 50 + (symbol_hash % 50)
    
    # Determine recommendation based on pre-defined data if available
    recommendation_data = STOCK_RECOMMENDATIONS.get(symbol)
    if recommendation_data:
        final_recommendation = recommendation_data["rating"]
        reasons = recommendation_data["reasons"]
        strength = recommendation_data["strength"]
    else:
        final_recommendation = recommendation
        reasons = drivers
        strength = min(95, max(60, confidence))  # Ensure strength is between 60-95
    
    return {
        "symbol": symbol,
        "current_price": base_price,
        "last_prediction_price": daily_predictions[-1]["price"],
        "prediction_days": days,
        "daily_predictions": daily_predictions,
        "trend": trend,
        "percent_change": change_percent,
        "confidence": round(confidence, 2),
        "analysis": {
            "drivers": drivers,
            "technicalSignals": signals,
            "indicators": {
                "rsi": round(rsi, 2),
                "macd": round(macd, 2),
                "movingAverages": {
                    "ma50": round(base_price * (1 - trend_bias * 0.05), 2),
                    "ma200": round(base_price * (1 - trend_bias * 0.1), 2)
                }
            }
        },
        "recommendation": {
            "rating": final_recommendation,
            "reasons": reasons,
            "strength": strength,
            "technical_score": technical_score,
            "fundamental_score": fundamental_score,
            "updated": datetime.now().isoformat()
        }
    }

def generate_market_indices():
    indices = [
        {"name": "NIFTY 50", "value": round(random.uniform(20000, 25000), 2), "change": round(random.uniform(-200, 200), 2)},
        {"name": "SENSEX", "value": round(random.uniform(65000, 75000), 2), "change": round(random.uniform(-500, 500), 2)},
        {"name": "NIFTY BANK", "value": round(random.uniform(45000, 50000), 2), "change": round(random.uniform(-300, 300), 2)},
        {"name": "NIFTY IT", "value": round(random.uniform(30000, 35000), 2), "change": round(random.uniform(-200, 200), 2)},
        {"name": "NIFTY AUTO", "value": round(random.uniform(15000, 18000), 2), "change": round(random.uniform(-150, 150), 2)},
        {"name": "NIFTY PHARMA", "value": round(random.uniform(14000, 16000), 2), "change": round(random.uniform(-120, 120), 2)},
        {"name": "NIFTY METAL", "value": round(random.uniform(6000, 7000), 2), "change": round(random.uniform(-80, 80), 2)},
        {"name": "NIFTY FMCG", "value": round(random.uniform(45000, 48000), 2), "change": round(random.uniform(-200, 200), 2)},
    ]
    
    for idx in indices:
        idx["changePercent"] = round(idx["change"] / idx["value"] * 100, 2)
        idx["lastUpdated"] = datetime.now().isoformat()
        # Add previous close
        idx["previousClose"] = round(idx["value"] - idx["change"], 2)
        # Add day range
        day_range = random.uniform(0.5, 1.5)
        idx["dayLow"] = round(idx["value"] - (idx["value"] * day_range / 100), 2)
        idx["dayHigh"] = round(idx["value"] + (idx["value"] * day_range / 100), 2)
        # Add 52-week range
        idx["weekLow"] = round(idx["value"] * 0.85, 2)
        idx["weekHigh"] = round(idx["value"] * 1.15, 2)
    
    return indices

def generate_fundamentals(symbol, stock_details=None):
    """
    Generate realistic fundamental data for a given stock
    """
    if stock_details is None:
        # Get the stock details if not provided
        stock_details = get_stock_details(symbol)
    
    if not stock_details:
        return None
    
    # Get the sector for more realistic data generation
    sector = stock_details.get('sector', 'Unknown')
    price = stock_details.get('price', 1000)
    
    # Base values that will be adjusted based on sector
    pe_base = 0
    pb_base = 0
    ps_base = 0
    ev_ebitda_base = 0
    peg_base = 0
    
    # Set base values by sector
    if sector == 'Information Technology':
        pe_base = random.uniform(20, 35)
        pb_base = random.uniform(4, 8)
        ps_base = random.uniform(3, 7)
        ev_ebitda_base = random.uniform(15, 25)
        peg_base = random.uniform(1.2, 2.0)
        
    elif sector == 'Financial Services':
        pe_base = random.uniform(10, 18)
        pb_base = random.uniform(1, 3)
        ps_base = random.uniform(2, 4)
        ev_ebitda_base = random.uniform(8, 15)
        peg_base = random.uniform(0.8, 1.5)
        
    elif sector == 'Healthcare':
        pe_base = random.uniform(18, 30)
        pb_base = random.uniform(3, 6)
        ps_base = random.uniform(2, 6)
        ev_ebitda_base = random.uniform(12, 20)
        peg_base = random.uniform(1.0, 1.8)
        
    elif sector == 'Consumer Goods':
        pe_base = random.uniform(15, 25)
        pb_base = random.uniform(2, 5)
        ps_base = random.uniform(1, 3)
        ev_ebitda_base = random.uniform(10, 18)
        peg_base = random.uniform(0.9, 1.6)
        
    elif sector == 'Energy':
        pe_base = random.uniform(8, 15)
        pb_base = random.uniform(1, 2.5)
        ps_base = random.uniform(0.5, 2)
        ev_ebitda_base = random.uniform(5, 12)
        peg_base = random.uniform(0.6, 1.3)
        
    elif sector == 'Basic Materials':
        pe_base = random.uniform(12, 20)
        pb_base = random.uniform(1.5, 3)
        ps_base = random.uniform(1, 2.5)
        ev_ebitda_base = random.uniform(7, 14)
        peg_base = random.uniform(0.7, 1.4)
        
    else:  # Default values for other sectors
        pe_base = random.uniform(15, 25)
        pb_base = random.uniform(2, 4)
        ps_base = random.uniform(1, 3)
        ev_ebitda_base = random.uniform(8, 16)
        peg_base = random.uniform(0.8, 1.5)
    
    # Adjust values based on price trend (higher growth companies often have higher multiples)
    price_trend = random.uniform(-0.2, 0.3)  # -20% to +30%
    pe_ratio = max(5, pe_base * (1 + price_trend))
    pb_ratio = max(0.5, pb_base * (1 + price_trend))
    ps_ratio = max(0.3, ps_base * (1 + price_trend))
    ev_ebitda = max(3, ev_ebitda_base * (1 + price_trend))
    peg_ratio = max(0.5, peg_base * (1 + 0.5 * price_trend))
    
    # Generate market cap (in crores)
    shares_outstanding = random.randint(100, 5000) * 1000000  # 100M to 5B shares
    market_cap = price * shares_outstanding
    
    # Financial health metrics
    debt_to_equity = 0
    current_ratio = 0
    quick_ratio = 0
    interest_coverage = 0
    
    # Set financial health metrics based on sector
    if sector == 'Information Technology':
        debt_to_equity = random.uniform(0.1, 0.8)
        current_ratio = random.uniform(1.8, 3.5)
        quick_ratio = random.uniform(1.5, 3.0)
        interest_coverage = random.uniform(10, 30)
        
    elif sector == 'Financial Services':
        debt_to_equity = random.uniform(1.5, 4.0)
        current_ratio = random.uniform(1.0, 1.5)
        quick_ratio = random.uniform(0.8, 1.3)
        interest_coverage = random.uniform(3, 10)
        
    elif sector == 'Healthcare':
        debt_to_equity = random.uniform(0.3, 1.2)
        current_ratio = random.uniform(1.5, 3.0)
        quick_ratio = random.uniform(1.2, 2.5)
        interest_coverage = random.uniform(8, 20)
        
    elif sector == 'Consumer Goods':
        debt_to_equity = random.uniform(0.3, 1.5)
        current_ratio = random.uniform(1.3, 2.5)
        quick_ratio = random.uniform(1.0, 2.0)
        interest_coverage = random.uniform(6, 15)
        
    elif sector == 'Energy':
        debt_to_equity = random.uniform(0.5, 2.0)
        current_ratio = random.uniform(1.2, 2.0)
        quick_ratio = random.uniform(0.9, 1.5)
        interest_coverage = random.uniform(4, 12)
        
    else:  # Default for other sectors
        debt_to_equity = random.uniform(0.3, 1.5)
        current_ratio = random.uniform(1.3, 2.5)
        quick_ratio = random.uniform(1.0, 2.0)
        interest_coverage = random.uniform(6, 15)
    
    # Calculate total debt and cash based on market cap and debt to equity
    equity = market_cap / (1 + debt_to_equity)
    total_debt = equity * debt_to_equity
    total_cash = market_cap * random.uniform(0.05, 0.2)  # 5-20% of market cap in cash
    
    # Cash flow metrics
    operating_cash_flow = market_cap * random.uniform(0.05, 0.15)  # 5-15% of market cap
    capex = operating_cash_flow * random.uniform(0.2, 0.5)  # 20-50% of operating cash flow
    free_cash_flow = operating_cash_flow - capex
    
    # Profitability metrics
    gross_margin = 0
    operating_margin = 0
    net_margin = 0
    ebitda_margin = 0
    
    # Set profitability metrics based on sector
    if sector == 'Information Technology':
        gross_margin = random.uniform(50, 80)
        operating_margin = random.uniform(20, 35)
        net_margin = random.uniform(15, 30)
        ebitda_margin = random.uniform(25, 40)
        
    elif sector == 'Financial Services':
        gross_margin = random.uniform(60, 85)
        operating_margin = random.uniform(25, 40)
        net_margin = random.uniform(15, 25)
        ebitda_margin = random.uniform(30, 45)
        
    elif sector == 'Healthcare':
        gross_margin = random.uniform(45, 75)
        operating_margin = random.uniform(15, 30)
        net_margin = random.uniform(10, 25)
        ebitda_margin = random.uniform(20, 35)
        
    elif sector == 'Consumer Goods':
        gross_margin = random.uniform(30, 50)
        operating_margin = random.uniform(8, 20)
        net_margin = random.uniform(5, 15)
        ebitda_margin = random.uniform(12, 25)
        
    elif sector == 'Energy':
        gross_margin = random.uniform(20, 40)
        operating_margin = random.uniform(8, 18)
        net_margin = random.uniform(5, 12)
        ebitda_margin = random.uniform(15, 25)
        
    else:  # Default for other sectors
        gross_margin = random.uniform(30, 60)
        operating_margin = random.uniform(10, 25)
        net_margin = random.uniform(8, 18)
        ebitda_margin = random.uniform(15, 30)
    
    # Return metrics
    roa = net_margin * random.uniform(0.5, 0.8)  # Return on Assets
    roe = roa * (1 + debt_to_equity)  # Return on Equity
    roic = operating_margin * random.uniform(0.6, 0.9)  # Return on Invested Capital
    
    # Growth metrics
    revenue_growth = random.uniform(-5, 30) if sector != 'Information Technology' else random.uniform(5, 40)
    earnings_growth = revenue_growth * random.uniform(0.8, 1.5)  # Earnings can grow faster or slower than revenue
    dividend_growth = earnings_growth * random.uniform(0.3, 0.8) if earnings_growth > 0 else 0
    
    # Long-term growth metrics
    revenue_cagr_5y = revenue_growth * random.uniform(0.6, 1.2)  # 5-year CAGR is a smoothed version of current growth
    eps_cagr_5y = earnings_growth * random.uniform(0.7, 1.3)
    
    # Dividend metrics
    dividend_yield = 0
    dividend_payout = 0
    
    # Set dividend metrics based on sector
    if sector == 'Information Technology':
        dividend_yield = random.uniform(0.5, 2.0)
        dividend_payout = random.uniform(10, 30)
        
    elif sector == 'Financial Services':
        dividend_yield = random.uniform(2.0, 5.0)
        dividend_payout = random.uniform(30, 60)
        
    elif sector == 'Healthcare':
        dividend_yield = random.uniform(1.0, 3.0)
        dividend_payout = random.uniform(20, 40)
        
    elif sector == 'Consumer Goods':
        dividend_yield = random.uniform(1.5, 4.0)
        dividend_payout = random.uniform(30, 50)
        
    elif sector == 'Energy':
        dividend_yield = random.uniform(3.0, 7.0)
        dividend_payout = random.uniform(40, 70)
        
    else:  # Default for other sectors
        dividend_yield = random.uniform(1.0, 3.5)
        dividend_payout = random.uniform(20, 50)
    
    # Dividend consistency (years of consecutive dividend payments)
    dividend_years = random.randint(0, 20)
    
    # Risk metrics
    beta = random.uniform(0.6, 1.5)
    volatility = random.uniform(15, 45)  # Annual volatility in percentage
    rsquared = random.uniform(0.3, 0.8)  # R-squared against market
    
    # Generate quarterly results for last 4 quarters
    quarterly_results = []
    base_quarterly_revenue = market_cap * random.uniform(0.02, 0.1)  # Quarterly revenue as % of market cap
    
    # Define quarters
    quarters = ["Q4 FY23", "Q1 FY24", "Q2 FY24", "Q3 FY24"]
    
    for i, quarter in enumerate(quarters):
        # Add some quarter-to-quarter growth
        quarter_growth = random.uniform(-0.05, 0.15)  # -5% to +15% QoQ growth
        quarter_revenue = base_quarterly_revenue * (1 + quarter_growth * i)
        quarter_profit = quarter_revenue * (net_margin / 100)
        quarter_eps = quarter_profit / shares_outstanding * 10000000  # EPS in rupees
        
        quarterly_results.append({
            "quarter": quarter,
            "revenue": quarter_revenue,
            "profit": quarter_profit,
            "eps": quarter_eps
        })
    
    # Generate 5-year historical data
    historical_data = []
    base_annual_revenue = quarterly_results[-1]["revenue"] * 4 * 0.85  # Annual revenue slightly less than 4x latest quarter
    
    for i in range(5):
        year = 2019 + i
        year_growth = revenue_cagr_5y / 100 * (1 + random.uniform(-0.3, 0.3))  # Add variation to the CAGR
        year_revenue = base_annual_revenue * (1 + year_growth) ** i
        year_profit = year_revenue * ((net_margin - random.uniform(-5, 5)) / 100)  # Margin can vary year to year
        year_eps = year_profit / (shares_outstanding * (1 - 0.02 * i))  # Slightly fewer shares in the past (buybacks)
        year_dividend = year_eps * (dividend_payout / 100)
        
        historical_data.append({
            "year": str(year),
            "revenue": year_revenue,
            "profit": year_profit,
            "eps": year_eps,
            "dividend": year_dividend if dividend_yield > 0 else 0
        })
    
    # Reverse to have most recent years last
    historical_data.reverse()
    
    # Analyst ratings
    buy_count = random.randint(0, 15)
    hold_count = random.randint(0, 10)
    sell_count = random.randint(0, 5)
    total_ratings = buy_count + hold_count + sell_count
    
    # Determine consensus based on ratings distribution
    if total_ratings > 0:
        if buy_count / total_ratings > 0.6:
            consensus = "Buy"
        elif sell_count / total_ratings > 0.4:
            consensus = "Sell"
        else:
            consensus = "Hold"
    else:
        consensus = "Hold"
    
    # Target price is typically +/- 20% from current price
    target_price_multiplier = 1.0
    if consensus == "Buy":
        target_price_multiplier = random.uniform(1.05, 1.25)
    elif consensus == "Sell":
        target_price_multiplier = random.uniform(0.75, 0.95)
    else:
        target_price_multiplier = random.uniform(0.9, 1.1)
    
    target_price = price * target_price_multiplier
    
    # Create the fundamentals object
    fundamentals = {
        "valuation": {
            "pe": pe_ratio,
            "pb": pb_ratio,
            "ps": ps_ratio,
            "peg": peg_ratio,
            "evToEbitda": ev_ebitda,
            "marketCap": market_cap
        },
        "financialHealth": {
            "debtToEquity": debt_to_equity,
            "currentRatio": current_ratio,
            "quickRatio": quick_ratio,
            "interestCoverage": interest_coverage,
            "totalDebt": total_debt,
            "totalCash": total_cash,
            "operatingCashFlow": operating_cash_flow,
            "freeCashFlow": free_cash_flow
        },
        "profitability": {
            "grossMargin": gross_margin,
            "operatingMargin": operating_margin,
            "netMargin": net_margin,
            "ebitdaMargin": ebitda_margin,
            "returnOnEquity": roe,
            "returnOnAssets": roa,
            "returnOnInvestedCapital": roic
        },
        "growth": {
            "revenueGrowth": revenue_growth,
            "earningsGrowth": earnings_growth,
            "dividendGrowth": dividend_growth,
            "5YrRevenueCAGR": revenue_cagr_5y,
            "5YrEPSCAGR": eps_cagr_5y
        },
        "dividend": {
            "yield": dividend_yield,
            "payout": dividend_payout,
            "years": dividend_years
        },
        "risks": {
            "beta": beta,
            "volatility": volatility,
            "rsquared": rsquared
        },
        "quarterlyResults": quarterly_results,
        "historicalData": historical_data,
        "analystRatings": {
            "consensus": consensus,
            "buy": buy_count,
            "hold": hold_count,
            "sell": sell_count,
            "targetPrice": target_price
        }
    }
    
    # Calculate a fundamental score based on the metrics
    fundamental_score = calculate_fundamental_score(fundamentals, sector)
    fundamentals["fundamental_score"] = fundamental_score
    
    return fundamentals

def calculate_fundamental_score(fundamentals, sector):
    """
    Calculate an overall fundamental score based on various metrics and the stock's sector
    """
    score = 50  # Start with a neutral score
    
    # Valuation component (lower is better)
    valuation = fundamentals["valuation"]
    if valuation["pe"] < sector_avg_pe(sector):
        score += 5
    elif valuation["pe"] > sector_avg_pe(sector) * 1.5:
        score -= 5
    
    if valuation["pb"] < sector_avg_pb(sector):
        score += 3
    elif valuation["pb"] > sector_avg_pb(sector) * 1.5:
        score -= 3
    
    if valuation["peg"] < 1:
        score += 5
    elif valuation["peg"] > 2:
        score -= 5
    
    # Financial health component
    health = fundamentals["financialHealth"]
    if health["debtToEquity"] < 0.5:
        score += 4
    elif health["debtToEquity"] > 2:
        score -= 4
    
    if health["currentRatio"] > 2:
        score += 3
    elif health["currentRatio"] < 1:
        score -= 5
    
    if health["freeCashFlow"] > 0:
        score += 5
    else:
        score -= 5
    
    # Profitability component
    profit = fundamentals["profitability"]
    if profit["returnOnEquity"] > 15:
        score += 5
    elif profit["returnOnEquity"] < 5:
        score -= 3
    
    if profit["netMargin"] > sector_avg_margin(sector):
        score += 4
    elif profit["netMargin"] < sector_avg_margin(sector) * 0.5:
        score -= 4
    
    # Growth component
    growth = fundamentals["growth"]
    if growth["revenueGrowth"] > 15:
        score += 5
    elif growth["revenueGrowth"] < 0:
        score -= 5
    
    if growth["earningsGrowth"] > 20:
        score += 6
    elif growth["earningsGrowth"] < 0:
        score -= 6
    
    # Dividend component
    dividend = fundamentals["dividend"]
    if dividend["yield"] > 3:
        score += 3
    
    if dividend["years"] > 10:
        score += 3
    
    # Analyst ratings component
    ratings = fundamentals["analystRatings"]
    if ratings["consensus"] == "Buy":
        score += 4
    elif ratings["consensus"] == "Sell":
        score -= 4
    
    # Risk adjustment
    risks = fundamentals["risks"]
    if risks["beta"] > 1.5:
        score -= 3
    elif risks["beta"] < 0.8:
        score += 2
    
    # Clamp the score to 0-100 range
    score = max(0, min(100, score))
    
    return score

def sector_avg_pe(sector):
    """Return average P/E ratio for a given sector"""
    sector_pe = {
        "Information Technology": 25,
        "Financial Services": 15,
        "Healthcare": 22,
        "Consumer Goods": 20,
        "Energy": 12,
        "Basic Materials": 16,
        "Unknown": 18
    }
    return sector_pe.get(sector, 18)

def sector_avg_pb(sector):
    """Return average P/B ratio for a given sector"""
    sector_pb = {
        "Information Technology": 5,
        "Financial Services": 1.5,
        "Healthcare": 4,
        "Consumer Goods": 3,
        "Energy": 1.5,
        "Basic Materials": 2,
        "Unknown": 2.5
    }
    return sector_pb.get(sector, 2.5)

def sector_avg_margin(sector):
    """Return average net margin for a given sector"""
    sector_margin = {
        "Information Technology": 20,
        "Financial Services": 22,
        "Healthcare": 18,
        "Consumer Goods": 10,
        "Energy": 8,
        "Basic Materials": 12,
        "Unknown": 15
    }
    return sector_margin.get(sector, 15)

def generate_recommendations(count=10):
    stocks = [
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
    ]
    
    result = []
    selected_stocks = random.sample(stocks, min(count, len(stocks)))
    
    for stock in selected_stocks:
        current_price = round(random.uniform(500, 5000), 2)
        change = round(random.uniform(-5, 5), 2)
        pred_change = round(random.uniform(-10, 15), 2)
        
        recommendation = {
            "symbol": stock["symbol"],
            "name": stock["name"],
            "sector": stock["sector"],
            "currentPrice": current_price,
            "change": change,
            "changePercent": round(change / current_price * 100, 2),
            "predictionChange": pred_change,
            "predictionTrend": "up" if pred_change > 0 else "down",
            "recommendationRating": random.choice(["Strong Buy", "Buy", "Hold", "Sell", "Strong Sell"]),
            "recommendationReason": random.choice([
                "Strong fundamentals and growth potential",
                "Undervalued compared to peers",
                "Positive earnings forecast",
                "Technical indicators suggest uptrend",
                "Sector outlook favorable",
                "Concerns about profitability",
                "Overvalued at current price",
                "Competitive pressures mounting",
            ])
        }
        
        result.append(recommendation)
    
    return result

def generate_portfolio():
    holdings = [
        {"symbol": "RELIANCE", "name": "Reliance Industries Ltd.", "sector": "Energy", "quantity": 10, "avgCost": 2500.50},
        {"symbol": "TCS", "name": "Tata Consultancy Services Ltd.", "sector": "IT", "quantity": 5, "avgCost": 3400.75},
        {"symbol": "HDFCBANK", "name": "HDFC Bank Ltd.", "sector": "Banking", "quantity": 15, "avgCost": 1600.25},
        {"symbol": "INFY", "name": "Infosys Ltd.", "sector": "IT", "quantity": 20, "avgCost": 1450.00},
    ]
    
    total_investment = 0
    total_value = 0
    
    for i, holding in enumerate(holdings):
        current_price = round(holding["avgCost"] * (1 + random.uniform(-0.2, 0.3)), 2)
        day_change_percent = round(random.uniform(-2, 2), 2)
        day_change = round(current_price * day_change_percent / 100, 2)
        
        invested_amount = holding["quantity"] * holding["avgCost"]
        current_value = holding["quantity"] * current_price
        
        holding["id"] = i + 1
        holding["currentPrice"] = current_price
        holding["dayChange"] = day_change_percent
        holding["dayChangePercent"] = day_change_percent
        holding["investedAmount"] = invested_amount
        holding["currentValue"] = current_value
        
        total_investment += invested_amount
        total_value += current_value
    
    day_change = round(random.uniform(-5000, 5000), 2)
    day_change_percent = round(day_change / total_value * 100, 2)
    overall_gain = total_value - total_investment
    overall_gain_percent = round(overall_gain / total_investment * 100, 2)
    
    result = {
        "holdings": holdings,
        "summary": {
            "totalInvestment": total_investment,
            "totalValue": total_value,
            "dayChange": day_change,
            "dayChangePercent": day_change_percent,
            "overallGain": overall_gain,
            "overallGainPercent": overall_gain_percent
        }
    }
    
    return result

def generate_portfolio_performance():
    days = 180
    today = datetime.now()
    result = []
    
    base_value = 100000
    value = base_value
    
    for i in range(days):
        date = today - timedelta(days=days-i-1)
        change = random.uniform(-0.015, 0.018)
        value = value * (1 + change)
        
        result.append({
            "date": date.strftime("%Y-%m-%d"),
            "value": round(value, 2)
        })
    
    return {"historicalValue": result}

def generate_top_gainers(limit=5):
    stocks = [
        {"symbol": "TATAMOTORS", "name": "Tata Motors Ltd.", "price": round(random.uniform(500, 1000), 2)},
        {"symbol": "BAJAJFINSV", "name": "Bajaj Finserv Ltd.", "price": round(random.uniform(1500, 2000), 2)},
        {"symbol": "ADANIPORTS", "name": "Adani Ports Ltd.", "price": round(random.uniform(800, 1200), 2)},
        {"symbol": "SBIN", "name": "State Bank of India", "price": round(random.uniform(400, 700), 2)},
        {"symbol": "HCLTECH", "name": "HCL Technologies Ltd.", "price": round(random.uniform(1000, 1500), 2)},
        {"symbol": "ULTRACEMCO", "name": "UltraTech Cement Ltd.", "price": round(random.uniform(7000, 9000), 2)},
        {"symbol": "TITAN", "name": "Titan Company Ltd.", "price": round(random.uniform(2500, 3000), 2)},
        {"symbol": "JSWSTEEL", "name": "JSW Steel Ltd.", "price": round(random.uniform(700, 900), 2)},
        {"symbol": "CIPLA", "name": "Cipla Ltd.", "price": round(random.uniform(900, 1200), 2)},
        {"symbol": "TECHM", "name": "Tech Mahindra Ltd.", "price": round(random.uniform(1100, 1400), 2)},
    ]
    
    result = []
    for stock in stocks[:limit]:
        changePercent = round(random.uniform(2, 10), 2)  # Gainers have positive change
        change = round(stock["price"] * changePercent / 100, 2)
        result.append({
            **stock,
            "change": change,
            "changePercent": changePercent
        })
    
    result.sort(key=lambda x: x["changePercent"], reverse=True)
    return result

def generate_top_losers(limit=5):
    stocks = [
        {"symbol": "MARUTI", "name": "Maruti Suzuki India Ltd.", "price": round(random.uniform(8000, 10000), 2)},
        {"symbol": "ASIANPAINT", "name": "Asian Paints Ltd.", "price": round(random.uniform(3000, 3500), 2)},
        {"symbol": "RELIANCE", "name": "Reliance Industries Ltd.", "price": round(random.uniform(2500, 2800), 2)},
        {"symbol": "BRITANNIA", "name": "Britannia Industries Ltd.", "price": round(random.uniform(4000, 4500), 2)},
        {"symbol": "NESTLEIND", "name": "Nestle India Ltd.", "price": round(random.uniform(20000, 22000), 2)},
        {"symbol": "POWERGRID", "name": "Power Grid Corporation", "price": round(random.uniform(200, 300), 2)},
        {"symbol": "NTPC", "name": "NTPC Ltd.", "price": round(random.uniform(150, 200), 2)},
        {"symbol": "ONGC", "name": "Oil & Natural Gas Corporation", "price": round(random.uniform(160, 220), 2)},
        {"symbol": "SUNPHARMA", "name": "Sun Pharmaceutical Industries", "price": round(random.uniform(900, 1100), 2)},
        {"symbol": "HINDUNILVR", "name": "Hindustan Unilever Ltd.", "price": round(random.uniform(2400, 2700), 2)},
    ]
    
    result = []
    for stock in stocks[:limit]:
        changePercent = round(random.uniform(-8, -2), 2)  # Losers have negative change
        change = round(stock["price"] * changePercent / 100, 2)
        result.append({
            **stock,
            "change": change,
            "changePercent": changePercent
        })
    
    result.sort(key=lambda x: x["changePercent"])
    return result

def generate_sector_performance():
    sectors = [
        {"name": "Information Technology", "changePercent": round(random.uniform(-3, 5), 2)},
        {"name": "Banking & Financial Services", "changePercent": round(random.uniform(-3, 5), 2)},
        {"name": "Oil & Gas", "changePercent": round(random.uniform(-3, 5), 2)},
        {"name": "Pharmaceuticals", "changePercent": round(random.uniform(-3, 5), 2)},
        {"name": "Automobile", "changePercent": round(random.uniform(-3, 5), 2)},
        {"name": "Consumer Goods", "changePercent": round(random.uniform(-3, 5), 2)},
        {"name": "Metal & Mining", "changePercent": round(random.uniform(-3, 5), 2)},
        {"name": "Telecommunications", "changePercent": round(random.uniform(-3, 5), 2)},
        {"name": "Power & Energy", "changePercent": round(random.uniform(-3, 5), 2)},
        {"name": "Real Estate", "changePercent": round(random.uniform(-3, 5), 2)},
    ]
    
    return sectors

def generate_market_overview():
    advances = random.randint(1200, 2000)
    declines = random.randint(800, 1800)
    unchanged = random.randint(100, 300)
    
    volume = random.randint(100000000, 500000000)
    volume_change = round(random.uniform(-10, 15), 2)
    
    sentiment = random.choice(["Bullish", "Moderately Bullish", "Neutral", "Moderately Bearish", "Bearish"])
    
    comment = random.choice([
        "Markets showing strong momentum as FII buying continues.",
        "Profit booking seen in IT and Banking stocks after recent rally.",
        "Global cues mixed, domestic factors driving market sentiment.",
        "Broad-based buying across sectors, small-caps outperforming.",
        "Investors cautious ahead of key economic data releases.",
        "Volatility increases as quarterly results season begins.",
    ])
    
    return {
        "advances": advances,
        "declines": declines,
        "unchanged": unchanged,
        "volume": volume,
        "volumeChange": volume_change,
        "sentiment": sentiment,
        "marketComment": comment,
        "lastUpdated": datetime.now().isoformat()
    }

def generate_stock_news(symbol, stock_details=None):
    """
    Generate realistic news articles for a given stock
    Returns a list of news articles with title, description, source, date, sentiment, and category
    """
    if stock_details is None:
        # Get the stock details if not provided
        stock_details = get_stock_details(symbol)
    
    if not stock_details:
        return []
    
    # Extract stock details for news generation
    company_name = stock_details.get('name', symbol)
    sector = stock_details.get('sector', 'Unknown')
    price = stock_details.get('price', 1000)
    change_percent = stock_details.get('change_percent', 0)
    
    # News sources
    sources = [
        {"name": "Economic Times", "id": "economic-times"},
        {"name": "Business Standard", "id": "business-standard"},
        {"name": "Mint", "id": "mint"},
        {"name": "CNBC-TV18", "id": "cnbc-tv18"},
        {"name": "Financial Express", "id": "financial-express"},
        {"name": "Bloomberg Quint", "id": "bloomberg-quint"},
        {"name": "Money Control", "id": "money-control"},
        {"name": "LiveMint", "id": "livemint"}
    ]
    
    # Generate dates within last 30 days
    now = datetime.now()
    dates = []
    for i in range(20):  # Generate 20 potential dates
        days_ago = random.randint(0, 30)
        date = now - timedelta(days=days_ago)
        dates.append(date.strftime('%Y-%m-%dT%H:%M:%S'))
    
    # Sort dates in descending order (most recent first)
    dates.sort(reverse=True)
    
    # Generate 8-15 news items
    num_news = random.randint(8, 15)
    news_items = []
    
    # 1. Earnings news (if any)
    if random.random() < 0.7:  # 70% chance of having earnings news
        beat_or_miss = random.choice(["beat", "miss", "meet"])
        eps_surprise_percent = random.uniform(-15, 20)
        
        if beat_or_miss == "beat":
            sentiment = "positive"
            title = f"{company_name} Q{random.randint(1,4)} Results: Beats Estimates, Profit Up {abs(eps_surprise_percent):.1f}%"
            description = f"{company_name} reported quarterly results that exceeded analyst expectations, with earnings per share {abs(eps_surprise_percent):.1f}% above consensus estimates. Revenue also came in stronger than anticipated, driven by {random.choice(['strong demand', 'new product launches', 'market expansion', 'improved pricing'])}"
        elif beat_or_miss == "miss":
            sentiment = "negative"
            title = f"{company_name} Q{random.randint(1,4)} Results: Misses Estimates, Profit Down {abs(eps_surprise_percent):.1f}%"
            description = f"{company_name} reported quarterly results that fell short of analyst expectations, with earnings per share {abs(eps_surprise_percent):.1f}% below consensus estimates. The company cited {random.choice(['challenging market conditions', 'rising input costs', 'supply chain disruptions', 'increased competition'])}"
        else:
            sentiment = "neutral"
            title = f"{company_name} Q{random.randint(1,4)} Results In Line With Estimates"
            description = f"{company_name} reported quarterly results that matched analyst expectations. The company reaffirmed its outlook for the remainder of the fiscal year, citing {random.choice(['stable market conditions', 'steady demand', 'operational efficiency', 'strategic initiatives'])}"
        
        news_items.append({
            "title": title,
            "description": description,
            "source": random.choice(sources)["name"],
            "date": dates.pop(0),  # Use the most recent date for earnings
            "url": f"https://example.com/news/{symbol.lower()}/earnings",
            "sentiment": sentiment,
            "category": "Earnings"
        })
    
    # 2. Analyst news (1-3 items)
    num_analyst_news = random.randint(1, 3)
    analysts = [
        "Morgan Stanley", "Goldman Sachs", "JP Morgan", "Nomura", "CLSA", 
        "UBS", "Bank of America", "Jefferies", "Citi", "Credit Suisse"
    ]
    
    rating_changes = [
        {"from": "Hold", "to": "Buy", "sentiment": "positive"},
        {"from": "Sell", "to": "Hold", "sentiment": "positive"},
        {"from": "Hold", "to": "Sell", "sentiment": "negative"},
        {"from": "Buy", "to": "Hold", "sentiment": "negative"},
        {"from": "Neutral", "to": "Overweight", "sentiment": "positive"},
        {"from": "Overweight", "to": "Neutral", "sentiment": "negative"},
        {"from": "Neutral", "to": "Underweight", "sentiment": "negative"},
        {"from": "Underweight", "to": "Neutral", "sentiment": "positive"},
    ]
    
    for _ in range(num_analyst_news):
        if random.random() < 0.6:  # 60% chance of rating change, 40% price target update
            # Rating change
            rating_change = random.choice(rating_changes)
            analyst = random.choice(analysts)
            title = f"{analyst} {rating_change['to'] if random.random() < 0.5 else 'Upgrades' if rating_change['sentiment'] == 'positive' else 'Downgrades'} {company_name}"
            description = f"{analyst} has revised its rating on {company_name} from {rating_change['from']} to {rating_change['to']}, citing {random.choice(['valuation concerns', 'growth outlook', 'sector trends', 'competitive positioning', 'management execution'])}"
            sentiment = rating_change["sentiment"]
        else:
            # Price target update
            analyst = random.choice(analysts)
            price_change_percent = random.uniform(-20, 30)
            new_target = price * (1 + price_change_percent / 100)
            sentiment = "positive" if price_change_percent > 0 else "negative"
            
            title = f"{analyst} {'Raises' if price_change_percent > 0 else 'Cuts'} {company_name} Price Target to ₹{new_target:.2f}"
            description = f"{analyst} has {'raised' if price_change_percent > 0 else 'lowered'} its price target on {company_name} to ₹{new_target:.2f} from ₹{price:.2f}, representing a {abs(price_change_percent):.1f}% {'increase' if price_change_percent > 0 else 'decrease'}. The firm cited {random.choice(['strong fundamentals', 'potential headwinds', 'changing market dynamics', 'valuation adjustment', 'growth prospects'])}"
        
        news_items.append({
            "title": title,
            "description": description,
            "source": random.choice(sources)["name"],
            "date": dates.pop(0),
            "url": f"https://example.com/news/{symbol.lower()}/analyst",
            "sentiment": sentiment,
            "category": "Analyst"
        })
    
    # 3. Company events/announcements (2-4 items)
    num_company_news = random.randint(2, 4)
    company_events = [
        {"event": "dividend", "sentiment": "positive", 
         "title": f"{company_name} Announces Dividend of ₹{random.randint(2, 20)} Per Share",
         "desc": f"{company_name} has announced a dividend of ₹{random.randint(2, 20)} per share, payable to shareholders of record as of {(now + timedelta(days=random.randint(10, 30))).strftime('%B %d, %Y')}"},
        
        {"event": "buyback", "sentiment": "positive", 
         "title": f"{company_name} Approves Share Buyback Program Worth ₹{random.randint(500, 10000)} Crore",
         "desc": f"The board of {company_name} has approved a share buyback program worth ₹{random.randint(500, 10000)} crore at a price of up to ₹{price * random.uniform(1.1, 1.4):.2f} per share, representing a premium of {random.uniform(10, 40):.1f}% to the current market price"},
        
        {"event": "expansion", "sentiment": "positive", 
         "title": f"{company_name} Announces Expansion into {random.choice(['International Markets', 'New Product Categories', 'Digital Solutions', 'Retail Segment'])}",
         "desc": f"{company_name} has announced plans to expand its presence in {random.choice(['international markets', 'new product categories', 'digital solutions', 'the retail segment'])}, investing ₹{random.randint(100, 5000)} crore over the next {random.randint(3, 5)} years"},
        
        {"event": "acquisition", "sentiment": "neutral", 
         "title": f"{company_name} Acquires {random.choice(['Startup', 'Rival', 'Tech Firm', 'Manufacturing Unit'])} for ₹{random.randint(100, 5000)} Crore",
         "desc": f"{company_name} has announced the acquisition of a {random.choice(['startup', 'rival company', 'technology firm', 'manufacturing unit'])} for ₹{random.randint(100, 5000)} crore, which is expected to {random.choice(['enhance product offerings', 'expand market reach', 'improve operational efficiency', 'drive innovation'])}"},
        
        {"event": "management", "sentiment": "neutral", 
         "title": f"{company_name} Appoints New {random.choice(['CEO', 'CFO', 'CTO', 'COO'])}",
         "desc": f"{company_name} has announced the appointment of a new {random.choice(['CEO', 'CFO', 'CTO', 'COO'])}, effective from {(now + timedelta(days=random.randint(0, 60))).strftime('%B %d, %Y')}. The new executive brings experience from {random.choice(['leading industry firms', 'global corporations', 'technology companies', 'financial institutions'])}"},
        
        {"event": "capex", "sentiment": "positive", 
         "title": f"{company_name} Announces ₹{random.randint(1000, 10000)} Crore Capital Expenditure Plan",
         "desc": f"{company_name} has announced a capital expenditure plan of ₹{random.randint(1000, 10000)} crore for the next {random.randint(2, 5)} years, focusing on {random.choice(['capacity expansion', 'modernization', 'digital transformation', 'research and development'])}"},
        
        {"event": "restructuring", "sentiment": "neutral", 
         "title": f"{company_name} Announces Business Restructuring Plan",
         "desc": f"{company_name} has announced a comprehensive business restructuring plan aimed at {random.choice(['improving operational efficiency', 'focusing on core businesses', 'reducing costs', 'enhancing shareholder value'])}"}
    ]
    
    selected_events = random.sample(company_events, min(num_company_news, len(company_events)))
    
    for event in selected_events:
        news_items.append({
            "title": event["title"],
            "description": event["desc"],
            "source": random.choice(sources)["name"],
            "date": dates.pop(0),
            "url": f"https://example.com/news/{symbol.lower()}/company",
            "sentiment": event["sentiment"],
            "category": "Company"
        })
    
    # 4. Sector news (2-3 items)
    num_sector_news = random.randint(2, 3)
    
    # Sector-specific news templates
    sector_news_templates = {
        "Information Technology": [
            {"title": "Indian IT Sector Faces {Trend} Amid Global Tech {Direction}",
             "desc": "The Indian IT sector is experiencing {trend} as global technology spending {direction}. Companies like {company_name} are {adapting} to these changes through {strategy}",
             "trends": ["growth", "challenges", "transformation", "talent competition"],
             "directions": ["accelerates", "slows down", "shifts focus", "embraces AI"],
             "adaptations": ["quickly adapting", "strategically responding", "carefully navigating", "aggressively expanding"],
             "strategies": ["digital transformation initiatives", "cost optimization services", "cloud migration offerings", "AI and automation solutions"]},
            
            {"title": "Tech Talent {Trend} Impacts Margins for IT Firms like {Company}",
             "desc": "The {trend} in technology talent acquisition is impacting profit margins for IT service providers. {company_name} has reported {impact} in its recent financial results, as the company {action}",
             "trends": ["shortage", "war", "attrition", "cost inflation"],
             "impacts": ["margin pressure", "increasing costs", "hiring challenges", "productivity concerns"],
             "actions": ["increases employee compensation", "expands fresher hiring", "implements retention programs", "accelerates automation"]}
        ],
        
        "Financial Services": [
            {"title": "Banking Sector {Trend} as RBI {Action} Interest Rates",
             "desc": "India's banking sector is witnessing {trend} after the Reserve Bank of India {action} interest rates by {amount} basis points. Financial institutions like {company_name} are expected to {impact}",
             "trends": ["growth", "pressure", "consolidation", "transformation"],
             "actions": ["raises", "maintains", "cuts", "signals future changes in"],
             "amounts": ["25", "50", "unchanged", "75"],
             "impacts": ["see expanded margins", "face margin pressure", "accelerate retail lending", "focus on asset quality"]},
            
            {"title": "Digital Banking {Trend} Reshapes Financial Services Landscape",
             "desc": "The rapid {trend} of digital banking is transforming India's financial services sector. {company_name} has {response} with its {initiative} to {goal}",
             "trends": ["adoption", "growth", "expansion", "innovation"],
             "responses": ["responded aggressively", "invested significantly", "partnered strategically", "launched initiatives"],
             "initiatives": ["mobile banking platforms", "UPI payment services", "digital lending solutions", "fintech partnerships"],
             "goals": ["enhance customer experience", "expand market reach", "reduce operational costs", "counter competition from new entrants"]}
        ],
        
        # Default news templates for other sectors
        "default": [
            {"title": "Indian {Sector} Sector Sees {Trend} Amid {Factor}",
             "desc": "The Indian {sector} sector is experiencing {trend} due to {factor}. Companies like {company_name} are {response} to navigate these market conditions",
             "trends": ["growth", "challenges", "consolidation", "innovation"],
             "factors": ["changing consumer preferences", "regulatory developments", "global market shifts", "technological advancements"],
             "responses": ["adapting strategies", "investing in capabilities", "focusing on efficiency", "expanding product offerings"]},
            
            {"title": "{Factor} Expected to Drive {Trend} in {Sector} Sector",
             "desc": "{factor} is projected to drive {trend} in the {sector} sector over the coming quarters. {company_name} is positioned to {impact} from this development",
             "factors": ["Government policies", "Infrastructure spending", "Consumer demand", "Export opportunities"],
             "trends": ["growth", "consolidation", "margin improvement", "capacity expansion"],
             "impacts": ["benefit", "face headwinds", "see mixed impact", "capitalize on opportunities"]}
        ]
    }
    
    # Get sector-specific templates or default if not found
    sector_templates = sector_news_templates.get(sector, sector_news_templates["default"])
    
    for _ in range(num_sector_news):
        template = random.choice(sector_templates)
        
        # Fill in template variables
        if sector in sector_news_templates:
            if "trend" in template["title"].lower():
                trend = random.choice(template.get("trends", ["growth", "challenges"]))
                title = template["title"].replace("{Trend}", trend.title()).replace("{trend}", trend)
                title = title.replace("{Company}", company_name).replace("{company_name}", company_name)
            else:
                title = template["title"]
            
            # Replace other variables in the title
            for var in ["Direction", "Action", "Factor"]:
                if "{" + var + "}" in title:
                    var_values = template.get(var.lower() + "s", ["positive", "negative"])
                    title = title.replace("{" + var + "}", random.choice(var_values))
            
            # Replace all remaining variables
            title = title.replace("{Sector}", sector).replace("{sector}", sector.lower())
            title = title.replace("{Company}", company_name).replace("{company_name}", company_name)
            
            # Build description with template variables
            desc = template["desc"]
            for key in template:
                if key != "title" and key != "desc":
                    if "{" + key + "}" in desc:
                        desc = desc.replace("{" + key + "}", random.choice(template[key]))
            
            desc = desc.replace("{Sector}", sector).replace("{sector}", sector.lower())
            desc = desc.replace("{Company}", company_name).replace("{company_name}", company_name)
            
        else:
            # Simple fallback for sectors without templates
            title = f"{sector} Sector Outlook: Impact on {company_name} and Peers"
            desc = f"Analysis of recent trends in the {sector} sector and their potential impact on companies like {company_name}. Industry experts project {random.choice(['positive', 'mixed', 'challenging'])} conditions in the coming quarters."
        
        # Determine sentiment based on content
        if any(word in title.lower() + desc.lower() for word in ["growth", "positive", "expansion", "benefit", "opportunity"]):
            sentiment = "positive"
        elif any(word in title.lower() + desc.lower() for word in ["challenges", "pressure", "headwinds", "slowdown"]):
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        news_items.append({
            "title": title,
            "description": desc,
            "source": random.choice(sources)["name"],
            "date": dates.pop(0),
            "url": f"https://example.com/news/{symbol.lower()}/sector",
            "sentiment": sentiment,
            "category": "Sector"
        })
    
    # 5. Market/general news (1-3 items)
    num_market_news = random.randint(1, 3)
    market_news = [
        {"title": "Sensex, Nifty End {Direction} Amid {Factor}; {company_name} Among {Performers}",
         "desc": "Indian equity benchmarks ended {direction} today, with the Sensex {changing} {points} points and Nifty {changing} {nifty_points} points. {company_name} was among the {performers} stocks, {stock_movement}",
         "directions": ["Higher", "Lower", "Flat"],
         "factors": ["Global Cues", "Profit-Booking", "Buying Interest", "Sectoral Rotation"],
         "performers": ["top-performing", "worst-performing", "most active", "volatile"],
         "stock_directions": ["gaining", "losing", "surging", "declining"],
         "percentages": ["1-2%", "2-3%", "3-4%", "0.5-1%"]},
        
        {"title": "FII {Action} Continues; {sector} Stocks Like {company_name} {Impact}",
         "desc": "Foreign Institutional Investors (FIIs) continued their {action} streak in Indian markets, with net {action} of ₹{amount} crore. {sector} stocks like {company_name} {impact} as {reason}",
         "actions": ["buying", "selling"],
         "amounts": ["1,000-2,000", "2,000-5,000", "5,000-8,000", "8,000-10,000"],
         "impacts": ["benefited", "saw pressure", "attracted interest", "witnessed volatility"],
         "reasons": ["sectoral rotation continued", "global funds adjusted portfolios", "risk appetite changed", "liquidity conditions shifted"]},
        
        {"title": "Market Volatility {Trend} as {Factor} Concerns {Action}",
         "desc": "Market volatility has {trend} as concerns over {factor} {action}. Stocks across sectors experienced {impact}, with {company_name} {stock_impact}",
         "trends": ["increased", "eased", "persisted", "returned"],
         "factors": ["inflation", "interest rates", "global growth", "geopolitical tensions"],
         "actions": ["intensified", "eased", "remained elevated", "shifted focus"],
         "impacts": ["mixed movements", "broad-based selling", "selective buying", "heightened trading activity"],
         "stock_impacts": ["showing resilience", "facing selling pressure", "attracting value buying", "moving in line with sector"]}
    ]
    
    for _ in range(num_market_news):
        template = random.choice(market_news)
        
        # Fill in template variables for title
        title = template["title"]
        direction = random.choice(template.get("directions", ["Higher", "Lower"]))
        title = title.replace("{Direction}", direction)
        title = title.replace("{company_name}", company_name)
        
        for var in ["Factor", "Performers"]:
            if "{" + var + "}" in title:
                var_values = template.get(var.lower() + "s", ["positive", "negative"])
                title = title.replace("{" + var + "}", random.choice(var_values))
        
        # Fill in template variables for description
        desc = template["desc"]
        desc = desc.replace("{direction}", direction.lower())
        desc = desc.replace("{company_name}", company_name)
        
        changing = "rising by" if direction == "Higher" else "falling by" if direction == "Lower" else "moving"
        desc = desc.replace("{changing}", changing)
        
        points = random.randint(100, 800)
        nifty_points = random.randint(30, 250)
        desc = desc.replace("{points}", str(points))
        desc = desc.replace("{nifty_points}", str(nifty_points))
        
        # Replace other variables in the description
        for key in template:
            if key not in ["title", "desc", "directions"]:
                if "{" + key + "}" in desc:
                    desc = desc.replace("{" + key + "}", random.choice(template[key]))
        
        # Replace specific variables
        if "{stock_movement}" in desc:
            stock_direction = random.choice(template.get("stock_directions", ["gaining", "losing"]))
            percentage = random.choice(template.get("percentages", ["1-2%", "2-3%"]))
            desc = desc.replace("{stock_movement}", f"{stock_direction} {percentage} in the session")
        
        # Determine sentiment based on content for market news
        if direction == "Higher" or "gaining" in desc or "surging" in desc or "benefited" in desc:
            sentiment = "positive"
        elif direction == "Lower" or "losing" in desc or "declining" in desc or "pressure" in desc:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        news_items.append({
            "title": title,
            "description": desc,
            "source": random.choice(sources)["name"],
            "date": dates.pop(0),
            "url": f"https://example.com/news/{symbol.lower()}/market",
            "sentiment": sentiment,
            "category": "Market"
        })
    
    # Ensure we have at least the minimum number of news items
    while len(news_items) < num_news and dates:
        # Add more generic news if needed
        title = f"{company_name} {random.choice(['Shares', 'Stock', 'Shares'])}: {random.choice(['What to Expect', 'Analyst Views', 'Market Outlook', 'Performance Review'])}"
        desc = f"A detailed look at {company_name}'s recent performance and outlook. {random.choice(['Analysts remain divided on its future prospects.', 'The company continues to focus on its core business segments.', 'Recent market trends suggest cautious optimism for the stock.', 'Investors are closely watching developments in the sector.'])}"
        
        sentiment = random.choice(["positive", "negative", "neutral"])
        
        news_items.append({
            "title": title,
            "description": desc,
            "source": random.choice(sources)["name"],
            "date": dates.pop(0),
            "url": f"https://example.com/news/{symbol.lower()}/general",
            "sentiment": sentiment,
            "category": "General"
        })
    
    # Sort all news by date (most recent first)
    news_items.sort(key=lambda x: x["date"], reverse=True)
    
    # Limit to the number of news items we want
    return news_items[:num_news]


@app.route('/api/stock_news/<symbol>', methods=['GET'])
def get_stock_news_articles(symbol):
    """
    Get news articles for a specific stock
    """
    # Get the stock details
    stock_details = get_stock_details(symbol)
    if not stock_details:
        return jsonify({"error": "Stock not found"}), 404
    
    # Generate news for the stock
    news = generate_stock_news(symbol, stock_details)
    
    return jsonify({
        "symbol": symbol,
        "name": stock_details.get("name", symbol),
        "news": news
    })

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/api/search', methods=['GET'])
def search_stocks():
    query = request.args.get('query', '').lower()
    
    if not query:
        return jsonify([])
    
    results = [stock for stock in INDIAN_STOCKS if query in stock["symbol"].lower() or query in stock["name"].lower()]
    return jsonify(results)

@app.route('/api/market/indices', methods=['GET'])
def get_market_indices():
    return jsonify(generate_market_indices())

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    count = int(request.args.get('count', 5))
    return jsonify(generate_recommendations(count))

@app.route('/api/stock/<symbol>/historical', methods=['GET'])
def get_historical_data(symbol):
    days = int(request.args.get('days', 365))
    return jsonify(generate_stock_price_history(symbol, days))

@app.route('/api/stock/<symbol>/predict', methods=['GET'])
def predict_stock(symbol):
    days = int(request.args.get('days', 30))
    return jsonify(generate_prediction(symbol, days))

@app.route('/api/stock/<symbol>', methods=['GET'])
def get_stock_details(symbol):
    # Find stock details from our database
    stock = next((s for s in INDIAN_STOCKS if s["symbol"] == symbol), None)
    if not stock:
        return jsonify({"error": "Stock not found"}), 404
    
    # Generate a consistent price based on the symbol
    symbol_hash = sum(ord(c) for c in symbol)
    price = round(500 + (symbol_hash % 3000) + random.uniform(-50, 50), 2)
    change = round(random.uniform(-50, 50), 2)
    change_percent = round(change / price * 100, 2)
    
    # Get pre-defined recommendation if available
    recommendation = STOCK_RECOMMENDATIONS.get(symbol)
    
    # If not available, generate based on metrics
    if not recommendation:
        pe_ratio = round(random.uniform(15, 40), 2)
        
        if change_percent > 2 and pe_ratio < 25:
            rating = "Buy"
            reasons = [
                "Positive price momentum",
                "Attractive valuation metrics",
                "Sector outlook favorable"
            ]
            strength = random.randint(65, 80)
        elif change_percent < -2 and pe_ratio > 30:
            rating = "Sell"
            reasons = [
                "Negative price momentum",
                "Valuation concerns",
                "Technical indicators bearish"
            ]
            strength = random.randint(65, 80)
        else:
            rating = "Hold"
            reasons = [
                "Mixed price signals",
                "Fair valuation at current levels",
                "Wait for clearer direction"
            ]
            strength = random.randint(50, 65)
            
        recommendation = {
            "rating": rating,
            "reasons": reasons,
            "strength": strength
        }
    
    # Add timestamp to recommendation
    recommendation["updated"] = datetime.now().isoformat()
    
    # Calculate appropriate price values for Reliance
    day_high = round(price * (1 + random.uniform(0, 0.02)), 2)
    day_low = round(price * (1 - random.uniform(0, 0.02)), 2)
    
    result = {
        "symbol": symbol,
        "name": stock["name"],
        "exchange": stock["exchange"],
        "sector": stock["sector"],
        "industry": stock.get("industry", "General"),
        "description": f"Leading company in the {stock['sector']} sector.",
        "price": price,
        "currentPrice": price,  # Alias for components expecting this property name
        "change": change,
        "changePercent": change_percent,
        "open": round(price * (1 - random.uniform(0, 0.01)), 2),
        "high": day_high,
        "low": day_low,
        "dayHigh": day_high,  # Alias for components expecting this property name
        "dayLow": day_low,    # Alias for components expecting this property name
        "previousClose": round(price - change, 2),
        "volume": round(random.uniform(1000000, 10000000)),
        "marketCap": round(price * random.uniform(100000000, 1000000000), 2),
        "pe": round(random.uniform(15, 40), 2),
        "eps": round(random.uniform(20, 100), 2),
        "beta": round(0.5 + random.uniform(0, 1.5), 2),
        "yearHigh": round(price * 1.2, 2),
        "yearLow": round(price * 0.8, 2),
        "avgVolume": round(random.uniform(800000, 8000000)),
        "dividend_yield": round(random.uniform(0.5, 5), 2),
        "recommendation": recommendation
    }
    
    return jsonify(result)

@app.route('/api/stock/<symbol>/fundamentals', methods=['GET'])
def get_stock_fundamentals(symbol):
    return jsonify(generate_fundamentals(symbol))

@app.route('/api/portfolio', methods=['GET'])
def get_portfolio():
    return jsonify(generate_portfolio())

@app.route('/api/portfolio/performance', methods=['GET'])
def get_portfolio_performance():
    return jsonify(generate_portfolio_performance())

@app.route('/api/market/top-gainers', methods=['GET'])
def get_top_gainers():
    limit = int(request.args.get('limit', 5))
    return jsonify(generate_top_gainers(limit))

@app.route('/api/market/top-losers', methods=['GET'])
def get_top_losers():
    limit = int(request.args.get('limit', 5))
    return jsonify(generate_top_losers(limit))

@app.route('/api/market/sector-performance', methods=['GET'])
def get_sector_performance():
    return jsonify(generate_sector_performance())

@app.route('/api/market/overview', methods=['GET'])
def get_market_overview():
    return jsonify(generate_market_overview())

@app.route('/api/stocks/list', methods=['GET'])
def get_stocks_list():
    """Return the full list of available stocks"""
    return jsonify(INDIAN_STOCKS)

@app.route('/api/fundamental/screener', methods=['GET'])
def fundamental_screener():
    """Filter stocks based on fundamental criteria"""
    min_pe = float(request.args.get('min_pe', 0))
    max_pe = float(request.args.get('max_pe', 100))
    min_market_cap = float(request.args.get('min_market_cap', 0))
    sector = request.args.get('sector', None)
    
    results = []
    
    for stock in INDIAN_STOCKS:
        # Only apply sector filter if specified
        if sector and stock["sector"] != sector:
            continue
            
        # Generate consistent fundamentals for screening
        symbol_hash = sum(ord(c) for c in stock["symbol"])
        price = 500 + (symbol_hash % 3000)
        market_cap = price * (10000000 + (symbol_hash % 100000000))
        pe = 15 + (symbol_hash % 25)
        
        if pe < min_pe or pe > max_pe:
            continue
            
        if market_cap < min_market_cap:
            continue
            
        results.append({
            **stock,
            "price": price,
            "marketCap": market_cap,
            "pe": pe,
            "dividendYield": round(1 + (symbol_hash % 400) / 100, 2)
        })
    
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 