import tensorflow as tf
import keras
from config import Config

model = None
model_ready = False


def load_model():

    global model, model_ready

    try:

        print("Loading model from:", Config.MODEL_PATH)

        model = keras.models.load_model(
            Config.MODEL_PATH,
            compile=False,
            safe_mode=False
        )

        model_ready = True

        print("Model loaded successfully")

    except Exception as e:

        print("Model failed to load:", e)

        model_ready = False