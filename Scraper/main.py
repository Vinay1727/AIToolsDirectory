import os
import json
from scrapers.futurepedia import scrape_futurepedia
from scrapers.theresanaiforthat import scrape_taaft
from scrapers.producthunt import scrape_ph
from utils import save_to_json, normalize_category
from supabase_utils import insert_to_supabase

def main():
    print("========================================")
    print("🚀 AI Tools Scraper (Quick 50 Dataset)")
    print("========================================\n")
    
    if not os.path.exists("data"):
        os.makedirs("data")

    all_tools = []

    # Try Futurepedia
    print("🔍 Scraping Futurepedia...")
    all_tools.extend(scrape_futurepedia())
    
    # Try TAAFT
    print("\n🔍 Scraping TAAFT...")
    all_tools.extend(scrape_taaft())

    if not all_tools:
        print("\n⚠️ No tools were found. Websites might be blocking automated requests.")
        print("Tip: Run from a different IP or use a VPN.")
        return

    # Normalize
    for tool in all_tools:
        tool['category'] = normalize_category(tool.get('category', 'AI Tool'))

    # Save
    total_saved = save_to_json(all_tools)
    print(f"\n✅ Total Unique Tools Collected: {total_saved}")

    # Optional: Supabase
    if total_saved > 0:
        choice = input("\nDo you want to upload these to Supabase? (y/n): ")
        if choice.lower() == 'y':
            with open("scraper/data/tools.json", 'r', encoding='utf-8') as f:
                clean_data = json.load(f)
            insert_to_supabase(clean_data)

if __name__ == "__main__":
    main()
