import openai
import json
from flask import Response
from typing import Any, AsyncGenerator, Union
from backend.agents.agent import Agent
from requests.sessions import Session

class InsightAgent(Agent):

    def __init__(
        self,
        #search_client: SearchClient,
        session: Session,
        openai_base: str,
        openai_model: str,
        openai_type: str,
        openai_version: str,
        openai_key: str,
        openai_system_message: str,
        search_endpoint: str,
        search_key: str,
        search_index: str,
    ):
        #self.search_client = search_client
        self.session = session
        self.openai_base = openai_base
        self.openai_model = openai_model
        self.openai_type = openai_type
        self.openai_version = openai_version
        self.openai_key = openai_key
        self.openai_system_message = openai_system_message
        self.search_endpoint = search_endpoint
        self.search_key = search_key
        self.search_index = search_index

    
    async def conversation_with_data(self, request):
        #print(request.json["messages"])
        request_messages = request
        # call get_byod_session so that we use the REST session to make the call
        openai.requestssession = self.session
        
        chat_completion = openai.ChatCompletion.create(
                        messages=request_messages,
                        deployment_id=self.openai_model,
                        dataSources=[  # camelCase is intentional, as this is the format the API expects
                            {
                                "type": "AzureCognitiveSearch",
                                "parameters": {
                                    "endpoint": self.search_endpoint,
                                    "key": self.search_key,
                                    "indexName": self.search_index,
                                }
                            }
                        ],
                        stream=False,
                    )
        #print(json.dumps(chat_completion).replace("\n", "\\n"))
        #return (chat_completion["choices"][0]["messages"][1]["content"])
        return Response(json.dumps(chat_completion).replace("\n", "\\n"), status=200)    
        
    async def run(
                self, messages: list[dict], stream: bool = False, session_state: Any = None, context: dict[str, Any] = {}
            ) -> Union[dict[str, Any], AsyncGenerator[dict[str, Any], None]]:
                r = await self.conversation_with_data(messages)
                return r
                