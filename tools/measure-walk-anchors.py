"""Record stable painted-character scale and ground anchors without editing pixels."""
from pathlib import Path
from PIL import Image
import json
root=Path(__file__).resolve().parents[1]/'dist/assets'
for stem,cols in [('hero-walk',8),('hero-walk-passing',4)]:
 p=root/(stem+'-regions.json');meta=json.loads(p.read_text());im=Image.open(root/('hero-walk-smooth.png' if cols==8 else 'hero-walk-passing.png'));alpha=im.getchannel('A');rows=[]
 for hero in range(6):
  tops=[];bottoms=[]
  for r in meta['frames'][hero*cols:(hero+1)*cols]:
   crop=alpha.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h']))
   occupied=[y for y in range(r['h'])if sum(v>150 for v in crop.crop((0,y,r['w'],y+1)).getdata())>=8]
   tops.append(min(occupied));bottoms.append(max(occupied))
  rows.append({'height':max(bottoms)-min(tops)+1,'baseline':max(bottoms)+1})
 meta['rowMetrics']=rows;p.write_text(json.dumps(meta,indent=2))
print('Stable body scale and foot anchors recorded for both atlases')
