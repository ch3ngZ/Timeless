from flask import Flask, request

from Groq import GroqAPI
from result import Result
from Cohere import Cohere
from OpenAI import DallE3
from Suno import Suno

app = Flask(__name__)


@app.route('/')
def api_greeting():
    return Result.success('The Timeless API is online!').get_response('API Ping')


@app.route('/generate_image', methods=['POST'])
def generate_image():
    if 'prompt' in request.json:
        image_prompt = request.json['prompt']
    else:
        return Result.failure(400, 'Image Prompt is missing').get_response('Image Generation')
    elaborated_image_prompt = Cohere().elaborate_image_prompt(image_prompt)
    summarized_image_prompt = GroqAPI().summarize_prompt(image_prompt)
    image_url = DallE3().generate_image(elaborated_image_prompt)
    return Result.success({
        'originalPrompt': image_prompt,
        'elaboratedPrompt': elaborated_image_prompt,
        'summarizedPrompt': summarized_image_prompt,
        'imageUrl': image_url
    }).get_response('Image Generation')


@app.route('/generate_audio', methods=['POST'])
def generate_audio():
    if 'prompt' in request.json:
        prompt = request.json['prompt']
    else:
        return Result.failure(400, 'Prompt is missing').get_response('Audio Generation')
    audio_prompt = GroqAPI().generate_audio_prompt(prompt)
    audio = Suno().generate_audio(audio_prompt)
    return Result.success(audio).get_response('Audio Generation')
