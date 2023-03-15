import base64
import io
from PIL import Image

def base64_to_png(base64_image):
    img_bytes = base64.b64decode(base64_image.split()[0])
    img_stream = io.BytesIO(img_bytes)
    img = Image.open(img_stream)

    png_stream = io.BytesIO()
    img.save(png_stream, "PNG")

    png_bytes = png_stream.getvalue()

    png_str = 'data:image/png;base64,' + base64.b64encode(png_bytes).decode('utf-8')
    return png_str