import re
import json

def parse_time_to_minutes(time_str):
    h = 0
    m = 0
    h_match = re.search(r'(\d+)h', time_str)
    if h_match:
        h = int(h_match.group(1))
    m_match = re.search(r'(\d+)m', time_str)
    if m_match:
        m = int(m_match.group(1))
    return h * 60 + m

with open('raw_schedule.txt', 'r', encoding='utf-8') as f:
    lines = f.read().splitlines()

sprints = []
current_sprint = None
current_day = None

for line in lines:
    line = line.strip()
    if not line:
        continue
    
    if line.startswith('Sprint '):
        sprint_num = int(re.search(r'Sprint (\d+)', line).group(1))
        current_sprint = {
            'id': f's{sprint_num}',
            'sprintNumber': sprint_num,
            'estimatedMinutes': 0,
            'days': []
        }
        sprints.append(current_sprint)
    elif line.startswith('Estimated total:'):
        current_sprint['estimatedMinutes'] = parse_time_to_minutes(line)
    elif line.startswith('Day '):
        day_num = int(re.search(r'Day (\d+)', line).group(1))
        current_day = {
            'id': f"{current_sprint['id']}-d{day_num}",
            'dayNumber': day_num,
            'estimatedMinutes': 0,
            'problems': []
        }
        current_sprint['days'].append(current_day)
    elif line.startswith('Estimated time:'):
        if current_day:
            current_day['estimatedMinutes'] = parse_time_to_minutes(line)
    elif re.match(r'^\d+\.', line):
        if current_day:
            problem_title = re.sub(r'^\d+\.\s*', '', line)
            problem_idx = len(current_day['problems']) + 1
            current_day['problems'].append({
                'id': f"{current_day['id']}-p{problem_idx}",
                'title': problem_title
            })

ts_content = f"""// IMMUTABLE PLANLY SCHEDULE
// DO NOT MODIFY WITHOUT EXPLICIT USER REQUEST
import {{ Sprint }} from '../types/schedule';

export const scheduleData: Sprint[] = {json.dumps(sprints, indent=2)};
"""

with open('src/data/scheduleData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)
