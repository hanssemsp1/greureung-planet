/* ─────────────────────────────────────────────────────────────
   그르릉 행성 — 유전·번식 (5단계, 놀대리 2026-09-16)
   설계: 콘대리 `설계_냥이_유전.md` · 메모리 cat-genetics-design

   품종이 아니라 「털색 유전」이다. 유전자 여섯 + 성별:
     B  바탕색   검정(B) > 초콜릿(b) > 시나몬(b1)
     D  희석     진함(D) > 연함(d)         연함이면 검정→블루, 초콜릿→라일락, 시나몬→폰, 주황→크림
     O  오렌지   ⭐ X염색체. 암(XX)은 둘, 수(XY)는 하나 → O/o 인 암컷만 삼색·거북등
     A  아구티   줄무늬(A) > 단색(a)
     T  무늬     틱드(ti) > 점박이(sp) > 고등어(mc) > 클래식(cl)
     W  흰 얼룩  0 없음 · 1 양말 · 2 턱시도 · 3 젖소 · 4 거의 흰색   (부모 평균 ± 1)
     I  실버     실버(I) > 보통(i)         실버·스모크 계열 — 드물다

   사진은 통짜라 **유한 풀**이다: 유전 계산 → 도감 55종 중 가장 가까운 사진을 고른다.
   족보 있는 애(품종 12~21, 포인트 35~40)는 번식으로 절대 안 나온다 — 「찾아온다」(입양).
   삼색 수컷(XXY, 1/3000)은 전설. 돈으로 못 산다. 불임은 뺀다(보상이 벌이 되면 안 된다).
   ───────────────────────────────────────────────────────────── */

const 번식값 = 300;                 // 코인. 퍼즐 대여섯 판
const 번식시간 = 10 * 60 * 1000;    // 10분 뒤 태어난다 — 「돌아오면 새끼가 태어나 있다」
const 냥이상한 = 12;                // 마을 자리 — 무한 번식은 자리로 막는다(설계 §5)

const 유전키 = "그르릉_유전";
let GENES = {}; try{ GENES = JSON.parse(localStorage.getItem(유전키) || "{}"); }catch(e){}
function 유전저장(){ try{ localStorage.setItem(유전키, JSON.stringify(GENES)); }catch(e){} }

/* 시작 냥이들의 유전자 — 대표님 냥이 셋은 주황이 없다(설계 §4: 그래서 주황은 밖에서 와야 한다) */
const 기본유전 = {
  민이:  { sex:"F", B:["B","B"], D:["D","D"], O:["o","o"], A:["a","a"], T:["mc","mc"], W:4, I:["i","i"] },
  망치:  { sex:"M", B:["B","b"], D:["D","d"], O:["o"],     A:["a","a"], T:["mc","cl"], W:0, I:["i","i"] },
  문대:  { sex:"M", B:["B","B"], D:["D","d"], O:["o"],     A:["a","A"], T:["mc","mc"], W:2, I:["i","i"] },
  삼색이:{ sex:"F", B:["B","B"], D:["D","D"], O:["O","o"], A:["a","a"], T:["mc","mc"], W:2, I:["i","i"] },
  치즈:  { sex:"M", B:["B","B"], D:["D","D"], O:["O"],     A:["A","A"], T:["mc","mc"], W:0, I:["i","i"] },
  블루:  { sex:"M", B:["B","B"], D:["d","d"], O:["o"],     A:["a","a"], T:["mc","mc"], W:0, I:["i","i"] },
};

/* 도감 사진 → 유전자 짐작(입양한 아이). 사진 하나에 맞는 유전자 하나를 적어 둔다 */
const 도감유전 = {
  "01_고등어":{B:"B",D:"D",O:"o",A:"A",T:"mc",W:0}, "02_검정":{B:"B",D:"D",O:"o",A:"a",T:"mc",W:0}, "03_턱시도":{B:"B",D:"D",O:"o",A:"a",T:"mc",W:2},
  "04_삼색이":{B:"B",D:"D",O:"Oo",A:"a",T:"mc",W:2,sex:"F"}, "05_거북등":{B:"B",D:"D",O:"Oo",A:"a",T:"mc",W:0,sex:"F"}, "06_치즈":{B:"B",D:"D",O:"O",A:"A",T:"mc",W:0},
  "07_젖소":{B:"B",D:"D",O:"o",A:"a",T:"mc",W:3}, "08_블루":{B:"B",D:"d",O:"o",A:"a",T:"mc",W:0}, "09_클래식태비":{B:"B",D:"D",O:"o",A:"A",T:"cl",W:0},
  "10_점박이":{B:"B",D:"D",O:"o",A:"A",T:"sp",W:0}, "11_크림":{B:"B",D:"d",O:"O",A:"A",T:"mc",W:0},
  "22_흰둥이":{B:"B",D:"D",O:"o",A:"a",T:"mc",W:4}, "23_흰둥이오드아이":{B:"B",D:"D",O:"o",A:"a",T:"mc",W:4}, "24_검정장모":{B:"B",D:"D",O:"o",A:"a",T:"mc",W:0},
  "25_고등어장모":{B:"B",D:"D",O:"o",A:"A",T:"mc",W:0}, "26_삼색장모":{B:"B",D:"D",O:"Oo",A:"a",T:"mc",W:2,sex:"F"}, "27_틱드":{B:"B",D:"D",O:"o",A:"A",T:"ti",W:0},
  "28_블루틱드":{B:"B",D:"d",O:"o",A:"A",T:"ti",W:0}, "29_실버고등어":{B:"B",D:"D",O:"o",A:"A",T:"mc",W:0,I:"I"}, "30_실버클래식":{B:"B",D:"D",O:"o",A:"A",T:"cl",W:0,I:"I"},
  "31_실버점박이":{B:"B",D:"D",O:"o",A:"A",T:"sp",W:0,I:"I"}, "32_블랙스모크":{B:"B",D:"D",O:"o",A:"a",T:"mc",W:0,I:"I"}, "33_블루스모크":{B:"B",D:"d",O:"o",A:"a",T:"mc",W:0,I:"I"},
  "34_레드스모크":{B:"B",D:"D",O:"O",A:"a",T:"mc",W:0,I:"I"}, "41_초콜릿":{B:"b",D:"D",O:"o",A:"a",T:"mc",W:0}, "42_라일락":{B:"b",D:"d",O:"o",A:"a",T:"mc",W:0},
  "43_시나몬":{B:"b1",D:"D",O:"o",A:"a",T:"mc",W:0}, "44_폰":{B:"b1",D:"d",O:"o",A:"a",T:"mc",W:0}, "45_초콜릿고등어":{B:"b",D:"D",O:"o",A:"A",T:"mc",W:0},
  "46_블루크림":{B:"B",D:"d",O:"Oo",A:"a",T:"mc",W:0,sex:"F"}, "47_파스텔삼색":{B:"B",D:"d",O:"Oo",A:"a",T:"mc",W:2,sex:"F"}, "48_토비":{B:"B",D:"D",O:"o",A:"A",T:"mc",W:2},
  "49_밴검정":{B:"B",D:"D",O:"o",A:"a",T:"mc",W:4}, "50_밴주황":{B:"B",D:"D",O:"O",A:"a",T:"mc",W:4}, "51_양말검정":{B:"B",D:"D",O:"o",A:"a",T:"mc",W:1},
  "52_턱시도주황":{B:"B",D:"D",O:"O",A:"a",T:"mc",W:2}, "53_젖소주황":{B:"B",D:"D",O:"O",A:"a",T:"mc",W:3}, "54_주황클래식":{B:"B",D:"D",O:"O",A:"A",T:"cl",W:0},
  "55_크림단색":{B:"B",D:"d",O:"O",A:"a",T:"mc",W:0},
};
/* 족보 있는 애 — 번식으로 안 나온다. 유전자는 「검정 단색」으로 친다 */
const 품종목록 = ["12_러시안블루","13_샴","14_페르시안","15_메인쿤","16_스코티시폴드","17_뱅갈","18_브리티시숏헤어","19_아비시니안","20_노르웨이숲","21_랙돌","35_씰포인트","36_블루포인트","37_초콜릿포인트","38_라일락포인트","39_토티포인트","40_링스포인트"];

const 무작위 = a => a[(Math.random()*a.length)|0];
function 유전자만들기(k, sexHint){
  const g = 도감유전[k] || {B:"B",D:"D",O:"o",A:"a",T:"mc",W:0};
  const sex = g.sex || sexHint || 무작위(["F","M"]);
  const pair = (loc, v) => { const alt = {B:["B","b","b1"],D:["D","d"],A:["A","a"],T:["mc","cl","sp","ti"],I:["i","i","i","I"]}[loc]; return [v, Math.random()<.4 ? 무작위(alt) : v]; };
  let O;
  if (sex==="F") O = g.O==="Oo" ? ["O","o"] : [g.O, Math.random()<.3 ? (g.O==="O"?"o":"O") : g.O];
  else O = [g.O==="Oo" ? "O" : g.O];
  return { sex, B:pair("B",g.B), D:pair("D",g.D), O, A:pair("A",g.A), T:pair("T",g.T), W:g.W|0, I:pair("I",g.I||"i") };
}
function 냥이유전(c){
  if (GENES[c.n]) return GENES[c.n];
  let g;
  if (기본유전[c.n]) g = JSON.parse(JSON.stringify(기본유전[c.n]));
  else { const k = (c.src||"").replace(/^cut\//,"").replace(/\.png$/,""); g = 유전자만들기(k); g.품종 = 품종목록.includes(k); }
  GENES[c.n] = g; 유전저장(); return g;
}

/* ── 물려주기 ── */
function 새끼유전(mom, dad){
  const one = a => a[(Math.random()*a.length)|0];
  let sex = Math.random()<.5 ? "F" : "M";
  const xm = one(mom.O);                                  // 엄마 X 하나
  let O = sex==="F" ? [xm, dad.O[0]] : [xm];              // 딸은 아빠 X도 받는다, 아들은 Y
  let 전설 = false;
  if (sex==="M" && Math.random() < 1/3000){ O = [xm, dad.O[0]]; if (O[0]!==O[1]) 전설 = true; }   // XXY — 삼색 수컷
  const W = Math.max(0, Math.min(4, Math.round((mom.W+dad.W)/2 + (Math.random()<.5 ? -1 : 1) * (Math.random()<.5 ? 0 : 1))));
  return { sex, B:[one(mom.B),one(dad.B)], D:[one(mom.D),one(dad.D)], O, A:[one(mom.A),one(dad.A)], T:[one(mom.T),one(dad.T)], W, I:[one(mom.I),one(dad.I)], 전설 };
}

/* ── 겉모습 → 도감 사진 ── */
const 우성 = (a, order) => order.find(x => a.includes(x));
function 겉모습(g){
  const B = 우성(g.B, ["B","b","b1"]), dilute = !g.D.includes("D"), agouti = g.A.includes("A");
  const T = 우성(g.T, ["ti","sp","mc","cl"]), silver = g.I.includes("I"), W = g.W|0;
  const os = g.O.filter(x=>x==="O").length, tortie = g.O.length===2 && os===1, orange = !tortie && os>0;
  let k, label;
  if (W >= 4){ k = Math.random()<.25 ? "23_흰둥이오드아이" : "22_흰둥이"; label = "흰둥이"; }
  else if (tortie){
    if (dilute) { k = W>=2 ? "47_파스텔삼색" : "46_블루크림"; label = W>=2 ? "파스텔 삼색" : "블루크림"; }
    else        { k = W>=2 ? "04_삼색이" : "05_거북등";   label = W>=2 ? "삼색이" : "거북등"; }
  }
  else if (orange){
    if (silver)      { k = "34_레드스모크"; label = "레드 스모크"; }
    else if (dilute) { k = W>=2 ? "55_크림단색" : "11_크림"; label = "크림"; }
    else if (W>=3)   { k = Math.random()<.5 ? "53_젖소주황" : "50_밴주황"; label = "주황 젖소"; }
    else if (W>=1)   { k = "52_턱시도주황"; label = "주황 턱시도"; }
    else             { k = (agouti && T==="cl") ? "54_주황클래식" : "06_치즈"; label = (agouti && T==="cl") ? "주황 클래식" : "치즈"; }
  }
  else if (silver){
    if (agouti) { k = T==="cl" ? "30_실버클래식" : T==="sp" ? "31_실버점박이" : "29_실버고등어"; label = "실버 " + ({cl:"클래식",sp:"점박이"}[T]||"고등어"); }
    else        { k = dilute ? "33_블루스모크" : "32_블랙스모크"; label = dilute ? "블루 스모크" : "블랙 스모크"; }
  }
  else if (agouti){
    if (W>=1)               { k = "48_토비"; label = "토비"; }
    else if (B==="b")       { k = "45_초콜릿고등어"; label = "초콜릿 고등어"; }
    else if (B==="b1")      { k = "43_시나몬"; label = "시나몬"; }
    else if (T==="ti")      { k = dilute ? "28_블루틱드" : "27_틱드"; label = dilute ? "블루 틱드" : "틱드"; }
    else if (dilute)        { k = "08_블루"; label = "블루 태비"; }
    else                    { k = {cl:"09_클래식태비", sp:"10_점박이"}[T] || "01_고등어"; label = {cl:"클래식 태비", sp:"점박이"}[T] || "고등어"; }
  }
  else {
    if (B==="b")            { k = dilute ? "42_라일락" : "41_초콜릿"; label = dilute ? "라일락" : "초콜릿"; }
    else if (B==="b1")      { k = dilute ? "44_폰" : "43_시나몬"; label = dilute ? "폰" : "시나몬"; }
    else if (dilute)        { k = "08_블루"; label = "블루"; }
    else                    { k = ["02_검정","51_양말검정","03_턱시도","07_젖소"][Math.min(3,W)]; label = ["검정","양말 검정","턱시도","젖소"][Math.min(3,W)]; }
  }
  return { k, label, src:"cut/"+k+".png" };
}

/* ── 상태 ── */
function 알(){ return 마을읽기().breeding || null; }
function 알저장(b){ const t = 마을읽기(); if (b) t.breeding = b; else delete t.breeding; 마을쓰기(t); }
const 성별표 = c => (냥이유전(c).sex==="F" ? "♀" : "♂");

/* ── 짝 고르기 ── */
let 짝 = { mom:null, dad:null };
function 번식열기(){
  ptitle.textContent = "엄마 ♀ 하나, 아빠 ♂ 하나를 고르세요 · 🪙 " + 번식값; 탭표시("breed");
  const b = 알();
  if (b){ items.innerHTML = '<div class="it none">🥚 ' + b.mom + ' × ' + b.dad + ' 의 새끼가 오는 중이에요 — ' + 남은시간(b.due) + '</div>'; panel.hidden=false; return; }
  const cards = CATS.map((c,i) => { const g = 냥이유전(c); const sel = (짝.mom===c||짝.dad===c);
    return '<div class="it cat' + (sel?' on':'') + '" data-mate="' + i + '" style="' + (sel?'outline:2px solid #ffd36e':'') + '"><img src="' + (c.src||("cut/"+c.f+".png")) + '" alt="">' + c.n + ' ' + 성별표(c) +
      '<span class="sub">' + (g.품종 ? "족보 있음" : "길냥이 계열") + '</span></div>'; }).join("");
  const ready = 짝.mom && 짝.dad;
  items.innerHTML = cards + '<div class="sec">' + (ready ? '<button id="breedGo" class="tab on" style="font-size:13px;padding:8px 14px">💞 ' + 짝.mom.n + ' × ' + 짝.dad.n + ' — 🪙 ' + 번식값 + ' 로 새끼 기다리기</button>' : '엄마와 아빠를 하나씩 누르세요') + '</div>';
  const go = document.getElementById("breedGo"); if (go) go.onclick = 번식시작;
  panel.hidden=false; hide();
}
function 짝고르기(c){
  const g = 냥이유전(c);
  if (g.sex==="F") 짝.mom = (짝.mom===c ? null : c); else 짝.dad = (짝.dad===c ? null : c);
  번식열기();
}
function 남은시간(due){ const s = Math.max(0, Math.ceil((due-Date.now())/1000)); return s>=60 ? Math.ceil(s/60)+"분" : s+"초"; }
function 번식시작(){
  if (!짝.mom || !짝.dad) return;
  if (CATS.length >= 냥이상한){ 안내("마을에 자리가 없어요 — 냥이는 " + 냥이상한 + "마리까지예요"); return; }
  const t = 마을읽기(); if ((t.coin|0) < 번식값){ 안내("코인이 " + (번식값-(t.coin|0)) + "개 모자라요"); return; }
  t.coin = (t.coin|0) - 번식값; t.breeding = { mom:짝.mom.n, dad:짝.dad.n, due: Date.now()+번식시간 }; 마을쓰기(t); 코인갱신();
  짝 = { mom:null, dad:null }; panel.hidden = true;
  안내("🥚 " + t.breeding.mom + "와 " + t.breeding.dad + "의 새끼가 " + Math.round(번식시간/60000) + "분 뒤에 태어나요. 다녀오셔도 돼요");
}

/* ── 태어남 ── */
function 태어나기(){
  const b = 알(); if (!b || Date.now() < b.due) return;
  const mom = CATS.find(c=>c.n===b.mom), dad = CATS.find(c=>c.n===b.dad);
  알저장(null);
  if (!mom || !dad) return;
  const g = 새끼유전(냥이유전(mom), 냥이유전(dad));
  const look = 겉모습(g);
  let name = (prompt((g.전설 ? "🏆 전설! 삼색 수컷이 태어났어요!\n" : "🎉 새끼가 태어났어요! " + look.label + " " + (g.sex==="F"?"♀":"♂") + "\n") + "이름을 지어 주세요", look.label) || "").trim();
  if (!name) name = look.label;
  const used = new Set(CATS.map(c=>c.n)); let base = name, n = 2; while (used.has(name)) name = base + n++;
  const u = Math.max(.10, Math.min(열린끝()-.05, mom.u + (Math.random()-.5)*.06)), v = Math.max(놓기.v0, Math.min(.98, mom.v + .03));
  const c = { n:name, f:null, src:look.src, u, v, big:아기*.8, adopted:true, born:true, at:Date.now() };
  c.im0 = load(c.src); c.ph = Math.random()*6; c.pose = 기본; c.until = (performance.now()-t0)/1000+1; c.face = 1; c.walk = 0; c.tu = u; c.home = u; c.tv = null; c.wph = 0; c.hurry = null; c.mood = 1; c.dash = 0;
  CATS.push(c); GENES[name] = g; 유전저장(); 입양저장(); 냥이자리저장(); 성장갱신();
  const tt = (performance.now()-t0)/1000; HEARTS.push({u,v,t0:tt,c}); HEARTS.push({u,v,t0:tt+.5,c});
  camX = u*landW() - W/2;
  안내((g.전설 ? "🏆 전설의 삼색 수컷! " : "🎉 ") + look.label + " " + (g.sex==="F"?"♀":"♂") + " " + name + 조사(name,"이","가") + " 태어났어요!");
}
setInterval(() => { const b = 알(); if (b && Date.now() >= b.due && !document.hidden) 태어나기(); }, 1500);
setTimeout(() => { const b = 알(); if (b && Date.now() >= b.due) 태어나기(); }, 1200);

/* ── 패널 연결: 🐾 탭에 성별·「💞 새끼 낳기」 ── */
(function(){
  const 원래 = 냥이목록열기;
  냥이목록열기 = function(){
    원래();
    items.querySelectorAll(".it[data-cat]").forEach(el => { const c = CATS[+el.dataset.cat]; if (c){ const t = el.childNodes[1]; if (t && t.nodeType===3) t.textContent = c.n + " " + 성별표(c); } });
    const b = 알();
    items.insertAdjacentHTML("beforeend", '<div class="sec"><button id="toBreed" class="tab on" style="font-size:13px;padding:8px 14px">💞 새끼 낳기' + (b ? ' · 🥚 ' + 남은시간(b.due) + ' 남음' : '') + '</button></div>');
    document.getElementById("toBreed").onclick = 번식열기;
  };
  items.addEventListener("click", e => {
    const m = e.target.closest(".it[data-mate]"); if (m){ e.stopImmediatePropagation(); 짝고르기(CATS[+m.dataset.mate]); }
  }, true);
})();
