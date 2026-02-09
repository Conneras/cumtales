/* Cumtales wall — localStorage demo (no backend) */
(function(){
  const STORAGE_KEY = "cumtales:v1";
  const AGE_KEY = "cumtales:age_ok";
  const PAGE_SIZE = 12;

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

    ageWall: document.getElementById("ageWall"),
    enterBtn: document.getElementById("enterBtn"),
    leaveBtn: document.getElementById("leaveBtn"),

    openRules: document.getElementById("openRules"),
    openPrivacy: document.getElementById("openPrivacy"),
    openRules2: document.getElementById("openRules2"),
    openPrivacy2: document.getElementById("openPrivacy2"),
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
{ id: uid(), title: "The Balcony Above the Caldera", body: "The night air was warm and still. Below us, the lights of the island flickered like secrets. We never said what would happen. We just let it happen, slowly, until the sun threatened to rise.", votes: 20, createdAt: now() },
{ id: uid(), title: "The Note Left Under the Pillow", body: "I woke up alone, but there was a folded note waiting. Three sentences. Honest. Dangerous. I read it twice and smiled the whole day.", votes: 18, createdAt: now() },
{ id: uid(), title: "After the Party", body: "Everyone left. Music off. Glasses half full. We stayed. Not because we planned it, but because leaving felt wrong.", votes: 16, createdAt: now() },
{ id: uid(), title: "A Message Sent Too Late", body: "I typed it, deleted it, then sent it anyway. The reply came minutes later. That night changed direction quietly.", votes: 14, createdAt: now() },
{ id: uid(), title: "The Hotel With No Names", body: "No real names. No questions. Just a room key and a shared understanding that some things don’t need context.", votes: 12, createdAt: now() },
{ id: uid(), title: "The Elevator Ride", body: "It was only thirty seconds. Long enough for eye contact. Long enough to know.", votes: 10, createdAt: now() },
{ id: uid(), title: "Under Borrowed Sheets", body: "Nothing there belonged to us. Not the bed. Not the room. Only the moment did.", votes: 8, createdAt: now() },
{ id: uid(), title: "The Second Glass of Wine", body: "The first was polite. The second was honest. After that, the story wrote itself.", votes: 6, createdAt: now() },
{ id: uid(), title: "Silence After Midnight", body: "No words. Just breathing and the sound of the city far away. Silence said more than talking ever could.", votes: 4, createdAt: now() },
{ id: uid(), title: "The Morning After That Wasn’t Awkward", body: "We laughed. That’s how I knew it mattered.", votes: 2, createdAt: now() }
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

    // click + keyboard open
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

  function openStory(id){
    const story = state.stories.find(s => s.id === id);
    if(!story) return;
    state.activeId = id;

    els.storyTitle.textContent = story.title;
    els.storyMeta.textContent = `${story.votes} upvotes • ${formatDate(story.createdAt)}`;
    els.storyText.textContent = story.body;

    els.upvoteBtn.textContent = "Upvote";
    showModal(els.storyModal);

    // update URL hash for sharing
    history.replaceState(null, "", `#story=${encodeURIComponent(id)}`);
  }

  function closeStory(){
    state.activeId = null;
    hideModal(els.storyModal);
    // clean hash
    history.replaceState(null, "", location.pathname + location.search);
  }

  function upvoteActive(){
    const id = state.activeId;
    if(!id) return;
    const story = state.stories.find(s => s.id === id);
    if(!story) return;

    // simple per-story vote lock
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
      // fallback
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
      title: title.slice(0, 80),
      body: body.slice(0, 6000),
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

  function ageGateInit(){
    const ok = localStorage.getItem(AGE_KEY) === "1";
    if(ok) return;
    els.ageWall.classList.add("show");

    els.enterBtn.addEventListener("click", () => {
      localStorage.setItem(AGE_KEY, "1");
      els.ageWall.classList.remove("show");
    });

    els.leaveBtn.addEventListener("click", () => {
      // blank page fallback
      window.location.href = "https://www.google.com";
    });
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

    seedIfEmpty();
    const stored = readStore();
    if(stored && Array.isArray(stored.stories)) state.stories = stored.stories;

    ageGateInit();

    wireModalClose(els.storyModal);
    wireModalClose(els.createModal);
    wireModalClose(els.rulesModal);
    wireModalClose(els.privacyModal);

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

    render();
    parseHashOpen();
  }

  init();
})();