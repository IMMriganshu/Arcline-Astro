import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Type,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Unlink,
  Palette,
  CornerDownLeft,
  Code,
  Eye,
  Eraser,
  ChevronDown,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
  helperText?: string;
  className?: string;
  compact?: boolean;
}

const PRESET_COLORS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Light Gray', hex: '#E5E7EB' },
  { name: 'Muted Gray', hex: '#9CA3AF' },
  { name: 'seelutions Cyan', hex: '#00A0DC' },
  { name: 'Bright Cyan', hex: '#06B6D4' },
  { name: 'seelutions Green', hex: '#8DC541' },
  { name: 'Lime Green', hex: '#A3E635' },
  { name: 'Amber Gold', hex: '#F59E0B' },
  { name: 'Warm Orange', hex: '#F97316' },
  { name: 'Crimson Red', hex: '#EF4444' },
  { name: 'Royal Purple', hex: '#A855F7' },
];

const FONT_SIZES = [
  { label: 'Small (13px)', value: '13px' },
  { label: 'Normal (15px)', value: '15px' },
  { label: 'Medium (18px)', value: '18px' },
  { label: 'Large (22px)', value: '22px' },
  { label: 'XL (28px)', value: '28px' },
  { label: '2XL (34px)', value: '34px' },
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  label,
  placeholder = 'Write content here...',
  minHeight = '140px',
  helperText,
  className = '',
  compact = false,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'preview'>('visual');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [customColor, setCustomColor] = useState('#00A0DC');

  // Link modal state
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);

  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const isInternalChangeRef = useRef(false);

  // Sync external value to visual editor when not actively being edited internally
  useEffect(() => {
    if (editorRef.current && activeTab === 'visual') {
      if (editorRef.current.innerHTML !== value && !isInternalChangeRef.current) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isInternalChangeRef.current = false;
  }, [value, activeTab]);

  // Save selection before clicking toolbar popovers so formatting isn't lost
  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  }, []);

  const triggerChange = useCallback(() => {
    if (editorRef.current) {
      isInternalChangeRef.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  }, [onChange]);

  /**
   * Helper to execute execCommand in visual editor
   */
  const executeCmd = (command: string, arg?: string) => {
    if (activeTab !== 'visual') return;
    restoreSelection();
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, arg);
      triggerChange();
    }
  };

  /**
   * Insert raw snippet into code textarea
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
      const newCursor = start + prefix.length + textToWrap.length + suffix.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  // Apply Heading (h1-h6 or p)
  const applyHeading = (tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p') => {
    if (activeTab === 'code') {
      insertSnippetCode(`<${tag}>`, `</${tag}>`, `Heading`);
      setShowHeadingMenu(false);
      return;
    }
    restoreSelection();
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('formatBlock', false, tag.toUpperCase());
      triggerChange();
    }
    setShowHeadingMenu(false);
  };

  // Apply Font Size
  const applyFontSize = (sizePx: string) => {
    if (activeTab === 'code') {
      insertSnippetCode(`<span style="font-size: ${sizePx};">`, `</span>`, `Text`);
      setShowFontSizeMenu(false);
      return;
    }
    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = sizePx;
      try {
        span.appendChild(range.extractContents());
        range.insertNode(span);
        sel.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        sel.addRange(newRange);
      } catch {
        document.execCommand('fontSize', false, '4');
      }
      triggerChange();
    } else {
      executeCmd('fontSize', '4');
    }
    setShowFontSizeMenu(false);
  };

  // Apply Text Color
  const applyTextColor = (colorHex: string) => {
    if (activeTab === 'code') {
      insertSnippetCode(`<span style="color: ${colorHex};">`, `</span>`, `Colored text`);
      setShowColorPicker(false);
      return;
    }
    restoreSelection();
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('foreColor', false, colorHex);
      triggerChange();
    }
    setShowColorPicker(false);
  };

  // Insert Line Break
  const insertLineBreak = () => {
    if (activeTab === 'code') {
      insertSnippetCode('<br />\n', '', '');
      return;
    }
    restoreSelection();
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertLineBreak');
      triggerChange();
    }
  };

  // Open Link Modal
  const openLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) {
      setLinkText(sel.toString());
    } else {
      setLinkText('');
    }
    setLinkUrl('');
    setShowLinkModal(true);
  };

  // Apply Link
  const handleInsertLink = () => {
    if (!linkUrl.trim()) {
      setShowLinkModal(false);
      return;
    }
    const finalUrl = linkUrl.startsWith('http://') || linkUrl.startsWith('https://') || linkUrl.startsWith('#') || linkUrl.startsWith('/')
      ? linkUrl
      : `https://${linkUrl}`;

    if (activeTab === 'code') {
      const targetAttr = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      insertSnippetCode(`<a href="${finalUrl}"${targetAttr}>`, `</a>`, linkText || 'Link text');
      setShowLinkModal(false);
      return;
    }

    restoreSelection();
    if (editorRef.current) {
      editorRef.current.focus();
      if (linkText) {
        const linkHtml = `<a href="${finalUrl}" ${linkNewTab ? 'target="_blank" rel="noopener noreferrer"' : ''} style="color: #00A0DC; text-decoration: underline;">${linkText}</a>`;
        document.execCommand('insertHTML', false, linkHtml);
      } else {
        document.execCommand('createLink', false, finalUrl);
      }
      triggerChange();
    }
    setShowLinkModal(false);
  };

  return (
    <div className={`flex flex-col rounded-xl border border-white/15 bg-black/60 overflow-hidden shadow-inner ${className}`}>
      {/* Top Header / Field Label & Mode Switcher */}
      {label && (
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/10 bg-white/[0.02]">
          <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
            <span>{label}</span>
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                activeTab === 'visual'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Visual
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                activeTab === 'code'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Code className="w-3 h-3" />
              HTML
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                activeTab === 'preview'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              Preview
            </button>
          </div>
        </div>
      )}

      {/* Formatting Toolbar */}
      {activeTab !== 'preview' && (
        <div className="flex flex-wrap items-center gap-1 px-2.5 py-1.5 border-b border-white/10 bg-[#070e1f] text-neutral-300 text-xs select-none">
          {/* Headings Dropdown */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
                setShowHeadingMenu(!showHeadingMenu);
                setShowFontSizeMenu(false);
                setShowColorPicker(false);
              }}
              className="px-2 py-1 rounded hover:bg-white/10 text-white font-medium flex items-center gap-1 text-[11px] border border-white/10 bg-white/5"
              title="Heading & Paragraph Styles"
            >
              <span>Format</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showHeadingMenu && (
              <div
                className="absolute top-full left-0 mt-1 w-44 bg-[#0a152d] border border-white/20 rounded-lg shadow-2xl py-1 z-50 text-white backdrop-blur-xl"
                onMouseDown={(e) => e.preventDefault()}
              >
                <button
                  type="button"
                  onClick={() => applyHeading('p')}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center justify-between"
                >
                  <span>Paragraph</span>
                  <span className="text-[10px] text-neutral-400">&lt;p&gt;</span>
                </button>
                <div className="h-px bg-white/10 my-1"></div>
                <button
                  type="button"
                  onClick={() => applyHeading('h1')}
                  className="w-full text-left px-3 py-1.5 text-sm font-black hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center justify-between"
                >
                  <span>Heading 1</span>
                  <span className="text-[10px] text-neutral-400">&lt;h1&gt;</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyHeading('h2')}
                  className="w-full text-left px-3 py-1.5 text-sm font-bold hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center justify-between"
                >
                  <span>Heading 2</span>
                  <span className="text-[10px] text-neutral-400">&lt;h2&gt;</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyHeading('h3')}
                  className="w-full text-left px-3 py-1.5 text-xs font-bold hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center justify-between"
                >
                  <span>Heading 3</span>
                  <span className="text-[10px] text-neutral-400">&lt;h3&gt;</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyHeading('h4')}
                  className="w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center justify-between"
                >
                  <span>Heading 4</span>
                  <span className="text-[10px] text-neutral-400">&lt;h4&gt;</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyHeading('h5')}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center justify-between"
                >
                  <span>Heading 5</span>
                  <span className="text-[10px] text-neutral-400">&lt;h5&gt;</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyHeading('h6')}
                  className="w-full text-left px-3 py-1.5 text-xs font-normal hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center justify-between"
                >
                  <span>Heading 6</span>
                  <span className="text-[10px] text-neutral-400">&lt;h6&gt;</span>
                </button>
              </div>
            )}
          </div>

          {/* Font Size Dropdown */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
                setShowFontSizeMenu(!showFontSizeMenu);
                setShowHeadingMenu(false);
                setShowColorPicker(false);
              }}
              className="px-2 py-1 rounded hover:bg-white/10 text-white font-medium flex items-center gap-1 text-[11px] border border-white/10 bg-white/5"
              title="Font Size"
            >
              <Type className="w-3 h-3 text-cyan-400" />
              <span>Size</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showFontSizeMenu && (
              <div
                className="absolute top-full left-0 mt-1 w-36 bg-[#0a152d] border border-white/20 rounded-lg shadow-2xl py-1 z-50 text-white backdrop-blur-xl"
                onMouseDown={(e) => e.preventDefault()}
              >
                {FONT_SIZES.map((sz) => (
                  <button
                    key={sz.value}
                    type="button"
                    onClick={() => applyFontSize(sz.value)}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center justify-between"
                  >
                    <span>{sz.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-white/15 mx-0.5"></div>

          {/* Bold, Italic, Underline, Strikethrough */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (activeTab === 'code') {
                insertSnippetCode('<strong>', '</strong>', 'Bold text');
              } else {
                executeCmd('bold');
              }
            }}
            className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (activeTab === 'code') {
                insertSnippetCode('<em>', '</em>', 'Italic text');
              } else {
                executeCmd('italic');
              }
            }}
            className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (activeTab === 'code') {
                insertSnippetCode('<u>', '</u>', 'Underlined text');
              } else {
                executeCmd('underline');
              }
            }}
            className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (activeTab === 'code') {
                insertSnippetCode('<s>', '</s>', 'Strikethrough text');
              } else {
                executeCmd('strikeThrough');
              }
            }}
            className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-white/15 mx-0.5"></div>

          {/* Custom Text Color Picker Popover */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
                setShowColorPicker(!showColorPicker);
                setShowHeadingMenu(false);
                setShowFontSizeMenu(false);
              }}
              className="p-1.5 rounded hover:bg-white/10 hover:text-cyan-300 transition-colors flex items-center gap-1"
              title="Text Color"
            >
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            {showColorPicker && (
              <div
                className="absolute top-full left-0 mt-1 w-56 bg-[#0a152d] border border-white/20 rounded-xl shadow-2xl p-3 z-50 text-white backdrop-blur-xl"
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Select Text Color
                </div>
                <div className="grid grid-cols-6 gap-1.5 mb-3">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => applyTextColor(c.hex)}
                      title={c.name}
                      style={{ backgroundColor: c.hex }}
                      className="w-7 h-7 rounded-lg border border-white/20 hover:scale-110 transition-transform shadow-xs flex items-center justify-center"
                    />
                  ))}
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span className="text-[11px] font-mono text-neutral-300 uppercase">{customColor}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => applyTextColor(customColor)}
                    className="px-2 py-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[10px] rounded"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* New Line Break button */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              insertLineBreak();
            }}
            className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
            title="Insert Line Break (<br>)"
          >
            <CornerDownLeft className="w-3.5 h-3.5 text-neutral-400 hover:text-white" />
          </button>

          <div className="w-px h-4 bg-white/15 mx-0.5"></div>

          {/* Alignment */}
          {!compact && (
            <>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCmd('justifyLeft');
                }}
                className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCmd('justifyCenter');
                }}
                className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCmd('justifyRight');
                }}
                className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>

              <div className="w-px h-4 bg-white/15 mx-0.5"></div>
            </>
          )}

          {/* Lists & Quote */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (activeTab === 'code') {
                insertSnippetCode('<ul>\n  <li>', '</li>\n</ul>', 'List item');
              } else {
                executeCmd('insertUnorderedList');
              }
            }}
            className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
            title="Bulleted List"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (activeTab === 'code') {
                insertSnippetCode('<ol>\n  <li>', '</li>\n</ol>', 'Numbered item');
              } else {
                executeCmd('insertOrderedList');
              }
            }}
            className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          {!compact && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeTab === 'code') {
                  insertSnippetCode('<blockquote>', '</blockquote>', 'Quoted text');
                } else {
                  executeCmd('formatBlock', 'BLOCKQUOTE');
                }
              }}
              className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
              title="Quote Block"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="w-px h-4 bg-white/15 mx-0.5"></div>

          {/* Link Controls */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              openLinkModal();
            }}
            className="p-1.5 rounded hover:bg-white/10 hover:text-cyan-300 transition-colors"
            title="Insert / Edit Link"
          >
            <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (activeTab === 'code') {
                // simple unlink in code mode
              } else {
                executeCmd('unlink');
              }
            }}
            className="p-1.5 rounded hover:bg-white/10 hover:text-red-400 transition-colors"
            title="Remove Link"
          >
            <Unlink className="w-3.5 h-3.5" />
          </button>

          {/* Clear Formatting */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCmd('removeFormat');
            }}
            className="p-1.5 rounded hover:bg-white/10 hover:text-amber-300 transition-colors ml-auto"
            title="Clear Formatting"
          >
            <Eraser className="w-3.5 h-3.5 text-neutral-400 hover:text-amber-300" />
          </button>
        </div>
      )}

      {/* Editor Body */}
      <div className="relative">
        {activeTab === 'visual' && (
          <div
            ref={editorRef}
            contentEditable
            onInput={triggerChange}
            onBlur={triggerChange}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            style={{ minHeight }}
            data-placeholder={placeholder}
            className="p-3.5 text-white text-xs sm:text-sm leading-relaxed outline-hidden focus:outline-hidden overflow-y-auto max-h-[460px] prose prose-invert prose-p:my-1.5 prose-headings:my-2 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-cyan-400 prose-a:underline"
          />
        )}

        {activeTab === 'code' && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight }}
            placeholder="Edit raw HTML code..."
            className="w-full p-3.5 bg-black/80 font-mono text-xs text-cyan-300 leading-relaxed outline-hidden border-0 focus:ring-0 resize-y max-h-[460px]"
          />
        )}

        {activeTab === 'preview' && (
          <div
            style={{ minHeight }}
            className="p-4 bg-white/5 text-neutral-100 text-xs sm:text-sm leading-relaxed overflow-y-auto max-h-[460px] border-t border-white/10 prose prose-invert prose-headings:text-white prose-p:my-2 prose-a:text-cyan-400"
            dangerouslySetInnerHTML={{ __html: value || '<em class="text-neutral-500">No content entered yet.</em>' }}
          />
        )}
      </div>

      {/* Helper text footer */}
      {helperText && (
        <div className="px-3 py-1.5 bg-white/[0.02] border-t border-white/5 text-[10px] text-neutral-400 flex items-center justify-between">
          <span>{helperText}</span>
          <span className="font-mono text-[9px] text-neutral-500">HTML Enabled</span>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0a152d] border border-white/20 rounded-2xl shadow-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold font-urbanist text-white flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-cyan-400" />
                Insert Hyperlink
              </h4>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-[10px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com or /#contact"
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white text-xs font-mono"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Link Anchor Text (Optional)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Schedule Surgical Consultation"
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white text-xs"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={linkNewTab}
                  onChange={(e) => setLinkNewTab(e.target.checked)}
                  className="rounded border-white/20 bg-black/50 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Open link in new browser tab</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </label>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs rounded-lg shadow-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
