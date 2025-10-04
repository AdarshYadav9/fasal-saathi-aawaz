from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from werkzeug.utils import secure_filename
from soil_prediction import SoilCropRecommender
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize the soil crop recommender
recommender = SoilCropRecommender()

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Soil Crop Recommendation API is running",
        "model_loaded": recommender.model is not None,
        "mapping_loaded": recommender.mapping_df is not None
    })

@app.route('/api/soil-types', methods=['GET'])
def get_soil_types():
    """Get list of available soil types"""
    if recommender.mapping_df is not None:
        soil_types = recommender.mapping_df['Soil_Type'].tolist()
        return jsonify({
            "success": True,
            "soil_types": soil_types,
            "count": len(soil_types)
        })
    else:
        return jsonify({
            "success": False,
            "error": "Mapping data not loaded"
        }), 500

@app.route('/api/analyze-soil', methods=['POST'])
def analyze_soil():
    """Analyze uploaded soil image and return crop recommendations"""
    try:
        # Check if file is present in request
        if 'image' not in request.files:
            return jsonify({
                "success": False,
                "error": "No image file provided"
            }), 400
        
        file = request.files['image']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "No file selected"
            }), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({
                "success": False,
                "error": f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
            }), 400
        
        # Generate unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        # Save uploaded file
        file.save(file_path)
        
        try:
            # Analyze the image
            result = recommender.predict_crop(file_path)
            
            # Clean up uploaded file
            os.remove(file_path)
            
            return jsonify(result)
            
        except Exception as e:
            # Clean up uploaded file in case of error
            if os.path.exists(file_path):
                os.remove(file_path)
            raise e
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Analysis failed: {str(e)}"
        }), 500

@app.route('/api/recommendations/<soil_type>', methods=['GET'])
def get_recommendations_by_soil_type(soil_type):
    """Get crop recommendations for a specific soil type"""
    try:
        result = recommender.get_crop_recommendations(soil_type)
        
        if "error" in result:
            return jsonify(result), 404
        
        return jsonify({
            "success": True,
            "data": result
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Failed to get recommendations: {str(e)}"
        }), 500

@app.route('/api/batch-analyze', methods=['POST'])
def batch_analyze():
    """Analyze multiple soil images at once"""
    try:
        files = request.files.getlist('images')
        
        if not files:
            return jsonify({
                "success": False,
                "error": "No images provided"
            }), 400
        
        if len(files) > 10:  # Limit batch size
            return jsonify({
                "success": False,
                "error": "Too many images. Maximum 10 images per batch."
            }), 400
        
        results = []
        
        for file in files:
            if file.filename == '' or not allowed_file(file.filename):
                results.append({
                    "filename": file.filename,
                    "success": False,
                    "error": "Invalid file"
                })
                continue
            
            # Save and analyze each file
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            
            file.save(file_path)
            
            try:
                result = recommender.predict_crop(file_path)
                result['filename'] = file.filename
                results.append(result)
            except Exception as e:
                results.append({
                    "filename": file.filename,
                    "success": False,
                    "error": str(e)
                })
            finally:
                # Clean up
                if os.path.exists(file_path):
                    os.remove(file_path)
        
        return jsonify({
            "success": True,
            "results": results,
            "total_processed": len(results)
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Batch analysis failed: {str(e)}"
        }), 500

@app.errorhandler(413)
def too_large(e):
    """Handle file too large error"""
    return jsonify({
        "success": False,
        "error": "File too large. Maximum size is 16MB."
    }), 413

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return jsonify({
        "success": False,
        "error": "Endpoint not found"
    }), 404

@app.errorhandler(500)
def internal_error(e):
    """Handle 500 errors"""
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500

if __name__ == '__main__':
    print("Starting Soil Crop Recommendation API...")
    print("Available endpoints:")
    print("  GET  /api/health - Health check")
    print("  GET  /api/soil-types - Get available soil types")
    print("  POST /api/analyze-soil - Analyze soil image")
    print("  GET  /api/recommendations/<soil_type> - Get recommendations by soil type")
    print("  POST /api/batch-analyze - Analyze multiple images")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
