from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import json
from datetime import datetime, timedelta
import time
# Import enhanced market data functions
from market_data import (
    generate_enhanced_market_overview,
    generate_realistic_index_values,
    generate_detailed_sector_performance,
    generate_market_breadth,
    generate_market_movers,
    generate_market_sentiment
)

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
    """Generate data for the major market indices with real-time-like data"""
    # Set seed for consistency in a single request but variation between requests
    current_timestamp = int(datetime.now().timestamp())
    random.seed(current_timestamp // 60)  # Change every minute
    
    # List of major Indian market indices with realistic values
    indices = [
        {
            "symbol": "NIFTY50",
            "name": "NIFTY 50",
            "value": round(22000 + random.uniform(-500, 500), 2),
            "type": "Broad Market"
        },
        {
            "symbol": "SENSEX",
            "name": "BSE SENSEX",
            "value": round(72000 + random.uniform(-1000, 1000), 2),
            "type": "Broad Market"
        },
        {
            "symbol": "NIFTYBANK",
            "name": "NIFTY Bank",
            "value": round(48000 + random.uniform(-500, 500), 2),
            "type": "Sectoral"
        },
        {
            "symbol": "NIFTYIT",
            "name": "NIFTY IT",
            "value": round(33000 + random.uniform(-500, 500), 2),
            "type": "Sectoral"
        },
        {
            "symbol": "NIFTYFMCG",
            "name": "NIFTY FMCG",
            "value": round(55000 + random.uniform(-500, 500), 2),
            "type": "Sectoral"
        },
        {
            "symbol": "NIFTYPHARMA",
            "name": "NIFTY Pharma",
            "value": round(16000 + random.uniform(-300, 300), 2),
            "type": "Sectoral"
        },
        {
            "symbol": "NIFTYAUTO",
            "name": "NIFTY Auto",
            "value": round(19000 + random.uniform(-300, 300), 2),
            "type": "Sectoral"
        },
        {
            "symbol": "NIFTYMETAL",
            "name": "NIFTY Metal",
            "value": round(8000 + random.uniform(-200, 200), 2),
            "type": "Sectoral"
        }
    ]
    
    # Format timestamp for "just now" feeling
    current_time = datetime.now()
    formatted_timestamp = current_time.strftime("%Y-%m-%dT%H:%M:%S")
    
    # Add change data to each index
    for idx in indices:
        # Generate consistent changes based on the symbol and current timestamp
        symbol_hash = sum(ord(c) for c in idx["symbol"]) + (current_timestamp % 100)
        
        # Create more realistic trend based on symbol hash and time
        trend_direction = 1 if symbol_hash % 5 != 0 else -1  # 80% positive, 20% negative
        
        # Calculate a more realistic change percentage
        base_volatility = 0.05 + (symbol_hash % 10) / 100  # 0.05% to 0.15% base volatility
        change_percent = round(random.uniform(0.05, 1.2) * trend_direction, 2)
        change = round(idx["value"] * change_percent / 100, 2)
        
        # Add all required fields
        idx["change"] = change
        idx["changePercent"] = change_percent
        idx["previousClose"] = round(idx["value"] - change, 2)
        idx["open"] = round(idx["previousClose"] + random.uniform(-0.5, 0.5) * abs(change), 2)
        idx["high"] = round(max(idx["value"], idx["open"]) + random.uniform(0, 0.3) * abs(change), 2)
        idx["low"] = round(min(idx["value"], idx["open"]) - random.uniform(0, 0.3) * abs(change), 2)
        idx["volume"] = round(random.uniform(100000000, 500000000))
        
        # Ensure the price field is included (this is what the frontend expects)
        idx["price"] = idx["value"]
        idx["lastUpdated"] = formatted_timestamp
    
    # Reset random seed
    random.seed()
    
    return indices

@app.route('/api/market/indices', methods=['GET'])
def get_market_indices():
    """Get real-time data for the major market indices"""
    return jsonify(generate_market_indices())

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
    Get news articles for a specific stock (alternate endpoint)
    """
    return get_stock_news(symbol)

@app.route('/api/stock/<symbol>/news', methods=['GET'])
def get_stock_news(symbol):
    """
    Get news articles for a specific stock
    """
    # Handle undefined symbol case with more robust checking
    if symbol is None or symbol.lower() == "undefined" or not symbol or symbol.strip() == "":
        print(f"Undefined symbol requested: '{symbol}', returning default news data")
        # Return default NIFTY news
        return jsonify({
            "symbol": "NIFTY",
            "name": "NIFTY 50 Index",
            "news": [
                {
                    "title": "Nifty closes at record high as global markets rally",
                    "description": "The Nifty 50 index reached an all-time high yesterday, driven by strong global cues and domestic economic indicators.",
                    "date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
                    "source": "Financial Times",
                    "url": "https://example.com/news/1",
                    "sentiment": "positive",
                    "category": "Market"
                },
                {
                    "title": "Foreign investors pour money into Indian markets as Nifty outperforms global peers",
                    "description": "Foreign institutional investors have been net buyers in the Indian market, with particular interest in banking and technology sectors.",
                    "date": (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d"),
                    "source": "Economic Times",
                    "url": "https://example.com/news/2",
                    "sentiment": "positive",
                    "category": "Market"
                },
                {
                    "title": "Technical Analysis: Nifty shows strong momentum, key resistance levels to watch",
                    "description": "Technical indicators for the Nifty suggest continued bullish momentum with key resistance levels identified at higher points.",
                    "date": (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d"),
                    "source": "Market Analysis",
                    "url": "https://example.com/news/3",
                    "sentiment": "neutral",
                    "category": "Technical"
                }
            ]
        })
    
    # Get the stock details
    stock_details = next((s for s in INDIAN_STOCKS if s["symbol"] == symbol), None)
    if not stock_details:
        print(f"Stock not found: '{symbol}', returning default news data")
        # Return the same default news as above
        return jsonify({
            "symbol": "NIFTY",
            "name": "NIFTY 50 Index",
            "news": [
                {
                    "title": "Nifty closes at record high as global markets rally",
                    "description": "The Nifty 50 index reached an all-time high yesterday, driven by strong global cues and domestic economic indicators.",
                    "date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
                    "source": "Financial Times",
                    "url": "https://example.com/news/1",
                    "sentiment": "positive",
                    "category": "Market"
                },
                {
                    "title": "Foreign investors pour money into Indian markets as Nifty outperforms global peers",
                    "description": "Foreign institutional investors have been net buyers in the Indian market, with particular interest in banking and technology sectors.",
                    "date": (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d"),
                    "source": "Economic Times",
                    "url": "https://example.com/news/2",
                    "sentiment": "positive",
                    "category": "Market"
                },
                {
                    "title": "Technical Analysis: Nifty shows strong momentum, key resistance levels to watch",
                    "description": "Technical indicators for the Nifty suggest continued bullish momentum with key resistance levels identified at higher points.",
                    "date": (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d"),
                    "source": "Market Analysis",
                    "url": "https://example.com/news/3",
                    "sentiment": "neutral",
                    "category": "Technical"
                }
            ]
        })
    
    # Generate news for the stock
    news = generate_stock_news(symbol, stock_details)
    
    # Ensure news is always an array
    if news is None:
        news = []
    
    return jsonify({
        "symbol": symbol,
        "name": stock_details.get("name", symbol),
        "news": news
    })

@app.route('/api/stock/<symbol>/fundamentals', methods=['GET'])
def get_stock_fundamentals(symbol):
    """
    Get fundamental data for a specific stock
    """
    # Handle undefined symbol case
    if symbol == "undefined" or not symbol or symbol.lower() == "undefined":
        print(f"Undefined symbol requested, returning default fundamentals data")
        # Return default NIFTY fundamentals
        return jsonify({
            "symbol": "NIFTY",
            "name": "NIFTY 50 Index",
            "sector": "Index",
            "summary": {
                "marketCap": "N/A (Index)",
                "peRatio": 22.5,
                "dividendYield": 1.35,
                "roe": 15.8,
                "debtToEquity": 0.70,
                "currentRatio": 1.27,
                "quickRatio": 0.98
            }
        })
    
    # Find stock details from our database
    stock = next((s for s in INDIAN_STOCKS if s["symbol"] == symbol), None)
    if not stock:
        print(f"Stock not found: {symbol}, returning default fundamentals data")
        # Return default NIFTY fundamentals
        return jsonify({
            "symbol": "NIFTY",
            "name": "NIFTY 50 Index",
            "sector": "Index",
            "summary": {
                "marketCap": "N/A (Index)",
                "peRatio": 22.5,
                "dividendYield": 1.35,
                "roe": 15.8,
                "debtToEquity": 0.70,
                "currentRatio": 1.27,
                "quickRatio": 0.98
            }
        })
    
    # Generate a consistent price based on the symbol
    symbol_hash = sum(ord(c) for c in symbol)
    price = round(500 + (symbol_hash % 3000) + random.uniform(-50, 50), 2)
    change = round(random.uniform(-50, 50), 2)
    change_percent = round(change / price * 100, 2)
    
    # Create stock details object
    stock_details = {
        "symbol": symbol,
        "name": stock["name"],
        "sector": stock["sector"],
        "price": price,
        "change": change,
        "change_percent": change_percent
    }
    
    # Generate fundamentals with the stock details
    fundamentals = generate_fundamentals(symbol, stock_details)
    
    return jsonify(fundamentals)

def generate_default_stock_details():
    """Generate default stock details for NIFTY when symbol is not found or undefined"""
    # Default stock information
    default_symbol = "NIFTY"
    default_name = "NIFTY 50 Index"
    default_exchange = "NSE"
    default_sector = "Index"
    default_industry = "Market Index"
    
    # Generate a consistent price
    price = 22500.75
    change = 125.50
    change_percent = 0.56
    
    # Default recommendation
    recommendation = {
        "rating": "Buy",
        "reasons": [
            "Strong momentum in index heavyweights",
            "Positive domestic economic indicators",
            "Technical indicators show bullish bias"
        ],
        "strength": 75,
        "updated": datetime.now().isoformat()
    }
    
    # Price values
    day_high = 22580.25
    day_low = 22420.80
    
    # Enhanced company information
    detailed_description = "The NIFTY 50 is National Stock Exchange of India's benchmark broad based stock market index for the Indian equity market. Full form of NIFTY is National Stock Exchange Fifty. It represents the weighted average of 50 Indian company stocks in 12 sectors and is one of the two main stock indices used in India, the other being the BSE SENSEX."
    
    business_summary = "The NIFTY 50 index represents the weighted average performance of 50 of the largest and most liquid Indian companies listed on the National Stock Exchange. It covers various sectors including financial services, IT, energy, consumer goods, automobile, pharmaceuticals, and infrastructure. The index is widely followed by investors and serves as a benchmark for the Indian equity market performance."
    
    history = "The NIFTY index was launched on April 22, 1996, with a base value of 1,000. It has grown to become one of the most tracked and traded indices in India and serves as a benchmark for various mutual funds and investment products. The index has undergone multiple revisions to its composition to accurately reflect the changing dynamics of the Indian economy and stock market."
    
    management = {
        "indexManager": "NSE Indices Limited (formerly known as India Index Services & Products Limited - IISL)",
        "governingBody": "Index Maintenance Sub-Committee",
        "reviewFrequency": "Semi-annual",
        "calculationMethodology": "Free-float market capitalization weighted"
    }
    
    milestones = [
        {"year": 1996, "event": "Launch of NIFTY 50 index with base value of 1,000"},
        {"year": 2001, "event": "Crossed 1,100 for the first time"},
        {"year": 2007, "event": "Crossed 6,000 mark during the pre-financial crisis bull run"},
        {"year": 2008, "event": "Dropped over 50% during global financial crisis"},
        {"year": 2014, "event": "Crossed 8,000 mark following general elections"},
        {"year": 2017, "event": "Methodology changed to free-float market capitalization weighted"},
        {"year": 2021, "event": "Crossed 18,000 mark for the first time"},
        {"year": 2023, "event": "Achieved new all-time high above 22,000"}
    ]
    
    # Additional detailed company information
    competitive_advantages = [
        "Diversification across major sectors",
        "Includes most liquid and large-cap stocks",
        "Well-regulated by SEBI guidelines",
        "Strong correlation with Indian economic growth"
    ]
    
    key_products = [
        "NIFTY 50 Index Fund",
        "NIFTY Exchange Traded Funds (ETFs)",
        "NIFTY Futures and Options",
        "NIFTY-linked investment products"
    ]
    
    return jsonify({
        "symbol": default_symbol,
        "name": default_name,
        "exchange": default_exchange,
        "sector": default_sector,
        "industry": default_industry,
        "description": detailed_description,
        "businessSummary": business_summary,
        "history": history,
        "management": management,
        "milestones": milestones,
        "companyInfo": {
            "foundingYear": 1996,
            "headquarters": "Mumbai",
            "parentOrganization": "National Stock Exchange of India Ltd.",
            "website": "https://www.nseindia.com",
            "registeredOffice": "Exchange Plaza, Bandra Kurla Complex, Mumbai",
            "revenueGrowth": "Tracks market performance",
            "marketPosition": "Premier benchmark index",
            "keyProducts": key_products,
            "competitiveAdvantages": competitive_advantages,
            "indexConstituents": "50 largest and most liquid stocks",
            "sectorWeights": {
                "Financial Services": "37.5%",
                "IT": "14.8%",
                "Energy": "12.3%",
                "Consumer Goods": "9.7%",
                "Automobile": "6.2%",
                "Others": "19.5%"
            },
            "tradingHours": "9:15 AM to 3:30 PM IST (Monday to Friday)",
            "circuitLimits": "20% daily movement limit",
            "indexRebalancing": "Semi-annual in March and September",
            "marketImpact": "Reflects approximately 65% of total market capitalization",
            "governanceStructure": "Overseen by independent committee of industry experts",
            "historicalPerformance": {
                "1yr": "+18.7%",
                "5yr": "+82.4%",
                "10yr": "+168.5%",
                "since1996": "+2150.1%"
            }
        },
        "price": price,
        "currentPrice": price,
        "change": change,
        "changePercent": change_percent,
        "open": 22475.65,
        "high": day_high,
        "low": day_low,
        "dayHigh": day_high,
        "dayLow": day_low,
        "previousClose": 22375.25,
        "volume": 243569785,
        "avgVolume": 215698547,
        "marketCap": "N/A (Index)",
        "pe": 22.5,
        "dividend_yield": 1.35,
        "beta": 1.0,
        "yearHigh": 22800.50,
        "yearLow": 19795.75,
        "recommendation": recommendation
    })

@app.route('/api/portfolio', methods=['GET'])
def get_portfolio():
    return jsonify(generate_portfolio())

@app.route('/api/portfolio/performance', methods=['GET'])
def get_portfolio_performance():
    return jsonify(generate_portfolio_performance())

@app.route('/api/market/top-gainers', methods=['GET'])
def get_top_gainers():
    limit = int(request.args.get('limit', 5))
    movers = generate_market_movers(limit)
    return jsonify(movers['gainers'])

@app.route('/api/market/top-losers', methods=['GET'])
def get_top_losers():
    limit = int(request.args.get('limit', 5))
    movers = generate_market_movers(limit)
    return jsonify(movers['losers'])

@app.route('/api/market/sector-performance', methods=['GET'])
def get_sector_performance():
    """Get detailed sector performance with insights and trends"""
    return jsonify(generate_detailed_sector_performance())

@app.route('/api/market/overview', methods=['GET'])
def get_market_overview():
    """Get comprehensive market overview with all data points"""
    return jsonify(generate_enhanced_market_overview())

@app.route('/api/market/breadth', methods=['GET'])
def get_market_breadth():
    """Get detailed market breadth data across exchanges and market caps"""
    return jsonify(generate_market_breadth())

@app.route('/api/market/sentiment', methods=['GET'])
def get_market_sentiment():
    """Get overall market sentiment with multiple indicators"""
    return jsonify(generate_market_sentiment())

@app.route('/api/market/most-active', methods=['GET'])
def get_most_active():
    limit = int(request.args.get('limit', 5))
    movers = generate_market_movers(limit)
    return jsonify(movers['mostActive'])

@app.route('/api/stock/recommended', methods=['GET'])
def get_recommended_stocks():
    """Get AI-recommended stocks based on market trends and predictions"""
    try:
        # Set seed for consistent results across requests
        random.seed(int(time.time() / 86400))  # Changes daily
        
        # Define a set of consistently recommended stocks (to avoid randomness causing errors)
        recommended_symbols = ["RELIANCE", "HDFCBANK", "INFY", "TCS", "TATAMOTORS", "ICICIBANK", "BHARTIARTL", "MARUTI", "WIPRO", "ADANIPORTS"]
        recommended_stocks = []
        
        for symbol in recommended_symbols:
            # Find actual stock data
            stock_data = None
            for stock in INDIAN_STOCKS:
                if stock["symbol"] == symbol:
                    stock_data = stock.copy()
                    break
            
            # Use fallback if stock not found
            if not stock_data:
                stock_data = {
                    "symbol": symbol,
                    "name": f"{symbol} Industries Ltd",
                    "exchange": "NSE",
                    "sector": "Technology"
                }
            
            # Generate consistent stock price and change data
            symbol_hash = sum(ord(c) for c in symbol)
            random.seed(symbol_hash)  # Ensure consistent randomness based on symbol
            
            # Base price for consistency across requests
            base_price = round(500 + (symbol_hash % 3000), 2)
            
            # Generate change based on symbol hash
            change_percent = round(random.uniform(-2.5, 5.0), 2)  # More positive than negative
            change = round(base_price * change_percent / 100, 2)
            
            # Generate AI analysis for the stock
            seed_val = symbol_hash % 100
            bullish = seed_val > 40  # 60% of stocks are bullish recommendations
            confidence = min(95, 70 + (seed_val % 20))
            
            # Create detailed AI analysis
            ai_analysis = {
                "shortTerm": {
                    "trend": "up" if bullish else "down",
                    "prediction": f"{'Increase' if bullish else 'Decrease'} of {round(random.uniform(1, 5 if bullish else 3), 1)}% expected",
                    "timeframe": f"{random.randint(1, 4)} weeks",
                    "confidence": round(confidence - random.randint(0, 10), 1)
                },
                "longTerm": {
                    "trend": "up" if (bullish or random.random() > 0.3) else "flat",  # Long term is more often up
                    "prediction": f"{'Strong growth' if bullish else 'Stable performance'} expected",
                    "timeframe": f"{random.randint(6, 18)} months",
                    "confidence": round(confidence - random.randint(10, 15), 1)  # Lower confidence for long term
                },
                "riskAssessment": {
                    "level": random.choice(["Low", "Moderate", "High"]),
                    "factors": [
                        random.choice([
                            "Market volatility exposure",
                            "Sector headwinds",
                            "Competitive pressures",
                            "Regulatory challenges"
                        ]) if not bullish else random.choice([
                            "Strong balance sheet",
                            "Industry leadership",
                            "Innovation potential",
                            "Expansion opportunities"
                        ]),
                        random.choice([
                            "Consistent dividend history",
                            "Solid cash flow generation",
                            "Diversified revenue streams",
                            "Strategic initiatives underway"
                        ])
                    ]
                }
            }
            
            # Generate recommendation data
            recommendation = {
                "symbol": symbol,
                "name": stock_data["name"],
                "exchange": stock_data["exchange"],
                "price": base_price,
                "change": change,
                "changePercent": change_percent,
                "sector": stock_data["sector"],
                "predictionAccuracy": confidence,
                "recommendationRating": random.choice(["Strong Buy", "Buy", "Hold"]) if bullish else random.choice(["Hold", "Sell"]),
                "recommendationReason": random.choice([
                    f"Strong growth potential in the {stock_data['sector']} sector",
                    "Undervalued based on current financial metrics",
                    "Positive technical indicators and momentum",
                    "Strategic initiatives expected to boost performance",
                    "Market leader with competitive advantages",
                    "Innovative product pipeline and research efforts"
                ]) if bullish else random.choice([
                    "Potential headwinds in the upcoming quarter",
                    "Valuation appears stretched at current levels",
                    "Technical indicators suggest caution",
                    "Increasing competitive pressures in the sector",
                    "Regulatory concerns may impact growth"
                ]),
                "aiAnalysis": ai_analysis
            }
            
            recommended_stocks.append(recommendation)
        
        # Sort by confidence/rating
        recommended_stocks.sort(key=lambda x: 
            (1 if x["recommendationRating"] == "Strong Buy" else
             2 if x["recommendationRating"] == "Buy" else
             3 if x["recommendationRating"] == "Hold" else 4),
            reverse=False)
        
        # Return the proper structure
        result = {"recommendations": recommended_stocks}
        return jsonify(result)
    
    except Exception as e:
        # Log the error
        print(f"Error in get_recommended_stocks: {str(e)}")
        
        # Return a fallback response with generic recommendations
        fallback_recommendations = [
            {
                "symbol": "RELIANCE",
                "name": "Reliance Industries Ltd",
                "exchange": "NSE",
                "price": 2542.75,
                "change": 32.15,
                "changePercent": 1.28,
                "sector": "Energy",
                "predictionAccuracy": 85.3,
                "recommendationRating": "Buy",
                "recommendationReason": "Strong growth potential across diverse business segments",
                "aiAnalysis": {
                    "shortTerm": {
                        "trend": "up",
                        "prediction": "Increase of 3.2% expected",
                        "timeframe": "2 weeks",
                        "confidence": 82.5
                    },
                    "longTerm": {
                        "trend": "up",
                        "prediction": "Strong growth expected",
                        "timeframe": "12 months",
                        "confidence": 76.8
                    },
                    "riskAssessment": {
                        "level": "Low",
                        "factors": [
                            "Industry leadership",
                            "Diversified revenue streams"
                        ]
                    }
                }
            },
            {
                "symbol": "HDFCBANK",
                "name": "HDFC Bank Ltd",
                "exchange": "NSE",
                "price": 1678.50,
                "change": 15.75,
                "changePercent": 0.95,
                "sector": "Financial Services",
                "predictionAccuracy": 87.1,
                "recommendationRating": "Strong Buy",
                "recommendationReason": "Market leader with strong fundamentals and growth outlook",
                "aiAnalysis": {
                    "shortTerm": {
                        "trend": "up",
                        "prediction": "Increase of 2.8% expected",
                        "timeframe": "3 weeks",
                        "confidence": 84.6
                    },
                    "longTerm": {
                        "trend": "up",
                        "prediction": "Strong growth expected",
                        "timeframe": "12 months",
                        "confidence": 79.5
                    },
                    "riskAssessment": {
                        "level": "Low",
                        "factors": [
                            "Strong balance sheet",
                            "Consistent dividend history"
                        ]
                    }
                }
            },
            {
                "symbol": "INFY",
                "name": "Infosys Ltd",
                "exchange": "NSE",
                "price": 1523.60,
                "change": -12.35,
                "changePercent": -0.81,
                "sector": "Technology",
                "predictionAccuracy": 83.4,
                "recommendationRating": "Hold",
                "recommendationReason": "Potential headwinds in the upcoming quarter",
                "aiAnalysis": {
                    "shortTerm": {
                        "trend": "down",
                        "prediction": "Decrease of 1.5% expected",
                        "timeframe": "2 weeks",
                        "confidence": 75.2
                    },
                    "longTerm": {
                        "trend": "up",
                        "prediction": "Stable performance expected",
                        "timeframe": "9 months",
                        "confidence": 68.7
                    },
                    "riskAssessment": {
                        "level": "Moderate",
                        "factors": [
                            "Sector headwinds",
                            "Solid cash flow generation"
                        ]
                    }
                }
            }
        ]
        
        return jsonify({"recommendations": fallback_recommendations})

@app.route('/api/stock/<symbol>/prediction', methods=['GET'])
def get_stock_prediction(symbol):
    """Get predictive data for a specific stock"""
    try:
        days = int(request.args.get('days', 30))
        
        # Handle undefined symbol case with proper error handling
        if symbol == "undefined" or not symbol or symbol.lower() == "undefined":
            print(f"Returning default prediction data for undefined symbol")
            return generate_default_prediction(days)
        
        # Find the stock in our list
        stock_data = None
        for stock in INDIAN_STOCKS:
            if stock["symbol"] == symbol:
                stock_data = stock
                break
                
        if not stock_data:
            print(f"Stock not found: {symbol}, returning default prediction")
            return generate_default_prediction(days)
        
        # Get base price for the stock based on symbol
        symbol_hash = sum(ord(c) for c in symbol)
        random.seed(symbol_hash)  # Ensure consistent randomness based on symbol
        
        # Base price for consistency across requests
        base_price = round(500 + (symbol_hash % 3000), 2)
        
        # Determine trend bias based on symbol (some stocks will tend up, others down)
        trend_bias = -1 if symbol_hash % 3 == 0 else 1  # 2/3 of stocks trend up, 1/3 trend down
        
        # Generate daily predictions
        daily_predictions = []
        current_date = datetime.now()
        current_price = base_price
        
        for i in range(days):
            future_date = current_date + timedelta(days=i)
            
            # The further in future, the higher the variance
            volatility = 0.01 + (i / days) * 0.03
            
            # Generate price change with trend bias and random noise
            day_change = current_price * (trend_bias * 0.002 + random.uniform(-volatility, volatility))
            future_price = current_price + day_change
            
            # Ensure price doesn't go below a reasonable amount
            future_price = max(current_price * 0.5, future_price)
            
            # Add some randomness to confidence based on distance into future
            confidence = round(max(60, 95 - (i / days) * 30 + random.uniform(-5, 5)), 1)
            
            # Add prediction data for this day
            daily_predictions.append({
                "date": future_date.strftime("%Y-%m-%d"),
                "price": round(future_price, 2),
                "confidence": confidence,
                "upperBound": round(future_price * (1 + 0.01 * (100 - confidence) / 10), 2),
                "lowerBound": round(future_price * (1 - 0.01 * (100 - confidence) / 10), 2)
            })
            
            # Update current price for next prediction
            current_price = future_price
        
        # Calculate total percent change from start to end of prediction
        start_price = base_price
        end_price = daily_predictions[-1]["price"]
        change_percent = round((end_price - start_price) / start_price * 100, 2)
        
        # Determine trend based on total change
        trend = "up" if change_percent > 0 else "down"
        
        # Generate RSI value that aligns with trend
        rsi_mid = 50
        rsi_range = 20
        rsi = rsi_mid + (trend_bias * random.uniform(5, rsi_range))
        rsi = max(20, min(80, rsi))  # Keep RSI in reasonable range
        
        # Generate MACD value
        macd = trend_bias * random.uniform(0.5, 2.0)
        
        # Generate technical analysis data
        sma_mod = random.uniform(0.02, 0.1)
        bullish = trend_bias > 0
        
        technical_analysis = {
            "summary": f"Our AI models predict a {('bullish' if trend_bias > 0 else 'bearish')} trend for {stock_data['name']} with potential {('resistance' if trend_bias > 0 else 'support')} at key levels.",
            "technicalFactors": {
                "movingAverages": "Bullish" if bullish else "Bearish",
                "rsi": round(rsi),
                "macd": "Bullish Crossover" if bullish else "Bearish Crossover",
                "bollingerBands": {
                    "upper": round(base_price * (1 + sma_mod * 2), 2),
                    "middle": round(base_price, 2),
                    "lower": round(base_price * (1 - sma_mod * 2), 2),
                    "width": round(sma_mod * 4 * 100, 2),
                    "signal": "Buy" if base_price < (base_price * (1 - sma_mod)) else "Sell" if base_price > (base_price * (1 + sma_mod)) else "Neutral"
                },
                "supportLevels": [
                    round(base_price * 0.95, 2),
                    round(base_price * 0.9, 2),
                    round(base_price * 0.85, 2)
                ],
                "resistanceLevels": [
                    round(base_price * 1.05, 2),
                    round(base_price * 1.1, 2),
                    round(base_price * 1.15, 2)
                ]
            },
            "fundamentalFactors": {
                "earningsImpact": "Positive" if bullish else "Negative",
                "valuationMetric": ("Under" if bullish else "Over") + "valued",
                "sectorOutlook": "Positive" if bullish else "Negative"
            }
        }
        
        # Determine model accuracy based on stock industry and randomness
        model_accuracy = 80 + (symbol_hash % 10) + random.randint(0, 5)
        model_accuracy = min(95, model_accuracy)  # Cap at 95% accuracy
        
        prediction_result = {
            "symbol": symbol,
            "name": stock_data["name"],
            "currentPrice": base_price, 
            "predictions": daily_predictions,
            "analysis": technical_analysis,
            "modelAccuracy": model_accuracy
        }
        
        return jsonify(prediction_result)
    except Exception as e:
        print(f"Error in get_stock_prediction: {str(e)}")
        # Provide fallback prediction data
        return generate_default_prediction(days)


def generate_default_prediction(days=30):
    """Generate default prediction data when a symbol is not found or is undefined"""
    # Base values for NIFTY 50
    base_price = 24542.17
    
    # Generate daily predictions
    daily_predictions = []
    current_date = datetime.now()
    
    for i in range(days):
        future_date = current_date + timedelta(days=i)
        # Slight upward bias for index
        volatility = 0.005 + (i / days) * 0.015
        # Small random daily change with slight upward trend
        day_change_percent = 0.001 + random.uniform(-volatility, volatility)
        
        # Calculate confidence (decreases as we go further into future)
        confidence = round(max(70, 90 - (i / days) * 20), 1)
        
        # Add prediction
        price = base_price * (1 + (i * 0.001) + day_change_percent)
        
        daily_predictions.append({
            "date": future_date.strftime("%Y-%m-%d"),
            "price": round(price, 2),
            "confidence": confidence,
            "upperBound": round(price * (1 + 0.005 * (100 - confidence) / 10), 2),
            "lowerBound": round(price * (1 - 0.005 * (100 - confidence) / 10), 2)
        })
    
    # Technical and fundamental analysis
    technical_analysis = {
        "summary": "Based on market analysis, the index is expected to maintain positive momentum with occasional consolidation periods.",
        "technicalFactors": {
            "movingAverages": "Bullish",
            "rsi": 58,
            "macd": "Bullish Crossover",
            "bollingerBands": {
                "upper": round(base_price * 1.025, 2),
                "middle": base_price,
                "lower": round(base_price * 0.975, 2),
                "width": 5.0,
                "signal": "Neutral"
            },
            "supportLevels": [
                round(base_price * 0.97, 2),
                round(base_price * 0.95, 2),
                round(base_price * 0.93, 2)
            ],
            "resistanceLevels": [
                round(base_price * 1.02, 2),
                round(base_price * 1.04, 2),
                round(base_price * 1.06, 2)
            ]
        },
        "fundamentalFactors": {
            "earningsImpact": "Positive",
            "valuationMetric": "Fair Value",
            "sectorOutlook": "Positive"
        }
    }
    
    return jsonify({
        "symbol": "NIFTY",
        "name": "NIFTY 50 Index",
        "currentPrice": base_price,
        "predictions": daily_predictions,
        "analysis": technical_analysis,
        "modelAccuracy": 85
    })

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

@app.route('/api/stock/<symbol>', methods=['GET'])
def get_stock_details(symbol):
    """Get basic details for a specific stock"""
    # Handle undefined symbol case
    if symbol == "undefined" or not symbol or symbol.lower() == "undefined":
        print(f"Undefined symbol requested: '{symbol}', returning default stock details")
        return generate_default_stock_details()
    
    # Find the stock in our list
    stock_data = None
    for stock in INDIAN_STOCKS:
        if stock["symbol"] == symbol:
            stock_data = stock
            break
    
    if not stock_data:
        print(f"Stock not found: '{symbol}', returning default stock details")
        # Return default data instead of 404 error
        return generate_default_stock_details()
    
    # Generate a consistent price based on the symbol
    symbol_hash = sum(ord(c) for c in symbol)
    price = round(500 + (symbol_hash % 3000) + random.uniform(-50, 50), 2)
    change = round(random.uniform(-50, 50), 2)
    change_percent = round(change / price * 100, 2)
    
    # Create recommendation
    recommendation = {
        "rating": random.choice(["Strong Buy", "Buy", "Hold", "Reduce", "Sell"]),
        "reasons": [
            random.choice(["Strong fundamentals", "Attractive valuation", "Growth potential", "Technical breakout", "Sector leadership"]),
            random.choice(["Positive momentum", "Favorable industry trends", "Expanding market share", "Increasing margins"])
        ],
        "strength": random.randint(40, 95),
        "updated": datetime.now().isoformat()
    }
    
    # Company information
    founding_year = 1980 + (symbol_hash % 40)  # Between 1980-2019
    employee_count = 1000 * (1 + (symbol_hash % 100))
    ceo_name = random.choice([
        "Rajesh Sharma", "Anand Patel", "Sunita Kapoor", "Vikram Mehta",
        "Deepak Singh", "Nirmala Joshi", "Sanjay Kumar", "Priya Nair"
    ])
    
    # Enhanced company information
    sector = stock_data.get("sector", "Unknown")
    detailed_description = stock_data.get("description", f"Leading company in the {sector} sector.")
    
    # Generate business summary based on sector
    business_summary_templates = {
        "Energy": [
            f"{stock_data['name']} is a major player in the Indian energy sector with significant operations in oil and gas exploration, production, refining, and distribution.",
            f"The company has a strong presence across the energy value chain with investments in both traditional and renewable energy sources.",
            f"With a focus on sustainability and future growth, {stock_data['name']} is investing in green energy solutions while maintaining its core fossil fuel business."
        ],
        "IT": [
            f"{stock_data['name']} is a leading provider of IT services, consulting, and business solutions with a global client base spanning multiple industries.",
            f"The company specializes in digital transformation, cloud services, AI, and enterprise solutions that help businesses navigate technology challenges.",
            f"With development centers across India and internationally, {stock_data['name']} employs thousands of technology professionals delivering innovative solutions to clients worldwide."
        ],
        "Banking": [
            f"{stock_data['name']} is one of India's premier banking institutions offering a comprehensive range of banking services to retail and corporate customers.",
            f"The bank has a strong nationwide presence with branches and ATMs across urban and rural India, complemented by robust digital banking platforms.",
            f"With a focus on financial inclusion and technological innovation, {stock_data['name']} continues to expand its customer base while maintaining strong asset quality."
        ],
        "Finance": [
            f"{stock_data['name']} is a leading non-banking financial company providing various financial services including loans, asset financing, and wealth management.",
            f"The company has established a strong market presence through its diversified product offerings catering to both individual and corporate clients.",
            f"With a focus on technology-enabled financial solutions, {stock_data['name']} has consistently shown strong growth in its loan book and customer base."
        ],
        "Pharma": [
            f"{stock_data['name']} is a major pharmaceutical company engaged in the development, manufacturing, and marketing of generic and specialty medicines.",
            f"The company has a strong research and development pipeline with focus on complex generics, biosimilars, and innovative drug delivery systems.",
            f"With manufacturing facilities approved by major regulatory authorities worldwide, {stock_data['name']} exports products to over 100 countries while maintaining a strong domestic presence."
        ],
        "Consumer Goods": [
            f"{stock_data['name']} is a leading consumer goods company with a diverse portfolio of products in personal care, home care, and food categories.",
            f"The company has built strong brands that are household names across India, with distribution networks reaching both urban centers and rural areas.",
            f"With a focus on innovation and consumer insights, {stock_data['name']} continues to launch new products tailored to evolving consumer preferences."
        ],
        "Automobile": [
            f"{stock_data['name']} is a prominent player in the Indian automobile sector manufacturing passenger vehicles, commercial vehicles, and two-wheelers.",
            f"The company has state-of-the-art manufacturing facilities with capabilities for design, development, and production of vehicles meeting global quality standards.",
            f"With increasing focus on electric mobility, {stock_data['name']} is investing in new technologies to address the changing automotive landscape."
        ]
    }
    
    # Generate a consistent business summary based on sector
    if sector in business_summary_templates:
        business_summary = " ".join(business_summary_templates[sector])
    else:
        business_summary = f"{stock_data['name']} is a leading company in its sector with a strong market presence and a legacy of delivering value to its stakeholders. The company continues to focus on growth opportunities while maintaining operational excellence."
    
    # Generate history based on founding year
    history = f"{stock_data['name']} was founded in {founding_year} and has since grown to become a significant player in the {sector} industry. "
    
    if founding_year < 1990:
        history += "The company navigated through India's pre-liberalization economy and later adapted successfully to the open market reforms. "
    elif founding_year < 2000:
        history += "The company was established during India's economic liberalization period and capitalized on the emerging market opportunities. "
    else:
        history += "As a relatively young company, it has shown remarkable growth in a competitive market environment. "
    
    history += f"Over the years, {stock_data['name']} has expanded its operations, diversified its product/service offerings, and built a strong reputation for quality and innovation."
    
    # Add sector-specific history
    sector_history = {
        "IT": " The company has been at the forefront of India's IT revolution, contributing significantly to establishing the country as a global technology services hub.",
        "Banking": " The bank has played a significant role in the development of India's financial sector, introducing innovative products and services that have transformed banking in the country.",
        "Energy": " The company has been instrumental in strengthening India's energy security and has evolved from a traditional oil company to an integrated energy player.",
        "Pharma": " The company has been a pioneer in making affordable medicines accessible to millions, while also gaining recognition in global pharmaceutical markets for its quality products.",
        "Automobile": " The company has contributed significantly to India's automotive industry growth, evolving from modest beginnings to a manufacturer of world-class vehicles."
    }
    
    if sector in sector_history:
        history += sector_history[sector]
    
    # Generate management structure
    management = {
        "ceo": ceo_name,
        "ceoSince": 2016 + (symbol_hash % 7),  # Between 2016-2022
        "boardSize": 8 + (symbol_hash % 7),  # Between 8-14
        "keyExecutives": [
            {
                "name": random.choice(["Amit Kumar", "Vikram Singh", "Sanjay Mehta", "Priya Sharma"]),
                "position": "Chief Financial Officer"
            },
            {
                "name": random.choice(["Ravi Tandon", "Neha Patel", "Arun Joshi", "Meera Saxena"]),
                "position": "Chief Operating Officer"
            },
            {
                "name": random.choice(["Sandeep Gupta", "Deepak Verma", "Anita Reddy", "Rahul Malhotra"]),
                "position": random.choice(["Chief Technology Officer", "Chief Marketing Officer", "Chief Strategy Officer"])
            }
        ],
        "governanceScore": 65 + (symbol_hash % 30)  # Between 65-94
    }
    
    # Generate milestones based on founding year
    founding_milestone = {"year": founding_year, "event": f"Founded by {random.choice(['entrepreneurs', 'industry veterans', 'visionary leaders'])}"}
    
    # Calculate milestone years (ensure they are in chronological order)
    milestone_count = 4 + (symbol_hash % 4)  # Between 4-7 milestones
    years_range = 2023 - founding_year
    milestone_years = sorted([founding_year + int(years_range * (i / milestone_count)) for i in range(1, milestone_count)])
    
    # Generate sector-specific milestone events
    sector_events = {
        "IT": [
            "Reached $100 million in annual revenue",
            "Expanded operations to North America and Europe",
            "Listed on stock exchange",
            "Acquired key technology company",
            "Launched innovative AI-based solution",
            "Crossed 10,000 employees globally",
            "Established global innovation center"
        ],
        "Banking": [
            "Opened 100th branch",
            "Launched online banking platform",
            "Introduced mobile banking app",
            "Reached 1 million customers",
            "Expanded to rural markets with specialized products",
            "Implemented core banking solution",
            "Merged with another financial institution"
        ],
        "Energy": [
            "Discovered major oil/gas field",
            "Commissioned new refinery",
            "Expanded retail fuel network to 1,000 outlets",
            "Entered renewable energy sector",
            "Achieved carbon neutrality targets",
            "Commissioned major petrochemical plant",
            "Expanded international operations"
        ],
        "Pharma": [
            "Received first USFDA approval",
            "Launched breakthrough generic drug",
            "Established R&D center",
            "Received GMP certification for manufacturing plant",
            "Entered biosimilars market",
            "Achieved significant regulatory milestone",
            "Expanded to international markets"
        ],
        "Consumer Goods": [
            "Launched flagship brand",
            "Achieved national distribution",
            "Expanded product portfolio",
            "Reached 1 million customers",
            "Implemented automated manufacturing",
            "Introduced eco-friendly packaging",
            "Expanded to international markets"
        ],
        "Automobile": [
            "Launched first vehicle model",
            "Established state-of-the-art manufacturing plant",
            "Achieved production milestone of 1 million vehicles",
            "Expanded to international markets",
            "Introduced electric vehicle lineup",
            "Formed strategic international partnership",
            "Achieved 5-star safety rating for flagship model"
        ]
    }
    
    # Select appropriate events for the sector
    if sector in sector_events:
        event_pool = sector_events[sector]
    else:
        event_pool = [
            "Major expansion of operations",
            "Listed on stock exchange",
            "Entered new market segment",
            "Launched flagship product/service",
            "Achieved significant industry recognition",
            "Implemented major technological upgrade",
            "Reached important revenue milestone"
        ]
    
    # Create milestones array
    milestones = [founding_milestone]
    random.seed(symbol_hash)  # Ensure consistent randomness based on symbol
    selected_events = random.sample(event_pool, min(len(milestone_years), len(event_pool)))
    
    for i, year in enumerate(milestone_years):
        if i < len(selected_events):
            milestones.append({"year": year, "event": selected_events[i]})
    
    # Add an additional recent milestone
    recent_milestone = {"year": 2020 + (symbol_hash % 3), "event": random.choice([
        "Launched digital transformation initiative",
        "Implemented sustainability framework",
        "Achieved significant ESG milestone",
        "Expanded into new business vertical",
        "Completed major organizational restructuring"
    ])}
    milestones.append(recent_milestone)
    
    # Sort milestones by year
    milestones = sorted(milestones, key=lambda x: x["year"])
    
    result = {
        "symbol": symbol,
        "name": stock_data["name"],
        "exchange": stock_data.get("exchange", "NSE"),
        "sector": sector,
        "industry": stock_data.get("industry", "General"),
        "description": detailed_description,
        "businessSummary": business_summary,
        "history": history,
        "management": management,
        "milestones": milestones,
        "companyInfo": {
            "foundingYear": founding_year,
            "headquarters": random.choice(["Mumbai", "Bangalore", "Delhi", "Hyderabad", "Chennai", "Pune"]),
            "employeeCount": employee_count,
            "ceo": ceo_name,
            "website": f"https://www.{symbol.lower()}.in",
            "registeredOffice": f"{random.choice(['Tower A', 'Prestige Plaza', 'Corporate House', 'Business Park'])}, {random.choice(['Bandra Kurla Complex', 'Andheri East', 'Whitefield', 'Cyber City', 'Electronics City'])}",
            "revenueGrowth": f"{(5 + (symbol_hash % 20))}%",  # 5% to 25%
            "marketPosition": random.choice(["Market Leader", "Strong Challenger", "Growing Player", "Niche Leader"]),
            "keyProducts": generateKeyProducts(sector, symbol_hash),
            "competitiveAdvantages": generateCompetitiveAdvantages(sector, symbol_hash)
        },
        "price": price,
        "currentPrice": price,
        "change": change,
        "changePercent": change_percent,
        "open": round(price - random.uniform(-20, 20), 2),
        "high": round(price + random.uniform(10, 30), 2),
        "low": round(price - random.uniform(10, 30), 2),
        "dayHigh": round(price + random.uniform(10, 30), 2),
        "dayLow": round(price - random.uniform(10, 30), 2),
        "previousClose": round(price - change, 2),
        "volume": round(random.uniform(100000, 5000000)),
        "marketCap": price * (10000000 + (symbol_hash % 100000000)),
        "pe": round(random.uniform(10, 35), 2),
        "eps": round(price / random.uniform(10, 35), 2),
        "beta": round(random.uniform(0.5, 1.5), 2),
        "yearHigh": round(price * random.uniform(1.1, 1.4), 2),
        "yearLow": round(price * random.uniform(0.6, 0.9), 2),
        "avgVolume": round(random.uniform(100000, 5000000)),
        "dividend_yield": round(random.uniform(0.5, 3.5), 2),
        "recommendation": recommendation
    }
    
    return jsonify(result)

def generateKeyProducts(sector, symbol_hash):
    """Generate sector-specific key products"""
    products = {
        "IT": [
            "Digital Transformation Solutions",
            "Cloud Services",
            "AI and Machine Learning Platforms",
            "Enterprise Software Solutions",
            "Cybersecurity Services",
            "Data Analytics Solutions"
        ],
        "Banking": [
            "Retail Banking Services",
            "Corporate Banking Solutions",
            "Digital Banking Platform",
            "Wealth Management Services",
            "Loan Products",
            "Credit Card Services"
        ],
        "Energy": [
            "Petroleum Products",
            "Natural Gas",
            "Petrochemicals",
            "Renewable Energy Solutions",
            "Fuel Retail Services",
            "Lubricants"
        ],
        "Pharma": [
            "Generic Pharmaceuticals",
            "Active Pharmaceutical Ingredients",
            "Specialty Medicines",
            "Over-the-Counter Products",
            "Biosimilars",
            "Contract Manufacturing Services"
        ],
        "Consumer Goods": [
            "Personal Care Products",
            "Home Care Solutions",
            "Food and Beverages",
            "Health and Wellness Products",
            "Beauty Products",
            "Household Essentials"
        ],
        "Automobile": [
            "Passenger Vehicles",
            "Commercial Vehicles",
            "Two-Wheelers",
            "Electric Vehicles",
            "Automotive Components",
            "After-Sales Services"
        ],
        "Telecom": [
            "Mobile Services",
            "Broadband Internet",
            "Enterprise Connectivity Solutions",
            "Digital Services Platform",
            "IoT Solutions",
            "Cloud Communication Services"
        ]
    }
    
    if sector in products:
        product_list = products[sector]
        # Select a random subset (3-5) of products based on symbol hash
        num_products = 3 + (symbol_hash % 3)
        selected_indices = [(symbol_hash + i) % len(product_list) for i in range(num_products)]
        return [product_list[i] for i in selected_indices]
    else:
        # Generic products for other sectors
        return [
            "Core Product Line",
            "Premium Services",
            "Specialized Solutions",
            "Customer-Focused Offerings"
        ]

def generateCompetitiveAdvantages(sector, symbol_hash):
    """Generate sector-specific competitive advantages"""
    advantages = {
        "IT": [
            "Strong Digital Capabilities",
            "Global Delivery Model",
            "Industry-Specific Expertise",
            "Innovation Culture",
            "Strategic Partnerships",
            "Talent Development"
        ],
        "Banking": [
            "Extensive Branch Network",
            "Strong Digital Banking Platform",
            "Robust Risk Management",
            "Customer-Centric Approach",
            "Diversified Revenue Streams",
            "Strong Capital Position"
        ],
        "Energy": [
            "Integrated Value Chain",
            "Advanced Refining Capabilities",
            "Strong Distribution Network",
            "Technology Leadership",
            "Sustainable Practices",
            "Strategic Reserves"
        ],
        "Pharma": [
            "Strong R&D Pipeline",
            "Cost-Efficient Manufacturing",
            "Global Regulatory Expertise",
            "Diverse Product Portfolio",
            "Strategic Partnerships",
            "Quality Control Excellence"
        ],
        "Consumer Goods": [
            "Strong Brand Recognition",
            "Extensive Distribution Network",
            "Product Innovation",
            "Consumer Insights",
            "Manufacturing Excellence",
            "Supply Chain Efficiency"
        ],
        "Automobile": [
            "Advanced Engineering Capabilities",
            "Strong Brand Portfolio",
            "Manufacturing Excellence",
            "Extensive Dealer Network",
            "Innovation Leadership",
            "Cost Competitiveness"
        ],
        "Telecom": [
            "Extensive Network Coverage",
            "Spectrum Advantage",
            "Digital Service Ecosystem",
            "Infrastructure Strength",
            "Customer Base",
            "Technology Leadership"
        ]
    }
    
    if sector in advantages:
        advantage_list = advantages[sector]
        # Select a random subset (3-4) of advantages based on symbol hash
        num_advantages = 3 + (symbol_hash % 2)
        selected_indices = [(symbol_hash + i) % len(advantage_list) for i in range(num_advantages)]
        return [advantage_list[i] for i in selected_indices]
    else:
        # Generic advantages for other sectors
        return [
            "Industry Expertise",
            "Operational Excellence",
            "Customer Relationships",
            "Innovation Capability"
        ]

@app.route('/api/stock/<symbol>/technical', methods=['GET'])
def get_stock_technical(symbol):
    """Get technical analysis data for a specific stock"""
    try:
        # Handle undefined symbol case with proper error handling
        if symbol == "undefined" or not symbol or symbol.lower() == "undefined":
            print(f"Returning default technical data for undefined symbol")
            return generate_default_technical()
        
        # Find the stock in our list
        stock_data = None
        for stock in INDIAN_STOCKS:
            if stock["symbol"] == symbol:
                stock_data = stock
                break
                
        if not stock_data:
            print(f"Stock not found: {symbol}, returning default technical data")
            return generate_default_technical()
        
        # Get base price for the stock based on symbol
        symbol_hash = sum(ord(c) for c in symbol)
        random.seed(symbol_hash)  # Ensure consistent randomness based on symbol
        
        # Base price for consistency across requests
        base_price = round(500 + (symbol_hash % 3000), 2)
        
        # Determine trend bias based on symbol (some stocks will tend up, others down)
        trend_bias = -1 if symbol_hash % 3 == 0 else 1  # 2/3 of stocks trend up, 1/3 trend down
        bullish = trend_bias > 0
        
        # Generate RSI value that aligns with trend
        rsi_mid = 50
        rsi_range = 20
        rsi = rsi_mid + (trend_bias * random.uniform(5, rsi_range))
        rsi = max(20, min(80, rsi))  # Keep RSI in reasonable range
        
        # Generate Volume data relative to average
        volume_change = random.uniform(-15, 30)  # More likely to be above average
        
        # Generate Moving Averages
        ma_status = {}
        intervals = [5, 10, 20, 50, 100, 200]
        
        # Price offsets for different moving averages
        ma_values = {}
        for interval in intervals:
            # Longer intervals have more variance from current price
            variance = 0.005 * (interval / 10) * random.uniform(-1, 1)
            direction = 1 if interval > 50 else -1
            # Trend bias affects longer term MAs more than shorter term
            bias_effect = trend_bias * 0.0005 * interval
            
            ma_value = base_price * (1 + variance + bias_effect * direction)
            ma_values[interval] = round(ma_value, 2)
            
            # Determine if price is above or below each MA
            status = "Bullish" if base_price > ma_value else "Bearish"
            ma_status[f"MA{interval}"] = status
        
        # Determine overall MA status (weighted toward longer term MAs)
        bullish_count = sum(1 for status in ma_status.values() if status == "Bullish")
        bearish_count = len(ma_status) - bullish_count
        
        ma_overall = "Bullish" if bullish_count > bearish_count else "Bearish"
        
        # Generate MACD values
        macd_value = trend_bias * random.uniform(0.5, 2.0)
        macd_signal = macd_value - trend_bias * random.uniform(0.2, 0.8)
        macd_histogram = macd_value - macd_signal
        
        # Bollinger Bands
        sma_mod = random.uniform(0.02, 0.1)
        bollinger_bands = {
            "upper": round(base_price * (1 + sma_mod * 2), 2),
            "middle": round(base_price, 2),
            "lower": round(base_price * (1 - sma_mod * 2), 2),
            "width": round(sma_mod * 4 * 100, 2),
            "percentB": round(random.uniform(0, 100), 1)
        }
        
        # Support and resistance levels
        support_levels = [
            round(base_price * (1 - 0.05 * random.uniform(0.8, 1.2)), 2),
            round(base_price * (1 - 0.1 * random.uniform(0.8, 1.2)), 2),
            round(base_price * (1 - 0.15 * random.uniform(0.8, 1.2)), 2)
        ]
        
        resistance_levels = [
            round(base_price * (1 + 0.05 * random.uniform(0.8, 1.2)), 2),
            round(base_price * (1 + 0.1 * random.uniform(0.8, 1.2)), 2),
            round(base_price * (1 + 0.15 * random.uniform(0.8, 1.2)), 2)
        ]
        
        # Generate chart patterns
        patterns = []
        pattern_choices = [
            "Double Top", "Double Bottom", "Head and Shoulders", 
            "Inverse Head and Shoulders", "Cup and Handle", 
            "Rising Wedge", "Falling Wedge", "Triangle", 
            "Flag", "Pennant", "Channel", "Gap"
        ]
        
        # Choose 1-3 patterns
        num_patterns = random.randint(1, 3)
        for _ in range(num_patterns):
            pattern = random.choice(pattern_choices)
            signal = "Bullish" if (bullish and random.random() > 0.2) or (not bullish and random.random() < 0.2) else "Bearish"
            strength = random.randint(1, 5)  # 1-5 star strength
            
            patterns.append({
                "name": pattern,
                "signal": signal,
                "strength": strength,
                "timeframe": random.choice(["Daily", "Weekly", "Monthly"])
            })
        
        # Technical indicators summary
        indicators = {
            "macd": {
                "value": round(macd_value, 2),
                "signal": round(macd_signal, 2),
                "histogram": round(macd_histogram, 2),
                "trend": "Bullish Crossover" if macd_histogram > 0 and macd_value > 0 else
                         "Bearish Crossover" if macd_histogram < 0 and macd_value < 0 else
                         "Bullish Divergence" if macd_histogram > 0 and macd_value < 0 else
                         "Bearish Divergence"
            },
            "rsi": {
                "value": round(rsi),
                "interpretation": "Oversold" if rsi < 30 else
                                 "Overbought" if rsi > 70 else
                                 "Neutral"
            },
            "movingAverages": {
                "values": ma_values,
                "status": ma_status,
                "overall": ma_overall
            },
            "bollingerBands": bollinger_bands,
            "volume": {
                "current": round(base_price * random.uniform(100000, 5000000)),
                "average": round(base_price * random.uniform(100000, 5000000)),
                "change": round(volume_change, 2),
                "trend": "Increasing" if volume_change > 5 else
                         "Decreasing" if volume_change < -5 else
                         "Stable"
            },
            "supportResistance": {
                "support": support_levels,
                "resistance": resistance_levels,
                "nearestSupport": support_levels[0],
                "nearestResistance": resistance_levels[0]
            },
            "patterns": patterns
        }
        
        # Technical Summary
        strength_words = ["weak", "moderate", "strong", "very strong", "extremely strong"]
        momentum_direction = "bullish" if bullish else "bearish"
        momentum_strength = strength_words[random.randint(0, 4)]
        
        technical_summary = f"{stock_data['name']} is showing {momentum_strength} {momentum_direction} momentum on the technical indicators. "
        
        if rsi < 30:
            technical_summary += f"RSI at {round(rsi)} indicates oversold conditions that may lead to a potential reversal. "
        elif rsi > 70:
            technical_summary += f"RSI at {round(rsi)} shows overbought conditions that might signal caution. "
        else:
            technical_summary += f"RSI at {round(rsi)} is in a neutral zone. "
            
        technical_summary += f"MACD is showing a {indicators['macd']['trend'].lower()}, "
        technical_summary += f"and moving averages are overall {ma_overall.lower()}. "
        
        if bollinger_bands["percentB"] < 20:
            technical_summary += f"Price is near the lower Bollinger Band, suggesting potential oversold conditions."
        elif bollinger_bands["percentB"] > 80:
            technical_summary += f"Price is near the upper Bollinger Band, indicating potential overbought territory."
        else:
            technical_summary += f"Price is within the Bollinger Bands, showing moderate volatility."
        
        # Assemble final response
        result = {
            "symbol": symbol,
            "name": stock_data["name"],
            "currentPrice": base_price,
            "indicators": indicators,
            "summary": technical_summary,
            "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        return jsonify(result)
    except Exception as e:
        print(f"Error in get_stock_technical: {str(e)}")
        # Provide fallback technical data
        return generate_default_technical()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 