from flask import Flask, render_template, request, jsonify
import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
import os

import matplotlib
matplotlib.use("Agg")

from flask_cors import CORS


def get_soil_category(score):
    if score == 0:
        return "No Soil Health Data"
    elif score >= 4.5:
        return "Very Excellent Soil Health"
    elif score >= 4:
        return "Excellent Soil Health"
    elif score >= 3:
        return "Good Soil Health"
    elif score >= 2:
        return "Poor Soil Health"
    else:
        return "Very Poor Soil Health"

def calculate_climate_score(yield_cat, soil_cat):
    score_map = {
        "Highly Recommended Crop": 90,
        "Good Crop": 70,
        "Poor Crop": 50,
        "Very Poor Crop": 30,
        "Very Excellent Soil Health": 95,
        "Excellent Soil Health": 85,
        "Good Soil Health": 65,
        "Poor Soil Health": 45,
        "Very Poor Soil Health": 25,
        "No Soil Health Data": 0
    }
    return int((score_map[yield_cat] * 0.6) + (score_map[soil_cat] * 0.4))

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'static'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

yield_file = 'ICRISAT-District_Level_Data_30_Years.csv'
soil_file = 'SoilHealthScores_by_District_2.csv'

yield_df = pd.read_csv(yield_file)
soil_df = pd.read_csv(soil_file)
soil_df['Soil_Category'] = soil_df['SoilHealthScore'].apply(get_soil_category)

yield_columns = [col for col in yield_df.columns if 'YIELD (Kg per ha)' in col]
base_crop_names = {col.split(' YIELD')[0]: col for col in yield_columns}

@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('index.html', crops=base_crop_names.keys())

@app.route('/api/crops', methods=['GET'])
def get_crops():
    return jsonify({"crops": list(base_crop_names.keys())})

@app.route('/predict', methods=['POST'])
def predict():
    crop_input = request.form.get('crop')
    district_input = request.form.get('district')
    land_area = request.form.get('land_area')
    print(crop_input)

    if not crop_input or not district_input or crop_input not in base_crop_names:
        return "Invalid input. Please enter a valid crop and district.", 400

    yield_col = base_crop_names[crop_input]
    district_yield = yield_df[yield_df['Dist Name'] == district_input]
    district_soil = soil_df[soil_df['Dist Name'] == district_input]

    if district_yield.empty or district_soil.empty:
        return "District data not found.", 400 

    ts_data = district_yield[['Year', yield_col]].dropna()
    ts_data.columns = ['ds', 'y']
    ts_data['ds'] = pd.to_datetime(ts_data['ds'], format='%Y')

    model = Prophet(yearly_seasonality=True, growth='flat')
    model.fit(ts_data)

    future = model.make_future_dataframe(periods=1, freq='YS')
    forecast = model.predict(future)
    predicted_yield = max(forecast.iloc[-1]['yhat'], 0)

    if predicted_yield > 1000:
        yield_cat = "Highly Recommended Crop"
        color = "green"
    elif predicted_yield > 500:
        yield_cat = "Good Crop"
        color = "yellow"
    elif predicted_yield > 200:
        yield_cat = "Poor Crop"
        color = "orange"
    else:
        yield_cat = "Very Poor Crop"
        color = "red"

    soil_score = district_soil['SoilHealthScore'].values[0]
    soil_cat = district_soil['Soil_Category'].values[0]
    climate_score = calculate_climate_score(yield_cat, soil_cat)

    plt.figure(figsize=(10, 5))
    model.plot(forecast)
    image_path = os.path.join(UPLOAD_FOLDER, "forecast.png")
    plt.savefig(image_path)
    plt.close()
    loan_amount = calculate_loan(crop_input,predicted_yield, yield_cat, soil_cat, climate_score)

    

        # 

    best_crop = None
    max_yield = 0
    for crop, column in base_crop_names.items():
        ts_data = district_yield[['Year', column]].dropna()
        ts_data.columns = ['ds', 'y']
        ts_data['ds'] = pd.to_datetime(ts_data['ds'], format='%Y')
        if len(ts_data) >= 5:
            model = Prophet(yearly_seasonality=True, growth='flat')
            model.fit(ts_data)
            future = model.make_future_dataframe(periods=1, freq='YS')
            forecast = model.predict(future)
            predicted_yield = max(forecast.iloc[-1]['yhat'], 0)
            if predicted_yield > max_yield:
                max_yield = predicted_yield
                best_crop = crop
    if best_crop:
        print(f"\n{'='*40}")
        print(f"Maximum Yield Prediction for {district_input}:")
        print(f"Best Crop: {best_crop}")
        print(f"Predicted Yield: {max_yield:.2f} Kg/ha (HighlyRecommended Crop)")
        print(f"{'='*40}")
        # 
    
    plt.figure(figsize=(10, 5))
    ts_data = district_yield[['Year', yield_col]].dropna()
    ts_data.columns = ['ds', 'y']
    ts_data['ds'] = pd.to_datetime(ts_data['ds'], format='%Y')
    plt.plot(ts_data['ds'], ts_data['y'], label=f'{crop_input} Yield')

    best_crop_data = district_yield[['Year', base_crop_names[best_crop]]].dropna()
    best_crop_data.columns = ['ds', 'y']
    best_crop_data['ds'] = pd.to_datetime(best_crop_data['ds'], format='%Y')
    plt.plot(best_crop_data['ds'], best_crop_data['y'], label=f'{best_crop} Yield', linestyle='--')

    plt.xlabel('Year')

    plt.ylabel('Yield (Kg/ha)')
    plt.title(f"Yield Comparison for {crop_input} and Best Crop ({best_crop}) in {district_input}")
    plt.legend()
    image_path2 = os.path.join(UPLOAD_FOLDER, "forecast2.png")
    plt.grid(True)
    plt.savefig(image_path2)
    plt.close()
    # plt.show()
    result = {
        "crop": crop_input,
        "district": district_input,
        "predicted_yield": (f"{round(predicted_yield, 2)}Kg/ha"),
        "loan_amount": float(loan_amount)*float(land_area),
        "best_crop": best_crop,
        "yield_cat": yield_cat,
        "color": color,
        "soil_health": soil_cat,
        "climate_score": climate_score
    }


    return render_template('index.html', result=result, image_path=image_path, image_path2=image_path2,crops=base_crop_names.keys())

def calculate_loan(c,predicted_yield, yield_cat, soil_cat, climate_score):
    # base_loan = 50000  # Base loan amount in INR
    crop_base_prices_per_hectare = {
    "RICE": 75000,
    "WHEAT": 65000,
    "KHARIF SORGHUM": 60000,
    "RABI SORGHUM": 62000,
    "SORGHUM": 61000,
    "PEARL MILLET": 50000,
    "MAIZE": 55000,
    "FINGER MILLET": 77000,
    "BARLEY": 48000,
    "CHICKPEA": 90000,
    "PIGEONPEA": 95000,
    "MINOR PULSES": 85000,
    "GROUNDNUT": 110000,
    "SESAMUM": 130000,
    "RAPESEED AND MUSTARD": 100000,
    "SAFFLOWER": 95000,
    "CASTOR": 88000,
    "LINSEED": 90000,
    "SUNFLOWER": 102000,
    "SOYABEAN": 98000,
    "OILSEEDS": 94000,
    "SUGARCANE": 150000,
    "COTTON": 120000
    }
    base_loan = crop_base_prices_per_hectare[c]
    # Yield category weightage
    yield_multiplier = {
        "Highly Recommended Crop": 1.5,
        "Good Crop": 1.2,
        "Poor Crop": 0.8,
        "Very Poor Crop": 0.5
    }

    # Soil health weightage
    soil_multiplier = {
        "Very Excellent Soil Health": 1.5,
        "Excellent Soil Health": 1.3,
        "Good Soil Health": 1.1,
        "Poor Soil Health": 0.9,
        "Very Poor Soil Health": 0.7,
        "No Soil Health Data": 0.5
    }

    # Climate score impact (normalized)
    climate_multiplier = climate_score / 100

    # Calculate final loan amount
    loan_amount = base_loan * yield_multiplier[yield_cat] * soil_multiplier[soil_cat] * climate_multiplier
    return round(loan_amount, 2)  # Return rounded loan amount

@app.route('/api/predict', methods=['GET'])
def api_predict():
    crop_input = request.args.get('crop')
    district_input = request.args.get('district')
    area = request.args.get('land')

    if not crop_input or not district_input:
        return jsonify({"error": "Missing crop or district in request."}), 400

    return predict2(crop_input, district_input, area)



@app.route('/predict2', methods=['POST'])
def predict2(c, d, a):
    crop_input = c
    district_input = d
    area = a

    if not crop_input or not district_input or crop_input not in base_crop_names:
        return jsonify({"error": "Invalid input. Please enter a valid crop and district."}), 400

    yield_col = base_crop_names[crop_input]
    district_yield = yield_df[yield_df['Dist Name'] == district_input]
    district_soil = soil_df[soil_df['Dist Name'] == district_input]

    if district_yield.empty or district_soil.empty:
        return jsonify({"error": "District data not found."}), 400

    ts_data = district_yield[['Year', yield_col]].dropna()
    ts_data.columns = ['ds', 'y']
    ts_data['ds'] = pd.to_datetime(ts_data['ds'], format='%Y')

    model = Prophet(yearly_seasonality=True, growth='flat')
    model.fit(ts_data)

    future = model.make_future_dataframe(periods=1, freq='YS')
    forecast = model.predict(future)
    predicted_yield = max(forecast.iloc[-1]['yhat'], 0)

    if predicted_yield > 1000:
        yield_cat = "Highly Recommended Crop"
        color = "green"
    elif predicted_yield > 500:
        yield_cat = "Good Crop"
        color = "yellow"
    elif predicted_yield > 200:
        yield_cat = "Poor Crop"
        color = "orange"
    else:
        yield_cat = "Very Poor Crop"
        color = "red"

    soil_score = district_soil['SoilHealthScore'].values[0]
    soil_cat = district_soil['Soil_Category'].values[0]
    climate_score = calculate_climate_score(yield_cat, soil_cat)

    # Calculate Loan Amount
    loan_amount = calculate_loan(crop_input,predicted_yield, yield_cat, soil_cat, climate_score)
# 

    best_crop = None
    max_yield = 0
    for crop, column in base_crop_names.items():
        ts_data = district_yield[['Year', column]].dropna()
        ts_data.columns = ['ds', 'y']
        ts_data['ds'] = pd.to_datetime(ts_data['ds'], format='%Y')
        if len(ts_data) >= 5:
            model = Prophet(yearly_seasonality=True, growth='flat')
            model.fit(ts_data)
            future = model.make_future_dataframe(periods=1, freq='YS')
            forecast = model.predict(future)
            predicted_yield = max(forecast.iloc[-1]['yhat'], 0)
            if predicted_yield > max_yield:
                max_yield = predicted_yield
                best_crop = crop
    if best_crop:
        print(f"\n{'='*40}")
        print(f"Maximum Yield Prediction for {district_input}:")
        print(f"Best Crop: {best_crop}")
        print(f"Predicted Yield: {max_yield:.2f} Kg/ha (Highly Recommended Crop)")
        print(f"{'='*40}")

    top_crops = []
    crop_yields = []

    for crop, column in base_crop_names.items():
        ts_data = district_yield[['Year', column]].dropna()
        ts_data.columns = ['ds', 'y']
        ts_data['ds'] = pd.to_datetime(ts_data['ds'], format='%Y')

        if len(ts_data) >= 5:
            model = Prophet(yearly_seasonality=True, growth='flat')
            model.fit(ts_data)
            future = model.make_future_dataframe(periods=1, freq='YS')
            forecast = model.predict(future)
            predicted_yield = max(forecast.iloc[-1]['yhat'], 0)

            crop_yields.append((crop, predicted_yield))

    # Sort crops by predicted yield in descending order and get top 3
    top_crops = sorted(crop_yields, key=lambda x: x[1], reverse=True)[:3]

    # Convert to array format
    top_crops_array = [crop for crop, yield_value in top_crops]

    print(top_crops_array)



    import json

    # Extracting data points from the original crop
    ts_data = district_yield[['Year', yield_col]].dropna()
    ts_data.columns = ['ds', 'y']
    ts_data['ds'] = pd.to_datetime(ts_data['ds'], format='%Y')

    ts_data_json = [{"Year": str(year.year), "Yield": yield_value} for year, yield_value in zip(ts_data['ds'], ts_data['y'])]

    # Extracting data points for the best crop
    best_crop_data = district_yield[['Year', base_crop_names[best_crop]]].dropna()
    best_crop_data.columns = ['ds', 'y']
    best_crop_data['ds'] = pd.to_datetime(best_crop_data['ds'], format='%Y')

    best_crop_data_json = [{"Year": str(year.year), "Yield": yield_value} for year, yield_value in zip(best_crop_data['ds'], best_crop_data['y'])]

   
# 
    result = {
        "crop": crop_input,
        "district": district_input,
        "predicted_yield": f"{round(predicted_yield, 2)} Kg/ha",
        "yield_category": yield_cat,
        "best_crop": top_crops_array,
        "soil_health": soil_cat,
        "score": climate_score,
        "loan_amount": f"{float(loan_amount)*float(area)}",
        
    }


    return jsonify(result), 200
@app.route('/api/map', methods=['GET'])
def api_map():
    crop_input = request.args.get('crop')
    district_input = request.args.get('district')
    area = request.args.get('land')

    if not crop_input or not district_input:
        return jsonify({"error": "Missing crop or district in request."}), 400

    return map(crop_input, district_input, area)
@app.route('/map', methods=['POST'])
def map(c, d, a):
    crop_input = c
    district_input = d
    area = a

    if not crop_input or not district_input or crop_input not in base_crop_names:
        return jsonify({"error": "Invalid input. Please enter a valid crop and district."}), 400

    yield_col = base_crop_names[crop_input]
    district_yield = yield_df[yield_df['Dist Name'] == district_input]
    district_soil = soil_df[soil_df['Dist Name'] == district_input]

    if district_yield.empty or district_soil.empty:
        return jsonify({"error": "District data not found."}), 400

    ts_data = district_yield[['Year', yield_col]].dropna()
    ts_data.columns = ['ds', 'y']
    ts_data['ds'] = pd.to_datetime(ts_data['ds'], format='%Y')

    model = Prophet(yearly_seasonality=True, growth='flat')
    model.fit(ts_data)

    future = model.make_future_dataframe(periods=1, freq='YS')
    forecast = model.predict(future)
    predicted_yield = max(forecast.iloc[-1]['yhat'], 0)

    if predicted_yield > 1000:
        yield_cat = "Highly Recommended Crop"
        color = "green"
    elif predicted_yield > 500:
        yield_cat = "Good Crop"
        color = "yellow"
    elif predicted_yield > 200:
        yield_cat = "Poor Crop"
        color = "orange"
    else:
        yield_cat = "Very Poor Crop"
        color = "red"

    soil_score = district_soil['SoilHealthScore'].values[0]
    soil_cat = district_soil['Soil_Category'].values[0]
    climate_score = calculate_climate_score(yield_cat, soil_cat)

    # Calculate Loan Amount
    loan_amount = calculate_loan(crop_input,predicted_yield, yield_cat, soil_cat, climate_score)
# 

    best_crop = None
    max_yield = 0
    for crop, column in base_crop_names.items():
        ts_data = district_yield[['Year', column]].dropna()
        ts_data.columns = ['ds', 'y']
        ts_data['ds'] = pd.to_datetime(ts_data['ds'], format='%Y')
        if len(ts_data) >= 5:
            model = Prophet(yearly_seasonality=True, growth='flat')
            model.fit(ts_data)
            future = model.make_future_dataframe(periods=1, freq='YS')
            forecast = model.predict(future)
            predicted_yield = max(forecast.iloc[-1]['yhat'], 0)
            if predicted_yield > max_yield:
                max_yield = predicted_yield
                best_crop = crop
    if best_crop:
        print(f"\n{'='*40}")
        print(f"Maximum Yield Prediction for {district_input}:")
        print(f"Best Crop: {best_crop}")
        print(f"Predicted Yield: {max_yield:.2f} Kg/ha (Highly Recommended Crop)")
        print(f"{'='*40}")


    import json

    # Extracting data points from the original crop
    ts_data = district_yield[['Year', yield_col]].dropna()
    ts_data.columns = ['ds', 'y']
    ts_data['ds'] = pd.to_datetime(ts_data['ds'], format='%Y')

    ts_data_json = [{"Year": str(year.year), "Yield": yield_value} for year, yield_value in zip(ts_data['ds'], ts_data['y'])]

    # Extracting data points for the best crop
    best_crop_data = district_yield[['Year', base_crop_names[best_crop]]].dropna()
    best_crop_data.columns = ['ds', 'y']
    best_crop_data['ds'] = pd.to_datetime(best_crop_data['ds'], format='%Y')

    best_crop_data_json = [{"Year": str(year.year), "Yield": yield_value} for year, yield_value in zip(best_crop_data['ds'], best_crop_data['y'])]

   
#   
    result = {
        
        "ts_data": ts_data_json,
        "best_crop_data": best_crop_data_json
        
    }

    # result.headers.add("Access-Control-Allow-Origin","*")
    return jsonify(result), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0' ,debug=True)