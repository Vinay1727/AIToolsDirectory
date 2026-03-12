import requests
from bs4 import BeautifulSoup
import time

def scrape_futurepedia(max_pages=2):
    tools = []
    # Using the most reliable listing URL
    url = "https://www.futurepedia.io/ai-tools"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
    }

    print(f"Fetching tools from {url}...")
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code != 200:
            print(f"Error: Received status code {response.status_code}")
            return []

        soup = BeautifulSoup(response.text, 'html.parser')
        
        # New selectors based on current DOM structure
        # Futurepedia uses 'bg-card' for tool cards
        cards = soup.find_all(class_=lambda x: x and 'bg-card' in x)
        
        for card in cards:
            try:
                # Name is usually in a p or h3 tag with semibold font
                name_tag = card.find(['p', 'h3'], class_=lambda x: x and 'font-semibold' in x)
                # Description usually has line-clamp
                desc_tag = card.find('p', class_=lambda x: x and 'line-clamp' in x)
                # Links usually contain /visit or /tool
                link_tag = card.find('a', href=True)
                # Logo
                logo_tag = card.find('img')

                if name_tag:
                    tools.append({
                        "name": name_tag.get_text(strip=True),
                        "description": desc_tag.get_text(strip=True) if desc_tag else "AI Tool",
                        "website_url": "https://www.futurepedia.io" + link_tag['href'] if link_tag['href'].startswith('/') else link_tag['href'],
                        "category": "Productivity",
                        "logo_url": logo_tag.get('src', '') if logo_tag else ""
                    })
            except Exception as e:
                continue

        print(f"Successfully extracted {len(tools)} tools.")
    except Exception as e:
        print(f"Failed to scrape Futurepedia: {e}")
        
    return tools
