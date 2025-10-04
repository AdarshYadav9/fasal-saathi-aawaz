import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
import json
import os

class SoilCropRecommender:
    def __init__(self, model_path="models/soil_classifier.h5", 
                 class_indices_path="models/class_indices.json",
                 mapping_csv="soil_crop_mapping.csv"):
        """
        Initialize the Soil Crop Recommender
        
        Args:
            model_path: Path to the trained soil classifier model
            class_indices_path: Path to the class indices JSON file
            mapping_csv: Path to the soil-crop mapping CSV file
        """
        self.model = None
        self.class_indices = None
        self.mapping_df = None
        
        # Load model and data
        self.load_model(model_path)
        self.load_class_indices(class_indices_path)
        self.load_mapping(mapping_csv)
    
    def load_model(self, model_path):
        """Load the trained soil classifier model"""
        try:
            if os.path.exists(model_path):
                self.model = load_model(model_path)
                print(f"Model loaded successfully from {model_path}")
            else:
                print(f"Model file not found at {model_path}")
                print("Please train the model first using train_soil_classifier.py")
        except Exception as e:
            print(f"Error loading model: {e}")
    
    def load_class_indices(self, class_indices_path):
        """Load class indices from JSON file"""
        try:
            if os.path.exists(class_indices_path):
                with open(class_indices_path, 'r') as f:
                    self.class_indices = json.load(f)
                print(f"Class indices loaded successfully")
            else:
                print(f"Class indices file not found at {class_indices_path}")
        except Exception as e:
            print(f"Error loading class indices: {e}")
    
    def load_mapping(self, mapping_csv):
        """Load soil-crop mapping from CSV file"""
        try:
            if os.path.exists(mapping_csv):
                self.mapping_df = pd.read_csv(mapping_csv)
                print(f"Soil-crop mapping loaded successfully")
            else:
                print(f"Mapping CSV file not found at {mapping_csv}")
        except Exception as e:
            print(f"Error loading mapping: {e}")
    
    def preprocess_image(self, img_path, target_size=(224, 224)):
        """
        Preprocess image for prediction
        
        Args:
            img_path: Path to the image file
            target_size: Target size for the image
            
        Returns:
            Preprocessed image array
        """
        try:
            # Load and resize image
            img = image.load_img(img_path, target_size=target_size)
            
            # Convert to array and normalize
            img_array = image.img_to_array(img)
            img_array = img_array / 255.0
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            
            return img_array
        except Exception as e:
            print(f"Error preprocessing image: {e}")
            return None
    
    def predict_soil_type(self, img_path):
        """
        Predict soil type from image
        
        Args:
            img_path: Path to the soil image
            
        Returns:
            Dictionary with soil type and confidence
        """
        if self.model is None:
            return {"error": "Model not loaded"}
        
        # Preprocess image
        img_array = self.preprocess_image(img_path)
        if img_array is None:
            return {"error": "Image preprocessing failed"}
        
        try:
            # Make prediction
            predictions = self.model.predict(img_array, verbose=0)
            class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][class_idx])
            
            # Get soil type name
            if self.class_indices:
                # Reverse the class_indices dictionary
                idx_to_class = {v: k for k, v in self.class_indices.items()}
                soil_type = idx_to_class.get(class_idx, "Unknown")
            else:
                soil_type = f"Class_{class_idx}"
            
            return {
                "soil_type": soil_type,
                "confidence": confidence,
                "all_predictions": {
                    idx_to_class.get(i, f"Class_{i}"): float(pred) 
                    for i, pred in enumerate(predictions[0])
                } if self.class_indices else {}
            }
        except Exception as e:
            return {"error": f"Prediction failed: {e}"}
    
    def get_crop_recommendations(self, soil_type):
        """
        Get crop recommendations based on soil type
        
        Args:
            soil_type: Predicted soil type
            
        Returns:
            Dictionary with crop recommendations
        """
        if self.mapping_df is None:
            return {"error": "Mapping data not loaded"}
        
        try:
            # Find matching soil type (case-insensitive)
            soil_match = self.mapping_df[
                self.mapping_df['Soil_Type'].str.lower() == soil_type.lower()
            ]
            
            if soil_match.empty:
                return {
                    "error": f"No recommendations found for soil type: {soil_type}",
                    "available_soil_types": self.mapping_df['Soil_Type'].tolist()
                }
            
            # Get the first match
            rec = soil_match.iloc[0]
            
            return {
                "soil_type": rec['Soil_Type'],
                "recommended_crops": rec['Crop'],
                "suitable_season": rec['Season'],
                "description": rec.get('Description', ''),
                "crops_list": [crop.strip() for crop in rec['Crop'].split(',')],
                "seasons_list": [season.strip() for season in rec['Season'].split(',')]
            }
        except Exception as e:
            return {"error": f"Recommendation failed: {e}"}
    
    def predict_crop(self, img_path):
        """
        Complete pipeline: Soil image → Crop recommendations
        
        Args:
            img_path: Path to the soil image
            
        Returns:
            Dictionary with complete recommendations
        """
        # Step 1: Predict soil type
        soil_prediction = self.predict_soil_type(img_path)
        
        if "error" in soil_prediction:
            return soil_prediction
        
        # Step 2: Get crop recommendations
        crop_recommendations = self.get_crop_recommendations(soil_prediction["soil_type"])
        
        if "error" in crop_recommendations:
            return crop_recommendations
        
        # Combine results
        return {
            "success": True,
            "soil_prediction": soil_prediction,
            "crop_recommendations": crop_recommendations,
            "summary": {
                "detected_soil_type": soil_prediction["soil_type"],
                "confidence": soil_prediction["confidence"],
                "recommended_crops": crop_recommendations["recommended_crops"],
                "suitable_season": crop_recommendations["suitable_season"],
                "description": crop_recommendations["description"]
            }
        }

def main():
    """Example usage of the SoilCropRecommender"""
    # Initialize the recommender
    recommender = SoilCropRecommender()
    
    # Example prediction (replace with actual image path)
    img_path = "Dataset/Soil types/Black Soil/10.jpg"  # Example image
    
    if os.path.exists(img_path):
        print(f"Analyzing image: {img_path}")
        result = recommender.predict_crop(img_path)
        
        print("\n" + "="*50)
        print("SOIL ANALYSIS & CROP RECOMMENDATIONS")
        print("="*50)
        
        if result.get("success"):
            summary = result["summary"]
            print(f"Soil Type: {summary['detected_soil_type']}")
            print(f"Confidence: {summary['confidence']:.2%}")
            print(f"Description: {summary['description']}")
            print(f"Recommended Crops: {summary['recommended_crops']}")
            print(f"Suitable Season: {summary['suitable_season']}")
        else:
            print(f"Error: {result.get('error', 'Unknown error')}")
    else:
        print(f"Image not found: {img_path}")
        print("Please provide a valid image path")

if __name__ == "__main__":
    main()
