"""Read PNG alpha channels and record atlas regions. Never changes artwork."""
import json
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]/'dist/assets'
out={}
for p in root.glob('hero-*-sprites.png'):
 im=Image.open(p);a=im.getchannel('A');w,h=im.size
 horizontal=[sum(v>150 for v in a.crop((0,y,w,y+1)).getdata())for y in range(h)]
 ys=[0]+[min(range(max(1,int(h*i/5-h*.045)),min(h-1,int(h*i/5+h*.055))),key=lambda y:horizontal[y])for i in range(1,5)]+[h]
 frames=[]
 for row in range(5):
  hist=[sum(v>150 for v in a.crop((x,ys[row],x+1,ys[row+1])).getdata())for x in range(w)]
  xs=[0]+[min(range(int(w*i/8-w*.018),int(w*i/8+w*.018)),key=lambda x:hist[x])for i in range(1,8)]+[w]
  for col in range(8):frames.append({'x':xs[col]+2,'y':ys[row]+2,'w':xs[col+1]-xs[col]-4,'h':ys[row+1]-ys[row]-4})
 out[p.name[5:-12]]={'width':w,'height':h,'frames':frames}
(root/'hero-sprite-regions.json').write_text(json.dumps(out,indent=2))
print('Recorded regions:',', '.join(out))
