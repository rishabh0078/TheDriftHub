'use client';

import { useEffect } from 'react';

interface Props {
  postTitle: string;
  postUrl: string;
}

export default function ArticleClientInteractivity({ postTitle, postUrl }: Props) {
  useEffect(() => {
    // Reading progress indicator
    const handleScroll = () => {
      const progressBar = document.getElementById('progress-bar');
      if (progressBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        progressBar.style.width = scrolled + '%';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Copy link button
    const copyBtn = document.getElementById('copy-link-btn');
    const copySuccess = document.getElementById('copy-success');

    const handleCopy = () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        if (copySuccess) {
          copySuccess.classList.remove('hidden');
          setTimeout(() => {
            copySuccess.classList.add('hidden');
          }, 2000);
        }
      });
    };

    copyBtn?.addEventListener('click', handleCopy);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      copyBtn?.removeEventListener('click', handleCopy);
    };
  }, []);

  return (
    <div id="progress-bar" className="fixed top-0 left-0 h-[3px] bg-primary w-0 z-[60] transition-none" />
  );
}
