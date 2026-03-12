import requests
from bs4 import BeautifulSoup
import json
import re

def scrape_ph():
    tools = []
    url = "https://www.producthunt.com/topics/artificial-intelligence"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    print(f"Fetching {url}...")
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if "Just a moment..." in response.text:
            print("Product Hunt blocked the request (Cloudflare).")
            return []
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Look for Apollo state JSON
        script = soup.find("script", string=re.compile(r"window\.__APOLLO_STATE__"))
        if script:
            data_str = script.string.replace("window.__APOLLO_STATE__ = ", "").rstrip(";")
            data = json.loads(data_str)
            
            for key, value in data.items():
                if key.startswith("Post:") and "name" in value:
                    tool = {
                        "name": value.get("name"),
                        "description": value.get("tagline"),
                        "website_url": "https://www.producthunt.com/posts/" + value.get("slug"),
                        "category": "AI",
                        "logo_url": "" # Image URLs are complex in Apollo state
                    }
                    tools.append(tool)
        else:
            # Fallback to simple parsing if possible
            cards = soup.select("[data-test^='post-item-']")
            for card in cards:
                name = card.select_one("[data-test='post-name']")
                desc = card.select_one("[data-test='post-tagline']")
                link = card.select_one("a[href^='/posts/']")
                
                if name:
                    tools.append({
                        "name": name.get_text(strip=True),
                        "description": desc.get_text(strip=True) if desc else "",
                        "website_url": "https://www.producthunt.com" + link['href'] if link else "",
                        "category": "AI",
                        "logo_url": ""
                    })
                    
    except Exception as e:
        print(f"Error scraping Product Hunt: {e}")
        
    return tools
