"""
IndiStockPredictor - Prediction Model Demo

This script demonstrates how the prediction models work using sample data.
For demo purposes, it uses a simplified version of the actual prediction pipeline.
"""

import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

# Add the parent directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Sample data generation for the demo
def generate_sample_data(symbol="RELIANCE", days=1000):
    """Generate synthetic stock data for demonstration"""
    np.random.seed(42)  # For reproducibility
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    date_range = pd.date_range(start=start_date, end=end_date, freq='B')
    
    # Start with a base price and add random walk
    base_price = 2000  # For example, Reliance
    price_series = [base_price]
    
    # Parameters for the random walk with drift and occasional jumps
    drift = 0.0002  # Small upward drift
    volatility = 0.015  # Daily volatility
    jump_probability = 0.02  # 2% chance of a significant jump
    
    for i in range(1, len(date_range)):
        # Random walk with drift
        daily_return = np.random.normal(drift, volatility)
        
        # Occasional jumps (earnings announcements, major news)
        if np.random.random() < jump_probability:
            jump_size = np.random.choice([-1, 1]) * np.random.uniform(0.03, 0.08)
            daily_return += jump_size
        
        # Calculate new price
        new_price = price_series[-1] * (1 + daily_return)
        price_series.append(new_price)
    
    # Create the dataframe
    df = pd.DataFrame({
        'date': date_range,
        'close': price_series,
    })
    
    # Generate other OHLCV data
    df['open'] = df['close'].shift(1) * (1 + np.random.normal(0, 0.005, len(df)))
    df['high'] = df[['open', 'close']].max(axis=1) * (1 + np.abs(np.random.normal(0, 0.005, len(df))))
    df['low'] = df[['open', 'close']].min(axis=1) * (1 - np.abs(np.random.normal(0, 0.005, len(df))))
    df['volume'] = np.random.normal(5000000, 2000000, len(df))
    df['volume'] = df['volume'].clip(1000000)  # Ensure minimum volume
    
    # Add some technical indicators
    df['sma_20'] = df['close'].rolling(window=20).mean()
    df['sma_50'] = df['close'].rolling(window=50).mean()
    df['rsi_14'] = calculate_rsi(df['close'], 14)
    
    df.fillna(method='bfill', inplace=True)
    df.set_index('date', inplace=True)
    
    return df

def calculate_rsi(series, period=14):
    """Calculate RSI technical indicator"""
    delta = series.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    
    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()
    
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    
    return rsi

class StockPredictor:
    """Stock price prediction using ensemble of models"""
    
    def __init__(self):
        self.rf_model = None
        self.lstm_model = None
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.feature_cols = ['open', 'high', 'low', 'close', 'volume', 'sma_20', 'sma_50', 'rsi_14']
        self.target_col = 'close'
        self.sequence_length = 10  # For LSTM
    
    def prepare_data(self, df, test_size=0.2):
        """Prepare data for training and testing"""
        # Scale the features
        scaled_data = self.scaler.fit_transform(df[self.feature_cols])
        scaled_df = pd.DataFrame(scaled_data, columns=self.feature_cols, index=df.index)
        
        # Split into train and test
        train_size = int(len(df) * (1 - test_size))
        train_df = scaled_df.iloc[:train_size]
        test_df = scaled_df.iloc[train_size:]
        
        # Original target values (unscaled) for evaluation
        y_train_orig = df[self.target_col].iloc[:train_size]
        y_test_orig = df[self.target_col].iloc[train_size:]
        
        # For Random Forest: use scaled features
        X_train_rf = train_df.values
        X_test_rf = test_df.values
        y_train_rf = y_train_orig.values
        y_test_rf = y_test_orig.values
        
        # For LSTM: create sequences
        X_train_lstm, y_train_lstm = self._create_sequences(train_df, y_train_orig)
        X_test_lstm, y_test_lstm = self._create_sequences(test_df, y_test_orig)
        
        return {
            'rf': (X_train_rf, y_train_rf, X_test_rf, y_test_rf),
            'lstm': (X_train_lstm, y_train_lstm, X_test_lstm, y_test_lstm),
            'test_dates': test_df.index,
            'y_test_orig': y_test_orig
        }
    
    def _create_sequences(self, X, y):
        """Create sequences for LSTM model"""
        X_seq, y_seq = [], []
        
        for i in range(len(X) - self.sequence_length):
            X_seq.append(X.iloc[i:i+self.sequence_length].values)
            y_seq.append(y.iloc[i+self.sequence_length])
        
        return np.array(X_seq), np.array(y_seq)
    
    def train_random_forest(self, X_train, y_train):
        """Train Random Forest model"""
        print("Training Random Forest model...")
        self.rf_model = RandomForestRegressor(
            n_estimators=100, 
            max_depth=20,
            random_state=42
        )
        self.rf_model.fit(X_train, y_train)
        print("Random Forest model trained.")
    
    def train_lstm(self, X_train, y_train):
        """Train LSTM model"""
        print("Training LSTM model...")
        self.lstm_model = Sequential([
            LSTM(50, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])),
            Dropout(0.2),
            LSTM(50),
            Dropout(0.2),
            Dense(1)
        ])
        
        self.lstm_model.compile(optimizer='adam', loss='mean_squared_error')
        self.lstm_model.fit(
            X_train, y_train,
            epochs=50,
            batch_size=32,
            verbose=1
        )
        print("LSTM model trained.")
    
    def predict_rf(self, X_test):
        """Make predictions with Random Forest model"""
        return self.rf_model.predict(X_test)
    
    def predict_lstm(self, X_test):
        """Make predictions with LSTM model"""
        return self.lstm_model.predict(X_test).flatten()
    
    def ensemble_predict(self, X_test_rf, X_test_lstm):
        """Combine predictions from both models"""
        # Predict with individual models
        rf_preds = self.predict_rf(X_test_rf)
        
        # Adjust the array sizes to match
        lstm_preds = self.predict_lstm(X_test_lstm)
        
        # Trim to the smallest size if needed
        min_size = min(len(rf_preds), len(lstm_preds))
        rf_preds = rf_preds[-min_size:]
        lstm_preds = lstm_preds[-min_size:]
        
        # Weighted ensemble prediction
        # Here we give more weight to LSTM for longer-term predictions
        ensemble_preds = 0.4 * rf_preds + 0.6 * lstm_preds
        
        return {
            'rf': rf_preds,
            'lstm': lstm_preds,
            'ensemble': ensemble_preds
        }
    
    def evaluate(self, y_true, predictions):
        """Evaluate model performance"""
        results = {}
        
        for model_name, preds in predictions.items():
            # Trim y_true to match prediction length if needed
            y_true_trimmed = y_true[-len(preds):]
            
            mse = mean_squared_error(y_true_trimmed, preds)
            mae = mean_absolute_error(y_true_trimmed, preds)
            rmse = np.sqrt(mse)
            r2 = r2_score(y_true_trimmed, preds)
            
            results[model_name] = {
                'MSE': mse,
                'MAE': mae,
                'RMSE': rmse,
                'R²': r2
            }
        
        return results
    
    def predict_future(self, df, days=30):
        """Predict future prices"""
        # Get the last sequence for LSTM
        last_sequence = df[self.feature_cols].tail(self.sequence_length).values
        last_sequence_scaled = self.scaler.transform(last_sequence)
        
        # Last know values for reference
        last_known_price = df['close'].iloc[-1]
        
        # Prepare for predictions
        future_dates = pd.date_range(
            start=df.index[-1] + timedelta(days=1),
            periods=days,
            freq='B'  # Business days
        )
        
        future_prices_rf = []
        future_prices_lstm = []
        future_prices_ensemble = []
        
        # Make predictions for each day
        current_features = last_sequence_scaled.copy()
        
        for _ in range(days):
            # RF prediction using last available features
            rf_pred = self.rf_model.predict(current_features[-1:].reshape(1, -1))[0]
            
            # LSTM prediction using sequence
            lstm_input = current_features[-self.sequence_length:].reshape(1, self.sequence_length, len(self.feature_cols))
            lstm_pred = self.lstm_model.predict(lstm_input)[0][0]
            
            # Ensemble prediction
            ensemble_pred = 0.4 * rf_pred + 0.6 * lstm_pred
            
            # Store predictions
            future_prices_rf.append(rf_pred)
            future_prices_lstm.append(lstm_pred)
            future_prices_ensemble.append(ensemble_pred)
            
            # Update features for next prediction (simplified approach)
            # In a real scenario, we'd need to update all features including indicators
            new_features = current_features[-1:].copy()
            new_features[0, self.feature_cols.index('close')] = lstm_pred  # Use LSTM pred for simplicity
            
            # Remove oldest day and append new prediction
            current_features = np.vstack([current_features[1:], new_features])
        
        # Create DataFrame with future predictions
        future_df = pd.DataFrame({
            'date': future_dates,
            'rf_prediction': future_prices_rf,
            'lstm_prediction': future_prices_lstm,
            'ensemble_prediction': future_prices_ensemble
        })
        future_df.set_index('date', inplace=True)
        
        return future_df, last_known_price

def plot_predictions(df, predictions, test_dates, model_name):
    """Plot actual vs predicted prices"""
    plt.figure(figsize=(12, 6))
    
    # Training data
    train_size = len(df) - len(test_dates)
    plt.plot(df.index[:train_size], df['close'][:train_size], 'b-', label='Training Data')
    
    # Test data (actual)
    plt.plot(test_dates, df['close'][-len(test_dates):], 'g-', label='Actual Prices')
    
    # Test data (predicted)
    plt.plot(test_dates[-len(predictions):], predictions, 'r--', label=f'{model_name} Predictions')
    
    plt.title(f'Stock Price Prediction using {model_name}')
    plt.xlabel('Date')
    plt.ylabel('Price (₹)')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    
    plot_dir = os.path.join(os.path.dirname(__file__), 'plots')
    os.makedirs(plot_dir, exist_ok=True)
    plt.savefig(os.path.join(plot_dir, f'{model_name.lower().replace(" ", "_")}_prediction.png'))
    plt.close()

def plot_future_predictions(future_df, last_known_price, symbol):
    """Plot future price predictions"""
    plt.figure(figsize=(12, 6))
    
    # Last known price as a reference point
    plt.axhline(y=last_known_price, color='g', linestyle='--', label='Last Known Price')
    
    # Future predictions
    plt.plot(future_df.index, future_df['rf_prediction'], 'b-', label='Random Forest Prediction')
    plt.plot(future_df.index, future_df['lstm_prediction'], 'r-', label='LSTM Prediction')
    plt.plot(future_df.index, future_df['ensemble_prediction'], 'purple', label='Ensemble Prediction')
    
    # Confidence interval (simplified, for demo purposes)
    plt.fill_between(
        future_df.index,
        future_df['ensemble_prediction'] * 0.95,
        future_df['ensemble_prediction'] * 1.05,
        color='gray', alpha=0.2,
        label='Confidence Interval (±5%)'
    )
    
    plt.title(f'Future Price Prediction for {symbol}')
    plt.xlabel('Date')
    plt.ylabel('Price (₹)')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    
    plot_dir = os.path.join(os.path.dirname(__file__), 'plots')
    os.makedirs(plot_dir, exist_ok=True)
    plt.savefig(os.path.join(plot_dir, 'future_prediction.png'))
    plt.close()

def generate_recommendation(future_df, last_known_price):
    """Generate a buy/hold/sell recommendation based on predictions"""
    # Get the ensemble prediction for 5, 15, and 30 days in the future
    short_term = future_df['ensemble_prediction'].iloc[4]  # 5 business days
    medium_term = future_df['ensemble_prediction'].iloc[14] if len(future_df) > 14 else future_df['ensemble_prediction'].iloc[-1]  # 15 business days
    long_term = future_df['ensemble_prediction'].iloc[-1]  # 30 business days
    
    # Calculate expected returns
    short_term_return = (short_term - last_known_price) / last_known_price * 100
    medium_term_return = (medium_term - last_known_price) / last_known_price * 100
    long_term_return = (long_term - last_known_price) / last_known_price * 100
    
    # Technical score (simplified demo)
    technical_score = 0
    
    # Short-term trend (5 days)
    if short_term_return > 5:
        technical_score += 30
    elif short_term_return > 2:
        technical_score += 20
    elif short_term_return > 0:
        technical_score += 10
    elif short_term_return > -2:
        technical_score += 5
    
    # Medium-term trend (15 days)
    if medium_term_return > 10:
        technical_score += 30
    elif medium_term_return > 5:
        technical_score += 20
    elif medium_term_return > 0:
        technical_score += 10
    elif medium_term_return > -5:
        technical_score += 5
    
    # Long-term trend (30 days)
    if long_term_return > 15:
        technical_score += 40
    elif long_term_return > 10:
        technical_score += 30
    elif long_term_return > 5:
        technical_score += 20
    elif long_term_return > 0:
        technical_score += 10
    
    # Generate recommendation based on technical score
    if technical_score >= 75:
        recommendation = "Strong Buy"
    elif technical_score >= 60:
        recommendation = "Buy"
    elif technical_score >= 40:
        recommendation = "Hold"
    elif technical_score >= 25:
        recommendation = "Sell"
    else:
        recommendation = "Strong Sell"
    
    return {
        "recommendation": recommendation,
        "technical_score": technical_score,
        "short_term_return": short_term_return,
        "medium_term_return": medium_term_return,
        "long_term_return": long_term_return,
        "reasoning": [
            f"Expected 5-day return: {short_term_return:.2f}%",
            f"Expected 15-day return: {medium_term_return:.2f}%",
            f"Expected 30-day return: {long_term_return:.2f}%"
        ]
    }

def print_recommendation(recommendation, symbol):
    """Print recommendation in a nice format"""
    rec = recommendation["recommendation"]
    
    # Set color based on recommendation
    if rec == "Strong Buy":
        color_code = "\033[92m"  # Green
    elif rec == "Buy":
        color_code = "\033[92m"  # Green
    elif rec == "Hold":
        color_code = "\033[93m"  # Yellow
    elif rec == "Sell":
        color_code = "\033[91m"  # Red
    else:  # Strong Sell
        color_code = "\033[91m"  # Red
    
    reset_code = "\033[0m"
    
    print("\n" + "=" * 50)
    print(f"RECOMMENDATION FOR {symbol}: {color_code}{rec}{reset_code}")
    print("=" * 50)
    print(f"Technical Score: {recommendation['technical_score']}/100")
    print("\nExpected Returns:")
    print(f"  5-Day:  {recommendation['short_term_return']:.2f}%")
    print(f"  15-Day: {recommendation['medium_term_return']:.2f}%")
    print(f"  30-Day: {recommendation['long_term_return']:.2f}%")
    print("\nReasoning:")
    for reason in recommendation["reasoning"]:
        print(f"  - {reason}")
    print("=" * 50 + "\n")

def main():
    """Main function to demonstrate the prediction pipeline"""
    symbol = "RELIANCE"
    
    print(f"\nIndiStockPredictor - Prediction Demo for {symbol}")
    print("=" * 50)
    print("Generating sample data...")
    
    # Generate sample data
    df = generate_sample_data(symbol)
    print(f"Generated {len(df)} days of sample data")
    
    # Initialize predictor
    predictor = StockPredictor()
    
    # Prepare data
    print("Preparing data for training and testing...")
    data = predictor.prepare_data(df)
    
    # Train Random Forest model
    predictor.train_random_forest(data['rf'][0], data['rf'][1])
    
    # Train LSTM model
    predictor.train_lstm(data['lstm'][0], data['lstm'][1])
    
    # Make predictions
    print("Making predictions...")
    predictions = predictor.ensemble_predict(
        data['rf'][2], 
        data['lstm'][2]
    )
    
    # Evaluate models
    print("Evaluating models...")
    evaluation = predictor.evaluate(data['y_test_orig'], predictions)
    
    # Print evaluation results
    print("\nModel Evaluation Results:")
    for model_name, metrics in evaluation.items():
        print(f"\n{model_name.upper()} Model:")
        for metric_name, value in metrics.items():
            print(f"  {metric_name}: {value:.4f}")
    
    # Plot predictions
    print("\nPlotting predictions...")
    for model_name, preds in predictions.items():
        plot_predictions(df, preds, data['test_dates'], model_name.capitalize())
    
    # Predict future prices
    print("\nPredicting future prices...")
    future_df, last_known_price = predictor.predict_future(df)
    
    # Plot future predictions
    plot_future_predictions(future_df, last_known_price, symbol)
    
    # Generate recommendation
    recommendation = generate_recommendation(future_df, last_known_price)
    
    # Print recommendation
    print_recommendation(recommendation, symbol)
    
    print(f"Plots saved to {os.path.abspath(os.path.join(os.path.dirname(__file__), 'plots'))}")
    print("Demo completed successfully!")

if __name__ == "__main__":
    main() 