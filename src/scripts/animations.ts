import Lenis from 'lenis';

export function initAnimations() {
  if (typeof window === 'undefined') return;

  // 1. Initialize Lenis Smooth Scrolling across the entire page
  let lenis: Lenis | null = null;
  try {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  } catch (err) {
    console.warn('Lenis initialization skipped:', err);
  }

  // 2. Hero Letter Entrance Sequence
  const heroBlock = document.querySelector('.home-hero__title-block');
  const heroLetters = document.querySelectorAll<HTMLElement>('[data-hero-letter]');
  const heroAnimates = document.querySelectorAll<HTMLElement>('[data-hero-animate]');

  if (heroLetters.length > 0) {
    // Trigger hero letters entry
    setTimeout(() => {
      heroLetters.forEach((letter) => {
        letter.classList.add('is-visible');
      });
    }, 150);
  }

  if (heroAnimates.length > 0) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            heroObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    heroAnimates.forEach((el) => heroObserver.observe(el));
  }

  // 3. Global On-Scroll Ease Animation for All Content Blocks, Headlines, and Cards
  const animateElements = document.querySelectorAll<HTMLElement>('[data-animate]');
  if (animateElements.length > 0) {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    animateElements.forEach((el) => {
      scrollObserver.observe(el);
    });
  }

  // 4. Subtle Parallax Ease on Architectural Imagery
  const heroBannerImg = document.getElementById('hero-banner-img');
  if (heroBannerImg && lenis) {
    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      if (scroll < 1000) {
        const yOffset = scroll * 0.08;
        heroBannerImg.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      }
    });
  }
}
