from flask import Flask, request, jsonify, render_template, send_from_directory
import os
from PIL import Image
import torch
from torchvision import transforms

app = Flask(__name__)

UPLOAD_FOLDER = 'static/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load your PyTorch model
# Replace 'your_model_path.pt' with the path to your saved model
model = torch.load('your_model_path.pt')
model.eval()


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def read_image(file_path):
    # Load the image
    input_image = Image.open(file_path).convert('RGB')


    # Move the input to the same device as the model
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    input_batch = input_batch.to(device)
    model.to(device)

    # Run the model
    with torch.no_grad():
        output = model(input_batch)

    # Post-process the output
    # Assuming the model outputs an image tensor, convert it to a PIL image
    output_image = transforms.ToPILImage()(output.squeeze().cpu())

    # Save the processed image
    output_image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'processed_' + os.path.basename(file_path))
    output_image.save(output_image_path)

    # Generate some information about the processed image
    processed_info = "Processed image with dimensions: {}".format(output_image.size)

    return output_image_path, processed_info


@app.route('/')
def index_view():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        new_image_path, processed_info = read_image(file_path)
        return jsonify({'image_path': new_image_path, 'info': processed_info})
    return jsonify({'error': 'Invalid file format'}), 400


if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True, host='0.0.0.0', port=8080)
