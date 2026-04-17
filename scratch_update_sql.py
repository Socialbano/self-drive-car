import sys
import re
import os

def replace_price_in_sql(file_path):
    if not os.path.exists(file_path):
        return
        
    with open(file_path, "r") as f:
        content = f.read()

    # table structure
    content = content.replace("price_per_day NUMERIC(10, 2) NOT NULL", "price_12hr NUMERIC(10, 2) NOT NULL,\n    price_24hr NUMERIC(10, 2) NOT NULL")
    
    # insert statement
    content = content.replace("price_per_day, fuel_type", "price_12hr, price_24hr, fuel_type")
    
    # values map
    content = re.sub(r"(\d+),\s*'(diesel|petrol|cng|electric)'", lambda m: f"{round(int(m.group(1)) * 0.65)}, {m.group(1)}, '{m.group(2)}'", content)

    with open(file_path, "w") as f:
        f.write(content)

replace_price_in_sql("setup_database.sql")
replace_price_in_sql("supabase_seed.sql")
print("SQL files mapped")
