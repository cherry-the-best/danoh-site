const $=id=>document.getElementById(id);
const show=n=>["home","quiz","result"].forEach(s=>$(s).classList.toggle("hide",s!==n));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
let bests={};try{bests=JSON.parse(localStorage.getItem("danoh-best")||"{}")}catch(e){}
function saveBest(id,s){if((bests[id]||0)<s){bests[id]=s;try{localStorage.setItem("danoh-best",JSON.stringify(bests))}catch(e){}}}
function renderHome(){
  $("sets").innerHTML="";
  QUIZ_SETS.forEach(s=>{const b=document.createElement("button");b.className="set";
    b.innerHTML=`<div><b>${s.name}</b><span>${s.desc} · ${s.items.length}문제</span></div><i>${bests[s.id]!=null?"최고 "+bests[s.id]+"/"+s.items.length:"시작"}</i>`;
    b.onclick=()=>start(s);$("sets").appendChild(b)});
  show("home");
}
let cur,qs,idx,score,wrong;
function start(s){cur=s;qs=shuffle(s.items);idx=0;score=0;wrong=[];show("quiz");ask()}
function ask(){
  const [w,ans,opts]=qs[idx];
  $("pbar").style.width=(idx/qs.length*100)+"%";
  $("pnum").textContent=`${idx+1} / ${qs.length}`;$("pscore").textContent=`정답 ${score}`;
  $("qword").textContent=w;$("fb").innerHTML="";$("next").classList.add("hide");
  $("opts").innerHTML="";
  shuffle(opts).forEach(o=>{const b=document.createElement("button");b.className="opt";b.textContent=o;b.onclick=()=>pick(b,o);$("opts").appendChild(b)});
}
function pick(btn,o){
  const [w,ans,,ex]=qs[idx];const right=o===ans;
  document.querySelectorAll(".opt").forEach(b=>{b.disabled=true;if(b.textContent===ans)b.classList.add("ok")});
  if(right){score++}else{btn.classList.add("bad");wrong.push([w,ans,o])}
  $("pscore").textContent=`정답 ${score}`;
  $("fb").innerHTML=`<div class="fb"><strong class="${right?"ok":"bad"}">${right?"정답이에요":"아쉬워요. 정답은 "+ans}</strong><br>${ex}</div>`;
  const last=idx===qs.length-1;$("next").textContent=last?"결과 보기":"다음 문제";$("next").classList.remove("hide");$("next").focus();
}
$("next").onclick=()=>{idx++;idx<qs.length?ask():finish()};
function finish(){
  saveBest(cur.id,score);$("pbar").style.width="100%";
  $("rtitle").textContent=cur.name;
  $("rscore").innerHTML=`${score}<small> / ${qs.length}</small>`;
  const r=score/qs.length;
  $("rmsg").textContent=r===1?"만점이에요. 다음 세트에 도전해 보세요.":r>=.6?"좋아요. 틀린 단어만 다시 확인해 볼까요?":"괜찮아요. 아래 단어를 보고 한 번 더 풀어 보세요.";
  $("review").innerHTML=wrong.map(([w,a,o])=>`<li><b>${w}</b> = ${a} <em>(내 답: ${o})</em></li>`).join("");
  show("result");
}
$("again").onclick=()=>start(cur);
$("home2").onclick=()=>{renderHome()};
renderHome();
