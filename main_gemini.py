from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from datetime import datetime, timezone
import json
import os
from typing import List, Optional
import uuid

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Import Google Gemini AI
import google.generativeai as genai

# Initialize FastAPI app
app = FastAPI(title="Fashion Forward AI Customer Support Bot", version="1.0.0")

# Configure Google Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# In-memory storage (for demo purposes)
sessions = {}
conversations = {}

# Pydantic models
class ChatRequest(BaseModel):
    query: str
    session_id: str
    language: str = "en"

class ChatResponse(BaseModel):
    response: str
    session_id: str
    escalation_level: str
    timestamp: str

class SessionInfo(BaseModel):
    session_id: str
    created_at: str
    last_activity: str
    conversation_count: int

# Load FAQ data
def load_faqs():
    try:
        with open("faqs.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {"faqs": []}

# Enhanced AI Bot with Google Gemini
class GeminiCustomerSupportBot:
    def __init__(self):
        self.faqs = load_faqs()
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        
    def generate_response(self, user_query: str, conversation_history: List[dict], session_id: str, language: str = "en") -> dict:
        """Generate AI response using Google Gemini"""
        
        try:
            # Prepare FAQ context
            faq_context = "\n".join([f"Q: {faq['question']}\nA: {faq['answer']}" for faq in self.faqs.get("faqs", [])])
            
            # Prepare conversation history context
            history_context = ""
            if conversation_history:
                history_context = "\n".join([
                    f"Previous conversation:\nUser: {conv['user_query']}\nBot: {conv['bot_response']}"
                    for conv in conversation_history[-5:]  # Last 5 conversations for context
                ])
            
            # Determine escalation level
            escalation_level = self.determine_escalation_level(user_query, conversation_history)
            
            # Create language-specific system prompt
            language_prompts = {
                "en": "You are a helpful Fashion Forward customer support assistant. Answer the user's question based on the FAQ data provided. If you cannot find a relevant answer, escalate to human support.",
                "hi": "आप एक उपयोगी फैशन फॉरवर्ड ग्राहक सहायता सहायक हैं। प्रदान किए गए FAQ डेटा के आधार पर उपयोगकर्ता के प्रश्न का उत्तर दें। यदि आप कोई प्रासंगिक उत्तर नहीं खोज सकते हैं, तो मानव सहायता में एस्केलेट करें।",
                "es": "Eres un asistente de soporte al cliente útil de Fashion Forward. Responde la pregunta del usuario basándote en los datos de FAQ proporcionados. Si no puedes encontrar una respuesta relevante, escala al soporte humano.",
                "fr": "Vous êtes un assistant de support client utile de Fashion Forward. Répondez à la question de l'utilisateur en vous basant sur les données FAQ fournies. Si vous ne trouvez pas de réponse pertinente, escaladez vers le support humain."
            }
            
            system_prompt = language_prompts.get(language, language_prompts["en"])
            
            # Create the prompt
            prompt = f"""
{system_prompt}

FAQ Data:
{faq_context}

{history_context}

User Query: {user_query}

Please provide a helpful response in {language}. If the query cannot be answered from the FAQ data, respond with "I need to escalate this to human support. Please hold while I connect you with a specialist."

Guidelines:
- Always be polite and professional
- Keep responses concise but informative
- Use the conversation history to provide better context-aware responses
- If the user is asking about Fashion Forward products, services, or policies, use the FAQ data
- If the query is about something not covered in FAQs, escalate to human support
"""
            
            # Generate response using Gemini
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=500,
                    temperature=0.7,
                )
            )
            
            bot_response = response.text.strip()
            
            return {
                "response": bot_response,
                "escalation_level": escalation_level
            }
            
        except Exception as e:
            print(f"Gemini API Error: {e}")
            # Fallback to rule-based response
            return self.generate_fallback_response(user_query, conversation_history, language)
    
    def generate_fallback_response(self, user_query: str, conversation_history: List[dict], language: str = "en") -> dict:
        """Fallback response when Gemini API fails"""
        
        query = user_query.lower().strip()
        
        # Find best matching FAQ
        best_match = None
        best_score = 0
        
        for faq in self.faqs.get("faqs", []):
            score = self.calculate_similarity(query, faq)
            if score > best_score:
                best_score = score
                best_match = faq
        
        # If we have a good match, return it
        if best_match and best_score > 0.3:
            return {
                "response": best_match["answer"],
                "escalation_level": "normal"
            }
        
        # Check for common greetings
        greetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"]
        if any(greeting in query for greeting in greetings):
            return {
                "response": "Hello! Welcome to Fashion Forward! I'm here to help you with any questions about our products, shipping, returns, or anything else. How can I assist you today?",
                "escalation_level": "normal"
            }
        
        # Default response
        return {
            "response": "I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team directly at support@fashionforward.com",
            "escalation_level": "escalated"
        }
    
    def calculate_similarity(self, query, faq):
        """Calculate similarity between query and FAQ"""
        score = 0
        query_words = query.split()
        
        # Check question similarity
        question_words = faq["question"].lower().split()
        question_matches = sum(1 for word in query_words 
                             if any(q_word in word or word in q_word for q_word in question_words))
        score += (question_matches / len(query_words)) * 0.4
        
        # Check keyword similarity
        if "keywords" in faq:
            keyword_matches = sum(1 for word in query_words 
                                if any(keyword.lower() in word or word in keyword.lower() 
                                     for keyword in faq["keywords"]))
            score += (keyword_matches / len(query_words)) * 0.6
        
        return score
    
    def determine_escalation_level(self, user_query: str, conversation_history: List[dict]) -> str:
        """Determine if the query needs escalation"""
        
        query = user_query.lower().strip()
        
        # Non-escalation keywords (basic conversational questions)
        non_escalation_keywords = [
            'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
            'how are you', 'how are you doing', 'what\'s up', 'thanks', 'thank you',
            'bye', 'goodbye', 'see you', 'have a good day', 'nice to meet you',
            'what can you help', 'what do you do', 'who are you', 'what is this',
            'help', 'i need help', 'can you help', 'do you work here',
            'are you a robot', 'are you real', 'what\'s your name', 'tell me about yourself'
        ]
        
        # Escalation keywords (serious issues that need human intervention)
        escalation_keywords = [
            'complaint', 'refund', 'cancel', 'dispute', 'problem', 'issue', 
            'not working', 'broken', 'defective', 'angry', 'frustrated',
            'manager', 'supervisor', 'human', 'agent', 'representative',
            'sue', 'lawsuit', 'legal', 'attorney', 'lawyer', 'court',
            'fraud', 'scam', 'stolen', 'hacked', 'security breach',
            'discrimination', 'harassment', 'inappropriate', 'unethical'
        ]
        
        # Check for non-escalation keywords first
        if any(keyword in query for keyword in non_escalation_keywords):
            return 'normal'
        
        # Check for escalation keywords
        if any(keyword in query for keyword in escalation_keywords):
            return 'escalated'
        
        # Check if this is a follow-up to an escalated conversation
        if conversation_history and len(conversation_history) > 0:
            last_conversation = conversation_history[-1]
            if last_conversation.get('escalation_level') == 'escalated':
                return 'escalated'
        
        # Check for question patterns that might need escalation
        escalation_patterns = [
            'why is my', 'why can\'t i', 'why won\'t', 'why doesn\'t',
            'i can\'t', 'i won\'t', 'i don\'t', 'it doesn\'t', 'it won\'t',
            'this is wrong', 'this is incorrect', 'this is not working',
            'i want to speak to', 'i need to talk to', 'i demand to speak to'
        ]
        
        if any(pattern in query for pattern in escalation_patterns):
            return 'escalated'
        
        return 'normal'

# Initialize bot
bot = GeminiCustomerSupportBot()

# API Endpoints
@app.get("/", response_class=HTMLResponse)
async def read_root():
    """Serve the chat interface"""
    with open("static/index.html", "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chat endpoint"""
    try:
        # Get or create session
        if request.session_id not in sessions:
            sessions[request.session_id] = {
                "session_id": request.session_id,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "last_activity": datetime.now(timezone.utc).isoformat()
            }
            conversations[request.session_id] = []
        
        # Update last activity
        sessions[request.session_id]["last_activity"] = datetime.now(timezone.utc).isoformat()
        
        # Get conversation history
        conversation_history = conversations[request.session_id][-10:]  # Last 10 conversations
        
        # Generate AI response
        ai_response = bot.generate_response(
            request.query, 
            conversation_history, 
            request.session_id,
            language=request.language
        )
        
        # Save conversation
        conversation = {
            "user_query": request.query,
            "bot_response": ai_response["response"],
            "escalation_level": ai_response["escalation_level"],
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        conversations[request.session_id].append(conversation)
        
        return ChatResponse(
            response=ai_response["response"],
            session_id=request.session_id,
            escalation_level=ai_response["escalation_level"],
            timestamp=datetime.now(timezone.utc).isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sessions/{session_id}/history")
async def get_session_history(session_id: str):
    """Get conversation history for a session"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session_id,
        "conversations": conversations.get(session_id, [])
    }

@app.get("/api/sessions")
async def list_sessions():
    """List all sessions"""
    result = []
    for session_id, session_data in sessions.items():
        conversation_count = len(conversations.get(session_id, []))
        result.append(SessionInfo(
            session_id=session_id,
            created_at=session_data["created_at"],
            last_activity=session_data["last_activity"],
            conversation_count=conversation_count
        ))
    
    return result

@app.delete("/api/sessions/{session_id}")
async def delete_session(session_id: str):
    """Delete a session and all its conversations"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Delete session and conversations
    del sessions[session_id]
    if session_id in conversations:
        del conversations[session_id]
    
    return {"message": "Session deleted successfully"}

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

