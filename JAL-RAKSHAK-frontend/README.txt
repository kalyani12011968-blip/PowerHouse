JAL-RAKSHAK AI/ML

Files:
train.py - trains event, anomaly and risk models
predict.py - loads saved models and predicts a new reading
requirements.txt - Python dependencies

Google Colab:
1. Upload jal_rakshak_synthetic_1M.csv
2. Upload train.py and predict.py
3. Run: !pip install -r requirements.txt
4. Run: !python train.py
5. Run: !python predict.py

Models:
jal_rakshak_event_classifier.pkl
jal_rakshak_anomaly_detector.pkl
jal_rakshak_risk_model.pkl
water_trend_encoder.pkl
device_encoder.pkl
jal_rakshak_features.pkl
jal_rakshak_anomaly_features.pkl
