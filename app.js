/* Cumtales wall — localStorage demo (no backend) */
(function(){
  const STORAGE_KEY = "cumtales:v1";
  const AGE_KEY = "cumtales:age_ok";
  const ONBOARD_KEY = "cumtales:onboard_done";
  const PREF_KEY = "cumtales:prefs";
  const SUB_KEY = "cumtales:subscribed";
  const PAGE_SIZE = 12;

  const ONBOARD_SLIDES = [
    {k:"Read", t:"The wall", b:"Anonymous stories pinned to a dark wall. Click a note. Read in private."},
    {k:"Feel", t:"Tension", b:"Not graphic. Just the parts that raise your pulse."},
    {k:"Rank", t:"Vote", b:"Upvote what deserves page one. The wall evolves."},
    {k:"Create", t:"Write", b:"Post your own story. No names. No photos. Just words."},
    {k:"Rules", t:"Boundaries", b:"No doxxing. No contact details. No non-consent. We remove it."},
    {k:"Tune", t:"Personal", b:"You pick the mood. We tune the experience."},
    {k:"Curate", t:"Curated heat", b:"Top notes rise. The rest drift into deeper pages."},
    {k:"Unlock", t:"Members", b:"Some endings can be member-only later."},
    {k:"Habit", t:"Return", b:"Bookmark and keep a reading streak."},
    {k:"Enter", t:"Enter", b:"One last breath. Then the wall is yours."},
  ];

  const els = {
    year: document.getElementById("year"),
    wall: document.getElementById("wall"),
    countLabel: document.getElementById("countLabel"),
    pageIndicator: document.getElementById("pageIndicator"),
    prevPage: document.getElementById("prevPage"),
    nextPage: document.getElementById("nextPage"),
    searchInput: document.getElementById("searchInput"),
    newStoryBtn: document.getElementById("newStoryBtn"),

    storyModal: document.getElementById("storyModal"),
    storyTitle: document.getElementById("storyTitle"),
    storyMeta: document.getElementById("storyMeta"),
    storyText: document.getElementById("storyText"),
    upvoteBtn: document.getElementById("upvoteBtn"),
    shareBtn: document.getElementById("shareBtn"),

    createModal: document.getElementById("createModal"),
    createForm: document.getElementById("createForm"),
    titleInput: document.getElementById("titleInput"),
    bodyInput: document.getElementById("bodyInput"),
    consentCheck: document.getElementById("consentCheck"),

    rulesModal: document.getElementById("rulesModal"),
    privacyModal: document.getElementById("privacyModal"),
    termsModal: document.getElementById("termsModal"),
    termsDate: document.getElementById("termsDate"),

    ageWall: document.getElementById("ageWall"),
    enterBtn: document.getElementById("enterBtn"),
    leaveBtn: document.getElementById("leaveBtn"),

    openRules: document.getElementById("openRules"),
    openPrivacy: document.getElementById("openPrivacy"),
    openTerms: document.getElementById("openTerms"),
    openRules2: document.getElementById("openRules2"),
    openPrivacy2: document.getElementById("openPrivacy2"),
    openTerms2: document.getElementById("openTerms2"),
    homeLogo: document.getElementById("homeLogo"),

    onboardModal: document.getElementById("onboardModal"),
    onboardImage: document.getElementById("onboardImage"),
    onboardKicker: document.getElementById("onboardKicker"),
    onboardTitleText: document.getElementById("onboardTitleText"),
    onboardBody: document.getElementById("onboardBody"),
    onboardQuestions: document.getElementById("onboardQuestions"),
    onboardDots: document.getElementById("onboardDots"),
    skipOnboard: document.getElementById("skipOnboard"),
    backOnboard: document.getElementById("backOnboard"),
    nextOnboard: document.getElementById("nextOnboard"),
  };

  let state = {
    stories: [],
    page: 1,
    q: "",
    activeId: null,
  };

  const now = () => new Date().toISOString();

  function uid(){
    return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
  }

  function safeText(s){
    return (s || "").toString().replace(/\s+/g, " ").trim();
  }

  function readStore(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return null;
      const parsed = JSON.parse(raw);
      if(!parsed || !Array.isArray(parsed.stories)) return null;
      return parsed;
    }catch(e){ return null; }
  }

  function writeStore(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify({stories: state.stories}));
  }

  function seedIfEmpty(){
    const existing = readStore();
    if(existing){
      state.stories = existing.stories;
      return;
    }
    state.stories = [
      { id: uid(), title: "The Ribbon on the Door", votes: 0, createdAt: now(), body:
`The hotel corridor was silent, but the city outside still breathed. I walked past room numbers like they were dares. My key card waited in my palm, warm from my skin, and the ribbon tied to the handle was exactly where the note said it would be.

It wasn’t a message that begged. It didn’t need to. It was precise. “If you’re brave, come alone. If you’re not, don’t come at all.” I should have laughed and kept walking. Instead, I unknotted the ribbon with careful fingers, as if rushing would break the spell.

Inside, the room was dim and orderly. A glass of water on the desk. A second key on the dresser. A folded page: “Lock the door.”

I did. The click was loud enough to feel like a confession.

There are moments when you realize the game isn’t about the body. It’s about surrendering control without losing yourself. I stood there, listening to my own breathing, feeling the quiet move closer. And when footsteps finally came from the balcony, slow and unhurried, I didn’t step back. I stepped forward, as if the room had been waiting for me all along.

We never used names. Names are for mornings. This was a story you carry under your tongue and never fully explain.`},
      { id: uid(), title: "The Message You Shouldn’t Open", votes: 0, createdAt: now(), body:
`It arrived at 2:11 a.m. A single notification. No emoji. No greeting. Just: “Don’t overthink it. Read.”

The screen glowed against the dark like a tiny stage. I should have turned it face down and slept. Instead, I opened it and felt the first line slide under my skin.

It didn’t describe anything graphic. It didn’t have to. It described the pauses between words. The look that lingers too long. The hand that doesn’t touch but almost does. It described restraint like a promise.

By the third paragraph my throat was dry. By the fifth, I was sitting up in bed, blanket pulled to my waist like it could protect me from wanting.

Then came the twist: “If you’re still reading, you’re already participating.”

The message ended with a choice: reply with one word to continue, or delete it and pretend it never happened.

My thumb hovered. I replied with the word it asked for.

The phone went dark. No response. Only the aftertaste of anticipation and the sudden understanding that the scariest part wasn’t what they wrote. It was what it pulled out of me.`},
      { id: uid(), title: "The Balcony Above the Caldera", votes: 0, createdAt: now(), body:
`The wind off the sea carried salt and distant music from down the hill. On the balcony, the stone was warm from the day and cool at the edges where night claimed it first.

We stood close enough to share heat, not close enough to admit we wanted to. It started with an ordinary sentence about the view. Then a pause that stretched into its own language.

The first touch was an accident. A brush of knuckles. A correction that wasn’t really a correction. When you looked at me, your eyes didn’t ask out loud, but your stillness did. A quiet question. Clear. Respectful. Dangerous.

I nodded without words, and that tiny agreement turned the air electric.

We moved slowly, like we were trying to keep the spell intact. The city below could have been another planet. The only real thing was the way the moment tightened around us, deliberate and intimate, until the rest of the world felt irrelevant.

Later, when we finally pulled apart, we didn’t say “goodnight.” Some nights don’t want to be explained. They want to be remembered.`},
      { id: uid(), title: "A Stranger’s Perfume", votes: 0, createdAt: now(), body:
`It wasn’t the person I noticed first. It was the scent. Something expensive, sharp at the edges, soft at the center. It followed them through the bar like a secret they didn’t mind sharing.

I told myself I was immune. Then they sat two stools away and the bartender asked what I wanted.

“Whatever they’re having,” I said, without looking directly at them. It should have failed. It didn’t.

Conversation started with honesty. The kind that slips out when you’re tired of being polite. We talked about how people pretend not to want things. About how wanting is never really the problem.

At some point, they asked, “Are you always this controlled?”

I wanted to lie. I didn’t. “No.”

Nothing explicit happened in that bar. That wasn’t the point. The point was restraint. The slow burn of knowing that if we stood up together, we’d be choosing a different kind of night.

When I left, the scent clung to my jacket. A souvenir. A promise. A warning.

I wore it home anyway.`},
      { id: uid(), title: "The Note Left Under the Pillow", votes: 0, createdAt: now(), body:
`I didn’t expect anything when I came back. The room looked the same, tidy and indifferent, like it hadn’t witnessed my thoughts all day. I sat on the bed and only then felt the small bump under the pillow.

A folded note. Thick paper. Clean edges.

The handwriting was steady. “I won’t ask you to do anything you don’t want,” it began. “But I will ask you to admit what you do want.”

It described boundaries like they were the hottest thing in the world: the pause, the question, the answer, the way you can feel powerful while giving yourself away.

The last line was sharp: “If you want this, leave the note where I can find it. If you don’t, tear it up and I’ll never try again.”

I didn’t tear it up.

I slid it back under the pillow, exactly where I’d found it, and lay down on top of it like I was keeping a secret against my own skin.`},
      { id: uid(), title: "The Second Glass of Wine", votes: 0, createdAt: now(), body:
`The first glass is always a mask. Small talk. Smiling at the right times. Pretending you don’t notice the way the other person watches your mouth when you speak.

The second glass loosens the invisible rules. It makes you honest in a way that feels like flirting, even if you’re only telling the truth.

We were sitting too close on a couch that was meant for three. You asked, “What do you want?”

Not in a grand life way. In the immediate way.

I looked up and said, “I want to stop pretending.”

The silence after that wasn’t awkward. It was agreement.

We didn’t rush. The slow part was the best part: the careful negotiation of closeness, the testing of trust, the mutual decision to keep going.

Some nights don’t end loudly. They end with a quiet certainty you’ll think about later and smile.`},
      { id: uid(), title: "Silence After Midnight", votes: 0, createdAt: now(), body:
`After midnight, the city changes. It gets quieter, but it doesn’t get innocent. The streetlights soften. Everything feels like a confession waiting to happen.

We walked without a destination, shoulder to shoulder. You stopped in front of a closed storefront, our reflections caught in the glass.

“If I ask, will you answer honestly?” you said.

I didn’t pretend to misunderstand. “About what?”

You turned, eyes direct. “About wanting.”

Wanting isn’t polite. Wanting doesn’t care about timing. Wanting just is.

I answered with a nod. We didn’t do anything explicit on that sidewalk. That wasn’t the point. The point was permission.

When we finally kissed, it was slow. Not desperate. Just certain.

After, we didn’t talk. Silence can be the loudest agreement.`},
      { id: uid(), title: "The Elevator Ride", votes: 0, createdAt: now(), body:
`It was the kind of building where the elevator moves too smoothly, like it’s hiding something. The lobby smelled like polished stone and money. I stepped inside and pressed my floor.

You entered at the last second. The doors closed. The mirror caught both of us, trapped in the same frame.

For a few floors, nothing happened. Then you glanced at the panel and said, “Same floor.”

I didn’t want to sound eager. “Looks like it.”

The ride lasted less than a minute. Thirty seconds to decide what kind of night I wanted. Thirty seconds to feel the heat of attention without any of the usual exits.

When the elevator slowed, you leaned closer, not touching. “If you don’t want this, step out first,” you said.

Consent. Clean. Clear. Hot.

The doors opened. I stepped out second.`},
    ];
    writeStore();
  }

  function showModal(modal){
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function hideModal(modal){
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function wireModalClose(modal){
    modal.addEventListener("click", (e) => {
      const t = e.target;
      if(t && t.dataset && t.dataset.close){
        hideModal(modal);
      }
    });
    document.addEventListener("keydown", (e) => {
      if(e.key === "Escape" && modal.classList.contains("show")){
        hideModal(modal);
      }
    });
  }

  function formatDate(iso){
    try{
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {year:"numeric", month:"short", day:"2-digit"});
    }catch(e){
      return "";
    }
  }

  function filteredSorted(){
    const q = state.q.toLowerCase().trim();
    let items = state.stories.slice();
    if(q){
      items = items.filter(s => (s.title + " " + s.body).toLowerCase().includes(q));
    }
    items.sort((a,b) => (b.votes - a.votes) || (new Date(b.createdAt) - new Date(a.createdAt)));
    return items;
  }

  function paginate(items){
    const total = items.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    state.page = Math.min(state.page, pages);
    state.page = Math.max(state.page, 1);
    const start = (state.page - 1) * PAGE_SIZE;
    return { pageItems: items.slice(start, start + PAGE_SIZE), total, pages };
  }

  function noteHTML(story){
    const snippet = safeText(story.body).slice(0, 140) + (safeText(story.body).length > 140 ? "…" : "");
    return `
      <article class="note" role="button" tabindex="0" data-id="${story.id}">
        <div class="string"></div>
        <div class="pin"></div>
        <div class="note-inner">
          <h4 class="note-title">${escapeHtml(story.title)}</h4>
          <p class="note-snippet">${escapeHtml(snippet)}</p>
        </div>
        <div class="note-foot">
          <div>${escapeHtml(formatDate(story.createdAt))}</div>
          <div>${story.votes} upvotes</div>
        </div>
      </article>
    `;
  }

  function escapeHtml(str){
    return (str || "").replace(/[&<>"']/g, (m) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"
    }[m]));
  }

  function render(){
    const items = filteredSorted();
    const {pageItems, total, pages} = paginate(items);

    els.wall.innerHTML = pageItems.map(noteHTML).join("");
    els.countLabel.textContent = total ? `${total} stories` : "No stories yet";
    els.pageIndicator.textContent = `Page ${state.page} of ${pages}`;

    els.prevPage.disabled = (state.page <= 1);
    els.nextPage.disabled = (state.page >= pages);

    els.wall.querySelectorAll(".note").forEach(note => {
      note.addEventListener("click", () => openStory(note.dataset.id));
      note.addEventListener("keydown", (e) => {
        if(e.key === "Enter" || e.key === " "){
          e.preventDefault();
          openStory(note.dataset.id);
        }
      });
    });
  }

  function isSubscribed(){
    return localStorage.getItem(SUB_KEY) === "1";
  }

  function openStory(id){
    const story = state.stories.find(s => s.id === id);
    if(!story) return;
    state.activeId = id;

    els.storyTitle.textContent = story.title;
    els.storyMeta.textContent = `${story.votes} upvotes • ${formatDate(story.createdAt)}`;

    // UI-only soft gate placeholder: top 3 stories blur ending for non-subscribers
    const ranked = filteredSorted();
    const rankIndex = ranked.findIndex(s => s.id === story.id);
    const gated = (!isSubscribed() && rankIndex > -1 && rankIndex < 3);

    if(gated){
      const full = story.body;
      const cut = Math.floor(full.length * 0.65);
      const head = full.slice(0, cut);
      const tail = full.slice(cut);

      els.storyText.innerHTML = "";
      const a = document.createElement("div");
      a.textContent = head;
      const b = document.createElement("div");
      b.textContent = tail;
      b.style.filter = "blur(6px)";
      b.style.opacity = ".65";
      b.style.userSelect = "none";
      b.style.marginTop = "10px";
      const cta = document.createElement("div");
      cta.className = "pill";
      cta.style.marginTop = "12px";
      cta.textContent = "Unlock the ending (subscription coming next)";
      els.storyText.appendChild(a);
      els.storyText.appendChild(b);
      els.storyText.appendChild(cta);
    }else{
      els.storyText.textContent = story.body;
    }

    els.upvoteBtn.textContent = "Upvote";
    showModal(els.storyModal);

    history.replaceState(null, "", `#story=${encodeURIComponent(id)}`);
  }

  function closeStory(){
    state.activeId = null;
    hideModal(els.storyModal);
    history.replaceState(null, "", location.pathname + location.search);
  }

  function upvoteActive(){
    const id = state.activeId;
    if(!id) return;
    const story = state.stories.find(s => s.id === id);
    if(!story) return;

    const votedKey = "cumtales:voted:" + id;
    if(localStorage.getItem(votedKey)) return;

    story.votes += 1;
    localStorage.setItem(votedKey, "1");
    writeStore();

    els.storyMeta.textContent = `${story.votes} upvotes • ${formatDate(story.createdAt)}`;
    els.upvoteBtn.textContent = "Upvoted";
    render();
  }

  async function copyLink(){
    const id = state.activeId;
    if(!id) return;
    const url = location.origin + location.pathname + "#story=" + encodeURIComponent(id);
    try{
      await navigator.clipboard.writeText(url);
      els.shareBtn.textContent = "Copied";
      setTimeout(() => (els.shareBtn.textContent = "Copy link"), 900);
    }catch(e){
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      els.shareBtn.textContent = "Copied";
      setTimeout(() => (els.shareBtn.textContent = "Copy link"), 900);
    }
  }

  function openCreate(){
    els.createForm.reset();
    showModal(els.createModal);
    setTimeout(() => els.titleInput.focus(), 50);
  }

  function submitCreate(e){
    e.preventDefault();
    const title = safeText(els.titleInput.value);
    const body = (els.bodyInput.value || "").trim();

    if(!title || !body) return;
    if(!els.consentCheck.checked) return;

    const story = {
      id: uid(),
      title: title.slice(0, 120),
      body: body.slice(0, 20000),
      votes: 0,
      createdAt: now(),
    };
    state.stories.unshift(story);
    writeStore();
    hideModal(els.createModal);

    state.page = 1;
    state.q = "";
    els.searchInput.value = "";
    render();
    openStory(story.id);
  }

  function showRules(){ showModal(els.rulesModal); }
  function showPrivacy(){ showModal(els.privacyModal); }
  function showTerms(){ showModal(els.termsModal); }

  function ageGateInit(){
    const ok = localStorage.getItem(AGE_KEY) === "1";
    if(ok) return;
    els.ageWall.classList.add("show");

    els.enterBtn.addEventListener("click", () => {
      localStorage.setItem(AGE_KEY, "1");
      els.ageWall.classList.remove("show");
      startOnboarding();
    });

    els.leaveBtn.addEventListener("click", () => {
      window.location.href = "https://www.google.com";
    });
  }

  function startOnboarding(){
    if(!els.onboardModal) return;
    if(localStorage.getItem(ONBOARD_KEY) === "1") return;

    let idx = 0;
    let inQuestions = false;
    const prefs = {intent:null, vibe:null, feel:null};

    function paintDots(active, total){
      els.onboardDots.innerHTML = "";
      for(let i=0;i<total;i++){
        const d = document.createElement("div");
        d.className = "dotx" + (i===active ? " on" : "");
        els.onboardDots.appendChild(d);
      }
    }

    function setImage(i){
      const presets = [
        "radial-gradient(900px 420px at 25% 20%, rgba(255,255,255,.12), transparent 60%), linear-gradient(180deg, rgba(255,255,255,.05), rgba(0,0,0,.20))",
        "radial-gradient(760px 380px at 70% 25%, rgba(255,255,255,.10), transparent 58%), linear-gradient(180deg, rgba(255,255,255,.04), rgba(0,0,0,.24))",
        "radial-gradient(850px 420px at 40% 15%, rgba(255,255,255,.11), transparent 62%), linear-gradient(180deg, rgba(255,255,255,.05), rgba(0,0,0,.18))",
        "radial-gradient(740px 380px at 20% 65%, rgba(255,255,255,.10), transparent 60%), linear-gradient(180deg, rgba(255,255,255,.04), rgba(0,0,0,.22))",
        "radial-gradient(820px 410px at 75% 45%, rgba(255,255,255,.10), transparent 60%), linear-gradient(180deg, rgba(255,255,255,.04), rgba(0,0,0,.24))"
      ];
      els.onboardImage.style.background = presets[i % presets.length];
    }

    function bindQuestions(){
      els.onboardQuestions.querySelectorAll(".qchoices").forEach(group => {
        group.querySelectorAll(".qbtn").forEach(btn => {
          btn.addEventListener("click", () => {
            group.querySelectorAll(".qbtn").forEach(b => b.classList.remove("on"));
            btn.classList.add("on");
            prefs[group.dataset.q] = btn.dataset.v;
          });
        });
      });
    }

    function renderSlide(){
      const s = ONBOARD_SLIDES[idx];
      els.onboardKicker.textContent = s.k;
      els.onboardTitleText.textContent = s.t;
      els.onboardBody.textContent = s.b;
      els.onboardQuestions.style.display = "none";
      inQuestions = false;
      setImage(idx);
      paintDots(idx, ONBOARD_SLIDES.length + 1);
      els.backOnboard.disabled = (idx === 0);
      els.nextOnboard.textContent = "Next";
    }

    function renderQuestions(){
      els.onboardKicker.textContent = "Personalize";
      els.onboardTitleText.textContent = "Make it yours";
      els.onboardBody.textContent = "Answer 3 quick questions. You stay anonymous.";
      els.onboardQuestions.style.display = "";
      inQuestions = true;
      setImage(0);
      paintDots(ONBOARD_SLIDES.length, ONBOARD_SLIDES.length + 1);
      els.backOnboard.disabled = false;
      els.nextOnboard.textContent = "Enter";
    }

    function done(){
      localStorage.setItem(ONBOARD_KEY, "1");
      localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
      hideModal(els.onboardModal);

      try{
        const hero = document.querySelector(".hero p");
        if(hero && prefs.vibe){
          const map = {
            slow: "Slow burn. Sharp tension. Click a note to read.",
            bold: "Bold voices. Confident heat. Click a note to read.",
            dark: "Dark moods. Dangerous edges. Click a note to read."
          };
          hero.textContent = map[prefs.vibe] || hero.textContent;
        }
      }catch(e){}
    }

    bindQuestions();
    showModal(els.onboardModal);
    renderSlide();

    els.skipOnboard.onclick = () => done();
    els.backOnboard.onclick = () => {
      if(inQuestions){ idx = ONBOARD_SLIDES.length - 1; renderSlide(); return; }
      idx = Math.max(0, idx - 1);
      renderSlide();
    };
    els.nextOnboard.onclick = () => {
      if(!inQuestions){
        if(idx < ONBOARD_SLIDES.length - 1){ idx += 1; renderSlide(); return; }
        renderQuestions(); return;
      }
      if(!prefs.intent || !prefs.vibe || !prefs.feel) return;
      done();
    };
  }

  function parseHashOpen(){
    const m = location.hash.match(/story=([^&]+)/);
    if(!m) return;
    const id = decodeURIComponent(m[1]);
    const exists = state.stories.some(s => s.id === id);
    if(exists) openStory(id);
  }

  function init(){
    els.year.textContent = String(new Date().getFullYear());
    if(els.termsDate) els.termsDate.textContent = new Date().toLocaleDateString();

    seedIfEmpty();

    const stored = readStore();
    if(stored && Array.isArray(stored.stories)) state.stories = stored.stories;

    ageGateInit();
    try{ if(localStorage.getItem(AGE_KEY)==="1") startOnboarding(); }catch(e){}

    wireModalClose(els.storyModal);
    wireModalClose(els.createModal);
    wireModalClose(els.rulesModal);
    wireModalClose(els.privacyModal);
    wireModalClose(els.termsModal);

    els.storyModal.addEventListener("click", (e) => {
      const t = e.target;
      if(t && t.dataset && t.dataset.close){
        closeStory();
      }
    });
    document.addEventListener("keydown", (e) => {
      if(e.key === "Escape" && els.storyModal.classList.contains("show")){
        closeStory();
      }
    });

    els.upvoteBtn.addEventListener("click", upvoteActive);
    els.shareBtn.addEventListener("click", copyLink);

    els.newStoryBtn.addEventListener("click", openCreate);
    els.createForm.addEventListener("submit", submitCreate);

    els.prevPage.addEventListener("click", () => { state.page -= 1; render(); window.scrollTo({top:0, behavior:"smooth"}); });
    els.nextPage.addEventListener("click", () => { state.page += 1; render(); window.scrollTo({top:0, behavior:"smooth"}); });

    els.searchInput.addEventListener("input", (e) => {
      state.q = e.target.value || "";
      state.page = 1;
      render();
    });

    [els.openRules, els.openRules2].forEach(a => a.addEventListener("click", (e) => { e.preventDefault(); showRules(); }));
    [els.openPrivacy, els.openPrivacy2].forEach(a => a.addEventListener("click", (e) => { e.preventDefault(); showPrivacy(); }));
    [els.openTerms, els.openTerms2].forEach(a => a && a.addEventListener("click", (e) => { e.preventDefault(); showTerms(); }));

    if(els.homeLogo) els.homeLogo.addEventListener("click", (e) => { e.preventDefault(); window.scrollTo({top:0, behavior:"smooth"}); });

    render();
    parseHashOpen();
  }

  init();
})(); 
