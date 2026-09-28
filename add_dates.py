import json
import re
import datetime

# Read scheduleData.ts
with open('src/data/scheduleData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract JSON part
match = re.search(r'export const scheduleData: Sprint\[\] = (\[.*\]);', content, re.DOTALL)
if not match:
    raise ValueError("Could not find JSON array")

json_str = match.group(1)
sprints = json.loads(json_str)

current_date = datetime.date(2026, 9, 30)

for sprint in sprints:
    # Handle the specific rule for Sprint 12 only having day 1
    # But wait, if they exist in the JSON, they will just get assigned dates sequentially.
    for day in sprint['days']:
        day['date'] = current_date.isoformat()
        current_date += datetime.timedelta(days=1)

ts_content = f"""// IMMUTABLE PLANLY SCHEDULE
// DO NOT MODIFY WITHOUT EXPLICIT USER REQUEST
import type {{ Sprint }} from '../types/schedule';

export const scheduleData: Sprint[] = {json.dumps(sprints, indent=2)};
"""

with open('src/data/scheduleData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Dates added successfully")
