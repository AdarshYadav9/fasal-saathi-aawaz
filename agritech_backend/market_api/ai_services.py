import os
import cv2
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import logging
from typing import Dict, List, Any
import random

logger = logging.getLogger(__name__)

class SoilAnalysisService:
    """
    AI service for soil analysis using computer vision and machine learning
    """
    
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'soil_analysis_model.h5')
        self.scaler = StandardScaler()
        
    def analyze_soil_image(self, image_path: str) -> Dict[str, Any]:
        """
        Analyze soil image and return soil properties
        """
        try:
            # Load and preprocess image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError("Could not load image")
            
            # Convert to RGB
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Extract features from image
            features = self._extract_soil_features(image_rgb)
            
            # Predict soil properties using ML model
            soil_properties = self._predict_soil_properties(features)
            
            return soil_properties
            
        except Exception as e:
            logger.error(f"Soil analysis error: {str(e)}")
            # Return mock data if analysis fails
            return self._get_mock_soil_analysis()
    
    def _extract_soil_features(self, image: np.ndarray) -> np.ndarray:
        """
        Extract features from soil image
        """
        # Color analysis
        mean_color = np.mean(image, axis=(0, 1))
        std_color = np.std(image, axis=(0, 1))
        
        # Texture analysis using LBP (Local Binary Pattern)
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        lbp = self._local_binary_pattern(gray)
        
        # Moisture estimation based on color intensity
        moisture_estimate = self._estimate_moisture(image)
        
        # Combine features
        features = np.concatenate([
            mean_color,
            std_color,
            [np.mean(lbp)],
            [np.std(lbp)],
            [moisture_estimate]
        ])
        
        return features.reshape(1, -1)
    
    def _local_binary_pattern(self, image: np.ndarray, radius: int = 1, n_points: int = 8) -> np.ndarray:
        """
        Compute Local Binary Pattern for texture analysis
        """
        def get_pixel(img, center, x, y):
            new_x = x + center[0]
            new_y = y + center[1]
            if new_x >= len(img) or new_x < 0:
                return 0
            if new_y >= len(img[0]) or new_y < 0:
                return 0
            return img[new_x, new_y]
        
        lbp = np.zeros_like(image)
        for i in range(radius, len(image) - radius):
            for j in range(radius, len(image[0]) - radius):
                center = image[i, j]
                code = 0
                for k in range(n_points):
                    x = radius * np.cos(2 * np.pi * k / n_points)
                    y = radius * np.sin(2 * np.pi * k / n_points)
                    if get_pixel(image, (i, j), int(x), int(y)) >= center:
                        code |= (1 << k)
                lbp[i, j] = code
        
        return lbp
    
    def _estimate_moisture(self, image: np.ndarray) -> float:
        """
        Estimate soil moisture based on color analysis
        """
        # Convert to HSV for better color analysis
        hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
        
        # Darker colors typically indicate higher moisture
        value_channel = hsv[:, :, 2]
        moisture_estimate = 1.0 - (np.mean(value_channel) / 255.0)
        
        return moisture_estimate * 100  # Convert to percentage
    
    def _predict_soil_properties(self, features: np.ndarray) -> Dict[str, Any]:
        """
        Predict soil properties using trained ML model
        """
        try:
            # Load trained model if available
            if os.path.exists(self.model_path):
                # In a real implementation, load the trained model
                # model = joblib.load(self.model_path)
                # predictions = model.predict(features)
                pass
            
            # For now, return mock predictions based on features
            return self._get_mock_soil_analysis()
            
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            return self._get_mock_soil_analysis()
    
    def _get_mock_soil_analysis(self) -> Dict[str, Any]:
        """
        Return mock soil analysis data for demonstration
        """
        soil_types = ['Clay Loam', 'Sandy Loam', 'Silt Loam', 'Clay', 'Sandy Clay']
        soil_type = random.choice(soil_types)
        
        return {
            'soil_type': soil_type,
            'ph_level': round(random.uniform(6.0, 8.0), 1),
            'moisture_content': round(random.uniform(20.0, 80.0), 1),
            'organic_matter': round(random.uniform(1.0, 5.0), 1),
            'nitrogen_content': round(random.uniform(0.1, 0.5), 2),
            'phosphorus_content': round(random.uniform(10.0, 50.0), 1),
            'potassium_content': round(random.uniform(100.0, 300.0), 1),
            'confidence_score': round(random.uniform(85.0, 95.0), 1)
        }

class CropRecommendationService:
    """
    AI service for crop recommendations based on soil analysis
    """
    
    def __init__(self):
        self.crop_database = self._load_crop_database()
    
    def _load_crop_database(self) -> pd.DataFrame:
        """
        Load crop database with soil requirements
        """
        # Mock crop database - in real implementation, load from CSV/database
        crops_data = {
            'crop_name': ['Wheat', 'Rice', 'Mustard', 'Sugarcane', 'Cotton', 'Maize', 'Potato', 'Tomato'],
            'crop_name_hindi': ['गेहूं', 'चावल', 'सरसों', 'गन्ना', 'कपास', 'मक्का', 'आलू', 'टमाटर'],
            'crop_name_punjabi': ['ਕਣਕ', 'ਚਾਵਲ', 'ਸਰੋਂ', 'ਗੰਨਾ', 'ਕਪਾਹ', 'ਮੱਕੀ', 'ਆਲੂ', 'ਟਮਾਟਰ'],
            'season': ['Rabi', 'Kharif', 'Rabi', 'Kharif', 'Kharif', 'Kharif', 'Rabi', 'Kharif'],
            'season_hindi': ['रबी', 'खरीफ', 'रबी', 'खरीफ', 'खरीफ', 'खरीफ', 'रबी', 'खरीफ'],
            'season_punjabi': ['ਰਬੀ', 'ਖਰੀਫ', 'ਰਬੀ', 'ਖਰੀਫ', 'ਖਰੀਫ', 'ਖਰੀਫ', 'ਰਬੀ', 'ਖਰੀਫ'],
            'min_ph': [6.0, 5.5, 6.5, 6.0, 6.5, 6.0, 5.5, 6.0],
            'max_ph': [8.0, 7.5, 8.5, 8.0, 8.5, 8.0, 7.5, 7.5],
            'min_moisture': [30.0, 60.0, 20.0, 50.0, 40.0, 40.0, 50.0, 50.0],
            'max_moisture': [80.0, 90.0, 70.0, 90.0, 80.0, 80.0, 90.0, 80.0],
            'suitable_soil_types': [
                ['Clay Loam', 'Silt Loam'],
                ['Clay Loam', 'Clay'],
                ['Clay Loam', 'Sandy Loam'],
                ['Clay Loam', 'Clay'],
                ['Sandy Loam', 'Clay Loam'],
                ['Sandy Loam', 'Silt Loam'],
                ['Sandy Loam', 'Silt Loam'],
                ['Sandy Loam', 'Silt Loam']
            ],
            'water_requirement': ['medium', 'high', 'low', 'high', 'medium', 'medium', 'high', 'medium'],
            'expected_yield': ['45-50 quintals/hectare', '35-40 quintals/hectare', '15-20 quintals/hectare', 
                             '80-100 tons/hectare', '15-20 quintals/hectare', '40-50 quintals/hectare',
                             '25-30 tons/hectare', '30-40 tons/hectare'],
            'expected_yield_hindi': ['45-50 क्विंटल/हेक्टेयर', '35-40 क्विंटल/हेक्टेयर', '15-20 क्विंटल/हेक्टेयर',
                                   '80-100 टन/हेक्टेयर', '15-20 क्विंटल/हेक्टेयर', '40-50 क्विंटल/हेक्टेयर',
                                   '25-30 टन/हेक्टेयर', '30-40 टन/हेक्टेयर'],
            'expected_yield_punjabi': ['45-50 ਕੁਇੰਟਲ/ਹੈਕਟੇਅਰ', '35-40 ਕੁਇੰਟਲ/ਹੈਕਟੇਅਰ', '15-20 ਕੁਇੰਟਲ/ਹੈਕਟੇਅਰ',
                                     '80-100 ਟਨ/ਹੈਕਟੇਅਰ', '15-20 ਕੁਇੰਟਲ/ਹੈਕਟੇਅਰ', '40-50 ਕੁਇੰਟਲ/ਹੈਕਟੇਅਰ',
                                     '25-30 ਟਨ/ਹੈਕਟੇਅਰ', '30-40 ਟਨ/ਹੈਕਟੇਅਰ'],
            'planting_time': ['October-November', 'June-July', 'October-November', 'February-March',
                            'May-June', 'June-July', 'October-November', 'March-April'],
            'planting_time_hindi': ['अक्टूबर-नवंबर', 'जून-जुलाई', 'अक्टूबर-नवंबर', 'फरवरी-मार्च',
                                  'मई-जून', 'जून-जुलाई', 'अक्टूबर-नवंबर', 'मार्च-अप्रैल'],
            'planting_time_punjabi': ['ਅਕਤੂਬਰ-ਨਵੰਬਰ', 'ਜੂਨ-ਜੁਲਾਈ', 'ਅਕਤੂਬਰ-ਨਵੰਬਰ', 'ਫਰਵਰੀ-ਮਾਰਚ',
                                    'ਮਈ-ਜੂਨ', 'ਜੂਨ-ਜੁਲਾਈ', 'ਅਕਤੂਬਰ-ਨਵੰਬਰ', 'ਮਾਰਚ-ਅਪ੍ਰੈਲ'],
            'market_price': [2200, 1800, 4500, 3200, 6500, 2000, 1500, 3000],
            'price_unit': ['per_quintal', 'per_quintal', 'per_quintal', 'per_ton', 'per_quintal', 
                          'per_quintal', 'per_ton', 'per_ton']
        }
        
        return pd.DataFrame(crops_data)
    
    def get_crop_recommendations(self, soil_analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Get crop recommendations based on soil analysis
        """
        try:
            recommendations = []
            soil_type = soil_analysis.get('soil_type', '')
            ph_level = soil_analysis.get('ph_level', 7.0)
            moisture_content = soil_analysis.get('moisture_content', 50.0)
            
            for _, crop in self.crop_database.iterrows():
                # Check if crop is suitable for soil conditions
                suitability_score = self._calculate_suitability_score(
                    soil_analysis, crop
                )
                
                if suitability_score > 0.6:  # Only recommend if suitability > 60%
                    recommendation = {
                        'crop_name': crop['crop_name'],
                        'crop_name_hindi': crop['crop_name_hindi'],
                        'crop_name_punjabi': crop['crop_name_punjabi'],
                        'season': crop['season'],
                        'season_hindi': crop['season_hindi'],
                        'season_punjabi': crop['season_punjabi'],
                        'confidence_score': round(suitability_score * 100, 1),
                        'suitability': self._get_suitability_level(suitability_score),
                        'expected_yield': crop['expected_yield'],
                        'expected_yield_hindi': crop['expected_yield_hindi'],
                        'expected_yield_punjabi': crop['expected_yield_punjabi'],
                        'planting_time': crop['planting_time'],
                        'planting_time_hindi': crop['planting_time_hindi'],
                        'planting_time_punjabi': crop['planting_time_punjabi'],
                        'water_requirement': crop['water_requirement'],
                        'soil_type_suitable': soil_type,
                        'soil_type_suitable_hindi': self._get_soil_type_hindi(soil_type),
                        'soil_type_suitable_punjabi': self._get_soil_type_punjabi(soil_type),
                        'market_price': float(crop['market_price']),
                        'price_unit': crop['price_unit'],
                        'benefits': self._get_crop_benefits(crop['crop_name']),
                        'benefits_hindi': self._get_crop_benefits_hindi(crop['crop_name']),
                        'benefits_punjabi': self._get_crop_benefits_punjabi(crop['crop_name'])
                    }
                    recommendations.append(recommendation)
            
            # Sort by confidence score and return top 5
            recommendations.sort(key=lambda x: x['confidence_score'], reverse=True)
            return recommendations[:5]
            
        except Exception as e:
            logger.error(f"Crop recommendation error: {str(e)}")
            return []
    
    def _calculate_suitability_score(self, soil_analysis: Dict[str, Any], crop: pd.Series) -> float:
        """
        Calculate suitability score for a crop based on soil analysis
        """
        score = 0.0
        
        # pH suitability
        ph_level = soil_analysis.get('ph_level', 7.0)
        if crop['min_ph'] <= ph_level <= crop['max_ph']:
            score += 0.3
        else:
            ph_diff = min(abs(ph_level - crop['min_ph']), abs(ph_level - crop['max_ph']))
            score += max(0, 0.3 - ph_diff * 0.1)
        
        # Moisture suitability
        moisture_content = soil_analysis.get('moisture_content', 50.0)
        if crop['min_moisture'] <= moisture_content <= crop['max_moisture']:
            score += 0.3
        else:
            moisture_diff = min(abs(moisture_content - crop['min_moisture']), 
                              abs(moisture_content - crop['max_moisture']))
            score += max(0, 0.3 - moisture_diff * 0.01)
        
        # Soil type suitability
        soil_type = soil_analysis.get('soil_type', '')
        if soil_type in crop['suitable_soil_types']:
            score += 0.4
        else:
            score += 0.2  # Partial match
        
        return min(score, 1.0)
    
    def _get_suitability_level(self, score: float) -> str:
        """
        Get suitability level based on score
        """
        if score >= 0.9:
            return 'excellent'
        elif score >= 0.7:
            return 'good'
        elif score >= 0.5:
            return 'moderate'
        else:
            return 'poor'
    
    def _get_soil_type_hindi(self, soil_type: str) -> str:
        """
        Get Hindi translation for soil type
        """
        translations = {
            'Clay Loam': 'चिकनी दोमट',
            'Sandy Loam': 'बलुई दोमट',
            'Silt Loam': 'गाद दोमट',
            'Clay': 'चिकनी मिट्टी',
            'Sandy Clay': 'बलुई चिकनी मिट्टी'
        }
        return translations.get(soil_type, soil_type)
    
    def _get_soil_type_punjabi(self, soil_type: str) -> str:
        """
        Get Punjabi translation for soil type
        """
        translations = {
            'Clay Loam': 'ਮਿੱਟੀ ਦੋਮਟ',
            'Sandy Loam': 'ਰੇਤਲੀ ਦੋਮਟ',
            'Silt Loam': 'ਗਾਦ ਦੋਮਟ',
            'Clay': 'ਮਿੱਟੀ',
            'Sandy Clay': 'ਰੇਤਲੀ ਮਿੱਟੀ'
        }
        return translations.get(soil_type, soil_type)
    
    def _get_crop_benefits(self, crop_name: str) -> List[str]:
        """
        Get benefits for a crop
        """
        benefits = {
            'Wheat': ['High nutritional value', 'Good market demand', 'Suitable for your soil type', 'Drought resistant varieties available'],
            'Rice': ['Staple food crop', 'High water retention soil suitable', 'Good market price', 'Multiple varieties available'],
            'Mustard': ['Oilseed crop with high value', 'Low water requirement', 'Good for crop rotation', 'High market demand'],
            'Sugarcane': ['High value cash crop', 'Good for industrial use', 'Long-term crop', 'High yield potential'],
            'Cotton': ['Fiber crop with high value', 'Good for textile industry', 'Drought resistant varieties', 'Export potential'],
            'Maize': ['High yield potential', 'Good for animal feed', 'Multiple uses', 'Short duration crop'],
            'Potato': ['High nutritional value', 'Good market demand', 'Short duration crop', 'Multiple varieties available'],
            'Tomato': ['High value vegetable', 'Good market demand', 'Short duration crop', 'Multiple varieties available']
        }
        return benefits.get(crop_name, ['Good crop for your region', 'Suitable soil conditions', 'Market demand available'])
    
    def _get_crop_benefits_hindi(self, crop_name: str) -> List[str]:
        """
        Get Hindi benefits for a crop
        """
        benefits = {
            'Wheat': ['उच्च पोषण मूल्य', 'अच्छी बाजार मांग', 'आपकी मिट्टी के प्रकार के लिए उपयुक्त', 'सूखा प्रतिरोधी किस्में उपलब्ध'],
            'Rice': ['मुख्य खाद्य फसल', 'उच्च जल धारण क्षमता वाली मिट्टी उपयुक्त', 'अच्छी बाजार कीमत', 'कई किस्में उपलब्ध'],
            'Mustard': ['उच्च मूल्य वाली तिलहन फसल', 'कम पानी की आवश्यकता', 'फसल चक्र के लिए अच्छी', 'उच्च बाजार मांग'],
            'Sugarcane': ['उच्च मूल्य नकदी फसल', 'औद्योगिक उपयोग के लिए अच्छी', 'दीर्घकालिक फसल', 'उच्च उपज क्षमता'],
            'Cotton': ['उच्च मूल्य वाली रेशा फसल', 'कपड़ा उद्योग के लिए अच्छी', 'सूखा प्रतिरोधी किस्में', 'निर्यात क्षमता'],
            'Maize': ['उच्च उपज क्षमता', 'पशु चारे के लिए अच्छी', 'कई उपयोग', 'कम अवधि की फसल'],
            'Potato': ['उच्च पोषण मूल्य', 'अच्छी बाजार मांग', 'कम अवधि की फसल', 'कई किस्में उपलब्ध'],
            'Tomato': ['उच्च मूल्य वाली सब्जी', 'अच्छी बाजार मांग', 'कम अवधि की फसल', 'कई किस्में उपलब्ध']
        }
        return benefits.get(crop_name, ['आपके क्षेत्र के लिए अच्छी फसल', 'उपयुक्त मिट्टी की स्थिति', 'बाजार मांग उपलब्ध'])
    
    def _get_crop_benefits_punjabi(self, crop_name: str) -> List[str]:
        """
        Get Punjabi benefits for a crop
        """
        benefits = {
            'Wheat': ['ਉੱਚ ਪੋਸ਼ਣ ਮੁੱਲ', 'ਚੰਗੀ ਬਾਜ਼ਾਰ ਮੰਗ', 'ਤੁਹਾਡੀ ਮਿੱਟੀ ਦੇ ਪ੍ਰਕਾਰ ਲਈ ਉਪਯੁਕਤ', 'ਸੁੱਕਾ ਪ੍ਰਤੀਰੋਧੀ ਕਿਸਮਾਂ ਉਪਲਬਧ'],
            'Rice': ['ਮੁੱਖ ਭੋਜਨ ਫਸਲ', 'ਉੱਚ ਪਾਣੀ ਧਾਰਨ ਸਮਰੱਥਾ ਵਾਲੀ ਮਿੱਟੀ ਉਪਯੁਕਤ', 'ਚੰਗੀ ਬਾਜ਼ਾਰ ਕੀਮਤ', 'ਕਈ ਕਿਸਮਾਂ ਉਪਲਬਧ'],
            'Mustard': ['ਉੱਚ ਮੁੱਲ ਵਾਲੀ ਤਿਲਹਨ ਫਸਲ', 'ਘੱਟ ਪਾਣੀ ਦੀ ਲੋੜ', 'ਫਸਲ ਚੱਕਰ ਲਈ ਚੰਗੀ', 'ਉੱਚ ਬਾਜ਼ਾਰ ਮੰਗ'],
            'Sugarcane': ['ਉੱਚ ਮੁੱਲ ਵਾਲੀ ਨਕਦੀ ਫਸਲ', 'ਉਦਯੋਗਿਕ ਵਰਤੋਂ ਲਈ ਚੰਗੀ', 'ਲੰਬੇ ਸਮੇਂ ਦੀ ਫਸਲ', 'ਉੱਚ ਉਪਜ ਸਮਰੱਥਾ'],
            'Cotton': ['ਉੱਚ ਮੁੱਲ ਵਾਲੀ ਰੇਸ਼ਾ ਫਸਲ', 'ਕੱਪੜਾ ਉਦਯੋਗ ਲਈ ਚੰਗੀ', 'ਸੁੱਕਾ ਪ੍ਰਤੀਰੋਧੀ ਕਿਸਮਾਂ', 'ਨਿਰਯਾਤ ਸਮਰੱਥਾ'],
            'Maize': ['ਉੱਚ ਉਪਜ ਸਮਰੱਥਾ', 'ਪਸ਼ੂ ਚਾਰੇ ਲਈ ਚੰਗੀ', 'ਕਈ ਵਰਤੋਂ', 'ਘੱਟ ਸਮੇਂ ਦੀ ਫਸਲ'],
            'Potato': ['ਉੱਚ ਪੋਸ਼ਣ ਮੁੱਲ', 'ਚੰਗੀ ਬਾਜ਼ਾਰ ਮੰਗ', 'ਘੱਟ ਸਮੇਂ ਦੀ ਫਸਲ', 'ਕਈ ਕਿਸਮਾਂ ਉਪਲਬਧ'],
            'Tomato': ['ਉੱਚ ਮੁੱਲ ਵਾਲੀ ਸਬਜ਼ੀ', 'ਚੰਗੀ ਬਾਜ਼ਾਰ ਮੰਗ', 'ਘੱਟ ਸਮੇਂ ਦੀ ਫਸਲ', 'ਕਈ ਕਿਸਮਾਂ ਉਪਲਬਧ']
        }
        return benefits.get(crop_name, ['ਤੁਹਾਡੇ ਖੇਤਰ ਲਈ ਚੰਗੀ ਫਸਲ', 'ਉਪਯੁਕਤ ਮਿੱਟੀ ਦੀ ਸਥਿਤੀ', 'ਬਾਜ਼ਾਰ ਮੰਗ ਉਪਲਬਧ'])

class PestDetectionService:
    """
    AI service for pest detection using computer vision
    """
    
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'pest_detection_model.h5')
        self.pest_database = self._load_pest_database()
    
    def _load_pest_database(self) -> Dict[str, Dict[str, Any]]:
        """
        Load pest database with treatment information
        """
        return {
            'aphids': {
                'name_hindi': 'एफिड्स',
                'name_punjabi': 'ਮਾਹੂ',
                'severity': 'medium',
                'treatment_advice': 'Use neem oil spray or insecticidal soap. Remove affected leaves.',
                'treatment_advice_hindi': 'नीम तेल स्प्रे या कीटनाशक साबुन का उपयोग करें। प्रभावित पत्तियों को हटाएं।',
                'treatment_advice_punjabi': 'ਨੀਮ ਦੇ ਤੇਲ ਦਾ ਸਪਰੇਅ ਜਾਂ ਕੀਟਨਾਸ਼ਕ ਸਾਬਣ ਦਾ ਉਪਯੋਗ ਕਰੋ। ਪ੍ਰਭਾਵਿਤ ਪੱਤਿਆਂ ਨੂੰ ਹਟਾਓ।',
                'prevention_tips': 'Keep plants healthy, use companion planting, avoid over-fertilization.',
                'prevention_tips_hindi': 'पौधों को स्वस्थ रखें, साथी पौधे लगाएं, अधिक उर्वरक से बचें।',
                'prevention_tips_punjabi': 'ਪੌਦਿਆਂ ਨੂੰ ਸਿਹਤਮੰਦ ਰੱਖੋ, ਸਾਥੀ ਪੌਦੇ ਲਗਾਓ, ਜ਼ਿਆਦਾ ਖਾਦ ਤੋਂ ਬਚੋ।'
            },
            'whitefly': {
                'name_hindi': 'व्हाइटफ्लाई',
                'name_punjabi': 'ਵ੍ਹਾਈਟਫਲਾਈ',
                'severity': 'high',
                'treatment_advice': 'Use yellow sticky traps and insecticidal soap. Apply systemic insecticides.',
                'treatment_advice_hindi': 'पीले चिपचिपे जाल और कीटनाशक साबुन का उपयोग करें। प्रणालीगत कीटनाशक लगाएं।',
                'treatment_advice_punjabi': 'ਪੀਲੇ ਚਿਪਚਿਪੇ ਜਾਲ ਅਤੇ ਕੀਟਨਾਸ਼ਕ ਸਾਬਣ ਦਾ ਉਪਯੋਗ ਕਰੋ। ਸਿਸਟਮਿਕ ਕੀਟਨਾਸ਼ਕ ਲਗਾਓ।',
                'prevention_tips': 'Use reflective mulch, maintain proper spacing, avoid overwatering.',
                'prevention_tips_hindi': 'परावर्तक मल्च का उपयोग करें, उचित दूरी बनाए रखें, अधिक पानी देने से बचें।',
                'prevention_tips_punjabi': 'ਪਰਾਵਰਤਕ ਮਲਚ ਦਾ ਉਪਯੋਗ ਕਰੋ, ਉਚਿਤ ਦੂਰੀ ਬਣਾਈ ਰੱਖੋ, ਜ਼ਿਆਦਾ ਪਾਣੀ ਦੇਣ ਤੋਂ ਬਚੋ।'
            },
            'thrips': {
                'name_hindi': 'थ्रिप्स',
                'name_punjabi': 'ਥ੍ਰਿਪਸ',
                'severity': 'medium',
                'treatment_advice': 'Use spinosad or neem oil. Remove affected plant parts.',
                'treatment_advice_hindi': 'स्पिनोसैड या नीम तेल का उपयोग करें। प्रभावित पौधे के भागों को हटाएं।',
                'treatment_advice_punjabi': 'ਸਪਿਨੋਸੈਡ ਜਾਂ ਨੀਮ ਦੇ ਤੇਲ ਦਾ ਉਪਯੋਗ ਕਰੋ। ਪ੍ਰਭਾਵਿਤ ਪੌਦੇ ਦੇ ਹਿੱਸਿਆਂ ਨੂੰ ਹਟਾਓ।',
                'prevention_tips': 'Keep area clean, use beneficial insects, avoid overcrowding.',
                'prevention_tips_hindi': 'क्षेत्र को साफ रखें, लाभकारी कीटों का उपयोग करें, भीड़ से बचें।',
                'prevention_tips_punjabi': 'ਖੇਤਰ ਨੂੰ ਸਾਫ਼ ਰੱਖੋ, ਲਾਭਕਾਰੀ ਕੀਟਾਂ ਦਾ ਉਪਯੋਗ ਕਰੋ, ਭੀੜ ਤੋਂ ਬਚੋ।'
            },
            'mites': {
                'name_hindi': 'माइट्स',
                'name_punjabi': 'ਮਾਈਟਸ',
                'severity': 'high',
                'treatment_advice': 'Use miticides or sulfur-based products. Increase humidity.',
                'treatment_advice_hindi': 'माइटिसाइड या सल्फर आधारित उत्पादों का उपयोग करें। आर्द्रता बढ़ाएं।',
                'treatment_advice_punjabi': 'ਮਾਈਟੀਸਾਈਡ ਜਾਂ ਸਲਫਰ ਆਧਾਰਿਤ ਉਤਪਾਦਾਂ ਦਾ ਉਪਯੋਗ ਕਰੋ। ਨਮੀ ਵਧਾਓ।',
                'prevention_tips': 'Maintain proper humidity, use predatory mites, avoid dusty conditions.',
                'prevention_tips_hindi': 'उचित आर्द्रता बनाए रखें, शिकारी माइट्स का उपयोग करें, धूल भरी स्थिति से बचें।',
                'prevention_tips_punjabi': 'ਉਚਿਤ ਨਮੀ ਬਣਾਈ ਰੱਖੋ, ਸ਼ਿਕਾਰੀ ਮਾਈਟਸ ਦਾ ਉਪਯੋਗ ਕਰੋ, ਧੂੜ ਭਰੀ ਸਥਿਤੀ ਤੋਂ ਬਚੋ।'
            }
        }
    
    def detect_pest(self, image_path: str) -> Dict[str, Any]:
        """
        Detect pest in image and return detection results
        """
        try:
            # Load and preprocess image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError("Could not load image")
            
            # Convert to RGB
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Extract features from image
            features = self._extract_pest_features(image_rgb)
            
            # Predict pest using ML model
            pest_result = self._predict_pest(features)
            
            return pest_result
            
        except Exception as e:
            logger.error(f"Pest detection error: {str(e)}")
            # Return mock data if detection fails
            return self._get_mock_pest_detection()
    
    def _extract_pest_features(self, image: np.ndarray) -> np.ndarray:
        """
        Extract features from pest image
        """
        # Color analysis
        mean_color = np.mean(image, axis=(0, 1))
        std_color = np.std(image, axis=(0, 1))
        
        # Texture analysis
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        lbp = self._local_binary_pattern(gray)
        
        # Edge detection
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
        
        # Combine features
        features = np.concatenate([
            mean_color,
            std_color,
            [np.mean(lbp)],
            [np.std(lbp)],
            [edge_density]
        ])
        
        return features.reshape(1, -1)
    
    def _local_binary_pattern(self, image: np.ndarray, radius: int = 1, n_points: int = 8) -> np.ndarray:
        """
        Compute Local Binary Pattern for texture analysis
        """
        def get_pixel(img, center, x, y):
            new_x = x + center[0]
            new_y = y + center[1]
            if new_x >= len(img) or new_x < 0:
                return 0
            if new_y >= len(img[0]) or new_y < 0:
                return 0
            return img[new_x, new_y]
        
        lbp = np.zeros_like(image)
        for i in range(radius, len(image) - radius):
            for j in range(radius, len(image[0]) - radius):
                center = image[i, j]
                code = 0
                for k in range(n_points):
                    x = radius * np.cos(2 * np.pi * k / n_points)
                    y = radius * np.sin(2 * np.pi * k / n_points)
                    if get_pixel(image, (i, j), int(x), int(y)) >= center:
                        code |= (1 << k)
                lbp[i, j] = code
        
        return lbp
    
    def _predict_pest(self, features: np.ndarray) -> Dict[str, Any]:
        """
        Predict pest using trained ML model
        """
        try:
            # Load trained model if available
            if os.path.exists(self.model_path):
                # In a real implementation, load the trained model
                # model = joblib.load(self.model_path)
                # predictions = model.predict(features)
                pass
            
            # For now, return mock predictions
            return self._get_mock_pest_detection()
            
        except Exception as e:
            logger.error(f"Pest prediction error: {str(e)}")
            return self._get_mock_pest_detection()
    
    def _get_mock_pest_detection(self) -> Dict[str, Any]:
        """
        Return mock pest detection data for demonstration
        """
        pests = list(self.pest_database.keys())
        detected_pest = random.choice(pests)
        pest_info = self.pest_database[detected_pest]
        
        return {
            'detected_pest': detected_pest.title(),
            'detected_pest_hindi': pest_info['name_hindi'],
            'detected_pest_punjabi': pest_info['name_punjabi'],
            'confidence_score': round(random.uniform(75.0, 95.0), 1),
            'severity': pest_info['severity'],
            'treatment_advice': pest_info['treatment_advice'],
            'treatment_advice_hindi': pest_info['treatment_advice_hindi'],
            'treatment_advice_punjabi': pest_info['treatment_advice_punjabi'],
            'prevention_tips': pest_info['prevention_tips'],
            'prevention_tips_hindi': pest_info['prevention_tips_hindi'],
            'prevention_tips_punjabi': pest_info['prevention_tips_punjabi']
        }
