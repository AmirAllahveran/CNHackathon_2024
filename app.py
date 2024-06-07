from flask import Flask, request, jsonify, render_template, send_from_directory
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'static/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def read_image(file_path):
    # Placeholder for image processing logic
    # Assume this function processes the image and saves a new one
    new_image_path = file_path  # For now, we just return the same file path
    processed_info = "Some information about the processed image"
    return new_image_path, processed_info


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
    app.run(debug=True)
