from flask import Flask, request, jsonify
import logging
import os
import requests
from dotenv import load_dotenv
from backend.agents.insightsagent import InsightAgent

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
OPEN_AI_TYPE = os.environ.get("OPENAI_API_TYPE")
OPENAI_BASE = os.environ.get("OPENAI_API_BASE")
OPENAI_VERSION = os.environ.get("OPENAI_API_VERSION")
OPENAI_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_SYSTEM_MESSAGE = open_file('./backend/prompts/system.md')

# function to get a session to pass to the insights agent for calling the REST API
def get_byod_session(deployment_id: str) -> None:
        """Sets up the OpenAI Python SDK to use your own data for the chat endpoint.

        :param deployment_id: The deployment ID for the model to use with your own data.

        To remove this configuration, simply set openai.requestssession to None.
        """

        class BringYourOwnDataAdapter(requests.adapters.HTTPAdapter):

            def send(self, request, **kwargs):
                request.url = f"{OPENAI_BASE}/openai/deployments/{deployment_id}/extensions/chat/completions?api-version={OPENAI_VERSION}"
                return super().send(request, **kwargs)

        session = requests.Session()

        # Mount a custom adapter which will use the extensions endpoint for any call using the given `deployment_id`
        session.mount(
            prefix=f"{OPENAI_BASE}/openai/deployments/{deployment_id}",
            adapter=BringYourOwnDataAdapter()
        )

        return session  

ia = InsightAgent(
        #search_client,
        get_byod_session(OPENAI_MODEL),
        OPENAI_BASE,
        OPENAI_MODEL,
        OPEN_AI_TYPE,
        OPENAI_VERSION,
        OPENAI_KEY,
        OPENAI_SYSTEM_MESSAGE,
        AZURE_SEARCH_ENDPOINT,
        AZURE_SEARCH_ADMIN_KEY,
        AZURE_SEARCH_INDEX,
    )

@app.route("/", defaults={"path": "index.html"})
@app.route("/<path:path>")
def static_file(path):
    return app.send_static_file(path)

@app.route("/insights", methods=["GET", "POST"])
async def conversation():
    request_json = request.get_json()
    try:
        # the result will be a Flask response object which is what is expected in the UI
        result = await ia.run(request_json["messages"])
        return result
    except Exception as e:
        logging.exception("Exception in /insights")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)