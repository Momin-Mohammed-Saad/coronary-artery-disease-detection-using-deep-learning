import numpy as np
from PIL import Image

def preprocess(path):

    img = Image.open(path).convert("RGB")

    img = img.resize((224,224))

    img = np.array(img) / 255.0

    img = np.expand_dims(img, axis=0)

    return img