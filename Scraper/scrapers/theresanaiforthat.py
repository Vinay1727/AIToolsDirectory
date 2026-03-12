import requests
from bs4 import BeautifulSoup
import time

def scrape_taaft(max_pages=1):
    tools = []
    # Correcting URL to the main list
    url = "https://theresanaiforthat.com/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }

    print(f"Fetching tools from {url}...")
    try:
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # TAAFT uses 'li' with class 'li' for tool entries
        cards = soup.select("li.li")
        
        for card in cards:
            name_tag = card.select_one(".ai_name")
            desc_tag = card.select_one(".li_desc")
            link_tag = card.select_one("a.external_ai_link") or card.select_one("a.ai_link")
            
            if name_tag:
                tools.append({
                    "name": name_tag.get_text(strip=True),
                    "description": desc_tag.get_text(strip=True) if desc_tag else "AI Tool",
                    "website_url": link_tag['href'] if link_tag else "",
                    "category": "General",
                    "logo_url": ""
                })
        
        print(f"Successfully extracted {len(tools)} tools from TAAFT.")
    except Exception as e:
        print(f"Failed to scrape TAAFT: {e}")
        
    return tools
