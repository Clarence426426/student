"""Read walk sheet alpha and write cell coordinates, preserving original pixels."""
from PIL import Image
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]/'dist/assets'
im=Image.open(root/'hero-walk-passing.png');a=im.getchannel('A');w,h=im.size
hist=[sum(v>150 for v in a.crop((0,y,w,y+1)).getdata())for y in range(h)]
ys=[0]+[min(range(max(1,int(h*i/6-h*.035)),min(h-1,int(h*i/6+h*.035))),key=lambda y:hist[y])for i in range(1,6)]+[h]
frames=[]
for row in range(6):
 vertical=[sum(v>150 for v in a.crop((x,ys[row],x+1,ys[row+1])).getdata())for x in range(w)]
 xs=[0]+[min(range(int(w*i/4-w*.015),int(w*i/4+w*.015)),key=lambda x:vertical[x])for i in range(1,4)]+[w]
 for col in range(4):frames.append({'x':xs[col]+2,'y':ys[row]+2,'w':xs[col+1]-xs[col]-4,'h':ys[row+1]-ys[row]-4})
(root/'hero-walk-passing-regions.json').write_text(json.dumps({'width':w,'height':h,'frames':frames},indent=2))
assert len(frames)==24
assert all(r['w']>0 and r['h']>0 for r in frames)
assert im.mode=='RGBA' and a.getextrema()[0]==0
print('24 down/passing poses, four per hero')
