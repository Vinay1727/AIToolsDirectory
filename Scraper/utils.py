import json
import os
import re

def normalize_category(category):
    if not category:
        return "general"
    # Convert to slug format (lowercase, hyphens)
    cat = category.lower().strip()
    cat = re.sub(r'[^a-z0-9\s-]', '', cat)
    cat = re.sub(r'[\s]+', '-', cat)
    
    # Mapping common variations to fixed FRONTEND slugs
    mapping = {
        "image": "ai-image",
        "video": "ai-video",
        "chat": "chatbot",
        "coding": "ai-coding",
        "code": "ai-coding",
        "marketing": "ai-marketing",
        "content": "ai-marketing",
        "copywriting": "ai-marketing"
    }
    
    for key, value in mapping.items():
        if key in cat:
            return value
            
    return cat

def save_to_json(data, filename="tools.json"):
    filepath = os.path.join(os.path.dirname(__file__), "data", filename)
    
    # Load existing if exists to merge or handle duplicates
    existing_data = []
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            try:
                existing_data = json.load(f)
            except json.JSONDecodeError:
                existing_data = []

    # Combine and clean duplicates based on website_url
    combined = existing_data + data
    seen_urls = set()
    cleaned_data = []
    
    for item in combined:
        url = item.get('website_url')
        if url and url not in seen_urls:
            cleaned_data.append(item)
            seen_urls.add(url)
            
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(cleaned_data, f, indent=2)
    
    return len(cleaned_data)
