import sys
from process_page import process_page

# A comprehensive list of important Stardew Valley pages to ingest
PAGES_TO_INGEST = [
    # Villagers
    "Abigail", "Alex", "Caroline", "Clint", "Demetrius", "Dwarf", "Elliott", "Emily", "Evelyn",
    "George", "Gus", "Haley", "Harvey", "Jas", "Jodi", "Kent", "Krobus", "Leah", "Lewis", "Linus",
    "Marnie", "Maru", "Pam", "Penny", "Pierre", "Robin", "Sam", "Sandy", "Sebastian", "Shane",
    "Vincent", "Willy", "Wizard",
    
    # Crops
    "Cauliflower", "Garlic", "Green Bean", "Kale", "Potato", "Rhubarb", "Strawberry", "Tulip",
    "Blueberry", "Coffee Bean", "Melon", "Corn", "Tomato", "Hot Pepper", "Wheat", "Radish", "Red Cabbage", "Starfruit",
    "Pumpkin", "Bok Choy", "Yam", "Cranberries", "Eggplant", "Artichoke", "Amaranth", "Grape", "Fairy Rose", "Sweet Gem Berry",
    
    # Places
    "The Mines", "Skull Cavern", "Volcano Dungeon", "Ginger Island", "Pelican Town", "Calico Desert",
    "Cindersap Forest", "Mutant Bug Lair",
    
    # Skills
    "Farming", "Mining", "Foraging", "Fishing", "Combat",
    
    # Animals
    "Chicken", "Cow", "Goat", "Duck", "Sheep", "Pig", "Rabbit", "Dinosaur", "Ostrich",
    
    # Mechanics
    "Weather", "Marriage", "Friendship", "Bundles", "Festivals"
]

def main():
    print(f"Starting bulk ingestion of {len(PAGES_TO_INGEST)} pages...")
    for i, page in enumerate(PAGES_TO_INGEST):
        print(f"\n[{i+1}/{len(PAGES_TO_INGEST)}] Processing {page}...")
        try:
            process_page(page)
        except Exception as e:
            print(f"Failed to process {page}: {e}")

if __name__ == "__main__":
    main()
