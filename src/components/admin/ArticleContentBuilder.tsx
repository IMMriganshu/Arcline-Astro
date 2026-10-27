import React, { useState, useRef } from 'react';
import { compressImageFile } from '../../lib/imageCompression';

interface ArticleContentBuilderProps {
  value: string;
  onChange: (val: string) => void;
}

export const ArticleContentBuilder: React.FC<ArticleContentBuilderProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'split'>('split');
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Helper to wrap currently selected text or insert snippet at cursor
   */
  const insertSnippet = (prefix: string, suffix: string = '', defaultText: string = '') => {
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

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + textToWrap.length + suffix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleInsertHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    insertSnippet(`<h${level}>`, `</h${level}>\n`, `Heading Level ${level}`);
  };

  const handleInsertParagraph = () => {
    insertSnippet('<p>', '</p>\n\n', 'Enter paragraph text here...');
  };

  const handleInsertBold = () => {
    insertSnippet('<strong>', '</strong>', 'bold text');
  };

  const handleInsertItalic = () => {
    insertSnippet('<em>', '</em>', 'italic text');
  };

  const handleInsertUnderline = () => {
    insertSnippet('<u>', '</u>', 'underlined text');
  };

  const handleInsertQuote = () => {
    insertSnippet('<blockquote>\n  <p>', '</p>\n  <cite>— Author / Attribution</cite>\n</blockquote>\n\n', 'Insightful surgical quotation goes here...');
  };

  const handleInsertBulletList = () => {
    insertSnippet('<ul>\n  <li>', '</li>\n  <li>Second key point</li>\n  <li>Third key point</li>\n</ul>\n\n', 'First key point');
  };

  const handleInsertNumberList = () => {
    insertSnippet('<ol>\n  <li>', '</li>\n  <li>Step two of the process</li>\n  <li>Step three of the process</li>\n</ol>\n\n', 'Step one of the process');
  };

  const handleInsertCode = () => {
    insertSnippet('<code>', '</code>', 'inline_code()');
  };

  const handleInsertCodeBlock = () => {
    insertSnippet('<pre><code>\n', '\n</code></pre>\n\n', '// Code snippet or data specification\nconst metric = "Authority";');
  };

  const handleInsertCallout = () => {
    insertSnippet('<div class="p-4 sm:p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 my-6 backdrop-blur-md">\n  <strong class="text-white block mb-1">Key Takeaway:</strong>\n  <p class="text-sm text-cyan-100/90 leading-relaxed m-0">', '</p>\n</div>\n\n', 'Important medical search intelligence insight.');
  };

  const handleInsertDivider = () => {
    insertSnippet('\n<hr />\n\n');
  };

  const handleConfirmImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    let snippet = `<figure class="my-8">\n  <img src="${imageUrl.trim()}" alt="${(imageAlt || 'Article illustration').trim()}" class="w-full rounded-2xl shadow-xl" />\n`;
    if (imageCaption.trim()) {
      snippet += `  <figcaption class="text-center text-xs text-neutral-400 mt-2.5 italic">${imageCaption.trim()}</figcaption>\n`;
    }
    snippet += `</figure>\n\n`;

    insertSnippet(snippet);
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
        setImageAlt(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
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
    insertSnippet(`<a href="${linkUrl.trim()}" target="_blank" rel="noopener noreferrer">`, '</a>', display);
    setLinkUrl('');
    setLinkText('');
    setShowLinkModal(false);
  };

  return (
    <div className="border border-white/15 rounded-2xl bg-[#090d16] overflow-hidden flex flex-col">
      {/* Top Bar with Mode Toggles */}
      <div className="bg-[#050b1a] border-b border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Rich Article Builder
          </span>
          <span className="text-[10px] text-neutral-500 hidden sm:inline">Semantic HTML & Typographic Elements</span>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'editor' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer hidden md:block ${
              activeTab === 'split' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Split View
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'preview' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Live Preview
          </button>
        </div>
      </div>

      {/* Formatting Action Toolbar */}
      {activeTab !== 'preview' && (
        <div className="bg-black/50 border-b border-white/10 p-2 flex flex-wrap items-center gap-1.5 text-xs text-neutral-300">
          {/* Headings Group */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
            <span className="text-[10px] font-bold text-neutral-500 px-1 uppercase select-none">H</span>
            <button
              type="button"
              onClick={() => handleInsertHeading(1)}
              title="Heading 1"
              className="px-2 py-1 rounded hover:bg-white/10 font-bold text-white text-xs cursor-pointer"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => handleInsertHeading(2)}
              title="Heading 2"
              className="px-2 py-1 rounded hover:bg-white/10 font-bold text-white text-xs cursor-pointer"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => handleInsertHeading(3)}
              title="Heading 3"
              className="px-2 py-1 rounded hover:bg-white/10 font-bold text-cyan-400 text-xs cursor-pointer"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => handleInsertHeading(4)}
              title="Heading 4"
              className="px-1.5 py-1 rounded hover:bg-white/10 font-semibold text-neutral-300 text-xs cursor-pointer"
            >
              H4
            </button>
            <button
              type="button"
              onClick={() => handleInsertHeading(5)}
              title="Heading 5"
              className="px-1.5 py-1 rounded hover:bg-white/10 font-medium text-neutral-400 text-xs cursor-pointer"
            >
              H5
            </button>
            <button
              type="button"
              onClick={() => handleInsertHeading(6)}
              title="Heading 6"
              className="px-1.5 py-1 rounded hover:bg-white/10 font-medium text-neutral-500 text-xs cursor-pointer"
            >
              H6
            </button>
            <button
              type="button"
              onClick={handleInsertParagraph}
              title="Paragraph"
              className="px-2 py-1 rounded hover:bg-white/10 font-serif text-neutral-300 text-xs cursor-pointer"
            >
              P
            </button>
          </div>

          {/* Inline Text Styles */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
            <button
              type="button"
              onClick={handleInsertBold}
              title="Bold"
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 font-bold text-white cursor-pointer"
            >
              B
            </button>
            <button
              type="button"
              onClick={handleInsertItalic}
              title="Italic"
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 italic text-white cursor-pointer font-serif"
            >
              I
            </button>
            <button
              type="button"
              onClick={handleInsertUnderline}
              title="Underline"
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 underline text-white cursor-pointer"
            >
              U
            </button>
            <button
              type="button"
              onClick={handleInsertCode}
              title="Inline Code"
              className="px-2 py-1 rounded hover:bg-white/10 font-mono text-cyan-300 text-xs cursor-pointer"
            >
              &lt;/&gt;
            </button>
          </div>

          {/* Lists & Quotes */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
            <button
              type="button"
              onClick={handleInsertBulletList}
              title="Bullet List"
              className="px-2.5 py-1 rounded hover:bg-white/10 flex items-center gap-1 text-neutral-300 cursor-pointer"
            >
              <span>•</span>
              <span className="text-[11px]">List</span>
            </button>
            <button
              type="button"
              onClick={handleInsertNumberList}
              title="Numbered List"
              className="px-2.5 py-1 rounded hover:bg-white/10 flex items-center gap-1 text-neutral-300 cursor-pointer"
            >
              <span className="text-[11px] font-mono">1.</span>
              <span className="text-[11px]">List</span>
            </button>
            <button
              type="button"
              onClick={handleInsertQuote}
              title="Blockquote"
              className="px-2.5 py-1 rounded hover:bg-white/10 flex items-center gap-1 text-cyan-300 cursor-pointer"
            >
              <span className="text-sm font-serif">“</span>
              <span className="text-[11px]">Quote</span>
            </button>
          </div>

          {/* Media, Links & Blocks */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              title="Insert Image with Caption and Alt Text"
              className="px-2.5 py-1 rounded hover:bg-cyan-500/20 text-cyan-300 font-semibold flex items-center gap-1.5 cursor-pointer border border-cyan-500/20"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[11px]">Image + Caption</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const textarea = textareaRef.current;
                if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
                  setLinkText(textarea.value.substring(textarea.selectionStart, textarea.selectionEnd));
                }
                setShowLinkModal(true);
              }}
              title="Insert Link"
              className="px-2.5 py-1 rounded hover:bg-white/10 flex items-center gap-1 text-neutral-300 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-[11px]">Link</span>
            </button>

            <button
              type="button"
              onClick={handleInsertCallout}
              title="Callout Box"
              className="px-2 py-1 rounded hover:bg-white/10 text-emerald-400 text-[11px] cursor-pointer"
            >
              💡 Callout
            </button>

            <button
              type="button"
              onClick={handleInsertCodeBlock}
              title="Preformatted Code Block"
              className="px-2 py-1 rounded hover:bg-white/10 font-mono text-[11px] text-neutral-400 cursor-pointer"
            >
              Code Block
            </button>

            <button
              type="button"
              onClick={handleInsertDivider}
              title="Horizontal Divider"
              className="px-2 py-1 rounded hover:bg-white/10 text-[11px] text-neutral-400 cursor-pointer"
            >
              Divider (HR)
            </button>
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 min-h-[420px]">
        {/* Editor Area */}
        {(activeTab === 'editor' || activeTab === 'split') && (
          <div className={`p-3 flex flex-col ${activeTab === 'editor' ? 'col-span-full' : ''}`}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Start drafting your article... Use the toolbar above to insert H1-H6 headings, quotes, bullet points, links, and images with captions."
              rows={16}
              className="w-full h-full min-h-[380px] p-4 bg-black/60 border border-white/10 rounded-xl text-neutral-200 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-cyan-500/50 resize-y selection:bg-cyan-500 selection:text-black"
            />
            <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-neutral-500">
              <span>{value.length} characters</span>
              <span>Supports full HTML elements and semantic formatting</span>
            </div>
          </div>
        )}

        {/* Live Visual Preview Area */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div className={`p-4 md:p-6 overflow-y-auto bg-black/30 ${activeTab === 'preview' ? 'col-span-full' : ''}`}>
            <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 mb-4 pb-2 border-b border-white/10 flex items-center justify-between">
              <span>Live Website Preview</span>
              <span className="text-neutral-500 lowercase">article-prose container</span>
            </div>
            {value.trim() ? (
              <div
                className="article-prose"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-neutral-500">
                <svg className="w-8 h-8 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-xs">No article content yet. Draft on the left or use the toolbar above to insert text elements.</p>
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
              <p className="text-[10px] text-neutral-400 leading-tight">
                Automatically resizes and optimizes image into a lightweight WebP (~40KB) that publishes reliably to the live site.
              </p>
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
                Alt Text (SEO &amp; Accessibility) <span className="text-red-400">*</span>
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
