/* path: project/script.js */
/* Minimal JS: language switch, mailto, tilt effect, share fallback */
(() => {
  const i18n = {
    ar: {
      title: "مرحباً بكم في المستقبل",
      name: "محمد محمود",
      bio: "مساعد اداري - مصمم جرافيك - محاضر مايكروسوفت",
      ln_twitter: "Twitter",
      ln_linkedin: "LinkedIn",
      ln_github: "GitHub",
      ln_insta: "Instagram",
      foot: "شكراً لزيارتك",
      contact_label: "تواصل",
      share_label: "مشاركة"
    },
    en: {
      title: "Welcme To The Future",
      name: "Mohamed Mahmoud",
      bio: "Admin Assist - Graphic Designer - Icdl Trainer",
      ln_twitter: "Twitter",
      ln_linkedin: "LinkedIn",
      ln_github: "GitHub",
      ln_insta: "Instagram",
      foot: "Thanks for visiting",
      contact_label: "Contact",
      share_label: "Share"
    }
  };

  // Elements
  const langBtns = document.querySelectorAll('.lang-btn');
  const rootHtml = document.documentElement;
  const transElems = document.querySelectorAll('[data-i18n]');
  const contactBtn = document.getElementById('contactBtn');
  const shareBtn = document.getElementById('shareBtn');

  // Default language
  let lang = 'ar';

  function applyLang(toLang){
    lang = toLang;
    const dict = i18n[lang] || i18n.en;
    document.title = dict.title;
    rootHtml.lang = (lang === 'ar') ? 'ar' : 'en';
    rootHtml.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    transElems.forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // update buttons text/labels
    contactBtn.textContent = dict.contact_label;
    shareBtn.textContent = dict.share_label;

    // disable current language button
    langBtns.forEach(b => b.disabled = b.dataset.lang === lang);
  }

  // Initialize
  langBtns.forEach(b => {
    b.addEventListener('click', () => applyLang(b.dataset.lang));
  });
  applyLang(lang);

  // Contact: open Gmail compose (mailto to Gmail address).
  // NOTE: replace 'yourname@gmail.com' with your Gmail.
  const gmail = 'yourname@gmail.com';
  function openGmailCompose(){
    const subject = encodeURIComponent(lang === 'ar' ? 'رسالة من صفحتي' : 'Message from my page');
    const body = encodeURIComponent(lang === 'ar' ? 'مرحباً، أريد التواصل معك...' : 'Hi, I would like to contact you...');
    // mailto link targets Gmail address — mail clients decide, but the address is Gmail.
    const mailto = `mailto:${gmail}?subject=${subject}&body=${body}`;
    // open in new tab/window; browsers will open mail client
    window.location.href = mailto;
  }
  contactBtn.addEventListener('click', (e) => { e.preventDefault(); openGmailCompose(); });

  // Share: Web Share API fallback (copies URL)
  shareBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const shareData = {
      title: document.title,
      text: lang === 'ar' ? 'تفقد صفحتي' : 'Check my links',
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(lang === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard');
      }
    } catch (err) {
      console.debug('Share failed', err);
      alert(lang === 'ar' ? 'تعذر المشاركة' : 'Share failed');
    }
  });

  // 3D tilt interaction for profile card
  const card = document.getElementById('profileCard');
  const rect = () => card.getBoundingClientRect();
  const maxRot = 12; // degrees
  function handleMove(e){
    const r = rect();
    const x = (e.clientX ?? (e.touches && e.touches[0].clientX)) - r.left;
    const y = (e.clientY ?? (e.touches && e.touches[0].clientY)) - r.top;
    const px = (x / r.width - 0.5) * 2; // -1 .. 1
    const py = (y / r.height - 0.5) * 2;
    const rx = -py * maxRot;
    const ry = px * maxRot;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
  }
  function resetCard(){ card.style.transform = ''; }

  card.addEventListener('mousemove', handleMove);
  card.addEventListener('mouseleave', resetCard);
  card.addEventListener('touchmove', (ev) => { handleMove(ev.touches[0]); }, {passive:true});
  card.addEventListener('touchend', resetCard);

  // Accessibility: enable keyboard "Enter" on buttons
  [contactBtn, shareBtn].forEach(btn => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });

  // NOTE: Replace placeholders:
  // - Set your Gmail in `gmail` variable above.
  // - Replace avatar svg with <img src="path/to/photo.jpg" alt="..."> if you have a photo.
})();
