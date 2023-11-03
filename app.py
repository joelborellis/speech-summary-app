from flask import Flask, request, jsonify, Response
import requests
import logging
import os
import openai
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)

def open_file(filepath):
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as infile:
            return infile.read()

# assign the Search variables for Azure Cogintive Search - use .env file and in the web app configure the application settings
AZURE_SEARCH_ENDPOINT = os.environ.get("AZURE_SEARCH_ENDPOINT")
AZURE_SEARCH_ADMIN_KEY = os.environ.get("AZURE_SEARCH_ADMIN_KEY")
AZURE_SEARCH_INDEX = os.environ.get("AZURE_SEARCH_INDEX")

# Azure OpenAI variables from .env file
OPENAI_MODEL = os.environ.get("OPENAI_MODEL")

# set the openai required variables
openai.api_type = os.environ.get("OPENAI_API_TYPE")
openai.api_base = os.environ.get("OPENAI_API_BASE")
openai.api_version = os.environ.get("OPENAI_API_VERSION")
openai.api_key = os.environ.get("OPENAI_API_KEY")
OPENAI_SYSTEM_MESSAGE = open_file('./system.md')

def get_byod_session(deployment_id: str) -> None:
    """Sets up the OpenAI Python SDK to use your own data for the chat endpoint.

    :param deployment_id: The deployment ID for the model to use with your own data.

    To remove this configuration, simply set openai.requestssession to None.
    """

    class BringYourOwnDataAdapter(requests.adapters.HTTPAdapter):

     def send(self, request, **kwargs):
         request.url = f"{openai.api_base}/openai/deployments/{deployment_id}/extensions/chat/completions?api-version={openai.api_version}"
         return super().send(request, **kwargs)

    session = requests.Session()

    # Mount a custom adapter which will use the extensions endpoint for any call using the given `deployment_id`
    session.mount(
        prefix=f"{openai.api_base}/openai/deployments/{deployment_id}",
        adapter=BringYourOwnDataAdapter()
    )

    return session

def conversation_with_data(request):
    print(request.json["messages"])
    request_messages = request.json["messages"]
    # call get_byod_session so that we use the REST session to make the call
    openai.requestssession = get_byod_session(OPENAI_MODEL)
    
    chat_completion = openai.ChatCompletion.create(
                    messages=request_messages,
                    deployment_id=OPENAI_MODEL,
                    dataSources=[  # camelCase is intentional, as this is the format the API expects
                        {
                            "type": "AzureCognitiveSearch",
                            "parameters": {
                                "endpoint": os.environ.get("AZURE_SEARCH_ENDPOINT"),
                                "key": os.environ.get("AZURE_SEARCH_ADMIN_KEY"),
                                "indexName": os.environ.get("AZURE_SEARCH_INDEX"),
                                "stream": False,
                            }
                        }
                    ]
                )
    print(json.dumps(chat_completion).replace("\n", "\\n"))
    #return (chat_completion["choices"][0]["messages"][1]["content"])
    return Response(json.dumps(chat_completion).replace("\n", "\\n"), status=200)



@app.route("/", defaults={"path": "index.html"})
@app.route("/<path:path>")
def static_file(path):
    return app.send_static_file(path)

@app.route("/conversation", methods=["GET", "POST"])
def conversation():
    try:
        return conversation_with_data(request)
    except Exception as e:
        logging.exception("Exception in /conversation")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)