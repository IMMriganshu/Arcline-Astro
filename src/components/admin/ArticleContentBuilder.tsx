import React, { useState, useRef, useEffect } from 'react';
import { compressImageFile } from '../../lib/imageCompression';

interface ArticleContentBuilderProps {
  value: string;
  onChange: (val: string) => void;
}

export const ArticleContentBuilder: React.FC<ArticleContentBuilderProps> = ({ value, onChange }) => {
  // Modes: 'visual' (WYSIWYG visual editor), 'code' (HTML code editor), 'split' (Visual + Preview), 'preview' (Full live preview)
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'split' | 'preview'>('visual');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  // Image modal state
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [isCompressingImage, setIsCompressingImage] = useState(false);

  // Link modal state
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const visualEditorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keep visual editor content in sync when value changes externally or when switching tabs
  useEffect(() => {
    if (visualEditorRef.current && visualEditorRef.current.innerHTML !== value) {
      visualEditorRef.current.innerHTML = value || '<p><br></p>';
    }
  }, [value, activeTab]);

  /**
   * Helper to format content in Visual WYSIWYG mode using document.execCommand
   */
  const formatVisual = (command: string, value: string | undefined = undefined) => {
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
      document.execCommand(command, false, value);
      onChange(visualEditorRef.current.innerHTML);
    }
  };

  /**
   * Insert custom HTML snippet into visual editor at current cursor or append
   */
  const insertHtmlVisual = (htmlSnippet: string) => {
    if (activeTab === 'code') {
      insertSnippetCode(htmlSnippet);
      return;
    }
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const div = document.createElement('div');
        div.innerHTML = htmlSnippet;
        const frag = document.createDocumentFragment();
        let node;
        let lastNode;
        while ((node = div.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        if (lastNode) {
          range.setStartAfter(lastNode);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else {
        visualEditorRef.current.innerHTML += htmlSnippet;
      }
      onChange(visualEditorRef.current.innerHTML);
    }
  };

  /**
   * Helper to insert snippet in HTML Code mode textarea
   */
  const insertSnippetCode = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + prefix + defaultText + suffix);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;
    const selected = currentVal.substring(start, end);
    const textToWrap = selected || defaultText;

    const newText = currentVal.substring(0, start) + prefix + textToWrap + suffix + currentVal.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + textToWrap.length + suffix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Handlers for formatting actions
  const handleInsertHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (activeTab === 'code') {
      insertSnippetCode(`<h${level}>`, `</h${level}>\n`, `Heading Level ${level}`);
    } else {
      formatVisual('formatBlock', `H${level}`);
    }
  };

  const handleInsertParagraph = () => {
    if (activeTab === 'code') {
      insertSnippetCode('<p>', '</p>\n\n', 'Enter paragraph text here...');
    } else {
      formatVisual('formatBlock', 'P');
    }
  };

  const handleInsertBold = () => {
    if (activeTab === 'code') {
      insertSnippetCode('<strong>', '</strong>', 'bold text');
    } else {
      formatVisual('bold');
    }
  };

  const handleInsertItalic = () => {
    if (activeTab === 'code') {
      insertSnippetCode('<em>', '</em>', 'italic text');
    } else {
      formatVisual('italic');
    }
  };

  const handleInsertUnderline = () => {
    if (activeTab === 'code') {
      insertSnippetCode('<u>', '</u>', 'underlined text');
    } else {
      formatVisual('underline');
    }
  };

  const handleInsertQuote = () => {
    if (activeTab === 'code') {
      insertSnippetCode('<blockquote>\n  <p>', '</p>\n  <cite>— Author / Attribution</cite>\n</blockquote>\n\n', 'Insightful surgical quotation goes here...');
    } else {
      formatVisual('formatBlock', 'BLOCKQUOTE');
    }
  };

  const handleInsertBulletList = () => {
    if (activeTab === 'code') {
      insertSnippetCode('<ul>\n  <li>', '</li>\n  <li>Second key point</li>\n  <li>Third key point</li>\n</ul>\n\n', 'First key point');
    } else {
      formatVisual('insertUnorderedList');
    }
  };

  const handleInsertNumberList = () => {
    if (activeTab === 'code') {
      insertSnippetCode('<ol>\n  <li>', '</li>\n  <li>Step two of the process</li>\n  <li>Step three of the process</li>\n</ol>\n\n', 'Step one of the process');
    } else {
      formatVisual('insertOrderedList');
    }
  };

  const handleInsertCallout = () => {
    const calloutHtml = `<div class="p-4 sm:p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 my-6 backdrop-blur-md">\n  <strong class="text-white block mb-1">💡 Key Takeaway:</strong>\n  <p class="text-sm text-cyan-100/90 leading-relaxed m-0">Important medical search intelligence insight.</p>\n</div>\n<p></p>`;
    if (activeTab === 'code') {
      insertSnippetCode(calloutHtml);
    } else {
      insertHtmlVisual(calloutHtml);
    }
  };

  const handleInsertDivider = () => {
    if (activeTab === 'code') {
      insertSnippetCode('\n<hr />\n\n');
    } else {
      insertHtmlVisual('<hr class="my-8 border-white/10" /><p></p>');
    }
  };

  const handleConfirmImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    let snippet = `<figure class="my-8">\n  <img src="${imageUrl.trim()}" alt="${(imageAlt || 'Article illustration').trim()}" class="w-full rounded-2xl shadow-xl" />\n`;
    if (imageCaption.trim()) {
      snippet += `  <figcaption class="text-center text-xs text-neutral-400 mt-2.5 italic">${imageCaption.trim()}</figcaption>\n`;
    }
    snippet += `</figure>\n<p></p>`;

    if (activeTab === 'code') {
      insertSnippetCode(snippet);
    } else {
      insertHtmlVisual(snippet);
    }

    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
    setShowImageModal(false);
  };

  const handleLocalImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsCompressingImage(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 1200, 0.8);
      setImageUrl(compressedDataUrl);
      if (!imageAlt) {
        setImageAlt(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    } catch (err) {
      console.error('Image compression error:', err);
    } finally {
      setIsCompressingImage(false);
      e.target.value = '';
    }
  };

  const handleConfirmLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    const display = linkText.trim() || linkUrl.trim();
    const linkHtml = `<a href="${linkUrl.trim()}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline hover:text-cyan-300 font-medium">${display}</a>`;
    if (activeTab === 'code') {
      insertSnippetCode(linkHtml);
    } else {
      insertHtmlVisual(linkHtml);
    }
    setLinkUrl('');
    setLinkText('');
    setShowLinkModal(false);
  };

  /**
   * Clean pasted rich text from Google Docs, Word, ChatGPT
   */
  const handlePasteVisual = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');

    if (html) {
      // Clean HTML tags and remove style/class attributes that mess up dark theme
      const cleanHtml = html
        .replace(/style="[^"]*"/gi, '')
        .replace(/class="[^"]*"/gi, '')
        .replace(/<font[^>]*>/gi, '')
        .replace(/<\/font>/gi, '')
        .replace(/<span[^>]*>/gi, '')
        .replace(/<\/span>/gi, '');
      insertHtmlVisual(cleanHtml);
    } else if (text) {
      // Split plain text into paragraphs
      const paragraphs = text
        .split(/\n\n+/)
        .map((p) => `<p>${p.trim().replace(/\n/g, '<br />')}</p>`)
        .join('');
      insertHtmlVisual(paragraphs);
    }
  };

  return (
    <div className="border border-white/15 rounded-2xl bg-[#090d16] overflow-hidden flex flex-col shadow-2xl">
      {/* Top Bar with Mode Toggles */}
      <div className="bg-[#050b1a] border-b border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Article Editor
          </span>
          <span className="text-[11px] text-neutral-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full text-cyan-300">
            {activeTab === 'visual' ? '✍️ Visual Text Editor (User Friendly)' : activeTab === 'code' ? '</> HTML Source Code' : activeTab === 'split' ? '↔️ Split View' : '👁️ Live Preview'}
          </span>
        </div>

        {/* View Mode Switcher Buttons */}
        <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'visual' ? 'bg-cyan-500 text-black shadow-md' : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>✍️ Visual Text Editor</span>
            <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-black/20 font-extrabold">Easy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'code' ? 'bg-cyan-500 text-black shadow-md' : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>&lt;/&gt; HTML Code</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer hidden md:flex items-center gap-1.5 ${
              activeTab === 'split' ? 'bg-cyan-500 text-black shadow-md' : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>↔️ Split View</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-cyan-500 text-black shadow-md' : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>👁️ Live Preview</span>
          </button>
        </div>
      </div>

      {/* Formatting Action Toolbar */}
      {activeTab !== 'preview' && (
        <div className="bg-[#050b1a]/90 border-b border-white/10 p-2.5 flex flex-wrap items-center gap-2 text-xs text-neutral-200">
          {/* Headings Group */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-neutral-400 px-1 uppercase select-none">Headings</span>
            <button
              type="button"
              onClick={() => handleInsertHeading(1)}
              title="Heading 1"
              className="px-2 py-1 rounded-lg hover:bg-white/15 font-extrabold text-white text-xs cursor-pointer"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => handleInsertHeading(2)}
              title="Heading 2"
              className="px-2 py-1 rounded-lg hover:bg-white/15 font-bold text-cyan-300 text-xs cursor-pointer"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => handleInsertHeading(3)}
              title="Heading 3"
              className="px-2 py-1 rounded-lg hover:bg-white/15 font-bold text-cyan-400 text-xs cursor-pointer"
            >
              H3
            </button>
            <button
              type="button"
              onClick={handleInsertParagraph}
              title="Normal Paragraph"
              className="px-2.5 py-1 rounded-lg hover:bg-white/15 font-serif text-neutral-300 text-xs cursor-pointer"
            >
              Paragraph
            </button>
          </div>

          {/* Inline Text Styles */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={handleInsertBold}
              title="Bold Text"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/15 font-extrabold text-white cursor-pointer"
            >
              B
            </button>
            <button
              type="button"
              onClick={handleInsertItalic}
              title="Italic Text"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/15 italic text-white cursor-pointer font-serif"
            >
              I
            </button>
            <button
              type="button"
              onClick={handleInsertUnderline}
              title="Underline Text"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/15 underline text-white cursor-pointer"
            >
              U
            </button>
          </div>

          {/* Lists & Quotes */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={handleInsertBulletList}
              title="Bullet List"
              className="px-2.5 py-1 rounded-lg hover:bg-white/15 flex items-center gap-1 text-neutral-200 cursor-pointer"
            >
              <span className="font-bold">•</span>
              <span className="text-[11px]">Bullet List</span>
            </button>
            <button
              type="button"
              onClick={handleInsertNumberList}
              title="Numbered List"
              className="px-2.5 py-1 rounded-lg hover:bg-white/15 flex items-center gap-1 text-neutral-200 cursor-pointer"
            >
              <span className="text-[11px] font-mono font-bold">1.</span>
              <span className="text-[11px]">Numbered</span>
            </button>
            <button
              type="button"
              onClick={handleInsertQuote}
              title="Blockquote"
              className="px-2.5 py-1 rounded-lg hover:bg-white/15 flex items-center gap-1 text-cyan-300 cursor-pointer"
            >
              <span className="text-sm font-serif font-bold">“</span>
              <span className="text-[11px]">Quote</span>
            </button>
          </div>

          {/* Media, Links & Callouts */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              title="Insert Compressed Image with Caption"
              className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1.5 cursor-pointer border border-cyan-500/30"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[11px]">+ Insert Image</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLinkModal(true)}
              title="Insert Link"
              className="px-2.5 py-1 rounded-lg hover:bg-white/15 flex items-center gap-1 text-neutral-200 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-[11px]">Link</span>
            </button>

            <button
              type="button"
              onClick={handleInsertCallout}
              title="Callout Highlight Box"
              className="px-2.5 py-1 rounded-lg hover:bg-white/15 text-emerald-400 text-[11px] font-semibold cursor-pointer"
            >
              💡 Callout Box
            </button>

            <button
              type="button"
              onClick={handleInsertDivider}
              title="Horizontal Divider Line"
              className="px-2 py-1 rounded-lg hover:bg-white/15 text-[11px] text-neutral-400 cursor-pointer"
            >
              Divider (HR)
            </button>
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 min-h-[440px]">
        {/* Visual WYSIWYG Editor Mode or Split View */}
        {(activeTab === 'visual' || activeTab === 'split') && (
          <div className={`p-4 flex flex-col bg-[#030712] ${activeTab === 'visual' ? 'col-span-full' : ''}`}>
            <div className="flex items-center justify-between mb-2 text-xs text-neutral-400">
              <span className="font-bold text-cyan-300 flex items-center gap-1">
                <span>✍️ Visual Text Surface</span>
                <span className="text-[10px] font-normal text-neutral-500">(Type or paste text directly from Word, ChatGPT, or Docs)</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">{value.length} characters</span>
            </div>

            <div
              ref={visualEditorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={() => {
                if (visualEditorRef.current) {
                  onChange(visualEditorRef.current.innerHTML);
                }
              }}
              onBlur={() => {
                if (visualEditorRef.current) {
                  onChange(visualEditorRef.current.innerHTML);
                }
              }}
              onPaste={handlePasteVisual}
              className="article-prose flex-1 min-h-[380px] p-5 bg-black/60 border border-white/15 rounded-xl text-neutral-100 focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/50 overflow-y-auto selection:bg-cyan-500 selection:text-black cursor-text"
            />
          </div>
        )}

        {/* HTML Source Code Mode */}
        {activeTab === 'code' && (
          <div className="col-span-full p-4 flex flex-col bg-black/80">
            <div className="flex items-center justify-between mb-2 text-xs text-neutral-400">
              <span className="font-mono text-cyan-400 font-bold">&lt;/&gt; Raw HTML Source Editor</span>
              <span className="text-[10px] text-neutral-500 font-mono">{value.length} characters</span>
            </div>

            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Edit raw HTML markup directly..."
              rows={18}
              className="w-full flex-1 min-h-[380px] p-4 bg-black/80 border border-white/15 rounded-xl text-neutral-200 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-cyan-500/80 resize-y selection:bg-cyan-500 selection:text-black"
            />
          </div>
        )}

        {/* Live Visual Preview Area */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div className={`p-5 md:p-6 overflow-y-auto bg-black/40 ${activeTab === 'preview' ? 'col-span-full' : ''}`}>
            <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 mb-4 pb-2 border-b border-white/10 flex items-center justify-between">
              <span>Live Website Preview</span>
              <span className="text-neutral-500 lowercase">article-prose container</span>
            </div>
            {value && value.replace(/<[^>]*>/g, '').trim().length > 0 ? (
              <div
                className="article-prose"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-neutral-500">
                <svg className="w-8 h-8 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-xs">No article content yet. Type or paste text in the Visual Text Editor on the left.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Insert Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleConfirmImage} className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white font-urbanist flex items-center gap-2">
                <span>Insert Article Image</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Upload File Direct Picker */}
            <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-cyan-300">
                Option A: Choose Local Image File (Auto-Compressed WebP)
              </label>
              <label className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 rounded-lg text-xs font-semibold text-cyan-200 cursor-pointer transition-colors">
                <svg className="w-4 h-4 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>{isCompressingImage ? 'Compressing Image...' : 'Select Local Image File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLocalImageSelect}
                  className="hidden"
                  disabled={isCompressingImage}
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Option B: Or Enter Image Source URL / Path <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="https://images.unsplash.com/... or /images/... or data:image/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs font-mono focus:border-cyan-500 truncate"
              />
              {imageUrl && imageUrl.startsWith('data:image') && (
                <span className="text-[10px] text-emerald-400 mt-1 block">
                  ✓ Compressed Image Loaded ({Math.round(imageUrl.length / 1024)} KB)
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Alt Text (SEO & Accessibility) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Diepenbrock examining 3D facial imaging model"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Image Caption (Visible below image)
              </label>
              <input
                type="text"
                placeholder="e.g. Figure 1: 3D volumetric analysis of facial soft-tissue architecture."
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:border-cyan-500"
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCompressingImage || !imageUrl.trim()}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold text-xs cursor-pointer"
              >
                Insert Figure
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Insert Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleConfirmLink} className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white font-urbanist">Insert Hyperlink</h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Destination URL <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="https://... or /services/local-seo or /#contact"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs font-mono focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Link Display Text
              </label>
              <input
                type="text"
                placeholder="Text to display for link"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:border-cyan-500"
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer"
              >
                Insert Link
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
