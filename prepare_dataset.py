import os
import shutil
from pathlib import Path

def prepare_dataset():
    """
    Prepare the dataset by organizing it into the required structure
    for training the soil classifier
    """
    
    # Source and destination paths
    source_path = Path("Dataset/Soil-Classification-Dataset/CyAUG-Dataset")
    dest_path = Path("soil_dataset")
    
    # Create destination directory
    dest_path.mkdir(exist_ok=True)
    
    # Map original folder names to standardized names
    folder_mapping = {
        "Alluvial_Soil": "Alluvial soil",
        "Black_Soil": "Black Soil", 
        "Red_Soil": "Red soil",
        "Yellow_Soil": "Yellow Soil",
        "Laterite_Soil": "Laterite Soil",
        "Arid_Soil": "Arid Soil",
        "Mountain_Soil": "Mountain Soil"
    }
    
    print("Preparing dataset...")
    
    # Copy and rename folders
    for old_name, new_name in folder_mapping.items():
        source_folder = source_path / old_name
        dest_folder = dest_path / new_name
        
        if source_folder.exists():
            print(f"Copying {old_name} -> {new_name}")
            if dest_folder.exists():
                shutil.rmtree(dest_folder)
            shutil.copytree(source_folder, dest_folder)
            print(f"  Copied {len(list(dest_folder.glob('*')))} files")
        else:
            print(f"Warning: {old_name} folder not found")
    
    print(f"\nDataset prepared in: {dest_path}")
    
    # Count total images
    total_images = 0
    for soil_type in dest_path.iterdir():
        if soil_type.is_dir():
            count = len(list(soil_type.glob('*')))
            total_images += count
            print(f"{soil_type.name}: {count} images")
    
    print(f"\nTotal images: {total_images}")
    
    return dest_path

def create_train_val_split():
    """
    Create train/validation split from the prepared dataset
    """
    from sklearn.model_selection import train_test_split
    import shutil
    from pathlib import Path
    
    source_path = Path("soil_dataset")
    train_path = Path("soil_dataset_train")
    val_path = Path("soil_dataset_val")
    
    # Create train and val directories
    train_path.mkdir(exist_ok=True)
    val_path.mkdir(exist_ok=True)
    
    print("Creating train/validation split...")
    
    for soil_type in source_path.iterdir():
        if soil_type.is_dir():
            print(f"Processing {soil_type.name}...")
            
            # Get all image files
            image_files = list(soil_type.glob('*'))
            
            if len(image_files) < 2:
                print(f"  Warning: {soil_type.name} has only {len(image_files)} images")
                # Put all in training
                train_dest = train_path / soil_type.name
                val_dest = val_path / soil_type.name
                train_dest.mkdir(exist_ok=True)
                val_dest.mkdir(exist_ok=True)
                
                for img_file in image_files:
                    shutil.copy2(img_file, train_dest)
                continue
            
            # Split files (80% train, 20% val)
            train_files, val_files = train_test_split(
                image_files, 
                test_size=0.2, 
                random_state=42
            )
            
            # Create directories
            train_dest = train_path / soil_type.name
            val_dest = val_path / soil_type.name
            train_dest.mkdir(exist_ok=True)
            val_dest.mkdir(exist_ok=True)
            
            # Copy files
            for img_file in train_files:
                shutil.copy2(img_file, train_dest)
            
            for img_file in val_files:
                shutil.copy2(img_file, val_dest)
            
            print(f"  Train: {len(train_files)}, Val: {len(val_files)}")
    
    print(f"\nTrain dataset: {train_path}")
    print(f"Validation dataset: {val_path}")

if __name__ == "__main__":
    # Prepare the dataset
    prepare_dataset()
    
    # Create train/validation split
    create_train_val_split()
    
    print("\nDataset preparation complete!")
    print("You can now run: python train_soil_classifier.py")
